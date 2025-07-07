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
} from "@mantine/core";
import CytoscapeComponent from "react-cytoscapejs";
import RecentNotesComponent from "./SidebarComponent/RecentNotesComponent";
import SearchBarComponent from "./SidebarComponent/SearchBarComponent";
import TopTagsComponent from "./SidebarComponent/TopTagsComponent";

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
}) => {
  const [selectedTag, setSelectedTag] = React.useState(null);

  // Highlight nodes and edges with the selected tag
  React.useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("tag-highlight");
    if (selectedTag) {
      // Highlight nodes
      cy.nodes().forEach((node) => {
        const tags = node.data("tags") || [];
        if (tags.includes(selectedTag)) {
          node.addClass("tag-highlight");
        }
      });
      // Highlight edges if both source and target have the tag
      cy.edges().forEach((edge) => {
        const source = cy.getElementById(edge.data("source"));
        const target = cy.getElementById(edge.data("target"));
        if (
          source.data("tags")?.includes(selectedTag) &&
          target.data("tags")?.includes(selectedTag)
        ) {
          edge.addClass("tag-highlight");
        }
      });
    }
  }, [selectedTag, cyRef]);

  const handleSelectTag = (tag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Title order={3}>Note It - Knowledge Graph</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ overflowY: "auto" }}>
        <Stack spacing="md">
          <Box>
            <Title order={4}>Node Details</Title>
            {selectedNode ? (
              <Box mt="md">
                <Text size="sm">
                  <b>ID:</b> {selectedNode.id}
                </Text>
                <Text size="sm">
                  <b>Text:</b> {selectedNode.label}
                </Text>
                <Text size="sm">
                  <b>URL:</b> {selectedNode.url}
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={onOpenModal}
                  mt="sm"
                  fullWidth
                >
                  View Full Details
                </Button>
              </Box>
            ) : (
              <Text mt="md" size="sm" c="dimmed">
                Click a node to see its details.
              </Text>
            )}
          </Box>

          <Box>
            <SearchBarComponent
              notes={notes}
              onSelectNote={(note) => {
                const cy = cyRef.current;
                if (cy) {
                  const node = cy.getElementById(note.id);
                  if (node) {
                    cy.center(node);
                    cy.zoom(2);
                    node.select();
                  }
                }
              }}
            />
          </Box>

          <Box>
            <TopTagsComponent notes={notes} onSelectTag={handleSelectTag} />
          </Box>

          <Box>
            <RecentNotesComponent
              nodes={elements.filter((el) => el.group === "nodes")}
              onSelect={(id) => {
                const cy = cyRef.current;
                if (cy) {
                  const node = cy.getElementById(id);
                  if (node) {
                    cy.center(node);
                    cy.zoom(2);
                    node.select();
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box
          style={{
            position: "absolute",
            top: "60px",
            left: "0",
            right: "0",
            bottom: "0",
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
              cy={(cy) => {
                cyRef.current = cy;
              }}
            />
          )}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default SidebarComponent;
