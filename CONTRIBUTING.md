# Contributing to PROJECT SWARM

Thanks for helping build a multi-agent system that is **debuggable**, **auditable**, and **useful**.

## Development setup
    1. Fork the repo
    2. Create a branch: `git checkout -b feat/<short-name>`
    3. Make changes with tests
    4. Open a PR

## Pull request expectations
    1. Clear description of what changed and why
    2. Tests included (or explanation if not applicable)
    3. No secrets committed (CI will check)
    4. Any new tool adapter includes policy tags and safe defaults

## Style
    1. Prefer explicit types/schemas
        a. JSON Schema or typed dataclasses are fine
    2. Avoid magic prompts buried in code
        a. Keep prompts/config versioned in files
    3. Log structured events
        a. No printf archaeology

## Security
Report vulnerabilities privately. See `SECURITY.md`.
