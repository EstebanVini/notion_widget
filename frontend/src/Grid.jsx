import React from 'react';

export default function Grid() {
  return (
    <div className="grid-layout">
      {/* Columna Izquierda: perfil + historias + calendario */}
      <div className="col-profile">
        <div className="panel">
          <h3>Perfil</h3>
          {/* TODO: Profile Details */}
        </div>

        <div className="panel">
          {/* TODO: Calendar */}
          <h3>Calendario</h3>
        </div>
      </div>

      {/* Columna Derecha: grid tipo Instagram */}
      <div className="col-content">
        <div className="panel">
          <div className="feed-toolbar">
            <h3 style={{ margin: 0 }}>Grid de contenido</h3>
            <button className="add-btn">+ Añadir post</button>
          </div>
          <p className="hint" style={{ margin: '-6px 0 12px' }}>
            Arrastra para reordenar · clic en un post para verlo como publicación, editar su Canva o su fecha.
          </p>
          <div className="feed-grid">
            {/* TODO: Feed items */}
          </div>
        </div>
      </div>
    </div>
  );
}
