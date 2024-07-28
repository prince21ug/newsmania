const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://ankitkumar92771:JC8FnYA0OWbVQOVJ@new-test.iv24b60.mongodb.net/?retryWrites=true&w=majority&appName=new-test', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Article Schema
const articleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  author: String,
  publishedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Newsmania API');
});

// Get all articles
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single article by ID
app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new article
app.post('/articles', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    author: req.body.author,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an article
app.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.title = req.body.title;
    article.summary = req.body.summary;
    article.content = req.body.content;
    article.author = req.body.author;
    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an article
app.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    await article.remove();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
