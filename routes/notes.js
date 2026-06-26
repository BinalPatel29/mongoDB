import express from 'express';
import { readNotes, saveNotes } from '../storage.js';
import { Router } from 'express';
import Note from '../models/Note.js';

Router.get('/' , async(req,res,next) => {
    try{
        const notes = await Note.find();
        res.json(notes);
    }
    catch(error){
        next(error);
    }
});

Router.get('/:id', async(req,res,next) => {
    try{
        const note = await Note.findById(req,URLSearchParams.id);
        if(!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    catch(error){
        next(error);
    }
});