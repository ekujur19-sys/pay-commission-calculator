/* =====================================================================================
   Google AdSense set-up for every page of 8thpay.in
   -------------------------------------------------------------------------------------
   HOW ADS WORK ON THIS SITE
   1. Auto ads (switched on in your AdSense account) let Google place the bottom "anchor"
      ad on phones and occasional full-screen ads between pages. Nothing to do here.
   2. In-page ad spaces: every <aside class="ad-slot" data-ad="…"> on the pages is an
      ad space. This file fills each one with a responsive AdSense display unit.

   TO SWITCH ADS ON
   a. Put your publisher ID below, e.g. "ca-pub-1234567890123456".
   b. In AdSense, create display ad units (Ads → By ad unit → Display ads → Responsive)
      and paste each unit's "data-ad-slot" number next to its name below.
      Spaces left empty ("") stay hidden; Auto ads may still place ads elsewhere.
   Until the publisher ID is filled in, every ad space stays hidden and nothing loads.
   ===================================================================================== */
const ADSENSE_CLIENT = "";          // "ca-pub-XXXXXXXXXXXXXXXX"
const AD_UNITS = {
  "calc-mid":    "",   // calculator: between the form and the results (phones only)
  "calc-after":  "",   // calculator: below the calculator
  "calc-end":    "",   // calculator: above the disclaimer
  "article-top": "",   // guides and FAQ: after the introduction
  "article-mid": "",   // guides: in the middle of the article
  "article-end": ""    // guides: before the "open the calculator" box
};

(function () {
  if (!/^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT)) return;           // not set up yet: leave every space hidden

  // Load the AdSense library once (skipped if the page already has it in <head>)
  if (!document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
    const s = document.createElement("script");
    s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
    document.head.appendChild(s);
  }

  // Fill each visible ad space that has a unit number
  document.querySelectorAll(".ad-slot[data-ad]").forEach(box => {
    const unit = AD_UNITS[box.dataset.ad];
    if (!unit) return;
    box.hidden = false;
    if (getComputedStyle(box).display === "none") { box.hidden = true; return; }   // e.g. a phone-only space on a computer
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", ADSENSE_CLIENT);
    ins.setAttribute("data-ad-slot", unit);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    box.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { box.hidden = true; }
  });

  // Keep the calculator's result bar above AdSense's bottom anchor ad on phones
  const root = document.documentElement;
  const fitAnchor = () => {
    const a = document.querySelector('ins.adsbygoogle[data-anchor-status="displayed"]');
    const r = a && a.getBoundingClientRect();
    root.style.setProperty("--bot-h", r && r.height && r.bottom >= innerHeight - 2 ? Math.round(r.height) + "px" : "0px");
  };
  new MutationObserver(fitAnchor).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-anchor-status", "style"] });
  addEventListener("resize", fitAnchor);
})();
