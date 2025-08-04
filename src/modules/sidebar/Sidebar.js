import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Sidebar.css';

function Sidebar({ activeModule, setActiveModule }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavClick = (module) => {
    setActiveModule(module);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Header mobile com logo e botão hambúrguer */}
      <Header 
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={toggleSidebar}
      />

      {/* Overlay para fechar menu no mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${isCollapsed && !isMobile ? 'sidebar-collapsed' : ''} ${isMobile ? (isMobileMenuOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
      <div className="sidebar-header">
        <div className="brand-container">
          <h1 className={`brand-name ${isCollapsed && !isMobile ? 'collapsed' : ''}`}>
            {isCollapsed && !isMobile ? (
              <span className="brand-initials">CN</span>
            ) : (
              <span className="brand-text">Camila Nails</span>
            )}
          </h1>
        </div>
        
        {!isMobile && (
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              {isCollapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <button 
              className={`nav-link ${activeModule === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Dashboard</span>}
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeModule === 'clientes' ? 'active' : ''}`}
              onClick={() => handleNavClick('clientes')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <path d="M20 8v6"/>
                <path d="M23 11h-6"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Clientes</span>}
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeModule === 'servicos' ? 'active' : ''}`}
              onClick={() => handleNavClick('servicos')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.5a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Serviços</span>}
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeModule === 'agendamentos' ? 'active' : ''}`}
              onClick={() => handleNavClick('agendamentos')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Agendamentos</span>}
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeModule === 'agenda-livre' ? 'active' : ''}`}
              onClick={() => handleNavClick('agenda-livre')}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <circle cx="8" cy="16" r="2"/>
                <path d="m8.5 14l1 2 3-3"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Agenda Livre</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
    </>
  );
}

export default Sidebar;
