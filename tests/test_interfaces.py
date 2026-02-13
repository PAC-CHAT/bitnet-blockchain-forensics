from fastapi.testclient import TestClient
from typer.testing import CliRunner

from bitnet_forensics.api.app import app as api_app
from bitnet_forensics.cli.main import app as cli_app


def test_health_endpoint() -> None:
    client = TestClient(api_app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_cli_version_command() -> None:
    runner = CliRunner()

    result = runner.invoke(cli_app, [])

    assert result.exit_code == 0
    assert result.stdout.strip() == "bitnet-blockchain-forensics 0.1.0"
