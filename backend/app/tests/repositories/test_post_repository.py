from app.repositories import post_repository
from app.models.user import User
from app.models.social_account import SocialAccount
from app.models.post import Post


def create_user(db):
    user = User(
        first_name="Repo",
        last_name="User",
        username="repo_user",
        email="repo@example.com",
        password_hash="hashedpassword",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_social_account(db, user):
    account = SocialAccount(
        user_id=user.id,
        platform="Instagram",
        account_name="Repo Account",
        account_username="repo_user",
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def test_post_repository_create(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    post = Post(
        user_id=user.id,
        social_account_id=account.id,
        title="Repository Test",
        content="Hello from pytest",
        status="Draft",
    )

    created = post_repository.create(db_session, post)

    assert created.id is not None
    assert created.title == "Repository Test"

    fetched = post_repository.get_by_id(db_session, created.id)

    assert fetched is not None
    assert fetched.title == "Repository Test"
    assert fetched.user_id == user.id


def test_get_all_by_user(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    for i in range(3):
        post_repository.create(
            db_session,
            Post(
                user_id=user.id,
                social_account_id=account.id,
                title=f"Post {i}",
                content=f"Content {i}",
                status="Draft",
            ),
        )

    posts = post_repository.get_all_by_user(
        db_session,
        user.id,
    )

    assert len(posts) == 3