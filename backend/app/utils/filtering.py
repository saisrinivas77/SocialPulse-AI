from sqlalchemy.orm import Query

def apply_filters(query: Query, model: type, filters: dict) -> Query:
    for field, value in filters.items():
        if hasattr(model, field) and value is not None:
            query = query.filter(getattr(model, field) == value)
    return query
