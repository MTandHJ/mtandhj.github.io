import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    r"""Build an ignored search index that the local Hugo server can serve."""
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        raise SystemExit("Node.js / npx is required to build the search index.")
    with tempfile.TemporaryDirectory(prefix="blog-search-") as directory:
        subprocess.run(["hugo", "--destination", directory], cwd=ROOT, check=True)
        subprocess.run(
            [
                npx,
                "-y",
                "pagefind@1.5.2",
                "--site",
                directory,
                "--output-path",
                str(ROOT / "static/pagefind"),
            ],
            cwd=ROOT,
            check=True,
        )
    print("Search index ready. Hugo server serves it from /pagefind/.")


if __name__ == "__main__":
    main()
