import React, { useEffect } from 'react';
import './Modal.css';

function Modal({ children, open, onClose, showCloseButton = true }) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup quando o componente for desmontado
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [open]);
  
  // Fechar modal ao pressionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {showCloseButton && (
          <button 
            className="modal-close-button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
