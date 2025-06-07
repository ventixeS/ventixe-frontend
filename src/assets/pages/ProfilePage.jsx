import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
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
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main>
            <div className="profile-container">
              <div className="profile-card">
                <div className="loading-state">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                  <p>Loading profile...</p>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="portal-wrapper">
      <Nav />
      <div className="content-area">
        <Header />
        <main className="profile-main">
          <div className="profile-header">
            <div className="header-content">
              <h1>Account Profile</h1>
              <p>Manage your account settings and preferences</p>
            </div>
            <div className="header-actions">
              <button
                onClick={handleRefreshProfile}
                disabled={isLoading}
                className="refresh-btn"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Profile'}
              </button>
            </div>
          </div>

          <div className="profile-grid">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="card-header">
                <h2>Profile Information</h2>
              </div>
              <div className="card-content">
                <div className="profile-avatar-section">
                  <div className="avatar-container">
                    <UserCircleIcon className="avatar-icon" />
                  </div>
                  <div className="profile-details">
                    <h3 className="user-name">{user.name}</h3>
                    <div className="user-email">
                      <EnvelopeIcon className="email-icon" />
                      <span>{user.email}</span>
                      {verificationStatus === true && (
                        <CheckBadgeIcon className="verified-icon" title="Email verified" />
                      )}
                      {verificationStatus === false && (
                        <ExclamationTriangleIcon className="unverified-icon" title="Email not verified" />
                      )}
                    </div>
                    <div className="user-joined">
                      <CalendarIcon className="calendar-icon" />
                      <span>Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="status-card">
              <div className="card-header">
                <h2>Account Status</h2>
              </div>
              <div className="card-content">
                <div className="status-items">
                  <div className="status-item">
                    <div className="status-label">Verification Status</div>
                    <div className={`status-value ${verificationStatus ? 'verified' : 'unverified'}`}>
                      {verificationStatus ? (
                        <><CheckBadgeIcon className="status-icon verified" /> Verified</>
                      ) : (
                        <><ExclamationTriangleIcon className="status-icon unverified" /> Unverified</>
                      )}
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">User ID</div>
                    <div className="status-value">#{user.id}</div>
                  </div>
                  <div className="status-item">
                    <div className="status-label">Account Type</div>
                    <div className="status-value">Standard Member</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Verification Card */}
            {verificationStatus === false && (
              <div className="verification-card">
                <div className="card-header warning">
                  <ExclamationTriangleIcon className="warning-icon" />
                  <h2>Email Verification Required</h2>
                </div>
                <div className="card-content">
                  <p>Please verify your email address to access all platform features and receive important notifications.</p>
                  
                  {error && (
                    <div className="alert error">
                      <ExclamationTriangleIcon className="alert-icon" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {resendMessage && (
                    <div className="alert success">
                      <CheckBadgeIcon className="alert-icon" />
                      <span>{resendMessage}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="verify-email-btn"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Sending verification email...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="actions-card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="card-content">
                <div className="action-buttons">
                  <button
                    onClick={() => navigate('/')}
                    className="action-btn primary"
                  >
                    Browse Events
                  </button>
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="action-btn secondary"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="action-btn danger"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Account Statistics Card */}
            <div className="stats-card">
              <div className="card-header">
                <h2>Account Statistics</h2>
              </div>
              <div className="card-content">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Total Bookings</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Events Attended</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">$0</div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{formatDate(user.createdAt).split(',')[1]}</div>
                    <div className="stat-label">Member Since</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage; 