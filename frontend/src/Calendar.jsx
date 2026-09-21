import React, { useState } from 'react';

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DOW = ["L","M","M","J","V","S","D"];

const PILLARS = {
  "Reel": "var(--c-reel)",
  "Carrusel": "var(--c-carrusel)",
  "TikTok": "var(--c-tiktok)",
  "Story": "var(--c-story)",
  "Post": "var(--c-post)"
};

export default function Calendar({ posts, onUpdatePostDate, onOpenModal }) {
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth()); // 0-indexed

  const shiftMonth = (delta) => {
    let newMonth = calMonth + delta;
    let newYear = calYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCalMonth(newMonth);
    setCalYear(newYear);
  };

  const firstDay = new Date(calYear, calMonth, 1);
  let startOffset = firstDay.getDay() - 1; // lunes=0
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      onUpdatePostDate(postId, dateStr);
    }
  };

  return (
    <>
      <div className="cal-head">
        <button onClick={() => shiftMonth(-1)}>‹</button>
        <div className="cal-month">{`${MESES[calMonth]} ${calYear}`}</div>
        <button onClick={() => shiftMonth(1)}>›</button>
      </div>
      <div className="cal-grid">
        {DOW.map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
        
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="cal-day empty"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayPosts = posts.filter(p => p.date === dateStr);

          return (
            <div 
              key={day} 
              className="cal-day"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <div className="cal-num">{day}</div>
              {dayPosts.map(p => (
                <div 
                  key={p._id || p.id} 
                  className="cal-chip"
                  style={{ background: PILLARS[p.pillar] || PILLARS['Post'] }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', p._id || p.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(p);
                  }}
                >
                  {p.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <p className="field-row" style={{ padding: '10px 0 0' }}>
        <span className="hint-small">Arrastra una tarjeta del grid hacia un día para programarla — se actualiza en ambos lados al instante.</span>
      </p>
    </>
  );
}
