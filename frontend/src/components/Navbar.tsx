import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function Navbar({ isAuthenticated, onLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-menu navbar-menu-centered">
        {isAuthenticated ? (
          <>
            <button onClick={onLogout} className="navbar-item logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 