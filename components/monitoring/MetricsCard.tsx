'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  suffix?: string;
  description?: string;
}

export function MetricsCard({ title, value, change, suffix, description }: MetricsCardProps) {
  const isPositive = change ? change > 0 : false;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {value}
            {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
          </span>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
