import { Octokit } from "@octokit/rest";

export class GitHubIntegration {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(authToken: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: authToken });
    this.owner = owner;
    this.repo = repo;
  }

  async createBranch(branchName: string, fromBranch: string = "main") {
    // Get the SHA of the fromBranch
    const { data: refData } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${fromBranch}`,
    });

    const sha = refData.object.sha;

    // Create a new branch
    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });
  }

  async commitFiles(branchName: string, commitMessage: string, files: { path: string; content: string }[]) {
    // Get the latest commit on the branch
    const { data: refData } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branchName}`,
    });

    const latestCommitSha = refData.object.sha;

    // Get the commit object
    const { data: commitData } = await this.octokit.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: latestCommitSha,
    });

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data: blobData } = await this.octokit.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: file.content,
          encoding: "utf-8",
        });
        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blobData.sha,
        };
      })
    );

    // Create a new tree
    const { data: treeData } = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: commitData.tree.sha,
      tree: blobs,
    });

    // Create a new commit
    const { data: newCommit } = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: treeData.sha,
      parents: [latestCommitSha],
    });

    // Update the branch to point to the new commit
    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branchName}`,
      sha: newCommit.sha,
    });
  }

  async createPullRequest(title: string, head: string, base: string = "main", body?: string) {
    const { data: pr } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      head,
      base,
      body,
    });
    return pr;
  }

  async uploadArtifact(branchName: string, artifactPath: string, artifactContent: string, commitMessage: string) {
    // Commit the artifact file to the branch
    await this.commitFiles(branchName, commitMessage, [
      { path: artifactPath, content: artifactContent },
    ]);
  }
}
