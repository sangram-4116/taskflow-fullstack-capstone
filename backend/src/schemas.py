from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# --- Auth & User Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "member"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Comment Schemas ---
class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    content: str
    task_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None

class TaskStatusUpdate(BaseModel):
    status: str

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    project_id: int
    assigned_to: Optional[int]
    created_at: datetime
    comments: List[CommentOut] = []

    class Config:
        from_attributes = True
