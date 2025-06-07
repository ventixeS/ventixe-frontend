import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    totalSpent: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This would normally fetch user's booking data from your BookingService
        // For MVP, we'll simulate with dummy data
        setStats({
          totalBookings: 12,
          upcomingEvents: 3,
          totalSpent: 450
        })

        setRecentBookings([
          {
            id: 1,
            eventTitle: "Summer Music Festival",
            date: "2024-06-15",
            status: "confirmed",
            amount: 75
          },
          {
            id: 2,
            eventTitle: "Food & Wine Expo",
            date: "2024-05-20",
            status: "confirmed",
            amount: 45
          }
        ])

        setUpcomingEvents([
          {
            id: 3,
            title: "Tech Conference 2024",
            date: "2024-07-10",
            location: "Stockholm Convention Center"
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main className="dashboard-container">
            <div className="loading">Loading dashboard...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="portal-wrapper">
      <Nav />
      <div className="content-area">
        <Header />
        <main className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p>Here's what's happening with your events</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-content">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{stats.upcomingEvents}</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>${stats.totalSpent}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/" className="action-btn primary">
                <span className="btn-icon">🔍</span>
                Browse Events
              </Link>
              <Link to="/bookings" className="action-btn secondary">
                <span className="btn-icon">📋</span>
                View My Bookings
              </Link>
              <Link to="/profile" className="action-btn secondary">
                <span className="btn-icon">⚙️</span>
                Account Settings
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-sections">
            <div className="section">
              <h2>Recent Bookings</h2>
              {recentBookings.length > 0 ? (
                <div className="bookings-list">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-info">
                        <h4>{booking.eventTitle}</h4>
                        <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                        <span className={`status ${booking.status}`}>{booking.status}</span>
                      </div>
                      <div className="booking-amount">
                        ${booking.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No recent bookings</p>
              )}
              <Link to="/bookings" className="view-all-link">View all bookings →</Link>
            </div>

            <div className="section">
              <h2>Upcoming Events</h2>
              {upcomingEvents.length > 0 ? (
                <div className="events-list">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p>📍 {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No upcoming events</p>
              )}
              <Link to="/" className="view-all-link">Browse more events →</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DashboardPage 