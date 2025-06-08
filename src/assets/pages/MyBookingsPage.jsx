import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
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
                    <th>Invoice ID</th>
                    <th>Date & Time</th>
                    <th>Name</th>
                    <th>Event</th>
                    <th>Ticket Category</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>E-Voucher</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="booking-row">
                      <td className="invoice-id">{booking.id}</td>
                      <td className="event-datetime">
                        <div className="datetime-info">
                          <span className="date">{new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric' })}</span>
                          <span className="time">{new Date(booking.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="attendee-name">{booking.attendeeName || '—'}</td>
                      <td className="event-info">
                        <div className="event-title">{booking.eventTitle}</div>
                        <div className="event-location">{booking.eventLocation}</div>
                      </td>
                      <td className="ticket-category">
                        <span className={`ticket-badge ticket-${(booking.package || '').toLowerCase().replace(/\s/g, '-')}`}>{booking.package}</span>
                      </td>
                      <td className="price">${booking.price || booking.totalAmount / (booking.ticketQuantity || 1)}</td>
                      <td className="qty">{booking.ticketQuantity}</td>
                      <td className="amount">${booking.totalAmount}</td>
                      <td className="status">
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                      </td>
                      <td className="e-voucher">{booking.eVoucher || booking.bookingReference || '—'}</td>
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