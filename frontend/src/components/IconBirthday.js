// Ícone de bolo de aniversário
import React from 'react';

function IconBirthday({ size = 16, color = 'var(--color-accent)', style }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Velas */}
      <rect x="7" y="2" width="1.5" height="4" fill={color} />
      <rect x="11.25" y="1" width="1.5" height="5" fill={color} />
      <rect x="15.5" y="2" width="1.5" height="4" fill={color} />
      
      {/* Chamas das velas */}
      <ellipse cx="7.75" cy="1.5" rx="0.8" ry="1.2" fill="#ff6b35" />
      <ellipse cx="12" cy="0.5" rx="0.8" ry="1.2" fill="#ff6b35" />
      <ellipse cx="16.25" cy="1.5" rx="0.8" ry="1.2" fill="#ff6b35" />
      
      {/* Base do bolo */}
      <rect x="4" y="6" width="16" height="8" rx="1" fill={color} />
      
      {/* Cobertura do bolo */}
      <path d="M4 9 C6 7, 8 9, 10 7 C12 9, 14 7, 16 9 C18 7, 20 9, 20 9 L20 13 C20 13.5, 19.5 14, 19 14 L5 14 C4.5 14, 4 13.5, 4 13 Z" fill="#ffb3ba" />
      
      {/* Decorações do bolo */}
      <circle cx="7" cy="11" r="0.8" fill="#ff69b4" />
      <circle cx="12" cy="10.5" r="0.8" fill="#ff69b4" />
      <circle cx="17" cy="11" r="0.8" fill="#ff69b4" />
      
      {/* Prato do bolo */}
      <ellipse cx="12" cy="15" rx="10" ry="2" fill="#e0e0e0" />
    </svg>
  );
}

export default IconBirthday;
