import React, { useMemo } from "react";
import { Group, Badge, Text, Stack } from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

const TopTagsComponent = ({ notes, onSelectTag }) => {
  // Compute tag counts
  const topTags = useMemo(() => {
    const tagCount = {};
    (notes || []).forEach((note) => {
      (note.tags || []).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
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
            color="blue"
            variant="filled"
            style={{ cursor: "pointer" }}
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
