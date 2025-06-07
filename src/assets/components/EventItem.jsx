import React from 'react'
import { Link } from 'react-router-dom'
import './EventItem.css'
import eventsIcon from '../images/events-icon.svg'
import placeholderImg from '../images/seat-plan.svg'

const EventItem = ({ event }) => {
    const imageSrc = event.image ? event.image : placeholderImg;
    return (
        <div className="event-card">
            <div className="event-image">
                <img src={imageSrc} alt={event.title} className="event-img-tag" />
            </div>
            <div className="event-content">
                <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">
                        {event.description}
                    </p>
                    <div className="event-meta">
                        <div className="meta-item">
                            <span className="meta-icon location-icon"></span>
                            <span>{event.location}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon calendar-icon"></span>
                            <span>{event.date} — {event.time}</span>
                        </div>
                    </div>
                </div>
                <div className="event-actions">
                    <Link to={`/events/${event.id}`} className="ticket-icon" title="View event details">
                        <img src={eventsIcon} alt="Ticket" />
                    </Link>
                    <div className="event-price">${event.price}</div>
                </div>
            </div>
        </div>
    )
}

export default EventItem