import { NextRequest, NextResponse } from "next/server";
import { activeExecutionsRegistry } from "../../../../../../lib/activeExecutionsRegistry";
import { websocketServer } from "../../../../../../lib/websocketServer";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const executionId = params.id;

  // Get execution status from the active executions registry
  const execution = activeExecutionsRegistry.get(executionId);

  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }

  return NextResponse.json({ status: execution.status });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const executionId = params.id;
  const url = new URL(request.url);

  if (url.pathname.endsWith("/cancel")) {
    // Cancel the execution
    const execution = activeExecutionsRegistry.get(executionId);

    if (!execution) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 });
    }

    if (execution.status === "cancelled" || execution.status === "completed") {
      return NextResponse.json({ error: "Execution cannot be cancelled" }, { status: 400 });
    }

    execution.cancel();

    // Notify clients via WebSocket
    websocketServer.broadcast({
      type: "execution_cancelled",
      executionId,
    });

    return NextResponse.json({ message: "Execution cancelled" });
  }

  return NextResponse.json({ error: "Unsupported POST endpoint" }, { status: 404 });
}
