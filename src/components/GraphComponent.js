import React, { useState, useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

function GraphComponent() {
  const [elements, setElements] = useState([]);
  const [hasNodes, setHasNodes] = useState(false);
  const [loading, setLoading] = useState(true);
  const cyRef = useRef(null);

  useEffect(() => {
    chrome.storage.local.get(['notes'], (result) => {
      const notes = (result.notes || []).map(note => ({
        ...note,
        tags: note.tags || [],
      }));

      const nodes = notes.map(note => ({
        data: {
          id: note.id.toString(),
          label: note.text.substring(0, 25) + (note.text.length > 25 ? '...' : ''),
          fullText: note.text,
          timestamp: note.timestamp,
        }
      }));

      // --- RE-INTRODUCE EDGE CALCULATION ---
      const edges = [];
      const edgeSet = new Set();

      if (notes.length > 1) {
        for (let i = 0; i < notes.length; i++) {
          for (let j = i + 1; j < notes.length; j++) {
            const noteA = notes[i];
            const noteB = notes[j];

            // Ensure tags exist before trying to filter
            if (noteA.tags && noteB.tags) {
              const commonTags = noteA.tags.filter(tag => noteB.tags.includes(tag));

              if (commonTags.length > 0) {
                const sourceId = noteA.id.toString();
                const targetId = noteB.id.toString();
                // Create a consistent ID for the edge regardless of direction
                const edgeId = [sourceId, targetId].sort().join('-');

                if (!edgeSet.has(edgeId)) {
                  edges.push({
                    data: {
                      id: `edge-${edgeId}`,
                      source: sourceId,
                      target: targetId,
                      label: commonTags.join(', ')
                    }
                  });
                  edgeSet.add(edgeId);
                }
              }
            }
          }
        }
      }

      setHasNodes(nodes.length > 0);
      setElements(CytoscapeComponent.normalizeElements({ nodes, edges }));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layout = {
    name: 'cose',
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
    minTemp: 1.0
  };

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#555',
        'label': 'data(label)',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '10px',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#888',
        'curve-style': 'bezier'
      }
    }
  ];

  return (
    <div className="graph-view-container">
       <header className="header">
         <h1>Note It - Knowledge Graph</h1>
         <p>Notes are connected by shared tags. Click nodes to see full text.</p>
       </header>

       <main className="main-content">
        {loading ? (
           <div className="loading-state">Loading Graph...</div>
         ) : hasNodes ? (
          <CytoscapeComponent
            elements={elements}
            layout={layout}
            stylesheet={stylesheet}
             className="cy-graph"
             style={{ width: '100%', height: 'calc(100vh - 120px)' }}
             cy={(cy) => { cyRef.current = cy; }}
          />
         ) : (
           <div className="empty-state">
             <h2>No notes yet</h2>
             <p>Create some notes with shared tags to see a graph!</p>
           </div>
        )}
       </main>
      </div>
  );
}

export default GraphComponent; 