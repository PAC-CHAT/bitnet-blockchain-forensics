"""FastAPI application entrypoint."""

from fastapi import FastAPI

app = FastAPI(title="BitNet Blockchain Forensics")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
