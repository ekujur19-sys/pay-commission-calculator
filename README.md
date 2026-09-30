# Pay Commission Calculator

A free salary calculator for Indian Central Government employees and teachers.

- **7th Pay Commission:** monthly pay from Pay Matrix level (including Academic Grade Pay), basic pay, DA, HRA by city, transport allowance, other allowances and deductions, NPS/UPS and income tax (new and old regime, with a detailed breakdown).
- **8th Pay Commission (estimates):** projected pay using a chosen fitment factor, and an **Arrears** calculator with a chosen implementation month, income tax on arrears and Section 89 relief.

All calculations run in the visitor's browser. The site asks for no personal details.

## Files

| File | What it is |
|---|---|
| `index.html` | The calculator (single page, no build step) |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Use |

## Before going live

- Fill in the gold `[placeholders]` in `privacy.html` and `terms.html` (website email, website address, hosting provider, analytics).
- Replace the ad placeholders in `index.html` with your ad network code.
- Update DA, HRA and tax rates when the Government announces changes. The rate lists are near the top of the script in `index.html`.

## Hosting on GitHub Pages

Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`**. The site appears at `https://<your-username>.github.io/<repository-name>/`.

## Disclaimer

Estimates only. Not an official Government tool. See the disclaimer on the site and `terms.html`.
