import React from "react";
import { Paper, Text, Group, Badge, Box, Stack } from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

const SearchResultComponent = ({ note, searchQuery, onSelect }) => {
  // Function to highlight search terms in text
  const highlightText = (text, query) => {
    if (!text || !query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "i"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          style={{ backgroundColor: "#ffeb3b", padding: "0 2px" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Truncate text for display
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;

    // Try to find a good breaking point
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > maxLength * 0.7) {
      return truncated.substring(0, lastSpace) + "...";
    }

    return truncated + "...";
  };

  const displayText = truncateText(note.text);

  return (
    <Paper
      p={8}
      withBorder
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderColor: "#ddd",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#373a40";
        e.currentTarget.style.backgroundColor = "#2c2e33";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#ddd";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      onClick={onSelect}
    >
      <Stack spacing={4}>
        {/* Note Title */}
        <Box>
          <Text size="sm" fw={600} lineClamp={1}>
            {note.nodeNumber ? `#${note.nodeNumber} - ` : ""}
            {note.title || "Untitled Note"}
          </Text>
        </Box>

        {/* Note Text */}
        <Box>
          <Text size="xs" lineClamp={1} c="dimmed">
            {displayText}
          </Text>
        </Box>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Group spacing="xs">
            <IconTag size={12} color="#666" />
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                size="xs"
                variant="light"
                color="blue"
                style={{ fontSize: "10px" }}
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Text size="xs" c="dimmed">
                +{note.tags.length - 3} more
              </Text>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

export default SearchResultComponent;
