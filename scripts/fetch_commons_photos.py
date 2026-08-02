"""Download one clearly licensed Wikimedia Commons reference photo per species."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
import urllib.error
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "references"
META_PATH = ROOT / "assets" / "data" / "photo-credits.json"

SPECIES = {
    "red-crowned-crane": "Grus japonensis",
    "hooded-crane": "Grus monacha",
    "common-crane": "Grus grus",
    "black-faced-spoonbill": "Platalea minor",
    "eurasian-spoonbill": "Platalea leucorodia",
    "tundra-swan": "Cygnus columbianus",
    "swan-goose": "Anser cygnoides",
    "bean-goose": "Anser fabalis",
    "great-knot": "Calidris tenuirostris",
    "red-necked-stint": "Calidris ruficollis",
    "bar-tailed-godwit": "Limosa lapponica",
    "far-eastern-curlew": "Numenius madagascariensis",
    "yellow-browed-warbler": "Phylloscopus inornatus",
    "crested-honey-buzzard": "Pernis ptilorhynchus",
    "chinese-sparrowhawk": "Accipiter soloensis",
    "amur-falcon": "Falco amurensis",
}


def api(params: dict) -> dict:
    params = {"action": "query", "format": "json", "formatversion": 2, **params}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "FeatherLetterPrototype/0.3"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                return json.load(response)
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or attempt == 4:
                raise
            time.sleep(8 * (attempt + 1))


def clean(meta: dict, key: str) -> str:
    return meta.get(key, {}).get("value", "").replace("<span class=\"int-own-work\" lang=\"en\">", "").replace("</span>", "")


def find_image(name: str) -> dict:
    result = api({
        "generator": "search",
        "gsrsearch": f'filetype:bitmap "{name}"',
        "gsrnamespace": 6,
        "gsrlimit": 12,
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
        "iiurlwidth": 1000,
    })
    for page in result.get("query", {}).get("pages", []):
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        license_name = clean(meta, "LicenseShortName")
        if info.get("mime", "").startswith("image/") and ("CC" in license_name or "Public domain" in license_name):
            return {"title": page["title"], "info": info, "license": license_name, "meta": meta}
    raise RuntimeError(f"No reusable Commons image found for {name}")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    credits = json.loads(META_PATH.read_text(encoding="utf-8")) if META_PATH.exists() else {}
    for species_id, name in SPECIES.items():
        target = OUT_DIR / f"{species_id}.jpg"
        if target.exists() and species_id in credits:
            continue
        chosen = find_image(name)
        info, meta = chosen["info"], chosen["meta"]
        thumb = info.get("thumburl") or info["url"]
        req = urllib.request.Request(thumb, headers={"User-Agent": "FeatherLetterPrototype/0.3"})
        for attempt in range(5):
            try:
                with urllib.request.urlopen(req, timeout=60) as response:
                    target.write_bytes(response.read())
                break
            except urllib.error.HTTPError as exc:
                if exc.code != 429 or attempt == 4:
                    raise
                time.sleep(10 * (attempt + 1))
        credits[species_id] = {
            "scientificName": name,
            "file": chosen["title"],
            "source": info.get("descriptionurl"),
            "creator": clean(meta, "Artist"),
            "license": chosen["license"],
        }
        META_PATH.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")
        print(species_id, chosen["title"])
        time.sleep(2.5)


if __name__ == "__main__":
    main()
