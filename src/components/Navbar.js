import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Equipment Lending Portal
          </Link>
          
          {user ? (
            <div className="navbar-menu">
              <div className="navbar-links">
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/equipment" className="navbar-link">Equipment</Link>
                <Link to="/borrow-requests" className="navbar-link">My Requests</Link>
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link to="/admin" className="navbar-link">Admin</Link>
                )}
              </div>
              
              <div className="navbar-user">
                <span className="user-info">
                  Welcome, {user.fullName} ({user.role})
                </span>
                <Link to="/profile" className="navbar-link">Profile</Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;