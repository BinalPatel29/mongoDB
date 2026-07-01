import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import noteRouter from './routes/notes.js';
import authRouter from './routes/auth.js';
import { protect } from './middleware/auth.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 400, message: 'Malformed JSON payload' });
  }
  next(err);
});

console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI environment variable');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

app.get('/api/new', (req, res) => {
  console.log('----------------');
  res.status(200).json({ message: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/notes', protect, noteRouter);
app.use('/frontend', express.static('frontend'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

app.get('/', (req, res) => {
  res.redirect('/frontend/index.html');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid note ID format' });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is actively running on port ${PORT}`);
});