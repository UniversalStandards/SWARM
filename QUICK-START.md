# AI Agent Swarm Orchestrator - Quick Start Guide

## 🚀 Get Running in 5 Minutes

This guide will help you deploy the AI Agent Swarm Orchestrator quickly.

---

## Prerequisites

- Docker & Docker Compose (for Docker deployment)
- kubectl & Helm (for Kubernetes deployment)
- Node.js 20+ (for local development)
- API Keys for AI providers (Claude, GPT-4, Gemini)

---

## Option 1: Docker Compose (Recommended for Testing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/UniversalStandards/SWARM.git
cd SWARM
```

### Step 2: Configure Environment

```bash
# Copy the Docker-specific environment template
cp .env.docker.example .env

# Generate secure passwords (recommended)
sed -i "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$(openssl rand -base64 24)/" .env
sed -i "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$(openssl rand -base64 32)/" .env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -base64 32)/" .env
sed -i "s/^GRAFANA_ADMIN_PASSWORD=.*/GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16)/" .env
sed -i "s/^PGADMIN_DEFAULT_PASSWORD=.*/PGADMIN_DEFAULT_PASSWORD=$(openssl rand -base64 16)/" .env

# Edit .env and add your AI provider API keys
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# GOOGLE_API_KEY=your_key_here
```

**⚠️ Security Note:** Never commit the `.env` file to version control. It contains sensitive credentials.

### Step 3: Start All Services

```bash
docker-compose up -d
```

### Step 4: Access the Application

- **Web UI:** http://localhost:3000
- **Grafana:** http://localhost:3001 (admin/admin)
- **Prometheus:** http://localhost:9090
- **Jaeger:** http://localhost:16686

---

## Option 2: Kubernetes (Production)

### Step 1: Configure Kubernetes

```bash
kubectl create namespace ai-swarm
```

### Step 2: Create Secrets

```bash
kubectl create secret generic ai-swarm-secrets \
  --from-literal=ANTHROPIC_API_KEY=your-key \
  --from-literal=OPENAI_API_KEY=your-key \
  --from-literal=GOOGLE_API_KEY=your-key \
  -n ai-swarm
```

### Step 3: Deploy Application

```bash
kubectl apply -f k8s/ -n ai-swarm
```

### Step 4: Check Status

```bash
kubectl get pods -n ai-swarm
kubectl get svc -n ai-swarm
```

---

## Option 3: Local Development

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Database Services

```bash
docker-compose up -d postgres redis
```

### Step 3: Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

### Step 4: Run Development Server

```bash
npm run dev
```

Access at http://localhost:3000

---

## Initial Configuration

### 1. Create First Workflow

1. Navigate to Dashboard
2. Click "New Workflow"
3. Drag agents onto canvas
4. Connect nodes with edges
5. Configure agent parameters
6. Save workflow

### 2. Execute Workflow

1. Select workflow from list
2. Click "Execute"
3. Monitor real-time progress
4. View results and artifacts

---

## Monitoring & Observability

### Grafana Dashboards

1. Open http://localhost:3001
2. Login with username `admin` and the password you set in `GRAFANA_ADMIN_PASSWORD`
3. Navigate to "AI Swarm Overview" dashboard
4. View metrics, alerts, and performance data

### Prometheus Metrics

- Application metrics: http://localhost:3000/api/metrics
- Prometheus UI: http://localhost:9090

### Distributed Tracing

- Jaeger UI: http://localhost:16686
- Search for traces by service name or operation

---

## Common Tasks

### Scale Kubernetes Deployment

```bash
kubectl scale deployment ai-swarm-app --replicas=5 -n ai-swarm
```

### View Logs

```bash
# Docker
docker-compose logs -f app

# Kubernetes
kubectl logs -f deployment/ai-swarm-app -n ai-swarm
```

### Backup Database

```bash
docker exec -t postgres pg_dump -U swarm ai_swarm > backup.sql
```

### Load Test

```bash
k6 run tests/performance/load-test.js
```

---

## Troubleshooting

### Application Won't Start

1. Check logs: `docker-compose logs app`
2. Verify environment variables are set
3. Ensure database is running and accessible

### Database Connection Errors

1. Check PostgreSQL is running: `docker-compose ps postgres`
2. Verify DATABASE_URL environment variable
3. Check network connectivity

### Out of Memory

1. Check Redis memory usage
2. Adjust `maxmemory` in docker-compose.yml
3. Clear old execution history

---

## Performance Tips

1. **Use Redis for Caching**: Significantly improves response times
2. **Enable Connection Pooling**: Configure PostgreSQL connection limits
3. **Scale Horizontally**: Add more replicas in Kubernetes
4. **Monitor Metrics**: Use Grafana to identify bottlenecks
5. **Optimize Workflows**: Reduce unnecessary agent calls

---

## Security Checklist

- [x] All credentials externalized to .env file (not in version control)
- [ ] Generate strong passwords using secure random generators
- [ ] Use strong JWT_SECRET and NEXTAUTH_SECRET (minimum 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Implement RBAC policies
- [ ] Use secrets management (e.g., Vault) for production deployments

---

## Next Steps

1. **Read the Full Documentation**: See `docs/` directory
2. **Explore Example Workflows**: Check `examples/` directory
3. **Join the Community**: GitHub Discussions
4. **Report Issues**: GitHub Issues
5. **Contribute**: See `CONTRIBUTING.md`

---

## Support

- **Email:** tech-support@us-spurs.gov
- **Documentation:** https://docs.ai-swarm-orchestrator.us-spurs.gov
- **GitHub:** https://github.com/UniversalStandards/SWARM

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Redis     │────▶│  PostgreSQL │
│  Frontend   │     │   Cache     │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────┐
│              AI Orchestration Engine                 │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │ Claude │  │  GPT-4 │  │ Gemini │  │ Ollama │  │
│  └────────┘  └────────┘  └────────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Prometheus  │     │   Grafana   │     │   Jaeger    │
│  Metrics    │     │  Dashboard  │     │   Tracing   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

**US-SPURS | Department of Special Projects and Unified Response Services**
