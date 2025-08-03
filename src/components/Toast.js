import React from 'react';
import './Toast.css';

function Toast({ children, open }) {
  if (!open) return null;
  return (
    <div className="toast">
      {children}
    </div>
  );
}

export default Toast;
