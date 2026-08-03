def test_caption_hashtag_sentiment(client, auth_headers):
    r = client.post(
        "/api/v1/caption",
        headers=auth_headers,
        json={"topic": "Hello"},
    )
    assert r.status_code == 200
    assert "caption" in r.json()

    r = client.post(
        "/api/v1/hashtag",
        headers=auth_headers,
        json={"topic": "Hello"},
    )
    assert r.status_code == 200
    body = r.json()
    assert "hashtags" in body
    assert isinstance(body["hashtags"], list)

    r = client.post(
        "/api/v1/sentiment",
        headers=auth_headers,
        json={"text": "Hello world"},
    )
    assert r.status_code == 200
    body = r.json()
    assert "label" in body
    assert "score" in body