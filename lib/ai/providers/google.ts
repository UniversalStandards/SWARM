import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderBase } from '../provider-factory';
import type { ChatMessage, ChatOptions, ChatResponse } from '@/types';

export class GoogleProvider extends AIProviderBase {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    try {
      const model = this.client.getGenerativeModel({ model: options.model || 'gemini-1.5-pro' });
      
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;
      const text = response.text();

      return {
        content: text,
        tokensUsed: {
          input: 0,
          output: 0,
          total: 0,
        },
        model: options.model || 'gemini-1.5-pro',
        finishReason: 'stop',
        cost: 0,
      };
    } catch (error) {
      console.error('Google AI Error:', error);
      throw new Error(`Google AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string> {
    const model = this.client.getGenerativeModel({ model: options.model || 'gemini-1.5-pro' });
    
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}
