import React, { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import SidebarComponent from "./GraphComponent/SidebarComponent";

function GraphComponent() {
  const [notes, setNotes] = useState([]);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [opened, { toggle }] = useDisclosure();
  const cyRef = useRef(null);

  useEffect(() => {
    chrome.storage.local.get(["notes"], (result) => {
      setNotes(result.notes || []);
    });
  }, []);

  useEffect(() => {
    if (notes.length === 0 && !loading) return;

    const processedNodes = notes
      .filter((note) => note && note.id && typeof note.text === "string") // Filter out invalid notes
      .map((note) => ({
        group: "nodes",
        data: {
          id: note.id,
          label:
            note.text.substring(0, 50) + (note.text.length > 50 ? "..." : ""),
          url: note.url || "#",
        },
      }));

    const validNoteIds = new Set(processedNodes.map((n) => n.data.id));

    const processedEdges = [];
    if (notes.length > 1) {
      for (let i = 0; i < notes.length; i++) {
        for (let j = i + 1; j < notes.length; j++) {
          const note1 = notes[i];
          const note2 = notes[j];

          if (
            note1 &&
            note2 &&
            validNoteIds.has(note1.id) &&
            validNoteIds.has(note2.id) &&
            note1.tags &&
            note2.tags
          ) {
            const commonTags = note1.tags.filter((tag) =>
              note2.tags.includes(tag)
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
        setSelectedNode(nodeData);
        if (nodeData.url && nodeData.url !== "#") {
          window.open(nodeData.url, "_blank");
        }
      });

      return () => {
        if (cyRef.current) {
          cyRef.current.removeListener("tap", "node");
        }
      };
    }
  }, [cyRef.current, elements]);

  const layout = {
    name: "cose",
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
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
        "font-size": "10px",
        "text-wrap": "wrap",
        "text-max-width": "80px",
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
  ];

  return (
    <SidebarComponent
      opened={opened}
      toggle={toggle}
      selectedNode={selectedNode}
      elements={elements}
      loading={loading}
      layout={layout}
      stylesheet={stylesheet}
      cyRef={cyRef}
    />
  );
}

export default GraphComponent;
