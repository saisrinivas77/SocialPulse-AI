from app.repositories import analytics_repository
from app.models.user import User
from app.models.social_account import SocialAccount
from app.models.analytics import Analytics


def create_user(db):
    user = User(
        first_name="Analytics",
        last_name="Tester",
        username="analytics_user",
        email="analytics@example.com",
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
        account_name="Analytics Account",
        account_username="analytics_user",
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def test_create_and_get_analytics(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    analytics = Analytics(
        user_id=user.id,
        social_account_id=account.id,
        platform="Instagram",
        followers=100,
        following=50,
        posts=10,
        likes=200,
        comments=25,
        shares=10,
        views=1000,
        reach=900,
        impressions=1200,
        profile_visits=30,
        website_clicks=5,
        engagement_rate=5.5,
        growth_rate=2.0,
    )

    created = analytics_repository.create(db_session, analytics)

    assert created.id is not None
    assert created.followers == 100

    fetched = analytics_repository.get_by_id(
        db_session,
        created.id,
    )

    assert fetched is not None
    assert fetched.platform == "Instagram"
    assert fetched.followers == 100
    assert fetched.posts == 10


def test_get_all_by_user(db_session):
    user = create_user(db_session)
    account = create_social_account(db_session, user)

    for i in range(3):
        analytics_repository.create(
            db_session,
            Analytics(
                user_id=user.id,
                social_account_id=account.id,
                platform="Instagram",
                followers=100 + i,
                following=50,
                posts=10,
                likes=20,
                comments=5,
                shares=1,
                views=100,
                reach=90,
                impressions=110,
                profile_visits=3,
                website_clicks=1,
                engagement_rate=4.5,
                growth_rate=1.5,
            ),
        )

    analytics = analytics_repository.get_all_by_user(
        db_session,
        user.id,
    )

    assert len(analytics) == 3