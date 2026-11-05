"""Convert extracted brand folders into web-sized WebP images + a JSON manifest.

usage: python -I build_works.py <extracted_dir> <public_works_dir> <manifest_json>
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

SRC, OUT, MANIFEST = (Path(p) for p in sys.argv[1:4])
EXTS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp"}
FULL, THUMB = 2000, 720

BRANDS = {
    "dark fantacy": ("dark-fantasy", "Sunfeast Dark Fantasy", "ITC · Party with SRK"),
    "tata tea": ("tata-tea", "Tata Tea Premium", "Stage reveal & key visuals"),
    "coco cola": ("coca-cola", "Coca-Cola", "Corporate event"),
    "henkel": ("henkel", "Henkel", "Family day & brand history"),
    "borderless access": ("borderless-access", "Borderless Access", "Corporate event"),
}
ZONE_NAMES = {
    "entyr arch": "Entry Arch",
    "entry arch": "Entry Arch",
    "registration": "Registration Desk",
    "registration desk": "Registration Desk",
    "other": "Collaterals",
    "others": "Collaterals",
    "kids zone": "Kids Zone",
    "history wall": "History Wall",
    "sitting area": "Sitting Area",
    "photobooth": "Photobooth",
    "stall": "Game Stalls",
    "stage": "Stage",
}
ZONE_ORDER = ["Stage", "Entry Arch", "Registration Desk", "Photobooth", "Game Stalls",
              "History Wall", "Kids Zone", "Sitting Area", "Collaterals"]


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def title(stem: str) -> str:
    stem = re.sub(r"\.(jpg|png)$", "", stem, flags=re.I)
    stem = re.sub(r"[_]+", " ", stem)
    return re.sub(r"\s+", " ", stem).strip()


def save(img: Image.Image, path: Path, max_side: int) -> tuple[int, int]:
    im = img.copy()
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=80, method=5)
    return im.size


brands_out = []
for folder, (bslug, bname, subtitle) in BRANDS.items():
    root = SRC / folder
    zones: dict[str, dict] = {}
    for f in sorted(root.rglob("*")):
        if not f.is_file() or f.suffix.lower() not in EXTS:
            continue
        rel = f.relative_to(root).parts
        zone_key = rel[0].lower() if len(rel) > 1 else "stage"
        zone = ZONE_NAMES.get(zone_key, title(zone_key).title())
        kind = "graphic" if "graphics" in [p.lower() for p in rel[:-1]] else "render"
        if folder == "tata tea" and len(rel) == 1:
            kind = "render"

        with Image.open(f) as src:
            img = ImageOps.exif_transpose(src)
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            name = slug(title(f.stem))
            base = OUT / bslug / slug(zone)
            w, h = save(img, base / f"{name}.webp", FULL)
            save(img, base / f"{name}-sm.webp", THUMB)

        z = zones.setdefault(zone, {"name": zone, "slug": slug(zone), "items": []})
        z["items"].append({
            "title": title(f.stem),
            "kind": kind,
            "src": f"/works/{bslug}/{slug(zone)}/{name}.webp",
            "thumb": f"/works/{bslug}/{slug(zone)}/{name}-sm.webp",
            "width": w,
            "height": h,
        })
        print("ok", bslug, zone, f.name, flush=True)

    ordered = sorted(zones.values(), key=lambda z: ZONE_ORDER.index(z["name"]) if z["name"] in ZONE_ORDER else 99)
    for z in ordered:  # renders first inside each zone
        z["items"].sort(key=lambda i: i["kind"] != "render")
    cover = next((i for z in ordered for i in z["items"] if i["kind"] == "render"), ordered[0]["items"][0])
    brands_out.append({"slug": bslug, "name": bname, "subtitle": subtitle, "cover": cover["src"],
                       "coverThumb": cover["thumb"], "zones": ordered})

MANIFEST.write_text(json.dumps(brands_out, indent=2), encoding="utf-8")
print("brands", len(brands_out), "images", sum(len(z["items"]) for b in brands_out for z in b["zones"]))
