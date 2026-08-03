from app.utils.sorting import apply_sorting
from app.models.post import Post

def test_sorting_valid_field(db_session):
    query = db_session.query(Post)
    result = apply_sorting(query, Post, "created_at", "asc")
    assert isinstance(result, type(query))

def test_sorting_invalid_field(db_session):
    query = db_session.query(Post)
    result = apply_sorting(query, Post, "invalid_field", "asc")
    # Should return original query without crashing
    assert isinstance(result, type(query))
