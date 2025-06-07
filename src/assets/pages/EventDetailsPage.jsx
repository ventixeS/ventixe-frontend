import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './EventDetailsPage.css'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import placeholderImg from '../images/seat-plan.svg'
import Partner1 from '../images/Partner-1.svg'
import Partner2 from '../images/Partner-2.svg'
import Partner3 from '../images/Partner-3.svg'
import Partner4 from '../images/Partner-4.svg'
import Partner5 from '../images/Partner-5.svg'
import Partner6 from '../images/Partner-6.svg'

const partners = [Partner1, Partner2, Partner3, Partner4, Partner5, Partner6];

const packageList = [
  { name: 'General Admission Package', price: 50, type: 'Standing', desc: 'Access to Festival Grounds' },
  { name: 'Silver Package', price: 70, type: 'Seating', desc: 'Mid-tier View' },
  { name: 'Gold Package', price: 85, type: 'Seating', desc: 'Prime View' },
  { name: 'Platinum Package', price: 100, type: 'Seating', desc: 'Near Stage' },
  { name: 'Diamond Package', price: 120, type: 'Seating', desc: 'Front-Row View' },
  { name: 'VIP Lounge Package', price: 150, type: 'Seating', desc: 'Exclusive Lounge' },
  { name: 'Artist Meet-and-Greet Package', price: 180, type: 'Standing', desc: 'Backstage Access' },
  { name: 'Ultimate Access Package', price: 200, type: 'Standing', desc: 'All-Inclusive Benefits' },
];

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getEvent = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://ventixeeventservices-cah0ebd7hagub9bu.swedencentral-01.azurewebsites.net/api/events/${id}`)
        if (!res.ok) throw new Error('Failed to fetch event')
        const data = await res.json()
        setEvent(data.result)
      } catch {
        setError('Could not load event details.')
      } finally {
        setLoading(false)
      }
    }
    getEvent()
  }, [id])

  if (loading) return <div className="event-details-loading">Loading...</div>
  if (error) return <div className="event-details-error">{error}</div>
  if (!event) return null

  // Helpers for formatting
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

  // Category badge logic (reuse EventItem logic)
  const getCategoryName = (id) => {
    const categories = ['Music', 'Food & Culinary', 'Outdoor & Adventure', 'Art & Design', 'Fashion', 'Technology'];
    return categories[id % categories.length];
  };
  const getCategoryClass = (id) => {
    const classes = ['music', 'food', 'outdoor', 'art', 'fashion', 'technology'];
    return classes[id % classes.length];
  };

  // Placeholder for price
  const minPrice = event.price || 60;

  return (
    <div className="portal-wrapper">
      <Nav />
      <div className="content-area">
        <Header />
        <main>
          <div className="event-details-page">
            <div className="event-details-header">
              <div className="event-details-breadcrumbs">
                <Link to="/dashboard">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/events">Events</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="active">Event Details</span>
              </div>
              <div className="event-details-title-row">
                <Link to="/" className="back-arrow">←</Link>
                <h1 className="event-details-title">Event Details</h1>
              </div>
            </div>
      <div className="event-details-main">
        <div className="event-details-left">
          <div className="event-details-card">
            <div className="event-details-image">
              <div className={`event-category ${getCategoryClass(event.id)}`}>{getCategoryName(event.id)}</div>
              <img src={event.image || placeholderImg} alt={event.title} />
              <span className="event-status-badge active">Active</span>
            </div>
            <div className="event-details-info">
              <div className="event-details-row">
                <h2>{event.title}</h2>
                <div className="event-details-actions">
                  <span className="event-details-price">Starts from <b>${minPrice}</b></span>
                </div>
              </div>
              <div className="event-details-meta">
                <span className="event-details-date">{formatDate(event.eventDate)} — {formatTime(event.eventDate)}</span>
                <span className="event-details-location">{event.location || 'Location TBA'} <button className="show-map-btn">Show Map</button></span>
              </div>
              <div className="event-details-about">
                <b>About Event</b>
                <p>{event.description || 'No description available.'}</p>
              </div>
              <div className="event-details-partners">
                <b>Our Partners</b>
                <div className="partners-list">
                  {partners.map((logo, i) => (
                    <img src={logo} alt={`Partner ${i+1}`} key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="event-details-packages">
          <div className="packages-header">
            <b>Packages</b>
            <span className="packages-menu">...</span>
          </div>
          <div className="packages-list">
            {packageList.map((pkg, i) => (
              <div 
                className="package-item" 
                key={i} 
                onClick={() => navigate(`/events/booking/${id}?package=${encodeURIComponent(pkg.name)}&price=${pkg.price}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="package-info">
                  <div className="package-title">{pkg.name}</div>
                  <div className="package-type">{pkg.type}</div>
                  <div className="package-desc">{pkg.desc}</div>
                </div>
                <div className="package-price">${pkg.price}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default EventDetailsPage;