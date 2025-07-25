import React, { useMemo } from "react";
import { Group, Badge, Text, Stack } from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

const TopTagsComponent = ({ notes, onSelectTag, selectedTag }) => {
  // Compute tag counts (case-insensitive)
  const topTags = useMemo(() => {
    const tagCount = {};
    (notes || []).forEach((note) => {
      (note.tags || []).forEach((tag) => {
        const tagLower = tag.toLowerCase();
        tagCount[tagLower] = (tagCount[tagLower] || 0) + 1;
      });
    });
    // Convert to array and sort by count desc, then alphabetically
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3);
  }, [notes]);

  if (topTags.length === 0) {
    return (
      <Stack spacing={2} mt="md">
        <Text fw={700} size="sm">
          Top Tags
        </Text>
        <Text size="sm" c="dimmed">
          No tags available.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} mt="md">
      <Text fw={700} size="sm">
        Top Tags
      </Text>
      <Group spacing="xs">
        {topTags.map(([tag, count]) => (
          <Badge
            key={tag}
            leftSection={<IconTag size={12} />}
            color={selectedTag ? (selectedTag.toLowerCase() === tag ? "blue" : "dark") : "blue"}
            variant={selectedTag ? (selectedTag.toLowerCase() === tag ? "filled" : "outline") : "filled"}
            style={{ cursor: "pointer", fontWeight: selectedTag && selectedTag.toLowerCase() === tag ? 700 : 400 }}
            onClick={() => onSelectTag(tag)}
            title={`Used in ${count} note${count !== 1 ? "s" : ""}`}
          >
            {tag} ({count})
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};

export default TopTagsComponent;
