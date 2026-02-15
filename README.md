# SWARM - AI Agent Swarm Orchestration Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **Revolutionary Multi-Agent Intelligence Orchestration Platform** - Enabling parallel coordination of task-specific AI agents at massive scale.

## 🌟 Overview

SWARM represents a paradigm shift from traditional sequential AI systems to true parallel coordination. The platform enables "cavalcades of task-specific agents" that can be duplicated and replicated en masse, with 20-50 agents working simultaneously on the same category of tasks.

### Key Features

- **🔄 Parallel Agent Coordination** - Revolutionary parallel development where tasks complete in hours rather than days/weeks
- **🎯 Visual Workflow Builder** - Drag-and-drop interface powered by React Flow
- **🤖 Pre-configured Agent Templates** - 17+ ready-to-deploy specialized agents
- **🔌 Multi-AI Provider Support** - OpenAI, Anthropic Claude, Google Gemini integration
- **📊 Real-time Monitoring** - Enterprise-grade execution tracking and quality assurance
- **🏢 Federal Compliance** - Government security classifications and audit requirements
- **🔐 Enterprise Authentication** - GitHub and Google OAuth integration
- **⚡ High-Performance Architecture** - Built for massive scale with Docker Swarm orchestration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- Git
- GitHub OAuth App credentials
- AI Provider API keys (OpenAI, Anthropic, or Google)

### Installation

```bash
# Clone the repository
git clone https://github.com/UniversalStandards/SWARM.git
cd SWARM

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the platform.

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📁 Project Structure

```
SWARM/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth authentication
│   │   ├── github/        # GitHub integration
│   │   ├── ai/            # AI provider endpoints
│   │   ├── workflows/     # Workflow CRUD
│   │   ├── agents/        # Agent management
│   │   ├── execute/       # Execution engine
│   │   ├── health/        # Health checks
│   │   └── metrics/       # Performance metrics
│   ├── dashboard/         # Main dashboard
│   ├── workflows/         # Workflow management
│   ├── agents/            # Agent library
│   ├── settings/          # User settings
│   ├── templates/         # Workflow templates
│   └── monitoring/        # System monitoring
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── workflow/         # Workflow-specific components
│   ├── agents/           # Agent components
│   ├── dashboard/        # Dashboard widgets
│   ├── execution/        # Execution monitoring
│   ├── monitoring/       # System metrics
│   ├── templates/        # Template components
│   └── common/           # Shared components
├── lib/                  # Core libraries
│   ├── ai/              # AI provider integrations
│   │   ├── providers/   # OpenAI, Anthropic, Google
│   │   └── provider-factory.ts
│   ├── agents/          # Agent system
│   │   ├── templates.ts # Pre-configured agents
│   │   └── capabilities.ts
│   ├── workflows/       # Workflow engine
│   │   └── templates.ts # Workflow templates
│   ├── execution/       # Execution engine
│   ├── github/          # GitHub client
│   ├── websocket/       # Real-time updates
│   ├── validation/      # Zod schemas
│   ├── errors/          # Error handling
│   ├── logger/          # Logging system
│   ├── rate-limit/      # Rate limiting
│   ├── config/          # Configuration
│   └── utils.ts         # Utility functions
├── store/               # State management (Zustand)
│   ├── setup-store.ts
│   └── workflow-store.ts
├── types/               # TypeScript definitions
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── docker/              # Docker configuration
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Flow** - Workflow visualization
- **Zustand** - State management
- **shadcn/ui** - UI component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication
- **Zod** - Schema validation

### AI Integration
- **OpenAI** - GPT-4, GPT-3.5 Turbo
- **Anthropic** - Claude Sonnet 4.5, Opus 4.5, Haiku 4.5
- **Google** - Gemini 1.5 Pro, Flash

### Infrastructure
- **Docker** - Containerization
- **Docker Swarm** - Orchestration
- **Redis** - Caching and coordination
- **WebSockets** - Real-time updates

## 🤖 Agent Templates

SWARM includes 17+ pre-configured agent templates:

