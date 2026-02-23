import { Octokit } from '@octokit/rest';
import { logger } from '../logger';

export interface GitHubCommitOptions {
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  token: string;
}

export interface GitHubPROptions {
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string;
  base: string;
  token: string;
}

export class GitHubIntegration {
  async createCommit(options: GitHubCommitOptions): Promise<string> {
    try {
      const octokit = new Octokit({ auth: options.token });

      logger.info('Creating GitHub commit', {
        repo: `${options.owner}/${options.repo}`,
        branch: options.branch,
        fileCount: options.files.length,
      });

      // Get the current commit SHA
      const { data: refData } = await octokit.git.getRef({
        owner: options.owner,
        repo: options.repo,
        ref: `heads/${options.branch}`,
      });
      const currentCommitSha = refData.object.sha;

      // Get the tree SHA
      const { data: commitData } = await octokit.git.getCommit({
        owner: options.owner,
        repo: options.repo,
        commit_sha: currentCommitSha,
      });
      const treeSha = commitData.tree.sha;

      // Create blobs for each file
      const blobs = await Promise.all(
        options.files.map(async (file) => {
          const { data } = await octokit.git.createBlob({
            owner: options.owner,
            repo: options.repo,
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64',
          });
          return {
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: data.sha,
          };
        })
      );

      // Create a new tree
      const { data: newTree } = await octokit.git.createTree({
        owner: options.owner,
        repo: options.repo,
        base_tree: treeSha,
        tree: blobs,
      });

      // Create a new commit
      const { data: newCommit } = await octokit.git.createCommit({
        owner: options.owner,
        repo: options.repo,
        message: options.message,
        tree: newTree.sha,
        parents: [currentCommitSha],
      });

      // Update the reference
      await octokit.git.updateRef({
        owner: options.owner,
        repo: options.repo,
        ref: `heads/${options.branch}`,
        sha: newCommit.sha,
      });

      logger.info('GitHub commit created', {
        sha: newCommit.sha,
      });

      return newCommit.sha;
    } catch (error) {
      logger.error('Failed to create GitHub commit', error as Error);
      throw error;
    }
  }

  async createPullRequest(options: GitHubPROptions): Promise<number> {
    try {
      const octokit = new Octokit({ auth: options.token });

      logger.info('Creating GitHub pull request', {
        repo: `${options.owner}/${options.repo}`,
        head: options.head,
        base: options.base,
      });

      const { data } = await octokit.pulls.create({
        owner: options.owner,
        repo: options.repo,
        title: options.title,
        body: options.body,
        head: options.head,
        base: options.base,
      });

      logger.info('GitHub pull request created', {
        number: data.number,
        url: data.html_url,
      });

      return data.number;
    } catch (error) {
      logger.error('Failed to create GitHub pull request', error as Error);
      throw error;
    }
  }

  async addCommentToPR(
    owner: string,
    repo: string,
    prNumber: number,
    comment: string,
    token: string
  ): Promise<void> {
    try {
      const octokit = new Octokit({ auth: token });

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: comment,
      });

      logger.info('Comment added to PR', { prNumber });
    } catch (error) {
      logger.error('Failed to add comment to PR', error as Error);
      throw error;
    }
  }
}

export const githubIntegration = new GitHubIntegration();
