import mongoose from 'mongoose';
import 'dotenv/config';
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('Connection failed:', err.message));