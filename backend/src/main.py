import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import auth, projects, tasks

load_dotenv()

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow Full-Stack Capstone API",
    description="Role-based project and task management REST API",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "TaskFlow API is running"}
