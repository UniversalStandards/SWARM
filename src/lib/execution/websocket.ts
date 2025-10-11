import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

interface ExecutionEvent {
  executionId: string;
  status: string;
  data?: any;
}

interface Client {
  ws: WebSocket;
  subscribedExecutions: Set<string>;
  isAlive: boolean;
}

export class ExecutionWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<Client> = new Set();
  private jwtSecret: string;

  constructor(port: number, jwtSecret: string) {
    this.jwtSecret = jwtSecret;
    this.wss = new WebSocketServer({ port });

    this.wss.on("connection", (ws, req) => {
      const client: Client = {
        ws,
        subscribedExecutions: new Set(),
        isAlive: true,
      };

      // Authenticate client
      const token = this.extractToken(req.url);
      if (!token || !this.verifyToken(token)) {
        ws.close(1008, "Unauthorized");
        return;
      }

      this.clients.add(client);

      ws.on("message", (message) => this.handleMessage(client, message.toString()));
      ws.on("close", () => this.clients.delete(client));
      ws.on("pong", () => (client.isAlive = true));
    });

    // Connection health monitoring
    setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          client.ws.terminate();
          this.clients.delete(client);
          return;
        }
        client.isAlive = false;
        client.ws.ping();
      });
    }, 30000);
  }

  private extractToken(url: string | undefined): string | null {
    if (!url) return null;
    const params = new URLSearchParams(url.split("?")[1]);
    return params.get("token");
  }

  private verifyToken(token: string): boolean {
    try {
      jwt.verify(token, this.jwtSecret);
      return true;
    } catch {
      return false;
    }
  }

  private handleMessage(client: Client, message: string) {
    try {
      const msg = JSON.parse(message);
      if (msg.action === "subscribe" && msg.executionId) {
        client.subscribedExecutions.add(msg.executionId);
        client.ws.send(JSON.stringify({ success: true, subscribedTo: msg.executionId }));
      } else if (msg.action === "unsubscribe" && msg.executionId) {
        client.subscribedExecutions.delete(msg.executionId);
        client.ws.send(JSON.stringify({ success: true, unsubscribedFrom: msg.executionId }));
      } else {
        client.ws.send(JSON.stringify({ error: "Invalid action or missing executionId" }));
      }
    } catch (error) {
      client.ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  }

  public broadcastExecutionEvent(event: ExecutionEvent) {
    this.clients.forEach((client) => {
      if (client.subscribedExecutions.has(event.executionId)) {
        client.ws.send(JSON.stringify(event));
      }
    });
  }
}
