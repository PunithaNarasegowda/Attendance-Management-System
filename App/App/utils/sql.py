from collections.abc import Sequence
from typing import Any


def rows(result: Any) -> list[dict[str, Any]]:
    return [dict(item) for item in result.mappings().all()]


def one_or_none(result: Any) -> dict[str, Any] | None:
    item = result.mappings().first()
    return dict(item) if item else None


def normalize_lecture_status(value: str | None) -> str:
    if not value:
        return "scheduled"
    lowered = value.strip().lower()
    if lowered in {"completed", "finalized"}:
        return "finalized"
    if lowered == "ongoing":
        return "ongoing"
    if lowered == "scheduled":
        return "scheduled"
    return lowered


def denormalize_lecture_status(value: str | None) -> str:
    lowered = (value or "scheduled").strip().lower()
    if lowered == "finalized":
        return "Completed"
    if lowered == "ongoing":
        return "Ongoing"
    return "Scheduled"


def to_integers(values: Sequence[Any]) -> list[int]:
    output: list[int] = []
    for value in values:
        try:
            output.append(int(value))
        except (TypeError, ValueError):
            continue
    return output