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
