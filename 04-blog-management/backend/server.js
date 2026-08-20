import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5004;
app.use(cors()); app.use(express.json());
const Post = mongoose.model('Post', new mongoose.Schema({ title: String, excerpt: String, content: String, author: String, published: Boolean }, { timestamps: true }));
let memory = [{ title: 'Build in public', excerpt: 'Small, shipped increments compound.', content: 'Start with a useful slice and keep learning from it.', author: 'Cognetix', published: true }];
app.get('/api/health', (_req, res) => res.json({ project: 'Blog Management', status: 'ok' }));
app.get('/api/posts', async (_req, res) => res.json(mongoose.connection.readyState ? await Post.find({ published: true }).sort({ createdAt: -1 }) : memory));
app.post('/api/posts', async (req, res) => { const data = { title: req.body.title, excerpt: req.body.excerpt, content: req.body.content, author: req.body.author || 'You', published: Boolean(req.body.published) }; const post = mongoose.connection.readyState ? await Post.create(data) : data; if (!mongoose.connection.readyState) memory.unshift(post); res.status(201).json(post); });
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Blog API running on ${port}`));
