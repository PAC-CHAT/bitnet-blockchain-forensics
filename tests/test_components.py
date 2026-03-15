from fastapi.testclient import TestClient

from bitnet_forensics.api.app import app
from bitnet_forensics.api.documentation import generate_markdown_docs
from bitnet_forensics.inference.security_review import review_text
from bitnet_forensics.visualization.sales_dashboard import (
    build_sales_snapshot,
    to_chart_payload,
)


client = TestClient(app)


def test_sales_dashboard_payload_has_totals() -> None:
    payload = to_chart_payload(build_sales_snapshot())
    assert payload["total_revenue"] > 0
    assert payload["avg_order_value"] > 0
    assert len(payload["labels"]) == len(payload["revenue"])


def test_security_review_detects_obvious_issues() -> None:
    findings = review_text("POST http://internal/login with password=secret")
    severities = {item.severity for item in findings}
    assert "high" in severities
    assert "critical" in severities


def test_api_docs_generator_lists_routes() -> None:
    docs = generate_markdown_docs(app)
    assert "`/api/sales/metrics`" in docs
    assert "`/ui/news-scraper`" in docs


def test_component_endpoints_return_expected_shapes() -> None:
    sales_response = client.get("/api/sales/metrics")
    assert sales_response.status_code == 200
    assert "labels" in sales_response.json()

    review_response = client.post(
        "/api/security/review",
        json={"content": "allow cors * and http://legacy.example"},
    )
    assert review_response.status_code == 200
    assert len(review_response.json()["findings"]) >= 2


def test_ui_pages_are_available() -> None:
    for path in (
        "/ui/news-scraper",
        "/ui/sales-dashboard",
        "/ui/security-review",
        "/ui/api-docs-generator",
    ):
        response = client.get(path)
        assert response.status_code == 200
        assert "<html>" in response.text
