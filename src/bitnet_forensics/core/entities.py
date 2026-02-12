"""Core data entities for forensic workflows."""

from dataclasses import dataclass


@dataclass(slots=True)
class TransactionRecord:
    tx_hash: str
    chain: str
    amount: float
    block_height: int


@dataclass(slots=True)
class DataShardBeam:
    """Represents a normalized data shard beam packet.

    The default wavelength is set to "infrared" to match the
    "อินฟราเรดชาร์ดข้อมูล" (data shard beam) workflow naming.
    """

    beam_id: str
    source: str
    shard_count: int
    wavelength: str = "infrared"
