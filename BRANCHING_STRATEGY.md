# SWARM Git Branching Strategy

## Branch Structure

The SWARM repository follows a **Git Flow** branching model optimized for federal compliance and production stability.

---

## 🌳 Core Branches

### **main** (Production)
- **Purpose**: Production-ready code only
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Auto-deploys to production environment
- **Merges From**: `staging`, `hotfix/*`
- **Direct Commits**: ❌ Never commit directly

### **staging** (Pre-Production)
- **Purpose**: Pre-production testing and validation
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Auto-deploys to staging environment
- **Merges From**: `development`, `hotfix/*`
- **Testing**: Full QA, integration tests, security scans

### **development** (Active Development)
- **Purpose**: Integration branch for all features
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Auto-deploys to development environment
- **Merges From**: `feature/*`, `bugfix/*`
- **Testing**: Unit tests, basic integration tests

---

## 🔀 Supporting Branches

### **feature/** (New Features)
- **Naming**: `feature/feature-name`
- **Examples**: 
  - `feature/parallel-execution-v2`
  - `feature/mcp-integration`
  - `feature/dragonfly-cache`
- **Branch From**: `development`
- **Merge To**: `development`
- **Lifetime**: Delete after merge
- **Purpose**: Develop new features in isolation

### **bugfix/** (Non-Critical Fixes)
- **Naming**: `bugfix/issue-description`
- **Examples**:
  - `bugfix/workflow-validation-error`
  - `bugfix/ui-rendering-issue`
- **Branch From**: `development`
- **Merge To**: `development`
- **Lifetime**: Delete after merge

### **hotfix/** (Critical Production Fixes)
- **Naming**: `hotfix/critical-issue`
- **Examples**:
  - `hotfix/security-vulnerability`
  - `hotfix/data-loss-prevention`
- **Branch From**: `main`
- **Merge To**: `main` AND `development`
- **Lifetime**: Delete after merge
- **Process**: Emergency fixes for production issues

### **release/** (Release Preparation)
- **Naming**: `release/v1.2.0`
- **Branch From**: `development`
- **Merge To**: `main` AND `development`
- **Purpose**: Final testing, version bumps, changelog updates
- **Lifetime**: Delete after merge

---

## 📋 Workflow Examples

### Creating a New Feature

```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/my-new-feature

# Work on feature
git add .
git commit -m "feat: add my new feature"

# Push to remote
git push origin feature/my-new-feature

# Create PR: feature/my-new-feature → development
```

### Creating a Hotfix

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the issue
git add .
git commit -m "fix: resolve critical bug"

# Push to remote
git push origin hotfix/critical-bug

# Create PR: hotfix/critical-bug → main
# After merge to main, also merge to development
```

### Release Process

```bash
# Create release branch from development
git checkout development
git pull origin development
git checkout -b release/v1.2.0

# Update version numbers, changelog
npm version minor
git add .
git commit -m "chore: prepare v1.2.0 release"

# Push to remote
git push origin release/v1.2.0

# Create PR: release/v1.2.0 → staging (test)
# After staging approval, create PR: release/v1.2.0 → main
# After main merge, merge back to development
```

---

## 🔒 Branch Protection Rules

### **main**
- ✅ Require pull request reviews (2 approvals)
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ✅ Require signed commits
- ✅ No force push
- ✅ No deletion

### **staging**
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ No force push

### **development**
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, semicolons)
- **refactor**: Code refactoring
- **perf**: Performance improvement
- **test**: Adding/updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples:
```bash
git commit -m "feat(workflow): add parallel execution support"
git commit -m "fix(auth): resolve OAuth token refresh issue"
git commit -m "docs(readme): update deployment instructions"
git commit -m "chore(deps): update dependencies to latest versions"
```

---

## 🚀 Deployment Pipeline

### Development Environment
- **Trigger**: Push to `development`
- **Deploy**: Auto-deploy to dev.swarm.internal
- **Tests**: Unit tests, linting

### Staging Environment
- **Trigger**: Push to `staging`
- **Deploy**: Auto-deploy to staging.swarm.internal
- **Tests**: Integration tests, E2E tests, security scans

### Production Environment
- **Trigger**: Push to `main`
- **Deploy**: Auto-deploy to swarm.internal (requires approval)
- **Tests**: Smoke tests, health checks

---

## 🗑️ Cleaning Up Old Branches

### Delete Merged Feature Branches
```bash
# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

### Prune Deleted Remote Branches
```bash
git fetch --prune
```

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Create feature | `git checkout -b feature/name development` |
| Create bugfix | `git checkout -b bugfix/name development` |
| Create hotfix | `git checkout -b hotfix/name main` |
| Create release | `git checkout -b release/v1.0.0 development` |
| Update from remote | `git pull origin branch-name` |
| Push changes | `git push origin branch-name` |
| Delete local branch | `git branch -d branch-name` |
| Delete remote branch | `git push origin --delete branch-name` |

---

## 📞 Questions?

For questions about the branching strategy, contact the SWARM development team or open an issue in the repository.

---

**Built with precision by US-SPURS** 🛡️
