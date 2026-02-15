'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParallelNodeProps {
  data: {
    label: string;
    branches?: number;
  };
  selected?: boolean;
}

function ParallelNode({ data, selected }: ParallelNodeProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-purple-900/20 min-w-[180px]',
        selected ? 'border-purple-500' : 'border-purple-700'
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-purple-400" />
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          <div className="text-xs text-purple-400">
            {data.branches || 2} parallel branches
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(ParallelNode);
