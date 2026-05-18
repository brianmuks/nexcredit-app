#!/usr/bin/env python3
"""Generate app icon and splash assets from assets/images/logo.png."""

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, "assets", "images")
LOGO_PATH = os.path.join(IMAGES, "logo.png")
NAVY = (10, 29, 55)


def make_square_icon(out_path, size=1024, padding_ratio=0.12):
    logo = Image.open(LOGO_PATH).convert("RGBA")
    w, h = logo.size
    inner = size * (1 - padding_ratio * 2)
    scale = min(inner / w, inner / h)
    nw, nh = int(w * scale), int(h * scale)
    logo_resized = logo.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), NAVY + (255,))
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(logo_resized, (x, y), logo_resized)
    canvas.save(out_path, "PNG")
    print("Wrote", out_path)


def main():
    if not os.path.exists(LOGO_PATH):
        raise SystemExit("Missing logo at " + LOGO_PATH)

    make_square_icon(os.path.join(IMAGES, "icon.png"))
    make_square_icon(os.path.join(IMAGES, "adaptive-icon.png"))
    make_square_icon(os.path.join(IMAGES, "splash-icon.png"), padding_ratio=0.08)
    make_square_icon(os.path.join(IMAGES, "favicon.png"), size=48, padding_ratio=0.1)


if __name__ == "__main__":
    main()
