import React, { useState, useMemo } from "react";
import {
  Stack,
  Text,
  Badge,
  Group,
  Divider,
  ActionIcon,
  Collapse,
  Button,
  Flex,
} from "@mantine/core";
import {
  IconFilter,
  IconChevronDown,
  IconChevronRight,
  IconX,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";

const AdvancedTagFilterComponent = ({ notes, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [includeTags, setIncludeTags] = useState([]); // Tags that MUST be present (AND logic)
  const [orTags, setOrTags] = useState([]); // Tags where ANY can be present (OR logic)
  const [excludeTags, setExcludeTags] = useState([]); // Tags that must NOT be present (NOT logic)

  // Get all unique tags from notes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    (notes || []).forEach((note) => {
      (note.tags || []).forEach((tag) => {
        tagSet.add(tag.toLowerCase());
      });
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Get available tags for inclusion (not already included, or-ed, or excluded)
  const availableIncludeTags = useMemo(() => {
    return allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
  }, [allTags, includeTags, orTags, excludeTags]);

  // Get available tags for OR logic (not already included, or-ed, or excluded)
  const availableOrTags = useMemo(() => {
    return allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
  }, [allTags, includeTags, orTags, excludeTags]);

  // Get available tags for exclusion (not already excluded, included, or or-ed)
  const availableExcludeTags = useMemo(() => {
    return allTags.filter(
      (tag) => !excludeTags.includes(tag) && !includeTags.includes(tag) && !orTags.includes(tag)
    );
  }, [allTags, includeTags, orTags, excludeTags]);

  // Handle adding a tag to include list
  const handleAddIncludeTag = (tag) => {
    const newIncludeTags = [...includeTags, tag];
    setIncludeTags(newIncludeTags);
    updateFilter(newIncludeTags, orTags, excludeTags);
  };

  // Handle adding a tag to OR list
  const handleAddOrTag = (tag) => {
    const newOrTags = [...orTags, tag];
    setOrTags(newOrTags);
    updateFilter(includeTags, newOrTags, excludeTags);
  };

  // Handle adding a tag to exclude list
  const handleAddExcludeTag = (tag) => {
    const newExcludeTags = [...excludeTags, tag];
    setExcludeTags(newExcludeTags);
    updateFilter(includeTags, orTags, newExcludeTags);
  };

  // Handle removing a tag from include list
  const handleRemoveIncludeTag = (tag) => {
    const newIncludeTags = includeTags.filter((t) => t !== tag);
    setIncludeTags(newIncludeTags);
    updateFilter(newIncludeTags, orTags, excludeTags);
  };

  // Handle removing a tag from OR list
  const handleRemoveOrTag = (tag) => {
    const newOrTags = orTags.filter((t) => t !== tag);
    setOrTags(newOrTags);
    updateFilter(includeTags, newOrTags, excludeTags);
  };

  // Handle removing a tag from exclude list
  const handleRemoveExcludeTag = (tag) => {
    const newExcludeTags = excludeTags.filter((t) => t !== tag);
    setExcludeTags(newExcludeTags);
    updateFilter(includeTags, orTags, newExcludeTags);
  };

  // Clear all filters
  const handleClearAll = () => {
    setIncludeTags([]);
    setOrTags([]);
    setExcludeTags([]);
    updateFilter([], [], []);
  };

  // Update the filter and notify parent component
  const updateFilter = (includeList, orList, excludeList) => {
    const filterCriteria = {
      includeTags: includeList,
      orTags: orList,
      excludeTags: excludeList,
      isEmpty: includeList.length === 0 && orList.length === 0 && excludeList.length === 0,
    };
    onFilterChange(filterCriteria);
  };

  const hasActiveFilters = includeTags.length > 0 || orTags.length > 0 || excludeTags.length > 0;

  return (
    <Stack spacing="xs" mt="md">
      <Group spacing="xs">
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
        </ActionIcon>
        <Text fw={700} size="sm">
          Advanced Filters
        </Text>
        <IconFilter size={14} />
        {hasActiveFilters && (
          <Badge size="xs" color="blue" variant="filled">
            Active
          </Badge>
        )}
      </Group>

      <Collapse in={isExpanded}>
        <Stack spacing="sm" pl="md">
          {/* Include Tags Section */}
          <div>
            <Text size="xs" fw={600} mb="xs" color="green">
              Must Have These Tags (AND)
            </Text>
            {includeTags.length > 0 && (
              <Group spacing="xs" mb="xs">
                {includeTags.map((tag) => (
                  <Badge
                    key={tag}
                    color="green"
                    variant="filled"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="green"
                        variant="transparent"
                        onClick={() => handleRemoveIncludeTag(tag)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            )}
            <Group spacing="xs" mb="sm">
              {availableIncludeTags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  color="gray"
                  variant="outline"
                  style={{ cursor: "pointer" }}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color="green"
                      variant="transparent"
                      onClick={() => handleAddIncludeTag(tag)}
                    >
                      <IconPlus size={10} />
                    </ActionIcon>
                  }
                  onClick={() => handleAddIncludeTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </div>

          <Divider size="xs" />

          {/* OR Tags Section */}
          <div>
            <Text size="xs" fw={600} mb="xs" color="blue">
              Can Have Any of These Tags (OR)
            </Text>
            {orTags.length > 0 && (
              <Group spacing="xs" mb="xs">
                {orTags.map((tag) => (
                  <Badge
                    key={tag}
                    color="blue"
                    variant="filled"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="blue"
                        variant="transparent"
                        onClick={() => handleRemoveOrTag(tag)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            )}
            <Group spacing="xs" mb="sm">
              {availableOrTags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  color="gray"
                  variant="outline"
                  style={{ cursor: "pointer" }}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color="blue"
                      variant="transparent"
                      onClick={() => handleAddOrTag(tag)}
                    >
                      <IconPlus size={10} />
                    </ActionIcon>
                  }
                  onClick={() => handleAddOrTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </div>

          <Divider size="xs" />

          {/* Exclude Tags Section */}
          <div>
            <Text size="xs" fw={600} mb="xs" color="red">
              Must NOT Have These Tags (NOT)
            </Text>
            {excludeTags.length > 0 && (
              <Group spacing="xs" mb="xs">
                {excludeTags.map((tag) => (
                  <Badge
                    key={tag}
                    color="red"
                    variant="filled"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="red"
                        variant="transparent"
                        onClick={() => handleRemoveExcludeTag(tag)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            )}
            <Group spacing="xs" mb="sm">
              {availableExcludeTags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  color="gray"
                  variant="outline"
                  style={{ cursor: "pointer" }}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color="red"
                      variant="transparent"
                      onClick={() => handleAddExcludeTag(tag)}
                    >
                      <IconMinus size={10} />
                    </ActionIcon>
                  }
                  onClick={() => handleAddExcludeTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </div>

          {hasActiveFilters && (
            <Flex justify="center" mt="sm">
              <Button
                size="xs"
                variant="light"
                color="gray"
                onClick={handleClearAll}
              >
                Clear All Filters
              </Button>
            </Flex>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default AdvancedTagFilterComponent;
