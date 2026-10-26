# Fettle

A light touch fitness and food helper, as in "in fine fettle". Installable to the phone home screen as a Progressive Web App, with all data kept on the device.

See [CLAUDE.md](CLAUDE.md) for the full brief and build order.

## Status

Phase 1 done: project setup, PWA (installable, works offline), Netlify config, on-device database (IndexedDB via Dexie) and the navigation shell (Train, Food, Progress, Settings).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type check and production build into dist/
npm run preview  # serve the production build (service worker active)
```

## Deploy to Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick the `david-tunstall/wellness` GitHub repo.
2. Site name: `fettle`. Netlify reads build settings from `netlify.toml` (build `npm run build`, publish `dist`, functions in `netlify/functions`), so leave the defaults.
3. Set the production branch to `main` and deploy.
4. On the iPhone, open the site in Safari, tap **Share → Add to Home Screen**. On Android Chrome, use **Install app** from the menu.

Environment variables for later phases (Site configuration → Environment variables):

| Variable | Phase | Used for |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | 6 | Photo calorie estimates (Netlify Function only) |
| `HEALTH_SYNC_TOKEN` | 8 | iPhone Shortcut health sync |

## Tech

React, Vite, TypeScript, Tailwind CSS, vite-plugin-pwa, Dexie. Hosted on Netlify.
