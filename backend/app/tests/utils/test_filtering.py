from app.utils.filtering import apply_filters
from app.models.user import User


def test_filtering_single(db_session):
    user = User(
        first_name="Filter",
        last_name="User",
        username="filter_user",
        email="filter@example.com",
        password_hash="hashedpassword",
    )

    db_session.add(user)
    db_session.commit()

    query = db_session.query(User)
    filters = {"email": "filter@example.com"}

    result = apply_filters(query, User, filters)

    assert result.first().email == "filter@example.com"


def test_filtering_unknown_field(db_session):
    query = db_session.query(User)

    filters = {
        "unknown": "value"
    }

    result = apply_filters(query, User, filters)

    assert isinstance(result, type(query))