# Contributing to SWARM

Thank you for your interest in contributing to SWARM! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to professional standards of conduct. Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.17+
- Docker and Docker Compose
- Git
- GitHub account

### Development Setup

```bash
# Clone repository
git clone https://github.com/UniversalStandards/SWARM.git
cd SWARM

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Commit Changes

```bash
git add .
git commit -m "type: descriptive commit message"
```

Commit message format:
```
type: subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use strict mode

### React Components

```typescript
// Functional components with TypeScript
import { FC } from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

export const Component: FC<Props> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click</button>
    </div>
  );
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Ensure responsive design

### Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders title', () => {
    render(<Component title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Pull Request Process

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] PR description clearly explains changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests passing
```

### Review Process

1. Automated checks must pass
2. At least one approving review required
3. All comments must be resolved
4. PR will be merged by maintainers

## Bug Reports

### Before Submitting

- Check existing issues
- Verify bug in latest version
- Collect reproduction steps

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS]
- Browser: [e.g., Chrome 120]
- SWARM Version: [e.g., 2.0.0]

**Additional context**
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description of problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives you've considered**
Other solutions considered

**Additional context**
Screenshots, examples, etc.
```

## Project Structure

```
SWARM/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/             # Core libraries
│   ├── store/           # State management
│   └── types/           # TypeScript types
├── tests/               # Test suites
├── docs/                # Documentation
└── public/              # Static assets
```

## Questions?

For questions about contributing:
- Open a GitHub Discussion
- Contact the development team
- Check existing documentation

Thank you for contributing to SWARM!

---

*US-SPURS Office of Research and Development*