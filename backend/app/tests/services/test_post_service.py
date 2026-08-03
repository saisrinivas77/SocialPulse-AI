from unittest.mock import patch, MagicMock

from app.services import post_service


def test_post_service_get_posts(db_session):
    current_user = MagicMock(id=1)

    mock_posts = []

    with patch(
        "app.repositories.post_repository.get_all_by_user",
        return_value=mock_posts,
    ) as mock_get:

        result = post_service.get_posts(
            db_session,
            current_user,
        )

        mock_get.assert_called_once_with(
            db=db_session,
            user_id=1,
        )

        assert result == []