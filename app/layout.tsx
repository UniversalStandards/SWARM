import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Swarm Orchestrator | Enterprise Edition',
  description: 'Next-generation AI agent orchestration platform for autonomous software development',
  keywords: ['AI', 'agents', 'orchestration', 'automation', 'development', 'Claude', 'GPT-4', 'workflow'],
  authors: [{ name: 'US-SPURS Technology Division' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0891b2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
