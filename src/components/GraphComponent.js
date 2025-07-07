import React, { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import SidebarComponent from "./GraphComponent/SidebarComponent";
import NodeModal from "./GraphComponent/NodeModal";

function GraphComponent() {
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
        label: `#${index + 1}`,
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
            // Convert tags to lowercase for case-insensitive comparison
            const note1TagsLower = note1.tags.map((tag) => tag.toLowerCase());
            const note2TagsLower = note2.tags.map((tag) => tag.toLowerCase());

            const commonTags = note1TagsLower.filter((tag) =>
              note2TagsLower.includes(tag)
            );
            if (commonTags.length > 0) {
              processedEdges.push({
                group: "edges",
                data: {
                  id: `edge-${note1.id}-${note2.id}`,
                  source: note1.id,
                  target: note2.id,
                  weight: commonTags.length,
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
          setHoveredNode(note);
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

      return () => {
        if (cyRef.current) {
          cyRef.current.removeListener("tap", "node");
          cyRef.current.removeListener("mouseover", "node");
          cyRef.current.removeListener("mouseout", "node");
        }
      };
    }
  }, [cyRef.current, elements, openModal, notes]);

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
        "background-color": "#666",
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "font-weight": "600",
        "text-wrap": "wrap",
        "text-max-width": "60px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#ccc",
        "curve-style": "bezier",
      },
    },
    {
      selector: "node.tag-highlight",
      style: {
        "background-color": "#1976d2",
        "border-color": "#1976d2",
        width: 50,
        height: 50,
        "z-index": 10,
        "transition-property": "background-color, border-color, box-shadow",
        "transition-duration": "0.4s",
        "box-shadow": "0 0 18px 6px #1976d244, 0 0 0 2px #fff",
        "border-width": 3,
      },
    },
    {
      selector: "edge.tag-highlight",
      style: {
        "line-color": "#8e24aa",
        width: 5,
        "z-index": 10,
        "transition-property": "line-color, width, shadow-blur",
        "transition-duration": "0.4s",
        "shadow-blur": 12,
        "shadow-color": "#8e24aa",
        opacity: 0.95,
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
            // Reload the page to ensure proper cleanup
            window.location.reload();
          });
        }}
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
            maxWidth: "200px",
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
          </div>
        </div>
      )}
    </>
  );
}

export default GraphComponent;
