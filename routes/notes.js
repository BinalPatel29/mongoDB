import express, { json } from 'express';
import { Router } from 'express';
import Note from '../models/Note.js';

const router = Router();

router.get('/', async(req,res,next) => {
    try {
      const notes = await Note.find({ userId : req.userId });
      res.json(notes);
    }
    catch(error) {
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

router.post('/', async(req,res,next) => {
    try {
       const note = new Note({ text : req.body.text, userId : req.userId });
       await note.save();
       res.status(201).json(note);
    }
    catch(error){
        if(error.name === 'ValidationError'){
            return res.status(400).json({ error : error.message });
        }
        next(error);
    }
});

router.patch('/:id', async(req,res,next) => {
    try{
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!note) return res.status(404).json({ error: 'Note not found' });
        res.json( { message : 'Note updated successfully', note });
    }
    catch(error){
        next(error);
    }
});

router.delete('/:id', async(req,res,next) => {
    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note) return res.status(404).json({ error: 'Note not found' });
        res.json({ message : 'Note deleted successfully' });
    }
    catch(error){
        next(error);
    }
});

export default router;