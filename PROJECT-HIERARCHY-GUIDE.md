# 🏗️ Project Hierarchy & Subtasking Guide

## Overview

The GitHub-Native AI Agent Orchestrator now supports **hierarchical project structures** and **intelligent subtasking**. The main orchestrator can automatically create sub-projects and delegate tasks, enabling better organization and parallel execution tracking.

## Key Concepts

### 1. Main Project
- **Created automatically** when a workflow issue is created
- **Named after the workflow**: e.g., "Workflow: Data Analysis Pipeline"
- **Tracks all sub-tasks** in a Kanban board

### 2. Sub-Projects
- **Automatically created** for complex agent tasks
- **Dedicated to specific agents**: Manager, Orchestrator, or custom agents
- **Independent tracking** with their own columns and sub-tasks

### 3. Sub-Tasks
- **Created as GitHub Issues** for each workflow node
- **Linked to parent issue** via labels
- **Tracked in project boards** for visual progress

## Architecture

```
Repository
│
├── Main Workflow Issue (#123)
│   │
│   ├── Main Project: "Workflow: Data Pipeline"
│   │   ├── Column: Pending
│   │   ├── Column: In Progress
│   │   ├── Column: Review
│   │   ├── Column: Completed
│   │   └── Column: Blocked
│   │
│   ├── Sub-Task #124 (Node: fetch-data)
│   ├── Sub-Task #125 (Node: transform-data)
│   │   │
│   │   └── Sub-Project: "Agent transform-data: Sub-Project"
│   │       ├── Sub-Task #126 (normalize)
│   │       ├── Sub-Task #127 (validate)
│   │       └── Sub-Task #128 (enrich)
│   │
│   └── Sub-Task #129 (Node: analyze-results)
```

## How It Works

### Automatic Hierarchy Creation

When you create a workflow issue with the `agent-task` label, the system automatically:

1. **Parses the workflow** from JSON configuration
2. **Creates a main project** named after your workflow
3. **Sets up Kanban columns** (Pending, In Progress, Review, Completed, Blocked)
4. **Creates sub-issues** for complex nodes
5. **Links everything together** with labels and comments

### Sub-Project Triggers

Sub-projects are automatically created when:

- ✅ Agent type is `manager` or `orchestrator`
- ✅ Node config includes `createSubProject: true`
- ✅ Node has `subTasks` array defined
- ✅ Node is marked as complex

### Agent Delegation

The orchestrator intelligently delegates work:

```javascript
// Manager agent automatically creates sub-project
{
  "id": "coordinate-tasks",
  "type": "agent",
  "config": {
    "agentType": "manager",
    "task": "Coordinate data processing",
    "subTasks": [
      { "task": "Fetch from API", "agent": "worker" },
      { "task": "Transform data", "agent": "worker" },
      { "task": "Store results", "agent": "worker" }
    ]
  }
}
```

## Usage Examples

### Example 1: Simple Workflow (No Sub-Projects)

```json
{
  "nodes": [
    {
      "id": "analyze",
      "type": "ai-task",
      "config": {
        "prompt": "Analyze data",
        "model": "gpt-4"
      }
    }
  ],
  "edges": []
}
```

**Result**: Single main project, no sub-projects needed.

### Example 2: Hierarchical Workflow (With Sub-Projects)

```json
{
  "nodes": [
    {
      "id": "fetch-data",
      "type": "agent",
      "config": {
        "agentType": "worker",
        "task": "Fetch data from API"
      }
    },
    {
      "id": "process-manager",
      "type": "agent",
      "config": {
        "agentType": "manager",
        "task": "Process and transform data",
        "subTasks": [
          {
            "task": "Normalize data",
            "agent": "data-processor",
            "operation": "normalize"
          },
          {
            "task": "Validate schema",
            "agent": "data-processor",
            "operation": "validate"
          },
          {
            "task": "Enrich with metadata",
            "agent": "data-processor",
            "operation": "enrich"
          }
        ]
      }
    },
    {
      "id": "analyze",
      "type": "ai-task",
      "config": {
        "prompt": "Analyze processed data",
        "model": "claude-3-sonnet"
      }
    }
  ],
  "edges": [
    { "from": "fetch-data", "to": "process-manager" },
    { "from": "process-manager", "to": "analyze" }
  ]
}
```

**Result**:
- Main project: "Workflow: Data Processing Pipeline"
- Sub-project for `process-manager` node with 3 sub-tasks
- All tracked in separate project boards

### Example 3: Manual Sub-Project Creation

```json
{
  "id": "complex-task",
  "type": "agent",
  "config": {
    "agentType": "worker",
    "task": "Complex multi-step operation",
    "createSubProject": true,
    "subTasks": [
      { "task": "Step 1: Initialize" },
      { "task": "Step 2: Execute" },
      { "task": "Step 3: Finalize" }
    ]
  }
}
```

**Result**: Sub-project created even for worker agent due to explicit flag.

## Manual Trigger

You can manually trigger project hierarchy creation:

```bash
# Via GitHub CLI
gh workflow run project-hierarchy.yml \
  -f parent_issue=123 \
  -f auto_create_subprojects=true

# Via GitHub UI
# Go to Actions → Project Hierarchy Manager → Run workflow
# Enter issue number
```

## Project Board Features

### Kanban Columns

**Main Project Columns**:
- **Pending**: Tasks waiting to start
- **In Progress**: Currently executing
- **Review**: Awaiting review/validation
- **Completed**: Successfully finished
- **Blocked**: Blocked by dependencies or issues

**Sub-Project Columns**:
- **To Do**: Queued sub-tasks
- **In Progress**: Active sub-tasks
- **Done**: Completed sub-tasks

