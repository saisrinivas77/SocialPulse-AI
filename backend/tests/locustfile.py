# tests/locustfile.py
"""Locust Load Test Script simulating high concurrency performance on SocialPulse AI backend."""

from locust import HttpUser, between, task


class SocialPulseUser(HttpUser):
    """Locust performance testing user for SocialPulse AI backend."""

    wait_time = between(1, 3)

    @task(3)
    def check_health(self):
        self.client.get("/api/v1/health")

    @task(2)
    def check_liveness(self):
        self.client.get("/api/v1/live")

    @task(1)
    def generate_caption(self):
        self.client.post("/api/v1/caption", json={"topic": "Load Testing"})

    @task(1)
    def check_openapi(self):
        self.client.get("/api/v1/openapi.json")
