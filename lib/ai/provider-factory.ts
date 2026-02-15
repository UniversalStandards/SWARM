import { AIProvider, ChatMessage, ChatOptions, ChatResponse } from '@/types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GoogleProvider } from './providers/google';
import { CustomProvider } from './providers/custom';

export class AIProviderFactory {
  private static providers = new Map<
    AIProvider,
    typeof OpenAIProvider | typeof AnthropicProvider | typeof GoogleProvider | typeof CustomProvider
  >();

  static {
    this.providers.set('openai', OpenAIProvider);
    this.providers.set('anthropic', AnthropicProvider);
    this.providers.set('google', GoogleProvider);
    this.providers.set('custom', CustomProvider);
  }

  static create(provider: AIProvider, apiKey: string, customEndpoint?: string): AIProviderBase {
    const ProviderClass = this.providers.get(provider);
    
    if (!ProviderClass) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return new ProviderClass(apiKey, customEndpoint);
  }
}

export abstract class AIProviderBase {
  protected apiKey: string;
  protected customEndpoint?: string;

  constructor(apiKey: string, customEndpoint?: string) {
    this.apiKey = apiKey;
    this.customEndpoint = customEndpoint;
  }

  abstract chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse>;
  abstract streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string>;
}
