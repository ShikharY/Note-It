import React, { useState, useMemo } from "react";
import { TextInput, Stack, Text, Group, Button } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import SearchResultComponent from "./SearchBarComponent/SearchResultComponent";

const SearchBarComponent = ({ notes, onSelectNote }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter notes based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !notes || notes.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    return notes
      .filter((note) => {
        if (!note || !note.text) return false;

        // Search in note text
        const textMatch = note.text.toLowerCase().includes(query);

        // Search in tags
        const tagsMatch =
          note.tags &&
          note.tags.some((tag) => tag.toLowerCase().includes(query));

        // Search in URL
        // const urlMatch = note.url && note.url.toLowerCase().includes(query);

        return textMatch || tagsMatch;
        // || urlMatch;
      })
      .sort((a, b) => {
        // Sort by relevance (exact matches first, then by timestamp)
        const aText = a.text.toLowerCase();
        const bText = b.text.toLowerCase();

        const aExactMatch = aText === query;
        const bExactMatch = bText === query;

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // If both are exact matches or neither, sort by timestamp (newest first)
        const tA = Number(a.timestamp ?? 0);
        const tB = Number(b.timestamp ?? 0);
        return tB - tA;
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, notes]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleSelectNote = (note) => {
    onSelectNote(note);
    // Keep search results visible after selection
  };

  return (
    <Stack spacing="xs">
      <Text fw={700} size="sm">
        Search Notes
      </Text>

      <Group spacing="xs">
        <TextInput
          placeholder="Search in notes or tags"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{ flex: 1 }}
          size="sm"
          icon={<IconSearch size={16} />}
        />
        {searchQuery && (
          <Button
            variant="subtle"
            size="sm"
            onClick={handleClear}
            p={0}
            style={{ minWidth: "auto" }}
          >
            <IconX size={16} />
          </Button>
        )}
      </Group>

      {/* Search Results */}
      {isSearching && searchQuery.trim() && (
        <Stack spacing="xs" mt="xs">
          <Group position="apart" align="center">
            <Text size="xs" c="dimmed">
              {searchResults.length > 0
                ? `Found ${searchResults.length} result${
                    searchResults.length !== 1 ? "s" : ""
                  }`
                : "No results found"}
            </Text>
            <Button variant="subtle" size="xs" onClick={handleClear} compact>
              Clear Search
            </Button>
          </Group>

          {searchResults.length > 0 ? (
            searchResults.map((note) => (
              <SearchResultComponent
                key={note.id}
                note={note}
                searchQuery={searchQuery}
                onSelect={() => handleSelectNote(note)}
              />
            ))
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="md">
              No notes found matching "{searchQuery}"
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default SearchBarComponent;
