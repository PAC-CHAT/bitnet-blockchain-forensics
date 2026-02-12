from typer.testing import CliRunner

from bitnet_forensics.cli.main import app

runner = CliRunner()


def test_pen_command_defaults_to_data_shard_beam_translation() -> None:
    result = runner.invoke(app, ["pen", "อินฟราเรดชาร์ดข้อมูล"])

    assert result.exit_code == 0
    assert result.stdout.strip() == "อินฟราเรดชาร์ดข้อมูล (data shard beam)"


def test_pen_command_allows_custom_english_translation() -> None:
    result = runner.invoke(
        app,
        ["pen", "อินฟราเรดชาร์ดข้อมูล", "--english", "infrared data shard beam"],
    )

    assert result.exit_code == 0
    assert result.stdout.strip() == "อินฟราเรดชาร์ดข้อมูล (infrared data shard beam)"
