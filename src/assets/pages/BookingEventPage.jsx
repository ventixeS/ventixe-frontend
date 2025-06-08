import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import './BookingEventPage.css';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useAuth } from '../../contexts/useAuth';
import { eventService } from '../../services/eventService';
import { bookingService } from '../../services/bookingService';

const BookingEventPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const selectedPackage = searchParams.get('package') || 'General Admission Package';
    const packagePrice = parseFloat(searchParams.get('price')) || 50;
    
    const [formData, setFormData] = useState({ 
        eventId: id,
        packageName: selectedPackage,
        packagePrice: packagePrice,
        firstName: '', 
        lastName: '', 
        email: '',
        phone: '',
        streetName: '', 
        postalCode: '', 
        city: '',
        specialRequests: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const eventData = await eventService.getEventById(id);
                setEvent(eventData.result || eventData);

                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        firstName: user.name?.split(' ')[0] || '',
                        lastName: user.name?.split(' ').slice(1).join(' ') || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        streetName: user.address?.street || '',
                        postalCode: user.address?.postalCode || '',
                        city: user.address?.city || ''
                    }));
                }
            } catch (err) {
                setError("Failed to load event details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id, user]);

    const postBooking = async () => {
        setSubmitting(true);
        setError(null);
        
        try {
            const bookingData = {
                ...formData,
                userId: user ? String(user.id) : null,
                bookingDate: new Date().toISOString(),
                status: 'confirmed',
                totalAmount: packagePrice,
                ticketQuantity: 1,
            };

            const result = await bookingService.createBooking(bookingData);
            console.log("Booking successful:", result);
            setSuccess(true);
            
            setTimeout(() => {
                navigate(`/events/${id}`, { 
                    state: { message: 'Booking confirmed successfully!' }
                });
            }, 2000);
            
        } catch (err) {
            setError(err.message || "Error submitting booking");
            console.error("Error submitting booking", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setError('Please log in to make a booking');
            navigate('/login');
            return;
        }
        
        const requiredFields = ['firstName', 'lastName', 'email', 'streetName', 'postalCode', 'city'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());
        
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
        
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        
        await postBooking();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="portal-wrapper">
            <Nav />
            <div className="content-area">
                <Header />
                <main>
                    <div className="booking-loading">Loading...</div>
                </main>
                <Footer />
            </div>
        </div>
    );

    if (!event) return (
        <div className="portal-wrapper">
            <Nav />
            <div className="content-area">
                <Header />
                <main>
                    <div className="booking-error">Event not found</div>
                </main>
                <Footer />
            </div>
        </div>
    );

    return (
        <div className="portal-wrapper">
            <Nav />
            <div className="content-area">
                <Header />
                <main>
                    <div className="booking-page">
                        <div className="booking-header">
                            <div className="booking-breadcrumbs">
                                <Link to="/">Dashboard</Link>
                                <span className="breadcrumb-separator">/</span>
                                <Link to={`/events/${id}`}>Event Details</Link>
                                <span className="breadcrumb-separator">/</span>
                                <span className="active">Booking</span>
                            </div>
                            <div className="booking-title-row">
                                <Link to={`/events/${id}`} className="back-arrow">←</Link>
                                <h1 className="booking-title">Book Event</h1>
                            </div>
                        </div>

                        <div className="booking-content">
                            <div className="booking-form-section">
                                <div className="booking-card">
                                    <h2>Booking Information</h2>
                                    
                                    {error && (
                                        <div className="booking-error-message">
                                            {error}
                                        </div>
                                    )}
                                    
                                    {success && (
                                        <div className="booking-success-message">
                                            Booking confirmed! Redirecting...
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="booking-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="firstName">First Name *</label>
                                                <input 
                                                    type="text" 
                                                    id="firstName"
                                                    name="firstName" 
                                                    value={formData.firstName} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name *</label>
                                                <input 
                                                    type="text" 
                                                    id="lastName"
                                                    name="lastName" 
                                                    value={formData.lastName} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address *</label>
                                                <input 
                                                    type="email" 
                                                    id="email"
                                                    name="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input 
                                                    type="tel" 
                                                    id="phone"
                                                    name="phone" 
                                                    value={formData.phone} 
                                                    onChange={handleChange} 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="streetName">Street Address *</label>
                                            <input 
                                                type="text" 
                                                id="streetName"
                                                name="streetName" 
                                                value={formData.streetName} 
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="postalCode">Postal Code *</label>
                                                <input 
                                                    type="text" 
                                                    id="postalCode"
                                                    name="postalCode" 
                                                    value={formData.postalCode} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="city">City *</label>
                                                <input 
                                                    type="text" 
                                                    id="city"
                                                    name="city" 
                                                    value={formData.city} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="specialRequests">Special Requests</label>
                                            <textarea 
                                                id="specialRequests"
                                                name="specialRequests" 
                                                value={formData.specialRequests} 
                                                onChange={handleChange}
                                                rows="3"
                                                placeholder="Any special requirements or requests..."
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="booking-submit-btn"
                                            disabled={submitting || success}
                                        >
                                            {submitting ? 'Processing...' : success ? 'Confirmed!' : 'Confirm Booking'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="booking-summary-section">
                                <div className="booking-summary-card">
                                    <h3>Booking Summary</h3>
                                    
                                    <div className="event-summary">
                                        <h4>{event.title}</h4>
                                        <div className="event-details">
                                            <div className="detail-row">
                                                <span className="label">Date:</span>
                                                <span className="value">{formatDate(event.eventDate)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Time:</span>
                                                <span className="value">{formatTime(event.eventDate)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Location:</span>
                                                <span className="value">{event.location || 'TBA'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="package-summary">
                                        <h4>Selected Package</h4>
                                        <div className="package-details">
                                            <div className="package-name">{selectedPackage}</div>
                                            <div className="package-price">${packagePrice}</div>
                                        </div>
                                    </div>

                                    <div className="total-summary">
                                        <div className="total-row">
                                            <span className="total-label">Total Amount:</span>
                                            <span className="total-amount">${packagePrice}</span>
                                        </div>
                                    </div>

                                    {user && (
                                        <div className="user-info-summary">
                                            <h4>Booking for</h4>
                                            <div className="user-details">
                                                <div className="user-name">{user.firstName} {user.lastName}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default BookingEventPage;