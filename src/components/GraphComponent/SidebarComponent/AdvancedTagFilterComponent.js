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
  ScrollArea,
  Box,
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
  
  // Search states for each section
  const [includeSearchQuery, setIncludeSearchQuery] = useState("");
  const [orSearchQuery, setOrSearchQuery] = useState("");
  const [excludeSearchQuery, setExcludeSearchQuery] = useState("");
  
  // Show more tags states
  const [showMoreInclude, setShowMoreInclude] = useState(false);
  const [showMoreOr, setShowMoreOr] = useState(false);
  const [showMoreExclude, setShowMoreExclude] = useState(false);

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
    
    if (includeSearchQuery.trim()) {
      return filtered.filter(tag => 
        tag.toLowerCase().includes(includeSearchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allTags, includeTags, orTags, excludeTags, includeSearchQuery]);

  // Get available tags for OR logic (not already included, or-ed, or excluded)
  const availableOrTags = useMemo(() => {
    const filtered = allTags.filter(
      (tag) => !includeTags.includes(tag) && !orTags.includes(tag) && !excludeTags.includes(tag)
    );
    
    if (orSearchQuery.trim()) {
      return filtered.filter(tag => 
        tag.toLowerCase().includes(orSearchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allTags, includeTags, orTags, excludeTags, orSearchQuery]);

  // Get available tags for exclusion (not already excluded, included, or or-ed)
  const availableExcludeTags = useMemo(() => {
    const filtered = allTags.filter(
      (tag) => !excludeTags.includes(tag) && !includeTags.includes(tag) && !orTags.includes(tag)
    );
    
    if (excludeSearchQuery.trim()) {
      return filtered.filter(tag => 
        tag.toLowerCase().includes(excludeSearchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allTags, includeTags, orTags, excludeTags, excludeSearchQuery]);

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
    setIncludeSearchQuery("");
    setOrSearchQuery("");
    setExcludeSearchQuery("");
    setShowMoreInclude(false);
    setShowMoreOr(false);
    setShowMoreExclude(false);
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

  // Helper function to render tag selection section
  const renderTagSection = (title, color, selectedTags, availableTags, searchQuery, setSearchQuery, showMore, setShowMore, onAdd, onRemove, addIcon, isNot = false) => {
    const displayTags = showMore ? availableTags : availableTags.slice(0, 8);
    const hasMoreTags = availableTags.length > 8;
    
    return (
      <div>
        <Text size="xs" fw={600} mb="xs" color={color}>
          {title}
        </Text>
        
        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <Group spacing="xs" mb="xs">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                color={color}
                variant="filled"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color={color}
                    variant="transparent"
                    onClick={() => onRemove(tag)}
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
        
        {/* Search input */}
        <TextInput
          size="xs"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<IconSearch size={12} />}
          mb="xs"
          rightSection={
            searchQuery && (
              <ActionIcon
                size="xs"
                variant="transparent"
                onClick={() => setSearchQuery("")}
              >
                <IconX size={12} />
              </ActionIcon>
            )
          }
        />
        
        {/* Available tags */}
        {availableTags.length > 0 ? (
          <Box>
            <ScrollArea.Autosize maxHeight={showMore ? 200 : "auto"} mb="xs">
              <Group spacing="xs">
                {displayTags.map((tag) => (
                  <Badge
                    key={tag}
                    color="gray"
                    variant="outline"
                    style={{ cursor: "pointer" }}
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color={color}
                        variant="transparent"
                        onClick={() => onAdd(tag)}
                      >
                        {addIcon}
                      </ActionIcon>
                    }
                    onClick={() => onAdd(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            </ScrollArea.Autosize>
            
            {/* Show more/less button */}
            {hasMoreTags && !searchQuery && (
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => setShowMore(!showMore)}
                fullWidth
              >
                {showMore ? `Show Less (${availableTags.length - 8} hidden)` : `Show More (+${availableTags.length - 8} more)`}
              </Button>
            )}
          </Box>
        ) : (
          <Text size="xs" color="dimmed" ta="center" py="sm">
            {searchQuery ? `No tags found matching "${searchQuery}"` : "No available tags"}
          </Text>
        )}
      </div>
    );
  };

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
          {renderTagSection(
            "Must Have These Tags (AND)",
            "green",
            includeTags,
            availableIncludeTags,
            includeSearchQuery,
            setIncludeSearchQuery,
            showMoreInclude,
            setShowMoreInclude,
            handleAddIncludeTag,
            handleRemoveIncludeTag,
            <IconPlus size={10} />
          )}

          <Divider size="xs" />

          {/* OR Tags Section */}
          {renderTagSection(
            "Can Have Any of These Tags (OR)",
            "blue",
            orTags,
            availableOrTags,
            orSearchQuery,
            setOrSearchQuery,
            showMoreOr,
            setShowMoreOr,
            handleAddOrTag,
            handleRemoveOrTag,
            <IconPlus size={10} />
          )}

          <Divider size="xs" />

          {/* Exclude Tags Section */}
          {renderTagSection(
            "Must NOT Have These Tags (NOT)",
            "red",
            excludeTags,
            availableExcludeTags,
            excludeSearchQuery,
            setExcludeSearchQuery,
            showMoreExclude,
            setShowMoreExclude,
            handleAddExcludeTag,
            handleRemoveExcludeTag,
            <IconMinus size={10} />,
            true
          )}

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
