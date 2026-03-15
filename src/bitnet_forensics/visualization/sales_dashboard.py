"""Sales dashboard data helpers and chart-ready transformations."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class MonthlySales:
    month: str
    revenue: float
    orders: int


def build_sales_snapshot() -> list[MonthlySales]:
    """Return a baseline monthly sales snapshot."""

    return [
        MonthlySales("Jan", 12000.0, 120),
        MonthlySales("Feb", 15450.0, 142),
        MonthlySales("Mar", 16900.0, 158),
        MonthlySales("Apr", 14300.0, 133),
        MonthlySales("May", 18000.0, 166),
        MonthlySales("Jun", 20100.0, 181),
    ]


def to_chart_payload(rows: list[MonthlySales]) -> dict[str, list[float] | list[str] | float]:
    """Transform rows into chart-friendly payload."""

    total_revenue = sum(row.revenue for row in rows)
    total_orders = sum(row.orders for row in rows)
    avg_order_value = total_revenue / total_orders if total_orders else 0.0

    return {
        "labels": [row.month for row in rows],
        "revenue": [row.revenue for row in rows],
        "orders": [row.orders for row in rows],
        "total_revenue": round(total_revenue, 2),
        "total_orders": float(total_orders),
        "avg_order_value": round(avg_order_value, 2),
    }
