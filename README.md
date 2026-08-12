> ⚠️ **DEPRECATED — not the canonical SWARM repository.**
>
> As of 2026-08-12, repository reconciliation ([atlantis-ai-enhanced#1](https://github.com/UniversalStandards/atlantis-ai-enhanced/issues/1)) designated **[Universal-Standard/PROJECT-SWARM](https://github.com/Universal-Standard/PROJECT-SWARM)** as the canonical SWARM codebase. This repository is kept for historical reference only — do not build new features here.
>
> **Why:** this repo runs a Docker/Kubernetes/Next.js architecture that predates the Cloudflare-native platform decision (Cloudflare Workers + Durable Objects + Supabase + NATS), and its docs bake US-SPURS/federal branding and "Federal Compliance" directly into what is supposed to be a civilian-first core — that violates the project's own module-isolation rule (government capabilities must be an opt-in module, never baked into core). No substantive commits since February 2026 aside from automated dependency bumps. The `DEPLOYMENT-STATUS.md` "100% COMPLETE" claim in this repo is stale and should not be treated as current.

---

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

*(Rest of original README preserved below for historical reference.)*

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

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/UniversalStandards/SWARM/issues)
- **Discussions**: [GitHub Discussions](https://github.com/UniversalStandards/SWARM/discussions)

---

**Historical document — superseded 2026-08-12. See [Universal-Standard/PROJECT-SWARM](https://github.com/Universal-Standard/PROJECT-SWARM) for the active codebase.**
