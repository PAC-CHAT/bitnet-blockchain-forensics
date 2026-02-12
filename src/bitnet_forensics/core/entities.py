"""Core data entities for forensic workflows."""

from dataclasses import dataclass


@dataclass(slots=True)
class TransactionRecord:
    tx_hash: str
    chain: str
    amount: float
    block_height: int
