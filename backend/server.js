require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/posts', (req, res) => {
  res.json([]);
});

app.post('/api/posts', (req, res) => {
  res.status(200).json({});
});

app.patch('/api/posts/:id', (req, res) => {
  res.status(200).json({});
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
