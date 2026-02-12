from bitnet_forensics.blockchain.parser import parse_transaction


def test_parse_transaction_defaults() -> None:
    record = parse_transaction({})
    assert record.chain == "unknown"
    assert record.amount == 0.0
