import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Textarea,
  TextInput,
  Button,
  Group,
  Title,
  Paper,
  Autocomplete,
} from "@mantine/core";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [tags, setTags] = useState("");
  const [existingTags, setExistingTags] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(["notes"], (result) => {
      if (result.notes) {
        setNotes(result.notes);
        // Extract unique tags from existing notes
        const allTags = result.notes.flatMap(note => note.tags || []);
        const uniqueTags = [...new Set(allTags)].sort();
        setExistingTags(uniqueTags);
      }
    });
  }, []);

  const handleSaveNote = () => {
    if (newNote.trim() === "") return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        const newTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        
        const noteToSave = {
          id: Date.now(),
          text: newNote,
          tags: newTags,
          timestamp: Date.now(),
          url: currentTab.url,
        };
        const updatedNotes = [...notes, noteToSave];
        
        // Update existing tags list with any new tags
        const allTags = updatedNotes.flatMap(note => note.tags || []);
        const uniqueTags = [...new Set(allTags)].sort();
        setExistingTags(uniqueTags);
        
        chrome.storage.local.set({ notes: updatedNotes }, () => {
          setNotes(updatedNotes);
          setNewNote("");
          setTags("");
        });
      }
    });
  };

  const handleDeleteNote = (idToDelete) => {
    const updatedNotes = notes.filter((note) => note.id !== idToDelete);
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      setNotes(updatedNotes);
    });
  };

  const openGraphView = () => {
    chrome.tabs.create({ url: "graphView.html" });
  };

  // Helper function to get tag suggestions based on current input
  const getTagSuggestions = (input) => {
    if (!input) return existingTags.slice(0, 10); // Show top 10 tags if no input
    
    // Get the current tag being typed (after the last comma)
    const lastCommaIndex = input.lastIndexOf(',');
    const currentTag = lastCommaIndex >= 0 ? input.substring(lastCommaIndex + 1).trim() : input.trim();
    
    if (!currentTag) return existingTags.slice(0, 10);
    
    // Filter existing tags that start with the current tag (case insensitive)
    return existingTags.filter(tag => 
      tag.toLowerCase().startsWith(currentTag.toLowerCase()) && 
      !input.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
    ).slice(0, 10);
  };

  // Helper function to handle tag selection from autocomplete
  const handleTagSelect = (selectedTag) => {
    const lastCommaIndex = tags.lastIndexOf(',');
    let newTagsValue;
    
    if (lastCommaIndex >= 0) {
      // Replace the current tag being typed
      newTagsValue = tags.substring(0, lastCommaIndex + 1) + ' ' + selectedTag;
    } else {
      // Replace the entire input
      newTagsValue = selectedTag;
    }
    
    setTags(newTagsValue + ', ');
  };

  return (
    <Box w={350}>
      <Paper p="md" shadow="xs" withBorder h="100%">
        <Stack>
          <Title order={2} ta="center">
            Note It
          </Title>
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            label="Your Note"
            autosize
            minRows={3}
          />
          <Autocomplete
            value={tags}
            onChange={(value) => setTags(value)}
            onOptionSubmit={handleTagSelect}
            data={getTagSuggestions(tags)}
            placeholder="Tags (comma-separated)"
            label="Tags"
            comboboxProps={{ withinPortal: false }}
            maxDropdownHeight={200}
          />
          <Group grow>
            <Button onClick={handleSaveNote}>Save Note</Button>
            <Button onClick={openGraphView} variant="outline">
              Graph View
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;
