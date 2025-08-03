// Ícone de lixeira (excluir)
import React from 'react';

function IconDelete({ size = 20, color = 'var(--color-error)', style }) {
  // Usa cor vermelha padrão se não vier por props
  const finalColor = color === 'var(--color-error)' ? '#e74c3c' : color;
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="7" width="10" height="9" rx="2" stroke={finalColor} strokeWidth="1.5"/>
      <path d="M3 7h14" stroke={finalColor} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 10v4M12 10v4" stroke={finalColor} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="3" width="6" height="3" rx="1.5" stroke={finalColor} strokeWidth="1.5"/>
    </svg>
  );
}

export default IconDelete;
