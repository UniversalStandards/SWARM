// ExecutionHistoryManager class for ML-ready analytics
// Features: historical execution tracking, trend analysis, performance pattern recognition,
// bottleneck identification, error pattern analysis, automated insight generation,
// and ML-ready data export in multiple formats.

interface ExecutionRecord {
  id: string;
  timestamp: Date;
  durationMs: number;
  status: 'success' | 'failure';
  errorType?: string;
  metadata?: Record<string, any>;
}

interface TrendAnalysisResult {
  averageDuration: number;
  successRate: number;
  failureRate: number;
  trends: Record<string, any>;
}

interface PerformancePattern {
  patternName: string;
  occurrences: number;
  averageDuration: number;
}

interface Bottleneck {
  step: string;
  averageDuration: number;
  occurrences: number;
}

interface ErrorPattern {
  errorType: string;
  occurrences: number;
  lastOccurred: Date;
}

class ExecutionHistoryManager {
  private history: ExecutionRecord[] = [];

  addRecord(record: ExecutionRecord) {
    this.history.push(record);
  }

  getHistory() {
    return this.history;
  }

  analyzeTrends(): TrendAnalysisResult {
    const total = this.history.length;
    if (total === 0) {
      return {
        averageDuration: 0,
        successRate: 0,
        failureRate: 0,
        trends: {},
      };
    }

    const totalDuration = this.history.reduce((acc, r) => acc + r.durationMs, 0);
    const successCount = this.history.filter(r => r.status === 'success').length;
    const failureCount = total - successCount;

    // Simple trend example: average duration and success/failure rates
    return {
      averageDuration: totalDuration / total,
      successRate: successCount / total,
      failureRate: failureCount / total,
      trends: {}, // Placeholder for more complex trend data
    };
  }

  identifyPerformancePatterns(): PerformancePattern[] {
    // Placeholder: group by similar durations or metadata patterns
    // For demo, return empty
    return [];
  }

  identifyBottlenecks(): Bottleneck[] {
    // Placeholder: identify steps with longest average duration
    // For demo, return empty
    return [];
  }

  analyzeErrorPatterns(): ErrorPattern[] {
    const errorMap: Record<string, { count: number; lastOccurred: Date }> = {};
    this.history.forEach(r => {
      if (r.status === 'failure' && r.errorType) {
        if (!errorMap[r.errorType]) {
          errorMap[r.errorType] = { count: 0, lastOccurred: r.timestamp };
        }
        errorMap[r.errorType].count++;
        if (r.timestamp > errorMap[r.errorType].lastOccurred) {
          errorMap[r.errorType].lastOccurred = r.timestamp;
        }
      }
    });

    return Object.entries(errorMap).map(([errorType, data]) => ({
      errorType,
      occurrences: data.count,
      lastOccurred: data.lastOccurred,
    }));
  }

  generateAutomatedInsights(): string[] {
    const insights: string[] = [];
    const trends = this.analyzeTrends();

    if (trends.failureRate > 0.1) {
      insights.push('High failure rate detected. Investigate error patterns.');
    }

    // Add more automated insights based on analysis

    return insights;
  }

  exportData(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.history, null, 2);
    } else if (format === 'csv') {
      const header = 'id,timestamp,durationMs,status,errorType';
      const rows = this.history.map(r =>
        [r.id, r.timestamp.toISOString(), r.durationMs, r.status, r.errorType || ''].join(',')
      );
      return [header, ...rows].join('\n');
    }
    throw new Error('Unsupported export format');
  }
}

export { ExecutionHistoryManager, ExecutionRecord };