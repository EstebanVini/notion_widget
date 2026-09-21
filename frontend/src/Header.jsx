import React from 'react';

const PILLARS = {
  "Reel": "var(--c-reel)",
  "Carrusel": "var(--c-carrusel)",
  "TikTok": "var(--c-tiktok)",
  "Story": "var(--c-story)",
  "Post": "var(--c-post)"
};

export default function Header({ activeFilters, onToggleFilter }) {
  return (
    <div className="filters">
      <span className="label">Filtrar por pilar:</span>
      {Object.entries(PILLARS).map(([pillar, color]) => (
        <div 
          key={pillar}
          className={`chip ${activeFilters.has(pillar) ? 'active' : ''}`}
          style={{ '--dot': color }}
          onClick={() => onToggleFilter(pillar)}
        >
          <span className="dot"></span>{pillar}
        </div>
      ))}
    </div>
  );
}
