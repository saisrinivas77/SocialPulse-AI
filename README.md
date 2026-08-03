# SocialPulse AI — Enterprise AI-Powered Social Media Analytics Platform

> **Tagline**: AI-Powered Social Media Analytics, Growth Orchestration, and Content Intelligence Operating System.

---

## 🏛️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer
        UI["Next.js 15 App Router / React 19 Client UI"]
        State["Zustand App Store & TanStack Query Cache"]
    end

    subgraph Security & Gateway Layer
        Nginx["Nginx SSL / HTTPS Reverse Proxy (:443)"]
        FastAPI["FastAPI Gateway /api/v1 (:8000)"]
        AuthGuard["JWT Auth & SlowAPI Rate Limiter"]
    end

    subgraph Domain Services & Business Logic
        UserService["User & Workspace Service"]
        SocialService["Social Account & OAuth 2.0 Service"]
        PostService["Post & Scheduler Queue Service"]
        AIService["LLM Generative AI Studio Engine"]
        AnalyticsService["Telemetry & Analytics Service"]
        BillingService["Tiered Subscription Quota Manager"]
    end

    subgraph Data & Queue Layer
        PostgreSQL[("PostgreSQL 16 Database")]
        Redis[("Redis 7 In-Memory Cache & Message Broker")]
        CeleryWorker["Celery Background Async Workers"]
        CeleryBeat["Celery Beat Periodic Scheduler"]
    end

    UI <--> State
    State <--> Nginx
    Nginx <--> FastAPI
    FastAPI --> AuthGuard
    AuthGuard --> UserService
    AuthGuard --> SocialService
    AuthGuard --> PostService
    AuthGuard --> AIService
    AuthGuard --> AnalyticsService
    AuthGuard --> BillingService

    UserService & SocialService & PostService & AnalyticsService --> PostgreSQL
    AIService -->|LLM API Calls| ExternalLLM["OpenAI / Claude / DeepSeek APIs"]
    CeleryWorker & CeleryBeat <--> Redis
    CeleryWorker --> PostgreSQL
```

---

## 🗄️ Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ WORKSPACE_MEMBERS : belongs_to
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o{ SOCIAL_ACCOUNTS : connects
    WORKSPACES ||--o{ POSTS : schedules
    WORKSPACES ||--o{ MEDIA_ASSETS : stores
    WORKSPACES ||--o{ ANALYTICS_SNAPSHOTS : tracks
    WORKSPACES ||--o{ AUDIT_LOGS : records
    USERS ||--o{ NOTIFICATIONS : receives

    USERS {
        uuid id PK
        string email UK
        string hashed_password
        string full_name
        string role
        datetime created_at
    }

    WORKSPACES {
        uuid id PK
        string name
        string tier
        string logo
        uuid owner_id FK
    }

    SOCIAL_ACCOUNTS {
        uuid id PK
        uuid workspace_id FK
        string platform
        string username
        string access_token
        string refresh_token
        int followers_count
        int sync_health
        datetime last_synced
    }

    POSTS {
        uuid id PK
        uuid workspace_id FK
        string title
        text content
        string platform
        string status
        datetime scheduled_for
        int impressions
        float engagement_rate
    }

    MEDIA_ASSETS {
        uuid id PK
        uuid workspace_id FK
        string title
        string file_type
        string url
        int size_bytes
    }

    ANALYTICS_SNAPSHOTS {
        uuid id PK
        uuid workspace_id FK
        int total_followers
        int monthly_reach
        float engagement_rate
        float revenue_attribution
        datetime captured_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid workspace_id FK
        string action
        string performed_by
        datetime timestamp
    }
```

---

## 📡 API Overview & Key Modules

