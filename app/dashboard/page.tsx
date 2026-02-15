'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Activity, GitBranch, Zap, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/setup');
  }

  const stats = [
    {
      icon: Activity,
      label: 'Active Workflows',
      value: '3',
      change: '+12%',
      color: 'text-cyan-500',
    },
    {
      icon: Users,
      label: 'Running Agents',
      value: '12',
      change: '+8%',
      color: 'text-green-500',
    },
    {
      icon: GitBranch,
      label: 'Code Commits',
      value: '47',
      change: '+23%',
      color: 'text-purple-500',
    },
    {
      icon: Zap,
      label: 'Tasks Completed',
      value: '128',
      change: '+15%',
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor your AI agent swarm performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Workflows */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Active Workflows</h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Feature Development</h3>
                  <p className="text-sm text-gray-400">2 agents active • Started 2h ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
