import React from "react";
import { Stack, Text, Anchor, Paper } from "@mantine/core";

const RecentNotesComponent = ({ nodes, onSelect, selectedId }) => {
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
    <>
      <Text fw={700} size="sm" style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
        Top 5 Recent Notes
      </Text>
      <Paper shadow="xs" p="md" radius="md" withBorder style={{ background: '#2a2a2a' }}>
        <Stack spacing="xs">
          {recentNodes.length > 0 ? (
            recentNodes.map((node) => (
              <Anchor
                key={node.data.id}
                size="sm"
                onClick={() => onSelect(node.data.id)}
                style={{
                  cursor: "pointer",
                  color: node.data.id === selectedId ? "#fff" : "#0d2a4d",
                  fontWeight: 600,
                  textShadow: node.data.id === selectedId ? '0 1px 6px #1976d2, 0 0 2px #fff' : '0 1px 2px #fff8',
                  background: node.data.id === selectedId ? 'linear-gradient(90deg, #1976d2 60%, #2196f3 100%)' : 'none',
                  borderRadius: node.data.id === selectedId ? 6 : 0,
                  padding: node.data.id === selectedId ? '2px 8px' : undefined,
                  transition: 'all 0.2s',
                  display: 'inline-block',
                }}
                href="#"
              >
                <span style={{ color: '#fff', background: '#1976d2', borderRadius: 4, padding: '1px 6px', fontSize: '11px', marginRight: 6 }}>
                  {node.data.tags && node.data.tags.length > 0 ? node.data.tags[0] : 'No Tag'}
                </span>
                {node.data.label} - {truncate(node.data.fullText || "")}
              </Anchor>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              No notes available now.
            </Text>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default RecentNotesComponent;
