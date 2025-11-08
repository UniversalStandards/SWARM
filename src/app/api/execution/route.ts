import { NextRequest, NextResponse } from "next/server";
import { WebSocketServer, WebSocket } from "ws";

interface ExecutionData {
  id: number;
  workflowId: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  logs: string[];
  [key: string]: any;
}

// In-memory storage for executions
const executions = new Map<number, ExecutionData>();
let executionIdCounter = 1;

// WebSocket server instance
let wss: WebSocketServer | null = null;

// Initialize WebSocket server if not already initialized
function initWebSocketServer(): void {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });
    wss.on("connection", (ws: WebSocket) => {
      console.log("WebSocket client connected");
      ws.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });
  }
}

// Broadcast message to all connected WebSocket clients
function broadcast(message: any): void {
  if (!wss) return;
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// POST /api/execution/start - Start a new workflow execution
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { workflowId, parameters } = body;

  if (!workflowId) {
    return NextResponse.json({ error: "Missing workflowId" }, { status: 400 });
  }

  const executionId = executionIdCounter++;
  const execution: ExecutionData = {
    id: executionId,
    workflowId,
    parameters,
    status: "running",
    startTime: new Date(),
    logs: [],
  };

  executions.set(executionId, execution);

  // Broadcast new execution start
  broadcast({ type: "executionStarted", execution });

  return NextResponse.json({ executionId });
}

// GET /api/execution/list - List all executions with pagination and filtering
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const statusFilter = url.searchParams.get("status");

  let filteredExecutions = Array.from(executions.values());

  if (statusFilter) {
    filteredExecutions = filteredExecutions.filter(
      (exec) => exec.status === statusFilter
    );
  }

  const total = filteredExecutions.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedExecutions = filteredExecutions.slice(start, end);

  return NextResponse.json({
    page,
    pageSize,
    total,
    executions: pagedExecutions,
  });
}

// GET /api/execution/stats - Get execution statistics
export async function stats() {
  const total = executions.size;
  const running = Array.from(executions.values()).filter(
    (exec) => exec.status === "running"
  ).length;
  const completed = Array.from(executions.values()).filter(
    (exec) => exec.status === "completed"
  ).length;
  const failed = Array.from(executions.values()).filter(
    (exec) => exec.status === "failed"
  ).length;

  return NextResponse.json({ total, running, completed, failed });
}

// Export a handler for /api/execution/stats
export async function GET_stats(request: NextRequest) {
  return stats();
}

// Export a handler for WebSocket upgrade
export function onUpgrade(request: any, socket: any, head: any): void {
  initWebSocketServer();
  if (wss) {
    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      if (wss) {
        wss.emit("connection", ws, request);
      }
    });
  }
}
