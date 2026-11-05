# Ashna Mary — Portfolio

Next.js 16 (App Router) + React 19 + TypeScript portfolio for Ashna Mary, 2D designer
(event stages, entry arches, registration desks, branding, 3D/2D animation).

```bash
npm install
npm run dev      # local dev server (http://localhost:3000)
npm run build    # production build (prerenders every page)
npm run start    # serve the production build
npm run lint
npm run format   # prettier
```

The earlier Vue 3 version of this site is kept on the `vue-portfolio` branch.

## Where things live

| What | File |
| --- | --- |
| Name, bio, email, CV link, social links, toolkit apps | `src/data/portfolio.ts` |
| ArtStation animations (3D & 2D) | `artPieces` in `src/data/portfolio.ts` |
| Event Design scroll collages | `src/data/showcase.ts` + `src/assets/images/showcase/` |
| Brand project pages (generated) | `src/data/works.json` + images in `public/works/` |
| Hero / about artwork | `src/assets/images/` |
| Colours, spacing, buttons | `src/app/globals.css` |
| Fonts (Playfair Display, Poppins) | `src/app/layout.tsx` |
| Home page sections | `src/components/sections/` |
| Brand page | `src/app/work/[slug]/page.tsx` + `src/components/work/` |
| CV download | put the PDF at `public/Ashna-Mary-CV.pdf` |

Each component has a matching `*.module.css` file next to it.

## Updating project images

Each brand is a folder of sub-folders (`stage/`, `entry arch/`, `registration desk/`, …). Files inside a
`graphics/` folder are shown as "Print-ready graphics"; everything else is shown as the main visuals.

1. Unzip the brand folders somewhere, e.g. `C:\portfolio\extracted\`.
2. Add any new brand to the `BRANDS` table at the top of `scripts/build_works.py`.
3. Regenerate the web images and manifest (needs Python with Pillow):

```bash
python scripts/build_works.py C:/portfolio/extracted public/works src/data/works.json
```

The script resizes everything to WebP (2000px full size + 720px thumbnails). New brands get a page at
`/work/<slug>` automatically.

## Deploying to Vercel (automatic)

`.github/workflows/vercel-deploy.yml` deploys the site on every push:

- push to `main` → **production**
- push to any other branch → **preview** (the URL is shown in the GitHub Actions run summary)

`vercel.json` turns off Vercel's own Git deployments so each push is deployed once, by the workflow.

One-time setup:

1. Create the project and link it (creates `.vercel/project.json`, which is git-ignored):

   ```bash
   npx vercel link
   ```

2. Create a token at https://vercel.com/account/tokens.
3. In GitHub → repo **Settings → Secrets and variables → Actions**, add:
   - `VERCEL_TOKEN` — the token from step 2
   - `VERCEL_ORG_ID` — `orgId` from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — `projectId` from `.vercel/project.json`
4. Push. Merge your work into `main` to publish it to production.
