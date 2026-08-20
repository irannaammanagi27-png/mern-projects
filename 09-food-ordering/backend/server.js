import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5009;
app.use(cors()); app.use(express.json());
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({ name: String, description: String, price: Number, category: String, image: String }, { timestamps: true }));
let memory = [{ name: 'Charred pepper pizza', description: 'Mozzarella, peppers, basil.', price: 14, category: 'Pizza' }, { name: 'Crisp garden salad', description: 'Greens, herbs, citrus dressing.', price: 9, category: 'Fresh' }];
app.get('/api/health', (_req, res) => res.json({ project: 'Food Ordering', status: 'ok' }));
app.get('/api/menu', async (_req, res) => res.json(mongoose.connection.readyState ? await MenuItem.find().sort({ createdAt: -1 }) : memory));
app.post('/api/orders', (req, res) => res.status(201).json({ id: `food-${Date.now()}`, items: req.body.items || [], total: req.body.total || 0, status: 'preparing' }));
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Food API running on ${port}`));
