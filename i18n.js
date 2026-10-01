/* English / Hindi switch for the calculator pages.
   - Elements with data-hi="…" get that Hindi markup; data-hi-ph / data-hi-aria / data-hi-title do the same for attributes.
   - If the page loads a dictionary (window.I18N_DICT, window.I18N_RULES, see hi.js), every visible text is looked up there,
     including text the calculator writes later (a MutationObserver translates it as it appears).
   - Pages can also ask I18N.L("English", "हिंदी") and listen for the "langchange" event to redraw.
   The choice is remembered in this browser only (localStorage), so the next calculator page opens in the same language. */
(function () {
  const D = () => window.I18N_DICT || {}, R = () => window.I18N_RULES || [];
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"]);
  const ATTRS = ["placeholder", "aria-label", "title", "label"];
  let lang = "en", observer = null;
  try { lang = localStorage.getItem("lang") === "hi" ? "hi" : "en"; } catch (e) {}
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "hi" || q === "en") lang = q;

  /* Translate one string: exact dictionary match first, then the pattern rules. Returns null if nothing matches. */
  function tr(s) {
    const key = s.replace(/\s+/g, " ").trim();
    if (!key) return null;
    const d = D();
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    for (const [re, fn] of R()) {
      const m = key.match(re);
      if (m) return typeof fn === "function" ? fn(m, x => { const r = tr(x); return r === null ? x : r; }) : key.replace(re, fn);
    }
    return null;
  }
  function keepSpace(orig, val) {
    const lead = orig.match(/^\s*/)[0], trail = orig.match(/\s*$/)[0];
    return (lead ? " " : "") + val + (trail && val ? " " : "");
  }
  function doText(n) {
    const p = n.parentNode;
    if (!p || SKIP.has(p.nodeName) || (p.closest && p.closest("[data-noi18n],[data-hi]"))) return;
    if (n._t !== undefined && n.data === n._t) return;
    const v = tr(n.data);
    if (v === null) return;
    n._en = n.data; n._t = keepSpace(n.data, v); n.data = n._t;
  }
  function doAttrs(el) {
    if (el.closest && el.closest("[data-noi18n]")) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute || !el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a); el._ta = el._ta || {};
      if (el._ta[a] && el._ta[a].t === cur) continue;
      const v = tr(cur); if (v === null) continue;
      el._ta[a] = { en: cur, t: v }; el.setAttribute(a, v);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1 || SKIP.has(root.nodeName)) return;
    doAttrs(root);
    const it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n; while ((n = it.nextNode())) n.nodeType === 3 ? doText(n) : doAttrs(n);
  }
  function revertAll() {
    const it = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = it.nextNode())) {
      if (n.nodeType === 3) { if (n._en !== undefined && n.data === n._t) n.data = n._en; delete n._en; delete n._t; }
      else if (n._ta) { for (const a in n._ta) if (n.getAttribute(a) === n._ta[a].t) n.setAttribute(a, n._ta[a].en); delete n._ta; }
    }
  }
  /* data-hi markup swaps */
  function swapMarked(toHi) {
    document.querySelectorAll("[data-hi]").forEach(el => {
      if (toHi) { if (el._enHTML === undefined) el._enHTML = el.innerHTML; el.innerHTML = el.getAttribute("data-hi"); }
      else if (el._enHTML !== undefined) { el.innerHTML = el._enHTML; }
    });
    [["data-hi-ph", "placeholder"], ["data-hi-aria", "aria-label"], ["data-hi-title", "title"]].forEach(([src, dst]) =>
      document.querySelectorAll(`[${src}]`).forEach(el => {
        if (toHi) { if (el._enAttr === undefined) el._enAttr = el.getAttribute(dst); el.setAttribute(dst, el.getAttribute(src)); }
        else if (el._enAttr !== undefined) el.setAttribute(dst, el._enAttr);
      }));
  }
  function font() {
    if (document.getElementById("devFont")) return;
    const l = document.createElement("link"); l.id = "devFont"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }
  /* A page can name its dictionary file with <meta name="i18n-dict" content="hi.js">; it is only downloaded when Hindi is chosen */
  let dictLoading = null;
  function needDict() {
    const m = document.querySelector('meta[name="i18n-dict"]');
    if (!m || window.I18N_DICT) return null;
    return dictLoading || (dictLoading = new Promise(res => {
      const s = document.createElement("script"); s.src = m.content; s.onload = s.onerror = () => { window.I18N_DICT = window.I18N_DICT || {}; res(); }; document.head.appendChild(s);
    }));
  }
  function apply() {
    const hi = lang === "hi";
    const wait = hi && needDict();
    if (wait) { wait.then(apply); return; }
    document.documentElement.lang = hi ? "hi" : "en";
    swapMarked(hi);
    if (hi) {
      font();
      if (Object.keys(D()).length || R().length) {
        walk(document.body);
        if (!observer) {
          observer = new MutationObserver(recs => {
            for (const r of recs) {
              if (r.type === "characterData") doText(r.target);
              else if (r.type === "attributes") doAttrs(r.target);
              else r.addedNodes.forEach(walk);
            }
          });
          observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
        }
      }
    } else {
      if (observer) { observer.disconnect(); observer = null; }
      revertAll();
    }
    const b = document.getElementById("langBtn");
    if (b) { b.textContent = hi ? "English" : "हिंदी"; b.setAttribute("aria-label", hi ? "Switch to English" : "हिंदी में देखें"); b.lang = hi ? "en" : "hi"; }
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  function set(l) {
    lang = l === "hi" ? "hi" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    apply();
  }
  window.I18N = {
    get lang() { return lang; }, set, t: s => (lang === "hi" ? (tr(s) ?? s) : s),
    L: (en, hi) => (lang === "hi" ? hi : en)
  };
  function init() {
    const spot = document.querySelector("[data-lang-spot]") || document.querySelector(".topnav, .nav");
    if (spot && !document.getElementById("langBtn")) {
      const b = document.createElement("button"); b.type = "button"; b.id = "langBtn"; b.className = "langbtn";
      b.addEventListener("click", () => set(lang === "hi" ? "en" : "hi"));
      spot.appendChild(b);
    }
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
