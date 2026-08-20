import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express(); const port = process.env.PORT || 5008;
app.use(cors()); app.use(express.json());
const Job = mongoose.model('Job', new mongoose.Schema({ title: String, company: String, description: String, location: String, type: String, skills: [String], status: { type: String, default: 'approved' }, employer: String }, { timestamps: true }));
let memory = [{ title: 'Frontend Engineer', company: 'Cognetix', description: 'Shape thoughtful React experiences with a collaborative team.', location: 'Remote', type: 'Full-time', skills: ['React', 'JavaScript'], status: 'approved' }];
app.get('/api/health', (_req, res) => res.json({ project: 'Job Portal', status: 'ok' }));
app.get('/api/jobs', async (req, res) => { const search = String(req.query.search || '').toLowerCase(); const items = mongoose.connection.readyState ? await Job.find({ status: 'approved' }) : memory.filter(job => !search || `${job.title} ${job.company} ${job.skills}`.toLowerCase().includes(search)); res.json(items); });
app.post('/api/jobs', async (req, res) => { const data = { ...req.body, status: 'pending' }; const item = mongoose.connection.readyState ? await Job.create(data) : data; if (!mongoose.connection.readyState) memory.unshift(item); res.status(201).json(item); });
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).catch(() => console.log('MongoDB unavailable; using memory mode'));
app.listen(port, () => console.log(`Jobs API running on ${port}`));
