import React from 'react'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import EventList from '../components/EventList'

const EventPage = () => {
  return (
    <div className="portal-wrapper">
      <Nav />
      <div className="content-area">
        <Header />
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Ventixe</h1>
            <p className="hero-subtitle">
              Discover amazing events, book your tickets, and create unforgettable memories.
              Your gateway to the best experiences in your city.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Events</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cities</span>
              </div>
            </div>
          </div>
        </section>

        <main>
          <EventList />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default EventPage