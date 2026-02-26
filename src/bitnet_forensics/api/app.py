"""FastAPI application entrypoint."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# Define paths
API_DIR = Path(__file__).parent
STATIC_DIR = API_DIR / "static"
TEMPLATES_DIR = API_DIR / "templates"

app = FastAPI(
    title="BitNet Blockchain Forensics",
    description="AI-powered blockchain forensic data review platform using BitNet b1.58-inspired workflows",
    version="0.1.0",
)

# Mount static files directory if it exists
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", response_class=HTMLResponse)
def read_root() -> str:
    """Serve the main landing page with Vercel Web Analytics."""
    index_path = TEMPLATES_DIR / "index.html"
    if index_path.exists():
        return index_path.read_text()
    return "<h1>BitNet Blockchain Forensics</h1><p>API is running. Visit /docs for API documentation.</p>"


@app.get("/health")
def health() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
