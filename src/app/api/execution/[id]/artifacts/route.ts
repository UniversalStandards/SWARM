import { NextRequest, NextResponse } from "next/server";

// Mock function to simulate fetching artifacts for a given execution ID
async function getExecutionArtifacts(id: string) {
  // In a real implementation, this would fetch data from a database or storage
  return {
    code: ["main.py", "utils.py"],
    documents: ["report.pdf", "summary.docx"],
    data: ["data.csv"],
    images: ["chart.png"],
    others: ["output.log"]
  };
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Execution ID is required" }, { status: 400 });
  }

  try {
    const artifacts = await getExecutionArtifacts(id);
    return NextResponse.json({ executionId: id, artifacts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve artifacts" }, { status: 500 });
  }
}
