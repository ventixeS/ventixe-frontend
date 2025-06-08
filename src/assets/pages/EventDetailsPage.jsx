import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './EventDetailsPage.css'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { eventService } from '../../services/eventService'

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const packages = [
    { name: 'General Admission Package', price: 50, type: 'Standing', desc: 'Access to Festival Grounds' },
    { name: 'Silver Package', price: 70, type: 'Seating', desc: 'Mid-tier View' },
    { name: 'Gold Package', price: 85, type: 'Seating', desc: 'Prime View' },
    { name: 'Platinum Package', price: 100, type: 'Seating', desc: 'Near Stage' },
    { name: 'Diamond Package', price: 120, type: 'Seating', desc: 'Front-Row View' },
    { name: 'VIP Lounge Package', price: 150, type: 'Seating', desc: 'Exclusive Lounge' },
    { name: 'Artist Meet-and-Greet Package', price: 180, type: 'Standing', desc: 'Backstage Access' },
    { name: 'Ultimate Access Package', price: 200, type: 'Standing', desc: 'All-Inclusive Benefits' },
  ];

  const partners = [
    { name: 'Logoipsum', color: '#6366f1' },
    { name: 'Logoipsum', color: '#ec4899' },
    { name: 'Logoipsum', color: '#8b5cf6' },
    { name: 'Logoipsum', color: '#3b82f6' },
    { name: 'Logoipsum', color: '#f59e0b' },
    { name: 'LOGO', color: '#10b981' },
  ];

  useEffect(() => {
    const getEvent = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await eventService.getEventById(id)
        setEvent(data.result || data)
      } catch {
        setError('Could not load event details.')
      } finally {
        setLoading(false)
      }
    }
    getEvent()
  }, [id])

  if (loading) {
    return (
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main className="event-details-main">
            <div className="loading-state">Loading...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main className="event-details-main">
            <div className="error-state">{error || 'Event not found'}</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  const minPrice = packages[0].price;

  return (
    <div className="portal-wrapper">
      <Nav />
      <div className="content-area">
        <Header />
        <main className="event-details-main">
          <div className="breadcrumb">
            <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/events" className="breadcrumb-link">Events</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Event Details</span>
          </div>

          <div className="page-header">
            <button onClick={() => navigate(-1)} className="back-button">
              <svg viewBox="0 0 20 20" fill="currentColor" className="back-icon">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="page-title">Event Details</h1>
          </div>

          <div className="event-details-container">
            <div className="event-details-content">
              <div className="event-meta">
                <span className="event-category">Music</span>
                <span className="event-status active">Active</span>
              </div>

              <div className="venue-layout">
                <div className="seating-chart">
                  <div className="seating-section bronze top-left">BRONZE</div>
                  <div className="seating-section bronze top-right">BRONZE</div>
                  <div className="seating-section bronze bottom-left">SILVER</div>
                  <div className="seating-section bronze bottom-right">SILVER</div>
                  
                  <div className="seating-section diamond center-top">DIAMOND</div>
                  <div className="seating-section vip center-middle">VIP</div>
                  <div className="seating-section general center-bottom">
                    <span>GENERAL</span>
                    <span>ADMISSION</span>
                  </div>
                </div>
              </div>

              <div className="event-info">
                <h2 className="event-title">{event.title}</h2>
                <div className="event-pricing">
                  Starts from <span className="price">${minPrice}</span>
                </div>
                <div className="event-details">
                  <div className="event-datetime">
                    <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(event.eventDate)} — {formatTime(event.eventDate)}
                  </div>
                  <div className="event-location">
                    <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {event.location || 'Sunset Park, Los Angeles, CA'}
                    <button className="show-map-link">Show Map</button>
                  </div>
                </div>

                <div className="about-event">
                  <h3>About Event</h3>
                  <p>
                    {event.description || 
                    'The Echo Beats Festival brings together a stellar lineup of artists across EDM, pop, and hip-hop genres. Prepare to experience a night of electrifying music, vibrant light shows, and unforgettable performances under the stars. Explore food trucks, art installations, and VIP lounges for an elevated experience.'}
                  </p>
                </div>

                <div className="our-partners">
                  <h3>Our Partners</h3>
                  <div className="partners-grid">
                    {partners.map((partner, index) => (
                      <div key={index} className="partner-logo" style={{ color: partner.color }}>
                        {partner.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="packages-sidebar">
              <div className="packages-header">
                <h3>Packages</h3>
                <button className="packages-menu">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <div className="packages-list">
                {packages.map((pkg, index) => (
                  <div 
                    key={index}
                    className="package-item"
                    onClick={() => navigate(`/events/booking/${id}?package=${encodeURIComponent(pkg.name)}&price=${pkg.price}`)}
                  >
                    <div className="package-header">
                      <h4 className="package-name">{pkg.name}</h4>
                      <div className="package-price">${pkg.price}</div>
                    </div>
                    <div className="package-details">
                      <div className="package-icons">
                        <span className="icon-item">
                          {pkg.type === 'Seating' ? '🪑' : '🕺'} {pkg.type}
                        </span>
                        <span className="icon-item">
                          ✓ {pkg.desc}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default EventDetailsPage;