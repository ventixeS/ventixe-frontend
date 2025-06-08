import React, { useEffect, useState } from 'react';
import './EventList.css';
import EventItem from './EventItem';
import searchIcon from '../images/search-icon.svg';
import chevronDownIcon from '../images/chevron-down-icon.svg';
import calendarIcon from '../images/calendar-icon.svg';
import { eventService } from '../../services/eventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'active', label: 'Active', count: 68 },
    { id: 'draft', label: 'Draft', count: 22 },
    { id: 'past', label: 'Past', count: 32 }
  ];

  const getEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await eventService.getAllEvents();
        console.log("API response:", data);
        
        if (data && data.result && Array.isArray(data.result)) {
          setEvents(data.result);
          console.log("Events set to:", data.result);
        } else if (Array.isArray(data)) {
          setEvents(data);
          console.log("Events set to array directly:", data);
        } else {
          console.error("Unexpected response format:", data);
          setError("Unexpected API response format");
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(`Failed to fetch events: ${err.message}`);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const formatEvents = (apiEvents) => {
    return apiEvents.map(event => ({
      id: event.id,
      category: {
        name: getCategoryName(event.id),
        class: getCategoryClass(event.id)
      },
      title: event.title,
      description: event.description || 'Join us for this amazing event with special features and unforgettable experiences.',
      location: event.location || 'Location TBA',
      date: formatDate(event.eventDate),
      time: formatTime(event.eventDate),
      price: getRandomPrice(event.id)
    }));
  };

  const getCategoryName = (id) => {
    const categories = ['Music', 'Food & Culinary', 'Outdoor & Adventure', 'Art & Design', 'Fashion', 'Technology'];
    return categories[id % categories.length];
  };

  const getCategoryClass = (id) => {
    const classes = ['music', 'food', 'outdoor', 'art', 'fashion', 'technology'];
    return classes[id % classes.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRandomPrice = (id) => {
    const prices = [20, 30, 40, 45, 60, 80];
    return prices[id % prices.length];
  };

  if (loading) {
    return (
      <section className="events-container loading-container">
        <div className="loading">Loading events...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="events-container error-container">
        <div className="error">{error}</div>
        <div className="error-details">
          <p>The events service is not responding correctly.</p>
          <p>Please verify that:</p>
          <ul>
            <li>Your backend service is properly deployed</li>
            <li>Your EventsController is correctly configured</li>
            <li>CORS is enabled on your backend to allow requests from your frontend</li>
          </ul>
        </div>
        <button onClick={getEvents} className="retry-btn">
          Retry
        </button>
      </section>
    );
  }

  const displayEvents = formatEvents(events);

  return (
    <section className="events-container">
      <div className="breadcrumb-nav">
        <div className="breadcrumb-links">
          <a href="/dashboard">Dashboard</a>
          <span className="breadcrumb-separator">/</span>
          <a href="/events" className="active">Events</a>
        </div>
        <h1 className="page-title">Events</h1>
      </div>
      
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="tab-count">({tab.count})</span>
          </button>
        ))}
      </div>
      
      <div className="events-toolbar">
        <div className="search-filter">
          <div className="search-bar">
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search event, location, etc." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">
              <img src={searchIcon} alt="Search" />
            </button>
          </div>
          
          <div className="filter-dropdown">
            <span>All Category</span>
            <img src={chevronDownIcon} alt="" />
          </div>
          
          <div className="filter-dropdown">
            <img src={calendarIcon} alt="" className="filter-icon" />
            <span>This Month</span>
            <img src={chevronDownIcon} alt="" />
          </div>
        </div>
      </div>
      
      {displayEvents.length === 0 ? (
        <div className="no-events">
          No events found
        </div>
      ) : (
        <div className="events-list">
          {displayEvents.map(event => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      )}
      
      <div className="pagination">
        <div className="pagination-info">
          Showing
          <div className="pagination-select">
            <select defaultValue="6">
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </div>
          out of {events.length}
        </div>
        
        <div className="pagination-controls">
          <button className="pagination-prev">&lt;</button>
          <button className="pagination-number active">1</button>
          <button className="pagination-number">2</button>
          <button className="pagination-number">3</button>
          <button className="pagination-ellipsis">...</button>
          <button className="pagination-number">8</button>
          <button className="pagination-next">&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default EventList;