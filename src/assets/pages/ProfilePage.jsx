import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/useAuth';
import { bookingService } from '../../services/bookingService';
import { eventService } from '../../services/eventService';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    eventsAttended: 0,
    totalSpent: 0,
    loading: true
  });

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const userBookingsResponse = await bookingService.getUserBookings(user.id);
        const userBookings = userBookingsResponse.result || userBookingsResponse.data || userBookingsResponse || [];
        const bookingsArray = Array.isArray(userBookings) ? userBookings : [];

        const totalBookings = bookingsArray.length;
        const totalSpent = bookingsArray.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        
        const now = new Date();
        let eventsAttended = 0;
        
        for (const booking of bookingsArray) {
          if (booking.status === 'attended' || booking.status === 'confirmed') {
            try {
              const eventResponse = await eventService.getEventById(booking.eventId);
              const event = eventResponse.result || eventResponse.data || eventResponse;
              const eventDate = new Date(event?.date || event?.eventDate);
              
              if (eventDate < now && booking.status === 'confirmed') {
                eventsAttended++;
              } else if (booking.status === 'attended') {
                eventsAttended++;
              }
            } catch {
              if (booking.status === 'attended') {
                eventsAttended++;
              }
            }
          }
        }

        setUserStats({
          totalBookings,
          eventsAttended,
          totalSpent,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        setUserStats({
          totalBookings: 0,
          eventsAttended: 0,
          totalSpent: 0,
          loading: false
        });
      }
    };

    if (user?.id) {
      fetchUserStatistics();
    }
  }, [user]);

  const handleRefreshProfile = async () => {
    setIsLoading(true);
    try {
      await refreshUser();
    } catch {
      // 
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
                    </div>
                    <div className="user-joined">
                      <CalendarIcon className="calendar-icon" />
                      <span>Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h2>Account Status</h2>
              </div>
              <div className="card-content">
                <div className="status-items">
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
              
            <div className="stats-card">
              <div className="card-header">
                <h2>Account Statistics</h2>
              </div>
              <div className="card-content">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">
                      {userStats.loading ? '...' : userStats.totalBookings}
                    </div>
                    <div className="stat-label">Total Bookings</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {userStats.loading ? '...' : userStats.eventsAttended}
                    </div>
                    <div className="stat-label">Events Attended</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {userStats.loading ? '...' : `$${userStats.totalSpent}`}
                    </div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{new Date(user.createdAt).getFullYear()}</div>
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