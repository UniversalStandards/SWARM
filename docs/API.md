# SWARM API Documentation

## Overview

SWARM provides a comprehensive RESTful API for workflow management, agent orchestration, and execution monitoring.

## Base URL

```
Production: https://swarm.us-spurs.gov/api
Development: http://localhost:3000/api
```

## Authentication

**Session-Based (Web):** Handled automatically by NextAuth.js

**API Key-Based:**
```http
Authorization: Bearer YOUR_API_KEY
```

## Core Endpoints

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Agents
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/agents/:id` - Get agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Execution
- `POST /api/execution/start` - Start execution
- `GET /api/execution/:id` - Get status
- `GET /api/execution/list` - List executions
- `POST /api/execution/:id/cancel` - Cancel execution
- `GET /api/execution/:id/logs` - Get logs
- `GET /api/execution/:id/artifacts` - Get artifacts
- `GET /api/execution/stats` - Get statistics

### GitHub Integration
- `GET /api/github/repositories` - List repositories
- `POST /api/github/repositories` - Create repository
- `GET /api/github/files` - Get file content
- `PUT /api/github/files` - Create/update file
- `POST /api/github/commit` - Create commit
- `POST /api/github/pull-request` - Create PR

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');
ws.send(JSON.stringify({
  type: 'subscribe',
  executionId: 'exec_xyz789'
}));
```

### Event Types
- `execution:started`
- `execution:progress`
- `node:completed`
- `agent:output`
- `log`
- `artifact:created`
- `execution:completed`
- `execution:failed`

## Error Handling

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "recoverable": true
  }
}
```

## Rate Limiting

- **Default**: 100 requests/minute
- **Burst**: 20 requests/second

## SDK Examples

### Node.js
```javascript
import { SwarmClient } from '@swarm/client';

const client = new SwarmClient({
  apiKey: process.env.SWARM_API_KEY
});

const execution = await client.execution.start({
  workflowId: workflow.id,
  config: { priority: 'high' }
});

execution.on('completed', (data) => {
  console.log('Artifacts:', data.artifacts);
});
```

### Python
```python
from swarm import SwarmClient

client = SwarmClient(api_key=os.getenv('SWARM_API_KEY'))

execution = client.execution.start(
    workflow_id=workflow['id'],
    config={'priority': 'high'}
)

for event in execution.stream():
    if event['type'] == 'execution:completed':
        print('Artifacts:', event['data']['artifacts'])
```

For complete API reference with detailed examples, see the full [API Documentation](https://swarm-docs.us-spurs.gov/api).

---

*For support, contact api-support@us-spurs.gov*