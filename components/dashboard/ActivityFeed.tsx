'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'workflow_started' | 'workflow_completed' | 'agent_deployed' | 'error';
  message: string;
  timestamp: string;
  workflow?: string;
  agent?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const typeColors = {
    workflow_started: 'bg-blue-500',
    workflow_completed: 'bg-green-500',
    agent_deployed: 'bg-purple-500',
    error: 'bg-red-500',
  };

  const typeLabels = {
    workflow_started: 'Started',
    workflow_completed: 'Completed',
    agent_deployed: 'Deployed',
    error: 'Error',
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[activity.type]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[activity.type]}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{activity.message}</p>
                {activity.workflow && (
                  <p className="text-xs text-gray-500 mt-1">Workflow: {activity.workflow}</p>
                )}
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
