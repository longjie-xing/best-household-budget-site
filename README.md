# Maple Street Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/longjie-xing/best-household-budget-site/rank.svg)](https://make.fun/leaderboard/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/longjie-xing/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A working household budget site for a fictional family — the Alvarez household of Portland, Oregon — built for make.fun's best household budget site bounty.

## What it does

- **Overview** — November income, spending and savings at a glance, a canvas donut chart of where the money went, savings-goal progress and recent transactions.
- **Transactions** — the full ledger for September–November 2026 (100+ dated transactions with real merchants and categories), filterable by month and category, with an add-transaction form that really adds a row and a delete button on every row.
- **Budget planner** — per-category monthly budget vs. actual spending bars, with editable budget amounts.
- **Savings goals** — four goals with progress bars and an add-money control that moves the bar.
- **Reports** — a canvas bar chart of income vs. spending across the three months, category share for November and the top merchants.

Everything runs from static files under `app/` — no build step, no network requests, no frameworks. Charts are drawn on native canvas. All figures are fictional and written for this demo household.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Then open <http://localhost:8080> in a browser. Pages are hash-routed (`#/overview`, `#/transactions`, `#/budget`, `#/goals`, `#/reports`).

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — page shell, navigation and script tags
- `app/style.css` — the whole look: pine green, cream paper, amber accent
- `app/data.js` — household figures, budgets, goals and transactions
- `app/views.js` — hash routing and rendering of the five pages
- `app/charts.js` — native canvas donut and bar charts
- `main.ts` — entrypoint: copies the site and builds the dossier
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `screenshots/` — real renders of the running site
