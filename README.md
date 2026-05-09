# Full-Stack-Task-Management-App
A production-ready, full-stack task management platform designed to demonstrate
end-to-end software engineering — from database schema design and secure REST API
development to containerized deployment and automated testing pipelines.

The backend is a Node.js/Express REST API backed by PostgreSQL, with JWT-based
stateless authentication (15-minute access tokens + 7-day refresh token rotation)
and role-based access control enforcing Admin, Member, and Viewer permission levels.
All API endpoints are documented with Swagger/OpenAPI, accessible at /api-docs.

The frontend is a React.js single-page application that connects to the backend over
REST and receives live task status changes via a WebSocket connection — so all team
members see updates the moment they happen, without polling.

The entire stack is containerized with Docker and Docker Compose, making local setup
a single command. A GitHub Actions CI/CD pipeline runs ESLint, then Jest + Supertest
integration tests (enforcing 90%+ line coverage), and on a passing main branch push,
auto-deploys to an AWS EC2 instance via SSH with Nginx serving as a reverse proxy.
