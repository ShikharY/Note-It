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
  TextInput,
} from "@mantine/core";
import {
  IconFilter,
  IconChevronDown,
  IconChevronRight,
  IconX,
  IconPlus,
  IconMinus,
  IconSearch,
} from "@tabler/icons-react";

const AdvancedTagFilterComponent = ({ notes, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [includeTags, setIncludeTags] = useState([]); // Tags that MUST be present (AND logic)
  const [orTags, setOrTags] = useState([]); // Tags where ANY can be present (OR logic)
  const [excludeTags, setExcludeTags] = useState([]); // Tags that must NOT be present (NOT logic)
  
  // Show more state for each section
  const [showMoreInclude, setShowMoreInclude] = useState(false);
  const [showMoreOr, setShowMoreOr] = useState(false);
  const [showMoreExclude, setShowMoreExclude] = useState(false);
  
  // Search state for each section
  const [includeSearch, setIncludeSearch] = useState("");
  const [orSearch, setOrSearch] = useState("");
  const [excludeSearch, setExcludeSearch] = useState("");

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
    const filtered = allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
    if (!includeSearch.trim()) return filtered;
    return filtered.filter(tag => tag.toLowerCase().includes(includeSearch.toLowerCase()));
  }, [allTags, includeTags, orTags, excludeTags, includeSearch]);

  // Get available tags for OR logic (not already included, or-ed, or excluded)
  const availableOrTags = useMemo(() => {
    const filtered = allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
    if (!orSearch.trim()) return filtered;
    return filtered.filter(tag => tag.toLowerCase().includes(orSearch.toLowerCase()));
  }, [allTags, includeTags, orTags, excludeTags, orSearch]);

  // Get available tags for exclusion (not already included, or-ed, or excluded)
  const availableExcludeTags = useMemo(() => {
    const filtered = allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
    if (!excludeSearch.trim()) return filtered;
    return filtered.filter(tag => tag.toLowerCase().includes(excludeSearch.toLowerCase()));
  }, [allTags, includeTags, orTags, excludeTags, excludeSearch]);

  // Apply filters and update parent component
  const applyFilters = (newIncludeTags, newOrTags, newExcludeTags) => {
    onFilterChange({
      includeTags: newIncludeTags,
      orTags: newOrTags,
      excludeTags: newExcludeTags,
      isEmpty:
        newIncludeTags.length === 0 &&
        newOrTags.length === 0 &&
        newExcludeTags.length === 0,
    });
  };

  // Handlers for adding/removing tags
  const handleAddIncludeTag = (tag) => {
    const newIncludeTags = [...includeTags, tag];
    setIncludeTags(newIncludeTags);
    applyFilters(newIncludeTags, orTags, excludeTags);
  };

  const handleRemoveIncludeTag = (tag) => {
    const newIncludeTags = includeTags.filter((t) => t !== tag);
    setIncludeTags(newIncludeTags);
    applyFilters(newIncludeTags, orTags, excludeTags);
  };

  const handleAddOrTag = (tag) => {
    const newOrTags = [...orTags, tag];
    setOrTags(newOrTags);
    applyFilters(includeTags, newOrTags, excludeTags);
  };

  const handleRemoveOrTag = (tag) => {
    const newOrTags = orTags.filter((t) => t !== tag);
    setOrTags(newOrTags);
    applyFilters(includeTags, newOrTags, excludeTags);
  };

  const handleAddExcludeTag = (tag) => {
    const newExcludeTags = [...excludeTags, tag];
    setExcludeTags(newExcludeTags);
    applyFilters(includeTags, orTags, newExcludeTags);
  };

  const handleRemoveExcludeTag = (tag) => {
    const newExcludeTags = excludeTags.filter((t) => t !== tag);
    setExcludeTags(newExcludeTags);
    applyFilters(includeTags, orTags, newExcludeTags);
  };

  const handleClearAll = () => {
    setIncludeTags([]);
    setOrTags([]);
    setExcludeTags([]);
    setIncludeSearch("");
    setOrSearch("");
    setExcludeSearch("");
    applyFilters([], [], []);
  };

  // Check if there are any active filters
  const hasActiveFilters = includeTags.length > 0 || orTags.length > 0 || excludeTags.length > 0;

  // Helper function to render a section with search functionality
  const renderTagSection = (availableTags, showMore, setShowMore, onAddTag, color, searchValue, setSearchValue, sectionType) => {
    const displayTags = showMore ? availableTags : availableTags.slice(0, 5);
    const hasMoreTags = availableTags.length > 5;

    return (
      <div>
        {/* Search input for this section */}
        <TextInput
          placeholder={`Search ${sectionType} tags...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          leftSection={<IconSearch size={14} />}
          size="xs"
          mb="xs"
          rightSection={
            searchValue && (
              <ActionIcon
                size="xs"
                color="gray"
                variant="transparent"
                onClick={() => setSearchValue("")}
              >
                <IconX size={12} />
              </ActionIcon>
            )
          }
        />
        
        {availableTags.length === 0 ? (
          <Text size="xs" c="dimmed" ta="center" py="xs">
            {searchValue ? `No tags found for "${searchValue}"` : "No available tags"}
          </Text>
        ) : (
          <>
            <Group gap="xs">
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  size="sm"
                  variant="light"
                  color={color}
                  style={{ cursor: "pointer" }}
                  onClick={() => onAddTag(tag)}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color={color}
                      variant="transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddTag(tag);
                      }}
                    >
                      <IconPlus size={10} />
                    </ActionIcon>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Group>
            
            {hasMoreTags && !searchValue && (
              <Button
                variant="subtle"
                size="xs"
                color="gray"
                mt="xs"
                onClick={() => setShowMore(!showMore)}
                rightSection={showMore ? <IconMinus size={12} /> : <IconPlus size={12} />}
              >
                {showMore ? "Show Less" : `Show ${availableTags.length - 5} More`}
              </Button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center" style={{ cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
        <Group gap="xs">
          <IconFilter size={16} />
          <Text size="sm" fw={500}>
            Advanced Filters
          </Text>
          {hasActiveFilters && (
            <Badge size="xs" color="blue" variant="filled">
              {includeTags.length + orTags.length + excludeTags.length}
            </Badge>
          )}
        </Group>
        {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
      </Group>

      <Collapse in={isExpanded}>
        <Stack gap="md" mt="xs">
          {/* Include Tags Section (AND logic) */}
          <div>
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500} c="green">
                Must Have (AND)
              </Text>
              <Text size="xs" c="dimmed">
                All selected tags required
              </Text>
            </Group>
            {includeTags.length > 0 && (
              <Group gap="xs" mb="xs">
                {includeTags.map((tag) => (
                  <Badge
                    key={tag}
                    size="sm"
                    color="green"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="red"
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
            {renderTagSection(
              availableIncludeTags, 
              showMoreInclude, 
              setShowMoreInclude, 
              handleAddIncludeTag, 
              "green",
              includeSearch,
              setIncludeSearch,
              "include"
            )}
          </div>

          <Divider />

          {/* OR Tags Section */}
          <div>
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500} c="blue">
                Any Of (OR)
              </Text>
              <Text size="xs" c="dimmed">
                At least one tag required
              </Text>
            </Group>
            {orTags.length > 0 && (
              <Group gap="xs" mb="xs">
                {orTags.map((tag) => (
                  <Badge
                    key={tag}
                    size="sm"
                    color="blue"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="red"
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
            {renderTagSection(
              availableOrTags, 
              showMoreOr, 
              setShowMoreOr, 
              handleAddOrTag, 
              "blue",
              orSearch,
              setOrSearch,
              "OR"
            )}
          </div>

          <Divider />

          {/* Exclude Tags Section (NOT logic) */}
          <div>
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500} c="red">
                Must Not Have (NOT)
              </Text>
              <Text size="xs" c="dimmed">
                Exclude notes with these tags
              </Text>
            </Group>
            {excludeTags.length > 0 && (
              <Group gap="xs" mb="xs">
                {excludeTags.map((tag) => (
                  <Badge
                    key={tag}
                    size="sm"
                    color="red"
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
            {renderTagSection(
              availableExcludeTags, 
              showMoreExclude, 
              setShowMoreExclude, 
              handleAddExcludeTag, 
              "red",
              excludeSearch,
              setExcludeSearch,
              "exclude"
            )}
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