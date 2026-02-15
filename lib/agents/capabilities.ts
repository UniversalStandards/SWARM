export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'analysis' | 'testing' | 'documentation' | 'coordination';
}

export const AGENT_CAPABILITIES: AgentCapability[] = [
  // Code Generation
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Generate production-ready code in multiple languages',
    category: 'code',
  },
  {
    id: 'code-refactoring',
    name: 'Code Refactoring',
    description: 'Improve code quality and maintainability',
    category: 'code',
  },
  {
    id: 'bug-fixing',
    name: 'Bug Fixing',
    description: 'Identify and fix bugs in existing code',
    category: 'code',
  },
  {
    id: 'api-design',
    name: 'API Design',
    description: 'Design RESTful and GraphQL APIs',
    category: 'code',
  },

  // Analysis
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Perform thorough code reviews with best practices',
    category: 'analysis',
  },
  {
    id: 'security-analysis',
    name: 'Security Analysis',
    description: 'Identify security vulnerabilities and risks',
    category: 'analysis',
  },
  {
    id: 'performance-analysis',
    name: 'Performance Analysis',
    description: 'Analyze and optimize code performance',
    category: 'analysis',
  },
  {
    id: 'architecture-review',
    name: 'Architecture Review',
    description: 'Evaluate system architecture and design',
    category: 'analysis',
  },

  // Testing
  {
    id: 'unit-testing',
    name: 'Unit Testing',
    description: 'Create comprehensive unit tests',
    category: 'testing',
  },
  {
    id: 'integration-testing',
    name: 'Integration Testing',
    description: 'Design and implement integration tests',
    category: 'testing',
  },
  {
    id: 'e2e-testing',
    name: 'E2E Testing',
    description: 'Create end-to-end test scenarios',
    category: 'testing',
  },
  {
    id: 'test-automation',
    name: 'Test Automation',
    description: 'Automate testing workflows',
    category: 'testing',
  },

  // Documentation
  {
    id: 'api-documentation',
    name: 'API Documentation',
    description: 'Generate comprehensive API documentation',
    category: 'documentation',
  },
  {
    id: 'code-comments',
    name: 'Code Comments',
    description: 'Add clear and helpful code comments',
    category: 'documentation',
  },
  {
    id: 'user-guides',
    name: 'User Guides',
    description: 'Create user-friendly documentation',
    category: 'documentation',
  },
  {
    id: 'technical-specs',
    name: 'Technical Specs',
    description: 'Write detailed technical specifications',
    category: 'documentation',
  },

  // Coordination
  {
    id: 'workflow-orchestration',
    name: 'Workflow Orchestration',
    description: 'Coordinate multi-agent workflows',
    category: 'coordination',
  },
  {
    id: 'task-delegation',
    name: 'Task Delegation',
    description: 'Distribute tasks among agents',
    category: 'coordination',
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance',
    description: 'Ensure quality across all outputs',
    category: 'coordination',
  },
  {
    id: 'progress-tracking',
    name: 'Progress Tracking',
    description: 'Monitor and report workflow progress',
    category: 'coordination',
  },
];
