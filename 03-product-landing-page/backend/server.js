import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5003;
app.use(cors()); app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ project: 'Product Landing Page', status: 'ok' }));
app.get('/api/product', (_req, res) => res.json({ name: 'Orbit Desk', tagline: 'A calmer command center for ambitious teams.', price: 149, features: ['Focused workflows', 'Shared visibility', 'Beautifully simple'] }));
app.post('/api/contact', (req, res) => res.status(201).json({ message: `Thanks, ${req.body.name || 'there'}! We will be in touch.` }));
app.listen(port, () => console.log(`Product API running on ${port}`));
