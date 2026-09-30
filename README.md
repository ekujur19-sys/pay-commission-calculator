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
| `8th-pay-commission.html`, `fitment-factor.html`, `da-hike-history.html`, `hra-city-classification.html`, `arrears-section-89.html` | Guide articles |
| `site.css` | Shared style for the About, Contact, FAQ and guide pages |
| `404.html` | "Page not found" page |
| `sitemap.xml` | Page list for Google Search Console |
| `robots.txt` | Tells search engines they may index the site and where the sitemap is |
| `CNAME` | Tells GitHub Pages the site's domain is `8thpay.in` (don't delete) |

## Ads

Ads are **switched off** (`const ADS_ON = false;` near the top of the script in `index.html`), so visitors see no empty ad boxes or placeholder video. To turn them on: paste your ad network code into the ad slots (search for `Your ad here`), then set `ADS_ON = true`.

## Keeping it up to date

- Update DA, HRA and tax rates when the Government announces changes. The rate lists are near the top of the script in `index.html`.
- Change "Rates last reviewed" in the disclaimer when you do.

## Hosting on GitHub Pages

Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`**, custom domain `8thpay.in`, **Enforce HTTPS** on.

DNS at GoDaddy: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` for `www` → `ekujur19-sys.github.io`.

## Disclaimer

Estimates only. Not an official Government tool. See the disclaimer on the site and `terms.html`.
