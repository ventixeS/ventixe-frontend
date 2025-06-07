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
            <div className="header-content">
              <div className="header-left">
                <h1>My Bookings</h1>
                <p>Manage and track all your event bookings</p>
              </div>
              <div className="header-actions">
                <Link to="/" className="new-booking-btn">
                  <span className="btn-icon">+</span>
                  Book New Event
                </Link>
              </div>
            </div>
          </div>

          <div className="bookings-controls">
            <div className="filter-section">
              <div className="filter-tabs">
                <button 
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  All Bookings
                  <span className="count">({bookings.length})</span>
                </button>
                <button 
                  className={filter === 'upcoming' ? 'active' : ''}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming
                  <span className="count">({bookings.filter(b => new Date(b.eventDate) > new Date() && b.status !== 'cancelled').length})</span>
                </button>
                <button 
                  className={filter === 'past' ? 'active' : ''}
                  onClick={() => setFilter('past')}
                >
                  Past Events
                  <span className="count">({bookings.filter(b => new Date(b.eventDate) < new Date() || b.status === 'attended').length})</span>
                </button>
                <button 
                  className={filter === 'cancelled' ? 'active' : ''}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled
                  <span className="count">({bookings.filter(b => b.status === 'cancelled').length})</span>
                </button>
              </div>
            </div>
            
            <div className="search-section">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search events..."
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Date & Time</th>
                    <th>Package</th>
                    <th>Tickets</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="booking-row">
                      <td className="event-details">
                        <div className="event-info">
                          <h4 className="event-title">{booking.eventTitle}</h4>
                          <p className="event-location">{booking.eventLocation}</p>
                          <span className="booking-ref">#{booking.bookingReference}</span>
                        </div>
                      </td>
                      <td className="event-datetime">
                        <div className="datetime-info">
                          <span className="date">{new Date(booking.eventDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                          <span className="time">{new Date(booking.eventDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </td>
                      <td className="package-info">
                        <span className="package-name">{booking.package}</span>
                      </td>
                      <td className="ticket-quantity">
                        <span className="quantity">{booking.ticketQuantity}</span>
                        <span className="unit">tickets</span>
                      </td>
                      <td className="amount">
                        <span className="price">${booking.totalAmount}</span>
                      </td>
                      <td className="status">
                        <span 
                          className={`status-badge status-${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="actions">
                        <div className="action-buttons">
                          <Link 
                            to={`/events/${booking.eventId}`}
                            className="action-btn primary"
                            title="View Event"
                          >
                            View
                          </Link>
                          
                          {booking.status === 'confirmed' && (
                            <button 
                              className="action-btn secondary"
                              title="Download Ticket"
                            >
                              Download
                            </button>
                          )}
                          
                          {booking.status === 'confirmed' && new Date(booking.eventDate) > new Date() && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="action-btn danger"
                              title="Cancel Booking"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start exploring events!" 
                  : `No ${filter} bookings found. Try adjusting your filters.`
                }
              </p>
              <Link to="/" className="cta-button">
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