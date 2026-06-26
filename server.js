import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import noteRouter from './routes/notes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ status: 400, message: "Malformed JSON payload" });
  }
  next(err);
});

app.use((req, res, next) => {
  if (req.method === 'POST') {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).send('Bad Request');
    }
    if (Object.keys(req.body).length === 0 || !req.body.text) {
      return res.status(400).json({ error: 'text is required' });
    }
  }
  next(); 
});

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

app.use('/api/notes', noteRouter);

app.use((req,res,next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err,req,res,next) => {
    if (err.name === 'CastError') {
       return res.status(400).json({ error: 'Invalid note ID format' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is actively running on port ${PORT}`);
});
