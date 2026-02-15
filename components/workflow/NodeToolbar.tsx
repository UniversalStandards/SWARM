'use client';

import { Settings, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodeToolbarProps {
  onSettings?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function NodeToolbar({ onSettings, onDelete, onDuplicate }: NodeToolbarProps) {
  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-lg">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={onSettings}
      >
        <Settings className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={onDuplicate}
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
