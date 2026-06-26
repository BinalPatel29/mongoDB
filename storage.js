import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname,'notes.json');

export async function readNotes() {
  try {
    await fs.promises.access(FILE_PATH);
  } catch {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  try {
    const data = await fs.promises.readFile(FILE_PATH, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red(`Load Error: ${error.message}`));
    return [];
  }
}

export async function saveNotes(notes) {
  try {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(notes, null, 2), "utf8");
  } catch (error) {
    console.error(chalk.red(`Save Error: ${error.message}`));
  }
}