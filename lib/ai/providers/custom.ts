import axios from 'axios';
import { AIProviderBase } from '../provider-factory';
import type { ChatMessage, ChatOptions, ChatResponse } from '@/types';

export class CustomProvider extends AIProviderBase {
  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    if (!this.customEndpoint) {
      throw new Error('Custom endpoint URL is required for custom provider');
    }

    try {
      const response = await axios.post(
        this.customEndpoint,
        {
          messages,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.content || response.data.message || '',
        tokensUsed: {
          input: response.data.usage?.prompt_tokens || 0,
          output: response.data.usage?.completion_tokens || 0,
          total: response.data.usage?.total_tokens || 0,
        },
        model: options.model || 'custom',
        finishReason: 'stop',
      };
    } catch (error) {
      console.error('Custom Provider Error:', error);
      throw new Error(`Custom Provider Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string> {
    throw new Error('Streaming not implemented for custom provider');
  }
}
