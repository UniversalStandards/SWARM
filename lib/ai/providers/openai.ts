import OpenAI from 'openai';
import { AIProviderBase } from '../provider-factory';
import type { ChatMessage, ChatOptions, ChatResponse } from '@/types';

export class OpenAIProvider extends AIProviderBase {
  private client: OpenAI;

  constructor(apiKey: string, customEndpoint?: string) {
    super(apiKey, customEndpoint);
    this.client = new OpenAI({
      apiKey,
      baseURL: customEndpoint,
    });
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: options.model || 'gpt-4-turbo-preview',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
      });

      const choice = completion.choices[0];
      const usage = completion.usage;

      return {
        content: choice.message.content || '',
        tokensUsed: {
          input: usage?.prompt_tokens || 0,
          output: usage?.completion_tokens || 0,
          total: usage?.total_tokens || 0,
        },
        model: completion.model,
        finishReason: (choice.finish_reason as any) || 'stop',
        cost: this.calculateCost(completion.model, usage?.prompt_tokens || 0, usage?.completion_tokens || 0),
      };
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    };

    const modelPricing = pricing[model] || pricing['gpt-3.5-turbo'];
    return (inputTokens / 1000) * modelPricing.input + (outputTokens / 1000) * modelPricing.output;
  }
}
