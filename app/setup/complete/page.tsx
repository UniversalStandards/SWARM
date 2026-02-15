'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SetupCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Setup Complete!
          </h1>
          <p className="text-lg text-gray-400">
            Your AI agent swarm is ready to revolutionize your development workflow
          </p>
        </div>

        <div className="glass rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
          <ul className="text-left space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Your workflow is saved and ready to execute</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Agents will begin analyzing your repository</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Real-time monitoring available on the dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>You'll receive notifications for important events</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          size="lg"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Launch Dashboard
        </Button>
      </div>
    </div>
  );
}
