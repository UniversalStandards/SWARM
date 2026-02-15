'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GitHubConnect() {
  return (
    <div className="glass rounded-xl p-8 text-center">
      <div className="mb-6">
        <Github className="w-16 h-16 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect to GitHub
        </h2>
        <p className="text-gray-400">
          Authenticate with GitHub to give your AI agents access to your repositories
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4 text-left">
          <h3 className="text-sm font-semibold text-white mb-2">Permissions Required:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Read repository information</li>
            <li>• Read and write code</li>
            <li>• Create branches and pull requests</li>
            <li>• Manage issues and discussions</li>
          </ul>
        </div>
      </div>

      <Button
        onClick={() => signIn('github', { callbackUrl: '/setup' })}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        size="lg"
      >
        <Github className="w-5 h-5 mr-2" />
        Connect with GitHub
      </Button>

      <p className="text-xs text-gray-500 mt-4">
        Your credentials are secure and only used to access your repositories
      </p>
    </div>
  );
}
