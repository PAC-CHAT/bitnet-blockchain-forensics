"""News scraping utilities used by UI and API layers."""

from __future__ import annotations

from dataclasses import dataclass
from html.parser import HTMLParser
from typing import Iterable
from urllib.error import URLError
from urllib.request import Request, urlopen


@dataclass(slots=True)
class NewsArticle:
    """Represents a scraped news article headline."""

    title: str
    source_url: str


class _HeadlineParser(HTMLParser):
    """Extract title and headline tags from HTML documents."""

    _SUPPORTED_TAGS = {"title", "h1", "h2", "h3"}

    def __init__(self) -> None:
        super().__init__()
        self._active_tag: str | None = None
        self._buffer: list[str] = []
        self.headlines: list[str] = []

    def handle_starttag(self, tag: str, attrs: Iterable[tuple[str, str | None]]) -> None:  # noqa: ARG002
        if tag in self._SUPPORTED_TAGS:
            self._active_tag = tag
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._active_tag:
            self._buffer.append(data.strip())

    def handle_endtag(self, tag: str) -> None:
        if tag == self._active_tag:
            headline = " ".join(chunk for chunk in self._buffer if chunk).strip()
            if headline:
                self.headlines.append(headline)
            self._active_tag = None
            self._buffer = []


def scrape_news(url: str, max_items: int = 10, timeout_seconds: float = 5.0) -> list[NewsArticle]:
    """Scrape top headlines from a target URL."""

    request = Request(
        url,
        headers={"User-Agent": "BitNetForensicsNewsBot/1.0 (+https://bitnet.local)"},
    )

    try:
        with urlopen(request, timeout=timeout_seconds) as response:  # noqa: S310
            payload = response.read().decode("utf-8", errors="ignore")
    except URLError:
        return []

    parser = _HeadlineParser()
    parser.feed(payload)

    deduped_headlines = list(dict.fromkeys(parser.headlines))
    return [NewsArticle(title=headline, source_url=url) for headline in deduped_headlines[:max_items]]
