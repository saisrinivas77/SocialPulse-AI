from unittest.mock import patch

from app.services import dashboard_service


def test_dashboard_top_posts_service(db_session):
    mock_posts = []

    with patch(
        "app.repositories.dashboard_repository.get_top_posts",
        return_value=mock_posts,
    ) as mock_get:

        result = dashboard_service.get_top_posts(
            db_session,
            user_id=1,
            limit=10,
        )

        mock_get.assert_called_once_with(
            db_session,
            1,
            10,
        )

        assert result == []