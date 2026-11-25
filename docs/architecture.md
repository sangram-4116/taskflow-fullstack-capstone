# System Architecture — TaskFlow Capstone

## 1. High-Level Architecture Overview
TaskFlow follows a decoupled **Three-Tier Client-Server Architecture**:
1. **Presentation Layer (Frontend):** React Single Page Application (SPA) built with Vite, React Router, and Axios, hosted on **Vercel**.
2. **Application Layer (Backend API):** RESTful API built with Python **FastAPI**, SQLAlchemy ORM, and Pydantic validation, hosted on **Render**.
3. **Data Layer (Database):** Managed relational **PostgreSQL** database hosted on **Neon Serverless Cloud**.

---

## 2. Architecture & Request Flow Diagram

```text
+-----------------------------------------------------------------------+

|                        CLIENT (React + Vite SPA)                      |
|  - AuthPage (Login / Register)   - Dashboard (Projects, Tasks, RBAC)  |
|  - Centralized Axios Client (frontend/src/services/api.js)            |
|    * Request Interceptor: Attaches `Authorization: Bearer <JWT>`      |
|    * Response Interceptor: Handles 401 expiry & global error alerts   |
+-----------------------------------+-----------------------------------+
                                    | HTTPS / JSON REST API
                                    v
+-----------------------------------------------------------------------+

|                       BACKEND API (FastAPI + Python)                  |
|  - CORS Middleware (Restricts origin to Vercel Production URL)        |
|  - Auth & RBAC Middleware (backend/src/middleware/auth.py)            |
|    * Verifies JWT Signature & Expiration                              |
|    * Enforces Role Permissions (`admin` vs `member`)                  |
|  - Modular Routers: /api/auth, /api/projects, /api/tasks              |
+-----------------------------------+-----------------------------------+
                                    | SQLAlchemy ORM (TCP / SSL)
                                    v
+-----------------------------------------------------------------------+

|                   DATABASE (Neon Cloud PostgreSQL)                    |
|  - users (id, name, email, password_hash, role, created_at)           |
|  - projects (id, title, description, created_by, created_at)          |
|  - tasks (id, project_id, title, description, status, assigned_to)    |
|  - comments (id, task_id, user_id, content, created_at)               |
+-----------------------------------------------------------------------+
```

---

## 3. Security & Authentication Flow
1. **Registration & Password Hashing:** User passwords are salted and hashed with **bcrypt** (`passlib`) before insertion into PostgreSQL.
2. **Stateless JWT Issuance:** On `/api/auth/login`, the server issues a signed HS256 JSON Web Token containing the user's `sub` (ID) and `role` (`admin` or `member`).
3. **Role-Based Access Control (RBAC):** Protected routes depend on `get_current_user` and `require_admin` in `backend/src/middleware/auth.py`, rejecting unauthorized requests with HTTP `401` or `403`.
