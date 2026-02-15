# Contributing to SWARM

Thank you for your interest in contributing to SWARM! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. **Check existing feature requests**
2. **Create a new issue** with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add feature: description"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots for UI changes

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/SWARM.git
cd SWARM

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper types or `unknown`
- Export types and interfaces for reusability

### Code Style

- Follow existing code formatting
- Use ESLint and Prettier configurations
- Run linting before committing:
  ```bash
  npm run lint
  ```

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Document complex logic with comments

### Git Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add parallel execution node type

Implements parallel execution workflow node that allows
multiple agents to run simultaneously.

Closes #123
```

## Project Structure

```
SWARM/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard pages
│   └── workflows/     # Workflow pages
├── components/        # React components
│   ├── ui/           # UI components
│   ├── workflow/     # Workflow components
│   └── agents/       # Agent components
├── lib/              # Utility libraries
│   ├── ai/          # AI provider integrations
│   ├── github/      # GitHub client
│   └── utils.ts     # Helper functions
├── store/           # State management
├── types/           # TypeScript types
└── public/          # Static assets
```

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for >80% code coverage

### Integration Tests

- Test component interactions
- Test API endpoints
- Test workflow execution

### E2E Tests

- Test critical user flows
- Test authentication
- Test workflow creation and execution

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for system changes
- Add JSDoc comments for public APIs
- Include code examples where helpful

## Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code review** by maintainers:
   - Code quality
   - Test coverage
   - Documentation
   - Performance

3. **Approval** from at least one maintainer

4. **Merge** by maintainers

## Questions?

Feel free to:
- Open an issue for questions
- Join our discussions
- Reach out to maintainers

Thank you for contributing to SWARM!
