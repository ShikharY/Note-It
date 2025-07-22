import React, { useState, useEffect } from "react";
import {
  Modal,
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
  Badge,
  Divider,
  Paper,
  Anchor,
  Collapse,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconX,
  IconCopy,
  IconExternalLink,
  IconCalendar,
  IconTag,
  IconLink,
  IconFileText,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

const NodeModal = ({
  opened,
  onClose,
  nodeData,
  onUpdateNote,
  onDeleteNote,
  nodePosition,
}) => {
  const [fullNote, setFullNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState("");
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Helper to reset edit state to current note
  const resetEditState = (note) => {
    setEditText(note?.text || "");
    setEditTags(note?.tags ? note.tags.join(", ") : "");
    setIsEditing(false);
    setIsTextExpanded(false);
  };

  useEffect(() => {
    if (nodeData) {
      setFullNote(nodeData);
      resetEditState(nodeData);
    }
  }, [nodeData]);

  // Also exit edit mode and reset show more if modal closes
  useEffect(() => {
    if (!opened) {
      setIsEditing(false);
      setIsTextExpanded(false);
      if (fullNote) {
        setEditText(fullNote.text || "");
        setEditTags(fullNote.tags ? fullNote.tags.join(", ") : "");
      }
    }
  }, [opened, fullNote]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedNote = {
      ...fullNote,
      text: editText.trim(),
      tags: editTags.trim()
        ? editTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      modified: Date.now(), // Update last modified timestamp
    };

    onUpdateNote(updatedNote);
    setFullNote(updatedNote);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDeleteNote(fullNote.id);
      onClose();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(fullNote.text || "");
    setEditTags(fullNote.tags ? fullNote.tags.join(", ") : "");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openUrl = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  };

  const shouldShowExpandButton = fullNote?.text && fullNote.text.length > 150;
  const displayText = isTextExpanded
    ? fullNote?.text
    : fullNote?.text?.substring(0, 150) +
      (fullNote?.text?.length > 150 ? "..." : "");

  return (
    <>
      {opened && console.log("NodeModal rendered for node:", fullNote)}
      <Modal
        opened={opened}
        onClose={() => {
          if (fullNote) resetEditState(fullNote);
          onClose();
        }}
        zIndex={9999}
        withCloseButton={false}
        closeOnClickOutside={true}
        closeOnEscape={true}
        size="sm"
        centered={false}
        styles={{
          header: { display: "none" },
          body: {
            backgroundColor: "#2c2e33",
            padding: 0,
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            border: "2.5px solid #4dabf7",
          },
          content:
            nodePosition &&
            nodePosition.x !== undefined &&
            nodePosition.y !== undefined
              ? (() => {
                  const width = 340;
                  const height = 400;
                  const left = Math.max(
                    8,
                    Math.min(window.innerWidth - width - 8, nodePosition.x + 60)
                  );
                  const top = Math.max(
                    8,
                    Math.min(
                      window.innerHeight - height - 8,
                      nodePosition.y - 150
                    )
                  );
                  return {
                    position: "fixed",
                    top: top + "px",
                    left: left + "px",
                    width: width + "px",
                    maxHeight: "90vh",
                    minHeight: "120px",
                    overflow: "hidden",
                    border: "2.5px solid #4dabf7",
                    zIndex: 9999,
                  };
                })()
              : {
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "340px",
                  maxHeight: "90vh",
                  minHeight: "120px",
                  overflow: "hidden",
                  border: "2.5px solid #4dabf7",
                  zIndex: 9999,
                },
        }}
      >
        {!fullNote ? (
          <Box ta="center" py="xl">
            <Text c="dimmed" size="lg">
              Note not found.
            </Text>
          </Box>
        ) : (
          <Box style={{ maxHeight: "70vh", overflowY: "auto", padding: 0 }}>
            {/* Header with close button */}
            <Group
              justify="space-between"
              p={8}
              style={{
                backgroundColor: "#25262b",
                borderBottom: "1px solid #373a40",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                position: "sticky",
                top: 0,
                zIndex: 10,
                marginBottom: 0,
              }}
            >
              <Group gap={6}>
                <IconFileText size={15} color="#4dabf7" />
                <Text
                  fw={700}
                  size="sm"
                  style={{ color: "#4dabf7", letterSpacing: 0.2 }}
                >
                  Note Details
                </Text>
              </Group>
              <ActionIcon
                variant="light"
                onClick={() => {
                  if (fullNote) resetEditState(fullNote);
                  onClose();
                }}
                size={28}
                radius={50}
                style={{
                  color: "#fff",
                  background: "#4dabf7",
                  border: "2px solid #fff",
                  boxShadow: "0 1px 4px rgba(77,171,247,0.10)",
                  transition: "background 0.2s, color 0.2s",
                  cursor: "pointer",
                  minWidth: 28,
                  minHeight: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#1976d2";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#4dabf7";
                }}
              >
                <IconX size={18} />
              </ActionIcon>
            </Group>

            <Stack spacing={8} style={{ padding: 0 }}>
              {isEditing ? (
                <Box p={12} pt={10} pb={0}>
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Edit your note..."
                    label="Note Content"
                    autosize
                    minRows={3}
                    mb="sm"
                    styles={{
                      input: {
                        backgroundColor: "#25262b",
                        border: "1px solid #373a40",
                        color: "#c1c2c5",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      },
                      label: { color: "#c1c2c5", marginBottom: 4 },
                    }}
                  />

                  <TextInput
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    label="Tags"
                    mb="sm"
                    styles={{
                      input: {
                        backgroundColor: "#25262b",
                        border: "1px solid #373a40",
                        color: "#c1c2c5",
                      },
                      label: { color: "#c1c2c5", marginBottom: 4 },
                    }}
                  />

                  <Group justify="flex-end" gap={6} mt={8}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        if (fullNote) resetEditState(fullNote);
                      }}
                      style={{
                        color: "#c1c2c5",
                        borderColor: "#373a40",
                        minWidth: 60,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      onClick={handleSave}
                      style={{ backgroundColor: "#1976d2", minWidth: 60 }}
                    >
                      Save
                    </Button>
                  </Group>
                </Box>
              ) : (
                <>
                  {/* Node Text Label */}
                  <Box p={12} pt={10} pb={0}>
                    <Text
                      size="xs"
                      fw={700}
                      style={{
                        color: "#4dabf7",
                        marginBottom: 2,
                        letterSpacing: 0.2,
                      }}
                    >
                      Node Text
                    </Text>
                  </Box>
                  {/* Note Content */}
                  <Box p={12} pt={0} pb={0}>
                    <Text
                      size="sm"
                      style={{
                        lineHeight: 1.5,
                        color: "#c1c2c5",
                        backgroundColor: "#25262b",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #373a40",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        maxWidth: "100%",
                        overflow: "hidden",
                      }}
                    >
                      {displayText}
                    </Text>

                    {shouldShowExpandButton && (
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setIsTextExpanded(!isTextExpanded)}
                        p={0}
                        mt={4}
                        style={{
                          color: "#1976d2",
                          height: "auto",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Group gap={4}>
                          <Text size="xs">
                            {isTextExpanded ? "Show less" : "Show more"}
                          </Text>
                          {isTextExpanded ? (
                            <IconChevronUp size={12} />
                          ) : (
                            <IconChevronDown size={12} />
                          )}
                        </Group>
                      </Button>
                    )}
                  </Box>

                  {/* Node URL (between content and tags) */}
                  {fullNote.url && fullNote.url !== "#" && (
                    <Box px={12} pb={0} pt={4}>
                      <Group gap={4} align="center">
                        <Text
                          size="xs"
                          fw={700}
                          style={{ color: "#4dabf7", minWidth: 32 }}
                        >
                          URL:
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "#888",
                            fontSize: 11,
                            wordBreak: "break-all",
                            flex: 1,
                          }}
                        >
                          <a
                            href={fullNote.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#1a0dab",
                              textDecoration: "underline",
                              fontSize: 11,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {fullNote.url.length > 40
                              ? fullNote.url.substring(0, 40) + "..."
                              : fullNote.url}
                          </a>
                        </Text>
                      </Group>
                    </Box>
                  )}

                  {/* Tags */}
                  {fullNote.tags && fullNote.tags.length > 0 && (
                    <Box px={12} pb={0} pt={4}>
                      <Group gap={4} align="center">
                        <Text
                          size="xs"
                          fw={700}
                          style={{ color: "#4dabf7", minWidth: 32 }}
                        >
                          Tags:
                        </Text>
                        <Group gap="xs" style={{ flexWrap: "wrap" }}>
                          {fullNote.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              size="xs"
                              variant="light"
                              color="blue"
                              style={{
                                fontSize: "10px",
                                backgroundColor: "#1976d2",
                                color: "#fff",
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {fullNote.tags.length > 3 && (
                            <Text size="xs" c="dimmed">
                              +{fullNote.tags.length - 3}
                            </Text>
                          )}
                        </Group>
                      </Group>
                    </Box>
                  )}

                  {/* Creation Date and Last Modified */}
                  <Box px={12} pb={0} pt={4}>
                    <Group gap={8} align="center">
                      <Text
                        size="xs"
                        fw={700}
                        style={{ color: "#4dabf7", minWidth: 90 }}
                      >
                        Creation Date:
                      </Text>
                      <IconCalendar size={12} color="#909296" />
                      <Text size="xs" style={{ color: "#909296" }}>
                        {new Date(fullNote.timestamp).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                    </Group>
                    <Group gap={8} align="center" mt={2}>
                      <Text
                        size="xs"
                        fw={700}
                        style={{ color: "#4dabf7", minWidth: 90 }}
                      >
                        Last Modified:
                      </Text>
                      <IconCalendar size={12} color="#909296" />
                      <Text size="xs" style={{ color: "#909296" }}>
                        {new Date(
                          fullNote.modified || fullNote.timestamp
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Group>
                  </Box>

                  <Divider my={4} style={{ borderColor: "#373a40" }} />

                  {/* Action Buttons */}
                  <Group justify="flex-end" p="sm" gap="xs">
                    <Button
                      variant="light"
                      color="blue"
                      onClick={handleEdit}
                      size="sm"
                      leftSection={<IconEdit size={14} />}
                      style={{ backgroundColor: "#1976d2", color: "#fff" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      onClick={handleDelete}
                      size="sm"
                      leftSection={<IconTrash size={14} />}
                      style={{ backgroundColor: "#e74c3c", color: "#fff" }}
                    >
                      Delete
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default NodeModal;
