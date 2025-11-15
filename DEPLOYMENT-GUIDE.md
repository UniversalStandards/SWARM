# 🚀 GitHub-Native AI Agent Orchestrator - Deployment Guide

## Quick Start (5 Minutes)

### Step 1: Enable GitHub Actions

1. Go to your repository **Settings**
2. Navigate to **Actions** → **General**
3. Select **Allow all actions and reusable workflows**
4. Click **Save**

### Step 2: Configure Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets (optional but recommended):

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models | For OpenAI tasks |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | For Anthropic tasks |
| `GOOGLE_AI_API_KEY` | Google AI API key for Gemini | For Google tasks |

> **Note**: The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### Step 3: Test the System

Create your first agent task:

1. Go to **Issues** → **New Issue**
2. Select **"🤖 Agent Task"** template
3. Fill in:
   - **Agent Type**: `ai-assistant`
   - **Priority**: `medium`
   - **Task Description**: "Test the orchestrator"
   - **Task Configuration**:
   ```json
   {
     "nodes": [
       {
         "id": "test",
         "type": "ai-task",
         "config": {
           "prompt": "Say hello and confirm the system is working",
           "model": "gpt-4"
         }
       }
     ],
     "edges": []
   }
   ```
4. Submit the issue
5. Watch the orchestrator run in the **Actions** tab!

## Detailed Setup

### Prerequisites

- GitHub repository with admin access
- GitHub Actions enabled
- (Optional) API keys for AI services

### Installation Steps

#### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/UniversalStandards/SWARM.git
cd SWARM

# Verify files are present
ls -la .github/workflows/
ls -la .github/scripts/
```

#### 2. Configure GitHub Actions Permissions

Ensure workflows have necessary permissions:

1. **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

#### 3. Enable GitHub Projects (Optional)

For workflow visualization:

1. Go to repository **Projects** tab
2. Click **New project**
3. Name it "AI Agent Orchestration"
4. Select **Board** template
5. Create columns:
   - Pending
   - Running
   - Completed
   - Failed

#### 4. Configure AI Services

##### OpenAI Setup

1. Get API key from https://platform.openai.com/api-keys
2. Add to repository secrets as `OPENAI_API_KEY`

##### Anthropic Setup

1. Get API key from https://console.anthropic.com/
2. Add to repository secrets as `ANTHROPIC_API_KEY`

##### Google AI Setup

1. Get API key from https://makersuite.google.com/app/apikey
2. Add to repository secrets as `GOOGLE_AI_API_KEY`

## Verification

### Test Workflow Trigger

```bash
# Create a test issue via GitHub CLI
gh issue create \
  --title "[Agent Task] System Test" \
  --body '```json
{
  "nodes": [
    {
      "id": "hello",
      "type": "ai-task",
      "config": {
        "prompt": "Say hello!",
        "model": "gpt-4"
      }
    }
  ],
  "edges": []
}
```' \
  --label "agent-task"
```

### Check Workflow Execution

1. Go to **Actions** tab
2. Find "AI Agent Orchestrator" workflow
3. Verify it's running
4. Check the logs for execution details

### Verify Issue Updates

The orchestrator will:
1. Add labels: `status:running`, `orchestrator:active`
2. Post a comment with run details
3. Update labels to `status:completed` on success
4. Close the issue automatically

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Repository                       │
│                                                          │
│  ┌────────────┐     ┌──────────────┐                   │
│  │  Issue     │────▶│  Workflow    │                   │
│  │  (Trigger) │     │  Dispatcher  │                   │
│  └────────────┘     └──────┬───────┘                   │
│                            │                            │
│                            ▼                            │
│                    ┌───────────────┐                    │
│                    │ Orchestrator  │                    │
│                    │    Script     │                    │
│                    └───────┬───────┘                    │
│                            │                            │
│         ┌──────────────────┼──────────────────┐        │
│         ▼                  ▼                  ▼         │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐     │
│  │  Agent   │      │  Agent   │      │  Agent   │     │
│  │ Worker 1 │      │ Worker 2 │      │ Worker 3 │     │
│  └──────────┘      └──────────┘      └──────────┘     │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘        │
│                            ▼                            │
│                    ┌───────────────┐                    │
│                    │   Results     │                    │
│                    │  Collection   │                    │
│                    └───────┬───────┘                    │
│                            │                            │
│         ┌──────────────────┼──────────────────┐        │
│         ▼                  ▼                  ▼         │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐     │
│  │  Issue   │      │  Branch  │      │  Project │     │
│  │ Comment  │      │ Artifact │      │   Board  │     │
│  └──────────┘      └──────────┘      └──────────┘     │
└─────────────────────────────────────────────────────────┘
```

## Components

### GitHub Actions Workflows

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `agent-orchestrator.yml` | Main orchestration engine | Issue with `agent-task` label |
| `agent-worker.yml` | Individual agent execution | Called by orchestrator |
| `project-sync.yml` | Sync to GitHub Projects | Issue updates |
| `workflow-visualizer.yml` | Generate diagrams | Issue creation |
| `copilot-integration.yml` | AI assistance | `@copilot` mention |
| `health-monitor.yml` | System monitoring | Schedule (every 6h) |
| `discussion-notifier.yml` | Post to Discussions | Workflow completion |

### Scripts

| Script | Purpose |
|--------|---------|
| `orchestrate.js` | Main orchestration logic |
| `agent-executor.js` | Agent execution handlers |
| `wiki-generator.js` | Wiki documentation generator |

### Issue Templates

| Template | Purpose |
|----------|---------|
| `agent-task.yml` | Single agent task |
| `workflow-template.yml` | Multi-agent workflow |

## Configuration

### Environment Variables

Available in workflow steps:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}        # Auto-provided
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}    # Optional
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}  # Optional
  GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}  # Optional
```

