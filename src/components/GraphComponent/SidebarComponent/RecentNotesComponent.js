import React from "react";
import { Stack, Text, Anchor } from "@mantine/core";

const RecentNotesComponent = ({ nodes, onSelect }) => {
  const recentNodes = [...nodes]
    .sort((a, b) => String(b.data.id).localeCompare(String(a.data.id)))
    .slice(0, 5);

  const truncate = (text, maxLength = 20) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <Stack mt="md" spacing="xs">
      <Text fw={700} size="sm">
        Top 5 Recent Notes
      </Text>

      {recentNodes.map((node) => (
        <Anchor
          key={node.data.id}
          size="sm"
          onClick={() => onSelect(node.data.id)}
          style={{ cursor: "pointer", color: "#aaa" }}
        >
          {truncate(node.data.label)}
        </Anchor>
      ))}
    </Stack>
  );
};

export default RecentNotesComponent;
