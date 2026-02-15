'use client';

import { EdgeLabelRenderer, type EdgeProps } from 'reactflow';

export function EdgeLabel({ id, sourceX, sourceY, targetX, targetY, label }: EdgeProps) {
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#64748b"
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
