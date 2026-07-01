 import {apiFetch} from '../js/api.js'

    const addBtn = document.getElementById('addnoteBtn');
    const noteInput = document.getElementById('noteInput');
    const notesList = document.getElementById('noteList');
    const logoutBtn = document.getElementById('logoutBtn');
    const emptyStateList = document.getElementById('emptyState');
    const errorEl = document.getElementById('errorMessage');
        
    function showError(message){
        if(message){
            errorEl.textContent = message;
            errorEl.style.display = "block";
        }
        else{
            errorEl.textContent = "";
            errorEl.style.display = "none";
        }
    }

    function checkTokenExpiry(error) {
        if (error && error.message === 'Invalid or expired token') {
            localStorage.clear();
            window.location.href = '/frontend/index.html';
            return true;
        }
        return false;
    }

    function setFormEnabled(enabled) {
        noteInput.disabled = !enabled;
        addBtn.disabled = !enabled;
    }

    document.addEventListener('DOMContentLoaded', async() => {
        const token = localStorage.getItem('token');

        if(!token){
            window.location.href= '/frontend/index.html';
            return;
        }
        logoutBtn.addEventListener("click", handleLogout);
        addBtn.addEventListener("click", handleAddNote);
        await fetchAndLoadNotes();
    });

    async function fetchAndLoadNotes() {
        try{
            const notes = await apiFetch('/api/notes', {
                method: "GET"
            });
            displayNotes(notes); 
        }
        catch(error){
            console.error('Failed to load notes:', error.message);
        }
    }

    async function displayNotes(notesArray){
        notesList.innerHTML="";
        if(!notesArray || notesArray.length === 0){
            emptyStateList.style.display= "block";
            return;
        }
        emptyStateList.style.display= "none";

        notesArray.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';

            const textEl = document.createElement('p');
            textEl.className = 'note-text';
            textEl.textContent = note.text; 

            const dateEl = document.createElement('span');
            dateEl.className = 'note-date';
            const parsedDate = note.createdAt ? new Date(note.createdAt) : new Date();
            const isValidDate = parsedDate instanceof Date && !isNaN(parsedDate)
            dateEl.textContent = isValidDate ? parsedDate.toLocaleString() : new Date().toLocaleString();

            const deleteE1 = document.createElement('p');
            deleteE1.className = 'note-del';
            deleteE1.textContent = "DELETE";

            deleteE1.addEventListener('click', () => {
                handleDeleteNote(note._id || note.id); 
            });

            noteItem.appendChild(textEl);
            noteItem.appendChild(dateEl);
            noteItem.appendChild(deleteE1);
            notesList.appendChild(noteItem);
        });
    }

    async function handleAddNote() {
        showError("");
        const noteText = noteInput.value.trim();

        if(!noteText){
            showError("Note cannot be empty.");
            noteInput.focus();
            return;
        }
        setFormEnabled(false);

        try{
            await apiFetch('/api/notes', {
                method : "POST",
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({ text : noteText }) 
            });
            noteInput.value ="";
            await fetchAndLoadNotes();
        }
        catch(error){
            console.error("Fetch error", error.message);
        }
        finally{
            setFormEnabled(true);
            noteInput.focus();
        }
    } 

    function handleLogout(){
        localStorage.removeItem('token');
        window.location.href = '/frontend/index.html';
    }

    async function handleDeleteNote(noteId){
        if(!noteId) return;
        try{
            await apiFetch(`/api/notes/${noteId}` ,{
                method: "DELETE"
            });
            await fetchAndLoadNotes();
        }
        catch(error){
            console.error('Failed to delete note:', error.message); 
        }
    }