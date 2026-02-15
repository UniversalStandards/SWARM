'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, change, color }: StatCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-8 h-8 ${color}`} />
          {change && <span className="text-sm text-green-400">{change}</span>}
        </div>
        <div>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
