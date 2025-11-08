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

    // Calculate trends over time (last 24 hours, 7 days, 30 days)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const last24h = this.history.filter(r => r.timestamp >= oneDayAgo);
    const last7d = this.history.filter(r => r.timestamp >= sevenDaysAgo);
    const last30d = this.history.filter(r => r.timestamp >= thirtyDaysAgo);

    return {
      averageDuration: totalDuration / total,
      successRate: successCount / total,
      failureRate: failureCount / total,
      trends: {
        last24Hours: {
          count: last24h.length,
          successRate: last24h.filter(r => r.status === 'success').length / (last24h.length || 1),
          avgDuration: last24h.reduce((acc, r) => acc + r.durationMs, 0) / (last24h.length || 1),
        },
        last7Days: {
          count: last7d.length,
          successRate: last7d.filter(r => r.status === 'success').length / (last7d.length || 1),
          avgDuration: last7d.reduce((acc, r) => acc + r.durationMs, 0) / (last7d.length || 1),
        },
        last30Days: {
          count: last30d.length,
          successRate: last30d.filter(r => r.status === 'success').length / (last30d.length || 1),
          avgDuration: last30d.reduce((acc, r) => acc + r.durationMs, 0) / (last30d.length || 1),
        },
      },
    };
  }

  identifyPerformancePatterns(): PerformancePattern[] {
    if (this.history.length === 0) return [];

    // Group executions by duration ranges
    const patterns: Map<string, { count: number; totalDuration: number }> = new Map();
    
    this.history.forEach(record => {
      const durationCategory = this.categorizeDuration(record.durationMs);
      const existing = patterns.get(durationCategory) || { count: 0, totalDuration: 0 };
      patterns.set(durationCategory, {
        count: existing.count + 1,
        totalDuration: existing.totalDuration + record.durationMs,
      });
    });

    return Array.from(patterns.entries()).map(([patternName, data]) => ({
      patternName,
      occurrences: data.count,
      averageDuration: data.totalDuration / data.count,
    }));
  }

  private categorizeDuration(durationMs: number): string {
    if (durationMs < 1000) return 'Very Fast (<1s)';
    if (durationMs < 5000) return 'Fast (1-5s)';
    if (durationMs < 15000) return 'Medium (5-15s)';
    if (durationMs < 60000) return 'Slow (15-60s)';
    return 'Very Slow (>60s)';
  }

  identifyBottlenecks(): Bottleneck[] {
    if (this.history.length === 0) return [];

    // Group by metadata.step if available
    const stepMap: Map<string, { count: number; totalDuration: number }> = new Map();
    
    this.history.forEach(record => {
      const step = record.metadata?.step || 'unknown';
      const existing = stepMap.get(step) || { count: 0, totalDuration: 0 };
      stepMap.set(step, {
        count: existing.count + 1,
        totalDuration: existing.totalDuration + record.durationMs,
      });
    });

    const bottlenecks = Array.from(stepMap.entries())
      .map(([step, data]) => ({
        step,
        averageDuration: data.totalDuration / data.count,
        occurrences: data.count,
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration);

    // Return top 5 bottlenecks
    return bottlenecks.slice(0, 5);
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

export { ExecutionHistoryManager };
export type { ExecutionRecord };