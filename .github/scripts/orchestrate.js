#!/usr/bin/env node

/**
 * GitHub-Native Agent Orchestrator
 * Orchestrates multi-agent workflows using GitHub infrastructure
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '').replace(/-/g, '_');
    parsed[key] = args[i + 1];
  }
  
  return parsed;
}

// Initialize GitHub client
function initGitHub() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
}

// Load task configuration
function loadTask(taskFile) {
  const taskPath = path.resolve(taskFile);
  const taskContent = fs.readFileSync(taskPath, 'utf8');
  return JSON.parse(taskContent);
}

// Create execution context
function createExecutionContext(task, runId) {
  return {
    runId,
    task,
    startTime: new Date().toISOString(),
    logs: [],
    variables: {},
    artifacts: [],
    status: 'running',
    nodes: new Map(),
    edges: []
  };
}

// Log execution events
function log(context, level, message, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };
  
  context.logs.push(logEntry);
  console.log(`[${level.toUpperCase()}] ${message}`, data);
  
  return logEntry;
}

// Execute workflow nodes in topological order
async function executeWorkflow(context, octokit) {
  log(context, 'info', 'Starting workflow execution');
  
  const { task } = context;
  const nodes = task.nodes || [];
  const edges = task.edges || [];
  
  // Build adjacency list
  const graph = new Map();
  const inDegree = new Map();
  
  nodes.forEach(node => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  edges.forEach(edge => {
    graph.get(edge.from).push(edge.to);
    inDegree.set(edge.to, inDegree.get(edge.to) + 1);
  });
  
  // Topological sort using Kahn's algorithm
  const queue = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });
  
  const executionOrder = [];
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    executionOrder.push(nodeId);
    
    const neighbors = graph.get(nodeId) || [];
    neighbors.forEach(neighbor => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  if (executionOrder.length !== nodes.length) {
    throw new Error('Workflow contains cycles or disconnected nodes');
  }
  
  log(context, 'info', 'Execution order determined', { order: executionOrder });
  
  // Execute nodes in order
  for (const nodeId of executionOrder) {
    const node = nodes.find(n => n.id === nodeId);
    
    try {
      await executeNode(context, node, octokit);
      context.nodes.set(nodeId, { status: 'completed', result: null });
    } catch (error) {
      log(context, 'error', `Node ${nodeId} failed`, { error: error.message });
      context.nodes.set(nodeId, { status: 'failed', error: error.message });
      throw error;
    }
  }
  
  log(context, 'info', 'Workflow execution completed');
}

// Execute individual workflow node
async function executeNode(context, node, octokit) {
  log(context, 'info', `Executing node: ${node.id}`, { type: node.type });
  
  const { type, config } = node;
  
  switch (type) {
    case 'agent':
      await executeAgentNode(context, node, octokit);
      break;
    
    case 'condition':
      await executeConditionNode(context, node);
      break;
    
    case 'parallel':
      await executeParallelNode(context, node, octokit);
      break;
    
    case 'ai-task':
      await executeAITask(context, node);
      break;
    
    case 'github-action':
      await executeGitHubAction(context, node, octokit);
      break;
    
    default:
      log(context, 'warn', `Unknown node type: ${type}`);
  }
}

// Execute agent node
async function executeAgentNode(context, node, octokit) {
  const { config } = node;
  const agentType = config.agentType || 'worker';
  
  log(context, 'info', `Executing agent: ${agentType}`);
  
  // Create a sub-issue for the agent task
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  // Check if this node should create a sub-project
  const needsSubProject = config.createSubProject || 
                          agentType === 'manager' || 
                          agentType === 'orchestrator' ||
                          (config.subTasks && config.subTasks.length > 0);
  
  const issue = await octokit.rest.issues.create({
    owner,
    repo,
    title: `[Agent] ${node.id}: ${config.task || 'Execute task'}`,
    body: `**Agent Type**: ${agentType}
**Parent Run**: ${context.runId}
**Node ID**: ${node.id}
${needsSubProject ? '**Sub-Project**: Will be created automatically' : ''}

**Task Configuration**:
\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

This issue was automatically created by the AI Agent Orchestrator.`,
    labels: ['agent-task', `agent:${agentType}`, 'auto-created', ...(needsSubProject ? ['needs-subproject'] : [])]
  });
  
  log(context, 'info', `Created agent task issue #${issue.data.number}`);
  
  // If this is a manager/orchestrator or has subtasks, create sub-project
  if (needsSubProject) {
    await createSubProjectForAgent(context, node, issue.data, octokit);
  }
  
  // Simulate agent execution (in real implementation, this would trigger worker workflow)
  context.artifacts.push({
    name: `agent-${node.id}-output`,
    url: issue.data.html_url,
    type: 'issue',
    hasSubProject: needsSubProject
  });
}

// Create sub-project for complex agent tasks
async function createSubProjectForAgent(context, node, issue, octokit) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const { config } = node;
  
  log(context, 'info', `Creating sub-project for agent ${node.id}`);
  
  try {
    // Create dedicated project for this agent's work
    const projectName = `Agent ${node.id}: ${config.task || 'Sub-Project'}`;
    const { data: project } = await octokit.rest.projects.createForRepo({
      owner,
      repo,
      name: projectName,
      body: `Sub-project for agent task from issue #${issue.number}
      
**Parent Workflow Run**: ${context.runId}
**Agent Type**: ${config.agentType}
**Node ID**: ${node.id}

This project tracks all sub-tasks delegated by the ${config.agentType} agent.`
    });
    
    // Create columns
    const columns = ['To Do', 'In Progress', 'Done'];
    for (const colName of columns) {
      await octokit.rest.projects.createColumn({
        project_id: project.id,
        name: colName
      });
    }
    
    // Create sub-tasks if defined
    if (config.subTasks && config.subTasks.length > 0) {
      for (const subTask of config.subTasks) {
        const { data: subIssue } = await octokit.rest.issues.create({
          owner,
          repo,
          title: `[Sub-Task] ${subTask.name || subTask.task}`,
          body: `**Parent Agent**: #${issue.number}
**Sub-Project**: [${projectName}](${project.html_url})

**Task**: ${subTask.task || subTask.description || 'Execute sub-task'}

\`\`\`json
${JSON.stringify(subTask, null, 2)}
\`\`\``,
          labels: ['agent-subtask', `parent:${issue.number}`]
        });
        
        log(context, 'info', `Created sub-task issue #${subIssue.number}`);
      }
    }
    
    // Comment on parent issue with project link
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: `🏗️ **Sub-Project Created**

A dedicated project has been created to track this agent's work:

**Project**: [${projectName}](${project.html_url})

The agent will delegate sub-tasks to this project for organized tracking and execution.`
    });
    
    context.artifacts.push({
      name: `subproject-${node.id}`,
      url: project.html_url,
      type: 'project',
      issueNumber: issue.number
    });
    
  } catch (error) {
    log(context, 'warn', `Could not create sub-project: ${error.message}`);
  }
}

// Execute condition node
async function executeConditionNode(context, node) {
  const { config } = node;
  const condition = config.condition || 'true';
  
  log(context, 'info', `Evaluating condition: ${condition}`);
  
  // Simple condition evaluation (can be enhanced with safer eval)
  const result = eval(condition);
  
  context.variables[`condition_${node.id}`] = result;
  
  log(context, 'info', `Condition result: ${result}`);
}

// Execute parallel node
async function executeParallelNode(context, node, octokit) {
  const { config } = node;
  const tasks = config.tasks || [];
  
  log(context, 'info', `Executing ${tasks.length} parallel tasks`);
  
  await Promise.all(
    tasks.map(async (task, index) => {
      const taskNode = {
        id: `${node.id}_${index}`,
        type: task.type || 'agent',
        config: task
      };
      
      await executeNode(context, taskNode, octokit);
    })
  );
}

// Execute AI task using configured AI providers
async function executeAITask(context, node) {
  const { config } = node;
  const prompt = config.prompt || '';
  const model = config.model || 'gpt-4';
  
  log(context, 'info', `Executing AI task with ${model}`);
  
  // This would integrate with the existing AI executor
  // For now, just log and store in context
  context.variables[`ai_result_${node.id}`] = {
    prompt,
    model,
    timestamp: new Date().toISOString()
  };
  
  log(context, 'info', 'AI task completed');
}

// Execute GitHub Action
async function executeGitHubAction(context, node, octokit) {
  const { config } = node;
  const action = config.action || 'unknown';
  
  log(context, 'info', `Executing GitHub action: ${action}`);
  
  // Handle different GitHub actions
  switch (action) {
    case 'create-issue':
      await createIssue(context, config, octokit);
      break;
    
    case 'create-pr':
      await createPullRequest(context, config, octokit);
      break;
    
    case 'add-comment':
      await addComment(context, config, octokit);
      break;
    
    default:
      log(context, 'warn', `Unknown GitHub action: ${action}`);
  }
}

// Helper: Create issue
async function createIssue(context, config, octokit) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  const issue = await octokit.rest.issues.create({
    owner,
    repo,
    title: config.title || 'Automated Issue',
    body: config.body || '',
    labels: config.labels || []
  });
  
  log(context, 'info', `Created issue #${issue.data.number}`);
  
  context.artifacts.push({
    name: 'created-issue',
    url: issue.data.html_url,
    type: 'issue'
  });
}

// Helper: Create pull request
async function createPullRequest(context, config, octokit) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  const pr = await octokit.rest.pulls.create({
    owner,
    repo,
    title: config.title || 'Automated PR',
    body: config.body || '',
    head: config.head,
    base: config.base || 'main'
  });
  
  log(context, 'info', `Created PR #${pr.data.number}`);
  
  context.artifacts.push({
    name: 'created-pr',
    url: pr.data.html_url,
    type: 'pull-request'
  });
}

// Helper: Add comment
async function addComment(context, config, octokit) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: config.issueNumber,
    body: config.body || ''
  });
  
  log(context, 'info', `Added comment to issue #${config.issueNumber}`);
}

// Save execution results
function saveResults(context, outputDir) {
  const resultsPath = path.join(outputDir, 'results.json');
  
  const results = {
    runId: context.runId,
    status: context.status,
    startTime: context.startTime,
    endTime: new Date().toISOString(),
    summary: generateSummary(context),
    logs: context.logs,
    artifacts: context.artifacts,
    variables: context.variables,
    nodes: Array.from(context.nodes.entries()).map(([id, data]) => ({
      id,
      ...data
    }))
  };
  
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  log(context, 'info', `Results saved to ${resultsPath}`);
}

// Generate execution summary
function generateSummary(context) {
  const totalNodes = context.nodes.size;
  const completedNodes = Array.from(context.nodes.values()).filter(n => n.status === 'completed').length;
  const failedNodes = Array.from(context.nodes.values()).filter(n => n.status === 'failed').length;
  
  return `Executed ${completedNodes}/${totalNodes} nodes successfully. ${failedNodes} failed.`;
}

// Main execution
async function main() {
  const args = parseArgs();
  const octokit = initGitHub();
  
  console.log('🤖 AI Agent Orchestrator Starting...');
  console.log(`Run ID: ${args.run_id}`);
  
  try {
    // Load task
    const task = loadTask(args.task_file);
    
    // Create execution context
    const context = createExecutionContext(task, args.run_id);
    
    // Execute workflow
    await executeWorkflow(context, octokit);
    
    // Mark as completed
    context.status = 'completed';
    
    // Save results
    saveResults(context, args.output_dir);
    
    console.log('✅ Orchestration completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Orchestration failed:', error);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  loadTask,
  createExecutionContext,
  executeWorkflow,
  executeNode,
  saveResults
};
