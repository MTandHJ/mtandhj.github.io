import base64
import fnmatch
import hashlib
import json
import subprocess
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "static/vendor"
CACHE = Path(tempfile.gettempdir()) / "blog-vendor-downloads"


def download(url: str, path: Path) -> None:
    r"""Download a release artifact with bounded retries."""
    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_name(path.name + ".part")
    subprocess.run(
        [
            "curl",
            "--fail",
            "--location",
            "--silent",
            "--show-error",
            "--retry",
            "2",
            "--retry-all-errors",
            "--connect-timeout",
            "15",
            "--max-time",
            "180",
            "--output",
            str(partial),
            url,
        ],
        check=True,
    )
    partial.replace(path)


def vendor_python_packages(destination: Path, packages: list) -> None:
    r"""Keep current article packages local and preserve optional CDN packages."""
    lock_path = destination / "pyodide-lock.json"
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    local = set()

    def include(name: str) -> None:
        if name in local:
            return
        local.add(name)
        for dependency in lock["packages"][name]["depends"]:
            include(dependency)

    for name in packages:
        include(name)
    base_url = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
    for name, package in lock["packages"].items():
        if name not in local:
            package["file_name"] = base_url + package["file_name"]
            continue
        target = destination / package["file_name"]
        if (
            not target.exists()
            or hashlib.sha256(target.read_bytes()).hexdigest() != package["sha256"]
        ):
            download(base_url + package["file_name"], target)
        if hashlib.sha256(target.read_bytes()).hexdigest() != package["sha256"]:
            raise ValueError(f"Python package integrity mismatch: {target}")
    lock_path.write_text(json.dumps(lock, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    r"""Restore pinned browser assets and their licenses from npm archives.

    Workflow
    --------
    1. Verify each archive against its recorded npm integrity hash.
    2. Extract only the browser files listed in vendor_sources.json.
    3. Generate local Rubik CSS and a checksum inventory.
    """
    sources = json.loads((ROOT / "scripts/vendor_sources.json").read_text(encoding="utf-8"))
    for source in sources:
        archive = CACHE / source["archive"]
        if not archive.exists():
            download(source["url"], archive)
        algorithm, digest = source["integrity"].split("-", 1)
        actual = base64.b64encode(hashlib.new(algorithm, archive.read_bytes()).digest()).decode()
        if actual != digest:
            raise ValueError(f"Archive integrity mismatch: {archive}")
        destination = VENDOR / source["directory"]
        with tarfile.open(archive) as tar:
            for member in tar:
                relative = member.name.removeprefix("package/")
                if not member.isfile() or not any(
                    fnmatch.fnmatchcase(relative, pattern) for pattern in source["include"]
                ):
                    continue
                target = (destination / relative).resolve()
                if not target.is_relative_to(destination.resolve()):
                    raise ValueError(f"Invalid archive path: {member.name}")
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(tar.extractfile(member).read())
        if source.get("local_packages"):
            vendor_python_packages(destination, source["local_packages"])
        for extra in source.get("extra_files", []):
            target = destination / extra["path"]
            if (
                not target.exists()
                or hashlib.sha256(target.read_bytes()).hexdigest() != extra["sha256"]
            ):
                download(extra["url"], target)
            if hashlib.sha256(target.read_bytes()).hexdigest() != extra["sha256"]:
                raise ValueError(f"Extra file integrity mismatch: {target}")
        print(f"Restored {source['directory']}", flush=True)

    rubik = VENDOR / "rubik/5.2.8"
    css = "\n".join(
        (rubik / name).read_text(encoding="utf-8") for name in ("index.css", "wght-italic.css")
    )
    css = css.replace("'Rubik Variable'", "'Rubik'")
    css = css.replace("url(./files/", "url(/vendor/rubik/5.2.8/files/")
    (ROOT / "static/css/rubik.css").write_text(css, encoding="utf-8", newline="\n")

    inventory = {
        path.relative_to(VENDOR).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in sorted(VENDOR.rglob("*"))
        if path.is_file() and path.name != "checksums.json"
    }
    (VENDOR / "checksums.json").write_text(json.dumps(inventory, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
