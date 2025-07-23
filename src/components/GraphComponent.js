import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import SidebarComponent from "./GraphComponent/SidebarComponent";
import NodeModal from "./GraphComponent/NodeModal";
import { ActionIcon } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

function GraphComponent({ colorScheme, setColorScheme }) {
  const [notes, setNotes] = useState([]);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const cyRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    chrome.storage.local.get(["notes"], (result) => {
      setNotes(result.notes || []);
      setLoading(false); // Set loading to false after fetching data
    });
  }, []);

  useEffect(() => {
    if (notes.length === 0) {
      setElements([]); // Clear elements when no notes
      return;
    }

    const sortedNotes = notes
      .filter((note) => note && note.id && typeof note.text === "string") // Filter out invalid notes
      .sort((a, b) => {
        const tA = Number(a.timestamp ?? 0);
        const tB = Number(b.timestamp ?? 0);
        return tA - tB; // Earliest first (oldest to newest)
      });

    const processedNodes = sortedNotes.map((note, index) => ({
      group: "nodes",
      data: {
        id: note.id,
        label: "", // No label on the node
        fullText: note.text,
        title: note.title || "Untitled Note",
        url: note.url || "#",
        timestamp: note.timestamp,
        tags: note.tags || [],
        nodeNumber: index + 1,
        // Do NOT set 'label' here!
      },
    }));

    const validNoteIds = new Set(processedNodes.map((n) => n.data.id));

    const processedEdges = [];
    if (sortedNotes.length > 1) {
      for (let i = 0; i < sortedNotes.length; i++) {
        for (let j = i + 1; j < sortedNotes.length; j++) {
          const note1 = sortedNotes[i];
          const note2 = sortedNotes[j];

          if (
            note1 &&
            note2 &&
            validNoteIds.has(note1.id) &&
            validNoteIds.has(note2.id) &&
            note1.tags &&
            note2.tags
          ) {
            // Connect if there is at least one common tag
            const note1TagsLower = note1.tags.map((tag) => tag.toLowerCase());
            const note2TagsLower = note2.tags.map((tag) => tag.toLowerCase());
            const hasCommonTag = note1TagsLower.some((tag) =>
              note2TagsLower.includes(tag)
            );
            if (hasCommonTag) {
              // Find the common tags
              const commonTags = note1TagsLower.filter((tag) =>
                note2TagsLower.includes(tag)
              );
              processedEdges.push({
                group: "edges",
                data: {
                  id: `edge-${note1.id}-${note2.id}`,
                  source: note1.id,
                  target: note2.id,
                  weight: 1,
                  // Removed label to stop edge labelling
                },
              });
            }
          }
        }
      }
    }

    const finalElements = [...processedNodes, ...processedEdges];

    setElements(finalElements);
  }, [notes]);

  // --- Enhanced Semantic Zoom Implementation ---
  const updateNodeLabels = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const zoom = cy.zoom();
    cy.nodes().forEach((node) => {
      const data = node.data();
      let label = "";
      // Only show label if zoomed in enough
      if (zoom >= 1.0) {
        const text = data.fullText || "";
        label = text.length > 40 ? text.slice(0, 40) + "..." : text;
      } else {
        label = "";
      }
      node.data("label", label);
    });
  }, []);

  // Attach zoom event and update labels on mount and when elements change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.on("zoom", updateNodeLabels);
    // Initial label update
    updateNodeLabels();
    return () => {
      cy.removeListener("zoom", updateNodeLabels);
    };
  }, [elements, updateNodeLabels]);

  // Highlight/dim logic for selected node and neighbors
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.nodes().removeClass("selected");
      cy.nodes().removeClass("faded");
      cy.edges().removeClass("faded");
      // Label brightness logic
      cy.nodes().removeClass("bright-label");
      cy.nodes().removeClass("dim-label");
      if (selectedNode && selectedNode.id) {
        // Highlight only the selected node
        const node = cy.getElementById(selectedNode.id);
        if (node) {
          node.addClass("selected");
          node.addClass("bright-label");
        }
        // Dim all other nodes and all edges
        cy.nodes().not(node).addClass("faded");
        cy.nodes().not(node).addClass("dim-label");
        cy.edges().addClass("faded");
      }
    }
  }, [selectedNode, cyRef]);

  // Track previous node count to detect new node addition
  const prevNodeCountRef = useRef(
    elements.filter((el) => el.group === "nodes").length
  );

  // Handle zoom level for small graphs ONLY on initial mount or node addition
  useEffect(() => {
    if (!cyRef.current || elements.length === 0) return;
    const cy = cyRef.current;
    const nodeCount = elements.filter((el) => el.group === "nodes").length;
    const prevNodeCount = prevNodeCountRef.current;

    // Only apply zoom/center/fit if node count increased (new node added) or on first mount
    if (nodeCount > prevNodeCount || prevNodeCount === 0) {
      if (nodeCount === 1) {
        cy.zoom(1.5);
        cy.center();
      } else if (nodeCount <= 3) {
        cy.zoom(1.2);
        cy.center();
      }
      setTimeout(() => {
        if (!cyRef.current) return;
        const cy = cyRef.current;
        if (nodeCount === 1) {
          cy.zoom(1.5);
          cy.center();
        } else if (nodeCount <= 3) {
          cy.zoom(1.2);
          cy.center();
        } else {
          cy.fit();
        }
      }, 300);
    }
    prevNodeCountRef.current = nodeCount;
  }, [elements]);

  const handleModalClose = () => {
    closeModal();
    setSelectedNode(null); // Clear selection when modal closes
  };

  const layout = {
    name: "cose",
    idealEdgeLength: 150,
    nodeOverlap: 40,
    refresh: 12,
    fit: false,
    padding: 120, // More padding for breathing room
    randomize: false,
    componentSpacing: 200, // More space between components
    nodeRepulsion: 900000, // Much stronger repulsion to prevent clustering
    edgeElasticity: 60,
    nestingFactor: 12,
    gravity: 45,
    numIter: 1500,
    initialTemp: 150,
    coolingFactor: 0.97,
    minTemp: 0.5,
    animate: true,
    animationDuration: 600,
    animationEasing: "ease-out-cubic",
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
  };

  const stylesheet = [
    {
      selector: "node",
      style: {
        "background-color": "rgba(255,255,255,0.95)",
        label: "data(label)",
        color: "#000",
        "text-valign": "center",
        "text-halign": "center",
        "text-margin-y": 0,
        "font-size": "8px",
        "font-weight": "700",
        "text-wrap": "wrap",
        "text-max-width": "60px",
        "text-opacity": 1,
        "text-outline-width": 2,
        "text-outline-color": "#fff",
        "border-width": 1,
        "border-color": "rgba(255,255,255,0.4)",
        "border-opacity": 0.6,
        width: "20px",
        height: "20px",
        "transition-property":
          "width, height, font-size, text-max-width, text-margin-y, border-width",
        "transition-duration": "0.15s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "edge",
      style: {
        width: 1, // Thinner default width
        "line-color": "rgba(255,255,255,0.6)", // More subtle
        "curve-style": "bezier",
        "control-point-step-size": 35, // Tighter curves
        "text-opacity": 0,
        opacity: 0.5, // More subtle by default
        // Smoother transitions for edges
        "transition-property": "width, opacity, line-color",
        "transition-duration": "0.15s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "node.tag-highlight",
      style: {
        "background-color": "rgba(255,255,255,1)",
        "border-color": "rgba(77, 171, 247, 0.8)",
        "border-width": 2,
        "z-index": 15,
        "transition-property": "background-color, border-color, opacity",
        "transition-duration": "0.25s",
        "transition-timing-function": "ease-out",
        width: 28, // Fixed size instead of +=8px
        height: 28,
      },
    },
    {
      selector: "edge.tag-highlight",
      style: {
        "line-color": "rgba(77, 171, 247, 0.8)",
        "z-index": 12,
        "transition-property": "line-color, width, opacity",
        "transition-duration": "0.25s",
        "transition-timing-function": "ease-out",
        opacity: 0.85,
        width: 2.5, // Fixed width instead of +=1.5px
      },
    },
    {
      selector: "node.selected",
      style: {
        "background-color": "#fff",
        "border-color": "#4dabf7",
        "border-width": 3,
        color: "#1a1b1e",
        "font-weight": "bold",
        "z-index": 25,
        "transition-property": "background-color, border-color, border-width",
        "transition-duration": "0.25s",
        width: 30, // Fixed size instead of +=10px
        height: 30,
      },
    },
    {
      selector: "node.faded",
      style: {
        opacity: 0.08,
        "text-opacity": 0.05,
        "transition-property": "opacity, text-opacity",
        "transition-duration": "0.4s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "edge.faded",
      style: {
        opacity: 0.05,
        "transition-property": "opacity",
        "transition-duration": "0.4s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "node.dimmed",
      style: {
        opacity: 0.15,
        "text-opacity": 0.1,
        "transition-property": "opacity, text-opacity",
        "transition-duration": "0.3s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "edge.dimmed",
      style: {
        opacity: 0.1,
        "transition-property": "opacity",
        "transition-duration": "0.3s",
        "transition-timing-function": "ease-out",
      },
    },
    {
      selector: "node.bright-label",
      style: {
        color: "#fff",
        "text-opacity": 1,
        "font-weight": "bold",
      },
    },
    {
      selector: "node.dim-label",
      style: {
        color: "#666",
        "text-opacity": 0.25,
        "font-weight": "500",
      },
    },
  ];

  return (
    <div style={{ 
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <SidebarComponent
        opened={opened}
        toggle={toggle}
        selectedNode={selectedNode}
        elements={elements}
        loading={loading}
        layout={layout}
        stylesheet={stylesheet}
        cyRef={cyRef}
        notes={notes}
        onOpenModal={openModal}
        onClearAllNotes={() => {
          chrome.storage.local.set({ notes: [] }, () => {
            setNotes([]);
            console.log("All notes have been cleared.");
            window.location.reload();
          });
        }}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        setSelectedNode={setSelectedNode} // <-- pass down
        setNodePosition={setNodePosition} // <-- pass down
        setHoveredNode={setHoveredNode} // <-- pass down for tooltip
        setShowTooltip={setShowTooltip} // <-- pass down for tooltip
        setTooltipPosition={setTooltipPosition} // <-- pass down for tooltip
      />
      <NodeModal
        opened={modalOpened}
        onClose={handleModalClose}
        nodeData={notes.find(
          (note) => String(note.id) === String(selectedNode?.id)
        )}
        onUpdateNote={(updatedNote) => {
          console.log("Updating note:", updatedNote);
          const updatedNotes = notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          );
          setNotes(updatedNotes);
          chrome.storage.local.set({ notes: updatedNotes });
        }}
        onDeleteNote={(noteId) => {
          console.log("Deleting note:", noteId);
          const updatedNotes = notes.filter((note) => note.id !== noteId);
          setNotes(updatedNotes);
          chrome.storage.local.set({ notes: updatedNotes });
        }}
        nodePosition={nodePosition}
      />

      {/* Custom Tooltip */}
      {showTooltip && hoveredNode && (
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            backgroundColor: "#2c2e33",
            border: "1px solid #373a40",
            borderRadius: "6px",
            padding: "8px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 1000,
            maxWidth: "260px",
            pointerEvents: "none",
            color: "#c1c2c5",
          }}
        >
          <div style={{ fontSize: "12px", lineHeight: 1.4 }}>
            <div style={{ marginBottom: hoveredNode.tags && hoveredNode.tags.length > 0 ? 6 : 0 }}>
              {hoveredNode.text}
            </div>
            {hoveredNode.tags && hoveredNode.tags.length > 0 && (
              <div style={{ fontSize: "11px", color: "#4dabf7" }}>
                🏷️ {hoveredNode.tags.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphComponent;
