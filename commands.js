import chalk from "chalk";
import readline from "readline";
import { saveNotes } from "./storage.js";

export async function addNote(target,notes){
    if (!target) {
        console.log(chalk.red("Error: Please specify a task description to add."));
        return;
    }
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const newNote = {
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
        text: target,
        createdAt: dateStr
    };
    notes.push(newNote);
    await saveNotes(notes);
    console.log(chalk.green(`Note added: ${target}`));
}

export async function listNote(notes){
    if(notes.length === 0){
            console.log(chalk.yellow("No notes saved yet."));
        }
    notes.forEach((note) => {
        const displayText = note.text.length > 40 ? `${note.text.slice(0, 40)}...` : note.text;
        console.log(`${note.id}. ${chalk.yellow(note.createdAt)} - ${chalk.blue.bold(displayText)}`); 
     });
}

export async function readNote(target,notes){
    if (!target) {
        console.log(chalk.red("Error: please provide a note ID."));
        return;
    }
    const noteId = Number(target);
    const noteToRead = notes.find((note) => note.id === noteId);
      if (!noteToRead) {
        console.log(chalk.yellow(`ID not found.`));
        return;
    }
    console.log(`${noteToRead.id}. ${chalk.yellow(noteToRead.createdAt)} - ${chalk.blue.bold(noteToRead.text)}`);
}

export async function deleteNote(target,notes){
    const idToDelete = parseInt(target);
    if (isNaN(idToDelete)) {
    console.log(chalk.red("Error: Please provide a valid numeric ID."));
    return;
    }
    const initialLength = notes.length;
    const filternotes = notes.filter((note) => note.id !==idToDelete );  
    if(filternotes.length === initialLength){
        console.log(chalk.red("Error: Note ID not found."));
        return;
    }
    await saveNotes(filternotes);
    console.log(`${idToDelete} was deleted successfully.`);
}

export async function searchNote(target,notes){
    if (!target) {
        console.log(chalk.red("Error: Please provide a search term."));
        return;
    }
    const keyword = target.toLowerCase();
    const matchedNotes = notes.filter((note) => note.text.toLowerCase().includes(keyword) || note.createdAt.toLowerCase().includes(keyword) || String(note.id) === keyword);

    if (matchedNotes.length === 0) {
        console.log(chalk.yellow(`No notes found matching "${target}".`));
        return;
    }
    matchedNotes.forEach((note) => {
    console.log(`${note.id}. ${chalk.yellow(note.createdAt)} - ${chalk.blue.bold(note.text)}`);
    });
}

export async function clearNote(notes){
    const rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout,
    });
    rl.question('\nAre you sure you want to delete all notes? (YES/NO) ', async(answer) => {
        if (answer.toUpperCase() === 'YES') {
          await saveNotes([]);
          rl.close();
        } else {
          console.log("Clear action canceled.");
        }
        rl.close();
    });
}