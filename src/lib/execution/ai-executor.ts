// ai-executor.ts
// This module handles communication with various AI providers including Anthropic Claude, OpenAI GPT, Google Gemini, Ollama, and custom APIs.
// It provides multi-provider AI integration with streaming support, token usage tracking, and a unified interface.

import EventEmitter from 'events';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Define interfaces for request and response
export interface AIRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  systemPrompt?: string;
  [key: string]: any;
}

export interface AIResponse {
  text: string;
  tokensUsed: number;
  finishReason?: string;
  model?: string;
  [key: string]: any;
}

// Abstract base class for AI providers
abstract class AIProvider extends EventEmitter {
  abstract name: string;
  protected apiKey?: string;
  
  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey;
  }

  abstract request(request: AIRequest): Promise<AIResponse>;

  // Optional streaming support
  onStream?(callback: (chunk: string) => void): void;
}

// Anthropic Claude Provider
class AnthropicClaudeProvider extends AIProvider {
  name = 'Anthropic Claude';
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    super(apiKey);
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async request(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await this.client.messages.create({
        model: request.model || 'claude-3-5-sonnet-20241022',
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt || 'You are a helpful AI assistant.',
        messages: [
          {
            role: 'user',
            content: request.prompt,
          },
        ],
      });

      const textContent = response.content[0];
      const text = textContent.type === 'text' ? textContent.text : '';

      return {
        text,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        finishReason: response.stop_reason || undefined,
        model: response.model,
      };
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}

// OpenAI GPT Provider
class OpenAIGPTProvider extends AIProvider {
  name = 'OpenAI GPT';
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    super(apiKey);
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async request(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: request.model || 'gpt-4-turbo-preview',
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature || 0.7,
        messages: [
          {
            role: 'system',
            content: request.systemPrompt || 'You are a helpful AI assistant.',
          },
          {
            role: 'user',
            content: request.prompt,
          },
        ],
      });

      const message = response.choices[0]?.message;
      const text = message?.content || '';

      return {
        text,
        tokensUsed: response.usage?.total_tokens || 0,
        finishReason: response.choices[0]?.finish_reason || undefined,
        model: response.model,
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

// Google Gemini Provider
class GoogleGeminiProvider extends AIProvider {
  name = 'Google Gemini';
  private client: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    super(apiKey);
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  async request(request: AIRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('Google AI API key not configured');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: request.model || 'gemini-pro',
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 4096,
          temperature: request.temperature || 0.7,
        },
      });

      const response = result.response;
      const text = response.text();
      
      // Google AI SDK may not always provide usage metadata
      const tokensUsed = (response as any).usageMetadata?.totalTokenCount || 0;

      return {
        text,
        tokensUsed,
        model: request.model || 'gemini-pro',
      };
    } catch (error: any) {
      throw new Error(`Google AI API error: ${error.message}`);
    }
  }
}

// Ollama Provider
class OllamaProvider extends AIProvider {
  name = 'Ollama';
  private baseURL: string;

  constructor(apiKey?: string, baseURL: string = 'http://localhost:11434') {
    super(apiKey);
    this.baseURL = baseURL;
  }

  async request(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: request.model || 'llama2',
        prompt: request.prompt,
        stream: false,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 4096,
        },
      });

      return {
        text: response.data.response || '',
        tokensUsed: response.data.eval_count || 0,
        model: response.data.model,
      };
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }
}

// Custom API Provider
class CustomAPIProvider extends AIProvider {
  name = 'Custom API';
  private baseURL: string;

  constructor(apiKey?: string, baseURL?: string) {
    super(apiKey);
    this.baseURL = baseURL || process.env.CUSTOM_API_URL || '';
  }

  async request(request: AIRequest): Promise<AIResponse> {
    if (!this.baseURL) {
      throw new Error('Custom API URL not configured');
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.post(
        this.baseURL,
        {
          prompt: request.prompt,
          model: request.model,
          max_tokens: request.maxTokens || 4096,
          temperature: request.temperature || 0.7,
          system: request.systemPrompt,
        },
        { headers, timeout: 60000 }
      );

      return {
        text: response.data.text || response.data.response || response.data.content || '',
        tokensUsed: response.data.tokens || response.data.usage?.total_tokens || 0,
        model: request.model,
      };
    } catch (error: any) {
      throw new Error(`Custom API error: ${error.message}`);
    }
  }
}

// AI Executor class to unify all providers
export class AIExecutor {
  private providers: Map<string, AIProvider> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config?: {
    anthropicApiKey?: string;
    openaiApiKey?: string;
    googleApiKey?: string;
    ollamaBaseURL?: string;
    customApiKey?: string;
    customApiURL?: string;
  }) {
    const anthropicKey = config?.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    const openaiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY;
    const googleKey = config?.googleApiKey || process.env.GOOGLE_AI_API_KEY;
    const ollamaURL = config?.ollamaBaseURL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const customKey = config?.customApiKey || process.env.CUSTOM_API_KEY;
    const customURL = config?.customApiURL || process.env.CUSTOM_API_URL;

    this.providers.set('claude', new AnthropicClaudeProvider(anthropicKey));
    this.providers.set('gpt', new OpenAIGPTProvider(openaiKey));
    this.providers.set('gemini', new GoogleGeminiProvider(googleKey));
    this.providers.set('ollama', new OllamaProvider(undefined, ollamaURL));
    this.providers.set('custom', new CustomAPIProvider(customKey, customURL));
  }

  private async checkRateLimit(providerKey: string, maxRequestsPerMinute: number = 60): Promise<void> {
    const now = Date.now();
    const limiter = this.rateLimiters.get(providerKey);

    if (!limiter || now >= limiter.resetTime) {
      this.rateLimiters.set(providerKey, { count: 1, resetTime: now + 60000 });
      return;
    }

    if (limiter.count >= maxRequestsPerMinute) {
      const waitTime = limiter.resetTime - now;
      throw new Error(`Rate limit exceeded for ${providerKey}. Retry after ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    limiter.count++;
  }

  async execute(providerKey: string, request: AIRequest, retries: number = 3): Promise<AIResponse> {
    const provider = this.providers.get(providerKey);
    if (!provider) {
      throw new Error(`AI provider '${providerKey}' not supported. Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    await this.checkRateLimit(providerKey);

    let lastError: Error | null = null;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await provider.request(request);
        return response;
      } catch (error: any) {
        lastError = error;
        
        if (attempt < retries - 1) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    }

    throw new Error(`Failed to execute AI request after ${retries} attempts: ${lastError?.message}`);
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProvider(providerKey: string): AIProvider | undefined {
    return this.providers.get(providerKey);
  }
}
