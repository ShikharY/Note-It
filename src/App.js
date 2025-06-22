import React, { useState, useEffect } from 'react';

function App() {
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    // Load existing notes to be able to append new ones correctly.
    chrome.storage.local.get(['notes'], (result) => {
      if (result.notes) {
        setSavedNotes(result.notes);
      }
    });
  }, []);

  const saveNote = () => {
    if (note.trim()) {
      const newNote = {
        id: Date.now(),
        text: note,
        // Split tags by comma, trim whitespace, and filter out empty tags
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date().toLocaleString(),
        // In a real extension, you might get the current tab's URL.
        // For the popup, this might not be directly available without more permissions/APIs.
        url: '' 
      };

      const updatedNotes = [...savedNotes, newNote];
      
      chrome.storage.local.set({ notes: updatedNotes }, () => {
        setSavedNotes(updatedNotes);
        setNote('');
        setTags('');
      });
    }
  };

  const openGraphView = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('graphView.html') });
  };

  return (
    <div className="app">
      <h1>Note It</h1>
      
      <div className="note-input">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags (comma-separated)..."
          className="tags-input"
        />
        <button onClick={saveNote}>Save Note</button>
      </div>

      <div className="graph-view-button">
        <button onClick={openGraphView} className="graph-btn">
          Open Graph View
        </button>
      </div>
    </div>
  );
}

export default App; 