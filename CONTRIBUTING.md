# Contributing to PROJECT SWARM

Thanks for helping build a multi-agent system that is *debuggable*, *auditable*, and *useful*.

## Development setup
1. Fork the repo
2. Create a branch: `git checkout -b feat/<short-name>`
3. Make changes with tests
4. Open a PR

## Pull request expectations
- Clear description of what changed and why
- Tests included (or explanation if not applicable)
- No secrets committed (CI will check)
- Any new tool adapter includes policy tags and safe defaults

## Style
- Prefer explicit types/schemas
- Avoid magic prompts buried in code; keep prompts/config versioned in files
- Log structured events; no printf archaeology

## Security
Report vulnerabilities privately. See `SECURITY.md`.
