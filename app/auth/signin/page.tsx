'use client';

import { signIn } from 'next-auth/react';
import { Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to SWARM</h1>
          <p className="text-gray-400">Sign in to start orchestrating your AI agents</p>
        </div>

        <div className="glass rounded-xl p-8 space-y-4">
          <Button
            onClick={() => signIn('github', { callbackUrl: '/setup' })}
            className="w-full bg-slate-800 hover:bg-slate-700"
            size="lg"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>

          <Button
            onClick={() => signIn('google', { callbackUrl: '/setup' })}
            className="w-full bg-slate-800 hover:bg-slate-700"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
