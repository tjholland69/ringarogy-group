# Ringarogy Group

The website for Ringarogy Group, an independent LLC: **[ringarogy.com](https://ringarogy.com)**.

A single page with the company thesis ("Masters of none. Interested in everything.") and links to its works in progress:

| Project | Site |
|:--|:--|
| Parlay Conch | [parlayconch.com](https://parlayconch.com) |
| Parallel Cals | [parallel-cals.com](https://parallel-cals.com) |
| Enume Tracker | [enume-tracker.com](https://enume-tracker.com) |
| NDAZ | [ndaz.app](https://ndaz.app) |

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with `output: "export"`: builds to plain static files, no server
- React 19, TypeScript, Tailwind CSS 4
- Hosted on **GitHub Pages**, with DNS on Cloudflare (DNS only, not proxied)

## Run locally

Requires Node 22.13 or newer (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev      # http://localhost:3000
```

## Build and lint

```bash
npm run build    # static site in out/
npm run lint
npx serve out    # preview the built site
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages. To redeploy without a commit, run **Deploy to GitHub Pages** from the Actions tab.

The custom domain comes from `public/CNAME` and the repository's **Settings → Pages**. The DNS A records for `ringarogy.com` point at GitHub Pages and must stay **DNS only** (grey cloud) in Cloudflare, or GitHub can't issue the HTTPS certificate.

## Where things live

| Path | What it is |
|:--|:--|
| `app/page.tsx` | The page: thesis, project list, footer |
| `app/layout.tsx` | Title, description, favicon, and link-preview (Open Graph / Twitter) metadata |
| `app/globals.css` | All styling |
| `public/og.png` | Link-preview image |
| `public/CNAME` | Custom domain for GitHub Pages |

To add a project, append it to the `projects` list at the top of `app/page.tsx`.