| Module | Canonical Route | HTTP Method | Description |
| :--- | :--- | :---: | :--- |
| **Auth** | `/api/v1/auth/login` | `POST` | OAuth2 Password Grant login & JWT retrieval |
| **Users** | `/api/v1/users/me` | `GET` | Retrieve current authenticated user profile & permissions |
| **Workspaces** | `/api/v1/workspaces` | `GET` | List accessible workspace organizations |
| **Social Accounts** | `/api/v1/social-accounts` | `GET` | List connected accounts & health metrics |
| **OAuth Connect** | `/api/v1/social-accounts/oauth/{platform}/authorize` | `GET` | Generate official OAuth 2.0 authorization URL |
| **Telemetry Sync** | `/api/v1/social-accounts/{id}/sync` | `POST` | Trigger asynchronous social platform data sync |
| **Posts Queue** | `/api/v1/posts/scheduled` | `GET` | List scheduled, published, and draft posts |
| **Create Post** | `/api/v1/posts` | `POST` | Create or schedule multi-platform post |
| **AI Captioning** | `/api/v1/caption/generate` | `POST` | Synthesize brand-tuned AI social media captions |
| **AI Hashtags** | `/api/v1/hashtag/generate` | `/POST` | Generate high-virality hashtag clusters |
| **Sentiment Analysis** | `/api/v1/sentiment/analyze` | `POST` | Perform NLP sentiment & emotion breakdown |
| **Dashboard Overview** | `/api/v1/dashboard/overview` | `GET` | Retrieve live aggregated KPI metric telemetry |
| **Reports Export** | `/api/v1/reports/export` | `POST` | Export executive reports (PDF, CSV, Excel) |
| **WebSockets** | `/api/v1/ws/notifications` | `WS` | Stream live notifications & telemetry updates |
| **Billing & Quotas** | `/api/v1/billing/plans` | `GET` | Retrieve SaaS subscription tiers & usage limits |

---

## 🎬 5–10 Minute Executive Demo Script

### Act 1: Authentication & Workspace Context (1 Minute)
1. **Launch App**: Open `http://localhost:3000`. Observe the luxury metallic gold editorial design system.
2. **Workspace Switcher**: Click the workspace dropdown on the top-left sidebar to toggle between `Pulse Enterprise`, `Acme Global Brand`, and `Personal AI Studio`. Notice instant state synchronization.

### Act 2: Connecting Social Gateways & OAuth (1.5 Minutes)
1. **Navigate**: Click **Social Accounts** in the sidebar navigation.
2. **Inspect Platform Cards**: Review status meters and vector brand logos for Instagram, LinkedIn, X, TikTok, YouTube, Facebook, Threads, and Pinterest.
3. **Trigger Sync**: Click **Sync Now** on the LinkedIn card to execute real-time telemetry synchronization via backend API.

### Act 3: AI Content Studio & LLM Generation (2.5 Minutes)
1. **Navigate**: Click **AI Studio** in the sidebar.
2. **Select LLM Model**: Select `SocialPulse Fine-Tuned v3.5` or `Claude 3.5 Sonnet`.
3. **Adjust Brand Voice**: Adjust the **Sophistication Index** slider to `85%` and **Boldness** to `70%`.
4. **Synthesize Caption**: Enter concept: *"Announcing SocialPulse AI Q3 platform release"* and click **Generate with AI**.
5. **Direct Queue**: Review synthesized output and click **Queue Post** to push directly into the post queue.

### Act 4: Post Scheduler & Queue Management (1.5 Minutes)
1. **Navigate**: Click **Posts & Queue** and **Calendar**.
2. **Inspect Queue**: View posts organized across Month Grid and Agenda list view.
3. **Filter**: Toggle status tabs between `All`, `Scheduled`, `Published`, and `Drafts`.

### Act 5: Executive Analytics & PDF Report Generation (1.5 Minutes)
1. **Navigate**: Click **Dashboard** and **Analytics**.
2. **Review Telemetry**: Observe animated CountUp statistics for **149.8K Followers**, **2.45M Reach**, **5.84% Engagement**, and Recharts area graphs.
3. **Export Report**: Click **Reports**, select **Q3 Executive Performance Brief**, and click **Preview PDF** to trigger executive PDF viewer modal.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL & Redis (or Docker)

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 🐳 Production Docker Deployment

To launch the full production stack (Frontend, FastAPI, PostgreSQL, Redis, Celery Worker, Celery Beat, Nginx SSL):

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend API Base URL | `http://localhost:8000/api/v1` |
| `POSTGRES_SERVER` | Database Server Host | `localhost` / `db` |
| `POSTGRES_USER` | Database User | `postgres` |
| `POSTGRES_PASSWORD` | Database Password | `postgres_secure_pw` |
| `POSTGRES_DB` | Database Name | `socialpulse_db` |
| `REDIS_HOST` | Redis Server Host | `localhost` / `redis` |
| `SECRET_KEY` | JWT Signing Secret | `super-secret-production-key` |
| `SENTRY_DSN` | Sentry Error Tracking DSN | `https://examplePublicKey@o0.ingest.sentry.io/0` |
