import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface BroadcastMessage {
  type: string;
  [key: string]: any;
}

class WebSocketServerManager {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  initialize(server: Server): WebSocketServer {
    if (this.wss) {
      return this.wss;
    }

    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          console.log('Received message:', data);
          
          // Handle different message types
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connected',
        message: 'Connected to SWARM WebSocket server',
      });
    });

    console.log('WebSocket server initialized');
    return this.wss;
  }

  private handleMessage(ws: WebSocket, data: any): void {
    // Handle different message types
    switch (data.type) {
      case 'subscribe':
        // Handle subscription to specific events
        this.sendToClient(ws, {
          type: 'subscribed',
          channel: data.channel,
        });
        break;
      case 'ping':
        this.sendToClient(ws, { type: 'pong' });
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  broadcast(message: BroadcastMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private sendToClient(client: WebSocket, message: any): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }

  close(): void {
    if (this.wss) {
      this.clients.forEach((client) => {
        client.close();
      });
      this.wss.close();
      this.wss = null;
      this.clients.clear();
    }
  }
}

// Singleton instance
export const wsManager = new WebSocketServerManager();
export default wsManager;
