import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const port = process.env.PORT || 5002;
app.use(cors()); app.use(express.json());
const Expense = mongoose.model('Expense', new mongoose.Schema({ title: String, amount: Number, type: { type: String, enum: ['income', 'expense'], default: 'expense' }, category: String }, { timestamps: true }));
let memory = [{ title: 'Welcome income', amount: 1200, type: 'income', category: 'Salary' }];
app.get('/api/health', (_req, res) => res.json({ project: 'Expense Tracker', status: 'ok' }));
app.get('/api/expenses', async (_req, res) => res.json(mongoose.connection.readyState ? await Expense.find().sort({ createdAt: -1 }) : memory));
app.post('/api/expenses', async (req, res) => { const data = { title: req.body.title, amount: Number(req.body.amount), type: req.body.type, category: req.body.category }; const item = mongoose.connection.readyState ? await Expense.create(data) : data; if (!mongoose.connection.readyState) memory.unshift(item); res.status(201).json(item); });
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Expense API running on ${port}`));
