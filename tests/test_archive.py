from pathlib import Path
from zipfile import ZipFile

from bitnet_forensics.data.archive import inspect_zip_members, list_zip_files


def _create_zip(path: Path, members: dict[str, str]) -> None:
    with ZipFile(path, "w") as zip_file:
        for name, content in members.items():
            zip_file.writestr(name, content)


def test_list_zip_files_returns_sorted_matches(tmp_path: Path) -> None:
    _create_zip(tmp_path / "b.zip", {"b.json": "{}"})
    _create_zip(tmp_path / "a.zip", {"a.json": "{}"})
    (tmp_path / "notes.txt").write_text("ignore")

    archives = list_zip_files(tmp_path)

    assert [archive.name for archive in archives] == ["a.zip", "b.zip"]


def test_inspect_zip_members_returns_file_members_only(tmp_path: Path) -> None:
    archive_path = tmp_path / "evidence.zip"
    with ZipFile(archive_path, "w") as zip_file:
        zip_file.writestr("events/", "")
        zip_file.writestr("events/a.json", "{}")
        zip_file.writestr("events/b.json", "{}")

    members = inspect_zip_members(archive_path)

    assert members == ["events/a.json", "events/b.json"]
