import hashlib
import json
import logging
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from typing import List

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "static/fonts/han-sc-v1"


def unicode_ranges(points: List[int]) -> str:
    ranges = []
    start = previous = points[0]
    for point in points[1:] + [None]:
        if point is not None and point == previous + 1:
            previous = point
            continue
        ranges.append(f"U+{start:X}" if start == previous else f"U+{start:X}-{previous:X}")
        start = previous = point
    return ",".join(ranges)


def build_subset(job: tuple) -> dict:
    source, family, style, index, points = job
    font = TTFont(ROOT / source["path"], recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=points)
    subsetter.subset(font)

    # honor the reserved font name when distributing modified subsets
    postscript_name = f"BlogHanSansSC-{style.title()}-{index:03d}"
    names = {
        1: family,
        2: style.title(),
        3: postscript_name,
        4: f"{family} {style.title()}",
        6: postscript_name,
        16: family,
        17: style.title(),
    }
    for record in font["name"].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    if "CFF " in font:
        cff = font["CFF "].cff
        cff.fontNames = [postscript_name]
        cff.topDictIndex[0].FamilyName = family
        cff.topDictIndex[0].FullName = f"{family} {style.title()}"
    target = OUTPUT / f"{style}-{index:03d}.woff2"
    font.save(target)
    with TTFont(target) as result:
        if not set(points).issubset(result.getBestCmap()):
            raise ValueError(f"Character coverage mismatch: {target}")
    return {
        "file": target.name,
        "bytes": target.stat().st_size,
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    }


def main() -> None:
    r"""Build stable WOFF2 subsets without inspecting article content.

    Workflow
    --------
    Verify source hashes and full character coverage, generate the fixed groups,
    then emit unicode-range CSS and a checksum inventory. Bump the output
    directory version when changing the grouping or original fonts.
    """
    logging.getLogger("fontTools.subset").setLevel(logging.ERROR)
    manifest = json.loads((ROOT / "scripts/font_subsets.json").read_text(encoding="utf-8"))
    groups = manifest["groups"]
    points = [point for group in groups for point in group]
    assert len(points) == len(set(points)), "Overlapping font groups"
    OUTPUT.mkdir(parents=True, exist_ok=True)
    jobs = []
    rules = []
    for style, source in manifest["sources"].items():
        original = ROOT / source["path"]
        assert hashlib.sha256(original.read_bytes()).hexdigest() == source["sha256"]
        with TTFont(original) as font:
            assert set(font.getBestCmap()) == set(points), "Incomplete font coverage"
        for index, group in enumerate(groups):
            jobs.append((source, manifest["family"], style, index, group))
            rules.append(
                "@font-face {\n"
                f'  font-family: "{manifest["family"]}";\n'
                f'  src: url("/fonts/han-sc-v1/{style}-{index:03d}.woff2") format("woff2");\n'
                f"  font-weight: {source['weight']};\n"
                "  font-style: normal;\n"
                "  font-display: swap;\n"
                f"  unicode-range: {unicode_ranges(group)};\n"
                "}\n"
            )
    with ProcessPoolExecutor(max_workers=4) as pool:
        records = []
        for record in pool.map(build_subset, jobs):
            records.append(record)
            if len(records) % 20 == 0:
                print(f"Generated {len(records)}/{len(jobs)} font files", flush=True)
    (ROOT / "static/css/han-sc-v1.css").write_text("\n".join(rules), encoding="utf-8")
    (OUTPUT / "checksums.json").write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
    print(f"Complete: {len(records)} subsets, {len(points)} characters per weight")
    print(f"Largest subset: {max(record['bytes'] for record in records):,} bytes")


if __name__ == "__main__":
    main()
