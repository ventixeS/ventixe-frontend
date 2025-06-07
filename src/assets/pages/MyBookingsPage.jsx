import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import './MyBookingsPage.css'

const MyBookingsPage = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past, cancelled

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real application, you would fetch bookings from your BookingService
        // For MVP, we'll simulate with dummy data
        const dummyBookings = [
          {
            id: 1,
            eventId: 'evt1',
            eventTitle: "Summer Music Festival 2024",
            eventDate: "2024-06-15T18:00:00Z",
            eventLocation: "Central Park, Stockholm",
            bookingDate: "2024-05-10T14:30:00Z",
            status: "confirmed",
            ticketQuantity: 2,
            totalAmount: 150,
            package: "VIP Package",
            bookingReference: "VTX001234"
          },
          {
            id: 2,
            eventId: 'evt2',
            eventTitle: "Food & Wine Expo",
            eventDate: "2024-05-20T12:00:00Z",
            eventLocation: "Stockholm Convention Center",
            bookingDate: "2024-04-25T10:15:00Z",
            status: "confirmed",
            ticketQuantity: 1,
            totalAmount: 45,
            package: "General Admission",
            bookingReference: "VTX001235"
          },
          {
            id: 3,
            eventId: 'evt3',
            eventTitle: "Tech Conference 2024",
            eventDate: "2024-07-10T09:00:00Z",
            eventLocation: "Stockholm Tech Hub",
            bookingDate: "2024-05-15T16:45:00Z",
            status: "pending",
            ticketQuantity: 1,
            totalAmount: 125,
            package: "Conference Pass",
            bookingReference: "VTX001236"
          },
          {
            id: 4,
            eventId: 'evt4',
            eventTitle: "Art Gallery Opening",
            eventDate: "2024-04-10T19:00:00Z",
            eventLocation: "Modern Art Museum",
            bookingDate: "2024-03-28T11:20:00Z",
            status: "attended",
            ticketQuantity: 2,
            totalAmount: 60,
            package: "Opening Night",
            bookingReference: "VTX001237"
          }
        ]
        
        setBookings(dummyBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter(booking => {
    const eventDate = new Date(booking.eventDate)
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return eventDate > now && booking.status !== 'cancelled'
      case 'past':
        return eventDate < now || booking.status === 'attended'
      case 'cancelled':
        return booking.status === 'cancelled'
      default:
        return true
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745'
      case 'pending': return '#ffc107'
      case 'cancelled': return '#dc3545'
      case 'attended': return '#6f42c1'
      default: return '#6c757d'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // In a real app, make API call to cancel booking
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ))
        alert('Booking cancelled successfully')
      } catch (error) {
        console.error('Error cancelling booking:', error)
        alert('Failed to cancel booking')
      }
    }
  }

  if (loading) {
    return (
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main className="bookings-container">
            <div className="loading">Loading your bookings...</div>
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
        <main className="bookings-container">
          <div className="bookings-header">
            <h1>My Bookings</h1>
            <p>Manage and view all your event bookings</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({bookings.length})
            </button>
            <button 
              className={filter === 'upcoming' ? 'active' : ''}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({bookings.filter(b => new Date(b.eventDate) > new Date() && b.status !== 'cancelled').length})
            </button>
            <button 
              className={filter === 'past' ? 'active' : ''}
              onClick={() => setFilter('past')}
            >
              Past ({bookings.filter(b => new Date(b.eventDate) < new Date() || b.status === 'attended').length})
            </button>
            <button 
              className={filter === 'cancelled' ? 'active' : ''}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="bookings-list">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-main">
                    <div className="booking-event">
                      <h3>{booking.eventTitle}</h3>
                      <p className="event-date">📅 {formatDate(booking.eventDate)}</p>
                      <p className="event-location">📍 {booking.eventLocation}</p>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="label">Package:</span>
                        <span className="value">{booking.package}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Tickets:</span>
                        <span className="value">{booking.ticketQuantity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Total:</span>
                        <span className="value amount">${booking.totalAmount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Reference:</span>
                        <span className="value">{booking.bookingReference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                    
                    <div className="booking-actions">
                      <Link 
                        to={`/events/${booking.eventId}`}
                        className="action-btn view-event"
                      >
                        View Event
                      </Link>
                      
                      {booking.status === 'confirmed' && new Date(booking.eventDate) > new Date() && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="action-btn cancel-booking"
                        >
                          Cancel
                        </button>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button className="action-btn download-ticket">
                          Download Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-bookings">
              <div className="empty-icon">🎫</div>
              <h3>No bookings found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't made any bookings yet."
                  : `No ${filter} bookings found.`
                }
              </p>
              <Link to="/" className="browse-events-btn">
                Browse Events
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MyBookingsPage 