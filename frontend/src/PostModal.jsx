import React, { useState, useEffect } from 'react';

const PILLARS = ["Reel", "Carrusel", "TikTok", "Story", "Post"];

export default function PostModal({ post, onClose, onUpdate }) {
  const [tab, setTab] = useState('post');
  const [slide, setSlide] = useState(0);

  // Local state for edits
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (post) {
      setEditData({
        title: post.title || '',
        pillar: post.pillar || 'Post',
        date: post.date || '',
        caption: post.caption || '',
        canvaEmbed: post.canvaEmbed || ''
      });
      setTab('post');
      setSlide(0);
    }
  }, [post]);

  if (!post) return null;

  const handleChange = (field, value) => {
    const newData = { ...editData, [field]: value };
    setEditData(newData);
    onUpdate(post._id || post.id, newData); // Auto-save on change
  };

  const handleClose = (e) => {
    if (e.target.className === 'overlay open') {
      onClose();
    }
  };

  const media = post.media || [];
  const currentMedia = media[slide] || media[0] || {};

  return (
    <div className="overlay open" onClick={handleClose}>
      <div className="post-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-tabs">
          <button className={tab === 'post' ? 'active' : ''} onClick={() => setTab('post')}>Vista publicación</button>
          <button className={tab === 'raw' ? 'active' : ''} onClick={() => setTab('raw')}>Imágenes / video</button>
          <button className={tab === 'edit' ? 'active' : ''} onClick={() => setTab('edit')}>Editar / Canva</button>
        </div>

        {tab === 'post' && (
          <div id="viewPost">
            <div className="ig-header">
              <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2760%27%20height%3D%2760%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23e8e2d8%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2712%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3ELogo%3C/text%3E%3C/svg%3E" alt="Avatar" />
              <span className="acc">@usuario_del_cliente</span>
            </div>
            
            <div className="ig-media">
              {editData.canvaEmbed ? (
                <iframe src={editData.canvaEmbed} title="canva" />
              ) : currentMedia.type === 'video' ? (
                <video src={currentMedia.src} poster={currentMedia.poster} controls></video>
              ) : (
                <img src={currentMedia.src} alt="" />
              )}
              {media.length > 1 && !editData.canvaEmbed && (
                <>
                  <div className="ig-dots">
                    {media.map((_, i) => <span key={i} className={i === slide ? 'on' : ''}></span>)}
                  </div>
                  <button className="ig-nav prev" onClick={() => setSlide((slide - 1 + media.length) % media.length)}>‹</button>
                  <button className="ig-nav next" onClick={() => setSlide((slide + 1) % media.length)}>›</button>
                </>
              )}
            </div>
            
            <div className="ig-actions">
              ❤ 💬 ➤ <span className="push">🔖</span>
            </div>
            <div className="ig-caption">
              <b>@usuario_del_cliente</b> {editData.caption || editData.title}
            </div>
          </div>
        )}

        {tab === 'raw' && (
          <div className="raw-view">
            <div className="raw-strip">
              {media.map((m, i) => m.type === 'video'
                ? <video key={i} src={m.src} poster={m.poster} controls></video>
                : <img key={i} src={m.src} alt="" />
              )}
            </div>
          </div>
        )}

        {tab === 'edit' && (
          <div className="field-row" style={{ paddingTop: '14px' }}>
            <label>Título</label>
            <input value={editData.title} onChange={e => handleChange('title', e.target.value)} />
            
            <label>Pilar / formato</label>
            <select value={editData.pillar} onChange={e => handleChange('pillar', e.target.value)}>
              {PILLARS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            
            <label>Fecha de publicación</label>
            <input type="date" value={editData.date} onChange={e => handleChange('date', e.target.value)} />
            
            <label>Caption</label>
            <textarea rows="2" value={editData.caption} onChange={e => handleChange('caption', e.target.value)}></textarea>
            
            <label>Link de Canva (Compartir → Más → Insertar en un sitio web)</label>
            <input placeholder="https://www.canva.com/design/.../view?embed" value={editData.canvaEmbed} onChange={e => handleChange('canvaEmbed', e.target.value)} />
            <span className="hint-small">Si pegas el link de embed de Canva, la publicación se actualiza sola cada vez que edites el diseño.</span>
          </div>
        )}
      </div>
    </div>
  );
}
