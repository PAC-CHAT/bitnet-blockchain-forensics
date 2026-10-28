# BitNet Blockchain Forensics (React Edition)

AI-powered blockchain forensic data review platform built with React, TypeScript, Vite, and Tailwind CSS.

## Overview

This application provides a modular, interactive web platform for transaction intelligence, address risk scoring, entity clustering, and automated heuristic security auditing for blockchain investigations.

Ported from the BitNet b1.58 Python/FastAPI architecture into a high-performance React application.

## Core Features & Built-in Production Components

- **Forensics & Parser Intelligence** (`/`):
  - **Transaction Normalizer**: Resilient parser with strict coercion for `tx_hash`, `chain`, `amount`, and non-negative `block_height`, tolerating malformed and null payloads.
  - **Data Shard Beam & Codename**: Standardized infrared shard beam packet with Thai bilingual rendering (`formatDataShardBeamCodename`) ported from the CLI `pen` command.
  - **Address Activity Ratio & Risk Scoring**: Dynamic risk scoring engine calculating activity ratios across counterparty distributions with risk classification badges.
  - **Forensic Cluster Graph**: Interactive node-edge visualization for wallet clusters, mixers, smart contracts, and fund hops.
  - **Sandboxed Executor & Traceback Sanitizer**: Isolated execution simulator with regex-based redaction of secrets, tokens, and server paths (`[PATH_REDACTED]`, `[REDACTED]`).

- **News Scraper UI** (`/ui/news-scraper`):
  - Interactive page backed by `/api/news/scrape` for scraping headline tags (`title`, `h1`, `h2`, `h3`) from blockchain news sources with quick preset feeds (CoinDesk, Decrypt, Bitcoin Magazine, Blockworks) and raw JSON inspection.

- **Sales Dashboard with Charts** (`/ui/sales-dashboard`):
  - Operational analytics dashboard backed by `/api/sales/metrics` displaying total revenue, average order value, total orders, monthly bar charts, and an interactive ledger.

- **Security Review Tool** (`/ui/security-review`):
  - Static analysis helper backed by `/api/security/review` evaluating API payloads for insecure HTTP protocols, hardcoded credentials, and overly permissive CORS (`*`).

- **API Documentation Generator** (`/ui/api-docs-generator`):
  - Markdown route documentation exporter backed by `/api/docs/markdown` with live endpoint testing, clipboard copy, and file download.

- **Platform Capabilities Architecture** (`/docs/platform`):
  - Interactive architecture explorer mapping the 5 platform capabilities (Unlimited apps, In-app code edits, Backend functions, Connect a domain, GitHub integration) into source layers.

## Development & Build

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Compile / Build for production
npm run build
```

## License

Apache 2.0. See `LICENSE`.
