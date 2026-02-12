"""Blockchain transaction parser helpers."""

from bitnet_forensics.core.entities import TransactionRecord


def parse_transaction(payload: dict) -> TransactionRecord:
    return TransactionRecord(
        tx_hash=payload.get("tx_hash", ""),
        chain=payload.get("chain", "unknown"),
        amount=float(payload.get("amount", 0.0)),
        block_height=int(payload.get("block_height", 0)),
    )
