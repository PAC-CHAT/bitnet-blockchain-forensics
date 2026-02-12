"""Simple risk scoring logic."""


def score_risk(activity_ratio: float) -> float:
    return min(max(activity_ratio, 0.0), 1.0)
