import { logger } from '../logger';

export interface Artifact {
  id: string;
  executionId: string;
  nodeId: string;
  type: 'code' | 'document' | 'data' | 'image' | 'other';
  name: string;
  content: string | Buffer;
  mimeType: string;
  size: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

class ArtifactManager {
  private artifacts: Map<string, Artifact> = new Map();
  private maxSize = 100 * 1024 * 1024; // 100MB total
  private currentSize = 0;

  createArtifact(artifact: Omit<Artifact, 'id' | 'createdAt' | 'size'>): Artifact {
    const size = typeof artifact.content === 'string'
      ? Buffer.byteLength(artifact.content, 'utf8')
      : artifact.content.length;

    if (this.currentSize + size > this.maxSize) {
      throw new Error('Artifact storage limit exceeded');
    }

    const fullArtifact: Artifact = {
      ...artifact,
      id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      size,
      createdAt: new Date().toISOString(),
    };

    this.artifacts.set(fullArtifact.id, fullArtifact);
    this.currentSize += size;

    logger.info('Artifact created', {
      id: fullArtifact.id,
      type: fullArtifact.type,
      size: fullArtifact.size,
    });

    return fullArtifact;
  }

  getArtifact(id: string): Artifact | undefined {
    return this.artifacts.get(id);
  }

  listArtifacts(filter?: {
    executionId?: string;
    nodeId?: string;
    type?: Artifact['type'];
  }): Artifact[] {
    let artifacts = Array.from(this.artifacts.values());

    if (filter?.executionId) {
      artifacts = artifacts.filter(a => a.executionId === filter.executionId);
    }

    if (filter?.nodeId) {
      artifacts = artifacts.filter(a => a.nodeId === filter.nodeId);
    }

    if (filter?.type) {
      artifacts = artifacts.filter(a => a.type === filter.type);
    }

    return artifacts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  deleteArtifact(id: string): void {
    const artifact = this.artifacts.get(id);
    if (artifact) {
      this.currentSize -= artifact.size;
      this.artifacts.delete(id);
      logger.info('Artifact deleted', { id });
    }
  }

  clear(): void {
    this.artifacts.clear();
    this.currentSize = 0;
    logger.info('All artifacts cleared');
  }

  getStats() {
    return {
      totalArtifacts: this.artifacts.size,
      totalSize: this.currentSize,
      maxSize: this.maxSize,
      usagePercent: (this.currentSize / this.maxSize) * 100,
    };
  }
}

export const artifactManager = new ArtifactManager();