1. **Senior Developer** (GPT-4) - Production code generation
2. **QA Engineer** (GPT-4) - Comprehensive testing
3. **Code Reviewer** (Claude Sonnet) - Quality reviews
4. **Technical Writer** (Claude Sonnet) - Documentation
5. **System Architect** (GPT-4) - Architecture design
6. **Data Analyst** (Gemini Pro) - Data analysis
7. **Workflow Coordinator** (Claude Sonnet) - Orchestration

Each agent comes with:
- Optimized system prompts
- Temperature settings
- Tool integrations
- Token limits
- Provider configuration

## 🔄 Workflow Templates

Pre-built workflow templates for common scenarios:

- **Feature Development Pipeline** - Complete development cycle
- **Bug Fix Workflow** - Analysis, fix, test, document
- **Code Refactoring** - Iterative improvements
- **Documentation Generation** - Comprehensive docs

## 📊 Key Capabilities

### Visual Workflow Builder
- Drag-and-drop node creation
- Custom node types: Agent, Condition, Parallel, Loop
- Real-time validation
- Version control integration

### Parallel Execution
- True concurrent agent coordination
- Dynamic agent spawning
- Load balancing across providers
- Sub-5ms messaging latency (planned)

### Quality Assurance
- Real-time "spot checker" agents
- Continuous validation
- Hierarchical review structure
- Master AI oversight

### Monitoring & Analytics
- Real-time execution tracking
- Performance metrics
- Success/failure rates
- Execution logs
- System health monitoring

## 🔐 Security & Compliance

- **Authentication**: OAuth 2.0 (GitHub, Google)
- **Authorization**: Session-based with JWT
- **API Security**: Rate limiting, validation
- **Data Protection**: Environment-based secrets
- **Federal Compliance**: Audit trails, classifications

## 📈 Performance

- **Parallel Processing**: 20-50 concurrent agents
- **Response Time**: Sub-second API responses
- **Scalability**: Horizontal scaling with Docker Swarm
- **Efficiency**: Optimized token usage across providers

## 🛠️ Development

### Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation

# Docker
docker-compose up    # Start all services
docker-compose down  # Stop all services
docker-compose logs  # View logs
```

### Environment Variables

See `.env.example` for required configuration:

- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Auth secret key
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth
- `GOOGLE_ID` / `GOOGLE_SECRET` - Google OAuth
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_AI_API_KEY` - Google AI API key

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [API Documentation](docs/API.md) (coming soon)

## 🗺️ Roadmap

### Phase 1: Core Platform (Current)
- ✅ Visual workflow builder
- ✅ Multi-provider AI integration
- ✅ Agent templates
- ✅ Basic execution engine
- ✅ Authentication & authorization

### Phase 2: Advanced Features (In Progress)
- ⏳ Real-time execution monitoring
- ⏳ Advanced workflow nodes (Loop, Merge)
- ⏳ WebSocket coordination
- ⏳ Persistent storage (PostgreSQL)

### Phase 3: Enterprise Features (Planned)
- 🔮 Model Context Protocol (MCP) integration
- 🔮 Agent2Agent (A2A) protocols
- 🔮 DragonflyDB for high-throughput ops
- 🔮 NATS JetStream messaging
- 🔮 Apache Drools rule engine
- 🔮 Advanced monitoring dashboard

### Phase 4: Scale & Optimization (Planned)
- 🔮 Kubernetes deployment
- 🔮 Multi-region support
- 🔮 Advanced analytics
- 🔮 Plugin ecosystem

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for US-SPURS (US Department of Special Projects and Unified Response Services)
- Powered by OpenAI, Anthropic, and Google AI technologies
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Workflow visualization by [React Flow](https://reactflow.dev/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/UniversalStandards/SWARM/issues)
- **Discussions**: [GitHub Discussions](https://github.com/UniversalStandards/SWARM/discussions)
- **Documentation**: [Wiki](https://github.com/UniversalStandards/SWARM/wiki)

## 🎯 Mission Statement

SWARM aims to revolutionize software development and complex problem-solving through unprecedented parallel AI coordination. By enabling true concurrent agent orchestration, we're unlocking productivity gains that were previously impossible with sequential approaches.

---

**Built with ❤️ by the US-SPURS Team**

*Enabling parallel development capabilities where tasks complete in hours rather than days or weeks.*
