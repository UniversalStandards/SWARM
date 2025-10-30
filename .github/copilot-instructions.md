# AI Agent Swarm Orchestrator - Copilot Instructions

## Architecture Overview

This is an enterprise-grade AI agent orchestration platform built with Next.js 14+ that enables autonomous multi-agent workflows. The system follows a dual-architecture pattern with both `app/` and `src/` directories serving different purposes.

### Key Architectural Components

- **Execution Engine**: Core orchestration system in `src/lib/execution/` handles workflow execution, AI provider integration, and task management
- **API Layer**: Next.js API routes in both `app/api/` and `src/app/api/` provide REST endpoints and WebSocket support
- **Frontend**: React components with TypeScript, using Tailwind CSS and Radix UI primitives
- **State Management**: React Context + TanStack Query for server state, Zustand for client state

## Critical Patterns & Conventions

### 1. Execution System Architecture

The execution system follows an event-driven orchestration pattern:

```typescript
// Core classes: WorkflowOrchestrator, AIExecutor, GitHubIntegration
// Located in: src/lib/execution/
```

- **WorkflowOrchestrator**: Manages node execution with topological sorting, supports parallel/conditional/loop nodes
- **AIExecutor**: Multi-provider AI integration (OpenAI, Anthropic, Google, Ollama, Custom APIs) with unified interface
- **GitHubIntegration**: Direct GitHub API integration for branch/commit/PR operations using Octokit

### 2. Type System Conventions

All types are centralized in `types/index.ts` with specific patterns:
- **Status Types**: Use literal unions (`"pending" | "running" | "completed" | "failed" | "cancelled"`)
- **Entity Interfaces**: Include `id`, `createdAt`, `updatedAt` timestamps
- **API Responses**: Wrapped in `APIResponse<T>` with `success`, `data`, `error` structure

### 3. API Route Architecture

Dual API structure serves different purposes:
- `app/api/*`: Frontend-facing routes (auth, workflows, tasks)
- `src/app/api/*`: Execution-specific routes with WebSocket support

WebSocket pattern for real-time updates:
```typescript
// Broadcasting pattern used in src/app/api/execution/route.ts
broadcast({ type: "executionStarted", execution });
```

### 4. Component Organization

- **Execution Components**: Located in `src/components/execution/` with real-time monitoring capabilities
- **UI Components**: Radix UI primitives with Tailwind CSS classes
- **Styling**: Custom theme extends default Tailwind with purple/yellow primary colors

## Development Workflows

### Build & Development
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run type-check   # TypeScript validation
npm run export       # Static export for GitHub Pages
```

### Key Environment Variables
```env
GITHUB_CLIENT_ID/SECRET    # GitHub OAuth integration
OPENAI/ANTHROPIC/GOOGLE_AI_API_KEY  # Multi-provider AI support
DATABASE_URL               # Database connection
NEXTAUTH_SECRET/URL        # Authentication
```

### Deployment Modes
- **Development**: Full API routes with WebSocket support
- **Static Export**: Uses `EXPORT_MODE=static` for GitHub Pages deployment
- **Production**: Vercel deployment with serverless functions

## Integration Patterns

### AI Provider Integration
Multi-provider support through abstract `AIProvider` class:
- Each provider extends base class with standardized `request()` method
- Unified interface through `AIExecutor.execute(providerKey, request)`
- Streaming support via `onStream()` callbacks

### GitHub Integration
Direct GitHub API operations via `GitHubIntegration` class:
- Branch creation, file commits, PR management
- Artifact uploads to repository branches
- OAuth-based authentication flow

### Real-time Communication
WebSocket implementation for execution monitoring:
- Server-side broadcasting in API routes
- Client-side real-time updates in `ExecutionMonitor` component
- Auto-reconnection and state synchronization

## Project-Specific Guidelines

### File Organization
- **Execution Logic**: Always place in `src/lib/execution/`
- **API Routes**: Use `app/api/` for general routes, `src/app/api/` for execution-specific
- **Types**: Centralize all TypeScript definitions in `types/index.ts`
- **Components**: Group by feature (`agents/`, `workflows/`, `execution/`)

### Error Handling
- Use `AppError` interface for structured error responses
- API routes return `APIResponse<T>` wrapper
- WebSocket errors broadcast as `{ type: "error", details }` messages

### Configuration
- Next.js config enables static export mode and CORS headers
- Webpack fallbacks disable Node.js modules for browser compatibility
- Tailwind config includes custom theme extensions and animations

## Dependencies & Tools

### Core Stack
- **Next.js 14+**: App router with TypeScript support
- **TanStack Query**: Server state management with caching
- **Zustand**: Lightweight client state management
- **ReactFlow**: Workflow visualization components
- **Framer Motion**: Animations and transitions

### AI & Integration
- **@anthropic-ai/sdk**: Claude AI integration
- **openai**: GPT models support
- **@google/generative-ai**: Gemini integration
- **@octokit/rest**: GitHub API client

### UI Framework
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Consistent icon system
- **Sonner**: Toast notifications

## Testing & Quality

### TypeScript Validation
- Strict mode enabled with `tsc --noEmit`
- Centralized type definitions prevent duplication
- Interface-driven development for all major components

### Build Optimization
- SWC minification enabled
- Package import optimization for `lucide-react`, `framer-motion`
- Image optimization with GitHub domain allowlist