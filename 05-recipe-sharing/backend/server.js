import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5005;
app.use(cors()); app.use(express.json());
const Recipe = mongoose.model('Recipe', new mongoose.Schema({ title: String, description: String, ingredients: [String], category: String, image: String, author: String }, { timestamps: true }));
let memory = [{ title: 'Lemon herb pasta', description: 'Bright, quick, and weeknight friendly.', ingredients: ['Pasta', 'Lemon', 'Herbs'], category: 'Dinner', author: 'Cognetix' }];
app.get('/api/health', (_req, res) => res.json({ project: 'Recipe Sharing', status: 'ok' }));
app.get('/api/recipes', async (req, res) => { const category = req.query.category; const items = mongoose.connection.readyState ? await Recipe.find(category ? { category } : {}).sort({ createdAt: -1 }) : memory.filter(item => !category || item.category === category); res.json(items); });
app.post('/api/recipes', async (req, res) => { const data = { title: req.body.title, description: req.body.description, ingredients: req.body.ingredients || [], category: req.body.category || 'Other', image: req.body.image, author: req.body.author || 'You' }; const item = mongoose.connection.readyState ? await Recipe.create(data) : data; if (!mongoose.connection.readyState) memory.unshift(item); res.status(201).json(item); });
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Recipe API running on ${port}`));
