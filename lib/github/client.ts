import { Octokit } from '@octokit/rest';
import type { Repository } from '@/types';

export class GitHubClient {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getRepositories(options: {
    type?: 'all' | 'owner' | 'public' | 'private';
    sort?: 'created' | 'updated' | 'pushed';
    perPage?: number;
  } = {}): Promise<Repository[]> {
    const { data: repos } = await this.octokit.repos.listForAuthenticatedUser({
      type: options.type || 'all',
      sort: options.sort || 'updated',
      per_page: options.perPage || 30,
      direction: 'desc',
    });

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      defaultBranch: repo.default_branch,
    }));
  }

  async createRepository(options: {
    name: string;
    description?: string;
    private?: boolean;
  }): Promise<Repository> {
    const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
      name: options.name,
      description: options.description || '',
      private: options.private || false,
      auto_init: true,
    });

    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      defaultBranch: repo.default_branch,
    };
  }

  async getRepository(owner: string, repo: string): Promise<Repository> {
    const { data } = await this.octokit.repos.get({ owner, repo });

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      private: data.private,
      htmlUrl: data.html_url,
      cloneUrl: data.clone_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      language: data.language,
      stargazersCount: data.stargazers_count,
      forksCount: data.forks_count,
      openIssuesCount: data.open_issues_count,
      defaultBranch: data.default_branch,
    };
  }
}
