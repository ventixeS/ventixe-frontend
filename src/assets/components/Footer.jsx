import React from 'react'
import './Footer.css'
import XLogo from '../images/XLogo.svg'
import InstagramLogo from '../images/InstagramLogo.svg'
import YoutubeLogo from '../images/YoutubeLogo.svg'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          Copyright © 2025 Peterdraw
        </div>
        
        <nav className="footer-nav">
          <a href="#">Privacy Policy</a>
          <a href="#">Term and conditions</a>
          <a href="#">Contact</a>
        </nav>
        
        <div className="social-links">
          <a href="#" className="social-link">
            <img src={XLogo} alt="X (Twitter)" className="social-icon" />
          </a>
          <a href="#" className="social-link">
            <img src={InstagramLogo} alt="Instagram" className="social-icon" />
          </a>
          <a href="#" className="social-link">
            <img src={YoutubeLogo} alt="YouTube" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer