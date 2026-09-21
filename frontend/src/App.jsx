import React, { useState, useEffect } from 'react';
import Header from './Header';
import Grid from './Grid';
import PostModal from './PostModal';
import './App.css';

const CLIENT_ID = 'roca-demo';

function App() {
  const [posts, setPosts] = useState([]);
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [modalPost, setModalPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts?client=${CLIENT_ID}`)
      .then(res => res.json())
      .then(data => {
        // Assume API returns array of posts. If it's an object with a data prop, adjust accordingly.
        const loadedPosts = Array.isArray(data) ? data : (data.posts || []);
        // Sort by order or just use returned order
        setPosts(loadedPosts);
      })
      .catch(err => console.error('Failed to fetch posts:', err));
  }, []);

  const handleToggleFilter = (pillar) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(pillar)) next.delete(pillar);
      else next.add(pillar);
      return next;
    });
  };

  const filteredPosts = posts.filter(p => activeFilters.size === 0 || activeFilters.has(p.pillar));

  const handleAddPost = async () => {
    const title = prompt('Título del nuevo post:', 'Nuevo post');
    if (!title) return;
    const pillar = prompt('Pilar (Reel, Carrusel, TikTok, Story, Post):', 'Post');
    
    const newPost = {
      client: CLIENT_ID,
      title,
      pillar: pillar || 'Post',
      date: new Date().toISOString().slice(0,10),
      media: [{
        type: 'image',
        src: `data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27500%27%20height%3D%27500%27%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23e8e2d8%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2770%27%20fill%3D%27%238a8272%27%20text-anchor%3D%27middle%27%20dominant-baseline%3D%27middle%27%3E${encodeURIComponent(title.slice(0,10))}%3C/text%3E%3C/svg%3E`
      }],
      caption: '',
      canvaEmbed: ''
    };

    try {
      const res = await fetch(`/api/posts?client=${CLIENT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const created = await res.json();
      setPosts([...posts, created]);
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleUpdatePostOrder = async (srcId, targetId) => {
    if (srcId === targetId) return;
    const fromIdx = posts.findIndex(p => (p._id || p.id) === srcId);
    const toIdx = posts.findIndex(p => (p._id || p.id) === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const newPosts = [...posts];
    const [moved] = newPosts.splice(fromIdx, 1);
    newPosts.splice(toIdx, 0, moved);
    setPosts(newPosts);

    // Simplest approach: patch the moved item with its new order.
    // If backend uses an 'orden' field, we calculate a simple one or just rely on the API array patch.
    // Let's assume the API accepts an `orden` field.
    const toOrder = toIdx; // Just sending index as order
    
    try {
      await fetch(`/api/posts/${srcId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden: toOrder })
      });
      // Optionally we might need to send the whole array to save all orders, but we'll stick to a simple PATCH.
    } catch (err) {
      console.error('Order update failed:', err);
    }
  };

  const handleUpdatePostDate = async (postId, newDate) => {
    setPosts(prev => prev.map(p => (p._id || p.id) === postId ? { ...p, date: newDate } : p));
    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate })
      });
    } catch (err) {
      console.error('Date update failed:', err);
    }
  };

  const handleUpdatePostFields = async (postId, fields) => {
    setPosts(prev => prev.map(p => (p._id || p.id) === postId ? { ...p, ...fields } : p));
    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
    } catch (err) {
      console.error('Field update failed:', err);
    }
  };

  return (
    <div className="app">
      <Header activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
      <Grid 
        posts={filteredPosts} 
        onAddPost={handleAddPost}
        onUpdatePostOrder={handleUpdatePostOrder}
        onUpdatePostDate={handleUpdatePostDate}
        onOpenModal={(post) => setModalPost(post)}
      />
      {modalPost && (
        <PostModal 
          post={modalPost} 
          onClose={() => setModalPost(null)}
          onUpdate={handleUpdatePostFields}
        />
      )}
    </div>
  );
}

export default App;
