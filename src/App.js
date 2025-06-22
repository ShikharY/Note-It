import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['notes'], (result) => {
      if (result.notes) {
        setNotes(result.notes);
      }
    });
  }, []);

  const handleSaveNote = () => {
    if (newNote.trim() === '') return;

    const noteToSave = {
      id: Date.now(),
      text: newNote,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      timestamp: new Date().toLocaleString()
    };

    const updatedNotes = [...notes, noteToSave];
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      setNotes(updatedNotes);
      setNewNote('');
      setTags('');
    });
  };
  
  const handleDeleteNote = (idToDelete) => {
    const updatedNotes = notes.filter(note => note.id !== idToDelete);
    chrome.storage.local.set({ notes: updatedNotes }, () => {
        setNotes(updatedNotes);
    });
  };

  const handleClearAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
      chrome.storage.local.set({ notes: [] }, () => {
        setNotes([]);
        console.log('All notes have been cleared.');
      });
    }
  };

  const openGraphView = () => {
    chrome.tabs.create({ url: 'graphView.html' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Note It</h1>
      </header>
      <div className="note-form">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        />
        <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
        />
      </div>

      <div className="button-group">
        <button onClick={handleSaveNote} className="btn-save">Save Note</button>
        <button onClick={openGraphView} className="btn-graph">Graph View</button>
      </div>

      {notes.length > 0 && (
        <div className="footer-actions">
          <button onClick={handleClearAllNotes} className="btn-clear-all">
            Clear All Notes
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 