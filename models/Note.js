import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: String,
        default: () => {
            const now = new Date();
            return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        }
    } 
});

const Note = mongoose.model('Note', notesSchema);
export default Note;
