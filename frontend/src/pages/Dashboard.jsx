import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        selectProject(res.data[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const selectProject = async (project) => {
    setSelectedProject(project);
    try {
      const res = await api.get(`/projects/${project.id}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', newProject);
      setNewProject({ title: '', description: '' });
      setProjects([res.data, ...projects]);
      selectProject(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      setSelectedProject(updated[0] || null);
      if (updated[0]) selectProject(updated[0]);
      else setTasks([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const res = await api.post(`/projects/${selectedProject.id}/tasks`, newTask);
      setNewTask({ title: '', description: '' });
      setTasks([...tasks, res.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddComment = async (taskId) => {
    const content = commentText[taskId];
    if (!content?.trim()) return;
    try {
      await api.post(`/tasks/${taskId}/comments`, { content });
      setCommentText({ ...commentText, [taskId]: '' });
      selectProject(selectedProject);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="topbar">
        <h1>TaskFlow Capstone</h1>
        <div className="user-info">
          <span>
            {user.name} <strong className={`badge ${user.role}`}>{user.role.toUpperCase()}</strong>
          </span>
          <button onClick={onLogout} className="btn-outline">Logout</button>
        </div>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="main-grid">
        <aside className="sidebar card">
          <h3>Projects</h3>
          {user.role === 'admin' && (
            <form onSubmit={handleCreateProject} className="stack-form">
              <input
                type="text"
                placeholder="New Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <button type="submit" className="btn-primary">+ Create Project</button>
            </form>
          )}
          <ul className="project-list">
            {projects.map((p) => (
              <li
                key={p.id}
                className={selectedProject?.id === p.id ? 'active' : ''}
                onClick={() => selectProject(p)}
              >
                <span>{p.title}</span>
                {user.role === 'admin' && (
                  <button
                    className="btn-danger-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(p.id);
                    }}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="workspace">
          {selectedProject ? (
            <>
              <div className="card">
                <h2>{selectedProject.title}</h2>
                <p className="subtitle">{selectedProject.description || 'No description provided.'}</p>

                {user.role === 'admin' && (
                  <form onSubmit={handleCreateTask} className="inline-form">
                    <input
                      type="text"
                      placeholder="New Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Task Details"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <button type="submit" className="btn-primary">Add Task</button>
                  </form>
                )}
              </div>

              <div className="tasks-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="card task-card">
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <p>{task.description}</p>

                    <div className="comments-box">
                      <h5>Comments ({task.comments?.length || 0})</h5>
                      {task.comments?.map((c) => (
                        <div key={c.id} className="comment-item">
                          {c.content}
                        </div>
                      ))}
                      <div className="comment-input">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[task.id] || ''}
                          onChange={(e) =>
                            setCommentText({ ...commentText, [task.id]: e.target.value })
                          }
                        />
                        <button onClick={() => handleAddComment(task.id)} className="btn-outline">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card">
              <p>No projects yet. {user.role === 'admin' ? 'Create one on the left!' : 'Ask an Admin to create a project.'}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
