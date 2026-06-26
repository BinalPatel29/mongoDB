import express from 'express';
import { Router } from 'express';
import Note from '../models/Note.js';
const router = Router();

router.get('/' , async (req, res, next) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    }
    catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    catch (error) {
        next(error);
    }
});

export default router;