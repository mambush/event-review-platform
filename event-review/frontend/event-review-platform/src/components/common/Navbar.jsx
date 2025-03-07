import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationCenter from '../notifications/NotificationCenter';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          EventReview AI
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">Events</Link>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/calendar">Calendar</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {currentUser ? (
              <>
                <div className="position-relative me-3">
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="bi bi-bell-fill"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, width: '300px' }}>
                      <NotificationCenter onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>
                
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src={currentUser.profilePic || 'https://via.placeholder.com/30'}
                      alt="Profile"
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                    <span>{currentUser.username}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">Profile</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                <Link to="/register" className="btn btn-light">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;