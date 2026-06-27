import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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

router.post('/login', async(req,res,next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ error : 'Email and password required' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ error : 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({ error : 'Invalid credentials' });
        }
        const token = jwt.sign (
            { userId: user._id } ,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token });
    } 
    catch(error){
        next(error);
    }
});

export default router;