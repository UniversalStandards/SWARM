'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, StopCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

interface ExecutionStatus {
  id: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  startedAt: string;
  completedAt?: string;
  logs: ExecutionLog[];
}

interface ExecutionMonitorProps {
  executionId: string;
}

export function ExecutionMonitor({ executionId }: ExecutionMonitorProps) {
  const [execution, setExecution] = useState<ExecutionStatus | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/execute?executionId=${executionId}`);
        const data = await response.json();
        if (data.success) {
          setExecution(data.execution);
        }
      } catch (error) {
        console.error('Failed to fetch execution status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [executionId, autoRefresh]);

  if (!execution) {
    return <div className="text-gray-400">Loading execution status...</div>;
  }

  const statusIcons = {
    running: <Play className="w-5 h-5 text-blue-500" />,
    paused: <Pause className="w-5 h-5 text-yellow-500" />,
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const logLevelColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    success: 'text-green-400',
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {statusIcons[execution.status]}
              Execution Status
            </CardTitle>
            <Badge variant="secondary">
              {execution.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{execution.progress}%</span>
            </div>
            <Progress value={execution.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Started</span>
              <p className="text-white">{new Date(execution.startedAt).toLocaleString()}</p>
            </div>
            {execution.completedAt && (
              <div>
                <span className="text-gray-500">Completed</span>
                <p className="text-white">{new Date(execution.completedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {execution.status === 'running' && (
              <Button size="sm" variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {execution.status === 'paused' && (
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            <Button size="sm" variant="destructive">
              <StopCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Execution Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {execution.logs.map((log, index) => (
              <div key={index} className="mb-2">
                <span className="text-gray-500">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className={`ml-2 ${logLevelColors[log.level]}`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="ml-2 text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
