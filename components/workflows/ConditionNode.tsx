'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  const condition = data.condition || 'if condition';
  const trueLabel = data.trueLabel || 'True';
  const falseLabel = data.falseLabel || 'False';

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 transition-all min-w-[200px]',
        'bg-gradient-to-br from-amber-900/20 to-orange-900/20',
        selected
          ? 'border-amber-500 shadow-lg shadow-amber-500/50'
          : 'border-amber-700 hover:border-amber-600'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-amber-600"
      />

      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-amber-500/20">
          <GitBranch className="w-4 h-4 text-amber-400" />
        </div>
        <span className="font-semibold text-sm text-amber-100">Condition</span>
        {data.editable !== false && (
          <Settings className="w-3 h-3 text-gray-400 ml-auto cursor-pointer hover:text-white" />
        )}
      </div>

      <div className="text-xs text-gray-300 bg-gray-900/30 rounded px-2 py-1 mb-3 font-mono">
        {condition}
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-400">{trueLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-400">{falseLabel}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="!right-0 w-3 h-3 !bg-green-500 !border-2 !border-green-600"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 !bg-red-500 !border-2 !border-red-600"
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';
