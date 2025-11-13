#!/usr/bin/env node

/**
 * GitHub Wiki Generator
 * Automatically generates wiki pages from execution results
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// Initialize GitHub client
function initGitHub() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
}

// Generate wiki page for execution
async function generateExecutionPage(executionData, octokit) {
  const { runId, status, startTime, endTime, nodes, logs, artifacts } = executionData;
  
  const duration = new Date(endTime) - new Date(startTime);
  const durationMinutes = (duration / 1000 / 60).toFixed(2);
  
  // Generate markdown content
  let content = `# Execution Run ${runId}

## Overview

| Property | Value |
|----------|-------|
| **Run ID** | ${runId} |
| **Status** | ${status} |
| **Start Time** | ${new Date(startTime).toLocaleString()} |
| **End Time** | ${new Date(endTime).toLocaleString()} |
| **Duration** | ${durationMinutes} minutes |

## Workflow Execution

### Nodes Executed

${nodes.map((node, index) => `
#### ${index + 1}. ${node.id}

- **Type**: ${node.type || 'unknown'}
- **Status**: ${node.status}
${node.error ? `- **Error**: ${node.error}` : ''}
`).join('\n')}

## Artifacts

${artifacts && artifacts.length > 0 ? artifacts.map(artifact => `
- **${artifact.name}**: [View](${artifact.url})
`).join('\n') : 'No artifacts generated'}

## Execution Logs

\`\`\`
${logs ? logs.slice(-50).map(log => `[${log.timestamp}] ${log.level}: ${log.message}`).join('\n') : 'No logs available'}
\`\`\`

## Timeline

\`\`\`mermaid
gantt
    title Execution Timeline
    dateFormat YYYY-MM-DD HH:mm:ss
    section Execution
${nodes.map(node => `    ${node.id} : ${node.status === 'completed' ? 'done' : 'active'}, ${node.id}, ${startTime}, ${endTime}`).join('\n')}
\`\`\`

## Statistics

- **Total Nodes**: ${nodes.length}
- **Successful**: ${nodes.filter(n => n.status === 'completed').length}
- **Failed**: ${nodes.filter(n => n.status === 'failed').length}
- **Success Rate**: ${((nodes.filter(n => n.status === 'completed').length / nodes.length) * 100).toFixed(1)}%

---

*Generated automatically by AI Agent Orchestrator*
*Generated at: ${new Date().toISOString()}*
`;

  return content;
}

// Generate agent types documentation
async function generateAgentTypesPage() {
  return `# Agent Types Reference

## Overview

The AI Agent Swarm Orchestrator supports multiple agent types, each specialized for different tasks.

## Available Agent Types

### 1. Worker Agent

**Type**: \`worker\`

**Description**: General-purpose task execution agent for basic operations.

**Use Cases**:
- Simple data processing
- File operations
- API calls
- Basic transformations

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "worker",
    "task": "Process data",
    "parameters": {}
  }
}
\`\`\`

### 2. Manager Agent

**Type**: \`manager\`

**Description**: Coordinates and manages multiple worker agents.

**Use Cases**:
- Multi-task coordination
- Resource allocation
- Load balancing
- Task delegation

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "manager",
    "subTasks": [
      { "task": "Task 1" },
      { "task": "Task 2" }
    ]
  }
}
\`\`\`

### 3. Orchestrator Agent

**Type**: \`orchestrator\`

**Description**: High-level workflow management and planning.

**Use Cases**:
- Complex workflow planning
- Multi-stage pipelines
- Conditional execution
- Error recovery

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "orchestrator",
    "workflow": "complex-pipeline",
    "stages": ["fetch", "process", "analyze"]
  }
}
\`\`\`

### 4. AI Assistant Agent

**Type**: \`ai-assistant\`

**Description**: AI-powered task execution using language models.

**Use Cases**:
- Text analysis
- Content generation
- Question answering
- Data insights

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "ai-assistant",
    "prompt": "Analyze the sentiment",
    "model": "gpt-4"
  }
}
\`\`\`

### 5. Code Generator Agent

**Type**: \`code-generator\`

**Description**: Generates code based on specifications.

**Use Cases**:
- Boilerplate generation
- API endpoint creation
- Component scaffolding
- Test generation

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "code-generator",
    "language": "typescript",
    "specification": "Create REST API endpoint"
  }
}
\`\`\`

### 6. Data Processor Agent

**Type**: \`data-processor\`

**Description**: Specialized in data transformation and processing.

**Use Cases**:
- ETL operations
- Data validation
- Format conversion
- Data enrichment

**Configuration Example**:
\`\`\`json
{
  "type": "agent",
  "config": {
    "agentType": "data-processor",
    "operation": "transform",
    "transformations": ["normalize", "validate"]
  }
}
\`\`\`

## Creating Custom Agents

You can create custom agent types by extending the agent executor:

1. Add your agent type to \`.github/scripts/agent-executor.js\`
2. Implement the execution logic
3. Use it in workflows with type \`custom\`

---

*For more information, see [Workflow Configuration](Workflow-Configuration)*
`;
}

// Generate workflow best practices page
async function generateBestPracticesPage() {
  return `# Workflow Best Practices

## General Guidelines

### 1. Start Simple

Begin with single-node workflows and gradually increase complexity:

\`\`\`json
{
  "nodes": [
    {
      "id": "simple-task",
      "type": "ai-task",
      "config": {
        "prompt": "Simple query",
        "model": "gpt-4"
      }
    }
  ],
  "edges": []
}
\`\`\`

### 2. Use Descriptive Node IDs

✅ **Good**:
\`\`\`json
{ "id": "fetch-user-data" }
\`\`\`

❌ **Avoid**:
\`\`\`json
{ "id": "node1" }
\`\`\`

### 3. Add Validation Steps

Include condition nodes to validate data:

\`\`\`json
{
  "id": "validate",
  "type": "condition",
  "config": {
    "condition": "context.variables.data && context.variables.data.valid"
  }
}
\`\`\`

### 4. Handle Errors Gracefully

Consider adding error recovery:

\`\`\`json
{
  "nodes": [
    { "id": "main-task", "type": "agent" },
    { "id": "error-handler", "type": "condition" },
    { "id": "retry", "type": "agent" }
  ],
  "edges": [
    { "from": "main-task", "to": "error-handler" },
    { "from": "error-handler", "to": "retry" }
  ]
}
\`\`\`

## Performance Optimization

### Use Parallel Execution

For independent tasks:

\`\`\`json
{
  "type": "parallel",
  "config": {
    "tasks": [
      { "type": "ai-task", "config": { ... } },
      { "type": "agent", "config": { ... } }
    ]
  }
}
\`\`\`

### Limit AI Token Usage

Set appropriate token limits:

\`\`\`json
{
  "config": {
    "maxTokens": 1000,  // Adjust based on needs
    "temperature": 0.7
  }
}
\`\`\`

### Cache Results

Store intermediate results:

\`\`\`json
{
  "type": "github-action",
  "config": {
    "action": "create-branch",
    "branchName": "cache-{{timestamp}}"
  }
}
\`\`\`

## Security Best Practices

### 1. Protect Sensitive Data

- Store API keys in GitHub Secrets
- Never include secrets in workflow configurations
- Use environment variables for sensitive data

### 2. Validate Inputs

Always validate external inputs:

\`\`\`json
{
  "type": "condition",
  "config": {
    "condition": "context.variables.input && context.variables.input.length < 1000"
  }
}
\`\`\`

### 3. Limit Permissions

Use minimal required permissions in workflows.

## Monitoring and Debugging

### Enable Comprehensive Logging

The system automatically logs all operations. View logs in:
- GitHub Actions workflow runs
- Issue comments
- Execution branches

### Track Metrics

Monitor:
- Execution duration
- Success rates
- Resource usage
- Error patterns

### Use Visualization

Enable workflow visualization for better understanding:

\`\`\`yaml
labels: ["agent-task", "visualize"]
\`\`\`

## Cost Optimization

### 1. Choose Appropriate AI Models

| Task Type | Recommended Model | Cost |
|-----------|------------------|------|
| Simple queries | gpt-3.5-turbo | Low |
| Complex analysis | gpt-4 | Medium |
| Long context | claude-3-sonnet | Medium |
| Fast inference | gemini-pro | Low |

### 2. Batch Operations

Combine multiple small tasks into one larger task when possible.

### 3. Use Caching

Cache frequently accessed data and results.

## Common Patterns

### Sequential Pipeline

\`\`\`json
{
  "nodes": [
    { "id": "step1", "type": "agent" },
    { "id": "step2", "type": "ai-task" },
    { "id": "step3", "type": "github-action" }
  ],
  "edges": [
    { "from": "step1", "to": "step2" },
    { "from": "step2", "to": "step3" }
  ]
}
\`\`\`

### Fan-Out / Fan-In

\`\`\`json
{
  "nodes": [
    { "id": "start", "type": "agent" },
    { "id": "parallel", "type": "parallel" },
    { "id": "aggregate", "type": "ai-task" }
  ],
  "edges": [
    { "from": "start", "to": "parallel" },
    { "from": "parallel", "to": "aggregate" }
  ]
}
\`\`\`

### Conditional Branching

\`\`\`json
{
  "nodes": [
    { "id": "check", "type": "condition" },
    { "id": "path-a", "type": "agent" },
    { "id": "path-b", "type": "agent" }
  ],
  "edges": [
    { "from": "check", "to": "path-a", "condition": "true" },
    { "from": "check", "to": "path-b", "condition": "false" }
  ]
}
\`\`\`

---

*For more patterns, see [Example Workflows](../examples/)*
`;
}

// Main execution
async function main() {
  console.log('📚 Generating Wiki pages...');
  
  const octokit = initGitHub();
  
  // Generate different wiki pages
  const pages = [
    {
      name: 'Agent-Types',
      content: await generateAgentTypesPage()
    },
    {
      name: 'Workflow-Best-Practices',
      content: await generateBestPracticesPage()
    }
  ];
  
  // Save pages to files (for review)
  const wikiDir = '.wiki-content';
  if (!fs.existsSync(wikiDir)) {
    fs.mkdirSync(wikiDir);
  }
  
  pages.forEach(page => {
    const filePath = path.join(wikiDir, `${page.name}.md`);
    fs.writeFileSync(filePath, page.content);
    console.log(`✅ Generated: ${page.name}`);
  });
  
  console.log('\n✨ Wiki pages generated successfully!');
  console.log(`📁 Saved to: ${wikiDir}/`);
  console.log('\n💡 To publish to wiki:');
  console.log('1. Go to your repository Wiki');
  console.log('2. Create new pages with these names');
  console.log('3. Copy content from generated files');
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = {
  generateExecutionPage,
  generateAgentTypesPage,
  generateBestPracticesPage
};
