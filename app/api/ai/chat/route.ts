import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/provider-factory';
import type { AIProvider, ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, messages, apiKey, options = {} } = body;

    if (!provider || !model || !messages || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, messages, apiKey' },
        { status: 400 }
      );
    }

    const aiProvider = AIProviderFactory.create(
      provider as AIProvider,
      apiKey,
      options.customEndpoint
    );

    const response = await aiProvider.chat(messages as ChatMessage[], {
      model,
      ...options,
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Chat API - Use POST to send chat requests',
    supportedProviders: ['openai', 'anthropic', 'google', 'custom'],
  });
}
