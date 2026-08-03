from app.repositories import dashboard_repository
from app.models.user import User
from app.models.social_account import SocialAccount
from app.models.post import Post
from app.models.analytics import Analytics


def create_user(db):
    user = User(
        first_name="Dashboard",
        last_name="Tester",
        username="dashboard_user",
        email="dashboard@example.com",
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
        account_name="Dashboard Account",
        account_username="dashboard_user",
        is_connected=True,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def create_post(db, user, account):
    post = Post(
        user_id=user.id,
        social_account_id=account.id,
        title="Dashboard Post",
        content="Repository test",
        status="Draft",
        engagement_rate=8.5,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def create_analytics(db, user, account):
    analytics = Analytics(
        user_id=user.id,
        social_account_id=account.id,
        platform="Instagram",
        followers=100,
        following=20,
        posts=1,
        likes=50,
        comments=5,
        shares=2,
        views=500,
        reach=450,
        impressions=600,
        profile_visits=25,
        website_clicks=3,
        engagement_rate=8.5,
        growth_rate=2.3,
    )
    db.add(analytics)
    db.commit()
    db.refresh(analytics)
    return analytics


def test_dashboard_summary(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    create_post(db_session, user, account)
    create_analytics(db_session, user, account)

    summary = dashboard_repository.get_dashboard_summary(
        db_session,
        user.id,
    )

    assert summary["total_accounts"] == 1
    assert summary["total_posts"] == 1
    assert summary["total_followers"] == 100
    assert summary["total_following"] == 20


def test_platform_breakdown(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    create_post(db_session, user, account)
    create_analytics(db_session, user, account)

    rows = dashboard_repository.get_platform_breakdown(
        db_session,
        user.id,
    )

    assert len(rows) == 1
    assert rows[0][0] == "Instagram"


def test_top_posts(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    create_post(db_session, user, account)

    posts = dashboard_repository.get_top_posts(
        db_session,
        user.id,
    )

    assert len(posts) == 1
    assert posts[0].title == "Dashboard Post"


def test_top_platforms(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    create_analytics(db_session, user, account)

    rows = dashboard_repository.get_top_platforms(
        db_session,
        user.id,
    )

    assert len(rows) == 1
    assert rows[0][0] == "Instagram"
    assert rows[0][1] == 100