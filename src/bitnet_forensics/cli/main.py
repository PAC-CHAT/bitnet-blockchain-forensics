"""CLI entry point."""

import typer

app = typer.Typer()


@app.command()
def version() -> None:
    typer.echo("bitnet-blockchain-forensics 0.1.0")
