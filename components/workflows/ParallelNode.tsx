'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Layers, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ParallelNode = memo(({ data, selected }: NodeProps) => {
  const branches = data.branches || 3;
  const label = data.label || 'Parallel Execution';

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 transition-all min-w-[200px]',
        'bg-gradient-to-br from-purple-900/20 to-pink-900/20',
        selected
          ? 'border-purple-500 shadow-lg shadow-purple-500/50'
          : 'border-purple-700 hover:border-purple-600'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-purple-600"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded bg-purple-500/20">
          <Layers className="w-4 h-4 text-purple-400" />
        </div>
        <span className="font-semibold text-sm text-purple-100">{label}</span>
        {data.editable !== false && (
          <Settings className="w-3 h-3 text-gray-400 ml-auto cursor-pointer hover:text-white" />
        )}
      </div>

      <div className="flex items-center justify-center gap-1 mb-2">
        {Array.from({ length: Math.min(branches, 5) }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-1 bg-purple-500/50 rounded-full"
          />
        ))}
        {branches > 5 && (
          <span className="text-xs text-gray-400 ml-1">+{branches - 5}</span>
        )}
      </div>

      <div className="text-xs text-center text-gray-400">
        {branches} parallel {branches === 1 ? 'branch' : 'branches'}
      </div>

      {Array.from({ length: Math.min(branches, 5) }).map((_, i) => {
        const totalBranches = Math.min(branches, 5);
        const spacing = 100 / (totalBranches + 1);
        const leftPercent = spacing * (i + 1);

        return (
          <Handle
            key={i}
            type="source"
            position={Position.Bottom}
            id={`branch-${i}`}
            style={{ left: `${leftPercent}%` }}
            className="w-3 h-3 !bg-purple-500 !border-2 !border-purple-600"
          />
        );
      })}
    </div>
  );
});

ParallelNode.displayName = 'ParallelNode';
