import React, { useEffect, useCallback, useState } from "react";
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
  Card,
  Badge,
} from "@mantine/core";
import {
  IconSettings,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import CytoscapeComponent from "react-cytoscapejs";
import RecentNotesComponent from "./SidebarComponent/RecentNotesComponent";
import SearchBarComponent from "./SidebarComponent/SearchBarComponent";
import TopTagsComponent from "./SidebarComponent/TopTagsComponent";
import AdvancedTagFilterComponent from "./SidebarComponent/AdvancedTagFilterComponent";
import PropTypes from "prop-types";

const CLUSTERS = [
  {
    id: "cluster-1",
    name: "Computation & Logic",
    color: "#1976d2",
    description: "Algorithms, AI, mathematics, and formal reasoning.",
    noteIds: ["cs-1", "cs-2", "cs-3", "cs-4", "math-1", "math-2", "math-3", "math-4", "inter-4"],
  },
  {
    id: "cluster-2",
    name: "Society & Ethics",
    color: "#43a047",
    description: "Ethics, philosophy, law, and social impact.",
    noteIds: ["ethics-1", "ethics-2", "ethics-3", "ethics-4", "pol-1", "pol-2", "pol-3", "pol-4", "inter-2"],
  },
  {
    id: "cluster-3",
    name: "Culture & Humanities",
    color: "#8e24aa",
    description: "Literature, art, media, and cultural studies.",
    noteIds: ["lit-1", "lit-2", "lit-3", "lit-4", "art-1", "art-2", "art-3", "art-4", "inter-1"],
  },
  {
    id: "cluster-4",
    name: "Science & Nature",
    color: "#fbc02d",
    description: "Natural sciences, biology, environment, and technology.",
    noteIds: ["sci-1", "sci-2", "sci-3", "sci-4", "inter-2", "math-4"],
  },
  {
    id: "cluster-5",
    name: "Mind & Behavior",
    color: "#e64a19",
    description: "Psychology, neuroscience, and behavioral science.",
    noteIds: ["psych-1", "psych-2", "psych-3", "psych-4", "inter-3"],
  },
];

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
  setSelectedNode, // <-- Add this prop for modal logic
  setNodePosition, // <-- Add this prop for modal logic
  // Hover functionality props
  setHoveredNode,
  setShowTooltip,
  setTooltipPosition,
}) => {
  const [selectedTag, setSelectedTag] = React.useState(null);
  const [settingsOpened, setSettingsOpened] = React.useState(false);
  const [advancedFilter, setAdvancedFilter] = React.useState({
    includeTags: [],
    orTags: [],
    excludeTags: [],
    isEmpty: true,
  });
  const [cyReady, setCyReady] = useState(false);
  const [semanticClustering, setSemanticClustering] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Stable event handlers using useCallback
  const handleMouseOver = useCallback((event) => {
    if (!cyRef.current) return;
    const nodeData = event.target.data();
    const zoom = cyRef.current.zoom();
    
    // Set hovered node data with zoom context
    setHoveredNode({
      id: nodeData.id,
      text: nodeData.fullText,
      title: nodeData.title,
      tags: nodeData.tags,
      currentZoom: zoom,
    });
    
    // Set tooltip position based on mouse position
    const renderedPosition = event.target.renderedPosition();
    const containerBounds = cyRef.current.container().getBoundingClientRect();
    
    setTooltipPosition({
      x: containerBounds.left + renderedPosition.x + 15,
      y: containerBounds.top + renderedPosition.y - 10
    });
    
    setShowTooltip(true);
  }, [setHoveredNode, setTooltipPosition, setShowTooltip, cyRef]);

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false);
    setHoveredNode(null);
  }, [setShowTooltip, setHoveredNode]);

  // Helper function to check if a note matches the advanced filter criteria
  const noteMatchesAdvancedFilter = (note) => {
    if (advancedFilter.isEmpty) return true;

    const noteTags = (note.tags || []).map((tag) => tag.toLowerCase());

    // Check include tags (ALL must be present)
    const includeMatch =
      advancedFilter.includeTags.length === 0 ||
      advancedFilter.includeTags.every((tag) => noteTags.includes(tag));

    // Check OR tags (AT LEAST ONE must be present, if OR tags exist)
    const orMatch =
      advancedFilter.orTags.length === 0 ||
      advancedFilter.orTags.some((tag) => noteTags.includes(tag));

    // Check exclude tags (NONE should be present)
    const excludeMatch =
      advancedFilter.excludeTags.length === 0 ||
      !advancedFilter.excludeTags.some((tag) => noteTags.includes(tag));

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
      cy.nodes().not(".tag-highlight").addClass("dimmed");
      cy.edges().not(".tag-highlight").addClass("dimmed");
    }
    // Handle advanced filtering
    else if (!advancedFilter.isEmpty) {
      cy.nodes().forEach((node) => {
        const nodeData = node.data();
        const note = notes.find((n) => String(n.id) === String(nodeData.id));
        if (note && noteMatchesAdvancedFilter(note)) {
          node.addClass("tag-highlight");
        }
      });
      // Highlight edges if both source and target match the filter
      cy.edges().forEach((edge) => {
        const source = cy.getElementById(edge.data("source"));
        const target = cy.getElementById(edge.data("target"));
        if (
          source.hasClass("tag-highlight") &&
          target.hasClass("tag-highlight")
        ) {
          edge.addClass("tag-highlight");
        }
      });
      // Dim all nodes and edges that are not highlighted
      cy.nodes().not(".tag-highlight").addClass("dimmed");
      cy.edges().not(".tag-highlight").addClass("dimmed");
    }
  }, [selectedTag, advancedFilter, cyRef, notes, noteMatchesAdvancedFilter]);

  // Semantic clustering effect (demo only)
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass("cluster-dimmed");
    cy.nodes().removeClass("cluster-highlight");
    cy.nodes().forEach((node) => {
      node.style("background-color", "");
      node.style("border-color", "");
    });
    if (semanticClustering && selectedCluster) {
      const cluster = CLUSTERS.find((c) => c.id === selectedCluster);
      if (cluster) {
        cy.nodes().forEach((node) => {
          if (cluster.noteIds.includes(node.id())) {
            node.addClass("cluster-highlight");
            node.style("background-color", cluster.color);
            node.style("border-color", cluster.color);
          } else {
            node.addClass("cluster-dimmed");
          }
        });
      }
    }
  }, [semanticClustering, selectedCluster, cyRef]);

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
        if (typeof window !== "undefined") {
          // Also clear selected node in parent if possible
          if (typeof window.setSelectedNode === "function") {
            window.setSelectedNode(null);
          }
        }
        // Do not reload or reset the page
      }
    };
    cy.on("tap", handleTapBackground);
    return () => {
      cy.off("tap", handleTapBackground);
    };
  }, [selectedTag, advancedFilter, cyRef]);

  // Sync selectedTag and advanced filters to window for global access (for hover tooltip)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.selectedTag = selectedTag;
      window.advancedFilter = advancedFilter;
    }
  }, [selectedTag, advancedFilter]);

  // On mount, automatically activate sidebar logic as if user interacted
  React.useEffect(() => {
    // This ensures window.selectedTag is set and any sidebar effects run
    if (typeof window !== "undefined") {
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
      // Clear node selection and position
      setSelectedNode(null);
      setNodePosition({ x: 0, y: 0 });
    }

    // Animate to all nodes with this tag
    const cy = cyRef.current;
    if (cy) {
      const nodesWithTag = cy
        .nodes()
        .filter((n) => {
          const tags = n.data("tags") || [];
          return tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
        });
      if (nodesWithTag && nodesWithTag.length > 0) {
        cy.animate({
          center: { eles: nodesWithTag },
          zoom: 1.5,
          duration: 600,
          easing: "ease-in-out-cubic",
        });
        nodesWithTag.select();
        // Set _fromTagSelection for tag selection
        nodesWithTag.forEach((node) => node.data("_fromTagSelection", true));
      }
    }
  };

  // --- Semantic Zoom Implementation ---
  const updateNodeLabels = useCallback(() => {
    if (!cyRef.current || !cyReady) return;
    const cy = cyRef.current;
    const zoom = cy.zoom();
    cy.nodes().forEach((node) => {
      const data = node.data();
      let label = "";
      if (zoom < 0.5) {
        label = "";
      } else if (zoom < 0.8) {
        label = `#${data.nodeNumber || ""}`;
      } else if (zoom < 1.2) {
        const text = data.fullText || "";
        const words = text.split(" ").slice(0, 2).join(" ");
        label =
          words.length > 0
            ? words + (text.split(" ").length > 2 ? "..." : "")
            : `#${data.nodeNumber || ""}`;
      } else if (zoom < 2.0) {
        const text = data.fullText || "";
        label = text.length > 40 ? text.slice(0, 40) + "..." : text;
      } else if (zoom < 3.0) {
        const text = data.fullText || "";
        const truncatedText =
          text.length > 80 ? text.slice(0, 80) + "..." : text;
        const tags = data.tags || [];
        const tagString =
          tags.length > 0
            ? `\n[${tags.slice(0, 3).join(", ")}${
                tags.length > 3 ? "..." : ""
              }]`
            : "";
        label = truncatedText + tagString;
      } else {
        const text = data.fullText || "";
        label = text;
      }
      node.data("label", label);
    });
  }, [cyRef, cyReady]);

  useEffect(() => {
    if (!cyRef.current || !cyReady) return;
    const cy = cyRef.current;
    cy.on("zoom", updateNodeLabels);
    updateNodeLabels();
    return () => {
      if (cyRef.current) {
        cyRef.current.off("zoom", updateNodeLabels);
      }
    };
  }, [elements, updateNodeLabels, cyRef, cyReady]);

  // Node click event for modal
  useEffect(() => {
    if (!cyRef.current || !cyReady) return;
    const cy = cyRef.current;
    const handleNodeClick = (event) => {
      const nodeData = event.target.data();
      const nodePosition = event.target.renderedPosition();
      // If the same node is clicked again, toggle modal
      if (selectedNode && selectedNode.id === nodeData.id) {
        setSelectedNode(null);
        setNodePosition({ x: 0, y: 0 });
        onOpenModal(); // This will close the modal if open
      } else {
        setSelectedNode(nodeData);
        setNodePosition(nodePosition);
        onOpenModal();
      }
    };
    cy.on("tap", "node", handleNodeClick);

    // Mouse hover events for tooltips using stable handlers
    cy.on("mouseover", "node", handleMouseOver);
    cy.on("mouseout", "node", handleMouseOut);

    // Background click: clear selection and close modal
    const handleTapBackground = (event) => {
      if (event.target === cy) {
        setSelectedNode(null);
        setNodePosition({ x: 0, y: 0 });
        if (
          typeof window !== "undefined" &&
          typeof window.closeModal === "function"
        ) {
          window.closeModal();
        }
      }
    };
    cy.on("tap", handleTapBackground);
    return () => {
      if (cyRef.current && !cyRef.current.destroyed()) {
        cyRef.current.off("tap", "node", handleNodeClick);
        cyRef.current.off("mouseover", "node", handleMouseOver);
        cyRef.current.off("mouseout", "node", handleMouseOut);
        cyRef.current.off("tap", handleTapBackground);
      }
    };
  }, [
    cyRef,
    setSelectedNode,
    setNodePosition,
    onOpenModal,
    cyReady,
    selectedNode,
    handleMouseOver,
    handleMouseOut,
  ]);

  // Clean up Cytoscape on unmount
  useEffect(() => {
    return () => {
      if (cyRef.current && !cyRef.current.destroyed()) {
        // Remove all event listeners properly
        cyRef.current.removeAllListeners();
        cyRef.current = null;
      }
      setCyReady(false);
    };
  }, []);

  // Add Cytoscape stylesheet overrides for cluster highlighting
  const clusterStylesheet = [
    {
      selector: 'node.cluster-highlight',
      style: {
        'opacity': 1,
        'border-width': 3,
        'z-index': 100,
      },
    },
    {
      selector: 'node.cluster-dimmed',
      style: {
        'opacity': 0.15,
        'z-index': 1,
      },
    },
  ];

  // Merge clusterStylesheet with the main stylesheet before passing to CytoscapeComponent
  const mergedStylesheet = [...stylesheet, ...clusterStylesheet];

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
        style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}
      >
        <AppShell.Header style={{ background: "#222222", color: "#fff" }}>
          <Group h="100%" px="md" style={{ width: "100%" }}>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Title order={3} style={{ flex: 1 }}>
              Note It - Knowledge Graph
            </Title>
            {/* Zoom Controls */}
            <Group spacing={4}>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => {
                  const cy = cyRef.current;
                  if (cy) {
                    const newZoom = Math.min(
                      cy.zoom() * 1.2,
                      cy.maxZoom ? cy.maxZoom() : 5
                    );
                    cy.animate({
                      zoom: newZoom,
                      duration: 300,
                      easing: "ease-in-out-cubic",
                    });
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
                    const newZoom = Math.max(
                      cy.zoom() / 1.2,
                      cy.minZoom ? cy.minZoom() : 0.1
                    );
                    cy.animate({
                      zoom: newZoom,
                      duration: 300,
                      easing: "ease-in-out-cubic",
                    });
                  }
                }}
                title="Zoom Out"
              >
                <IconZoomOut size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar
          p="md"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            minHeight: "100vh",
            position: "relative",
            background: "#222222",
            color: "#fff",
            overflow: "hidden", // Prevent navbar itself from scrolling
          }}
        >
          <div style={{ 
            flex: 1, 
            overflowY: "auto", // Allow internal content to scroll
            overflowX: "hidden",
            paddingRight: "4px" // Space for scrollbar
          }}>
            <Stack spacing="md">
            <Box>
              <SearchBarComponent
                notes={notes}
                onSelectNote={(note) => {
                  setSelectedTag(null);
                  setAdvancedFilter({
                    includeTags: [],
                    orTags: [],
                    excludeTags: [],
                    isEmpty: true,
                  });
                  const cy = cyRef.current;
                  if (cy) {
                    const cyNode = cy.getElementById(note.id);
                    if (cyNode) {
                      cy.animate({
                        center: { eles: cyNode },
                        zoom: 2,
                        duration: 600,
                        easing: "ease-in-out-cubic",
                      });
                      cyNode.select();
                      cyNode.data("_fromTagSelection", true);
                      setSelectedNode(cyNode.data());
                      setNodePosition(cyNode.renderedPosition());
                    }
                  }
                }}
                onClear={() => {
                  setSelectedNode(null);
                  setNodePosition({ x: 0, y: 0 });
                  setSelectedTag(null);
                  setAdvancedFilter({
                    includeTags: [],
                    orTags: [],
                    excludeTags: [],
                    isEmpty: true,
                  });
                  const cy = cyRef.current;
                  if (cy) {
                    cy.nodes().removeClass("tag-highlight");
                    cy.edges().removeClass("tag-highlight");
                    cy.nodes().removeClass("dimmed");
                    cy.edges().removeClass("dimmed");
                  }
                }}
              />
            </Box>

            <Box>
              <TopTagsComponent notes={notes} onSelectTag={handleSelectTag} selectedTag={selectedTag} />
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
                  setSelectedTag(null);
                  setAdvancedFilter({
                    includeTags: [],
                    orTags: [],
                    excludeTags: [],
                    isEmpty: true,
                  });
                  const cy = cyRef.current;
                  if (cy) {
                    const cyNode = cy.getElementById(id);
                    if (cyNode) {
                      cy.animate({
                        center: { eles: cyNode },
                        zoom: 2,
                        duration: 600,
                        easing: "ease-in-out-cubic",
                      });
                      cyNode.select();
                      cyNode.data("_fromTagSelection", true);
                      // Highlight/select the node in React state as well
                      setSelectedNode(cyNode.data());
                      setNodePosition(cyNode.renderedPosition());
                    }
                  }
                }}
                selectedId={selectedNode?.id}
              />
            </Box>
            {/* Semantic Clusters Section */}
            <Card shadow="xs" p="sm" radius="md" withBorder style={{ background: '#23243a', marginBottom: 8 }}>
              <Group position="apart" align="center" mb={4}>
                <Text fw={700} size="sm" style={{ color: '#fff' }}>Semantic Clusters (Demo)</Text>
                <Switch size="sm" checked={semanticClustering} onChange={() => {
                  setSemanticClustering((v) => !v);
                  setSelectedCluster(null);
                }} color="blue" />
              </Group>
              {semanticClustering && (
                <Stack spacing={4}>
                  {CLUSTERS.map((cluster) => (
                    <Card
                      key={cluster.id}
                      shadow="xs"
                      p={8}
                      radius="sm"
                      withBorder
                      style={{
                        background: selectedCluster === cluster.id ? cluster.color : '#23243a',
                        color: selectedCluster === cluster.id ? '#fff' : '#e0e0e0',
                        cursor: 'pointer',
                        borderColor: cluster.color,
                        marginBottom: 2,
                        transition: 'background 0.2s, color 0.2s',
                      }}
                      onClick={() => setSelectedCluster(cluster.id)}
                    >
                      <Group spacing={8} align="center">
                        <Badge color={cluster.color} variant="filled" size="sm" style={{ minWidth: 16, minHeight: 16, borderRadius: 8, marginRight: 4 }} />
                        <Text fw={700} size="sm" style={{ flex: 1 }}>{cluster.name}</Text>
                      </Group>
                      <Text size="xs" style={{ color: selectedCluster === cluster.id ? '#fff' : '#bdbdbd', marginTop: 2 }}>{cluster.description}</Text>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          </Stack>
          </div>
          {/* Fixed bottom section */}
          <div style={{ flexShrink: 0 }}>
            {/* Second bottom row: Clear All Notes and Settings */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
                position: "relative",
                marginBottom: 56,
            }}
          >
            {notes.length > 0 && (
              <Button
                color="red"
                variant="filled"
                style={{
                  flex: 1,
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: "#c62828", // dark red
                  color: "#fff", // white text
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  border: "none",
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
          </div>
          {/* True bottom: Footer/info placeholder */}
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: "#888",
              fontSize: 12,
              paddingBottom: 8,
            }}
          >
            {/* You can put footer info or copyright here */}
          </div>
        </AppShell.Navbar>

        <AppShell.Main style={{ height: '100vh', maxHeight: '100vh' }}>
          <Box
            style={{
              position: "absolute",
              top: "60px",
              left: "0",
              right: "0",
              bottom: "0",
              zIndex: 1,
              pointerEvents: "auto",
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
                stylesheet={mergedStylesheet}
                userPanningEnabled={true}
                userZoomingEnabled={true}
                cy={(cy) => {
                  cyRef.current = cy;
                  cy.ready(() => {
                    setCyReady(true);
                  });
                  // Always unlock all nodes for dragging, even after tag selection
                  cy.ready(() => {
                    cy.nodes().forEach((node) => node.unlock());
                  });
                  // Also unlock nodes after any tag-based highlighting
                  cy.on("select", "node", (event) => {
                    event.target.unlock();
                  });
                  cy.on("add", "node", (event) => {
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
  setSelectedNode: PropTypes.func.isRequired,
  setNodePosition: PropTypes.func.isRequired,
  setHoveredNode: PropTypes.func.isRequired,
  setShowTooltip: PropTypes.func.isRequired,
  setTooltipPosition: PropTypes.func.isRequired,
};

export default SidebarComponent;
