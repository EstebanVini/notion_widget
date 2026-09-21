import React, { useState } from 'react';

export default function Highlights() {
  const [highlights, setHighlights] = useState([
    { id: 1, label: "Nosotros", cover: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27120%27%20height%3D%27120%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23efece5%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2716%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3E1%3C/text%3E%3C/svg%3E" },
    { id: 2, label: "Productos", cover: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27120%27%20height%3D%27120%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23efece5%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2716%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3E2%3C/text%3E%3C/svg%3E" },
    { id: 3, label: "Tips", cover: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27120%27%20height%3D%27120%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23efece5%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2716%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3E3%3C/text%3E%3C/svg%3E" }
  ]);

  const editHighlight = (h) => {
    const label = prompt('Nombre de la historia destacada:', h.label);
    if (label !== null) {
      setHighlights(highlights.map(item => item.id === h.id ? { ...item, label: label || item.label } : item));
    }
  };

  const addHighlight = () => {
    const label = prompt('Nombre de la nueva historia destacada:', 'Nueva');
    if (label) {
      setHighlights([...highlights, {
        id: Date.now(),
        label,
        cover: `data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27120%27%20height%3D%27120%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23efece5%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2716%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3E${encodeURIComponent(label[0] || 'H')}%3C/text%3E%3C/svg%3E`
      }]);
    }
  };

  return (
    <div className="highlights">
      {highlights.map(h => (
        <div key={h.id} className="highlight" onClick={() => editHighlight(h)}>
          <div className="ring"><img src={h.cover} alt={h.label} /></div>
          <div className="hlabel">{h.label}</div>
        </div>
      ))}
      <div className="highlight add" onClick={addHighlight}>
        <div className="ring">+</div>
        <div className="hlabel">Nueva</div>
      </div>
    </div>
  );
}
