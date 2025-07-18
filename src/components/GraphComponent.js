import React, { useState, useEffect, useRef } from "react";
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
    });
  }, []);

  useEffect(() => {
    if (notes.length === 0 && !loading) return;

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
            const hasCommonTag = note1TagsLower.some((tag) => note2TagsLower.includes(tag));
            if (hasCommonTag) {
              // Find the common tags
              const commonTags = note1TagsLower.filter((tag) => note2TagsLower.includes(tag));
              processedEdges.push({
                group: "edges",
                data: {
                  id: `edge-${note1.id}-${note2.id}`,
                  source: note1.id,
                  target: note2.id,
                  weight: 1,
                  label: commonTags[0] ? commonTags[0] : '', // Use the first common tag as label
                },
              });
            }
          }
        }
      }
    }

    const finalElements = [...processedNodes, ...processedEdges];

    setElements(finalElements);
    setLoading(false);
  }, [notes, loading]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on("tap", "node", (event) => {
        const nodeData = event.target.data();
        const nodePosition = event.target.renderedPosition();
        setSelectedNode(nodeData);
        setNodePosition(nodePosition);
        openModal();
      });

      // Add hover functionality for tooltip
      cyRef.current.on("mouseover", "node", (event) => {
        const nodeData = event.target.data();
        const nodePosition = event.target.renderedPosition();
        const note = notes.find((n) => String(n.id) === String(nodeData.id));

        if (note) {
          // If a tag is selected, show all notes with that tag in the tooltip
          if (window.selectedTag && note.tags && note.tags.map(t => t.toLowerCase()).includes(window.selectedTag.toLowerCase())) {
            const notesWithTag = notes.filter(n => (n.tags || []).map(t => t.toLowerCase()).includes(window.selectedTag.toLowerCase()));
            setHoveredNode({
              ...note,
              tagTooltip: window.selectedTag,
              notesWithTag,
            });
          } else {
            setHoveredNode(note);
          }
          setTooltipPosition({
            x: nodePosition.x + 20,
            y: nodePosition.y - 20,
          });
          setShowTooltip(true);
        }
      });

      cyRef.current.on("mouseout", "node", (event) => {
        setShowTooltip(false);
        setHoveredNode(null);
      });

      // Semantic zoom for node label opacity
      const cy = cyRef.current;
      const updateLabelOpacity = () => {
        const zoom = cy.zoom();
        // Fade in from 0.7 to 1.5, fade out below 0.7
        let opacity = 0;
        if (zoom < 0.7) opacity = 0;
        else if (zoom > 1.5) opacity = 1;
        else opacity = (zoom - 0.7) / (1.5 - 0.7);
        cy.nodes().forEach((node) => {
          node.style('text-opacity', opacity);
        });
        cy.edges().forEach((edge) => {
          edge.style('text-opacity', opacity);
        });
      };
      cy.on('zoom', updateLabelOpacity);
      // Set initial opacity
      updateLabelOpacity();

      return () => {
        if (cyRef.current) {
          cyRef.current.removeListener("tap", "node");
          cyRef.current.removeListener("mouseover", "node");
          cyRef.current.removeListener("mouseout", "node");
          cyRef.current.removeListener("zoom", updateLabelOpacity);
        }
      };
    }
  }, [cyRef.current, elements, openModal, notes]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      // Remove previous listeners
      cy.removeListener("tap", "node");
      cy.removeListener("doubleTap", "node");
      cy.removeListener("tap", handleTapBackground);

      // Single click: highlight node and neighbors
      cy.on("tap", "node", (event) => {
        const nodeData = event.target.data();
        setSelectedNode(nodeData);
        // Do not open modal on single click
      });

      // Double click: open node detail modal
      cy.on("doubleTap", "node", (event) => {
        const nodeData = event.target.data();
        const nodePosition = event.target.renderedPosition();
        setSelectedNode(nodeData);
        setNodePosition(nodePosition);
        openModal();
      });

      // Background tap: clear selection
      const handleTapBackground = (event) => {
        if (event.target === cy) {
          setSelectedNode(null);
          // Do not reload or reset the page
        }
      };
      cy.on('tap', handleTapBackground);

      return () => {
        cy.removeListener("tap", "node");
        cy.removeListener("doubleTap", "node");
        cy.removeListener('tap', handleTapBackground);
      };
    }
  }, [selectedNode, cyRef, openModal]);

  // Highlight/dim logic for selected node and neighbors
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.nodes().removeClass('selected');
      cy.nodes().removeClass('faded');
      cy.edges().removeClass('faded');
      // Label brightness logic
      cy.nodes().removeClass('bright-label');
      cy.nodes().removeClass('dim-label');
      if (selectedNode && selectedNode.id) {
        // Highlight only the selected node
        const node = cy.getElementById(selectedNode.id);
        if (node) {
          node.addClass('selected');
          node.addClass('bright-label');
        }
        // Dim all other nodes and all edges
        cy.nodes().not(node).addClass('faded');
        cy.nodes().not(node).addClass('dim-label');
        cy.edges().addClass('faded');
      }
    }
  }, [selectedNode, cyRef]);

  // Handle zoom level for small graphs
  useEffect(() => {
    if (cyRef.current && elements.length > 0) {
      const cy = cyRef.current;
      const nodeCount = elements.filter((el) => el.group === "nodes").length;

      // Apply zoom immediately and then after layout
      if (nodeCount === 1) {
        // For single node, set a reasonable zoom level immediately
        cy.zoom(1.5);
        cy.center();
      } else if (nodeCount <= 3) {
        // For small graphs, set a moderate zoom immediately
        cy.zoom(1.2);
        cy.center();
      }

      // Wait for layout to complete and apply final zoom
      setTimeout(() => {
        if (nodeCount === 1) {
          cy.zoom(1.5);
          cy.center();
        } else if (nodeCount <= 3) {
          cy.zoom(1.2);
          cy.center();
        } else {
          // For larger graphs, use fit
          cy.fit();
        }
      }, 300); // Reduced delay
    }
  }, [elements]);

  const handleModalClose = () => {
    closeModal();
  };

  const layout = {
    name: "cose",
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: false, // Disable automatic fitting to prevent oversized initial view
    padding: 50,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
  };

  const stylesheet = [
    {
      selector: "node",
      style: {
        "background-color": "rgba(255,255,255,0.8)",
        label: "data(label)",
        color: "rgba(255,255,255,0.8)",
        "text-valign": "top",
        "text-halign": "center",
        "text-margin-y": -16,
        "font-size": "12px",
        "font-weight": "600",
        "text-wrap": "wrap",
        "text-max-width": "60px",
        "text-opacity": 1,
        "border-width": 0,
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "rgba(255,255,255,0.8)",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "11px",
        color: "#fff", // White text for tag name
        "text-background-color": "#1A1A1A", // Match web page background
        "text-background-opacity": 1,
        "text-background-padding": 2,
        "text-margin-y": -10, // Move label above the edge
        "text-rotation": "autorotate",
        "text-wrap": "wrap",
        "text-max-width": 60,
        "text-opacity": 1, // Default opacity, will be overridden by zoom handler
        'transition-property': 'text-opacity',
        'transition-duration': '0.5s',
      },
    },
    {
      selector: "node.tag-highlight",
      style: {
        "background-color": "rgba(255,255,255,0.8)",
        width: 50,
        height: 50,
        "z-index": 10,
        "transition-property": "background-color, border-color, box-shadow, opacity",
        "transition-duration": "0.5s",
        "box-shadow": "0 0 18px 6px #fff8, 0 0 0 2px #fff",
        "border-width": 0,
      },
    },
    {
      selector: "edge.tag-highlight",
      style: {
        "line-color": "rgba(255,255,255,0.8)",
        width: 5,
        "z-index": 10,
        "transition-property": "line-color, width, shadow-blur, opacity",
        "transition-duration": "0.5s",
        "shadow-blur": 12,
        "shadow-color": "rgba(255,255,255,0.8)",
        opacity: 0.95,
      },
    },
    {
      selector: 'node.selected',
      style: {
        'background-color': '#fff',
        'border-color': '#fff',
        'color': '#222',
        'box-shadow': '0 0 24px 8px #fff',
        'z-index': 20,
      },
    },
    {
      selector: 'node.faded',
      style: {
        'opacity': 0.1,
        'text-opacity': 0.1,
      },
    },
    {
      selector: 'edge.faded',
      style: {
        'opacity': 0.1,
      },
    },
    {
      selector: 'node.dimmed',
      style: {
        'opacity': 0.2,
        'text-opacity': 0.2,
        'transition-property': 'opacity, text-opacity',
        'transition-duration': '0.5s',
      },
    },
    {
      selector: 'edge.dimmed',
      style: {
        'opacity': 0.2,
        'transition-property': 'opacity',
        'transition-duration': '0.5s',
      },
    },
    {
      selector: 'node.bright-label',
      style: {
        'color': '#fff',
        'text-opacity': 1,
        'font-weight': 'bold',
      },
    },
    {
      selector: 'node.dim-label',
      style: {
        'color': '#888',
        'text-opacity': 0.3,
        'font-weight': '600',
      },
    },
  ];

  return (
    <>
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
      />
      <NodeModal
        opened={modalOpened && !!selectedNode}
        onClose={handleModalClose}
        nodeData={notes.find(
          (note) => String(note.id) === String(selectedNode?.id)
        )}
        onUpdateNote={(updatedNote) => {
          const updatedNotes = notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          );
          setNotes(updatedNotes);
          chrome.storage.local.set({ notes: updatedNotes });
        }}
        onDeleteNote={(noteId) => {
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
            backgroundColor: "#2c2e33", // Dark background like search bar
            border: "1px solid #373a40",
            borderRadius: "6px",
            padding: "8px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 1000,
            maxWidth: "260px",
            pointerEvents: "none",
            color: "#c1c2c5", // Light text like search bar
          }}
        >
          <div
            style={{
              fontSize: "12px",
              lineHeight: 1.3,
              color: "#c1c2c5",
            }}
          >
            {/* If tagTooltip is present, show tag and all notes with that tag */}
            {hoveredNode.tagTooltip ? (
              <>
                <div style={{ fontWeight: 'bold', color: '#4dabf7', marginBottom: 4 }}>
                  Tag: {hoveredNode.tagTooltip}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: 4 }}>
                  Notes with this tag:
                </div>
                <ul style={{ paddingLeft: 16, margin: 0, maxHeight: 80, overflowY: 'auto' }}>
                  {hoveredNode.notesWithTag.map(n => (
                    <li key={n.id} style={{ fontSize: '11px', color: '#c1c2c5', marginBottom: 2 }}>
                      {n.title || n.text?.slice(0, 40) || 'Untitled'}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                {/* Note text - 2 lines max */}
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: "4px",
                    minHeight: "32px", // Ensures consistent height for 2 lines
                    maxHeight: "32px", // Force 2 lines max
                    wordBreak: "break-word",
                    fontSize: "12px",
                  }}
                >
                  {hoveredNode.text}
                </div>
                {/* Guidance text - 1 line */}
                <div
                  style={{
                    fontSize: "11px",
                    color: "#909296",
                    fontStyle: "italic",
                  }}
                >
                  For detailed information click on the node
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GraphComponent;
