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
} from "@mantine/core";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["notes"], (result) => {
      if (result.notes) {
        setNotes(result.notes);
      }
    });
  }, []);

  const handleSaveNote = () => {
    if (newNote.trim() === "") return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        const noteToSave = {
          id: Date.now(),
          text: newNote,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          timestamp: Date.now(),
          url: currentTab.url,
        };
        const updatedNotes = [...notes, noteToSave];
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

  const handleClearAllNotes = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notes? This action cannot be undone."
      )
    ) {
      chrome.storage.local.set({ notes: [] }, () => {
        setNotes([]);
        console.log("All notes have been cleared.");
      });
    }
  };

  const openGraphView = () => {
    chrome.tabs.create({ url: "graphView.html" });
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
          <TextInput
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            label="Tags"
          />
          <Group grow>
            <Button onClick={handleSaveNote}>Save Note</Button>
            <Button onClick={openGraphView} variant="outline">
              Graph View
            </Button>
          </Group>
          {notes.length > 0 && (
            <Button
              onClick={handleClearAllNotes}
              color="red"
              variant="light"
              fullWidth
              mt="md"
            >
              Clear All Notes
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;
