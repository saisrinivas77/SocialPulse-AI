from sqlalchemy.orm import Query

def apply_sorting(
    query: Query,
    model: type,
    sort_by: str,
    sort_order: str = "asc",
) -> Query:
    ALLOWED_SORT_FIELDS = {"engagement_rate", "created_at", "updated_at", "recorded_at"}
    if sort_by not in ALLOWED_SORT_FIELDS:
        return query
    column = getattr(model, sort_by)
    return query.order_by(column.desc() if sort_order.lower() == "desc" else column.asc())
