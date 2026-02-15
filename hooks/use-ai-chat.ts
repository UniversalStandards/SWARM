import { useState } from 'react';
import type { ChatMessage, ChatResponse, AIProvider } from '@/types';

interface UseAIChatOptions {
  provider: AIProvider;
  model: string;
  apiKey: string;
  customEndpoint?: string;
}

export function useAIChat(options: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string): Promise<ChatResponse | null> => {
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: options.provider,
          model: options.model,
          apiKey: options.apiKey,
          messages: [...messages, userMessage],
          options: {
            customEndpoint: options.customEndpoint,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.content,
        };
        setMessages(prev => [...prev, assistantMessage]);
        return data;
      } else {
        setError(data.error || 'Failed to send message');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, sendMessage, loading, error, clearMessages };
}
