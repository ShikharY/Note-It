import React from "react";
import { Stack, Text, Anchor } from "@mantine/core";

const RecentNotesComponent = ({ nodes, onSelect }) => {
  const recentNodes = (nodes || [])
    .filter((node) => node && node.data && node.data.id !== undefined)
    .sort((a, b) => {
      const tA = Number(a.data.timestamp ?? 0);
      const tB = Number(b.data.timestamp ?? 0);
      return tB - tA; // Most recent first (highest timestamp at top)
    })
    .slice(0, 5);

  const truncate = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Stack mt="md" spacing="xs">
      <Text fw={700} size="sm">
        Top 5 Recent Notes
      </Text>

      {recentNodes.length > 0 ? (
        recentNodes.map((node) => (
          <Anchor
            key={node.data.id}
            size="sm"
            onClick={() => onSelect(node.data.id)}
            style={{ cursor: "pointer", color: "#aaa" }}
            href="#"
          >
            {node.data.label} - {truncate(node.data.fullText || "")}
          </Anchor>
        ))
      ) : (
        <Text size="sm" c="dimmed">
          No notes available now.
        </Text>
      )}
    </Stack>
  );
};

export default RecentNotesComponent;
