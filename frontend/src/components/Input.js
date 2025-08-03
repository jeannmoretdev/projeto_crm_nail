import React from 'react';
import './Input.css';

function Input({ label, required, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}{required && ' *'}</label>}
      <input className="input" {...props} />
    </div>
  );
}

export default Input;
