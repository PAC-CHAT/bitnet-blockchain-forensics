"""Blockchain transaction parser helpers."""

from bitnet_forensics.core.entities import DataShardBeam, TransactionRecord


def parse_transaction(payload: dict) -> TransactionRecord:
    return TransactionRecord(
        tx_hash=payload.get("tx_hash", ""),
        chain=payload.get("chain", "unknown"),
        amount=float(payload.get("amount", 0.0)),
        block_height=int(payload.get("block_height", 0)),
    )


def parse_data_shard_beam(payload: dict) -> DataShardBeam:
    """Parse a payload into a DataShardBeam object."""

    return DataShardBeam(
        beam_id=payload.get("beam_id", ""),
        source=payload.get("source", "unknown"),
        shard_count=max(int(payload.get("shard_count", 0)), 0),
        wavelength=payload.get("wavelength", "infrared"),
    )
