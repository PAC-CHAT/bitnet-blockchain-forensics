from bitnet_forensics.inference.scoring import score_risk


def test_score_risk_bounds() -> None:
    assert score_risk(-1.0) == 0.0
    assert score_risk(2.0) == 1.0
