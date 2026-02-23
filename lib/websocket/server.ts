// WebSocket server implementation for real-time updates
// This would typically run in a separate worker process

import { WebSocket, WebSocketServer } from 'ws';
import { logger } from '../logger';

interface Message {
  type: string;
  data: any;
}

export class WorkflowWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Set<WebSocket>> = new Map();

  start(port: number = 8080): void {
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('WebSocket client connected');

      ws.on('message', (data: string) => {
        try {
          const message: Message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          logger.error('Failed to parse WebSocket message', error as Error);
        }
      });

      ws.on('close', () => {
        logger.info('WebSocket client disconnected');
        this.removeClient(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error', error);
      });
    });

    logger.info(`WebSocket server started on port ${port}`);
  }

  private handleMessage(ws: WebSocket, message: Message): void {
    switch (message.type) {
      case 'subscribe':
        this.subscribe(ws, message.data.executionId);
        break;
      case 'unsubscribe':
        this.unsubscribe(ws, message.data.executionId);
        break;
      default:
        logger.warn('Unknown message type', { type: message.type });
    }
  }

  private subscribe(ws: WebSocket, executionId: string): void {
    if (!this.clients.has(executionId)) {
      this.clients.set(executionId, new Set());
    }
    this.clients.get(executionId)!.add(ws);
    logger.info('Client subscribed', { executionId });
  }

  private unsubscribe(ws: WebSocket, executionId: string): void {
    const clients = this.clients.get(executionId);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.clients.delete(executionId);
      }
    }
    logger.info('Client unsubscribed', { executionId });
  }

  private removeClient(ws: WebSocket): void {
    for (const [executionId, clients] of this.clients.entries()) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.clients.delete(executionId);
      }
    }
  }

  broadcast(executionId: string, message: Message): void {
    const clients = this.clients.get(executionId);
    if (clients) {
      const data = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  }

  stop(): void {
    if (this.wss) {
      this.wss.close();
      logger.info('WebSocket server stopped');
    }
  }
}

export const wsServer = new WorkflowWebSocketServer();
