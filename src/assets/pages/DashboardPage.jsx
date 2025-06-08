import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { bookingService } from '../../services/bookingService'
import { eventService } from '../../services/eventService'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useAuth()
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const bookingsResponse = await bookingService.getUserBookings()
        let bookingsArray = []
        
        if (bookingsResponse?.result) {
          bookingsArray = Array.isArray(bookingsResponse.result) ? bookingsResponse.result : []
        } else if (bookingsResponse?.data) {
          bookingsArray = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []
        } else if (Array.isArray(bookingsResponse)) {
          bookingsArray = bookingsResponse
        }

        const eventsResponse = await eventService.getAllEvents()
        let eventsArray = []
        
        if (eventsResponse?.result) {
          eventsArray = Array.isArray(eventsResponse.result) ? eventsResponse.result : []
        } else if (eventsResponse?.data) {
          eventsArray = Array.isArray(eventsResponse.data) ? eventsResponse.data : []
        } else if (Array.isArray(eventsResponse)) {
          eventsArray = eventsResponse
        }

        const enrichedBookings = await Promise.all(
          bookingsArray
            .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
            .slice(0, 3) 
            .map(async (booking) => {
              try {
                const eventResponse = await eventService.getEventById(booking.eventId)
                const event = eventResponse.result || eventResponse.data || eventResponse
                
                return {
                  id: booking.id,
                  eventTitle: event?.title || 'Unknown Event',
                  date: event?.date || event?.eventDate || booking.bookingDate,
                  status: booking.status || 'confirmed',
                  amount: booking.totalAmount || 0
                }
              } catch (eventError) {
                console.warn('Failed to fetch event details for booking:', booking.id, eventError)
                return {
                  id: booking.id,
                  eventTitle: 'Event Details Unavailable',
                  date: booking.bookingDate,
                  status: booking.status || 'confirmed',
                  amount: booking.totalAmount || 0
                }
              }
            })
        )

        setRecentBookings(enrichedBookings)

        const now = new Date()
        const upcomingEventsData = eventsArray
          .filter(event => {
            const eventDate = new Date(event.date || event.eventDate)
            return eventDate > now
          })
          .sort((a, b) => new Date(a.date || a.eventDate) - new Date(b.date || b.eventDate))
          .slice(0, 3) 
          .map(event => ({
            id: event.id,
            title: event.title,
            date: event.date || event.eventDate,
            location: event.location || 'Location TBD'
          }))

        setUpcomingEvents(upcomingEventsData)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)    
        setRecentBookings([])
        setUpcomingEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

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