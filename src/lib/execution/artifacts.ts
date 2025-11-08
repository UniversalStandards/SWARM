// ArtifactManager class to manage execution artifacts including storage, retrieval, versioning, and viewing
// Supports multiple artifact types: code, documents, data, images, reports, logs, config, analysis, visualizations

interface Artifact {
  id: string;
  type: string; // e.g., 'code', 'document', 'data', 'image', 'report', 'log', 'config', 'analysis', 'visualization'
  content: any; // Could be string, object, binary data, etc.
  version: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

class ArtifactManager {
  private artifacts: Map<string, Artifact[]> = new Map();

  // Store a new artifact or a new version of an existing artifact
  storeArtifact(id: string, type: string, content: any, metadata?: Record<string, any>): Artifact {
    const now = new Date();
    let versions = this.artifacts.get(id) || [];
    const newVersion = versions.length > 0 ? versions[versions.length - 1].version + 1 : 1;
    const artifact: Artifact = {
      id,
      type,
      content,
      version: newVersion,
      createdAt: versions.length > 0 ? versions[0].createdAt : now,
      updatedAt: now,
      metadata,
    };
    versions.push(artifact);
    this.artifacts.set(id, versions);
    return artifact;
  }

  // Retrieve the latest version of an artifact by id
  getArtifact(id: string): Artifact | undefined {
    const versions = this.artifacts.get(id);
    if (!versions || versions.length === 0) return undefined;
    return versions[versions.length - 1];
  }

  // Retrieve a specific version of an artifact
  getArtifactVersion(id: string, version: number): Artifact | undefined {
    const versions = this.artifacts.get(id);
    if (!versions) return undefined;
    return versions.find(a => a.version === version);
  }

  // List all versions of an artifact
  listArtifactVersions(id: string): Artifact[] {
    return this.artifacts.get(id) || [];
  }

  // View artifact content (could be extended to support different rendering based on type)
  viewArtifact(id: string, version?: number): any {
    if (version !== undefined) {
      const artifact = this.getArtifactVersion(id, version);
      if (!artifact) throw new Error(`Artifact version ${version} not found for id ${id}`);
      return artifact.content;
    } else {
      const artifact = this.getArtifact(id);
      if (!artifact) throw new Error(`Artifact not found for id ${id}`);
      return artifact.content;
    }
  }

  // Delete an artifact and all its versions
  deleteArtifact(id: string): boolean {
    return this.artifacts.delete(id);
  }

  // List all artifact ids
  listArtifactIds(): string[] {
    return Array.from(this.artifacts.keys());
  }
}

export { ArtifactManager };
export type { Artifact };