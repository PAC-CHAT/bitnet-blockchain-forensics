"""Blockchain transaction parser helpers."""

from collections.abc import Mapping
from math import isfinite
from typing import Any

from bitnet_forensics.core.entities import DataShardBeam, TransactionRecord


def _coerce_float(value: object, default: float = 0.0) -> float:
    """Coerce incoming values to float while tolerating malformed input."""

    try:
        parsed_value = float(value)
    except (TypeError, ValueError):
        return default

    return parsed_value if isfinite(parsed_value) else default


def _coerce_int(value: object, default: int = 0) -> int:
    """Coerce incoming values to int while tolerating malformed input."""

    if isinstance(value, bool):
        return default

    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _as_mapping(payload: Mapping[str, Any] | None) -> Mapping[str, Any]:
    """Normalize nullable/untrusted payloads to a mapping."""

    if isinstance(payload, Mapping):
        return payload

    return {}


def parse_transaction(payload: Mapping[str, Any] | None) -> TransactionRecord:
    normalized_payload = _as_mapping(payload)
    return TransactionRecord(
        tx_hash=normalized_payload.get("tx_hash", ""),
        chain=normalized_payload.get("chain", "unknown"),
        amount=_coerce_float(normalized_payload.get("amount", 0.0), 0.0),
        block_height=max(_coerce_int(normalized_payload.get("block_height", 0), 0), 0),
    )


def parse_data_shard_beam(payload: Mapping[str, Any] | None) -> DataShardBeam:
    """Parse a payload into a DataShardBeam object."""

    normalized_payload = _as_mapping(payload)
    return DataShardBeam(
        beam_id=normalized_payload.get("beam_id", ""),
        source=normalized_payload.get("source", "unknown"),
        shard_count=max(_coerce_int(normalized_payload.get("shard_count", 0), 0), 0),
        wavelength=normalized_payload.get("wavelength", "infrared"),
    )
