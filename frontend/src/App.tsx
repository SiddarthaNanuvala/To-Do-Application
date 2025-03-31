import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskManager from './pages/TaskManager';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier si le token est valide
      fetch('http://localhost:5000/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Token invalide');
      })
      .then(data => {
        setIsAuthenticated(true);
        setUserId(data.id);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} /> : <Navigate to="/tasks" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/tasks" />} />
            <Route path="/tasks" element={isAuthenticated ? <TaskManager userId={userId} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
