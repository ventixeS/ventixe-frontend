import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { bookingService } from '../../services/bookingService'
import { eventService } from '../../services/eventService'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import './MyBookingsPage.css'

const MyBookingsPage = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') 

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const userBookings = await bookingService.getUserBookings(user.id)
        const bookingsData = userBookings.result || userBookings.data || userBookings || []
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : []
        
        const enrichedBookings = await Promise.all(
          bookingsArray.map(async (booking) => {
            try {
              const eventResponse = await eventService.getEventById(booking.eventId)
              const event = eventResponse.result || eventResponse.data || eventResponse
              
              return {
                id: booking.id,
                eventId: booking.eventId,
                eventTitle: event?.title || 'Unknown Event',
                eventDate: event?.date || booking.bookingDate,
                eventLocation: event?.location || 'Location TBD',
                bookingDate: booking.bookingDate,
                status: booking.status || 'confirmed',
                ticketQuantity: booking.ticketQuantity || 1,
                totalAmount: booking.totalAmount || 0,
                package: booking.package || 'General Admission',
                bookingReference: booking.id || 'N/A'
              }
            } catch (eventError) {
              console.warn('Failed to fetch event details for booking:', booking.id, eventError)
              return {
                id: booking.id,
                eventId: booking.eventId,
                eventTitle: 'Event Details Unavailable',
                eventDate: booking.bookingDate,
                eventLocation: 'Location TBD',
                bookingDate: booking.bookingDate,
                status: booking.status || 'confirmed',
                ticketQuantity: booking.ticketQuantity || 1,
                totalAmount: booking.totalAmount || 0,
                package: booking.package || 'General Admission',
                bookingReference: booking.id || 'N/A'
              }
            }
          })
        )
        
        setBookings(enrichedBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        setBookings([]) 
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

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
        await bookingService.cancelBooking(bookingId)
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