/* HRA and TA city finder (hra-ta-city-finder.html). Needs cities.js first.
   - Fills <div id="cityFinder"></div> with the search box, the city's class and all its rates, and an optional pay calculation.
   - Filters the rows of <table id="cityTable"> (each row has data-name) as you type.
   Update FINDER_DA with each DA order. */
(function () {
  const box = document.getElementById("cityFinder");
  if (!box || typeof findCity !== "function") return;

  const FINDER_DA = 60;
  const LEVELS = [["1",18000],["2",19900],["3",21700],["4",25500],["5",29200],["6",35400],["7",44900],["8",47600],["9",53100],["10",56100],
    ["11",67700],["12",78800],["13",123100],["13A",131100],["14",144200],["15",182200],["16",205400],["17",225000],["18",250000]];
  const HRA = { X: [30, 5400], Y: [20, 3600], Z: [10, 1800] };
  const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const withDA = n => n * (1 + FINDER_DA / 100);

  box.innerHTML = `
  <div class="finder-search">
    <label for="cfCity">Search your city or town</label>
    <input id="cfCity" type="search" list="cfCities" placeholder="Type a city, e.g. Lucknow, Pune, Kochi" autocomplete="off">
    <datalist id="cfCities">${CITY_NAMES.map(c => `<option value="${esc(c)}"></option>`).join("")}</datalist>
  </div>
  <div id="cfOut" aria-live="polite"></div>
  <div class="tool finder-pay" id="cfPay" hidden>
    <form autocomplete="off" onsubmit="return false">
      <b class="finder-h">Work out your amounts</b>
      <div class="row2">
        <label for="cfLevel">Pay level
          <select id="cfLevel">${LEVELS.map(([l]) => `<option value="${l}"${l === "6" ? " selected" : ""}>Level ${l}</option>`).join("")}</select></label>
        <label for="cfBasic">Basic pay
          <input id="cfBasic" type="number" min="18000" max="250000" step="100" value="35400" inputmode="numeric"></label>
      </div>
      <small class="hint">DA is taken as ${FINDER_DA}%, the rate from 1 January 2026.</small>
    </form>
    <div class="out" id="cfMine"></div>
  </div>`;

  const $ = id => document.getElementById(id);
  const rows = [...document.querySelectorAll("#cityTable tbody tr")];

  function taBase(level, basic, high) {
    const n = parseFloat(level);
    if (n >= 9) return high ? 7200 : 3600;
    if (n >= 3 || basic >= 24200) return high ? 3600 : 1800;
    return high ? 1350 : 900;
  }

  let city = null;   // { name, cls, high, tax50, listed }

  function lookup() {
    const q = $("cfCity").value.trim(), ql = q.toLowerCase();
    // Filter the full list
    let shown = 0;
    rows.forEach(r => { const hit = !ql || r.dataset.name.includes(ql); r.hidden = !hit; if (hit) shown++; });
    const none = $("cityNone"); if (none) none.hidden = shown > 0;

    if (!q) { city = null; $("cfOut").innerHTML = ""; $("cfPay").hidden = true; return; }
    const hit = findCity(q);
    if (!hit && (q.length < 3 || CITY_NAMES.some(c => c.toLowerCase().includes(ql)))) {
      city = null; $("cfPay").hidden = true;
      $("cfOut").innerHTML = `<p class="note">Keep typing and pick your city from the list.</p>`; return;
    }
    const name = hit ? hit.name : q, key = name.toLowerCase();
    city = { name, cls: hit ? hit.cls : "Z", high: !!hit && TA_HIGH.has(key), tax50: !!hit && HRA_50_CITIES.includes(key), listed: !!hit };
    const [pct, min] = HRA[city.cls], h = city.high;
    $("cfOut").innerHTML = `
      <div class="finder-card">
        <div class="finder-top">
          <div><span class="finder-city">${esc(name)}</span>
            <span class="finder-sub">${city.listed ? "" : "Not on the X or Y list · "}HRA class</span></div>
          <span class="cls cls-${city.cls}">${city.cls}</span>
        </div>
        <div class="finder-tags">
          <span class="tag-pill">HRA ${pct}% of basic pay</span>
          <span class="tag-pill${h ? " on" : ""}">${h ? "Higher transport allowance city" : "Transport allowance: other places rate"}</span>
          ${city.tax50 ? `<span class="tag-pill">50% HRA tax limit city</span>` : ""}
        </div>
      </div>
      <h3>All rates for ${esc(name)}</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Allowance</th><th class="num">Rate</th><th class="num">With ${FINDER_DA}% DA</th></tr></thead>
        <tbody>
          <tr><td>House Rent Allowance (Class ${city.cls})</td><td class="num">${pct}% of basic pay</td><td class="num">minimum ${inr(min)}</td></tr>
          <tr><td>Transport allowance, Level 9 and above</td><td class="num">${inr(h ? 7200 : 3600)}</td><td class="num">${inr(withDA(h ? 7200 : 3600))}</td></tr>
          <tr><td>Transport allowance, Levels 3 to 8 <small>(and Levels 1–2 with basic pay ₹24,200 or more)</small></td><td class="num">${inr(h ? 3600 : 1800)}</td><td class="num">${inr(withDA(h ? 3600 : 1800))}</td></tr>
          <tr><td>Transport allowance, Levels 1 and 2</td><td class="num">${inr(h ? 1350 : 900)}</td><td class="num">${inr(withDA(h ? 1350 : 900))}</td></tr>
          <tr><td>Level 14+, in place of an official car</td><td class="num">${inr(15750)}</td><td class="num">${inr(withDA(15750))}</td></tr>
          <tr><td>Old tax regime: HRA exemption limit</td><td class="num" colspan="2">${city.tax50 ? "50%" : "40%"} of basic pay + DA</td></tr>
        </tbody>
      </table></div>
      ${city.listed ? "" : `<p class="hint">Places not on the X or Y list are Class Z. Satellite towns can be part of a bigger city's urban area; your office's pay records decide.</p>`}`;
    $("cfPay").hidden = false;
    mine();
  }

  function mine() {
    if (!city) return;
    const level = $("cfLevel").value, basic = Math.max(0, +$("cfBasic").value || 0);
    const [pct, min] = HRA[city.cls], hraCalc = basic * pct / 100, hra = Math.max(hraCalc, min);
    const tb = taBase(level, basic, city.high), ta = withDA(tb);
    $("cfMine").innerHTML = `
      <div class="big"><span>HRA + transport allowance a month</span><b>${inr(hra + ta)}</b>
        <small>${esc(city.name)} · Level ${esc(level)} · basic pay ${inr(basic)}</small></div>
      <div class="table-wrap"><table><tbody>
        <tr><td>HRA (${pct}% of ${inr(basic)})</td><td class="num">${inr(hra)}${hraCalc < min ? " (minimum)" : ""}</td></tr>
        <tr><td>Transport allowance (${inr(tb)} + ${FINDER_DA}% DA)</td><td class="num">${inr(ta)}</td></tr>
        <tr class="total"><td>Total</td><td class="num">${inr(hra + ta)}</td></tr>
      </tbody></table></div>
      <p class="hint">See your full take-home pay, with DA, NPS and income tax, in the <a href="./#7th">salary calculator</a>.</p>`;
  }

  $("cfLevel").addEventListener("change", () => { $("cfBasic").value = LEVELS.find(([l]) => l === $("cfLevel").value)[1]; mine(); });
  $("cfBasic").addEventListener("input", mine);
  ["input", "change"].forEach(ev => $("cfCity").addEventListener(ev, lookup));

  // Clicking a city in the full list looks it up
  document.querySelectorAll("#cityTable [data-pick]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); $("cfCity").value = a.dataset.pick; lookup(); $("cfCity").scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // Optional link parameters: ?city=Lucknow&level=7&basic=47600
  const p = new URLSearchParams(location.search);
  if (p.has("level") && LEVELS.some(([l]) => l === p.get("level"))) { $("cfLevel").value = p.get("level"); $("cfBasic").value = LEVELS.find(([l]) => l === p.get("level"))[1]; }
  if (+p.get("basic")) $("cfBasic").value = +p.get("basic");
  if (p.has("city")) $("cfCity").value = p.get("city");
  lookup();
})();
