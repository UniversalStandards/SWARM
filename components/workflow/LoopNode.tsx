'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoopNodeProps {
  data: {
    label: string;
    iterations?: number;
  };
  selected?: boolean;
}

function LoopNode({ data, selected }: LoopNodeProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-indigo-900/20 min-w-[180px]',
        selected ? 'border-indigo-500' : 'border-indigo-700'
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <RotateCw className="w-5 h-5 text-indigo-400" />
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          <div className="text-xs text-indigo-400">
            {data.iterations ? `${data.iterations} iterations` : 'Loop'}
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(LoopNode);
