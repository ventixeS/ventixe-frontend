import React from 'react'
import './Header.css'
import bellIcon from '../images/bell-icon.svg'
import settingsIcon from '../images/settings-icon.svg'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { user, isAuthenticated, loading } = useAuth()
  
  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }
  return (
    <header className="header">
      <div className="search-bar">
        <input type="text" placeholder="Search event, location, etc." />
      </div>
      
      <div className="header-controls">
        <button className="icon-button">
          <img src={bellIcon} alt="Notifications" />
        </button>
        <button className="icon-button">
          <img src={settingsIcon} alt="Settings" />
        </button>
        
        {loading ? (
          <div className="user-profile">
            <div className="user-avatar">
              <span>...</span>
            </div>
            <div className="user-info">
              <div className="user-name">Loading...</div>
              <div className="user-role">Please wait</div>
            </div>
          </div>
        ) : isAuthenticated && user ? (
          <div className="user-profile">
            <div className="user-avatar">
              <span>{getUserInitials(user.name)}</span>
            </div>
            <div className="user-info">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-role">Member</div>
            </div>
          </div>
        ) : (
          <div className="user-profile">
            <div className="user-avatar">
              <span>G</span>
            </div>
            <div className="user-info">
              <div className="user-name">Guest</div>
              <div className="user-role">Visitor</div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header