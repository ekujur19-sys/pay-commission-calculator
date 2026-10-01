/* Share buttons: WhatsApp, Telegram, Facebook and Copy link.
   Placed in any element with data-share; otherwise added at the end of <main>, just before the call-to-action box.
   Nothing is sent anywhere unless the visitor clicks a button, which simply opens that app's share page. */
(function () {
  const ICON = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"/></svg>',
    tg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.3l-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3Z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>'
  };
  const hi = () => document.documentElement.lang === "hi";
  const T = { share: ["Share:", "शेयर करें:"], copy: ["Copy link", "लिंक कॉपी करें"], copied: ["Link copied", "लिंक कॉपी हो गया"] };
  const t = k => T[k][hi() ? 1 : 0];

  /* Build the buttons for a given address and message. Used for this page and for the calculator's "share result".
     opts.onWhatsApp(event) replaces the plain WhatsApp link (the calculator sends a postcard image);
     opts.copyUrl / opts.copyLabel let "Copy link" copy a different address (the link to your own figures). */
  function bar(getUrl, getText, label, opts = {}) {
    const el = document.createElement("div"); el.className = "sharebar";
    el.innerHTML = `<span data-k="share"></span>
      <a class="wa" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
      <a class="tg" target="_blank" rel="noopener">${ICON.tg}Telegram</a>
      <a class="fb" target="_blank" rel="noopener">${ICON.fb}Facebook</a>
      <button type="button" class="cp">${ICON.link}<span data-k="copy"></span></button>`;
    const relabel = () => {
      el.querySelector('[data-k="share"]').textContent = label ? label() : t("share");
      el.querySelector('[data-k="copy"]').textContent = opts.copyLabel ? opts.copyLabel() : t("copy");
    };
    if (opts.onWhatsApp) el.querySelector(".wa").addEventListener("click", e => { e.preventDefault(); opts.onWhatsApp(e); });
    // Addresses are worked out at click time so they always carry the latest page state
    const set = () => {
      const u = encodeURIComponent(getUrl()), msg = encodeURIComponent(getText());
      el.querySelector(".wa").href = `https://wa.me/?text=${msg}%20${u}`;
      el.querySelector(".tg").href = `https://t.me/share/url?url=${u}&text=${msg}`;
      el.querySelector(".fb").href = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    };
    el.addEventListener("pointerdown", set); el.addEventListener("focusin", set); el.addEventListener("click", set, true);
    el.querySelector(".cp").addEventListener("click", async () => {
      const url = opts.copyUrl ? opts.copyUrl() : getUrl(), s = el.querySelector('[data-k="copy"]');
      try { await navigator.clipboard.writeText(url); }
      catch (e) { const ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove(); }
      s.textContent = t("copied"); setTimeout(relabel, 1800);
    });
    relabel(); set();
    document.addEventListener("langchange", relabel);
    return el;
  }
  window.ShareBar = bar;

  // Page share bar (pages can opt out with data-noshare on <body>)
  function init() {
    if (document.body.hasAttribute("data-noshare")) return;
    const pageUrl = () => (document.querySelector('link[rel="canonical"]') || {}).href || location.href.split("#")[0];
    const text = () => document.title;
    const spot = document.querySelector("[data-share]");
    const el = bar(pageUrl, text);
    if (spot) spot.appendChild(el);
    else { const main = document.querySelector("main"); if (!main) return; const cta = main.querySelector(".cta"); main.insertBefore(el, cta || null); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  /* "Calculators" dropdown: only one open at a time, closes on an outside click, Escape or choosing a link,
     and is nudged sideways so it never runs off the screen on small phones */
  function dropdowns() {
    const all = [...document.querySelectorAll("details.dd")];
    all.forEach(dd => {
      const menu = dd.querySelector(".dd-menu");
      dd.addEventListener("toggle", () => {
        if (!dd.open) return;
        all.forEach(o => { if (o !== dd) o.open = false; });
        menu.style.left = "0px";
        const r = menu.getBoundingClientRect(), pad = 12;
        if (r.right > innerWidth - pad) menu.style.left = (innerWidth - pad - r.right) + "px";
        else if (r.left < pad) menu.style.left = (pad - r.left) + "px";
      });
      menu.addEventListener("click", e => { if (e.target.closest("a")) dd.open = false; });
    });
    document.addEventListener("click", e => all.forEach(dd => { if (dd.open && !dd.contains(e.target)) dd.open = false; }));
    document.addEventListener("keydown", e => { if (e.key === "Escape") all.forEach(dd => { if (dd.open) { dd.open = false; dd.querySelector("summary").focus(); } }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", dropdowns); else dropdowns();
})();
