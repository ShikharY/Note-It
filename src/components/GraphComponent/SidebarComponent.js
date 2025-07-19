import React from "react";
import {
  AppShell,
  Box,
  Center,
  Group,
  Text,
  Title,
  Loader,
  Burger,
  Stack,
  Button,
  ActionIcon,
  Popover,
  Switch,
} from "@mantine/core";
import { IconSettings, IconSun, IconMoon, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import CytoscapeComponent from "react-cytoscapejs";
import RecentNotesComponent from "./SidebarComponent/RecentNotesComponent";
import SearchBarComponent from "./SidebarComponent/SearchBarComponent";
import TopTagsComponent from "./SidebarComponent/TopTagsComponent";
import AdvancedTagFilterComponent from "./SidebarComponent/AdvancedTagFilterComponent";
import PropTypes from "prop-types";

const SidebarComponent = ({
  opened,
  toggle,
  selectedNode,
  elements,
  loading,
  layout,
  stylesheet,
  cyRef,
  notes,
  onOpenModal,
  onClearAllNotes,
  colorScheme, // add prop
  setColorScheme, // add prop
}) => {
  const [selectedTag, setSelectedTag] = React.useState(null);
  const [settingsOpened, setSettingsOpened] = React.useState(false);
  const [advancedFilter, setAdvancedFilter] = React.useState({
    includeTags: [],
    orTags: [],
    excludeTags: [],
    isEmpty: true,
  });
  
  const handleThemeToggle = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  // Helper function to check if a note matches the advanced filter criteria
  const noteMatchesAdvancedFilter = (note) => {
    if (advancedFilter.isEmpty) return true;
    
    const noteTags = (note.tags || []).map(tag => tag.toLowerCase());
    
    // Check include tags (ALL must be present)
    const includeMatch = advancedFilter.includeTags.length === 0 || 
      advancedFilter.includeTags.every(tag => noteTags.includes(tag));
    
    // Check OR tags (AT LEAST ONE must be present, if OR tags exist)
    const orMatch = advancedFilter.orTags.length === 0 || 
      advancedFilter.orTags.some(tag => noteTags.includes(tag));
    
    // Check exclude tags (NONE should be present)
    const excludeMatch = advancedFilter.excludeTags.length === 0 || 
      !advancedFilter.excludeTags.some(tag => noteTags.includes(tag));
    
    return includeMatch && orMatch && excludeMatch;
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filterCriteria) => {
    setAdvancedFilter(filterCriteria);
    // Clear simple tag selection when using advanced filters
    if (!filterCriteria.isEmpty) {
      setSelectedTag(null);
    }
  };

  // Highlight nodes and edges based on selected tag or advanced filter
  React.useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("tag-highlight");
    cy.nodes().removeClass("dimmed");
    cy.edges().removeClass("dimmed");
    
    // Handle simple tag selection
    if (selectedTag) {
      // Highlight nodes
      cy.nodes().forEach((node) => {
        const tags = node.data("tags") || [];
        const tagsLower = tags.map((tag) => tag.toLowerCase());
        if (tagsLower.includes(selectedTag.toLowerCase())) {
          node.addClass("tag-highlight");
        }
      });
      // Highlight edges if both source and target have the tag
      cy.edges().forEach((edge) => {
        const source = cy.getElementById(edge.data("source"));
        const target = cy.getElementById(edge.data("target"));
        const sourceTagsLower = (source.data("tags") || []).map((tag) =>
          tag.toLowerCase()
        );
        const targetTagsLower = (target.data("tags") || []).map((tag) =>
          tag.toLowerCase()
        );
        if (
          sourceTagsLower.includes(selectedTag.toLowerCase()) &&
          targetTagsLower.includes(selectedTag.toLowerCase())
        ) {
          edge.addClass("tag-highlight");
        }
      });
      // Dim all nodes and edges that are not highlighted
      cy.nodes().not('.tag-highlight').addClass('dimmed');
      cy.edges().not('.tag-highlight').addClass('dimmed');
    }
    // Handle advanced filtering
    else if (!advancedFilter.isEmpty) {
      cy.nodes().forEach((node) => {
        const nodeData = node.data();
        const note = notes.find(n => String(n.id) === String(nodeData.id));
        if (note && noteMatchesAdvancedFilter(note)) {
          node.addClass("tag-highlight");
        }
      });
      // Highlight edges if both source and target match the filter
      cy.edges().forEach((edge) => {
        const source = cy.getElementById(edge.data("source"));
        const target = cy.getElementById(edge.data("target"));
        if (source.hasClass('tag-highlight') && target.hasClass('tag-highlight')) {
          edge.addClass("tag-highlight");
        }
      });
      // Dim all nodes and edges that are not highlighted
      cy.nodes().not('.tag-highlight').addClass('dimmed');
      cy.edges().not('.tag-highlight').addClass('dimmed');
    }
  }, [selectedTag, advancedFilter, cyRef, notes, noteMatchesAdvancedFilter]);

  // Add handler to clear tag selection when clicking on background
  React.useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const handleTapBackground = (event) => {
      if (event.target === cy) {
        setSelectedTag(null); // Deselect the tag
        setAdvancedFilter({
          includeTags: [],
          orTags: [],
          excludeTags: [],
          isEmpty: true,
        }); // Clear advanced filters
        if (typeof window !== 'undefined') {
          // Also clear selected node in parent if possible
          if (typeof window.setSelectedNode === 'function') {
            window.setSelectedNode(null);
          }
        }
        // Do not reload or reset the page
      }
    };
    cy.on('tap', handleTapBackground);
    return () => {
      cy.off('tap', handleTapBackground);
    };
  }, [selectedTag, advancedFilter, cyRef]);

  // Sync selectedTag and advanced filters to window for global access (for hover tooltip)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.selectedTag = selectedTag;
      window.advancedFilter = advancedFilter;
    }
  }, [selectedTag, advancedFilter]);

  // On mount, automatically activate sidebar logic as if user interacted
  React.useEffect(() => {
    // This ensures window.selectedTag is set and any sidebar effects run
    if (typeof window !== 'undefined') {
      window.selectedTag = selectedTag;
    }
    // Optionally, you can auto-select the first tag or recent note here if desired
    // For now, just ensure all sidebar effects are initialized
  }, []);

  const handleSelectTag = (tag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
    // Clear advanced filters when selecting a simple tag
    if (tag) {
      setAdvancedFilter({
        includeTags: [],
        orTags: [],
        excludeTags: [],
        isEmpty: true,
      });
    }
    
    // Animate to the first node with this tag
    const cy = cyRef.current;
    if (cy) {
      const node = cy.nodes().filter((n) => {
        const tags = n.data('tags') || [];
        return tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
      }).first();
      if (node && node.length > 0) {
        cy.animate({
          center: { eles: node },
          zoom: 2,
          duration: 600,
          easing: 'ease-in-out-cubic',
        });
        node.select();
        // Set _fromTagSelection for tag selection
        node.data('_fromTagSelection', true);
      }
    }
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: !opened },
        }}
        padding="md"
      >
        <AppShell.Header style={{ background: '#222222', color: '#fff' }}>
          <Group h="100%" px="md" style={{ width: '100%' }}>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Title order={3} style={{ flex: 1 }}>Note It - Knowledge Graph</Title>
            {/* Zoom Controls */}
            <Group spacing={4}>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => {
                  const cy = cyRef.current;
                  if (cy) {
                    const newZoom = Math.min(cy.zoom() * 1.2, cy.maxZoom ? cy.maxZoom() : 5);
                    cy.animate({ zoom: newZoom, duration: 300, easing: 'ease-in-out-cubic' });
                  }
                }}
                title="Zoom In"
              >
                <IconZoomIn size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => {
                  const cy = cyRef.current;
                  if (cy) {
                    const newZoom = Math.max(cy.zoom() / 1.2, cy.minZoom ? cy.minZoom() : 0.1);
                    cy.animate({ zoom: newZoom, duration: 300, easing: 'ease-in-out-cubic' });
                  }
                }}
                title="Zoom Out"
              >
                <IconZoomOut size={20} />
              </ActionIcon>
            </Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={handleThemeToggle}
              title={colorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" style={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: '100vh', position: 'relative', background: '#222222', color: '#fff' }}>
          <Stack spacing="md" style={{ flex: 1 }}>
            <Box>
              <SearchBarComponent
                notes={notes}
                onSelectNote={(note) => {
                  const cy = cyRef.current;
                  if (cy) {
                    const node = cy.getElementById(note.id);
                    if (node) {
                      cy.animate({
                        center: { eles: node },
                        zoom: 2,
                        duration: 600,
                        easing: 'ease-in-out-cubic',
                      });
                      node.select();
                      // Remove _fromTagSelection for search
                      node.data('_fromTagSelection', false);
                    }
                  }
                }}
              />
            </Box>

            <Box>
              <TopTagsComponent notes={notes} onSelectTag={handleSelectTag} />
            </Box>

            <Box>
              <AdvancedTagFilterComponent 
                notes={notes} 
                onFilterChange={handleAdvancedFilterChange} 
              />
            </Box>

            <Box>
              <RecentNotesComponent
                nodes={elements.filter((el) => el.group === "nodes")}
                onSelect={(id) => {
                  // Clear both simple tag selection and advanced filters when a recent note is selected
                  setSelectedTag(null);
                  setAdvancedFilter({
                    includeTags: [],
                    orTags: [],
                    excludeTags: [],
                    isEmpty: true,
                  });
                  // Animate directly to the selected node (not by tag)
                  const cy = cyRef.current;
                  if (cy) {
                    const cyNode = cy.getElementById(id);
                    if (cyNode) {
                      cy.animate({
                        center: { eles: cyNode },
                        zoom: 2,
                        duration: 600,
                        easing: 'ease-in-out-cubic',
                      });
                      cyNode.select();
                      cyNode.data('_fromTagSelection', true);
                    }
                  }
                }}
                selectedId={selectedNode?.id}
              />
            </Box>
          </Stack>
          {/* Second bottom row: Clear All Notes and Settings */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 8,
            position: 'relative',
            marginBottom: 56
          }}>
            {notes.length > 0 && (
              <Button
                color="red"
                variant="filled"
                style={{
                  flex: 1,
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: '#c62828', // dark red
                  color: '#fff', // white text
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  border: 'none',
                }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete all notes? This action cannot be undone."
                    )
                  ) {
                    onClearAllNotes();
                  }
                }}
              >
                Clear All Notes
              </Button>
            )}
          </div>
          {/* True bottom: Footer/info placeholder */}
          <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 12, paddingBottom: 8 }}>
            {/* You can put footer info or copyright here */}
          </div>
        </AppShell.Navbar>

        <AppShell.Main>
          <Box
            style={{
              position: "absolute",
              top: "60px",
              left: "0",
              right: "0",
              bottom: "0",
              zIndex: 1,
              pointerEvents: 'auto',
            }}
          >
            {loading ? (
              <Center style={{ height: "100%" }}>
                <Loader size="lg" />
              </Center>
            ) : elements.filter((el) => el.group === "nodes").length === 0 ? (
              <Center style={{ height: "100%" }}>
                <Text size="lg" c="dimmed">
                  No notes yet
                </Text>
              </Center>
            ) : (
              <CytoscapeComponent
                elements={elements}
                style={{ width: "100%", height: "100%" }}
                layout={layout}
                stylesheet={stylesheet}
                userPanningEnabled={true}
                userZoomingEnabled={true}
                cy={(cy) => {
                  cyRef.current = cy;
                  // Always unlock all nodes for dragging, even after tag selection
                  cy.ready(() => {
                    cy.nodes().forEach((node) => node.unlock());
                  });
                  // Also unlock nodes after any tag-based highlighting
                  cy.on('select', 'node', (event) => {
                    event.target.unlock();
                  });
                  cy.on('add', 'node', (event) => {
                    event.target.unlock();
                  });
                }}
              />
            )}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

SidebarComponent.propTypes = {
  opened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedNode: PropTypes.any,
  elements: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  layout: PropTypes.object.isRequired,
  stylesheet: PropTypes.array.isRequired,
  cyRef: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onClearAllNotes: PropTypes.func.isRequired,
  colorScheme: PropTypes.string.isRequired,
  setColorScheme: PropTypes.func.isRequired,
};

export default SidebarComponent;
