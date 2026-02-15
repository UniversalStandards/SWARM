import Anthropic from '@anthropic-ai/sdk';
import { AIProviderBase } from '../provider-factory';
import type { ChatMessage, ChatOptions, ChatResponse } from '@/types';

export class AnthropicProvider extends AIProviderBase {
  private client: Anthropic;

  constructor(apiKey: string, customEndpoint?: string) {
    super(apiKey, customEndpoint);
    this.client = new Anthropic({
      apiKey,
      baseURL: customEndpoint,
    });
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.messages.create({
        model: options.model || 'claude-sonnet-4-20250514',
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature,
        system: systemMessage?.content || options.systemPrompt,
        messages: userMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      return {
        content: text,
        tokensUsed: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
          total: response.usage.input_tokens + response.usage.output_tokens,
        },
        model: response.model,
        finishReason: response.stop_reason || 'stop',
        cost: this.calculateCost(response.model, response.usage.input_tokens, response.usage.output_tokens),
      };
    } catch (error) {
      console.error('Anthropic Error:', error);
      throw new Error(`Anthropic API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const stream = await this.client.messages.create({
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens || 4096,
      stream: true,
      system: systemMessage?.content || options.systemPrompt,
      messages: userMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
      'claude-opus-4-20250514': { input: 0.015, output: 0.075 },
      'claude-haiku-4-20250301': { input: 0.00025, output: 0.00125 },
    };

    const modelPricing = pricing[model] || pricing['claude-sonnet-4-20250514'];
    return (inputTokens / 1000) * modelPricing.input + (outputTokens / 1000) * modelPricing.output;
  }
}
