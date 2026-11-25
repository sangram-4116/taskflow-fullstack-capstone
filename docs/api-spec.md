# Database Schema & REST API Specification

## 1. Entity-Relationship (ER) Schema

```text
+------------------+       1:N       +--------------------+

|      users       |---------------->|      projects      |
+------------------+                 +--------------------+

| id (PK, UUID)    |                 | id (PK, UUID)      |
| name             |                 | title              |
| email (UNIQUE)   |                 | description        |
| password_hash    |                 | created_by (FK)    |
| role (admin/mbr) |                 | created_at         |
| created_at       |                 +---------+----------+
+--------+---------+                           | 1:N
         |                                     v
         |                           +--------------------+
         +----------> 1:N ---------->|       tasks        |
         |                           +--------------------+

         |                           | id (PK, UUID)      |
         |                           | project_id (FK)    |
         |                           | title              |
         |                           | description        |
         |                           | status (todo/...)  |
         |                           | assigned_to (FK)   |
         |                           | created_at         |
         |                           +---------+----------+

         |                                     | 1:N
         |                                     v
         |                           +--------------------+
         +----------> 1:N ---------->|      comments      |
                                     +--------------------+

                                     | id (PK, UUID)      |
                                     | task_id (FK)       |
                                     | user_id (FK)       |
                                     | content            |
                                     | created_at         |
                                     +--------------------+
```

---

## 2. REST API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new `admin` or `member` user |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return JWT + user profile |

### Projects (`/api/projects`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Authenticated | List all projects |
| `POST` | `/api/projects` | **Admin Only** | Create a new project |
| `DELETE` | `/api/projects/{project_id}` | **Admin Only** | Delete a project and cascade its tasks |

### Tasks & Comments (`/api/projects/{id}/tasks` & `/api/tasks`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects/{project_id}/tasks` | Authenticated | List all tasks and nested comments for a project |
| `POST` | `/api/projects/{project_id}/tasks` | **Admin Only** | Create a new task inside a project |
| `PATCH` | `/api/tasks/{task_id}/status` | Authenticated | Update task status (`todo`, `in_progress`, `done`) |
| `POST` | `/api/tasks/{task_id}/comments` | Authenticated | Add a comment to a task |
