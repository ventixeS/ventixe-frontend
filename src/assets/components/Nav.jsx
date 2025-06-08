import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/useAuth'
import './Nav.css'
import ventixeLogo from '../images/ventixe-logo.svg'
import dashboardIcon from '../images/dashboard-icon.svg'
import bookingsIcon from '../images/bookings-icon.svg'
import invoicesIcon from '../images/invoices-icon.svg'
import inboxIcon from '../images/inbox-icon.svg'
import calendarIcon from '../images/calendar-icon.svg'
import eventsIcon from '../images/events-icon.svg'
import financialsIcon from '../images/financials-icon.svg'
import galleryIcon from '../images/gallery-icon.svg'
import feedbackIcon from '../images/feedback-icon.svg'
import signoutIcon from '../images/signout-icon.svg'
import appIllustration from '../images/app-illustration.svg'

const Nav = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <nav className="nav-container">
      <div className="brand">
        <img src={ventixeLogo} alt="Ventixe Logo" className="brand-logo" />
        <div className="brand-name">Ventixe</div>
      </div>
      
      {isAuthenticated && user && (
        <div className="user-info">
          <div className="user-avatar">
            <UserCircleIcon className="w-8 h-8" />
          </div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      )}
      
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={dashboardIcon} alt="" className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/bookings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={bookingsIcon} alt="" className="nav-icon" />
            <span className="nav-text">Bookings</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/invoices" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={invoicesIcon} alt="" className="nav-icon" />
            <span className="nav-text">Invoices</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/inbox" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={inboxIcon} alt="" className="nav-icon" />
            <span className="nav-text">Inbox</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/calendar" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={calendarIcon} alt="" className="nav-icon" />
            <span className="nav-text">Calendar</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={eventsIcon} alt="" className="nav-icon" />
            <span className="nav-text">Events</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/financials" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={financialsIcon} alt="" className="nav-icon" />
            <span className="nav-text">Financials</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/gallery" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={galleryIcon} alt="" className="nav-icon" />
            <span className="nav-text">Gallery</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/feedback" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={feedbackIcon} alt="" className="nav-icon" />
            <span className="nav-text">Feedback</span>
          </NavLink>
        </li>
        
        {isAuthenticated && (
          <li className="nav-item">
            <NavLink to="/profile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <UserCircleIcon className="nav-icon w-6 h-6" />
              <span className="nav-text">Profile</span>
            </NavLink>
          </li>
        )}
      </ul>
      
      <div className="nav-bottom">
        <div className="app-info">
          <div className="app-image">
            <img src={appIllustration} alt="App" />
          </div>
          <p className="app-text">Experience enhanced features and a smoother interface with the latest version of Ventixe</p>
          <button className="btn btn-primary">Try New Version</button>
        </div>
        
        {isAuthenticated ? (
          <button onClick={handleSignOut} className="sign-out-link">
            <img src={signoutIcon} alt="" className="sign-out-icon" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button onClick={handleAuthAction} className="sign-out-link">
            <UserCircleIcon className="sign-out-icon w-6 h-6" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export default Nav