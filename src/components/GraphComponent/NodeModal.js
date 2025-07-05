import React, { useState } from "react";
import {
  Drawer,
  Text,
  Button,
  Group,
  Textarea,
  TextInput,
  Stack,
  Title,
  Box,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";

const NodeModal = ({ opened, onClose, selectedNode, notes, onUpdateNotes }) => {  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState("");

  // Find the full note data when modal opens
  const fullNote = notes.find(
    (note) => String(note.id) === String(selectedNode?.id)
  );

  const handleEdit = () => {
    if (fullNote) {
      setEditText(fullNote.text);
      setEditTags(fullNote.tags ? fullNote.tags.join(", ") : "");
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!fullNote || editText.trim() === "") return;

    const updatedNote = {
      ...fullNote,
      text: editText.trim(),
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const updatedNotes = notes.map((note) =>
      note.id === fullNote.id ? updatedNote : note
    );

    chrome.storage.local.set({ notes: updatedNotes }, () => {
      onUpdateNotes(updatedNotes);
      setIsEditing(false);
      onClose();
    });
  };

  const handleDelete = () => {
    if (!fullNote) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = notes.filter((note) => note.id !== fullNote.id);
      chrome.storage.local.set({ notes: updatedNotes }, () => {
        onUpdateNotes(updatedNotes);
        onClose();
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText("");
    setEditTags("");
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      zIndex={9999}
      title={
        <Group justify="space-between" w="100%">
          <Title order={3}>Note Details</Title>
          <ActionIcon variant="subtle" onClick={onClose}>
            <IconX size={16} />
          </ActionIcon>
        </Group>
      }
      size="md"
      position="right"
    >     
      {!fullNote ? (
        <Text c="dimmed">Note not found.</Text>
      ) : (
        <Stack spacing="md">
          {isEditing ? (
            <>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your note..."
                label="Note Content"
                autosize
                minRows={4}
              />
              <TextInput
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma-separated)"
                label="Tags"
              />
              <Group justify="flex-end">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </Group>
            </>
          ) : (
            <>
              <Box>
                <Text size="sm" c="dimmed" mb={4}>
                  Content
                </Text>
                <Text>{fullNote.text}</Text>
              </Box>

              {fullNote.tags && fullNote.tags.length > 0 && (
                <Box>
                  <Text size="sm" c="dimmed" mb={4}>
                    Tags
                  </Text>
                  <Group gap="xs">
                    {fullNote.tags.map((tag, index) => (
                      <Text
                        key={index}
                        size="xs"
                        bg="blue.1"
                        c="blue.7"
                        px={8}
                        py={2}
                        style={{ borderRadius: 4 }}
                      >
                        {tag}
                      </Text>
                    ))}
                  </Group>
                </Box>
              )}

              <Box>
                <Text size="sm" c="dimmed" mb={4}>
                  Created
                </Text>
                <Text size="sm">
                  {new Date(fullNote.timestamp).toLocaleString()}
                </Text>
              </Box>

              {fullNote.url && fullNote.url !== "#" && (
                <Box>
                  <Text size="sm" c="dimmed" mb={4}>
                    Source URL
                  </Text>
                  <Text size="sm" style={{ wordBreak: "break-all" }}>
                    {fullNote.url}
                  </Text>
                </Box>
              )}

              <Group justify="flex-end" mt="md">
                <Tooltip label="Edit Note">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={handleEdit}
                    size="lg"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete Note">
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={handleDelete}
                    size="lg"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </>
          )}
        </Stack>
      )}
    </Drawer>
  );
};

export default NodeModal; 