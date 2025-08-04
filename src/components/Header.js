import React from 'react';
import './Header.css';

function Header({ isMobile, isMobileMenuOpen, onToggleMenu }) {
  if (!isMobile) return null;

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        <h1 className="mobile-brand">
          <span className="mobile-brand-text">Camila Nails</span>
        </h1>
        
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={onToggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
