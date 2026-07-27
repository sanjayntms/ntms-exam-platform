# NTMS Exam Platform - REST API Reference

Base Endpoint: `/api/v1`

## Endpoints Summary

### Authentication (`/auth`)
- `POST /api/v1/auth/login`: Local persona authentication endpoint.
- `POST /api/v1/auth/entra`: Microsoft Entra ID OAuth2/OIDC token exchange.
- `GET /api/v1/auth/me`: Retrieve current active user profile.

### Exam Catalog (`/exams`)
- `GET /api/v1/exams`: List all active certification exams.
- `GET /api/v1/exams/:id`: Get full exam structure including sections and questions.
- `POST /api/v1/exams`: Create a new exam track (Requires `ADMINISTRATOR` or `EXAM_CREATOR`).

### Question Bank (`/questions`)
- `GET /api/v1/questions`: List all questions in bank.
- `GET /api/v1/questions/:id`: Get specific question details.
- `POST /api/v1/questions`: Create question item (Supports 16 question types).

### Exam Engine & Attempts (`/attempts`)
- `POST /api/v1/attempts/start`: Launch an exam attempt session.
- `POST /api/v1/attempts/submit`: Save progress or execute final evaluation.
- `GET /api/v1/attempts/my`: List user's historical attempts.
- `GET /api/v1/attempts/:id`: Fetch scorecard results.

### Analytics (`/analytics`)
- `GET /api/v1/analytics/dashboard`: Retrieve high-level stats, pass rates, and exam metrics.

### User Management (`/users`)
- `GET /api/v1/users`: List users (Requires `ADMINISTRATOR`).
- `POST /api/v1/users`: Provision user account.
- `PATCH /api/v1/users/:id/toggle-active`: Enable/disable user account.
