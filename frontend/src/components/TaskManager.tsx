import { useState, useEffect } from 'react';
import './TaskManager.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface TaskManagerProps {
  userId: number | null;
}

function TaskManager({ userId }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tasks
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/tasks?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Error retrieving tasks');
      }
      
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Unable to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          userId: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error creating task');
      }
      
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '' });
      setError('');
    } catch (err) {
      setError('Unable to create task. Please try again.');
      console.error(err);
    }
  };

  // Update a task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask || !editingTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          userId: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error updating task');
      }
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Unable to update task. Please try again.');
      console.error(err);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error deleting task');
      }
      
      setTasks(tasks.filter(task => task.id !== id));
      setError('');
    } catch (err) {
      setError('Unable to delete task. Please try again.');
      console.error(err);
    }
  };

  // Change task status
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          status: status,
          userId: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error updating task status');
      }
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setError('');
    } catch (err) {
      setError('Unable to update status. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Task add form */}
      <div className="task-form-container">
        <h2>Add a new task</h2>
        <form onSubmit={handleAddTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Task title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>
      
      {/* Task list */}
      <div className="tasks-container">
        <h2>My Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Add one!</p>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className={`task-card ${task.status}`}>
                {editingTask && editingTask.id === task.id ? (
                  <form onSubmit={handleUpdateTask} className="edit-task-form">
                    <div className="form-group">
                      <label htmlFor={`edit-title-${task.id}`}>Title</label>
                      <input
                        type="text"
                        id={`edit-title-${task.id}`}
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`edit-description-${task.id}`}>Description</label>
                      <textarea
                        id={`edit-description-${task.id}`}
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`edit-status-${task.id}`}>Status</label>
                      <select
                        id={`edit-status-${task.id}`}
                        value={editingTask.status}
                        onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                      >
                        <option value="pending">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="btn-primary">Save</button>
                      <button type="button" className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <div className="task-status">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`status-select ${task.status}`}
                        >
                          <option value="pending">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <p className="task-description">{task.description || "No description"}</p>
                    <div className="task-footer">
                      <span className="task-date">Created on {new Date(task.created_at).toLocaleDateString()}</span>
                      <div className="task-actions">
                        <button onClick={() => setEditingTask(task)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager; 