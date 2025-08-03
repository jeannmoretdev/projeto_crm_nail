import React from 'react';
import './Card.css';

function Card({ children, style }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

export default Card;
