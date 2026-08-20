import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5006;
app.use(cors()); app.use(express.json());
const Note = mongoose.model('Note', new mongoose.Schema({ title: String, content: String, user: String }, { timestamps: true }));
let memory = [{ title: 'First note', content: 'Capture the thought, then make room for the next one.', user: 'demo' }];
app.get('/api/health', (_req, res) => res.json({ project: 'Notes App', status: 'ok' }));
app.get('/api/notes', async (_req, res) => res.json(mongoose.connection.readyState ? await Note.find().sort({ updatedAt: -1 }) : memory));
app.post('/api/notes', async (req, res) => { const data = { title: req.body.title, content: req.body.content, user: req.body.user || 'demo' }; const item = mongoose.connection.readyState ? await Note.create(data) : data; if (!mongoose.connection.readyState) memory.unshift(item); res.status(201).json(item); });
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Notes API running on ${port}`));
