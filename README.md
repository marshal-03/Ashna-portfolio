# Ashna Mary — Portfolio

Vue 3 + Vite + TypeScript portfolio for Ashna Mary, 2D designer (event stages, entry arches, registration desks, branding).

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run lint
```

## Where things live

| What | File |
| --- | --- |
| Name, bio, email, CV link, social links | `src/data/portfolio.ts` |
| ArtStation 3D / animation / art tiles | `artPieces` in `src/data/portfolio.ts` |
| Brand projects (generated) | `src/data/works.json` + images in `public/works/` |
| Hero / about artwork | `src/assets/images/` |
| Colours & fonts | `src/assets/styles/main.css` |
| CV download | put the PDF at `public/Ashna-Mary-CV.pdf` |

## Updating project images

Each brand is a folder of sub-folders (`stage/`, `entry arch/`, `registration desk/`, …). Files inside a
`graphics/` folder are shown as "Print-ready graphics"; everything else is shown as the main visuals.

1. Unzip the brand folders somewhere, e.g. `C:\portfolio\extracted\`.
2. Add any new brand to the `BRANDS` table at the top of `scripts/build_works.py`.
3. Regenerate the web images and manifest (needs Python with Pillow):

```bash
python scripts/build_works.py C:/portfolio/extracted public/works src/data/works.json
```

The script resizes everything to WebP (2000px full size + 720px thumbnails).
