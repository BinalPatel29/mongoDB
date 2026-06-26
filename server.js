import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import noteRouter from './routes/notes.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

app.use('/api/notes', noteRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is actively running on port ${PORT}`);
});
