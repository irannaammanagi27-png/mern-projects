import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5007;
app.use(cors()); app.use(express.json());
const Product = mongoose.model('Product', new mongoose.Schema({ name: String, description: String, price: Number, category: String, image: String }, { timestamps: true }));
let memory = [{ name: 'Field notebook', description: 'A tactile place for better ideas.', price: 18, category: 'Stationery' }, { name: 'Desk lamp', description: 'Warm light for focused work.', price: 64, category: 'Workspace' }];
app.get('/api/health', (_req, res) => res.json({ project: 'E-Commerce Store', status: 'ok' }));
app.get('/api/products', async (_req, res) => res.json(mongoose.connection.readyState ? await Product.find().sort({ createdAt: -1 }) : memory));
app.post('/api/orders', (req, res) => res.status(201).json({ id: `order-${Date.now()}`, items: req.body.items || [], total: req.body.total || 0, status: 'pending' }));
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Store API running on ${port}`));
