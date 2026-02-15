import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Octokit } from '@octokit/rest';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No GitHub token found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const sort = searchParams.get('sort') || 'updated';
    const per_page = Number(searchParams.get('per_page')) || 30;

    const octokit = new Octokit({
      auth: session.accessToken,
    });

    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      type: type as 'all' | 'owner' | 'public' | 'private' | 'member',
      sort: sort as 'created' | 'updated' | 'pushed' | 'full_name',
      per_page,
      direction: 'desc',
    });

    const formattedRepos = repos.map((repo) => ({
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

    return NextResponse.json({
      success: true,
      repositories: formattedRepos,
      count: formattedRepos.length,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch repositories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, private: isPrivate } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    });

    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name,
      description: description || '',
      private: isPrivate || false,
      auto_init: true,
    });

    return NextResponse.json({
      success: true,
      repository: {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
      },
    });
  } catch (error) {
    console.error('GitHub Repo Creation Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create repository',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
