# GitHub-Native AI Agent Examples

This directory contains example workflows and agent configurations for the GitHub-Native AI Agent Swarm Orchestrator.

## 📁 Directory Structure

```
examples/
├── workflows/          # Example workflow configurations
│   ├── simple-ai-task.json
│   ├── data-pipeline.json
│   ├── parallel-execution.json
│   └── code-generation-workflow.json
└── agents/            # Custom agent examples
    └── (agent configurations)
```

## 🚀 Using Examples

### Method 1: Via GitHub Issues

1. Go to **Issues** → **New Issue**
2. Select **"🤖 Agent Task"** or **"🔄 Multi-Agent Workflow"** template
3. Copy the content from any example JSON file
4. Paste into the **Task Configuration** field
5. Submit the issue

### Method 2: Via Workflow Dispatch

1. Go to **Actions** → **AI Agent Orchestrator**
2. Click **Run workflow**
3. Provide the workflow configuration as JSON input

### Method 3: Via GitHub API

```bash
# Create an issue with the workflow configuration
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "[Agent Task] Example Workflow",
    "body": "```json\n' + cat examples/workflows/simple-ai-task.json + '\n```",
    "labels": ["agent-task"]
  }' \
  https://api.github.com/repos/OWNER/REPO/issues
```

## 📖 Example Workflows

### 1. Simple AI Task (`simple-ai-task.json`)

**Purpose**: Basic AI-powered text analysis

**Features**:
- Single AI task execution
- Sentiment analysis
- Direct AI model invocation

**Use Cases**:
- Quick AI queries
- Simple analysis tasks
- Testing AI integration

### 2. Data Pipeline (`data-pipeline.json`)

**Purpose**: Multi-stage data processing with AI analysis

**Features**:
- Data fetching and validation
- Conditional execution
- Data transformation
- AI-powered analysis
- Report generation
- Pull request creation

**Use Cases**:
- ETL operations
- Data quality checks
- Automated reporting
- Analytics pipelines

### 3. Parallel Execution (`parallel-execution.json`)

**Purpose**: Concurrent execution of multiple AI tasks

**Features**:
- Parallel task execution
- Multiple AI models simultaneously
- Result aggregation
- Multi-dimensional analysis

**Use Cases**:
- Comprehensive text analysis
- Multi-model comparisons
- Distributed processing
- Time-sensitive operations

### 4. Code Generation Workflow (`code-generation-workflow.json`)

**Purpose**: End-to-end code generation, review, and deployment

**Features**:
- Requirements parsing
- Code generation
- AI code review
- Code refinement
- Test generation
- Branch creation
- Pull request with full documentation

**Use Cases**:
- Rapid prototyping
- Boilerplate generation
- API endpoint creation
- Component scaffolding

## 🛠️ Customizing Examples

### Modify AI Models

```json
{
  "type": "ai-task",
  "config": {
    "model": "gpt-4",          // Change to: claude-3-opus, gemini-pro, etc.
    "maxTokens": 2000,         // Adjust token limit
    "temperature": 0.7         // Control randomness (0.0 - 1.0)
  }
}
```

### Add Conditional Logic

```json
{
  "id": "check-condition",
  "type": "condition",
  "config": {
    "condition": "context.variables.score > 0.8"
  }
}
```

### Configure Parallel Tasks

```json
{
  "id": "parallel-node",
  "type": "parallel",
  "config": {
    "tasks": [
      { "type": "ai-task", "config": { ... } },
      { "type": "agent", "config": { ... } }
    ]
  }
}
```

### Add GitHub Actions

```json
{
  "id": "github-action",
  "type": "github-action",
  "config": {
    "action": "create-pr|create-issue|add-comment",
    "title": "...",
    "body": "..."
  }
}
```

## 📝 Creating Custom Workflows

### Basic Template

```json
{
  "name": "My Custom Workflow",
  "description": "Description of what this workflow does",
  "nodes": [
    {
      "id": "unique-node-id",
      "type": "agent|ai-task|condition|parallel|github-action",
      "config": {
        // Node-specific configuration
      }
    }
  ],
  "edges": [
    {
      "from": "source-node-id",
      "to": "target-node-id"
    }
  ]
}
```

### Node Types Reference

| Type | Description | Config Fields |
|------|-------------|---------------|
| `agent` | Execute agent task | `agentType`, `task`, custom fields |
| `ai-task` | Run AI model | `prompt`, `model`, `maxTokens`, `temperature` |
| `condition` | Conditional branch | `condition` (JavaScript expression) |
| `parallel` | Concurrent execution | `tasks` (array of task configs) |
| `github-action` | GitHub operation | `action`, action-specific fields |

### Agent Types

- `worker` - General task execution
- `manager` - Task coordination
- `orchestrator` - Workflow management
- `ai-assistant` - AI-powered tasks
- `code-generator` - Code generation
- `data-processor` - Data operations

## 🎯 Best Practices

### 1. Start Simple
Begin with single-node workflows and gradually add complexity.

### 2. Use Descriptive IDs
```json
{
  "id": "fetch-user-data",  // Good
  "id": "node1"              // Avoid
}
```

### 3. Add Validation Steps
Include condition nodes to validate data before processing.

### 4. Store Intermediate Results
Use GitHub Actions to store important intermediate outputs.

### 5. Handle Errors Gracefully
Consider adding error recovery nodes in critical workflows.

### 6. Document Your Workflows
Include clear descriptions and expected inputs/outputs.

## 🔍 Debugging

### View Execution Logs
1. Go to **Actions** tab
2. Find your workflow run
3. Review step-by-step logs

### Check Execution Results
```bash
# Fetch execution branch
git fetch origin execution/<run-id>
git checkout execution/<run-id>

# View results
cat .github/executions/<run-id>/results.json
```

### Common Issues

**Issue**: Workflow doesn't start
- Check that issue has `agent-task` label
- Verify workflow configuration is valid JSON

**Issue**: Node fails to execute
- Check node type is supported
- Verify all required config fields are present
- Review AI API key configuration

**Issue**: AI task returns empty response
- Increase `maxTokens` limit
- Check API key is valid
- Verify prompt is well-formatted

## 📚 Additional Resources

- [Main Documentation](../GITHUB-NATIVE-README.md)
- [Architecture Guide](../wiki/Architecture)
- [API Reference](../wiki/API-Reference)
- [Troubleshooting](../wiki/Troubleshooting)

## 🤝 Contributing

Have a useful workflow example? Submit a PR!

1. Add your workflow JSON to `examples/workflows/`
2. Update this README with description
3. Test the workflow
4. Submit PR with label `example-workflow`

---

**Happy Orchestrating! 🤖**
