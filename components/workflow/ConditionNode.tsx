'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionNodeProps {
  data: {
    label: string;
    condition?: string;
  };
  selected?: boolean;
}

function ConditionNode({ data, selected }: ConditionNodeProps) {
  return (
    <div
      className={cn(
        'relative px-4 py-3 rounded-lg border-2 bg-amber-900/20 min-w-[180px]',
        selected ? 'border-amber-500' : 'border-amber-700'
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-amber-400" />
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          {data.condition && (
            <div className="text-xs text-amber-400 font-mono mt-1">
              {data.condition}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Left} id="false" className="w-3 h-3" />
      <Handle type="source" position={Position.Right} id="true" className="w-3 h-3" />
    </div>
  );
}

export default memo(ConditionNode);
