import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        next(error);
    }
});
export default router;