### Automatic Updates

The `project-sync.yml` workflow automatically:
- ✅ Moves cards between columns based on status labels
- ✅ Updates parent issue when sub-tasks complete
- ✅ Syncs status across hierarchy
- ✅ Creates summary comments

## Labels

### Hierarchy Labels

| Label | Purpose |
|-------|---------|
| `agent-task` | Main workflow issue |
| `agent-subtask` | Sub-task issue |
| `has-subproject` | Issue has dedicated sub-project |
| `hierarchical-workflow` | Multi-level workflow |
| `needs-subproject` | Trigger sub-project creation |
| `parent:N` | Links to parent issue #N |
| `node-type:X` | Identifies node type |

### Status Labels

| Label | Meaning |
|-------|---------|
| `status:pending` | Waiting to start |
| `status:running` | Currently executing |
| `status:completed` | Successfully finished |
| `status:failed` | Execution failed |
| `status:blocked` | Blocked by dependencies |

## Integration with Orchestrator

### Orchestrator Behavior

The orchestrator automatically:

1. **Detects complex nodes** (manager, orchestrator, has subTasks)
2. **Creates sub-projects** before executing the node
3. **Delegates sub-tasks** to worker agents
4. **Tracks progress** across hierarchy
5. **Aggregates results** from sub-tasks
6. **Updates parent issue** with combined status

### Execution Flow

```
Main Issue Created
    ↓
Main Project Created (project-hierarchy.yml)
    ↓
Orchestrator Parses Workflow (agent-orchestrator.yml)
    ↓
For Each Node:
    - If simple: Execute directly
    - If complex: Create sub-project → Delegate sub-tasks
    ↓
Sub-Tasks Execute in Parallel
    ↓
Results Aggregated
    ↓
Parent Issue Updated
    ↓
Main Project Shows Completion
```

## Benefits

### 1. Better Organization
- Visual hierarchy in project boards
- Clear parent-child relationships
- Organized task tracking

### 2. Parallel Execution
- Sub-tasks run concurrently
- Independent tracking per sub-task
- Efficient resource utilization

### 3. Scalability
- Handle complex workflows easily
- Unlimited nesting levels
- Automatic load distribution

### 4. Transparency
- Visual progress tracking
- Real-time status updates
- Complete audit trail

### 5. Collaboration
- Team members can work on different sub-tasks
- Comments and discussions per sub-task
- Clear ownership and responsibility

## Advanced Configuration

### Custom Sub-Project Names

```json
{
  "config": {
    "agentType": "manager",
    "subProjectName": "Custom Project Name",
    "subTasks": [...]
  }
}
```

### Conditional Sub-Projects

```json
{
  "config": {
    "agentType": "worker",
    "createSubProject": "context.variables.dataSize > 1000",
    "subTasks": [...]
  }
}
```

### Sub-Project Templates

```json
{
  "config": {
    "agentType": "orchestrator",
    "subProjectTemplate": "kanban",
    "columns": ["Backlog", "Sprint", "Review", "Done"],
    "subTasks": [...]
  }
}
```

## Monitoring Hierarchy

### View All Projects

```bash
# List all projects in repository
gh project list --owner OWNER --repo REPO

# View specific project
gh project view PROJECT_ID
```

### Check Sub-Task Status

```bash
# Find all sub-tasks for an issue
gh issue list --label "parent:123"

# Get sub-task details
gh issue view 124
```

### Project Analytics

The health monitor tracks:
- Number of active projects
- Sub-tasks per project
- Completion rates
- Blocked tasks
- Average time to completion

## Best Practices

### 1. Use Manager Agents for Coordination

When you have multiple related tasks, use a manager agent:

```json
{
  "type": "agent",
  "config": {
    "agentType": "manager",
    "subTasks": [...]
  }
}
```

### 2. Keep Sub-Tasks Focused

Each sub-task should be:
- **Clear**: Well-defined scope
- **Independent**: Minimal dependencies
- **Measurable**: Clear success criteria

### 3. Monitor Project Boards

Regularly check:
- Main project board for overall progress
- Sub-project boards for detailed status
- Blocked column for issues

### 4. Use Meaningful Names

Name your workflows and tasks clearly:
- ❌ "Task 1", "Process Data"
- ✅ "ETL Pipeline: Customer Data", "Normalize User Records"

### 5. Leverage Labels

Use labels consistently:
- Priority levels
- Team assignments
- Component tags
- Status indicators

## Troubleshooting

### Issue: Sub-Project Not Created

**Possible Causes**:
- Agent type not manager/orchestrator
- Missing `subTasks` in config
- No `createSubProject` flag

**Solution**: Add explicit flag:
```json
{ "config": { "createSubProject": true } }
```

### Issue: Sub-Tasks Not Linked

**Possible Causes**:
- Labels not applied correctly
- Workflow race condition

**Solution**: Check labels include `parent:N`

### Issue: Project Board Not Syncing

**Possible Causes**:
- project-sync.yml not running
- Missing permissions

**Solution**: Check workflow logs and permissions

## Future Enhancements

Coming soon:
- [ ] Auto-scaling based on workload
- [ ] Cross-repository hierarchies
- [ ] Template library
- [ ] Resource allocation
- [ ] Cost tracking per sub-project
- [ ] Gantt chart visualization

## See Also

- [GITHUB-NATIVE-README.md](GITHUB-NATIVE-README.md) - Main architecture
- [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) - Setup instructions
- [GITHUB-NATIVE-FEATURES.md](GITHUB-NATIVE-FEATURES.md) - Feature list

---

**Hierarchical orchestration for complex workflows** 🏗️

*Better organization, clearer tracking, smarter delegation*
