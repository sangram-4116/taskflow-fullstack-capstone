# TaskFlow — Full-Stack Project & Task Management Portal

TaskFlow is an end-to-end, role-based **Project & Task Management Portal** built with **FastAPI**, **React (Vite)**, and **PostgreSQL**. It features stateless **JWT authentication**, **Role-Based Access Control (RBAC)** for Admins and Members, real-time task status tracking, and collaborative task comments.

---

## Live Deployment & Demo

* **Live Frontend Application (Vercel):** https://vercel.app
* **Live Backend API & Swagger Docs (Render):** https://onrender.com
* **Project Demo Video:** [Watch 5-Minute Walkthrough Video](https://drive.google.com/file/d/1ivU7e-y9phH4jNVeTVOL6Ebi_CFdv1le/view?usp=drive_link)

---

## Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM, Axios (with JWT Request/Response Interceptors), Custom Responsive CSS |
| **Backend** | Python 3.11, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib (`bcrypt`) |
| **Database** | PostgreSQL (Neon Serverless Cloud) / SQLite (Local Development) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend REST API), Neon (Managed PostgreSQL) |

---

## Key Features & Role-Based Access Control (RBAC)

* **Stateless JWT Authentication:** Secure user registration and login with `bcrypt` password hashing and Bearer token verification.
* **Admin Role Capabilities:**
  * Create and delete projects.
  * Create tasks inside projects and assign status workflows.
  * Update task statuses and participate in task comment threads.
* **Member Role Capabilities:**
  * View all workspace projects, tasks, and discussion threads.
  * Update task statuses (`To Do` → `In Progress` → `Done`).
  * Post comments on tasks (Admin-only creation/deletion controls are restricted at both UI and API middleware levels).

---

## Repository Structure

```text
taskflow-fullstack-capstone/
├── README.md                         # Project documentation, setup guide, & live links
├── .env.example                      # Environment variable template
├── docker-compose.yml                # Multi-container orchestration config
├── docs/
│   ├── architecture.md               # System architecture & request flow diagram
│   └── api-spec.md                   # Database ER schema & REST API specifications
├── frontend/
│   ├── vercel.json                   # SPA fallback routing configuration
│   ├── package.json                  # Frontend dependencies & scripts
│   └── src/
│       ├── App.jsx                   # Protected route definitions & auth state
│       ├── App.css                   # Responsive layout & component styling
│       ├── pages/
│       │   ├── AuthPage.jsx          # Login & Registration portal with role selection
│       │   └── Dashboard.jsx         # Role-aware Project, Task, & Comment workspace
│       └── services/
│           └── api.js                # Centralized Axios client & global interceptors
└── backend/
    ├── runtime.txt                   # Python 3.11 runtime pin for cloud deployment
    ├── requirements.txt              # Backend Python dependencies
    └── src/
        ├── main.py                   # FastAPI entry point, CORS setup, & router registration
        ├── database.py               # SQLAlchemy database engine & session dependency
        ├── models.py                 # User, Project, Task, & Comment relational models
        ├── schemas.py                # Pydantic request/response validation schemas
        ├── middleware/
        │   └── auth.py               # Reusable JWT decoding & RBAC guard dependencies
        └── routers/
            ├── auth.py               # Registration & Login endpoints
            ├── projects.py           # Project CRUD endpoints
            └── tasks.py              # Task creation, status updates, & comment endpoints
```

---

## REST API Documentation

Interactive Swagger UI is live at **`https://onrender.com`**. Full ER diagrams and payload schemas are available in [`docs/api-spec.md`](docs/api-spec.md).

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new `admin` or `member` account |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive a JWT access token |

### Projects (`/api/projects`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Authenticated | Retrieve all projects |
| `POST` | `/api/projects` | **Admin Only** | Create a new project |
| `DELETE` | `/api/projects/{project_id}` | **Admin Only** | Delete a project and its associated tasks |

### Tasks & Comments (`/api/projects/{id}/tasks` & `/api/tasks`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects/{project_id}/tasks` | Authenticated | Fetch all tasks and comments for a project |
| `POST` | `/api/projects/{project_id}/tasks` | **Admin Only** | Create a new task inside a project |
| `PATCH` | `/api/tasks/{task_id}/status` | Authenticated | Update task status (`todo`, `in_progress`, `done`) |
| `POST` | `/api/tasks/{task_id}/comments` | Authenticated | Post a comment on a task |

---

## Local Setup Instructions

### Prerequisites
* **Python 3.11+**
* **Node.js 18+** & **npm**
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com
cd taskflow-fullstack-capstone
```

### 2. Backend Setup (`FastAPI`)
```bash
cd backend
python -m venv venv

# Activate virtual environment:
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
```
Create a `backend/.env` file (refer to `.env.example`):
```env
DATABASE_URL=sqlite:///./taskflow.db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
```
Start the backend server:
```bash
uvicorn src.main:app --reload
```
*Local API Docs will be available at `http://127.0.0`.*

### 3. Frontend Setup (`React + Vite`)
Open a second terminal:
```bash
cd frontend
npm install
```
Create a `frontend/.env` file:
```env
VITE_API_URL=http://127.0.0
```
Start the frontend development server:
```bash
npm run dev
```
*Open `http://localhost:5173` in your browser.*
