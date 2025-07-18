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

  useEffect(() => {
    if (nodeData) {
      setFullNote(nodeData);
      setEditText(nodeData.text || "");
      setEditTags(nodeData.tags ? nodeData.tags.join(", ") : "");
      setIsTextExpanded(false);
    }
  }, [nodeData]);

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
    <Modal
      opened={opened}
      onClose={onClose}
      zIndex={9999}
      withCloseButton={false}
      closeOnClickOutside={true}
      closeOnEscape={true}
      size="sm"
      centered={false}
      styles={{
        header: { display: "none" },
        body: {
          backgroundColor: "#2c2e33", // Dark background like search bar
          padding: 0,
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          border: "1px solid #373a40",
        },
        content: nodePosition && nodePosition.x !== undefined && nodePosition.y !== undefined ? {
          position: "fixed",
          top: Math.max(16, Math.min(window.innerHeight - 400, nodePosition.y - 150)) + "px",
          left: Math.min(window.innerWidth - 360, nodePosition.x + 60) + "px",
          width: "340px",
          maxHeight: "90vh",
          overflowY: "auto",
          minHeight: "120px",
        } : {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "340px",
          maxHeight: "90vh",
          overflowY: "auto",
          minHeight: "120px",
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
        <Box>
          {/* Header with close button */}
          <Group
            justify="space-between"
            p="sm"
            style={{
              backgroundColor: "#25262b",
              borderBottom: "1px solid #373a40",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Group gap="xs">
              <IconFileText size={16} color="#c1c2c5" />
              <Text fw={600} size="sm" style={{ color: "#c1c2c5" }}>
                Note Details
              </Text>
            </Group>
            <ActionIcon
              variant="filled"
              onClick={onClose}
              size="xl"
              style={{
                color: '#fff', // white icon
                background: '#c62828', // dark red background
                border: '3px solid #fff',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              }}
            >
              <IconX size={28} />
            </ActionIcon>
          </Group>

          <Stack spacing="xs">
            {isEditing ? (
              <Box p="sm">
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

                <Group justify="flex-end" gap="xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    style={{ color: "#c1c2c5", borderColor: "#373a40" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    style={{ backgroundColor: "#1976d2" }}
                  >
                    Save
                  </Button>
                </Group>
              </Box>
            ) : (
              <>
                {/* Note Content */}
                <Box p="sm">
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

                {/* Tags */}
                {fullNote.tags && fullNote.tags.length > 0 && (
                  <Box px="sm" pb={2}>
                    <Group gap="xs">
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
                  </Box>
                )}

                {/* Creation Date */}
                <Box px="sm" pb={2}>
                  <Group gap="xs">
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
                </Box>

                {/* Source URL */}
                {fullNote.url && fullNote.url !== "#" && (
                  <Box px="sm" pb={2}>
                    <Group gap="xs" align="center">
                      <IconLink size={12} color="#909296" />
                      <a
                        href={fullNote.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1a0dab",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          wordBreak: "break-all",
                          fontSize: '12px',
                          textDecoration: 'underline',
                          fontWeight: 500,
                        }}
                        title={fullNote.url}
                      >
                        {fullNote.url.length > 30
                          ? fullNote.url.substring(0, 30) + "..."
                          : fullNote.url}
                      </a>
                      <Group gap={4}>
                        <Tooltip label="Copy URL">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => copyToClipboard(fullNote.url)}
                            size="xs"
                            style={{ color: "#1976d2" }}
                          >
                            <IconCopy size={10} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Open URL">
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => openUrl(fullNote.url)}
                            size="xs"
                            style={{ color: "#00b894" }}
                          >
                            <IconExternalLink size={10} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Box>
                )}

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
  );
};

export default NodeModal;
