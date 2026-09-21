require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notionService = require('./services/notion');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/posts', async (req, res) => {
  try {
    const { client } = req.query;
    if (!client) {
      return res.status(400).json({ error: 'Missing client parameter' });
    }
    const posts = await notionService.getPosts(client);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { client } = req.query;
    if (!client) {
      return res.status(400).json({ error: 'Missing client parameter' });
    }
    const postData = req.body;
    const newPost = await notionService.createPost(client, postData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedPost = await notionService.updatePost(id, updates);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error.message);
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
