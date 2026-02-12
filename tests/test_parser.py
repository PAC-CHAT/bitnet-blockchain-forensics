from bitnet_forensics.blockchain.parser import parse_data_shard_beam, parse_transaction


def test_parse_transaction_defaults() -> None:
    record = parse_transaction({})
    assert record.chain == "unknown"
    assert record.amount == 0.0


def test_parse_data_shard_beam_defaults() -> None:
    beam = parse_data_shard_beam({})
    assert beam.wavelength == "infrared"
    assert beam.source == "unknown"
    assert beam.shard_count == 0


def test_parse_data_shard_beam_negative_shards() -> None:
    beam = parse_data_shard_beam({"shard_count": -3, "beam_id": "b-01"})
    assert beam.beam_id == "b-01"
    assert beam.shard_count == 0


def test_parse_transaction_invalid_numeric_fields() -> None:
    record = parse_transaction({"amount": "NaN?", "block_height": "abc"})
    assert record.amount == 0.0
    assert record.block_height == 0


def test_parse_transaction_non_finite_amount_defaults() -> None:
    record = parse_transaction({"amount": "inf"})
    assert record.amount == 0.0


def test_parse_transaction_negative_block_height() -> None:
    record = parse_transaction({"block_height": -7})
    assert record.block_height == 0


def test_parse_data_shard_beam_bool_shard_count_defaults() -> None:
    beam = parse_data_shard_beam({"shard_count": True})
    assert beam.shard_count == 0



def test_parse_transaction_none_payload_defaults() -> None:
    record = parse_transaction(None)
    assert record.tx_hash == ""
    assert record.chain == "unknown"
    assert record.amount == 0.0
    assert record.block_height == 0


def test_parse_data_shard_beam_none_payload_defaults() -> None:
    beam = parse_data_shard_beam(None)
    assert beam.beam_id == ""
    assert beam.source == "unknown"
    assert beam.shard_count == 0
    assert beam.wavelength == "infrared"
