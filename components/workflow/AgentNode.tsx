'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentNodeProps {
  data: {
    label: string;
    type?: string;
    status?: 'idle' | 'active' | 'error';
  };
  selected?: boolean;
}

function AgentNode({ data, selected }: AgentNodeProps) {
  const statusColors = {
    idle: 'bg-gray-500',
    active: 'bg-green-500 animate-pulse',
    error: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-slate-800 min-w-[180px]',
        selected ? 'border-cyan-500' : 'border-slate-700'
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          data.status ? statusColors[data.status] : 'bg-gray-500'
        )} />
        <Bot className="w-5 h-5 text-cyan-400" />
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          {data.type && (
            <div className="text-xs text-gray-400">{data.type}</div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(AgentNode);
