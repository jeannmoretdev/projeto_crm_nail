// Ícone de lápis (editar)
import React from 'react';

function IconEdit({ size = 20, color = 'var(--color-accent)', style }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.85 2.85a2 2 0 0 1 2.83 2.83l-9.5 9.5a1 1 0 0 1-.44.26l-3 1a1 1 0 0 1-1.27-1.27l1-3a1 1 0 0 1 .26-.44l9.5-9.5ZM13.44 4.26l-9.5 9.5 1 3 3-1 9.5-9.5-4.5-4.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default IconEdit;
