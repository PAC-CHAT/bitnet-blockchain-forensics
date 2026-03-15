"""FastAPI application entrypoint."""

from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel, Field

from bitnet_forensics.api.documentation import generate_markdown_docs
from bitnet_forensics.blockchain.news_scraper import scrape_news
from bitnet_forensics.inference.security_review import review_text
from bitnet_forensics.visualization.sales_dashboard import (
    build_sales_snapshot,
    to_chart_payload,
)

app = FastAPI(title="BitNet Blockchain Forensics")


class SecurityReviewRequest(BaseModel):
    content: str = Field(min_length=1, max_length=12000)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/news/scrape")
def api_news_scrape(url: str = Query(..., min_length=8, max_length=2048)) -> dict[str, list[dict[str, str]]]:
    articles = scrape_news(url)
    return {"articles": [{"title": article.title, "source_url": article.source_url} for article in articles]}


@app.get("/api/sales/metrics")
def api_sales_metrics() -> dict[str, list[float] | list[str] | float]:
    return to_chart_payload(build_sales_snapshot())


@app.post("/api/security/review")
def api_security_review(payload: SecurityReviewRequest) -> dict[str, list[dict[str, str]]]:
    findings = review_text(payload.content)
    return {
        "findings": [
            {
                "severity": finding.severity,
                "summary": finding.summary,
                "recommendation": finding.recommendation,
            }
            for finding in findings
        ]
    }


@app.get("/api/docs/markdown", response_class=PlainTextResponse)
def api_docs_markdown() -> str:
    return generate_markdown_docs(app)


@app.get("/ui/news-scraper", response_class=HTMLResponse)
def news_scraper_ui() -> str:
    return """
<!doctype html>
<html>
<head><title>News Scraper UI</title></head>
<body>
  <h1>News Scraper UI</h1>
  <input id=\"url\" value=\"https://example.com\" style=\"width:340px\" />
  <button onclick=\"runScrape()\">Scrape</button>
  <ul id=\"results\"></ul>
  <script>
    async function runScrape() {
      const url = document.getElementById('url').value;
      const res = await fetch(`/api/news/scrape?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      const list = document.getElementById('results');
      list.innerHTML = '';
      data.articles.forEach((article) => {
        const li = document.createElement('li');
        li.textContent = article.title;
        list.appendChild(li);
      });
    }
  </script>
</body>
</html>
"""


@app.get("/ui/sales-dashboard", response_class=HTMLResponse)
def sales_dashboard_ui() -> str:
    return """
<!doctype html>
<html>
<head>
  <title>Sales Dashboard with Charts</title>
  <script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>
</head>
<body>
  <h1>Sales Dashboard with Charts</h1>
  <div id=\"summary\"></div>
  <canvas id=\"revenueChart\" width=\"640\" height=\"320\"></canvas>
  <script>
    async function loadDashboard() {
      const res = await fetch('/api/sales/metrics');
      const data = await res.json();
      document.getElementById('summary').innerHTML =
        `<p>Total Revenue: $${data.total_revenue}</p><p>Avg Order Value: $${data.avg_order_value}</p>`;

      new Chart(document.getElementById('revenueChart'), {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{ label: 'Revenue', data: data.revenue }]
        }
      });
    }
    loadDashboard();
  </script>
</body>
</html>
"""


@app.get("/ui/security-review", response_class=HTMLResponse)
def security_review_ui() -> str:
    return """
<!doctype html>
<html>
<head><title>Security Review Tool</title></head>
<body>
  <h1>Security Review Tool</h1>
  <textarea id=\"content\" rows=\"10\" cols=\"80\">POST http://api.internal/v1/login includes password=example</textarea>
  <br />
  <button onclick=\"runReview()\">Review</button>
  <ul id=\"findings\"></ul>
  <script>
    async function runReview() {
      const content = document.getElementById('content').value;
      const res = await fetch('/api/security/review', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content})
      });
      const data = await res.json();
      const findings = document.getElementById('findings');
      findings.innerHTML = '';
      data.findings.forEach((f) => {
        const li = document.createElement('li');
        li.textContent = `${f.severity.toUpperCase()}: ${f.summary} => ${f.recommendation}`;
        findings.appendChild(li);
      });
    }
  </script>
</body>
</html>
"""


@app.get("/ui/api-docs-generator", response_class=HTMLResponse)
def api_docs_generator_ui() -> str:
    return """
<!doctype html>
<html>
<head><title>API Documentation Generator</title></head>
<body>
  <h1>API Documentation Generator</h1>
  <button onclick=\"loadDocs()\">Generate Markdown</button>
  <pre id=\"docs\"></pre>
  <script>
    async function loadDocs() {
      const res = await fetch('/api/docs/markdown');
      const text = await res.text();
      document.getElementById('docs').textContent = text;
    }
  </script>
</body>
</html>
"""
