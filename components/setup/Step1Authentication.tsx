'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';
import { useEffect } from 'react';

interface Step1Props {
  onNext: () => void;
  onBack?: () => void;
}

export function Step1Authentication({ onNext }: Step1Props) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      onNext();
    }
  }, [status, onNext]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Account</h2>
        <p className="text-gray-400">
          Sign in with GitHub or Google to access repository integration and cloud services.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <Button
          onClick={() => signIn('github', { callbackUrl: '/setup' })}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white h-14"
          size="lg"
        >
          <Github className="w-5 h-5 mr-3" />
          Continue with GitHub
        </Button>

        <Button
          onClick={() => signIn('google', { callbackUrl: '/setup' })}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 h-14"
          size="lg"
          variant="outline"
        >
          <Mail className="w-5 h-5 mr-3" />
          Continue with Google
        </Button>
      </div>

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h3 className="font-semibold text-white mb-2">Why we need this:</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Access your GitHub repositories for workflow integration</li>
          <li>• Securely store your session and preferences</li>
          <li>• Enable collaborative features with your team</li>
        </ul>
      </div>
    </div>
  );
}
