"""ZIP archive helpers for forensic datasets."""

from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path
from zipfile import ZipFile


def list_zip_files(base_dir: Path | str, pattern: str = "*.zip") -> list[Path]:
    """Return sorted ZIP files in ``base_dir`` matching ``pattern``."""

    directory = Path(base_dir)
    return sorted(path for path in directory.glob(pattern) if path.is_file())


def inspect_zip_members(archive_path: Path | str) -> list[str]:
    """Return file member names from a ZIP archive in deterministic order."""

    archive = Path(archive_path)
    with ZipFile(archive) as zip_file:
        members: Iterable[str] = (info.filename for info in zip_file.infolist() if not info.is_dir())
        return sorted(members)
