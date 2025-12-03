'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Repeat, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoopNode = memo(({ data, selected }: NodeProps) => {
  const iterations = data.iterations || 'N';
  const condition = data.condition || 'Until complete';
  const label = data.label || 'Loop';

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 transition-all min-w-[200px]',
        'bg-gradient-to-br from-emerald-900/20 to-teal-900/20',
        selected
          ? 'border-emerald-500 shadow-lg shadow-emerald-500/50'
          : 'border-emerald-700 hover:border-emerald-600'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-emerald-500 !border-2 !border-emerald-600"
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-emerald-500/20">
          <Repeat className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-semibold text-sm text-emerald-100">{label}</span>
        {data.editable !== false && (
          <Settings className="w-3 h-3 text-gray-400 ml-auto cursor-pointer hover:text-white" />
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Iterations:</span>
          <span className="text-emerald-400 font-mono font-semibold">{iterations}</span>
        </div>
        <div className="text-xs text-gray-300 bg-gray-900/30 rounded px-2 py-1">
          {condition}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="w-8 h-0.5 bg-emerald-500/50" />
          <Repeat className="w-3 h-3 text-emerald-500" />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="continue"
        className="w-3 h-3 !bg-emerald-500 !border-2 !border-emerald-600"
      />

      <Handle
        type="source"
        position={Position.Left}
        id="loop"
        className="w-3 h-3 !bg-emerald-400 !border-2 !border-emerald-500"
      />
    </div>
  );
});

LoopNode.displayName = 'LoopNode';
