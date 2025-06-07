import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, refreshUser, checkVerificationStatus, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      checkEmailVerification();
    }
  }, [user]);

  const checkEmailVerification = async () => {
    try {
      const status = await checkVerificationStatus(user.email);
      setVerificationStatus(status.isVerified);
    } catch (err) {
      console.error('Error checking verification status:', err);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');
    setResendMessage('');
    
    try {
      await resendVerificationEmail(user.email);
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    setIsLoading(true);
    try {
      await refreshUser();
      await checkEmailVerification();
    } catch (err) {
      setError('Failed to refresh profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading-state">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <UserCircleIcon className="w-24 h-24 text-gray-400" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <div className="profile-email">
              <EnvelopeIcon className="w-5 h-5" />
              <span>{user.email}</span>
              {verificationStatus === true && (
                <CheckBadgeIcon className="w-5 h-5 text-green-500" title="Email verified" />
              )}
              {verificationStatus === false && (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" title="Email not verified" />
              )}
            </div>
            <div className="profile-joined">
              <CalendarIcon className="w-5 h-5" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {verificationStatus === false && (
          <div className="verification-warning">
            <div className="warning-content">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
              <div>
                <h3>Email Not Verified</h3>
                <p>Please verify your email address to access all features.</p>
              </div>
            </div>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            {resendMessage && (
              <div className="success-message">
                <p>{resendMessage}</p>
              </div>
            )}
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="verify-button"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Sending...
                </div>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </div>
        )}

        <div className="profile-stats">
          <div className="stat-item">
            <h3>Account Status</h3>
            <p className={`status ${verificationStatus ? 'verified' : 'unverified'}`}>
              {verificationStatus ? 'Verified' : 'Unverified'}
            </p>
          </div>
          <div className="stat-item">
            <h3>Member Since</h3>
            <p>{formatDate(user.createdAt)}</p>
          </div>
          <div className="stat-item">
            <h3>User ID</h3>
            <p>#{user.id}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button
            onClick={handleRefreshProfile}
            disabled={isLoading}
            className="secondary-button"
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Refreshing...
              </div>
            ) : (
              'Refresh Profile'
            )}
          </button>
          <button
            onClick={() => navigate('/')}
            className="primary-button"
          >
            Back to Events
          </button>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 