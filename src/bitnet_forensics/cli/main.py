"""CLI entry point."""

import typer

app = typer.Typer()


@app.command()
def version() -> None:
    typer.echo("bitnet-blockchain-forensics 0.1.0")


@app.command("pen")
def pen_data_shard_beam(
    thai_name: str = typer.Argument(
        ..., help="Thai codename to render for the data shard beam."
    ),
    english_name: str = typer.Option(
        "data shard beam", "--english", "-e", help="English translation label."
    ),
) -> None:
    """Render a codename in bilingual format."""
    typer.echo(f"{thai_name} ({english_name})")
