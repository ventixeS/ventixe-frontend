import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import './AuthButton.css';

const AuthButton = ({ className = '' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isAuthenticated && user) {
    return (
      <div className={`auth-button-container ${className}`}>
        <div className="user-menu">
          <Link to="/profile" className="user-profile-link">
            <UserCircleIcon className="w-8 h-8" />
            <span className="user-name">{user.name}</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-button-container ${className}`}>
      <div className="auth-actions">
        <Link to="/login" className="login-btn">
          Sign In
        </Link>
        <Link to="/register" className="register-btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default AuthButton; 