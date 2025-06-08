import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { eventService } from '../../services/eventService';
import './EventPage.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedMonth, setSelectedMonth] = useState('This Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const tabs = [
    { id: 'Active', label: 'Active', count: 18 },
    { id: 'Draft', label: 'Draft', count: 22 },
    { id: 'Past', label: 'Past', count: 32 }
  ];

  const categories = [
    'All Category',
    'Outdoor & Adventure',
    'Food & Culinary', 
    'Music',
    'Fashion',
    'Art & Design',
    'Technology'
  ];

  const months = [
    'This Month',
    'January',
    'February', 
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const getCategoryForEvent = (eventId) => {
    const categoryMap = {
      1: 'Music',
      2: 'Outdoor & Adventure', 
      3: 'Fashion',
      4: 'Art & Design',
      5: 'Technology',
      6: 'Food & Culinary'
    };
    return categoryMap[eventId] || 'Music';
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventPrice = (eventId) => {
    const prices = [30, 40, 45, 20, 80, 60];
    return prices[(eventId - 1) % prices.length] || 50;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        if (data && data.result && Array.isArray(data.result)) {
          setEvents(data.result);
        } else if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setError("Failed to load events");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'All Category') {
      const eventCategory = getCategoryForEvent(event.id);
      if (eventCategory !== selectedCategory) {
        return false;
      }
    }
    return true;
  });

  const eventsPerPage = 6;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  if (loading) {
    return (
      <div className="portal-wrapper">
        <Nav />
        <div className="content-area">
          <Header />
          <main className="events-main">
            <div className="loading-state">Loading events...</div>
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
        <main className="events-main">
          <div className="breadcrumb">
            <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Events</span>
          </div>

          <h1 className="page-title">Events</h1>

          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="events-toolbar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search event, location, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-container">
              <div className="dropdown-wrapper">
                <button 
                  className="dropdown-btn"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  {selectedCategory}
                  <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="dropdown-menu">
                    {categories.map(category => (
                      <button
                        key={category}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-wrapper">
                <button 
                  className="dropdown-btn"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                >
                  <svg className="calendar-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {selectedMonth}
                  <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showMonthDropdown && (
                  <div className="dropdown-menu">
                    {months.map(month => (
                      <button
                        key={month}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="events-grid">
            {paginatedEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <div className="category-tag">{getCategoryForEvent(event.id)}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">
                    {event.description || "Join us for this amazing event with special features and unforgettable experiences."}
                  </p>
                  <div className="event-details">
                    <div className="event-location">
                      <svg className="location-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {event.location || "Location TBA"}
                    </div>
                    <div className="event-datetime">
                      <svg className="clock-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {formatEventDate(event.eventDate)} — {formatEventTime(event.eventDate)}
                    </div>
                  </div>
                  <div className="event-footer">
                    <div className="event-actions">
                      <Link to={`/events/${event.id}`} className="btn-primary event-btn">
                        Book Now
                      </Link>
                    </div>
                    <div className="event-price">${getEventPrice(event.id)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-container">
            <div className="pagination-info">
              Showing <span className="pagination-select">{eventsPerPage}</span> out of {filteredEvents.length}
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <span className="pagination-dots">...</span>
              <button className="pagination-btn">8</button>
              <button 
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>

        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EventPage;