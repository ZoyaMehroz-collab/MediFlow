import { useState } from 'react';
import { FiNavigation, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';

// 10 Graph Nodes with 2D coordinates for interactive SVG rendering
const GRAPH_NODES = [
  { id: 1,  name: 'Central Pharmacy Hub',       x: 120, y: 150, type: 'hub'    },
  { id: 2,  name: 'North Distribution Junction', x: 280, y: 80,  type: 'depot'  },
  { id: 3,  name: 'East Medical Depot',          x: 350, y: 220, type: 'depot'  },
  { id: 4,  name: 'South Logistics Center',      x: 180, y: 320, type: 'depot'  },
  { id: 5,  name: 'West Express Depot',          x: 80,  y: 250, type: 'depot'  },
  { id: 6,  name: 'Residential Sector A',        x: 450, y: 100, type: 'target' },
  { id: 7,  name: 'Residential Sector B',        x: 520, y: 200, type: 'target' },
  { id: 8,  name: 'Residential Sector C',        x: 480, y: 330, type: 'target' },
  { id: 9,  name: 'Metro Healthcare Zone',       x: 300, y: 340, type: 'target' },
  { id: 10, name: 'Suburban Medical Clinic',     x: 600, y: 280, type: 'target' },
];

const EDGES = [
  { from: 1, to: 2, weight: '4 km' },
  { from: 1, to: 4, weight: '5 km' },
  { from: 1, to: 5, weight: '3 km' },
  { from: 2, to: 3, weight: '6 km' },
  { from: 2, to: 6, weight: '5 km' },
  { from: 3, to: 7, weight: '4 km' },
  { from: 3, to: 8, weight: '7 km' },
  { from: 4, to: 8, weight: '6 km' },
  { from: 4, to: 9, weight: '4 km' },
  { from: 5, to: 4, weight: '4 km' },
  { from: 6, to: 7, weight: '3 km' },
  { from: 7, to: 10, weight: '5 km' },
  { from: 8, to: 10, weight: '4 km' },
];

export default function DeliveryMapVisualizer({ routeNodesString, distanceKm, timeMins }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Parse path string (e.g. "Central Pharmacy Hub ➔ North Distribution Junction ➔ Residential Sector A")
  const pathNodeNames = routeNodesString ? routeNodesString.split(' ➔ ') : [];
  const activeNodeIds = GRAPH_NODES.filter(n => pathNodeNames.includes(n.name)).map(n => n.id);

  const isEdgeInPath = (f, t) => {
    if (activeNodeIds.length < 2) return false;
    for (let i = 0; i < activeNodeIds.length - 1; i++) {
      const u = activeNodeIds[i];
      const v = activeNodeIds[i + 1];
      if ((u === f && v === t) || (u === t && v === f)) return true;
    }
    return false;
  };

  return (
    <div className="glass-card p-6 bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <FiNavigation className="text-cyan-400 animate-pulse" /> Live Dijkstra Shortest-Path Graph Visualizer
          </h3>
          <p className="text-xs text-slate-400">Interactive 10-node road network showing real-time shortest route</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-400 rounded-full inline-block" /> Optimal Path</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary-600 rounded-full inline-block" /> Pharmacy Hub</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block" /> Customer Address</div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
        <svg viewBox="0 0 680 400" className="w-full h-auto min-w-[600px]">
          {/* Grid lines background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render Graph Edges */}
          {EDGES.map((edge, idx) => {
            const u = GRAPH_NODES.find(n => n.id === edge.from);
            const v = GRAPH_NODES.find(n => n.id === edge.to);
            const active = isEdgeInPath(edge.from, edge.to);
            return (
              <g key={idx}>
                <line
                  x1={u.x} y1={u.y} x2={v.x} y2={v.y}
                  stroke={active ? "url(#pathGradient)" : "#334155"}
                  strokeWidth={active ? "4" : "1.5"}
                  strokeDasharray={active ? "8 4" : "none"}
                  className={active ? "animate-pulse" : ""}
                />
                <text
                  x={(u.x + v.x) / 2} y={(u.y + v.y) / 2 - 6}
                  fill={active ? "#67e8f9" : "#64748b"}
                  fontSize="10"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Render Graph Nodes */}
          {GRAPH_NODES.map(node => {
            const inPath = activeNodeIds.includes(node.id);
            const isStart = activeNodeIds[0] === node.id;
            const isEnd = activeNodeIds[activeNodeIds.length - 1] === node.id;

            let fillColor = "#1e293b";
            let strokeColor = "#475569";
            if (node.type === 'hub')    { fillColor = "#2563eb"; strokeColor = "#60a5fa"; }
            if (node.type === 'target') { fillColor = "#059669"; strokeColor = "#34d399"; }
            if (inPath)                 { strokeColor = "#22d3ee"; }

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
              >
                <circle
                  cx={node.x} cy={node.y} r={inPath ? "16" : "12"}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={inPath ? "3" : "1.5"}
                />
                <text
                  x={node.x} y={node.y + 4}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.id}
                </text>

                {/* Label */}
                <text
                  x={node.x} y={node.y + 30}
                  fill={inPath ? "#38bdf8" : "#94a3b8"}
                  fontSize="10"
                  fontWeight={inPath ? "bold" : "normal"}
                  textAnchor="middle"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Path details footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-slate-400 block">Shortest Node Sequence:</span>
          <span className="font-mono text-cyan-300 font-semibold">{routeNodesString || 'Calculating...'}</span>
        </div>
        <div className="flex gap-6">
          <div>
            <span className="text-slate-400 block">Total Distance:</span>
            <span className="font-bold text-white text-sm">{distanceKm || 0} km</span>
          </div>
          <div>
            <span className="text-slate-400 block">Estimated Time:</span>
            <span className="font-bold text-white text-sm">{timeMins || 0} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