### Workflow Permissions

Required permissions in workflows:

```yaml
permissions:
  issues: write           # Create/update issues
  contents: write         # Create branches
  pull-requests: write    # Create PRs
  discussions: write      # Post discussions (optional)
  projects: write         # Update projects (optional)
```

## Troubleshooting

### Issue: Workflow Doesn't Trigger

**Problem**: Issue created but no workflow runs

**Solutions**:
1. Verify issue has `agent-task` label
2. Check Actions are enabled in repository settings
3. Verify workflow file is in `main` branch
4. Check workflow syntax with `yamllint`

### Issue: AI Tasks Fail

**Problem**: AI tasks return errors

**Solutions**:
1. Verify API key is set correctly in secrets
2. Check API key has credits/quota
3. Verify model name is correct
4. Check prompt isn't too long for model

### Issue: Permission Denied

**Problem**: Workflow fails with permission errors

**Solutions**:
1. Enable read/write permissions in Actions settings
2. Check workflow permissions block
3. Verify `GITHUB_TOKEN` has necessary scopes

### Issue: Node Execution Fails

**Problem**: Specific node type fails

**Solutions**:
1. Check node type is supported
2. Verify all required config fields are present
3. Review logs in Actions tab
4. Check for syntax errors in configuration JSON

## Advanced Configuration

### Custom Agent Types

Add custom agents in `.github/scripts/agent-executor.js`:

```javascript
async function executeCustomAgent(task, results) {
  console.log('Executing custom agent...');
  
  // Your custom logic here
  
  results.output = 'Custom agent result';
  results.logs.push('Custom agent completed');
}
```

### Workflow Hooks

Add pre/post execution hooks in orchestrator:

```javascript
// Pre-execution hook
async function beforeExecution(context) {
  // Setup logic
}

// Post-execution hook
async function afterExecution(context) {
  // Cleanup logic
}
```

### Custom Visualizations

Modify visualization in `workflow-visualizer.yml`:

```yaml
- name: Generate Custom Diagram
  run: |
    # Your custom diagram generation
    # Can use Mermaid, GraphViz, etc.
```

## Monitoring

### View System Health

Check the health monitor dashboard:

1. Go to **Actions** → **System Health Monitor**
2. Click on latest run
3. Review metrics and recommendations

### View Execution Metrics

```bash
# Get recent executions
gh run list --workflow="AI Agent Orchestrator" --limit 20

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### Track Success Rates

The health monitor automatically tracks:
- Total executions
- Success rate
- Average duration
- Active tasks
- Failure patterns

## Best Practices

### 1. Start Small

Begin with simple single-node workflows and gradually add complexity.

### 2. Test Locally

Test workflow JSON configurations before submitting:

```bash
# Validate JSON
jq . workflow.json

# Check for syntax errors
node -c .github/scripts/orchestrate.js
```

### 3. Monitor Resources

- Check GitHub Actions minutes usage
- Monitor AI API costs
- Review execution durations

### 4. Use Labels Effectively

Organize tasks with descriptive labels:
- `agent:worker`, `agent:ai-assistant`, etc.
- `priority:high`, `priority:low`, etc.
- `workflow`, `parallel`, etc.

### 5. Document Workflows

Add clear descriptions in issue bodies explaining:
- What the workflow does
- Expected inputs
- Expected outputs
- Success criteria

## Support

### Getting Help

1. Check [Troubleshooting Guide](#troubleshooting)
2. Review [GitHub-Native README](GITHUB-NATIVE-README.md)
3. Check [Examples](examples/)
4. Open an issue with label `help-wanted`

### Contributing

Contributions welcome! See [Contributing Guidelines](docs/contributing.md)

## Next Steps

1. ✅ Complete deployment
2. 📝 Create your first workflow
3. 🎨 Enable visualization
4. 📊 Set up monitoring
5. 🚀 Scale to production

---

**🎉 Congratulations! Your GitHub-Native AI Agent Orchestrator is ready!**

*Start creating powerful multi-agent workflows entirely on GitHub infrastructure.*
