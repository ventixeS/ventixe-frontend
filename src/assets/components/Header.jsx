import React from 'react'
import './Header.css'
import searchIcon from '../images/search-icon.svg'
import bellIcon from '../images/bell-icon.svg'
import settingsIcon from '../images/settings-icon.svg'

const Header = () => {
  return (
    <header className="header">
      <div className="search-bar">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input type="text" placeholder="Search event, location, etc." />
      </div>
      
      <div className="header-controls">
        <button className="icon-button">
          <img src={bellIcon} alt="Notifications" />
        </button>
        <button className="icon-button">
          <img src={settingsIcon} alt="Settings" />
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <span>SS</span>
          </div>
          <div className="user-info">
            <div className="user-name">Stefan Strandberg</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header