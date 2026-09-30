# Pay Commission Calculator

A free salary calculator for Indian Central Government employees and teachers.

- **7th Pay Commission:** monthly pay from Pay Matrix level (including Academic Grade Pay), basic pay, DA, HRA by city, transport allowance, other allowances and deductions, NPS/UPS and income tax (new and old regime, with a detailed breakdown).
- **8th Pay Commission (estimates):** projected pay using a chosen fitment factor, and an **Arrears** calculator with a chosen implementation month, income tax on arrears and Section 89 relief.

All calculations run in the visitor's browser. The site asks for no personal details.

Live at **https://8thpay.in** · Run by NE Media · Contact: nemedia909@gmail.com

## Files

| File | What it is |
|---|---|
| `index.html` | The calculator (single page, no build step) |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Use |
| `about.html`, `contact.html`, `faq.html` | About, Contact and FAQ pages |
| `guides.html` | List of guides |
| `news.html` | 8th Pay Commission latest news (update by hand when there's news; change "Last updated") |
| `sources.html` | Official sources behind the calculator's rules and rates |
| `8th-pay-commission.html`, `fitment-factor.html`, `da-hike-history.html`, `hra-city-classification.html`, `arrears-section-89.html` | Guide articles |
| `site.css` | Shared style for the About, Contact, FAQ and guide pages |
| `ads.js` | All AdSense settings for every page |
| `404.html` | "Page not found" page |
| `sitemap.xml` | Page list for Google Search Console |
| `robots.txt` | Tells search engines they may index the site and where the sitemap is |
| `CNAME` | Tells GitHub Pages the site's domain is `8thpay.in` (don't delete) |

## Ads

All ad settings live in **`ads.js`**, which every page loads.

- **Auto ads** (switched on in the AdSense account) place the bottom anchor ad on phones and occasional full-screen ads between pages.
- **In-page ad spaces** (`<aside class="ad-slot" data-ad="…">`) sit in the page flow, away from buttons: 3 on the calculator (one phone-only) and up to 3 per guide/FAQ page. None on About, Contact or the legal pages.

To switch ads on, open `ads.js` and fill in `ADSENSE_CLIENT` (your `ca-pub-…` ID) and the unit numbers in `AD_UNITS` (from AdSense → Ads → By ad unit → Display ads). Until then every ad space stays hidden and no ad code loads. Also add `ads.txt` with your publisher ID.

## Keeping it up to date

- Update DA, HRA and tax rates when the Government announces changes. The rate lists are near the top of the script in `index.html`.
- Change "Rates last reviewed" in the disclaimer when you do.

## Hosting on GitHub Pages

Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`**, custom domain `8thpay.in`, **Enforce HTTPS** on.

DNS at GoDaddy: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` for `www` → `ekujur19-sys.github.io`.

## Disclaimer

Estimates only. Not an official Government tool. See the disclaimer on the site and `terms.html`.
