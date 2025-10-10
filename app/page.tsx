'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store';
import { motion } from 'framer-motion';
import { Rocket, Zap, Code2, Brain, GitBranch, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Multiple specialized agents working in perfect harmony',
    },
    {
      icon: GitBranch,
      title: 'GitHub Integration',
      description: 'Seamless repository access and automated commits',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute complex workflows in minutes, not hours',
    },
    {
      icon: Code2,
      title: 'Multi-Model Support',
      description: 'OpenAI, Anthropic, Google - use any model you prefer',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Your code and API keys stay secure and private',
    },
    {
      icon: Rocket,
      title: 'Autonomous Execution',
      description: 'Set it and forget it - agents handle everything',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Rocket className="w-16 h-16 text-cyan-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">AI Swarm</span>
            <br />
            <span className="text-white">Orchestrator</span>
          </h1>
          
          <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            The Next Generation of Autonomous Software Development
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Deploy specialized AI agents that work together to build, test, and deploy your software projects with unprecedented speed and quality.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/setup')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-lg font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Begin Your Mission
              <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <feature.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">14+</div>
                <div className="text-gray-400">Specialized Agents</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">5+</div>
                <div className="text-gray-400">AI Models Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2"></div>
                <div className="text-gray-400">Workflow Possibilities</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
