"""Build coarse monthly flock clusters from public GBIF occurrence records.

The output is presence-record intensity, not a population estimate. Locations are
rounded into 10-degree cells and only the strongest cells are kept, which avoids
exposing exact observation or nesting coordinates in the public prototype.
"""

from __future__ import annotations

import json
import math
import time
import urllib.parse
import urllib.request
import urllib.error
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "data" / "gbif-monthly-clusters.json"
API = "https://api.gbif.org/v1"
YEAR_RANGE = "2016,2026"
CELL_DEGREES = 10
PAGE_SIZE = 300

SPECIES = {
    "oriental-stork": "Ciconia boyciana",
    "red-crowned-crane": "Grus japonensis",
    "hooded-crane": "Grus monacha",
    "common-crane": "Grus grus",
    "black-faced-spoonbill": "Platalea minor",
    "eurasian-spoonbill": "Platalea leucorodia",
    "tundra-swan": "Cygnus columbianus",
    "swan-goose": "Anser cygnoides",
    "bean-goose": "Anser fabalis",
    "spoon-billed-sandpiper": "Calidris pygmaea",
    "great-knot": "Calidris tenuirostris",
    "red-necked-stint": "Calidris ruficollis",
    "bar-tailed-godwit": "Limosa lapponica",
    "far-eastern-curlew": "Numenius madagascariensis",
    "beijing-swift": "Apus apus pekinensis",
    "yellow-browed-warbler": "Phylloscopus inornatus",
    "crested-honey-buzzard": "Pernis ptilorhynchus",
    "chinese-sparrowhawk": "Accipiter soloensis",
    "amur-falcon": "Falco amurensis",
    "bar-headed-goose": "Anser indicus",
}


def get_json(path: str, params: dict) -> dict:
    url = f"{API}/{path}?{urllib.parse.urlencode(params, doseq=True)}"
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "FeatherLetterPrototype/0.2"})
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.load(response)
        except (urllib.error.URLError, TimeoutError):
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))


def cell_center(value: float) -> float:
    return math.floor(value / CELL_DEGREES) * CELL_DEGREES + CELL_DEGREES / 2


def fetch_month(taxon_key: int, month: int) -> tuple[int, list[dict], int]:
    base = {
        "taxon_key": taxon_key,
        "month": month,
        "year": YEAR_RANGE,
        "has_coordinate": "true",
        "has_geospatial_issue": "false",
        "occurrence_status": "PRESENT",
        "limit": PAGE_SIZE,
    }
    first = get_json("occurrence/search", {**base, "offset": 0})
    total = int(first.get("count", 0))
    pages = [first]

    cells: Counter[tuple[float, float]] = Counter()
    sampled = 0
    for page in pages:
        for record in page.get("results", []):
            lat = record.get("decimalLatitude")
            lng = record.get("decimalLongitude")
            if lat is None or lng is None:
                continue
            sampled += 1
            cells[(cell_center(float(lng)), cell_center(float(lat)))] += 1

    strongest = cells.most_common(14)
    peak = max((count for _, count in strongest), default=1)
    clusters = [
        {
            "lng": lng,
            "lat": lat,
            "records": count,
            "strength": round(count / peak, 3),
        }
        for (lng, lat), count in strongest
    ]
    return total, clusters, sampled


def main() -> None:
    previous = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else None
    output = previous or {
        "meta": {
            "source": "GBIF Occurrence API",
            "sourceUrl": "https://techdocs.gbif.org/en/openapi/v1/occurrence",
            "generated": "2026-08-02",
            "yearRange": YEAR_RANGE,
            "cellDegrees": CELL_DEGREES,
            "meaning": "Relative intensity of sampled presence records; not population abundance.",
            "privacy": "Coordinates aggregated to 10-degree cells; exact records are not published.",
        },
        "species": {},
    }

    for species_id, scientific_name in SPECIES.items():
        if species_id in output["species"] and len(output["species"][species_id].get("months", {})) == 12:
            continue
        match = get_json("species/match", {"name": scientific_name})
        taxon_key = match.get("usageKey")
        if not taxon_key:
            raise RuntimeError(f"No GBIF taxon match for {scientific_name}: {match}")
        item = {
            "scientificName": scientific_name,
            "matchedName": match.get("scientificName"),
            "taxonKey": taxon_key,
            "months": {},
        }
        with ThreadPoolExecutor(max_workers=6) as pool:
            jobs = {pool.submit(fetch_month, taxon_key, month): month for month in range(1, 13)}
            for future in as_completed(jobs):
                month = jobs[future]
                total, clusters, sampled = future.result()
                item["months"][str(month)] = {
                    "totalRecords": total,
                    "sampledRecords": sampled,
                    "clusters": clusters,
                }
        output["species"][species_id] = item
        OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
