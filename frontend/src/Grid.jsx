import React, { useState } from 'react';
import Calendar from './Calendar';
import Highlights from './Highlights';

const PILLARS = {
  "Reel": "var(--c-reel)",
  "Carrusel": "var(--c-carrusel)",
  "TikTok": "var(--c-tiktok)",
  "Story": "var(--c-story)",
  "Post": "var(--c-post)"
};

export default function Grid({ posts, onAddPost, onUpdatePostOrder, onUpdatePostDate, onOpenModal }) {
  const [dragSrcId, setDragSrcId] = useState(null);

  const handleDragStart = (e, id) => {
    setDragSrcId(id);
    e.dataTransfer.setData('text/plain', id);
    // Use a timeout to add the dragging class so it doesn't fire immediately before drag image is captured
    setTimeout(() => {
      if (e.target.classList) e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target.classList) e.target.classList.remove('dragging');
    setDragSrcId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (dragSrcId && dragSrcId !== targetId) {
      onUpdatePostOrder(dragSrcId, targetId);
    }
  };

  const renderThumb = (post) => {
    const m = post.media?.[0];
    if (post.canvaEmbed) {
      return <iframe src={post.canvaEmbed} loading="lazy" title={post.title}></iframe>;
    }
    if (!m) {
      return <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>;
    }
    if (m.type === 'video') {
      return <img src={m.poster} alt={post.title} />;
    }
    return <img src={m.src} alt={post.title} />;
  };

  return (
    <div className="grid-layout">
      {/* Columna Izquierda: perfil + historias + calendario */}
      <div className="col-profile">
        <div className="panel">
          <h3>Perfil</h3>
          <div className="profile-header">
            <div className="avatar-wrap">
              <img className="avatar" src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27140%27%20height%3D%27140%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23e8e2d8%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2719%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3ELogo%3C/text%3E%3C/svg%3E" alt="Avatar" />
            </div>
            <div className="profile-meta">
              <div className="username" contentEditable suppressContentEditableWarning>@usuario_del_cliente</div>
              <div className="bio" contentEditable suppressContentEditableWarning>Bio de la cuenta en 1–2 líneas. Edítala aquí mismo.</div>
              <div className="link" contentEditable suppressContentEditableWarning>🔗 linkenbio.com</div>
            </div>
          </div>

          <h3 style={{ marginTop: '16px' }}>Historias destacadas</h3>
          <Highlights />
        </div>

        <div className="panel">
          <Calendar posts={posts} onUpdatePostDate={onUpdatePostDate} onOpenModal={onOpenModal} />
        </div>
      </div>

      {/* Columna Derecha: grid tipo Instagram */}
      <div className="col-content">
        <div className="panel">
          <div className="feed-toolbar">
            <h3 style={{ margin: 0 }}>Grid de contenido</h3>
            <button className="add-btn" onClick={onAddPost}>+ Añadir post</button>
          </div>
          <p className="hint" style={{ margin: '-6px 0 12px' }}>
            Arrastra para reordenar · clic en un post para verlo como publicación, editar su Canva o su fecha.
          </p>
          <div className="feed-grid">
            {posts.map(post => {
              const id = post._id || post.id;
              let badges = null;
              const hasMultipleMedia = post.media && post.media.length > 1;
              const isVideo = post.media && post.media[0] && post.media[0].type === 'video' && !post.canvaEmbed;

              return (
                <div 
                  key={id}
                  className="post-card"
                  draggable
                  onClick={() => onOpenModal(post)}
                  onDragStart={(e) => handleDragStart(e, id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, id)}
                >
                  <span className="pillar-tag" style={{ background: PILLARS[post.pillar] || PILLARS['Post'] }}>
                    {post.pillar}
                  </span>
                  {hasMultipleMedia && <span className="stack-icon">▤</span>}
                  {isVideo && <span className="play-icon">▶</span>}
                  
                  {renderThumb(post)}
                  
                  <div className="post-title">{post.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
