"""Feature engineering module."""


def build_features(transaction_count: int, unique_counterparties: int) -> dict:
    return {
        "transaction_count": transaction_count,
        "unique_counterparties": unique_counterparties,
        "activity_ratio": unique_counterparties / max(transaction_count, 1),
    }
