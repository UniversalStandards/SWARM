import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration purposes
const logs = [
  { id: 1, level: 'debug', message: 'Debug log 1', timestamp: '2024-01-01T10:00:00Z' },
  { id: 2, level: 'info', message: 'Info log 1', timestamp: '2024-01-01T10:01:00Z' },
  { id: 3, level: 'warning', message: 'Warning log 1', timestamp: '2024-01-01T10:02:00Z' },
  { id: 4, level: 'error', message: 'Error log 1', timestamp: '2024-01-01T10:03:00Z' },
  { id: 5, level: 'info', message: 'Info log 2', timestamp: '2024-01-01T10:04:00Z' },
  // Add more logs as needed
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // Validate log level filter
  const validLevels = ['debug', 'info', 'warning', 'error'];
  if (level && !validLevels.includes(level)) {
    return NextResponse.json({ error: 'Invalid log level filter' }, { status: 400 });
  }

  // Filter logs by execution id and level
  // Here we just simulate filtering by id by returning all logs as mock
  let filteredLogs = logs;
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(start, start + pageSize);

  return NextResponse.json({
    executionId: params.id,
    page,
    pageSize,
    totalLogs: filteredLogs.length,
    logs: paginatedLogs,
  });
}
