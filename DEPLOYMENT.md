# SWARM Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- GitHub OAuth App credentials
- Google OAuth App credentials (optional)
- AI Provider API Keys (OpenAI, Anthropic, Google)

## Quick Start with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/UniversalStandards/SWARM.git
cd SWARM
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 3. Build and Run

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## Manual Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Start the Server

```bash
npm start
```

## Production Deployment

### Environment Configuration

For production, ensure you set:

```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=a-very-strong-random-secret
```

### Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Secret Keys**: Use strong, random secrets
3. **API Keys**: Store API keys securely (environment variables, secrets manager)
4. **Rate Limiting**: Enable rate limiting on API routes
5. **CORS**: Configure appropriate CORS policies

### Scaling

For horizontal scaling:

1. **Redis**: Use Redis for session storage and caching
2. **Load Balancer**: Deploy behind a load balancer
3. **Worker Processes**: Run multiple worker processes for agent execution
4. **Database**: Use PostgreSQL or similar for persistent storage

### Docker Swarm Deployment

```bash
docker stack deploy -c docker-compose.yml swarm
```

### Kubernetes Deployment

Kubernetes manifests can be found in the `/k8s` directory (coming soon).

## Monitoring

### Health Check Endpoint

```
GET /api/health
```

### Logs

View application logs:

```bash
docker-compose logs -f app
```

### Metrics

Metrics are exposed at `/api/metrics` (Prometheus format)

## Troubleshooting

### Common Issues

**Issue**: OAuth redirect errors
- **Solution**: Verify `NEXTAUTH_URL` matches your domain and protocol

**Issue**: AI provider errors
- **Solution**: Check API keys are valid and have sufficient quota

**Issue**: Redis connection errors
- **Solution**: Ensure Redis is running and accessible

### Support

For issues and questions:
- GitHub Issues: https://github.com/UniversalStandards/SWARM/issues
- Documentation: See README.md

## Backup and Recovery

### Backup

```bash
# Backup Redis data
docker-compose exec redis redis-cli save

# Backup volume
docker run --rm -v swarm_redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz /data
```

### Restore

```bash
# Restore from backup
docker run --rm -v swarm_redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-backup.tar.gz -C /
```
