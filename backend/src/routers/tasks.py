from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..middleware.auth import get_current_user, require_admin
from ..models import Comment, Project, Task, User
from ..schemas import CommentCreate, CommentOut, TaskCreate, TaskOut, TaskStatusUpdate

router = APIRouter(prefix="/api", tags=["Tasks & Comments"])

@router.get("/projects/{project_id}/tasks", response_model=List[TaskOut])
def list_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Task).filter(Task.project_id == project_id).all()

@router.post("/projects/{project_id}/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    project_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task = Task(
        title=task_in.title,
        description=task_in.description,
        project_id=project_id,
        assigned_to=task_in.assigned_to,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/tasks/{task_id}/status", response_model=TaskOut)
def update_task_status(
    task_id: int,
    status_in: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if status_in.status not in ("todo", "in_progress", "done"):
        raise HTTPException(status_code=400, detail="Invalid task status")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = status_in.status
    db.commit()
    db.refresh(task)
    return task

@router.post("/tasks/{task_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def add_comment(
    task_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    comment = Comment(
        content=comment_in.content,
        task_id=task_id,
        user_id=current_user.id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
