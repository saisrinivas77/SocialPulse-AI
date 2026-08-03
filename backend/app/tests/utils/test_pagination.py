from app.utils.pagination import paginate
from app.models.user import User
from app.models.social_account import SocialAccount
from app.models.post import Post


def test_paginate_with_foreign_key(db_session):
    user = User(
        first_name="Page",
        last_name="User",
        username="page_user",
        email="page@example.com",
        password_hash="hashedpassword",
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    account = SocialAccount(
        user_id=user.id,
        platform="Instagram",
        account_name="Page Account",
        account_username="page_user",
    )

    db_session.add(account)
    db_session.commit()
    db_session.refresh(account)

    post = Post(
        user_id=user.id,
        social_account_id=account.id,
        title="Paginate Test",
        content="Testing pagination",
        status="Draft",
    )

    db_session.add(post)
    db_session.commit()

    query = db_session.query(Post)

    result = paginate(
        query,
        page=1,
        page_size=1,
    )

    assert result.page == 1
    assert result.page_size == 1
    assert result.total == 1
    assert result.pages == 1
    assert result.items[0].title == "Paginate Test"