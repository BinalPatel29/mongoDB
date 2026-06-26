import chalk from "chalk";
import { readNotes } from "./storage.js";
import { addNote, listNote, readNote, deleteNote, searchNote, clearNote } from "./commands.js";

export async function main(){
    const argv = process.argv.slice(2);
    const action = argv[0];
    const target = argv [1];
    const notes =await readNotes();

    switch(action){
        case "add":
            await addNote(target,notes);
            break;
        case "list":
            await listNote(notes);
            break;
        case "read":
            await readNote(target,notes);
            break;
        case "delete":
            await deleteNote(target,notes);
            break;
        case "search":
            await searchNote(target,notes);
            break;
        case "clear":
            await clearNote(notes);
            break;
        default:
            console.log(chalk.magenta("Available commands:"));
            console.log("  add a note");
            console.log("  list all notes");
            console.log("  read a specific note");
            console.log("  delete a specific note");
            console.log("  search through note");
            console.log("  clear all notes");
            break;
        }
}
main();