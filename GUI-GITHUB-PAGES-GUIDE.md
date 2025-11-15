# 🎨 GUI Access via GitHub Pages

## Overview

The AI Swarm Orchestrator includes a **robust, enterprise-grade Next.js GUI** that can be accessed via **GitHub Pages**. This provides a beautiful, interactive interface for managing your AI agent workflows without needing to run a local server.

## ✨ GUI Features

### Dashboard
- **Workflow Overview**: Visual representation of all active workflows
- **Agent Status**: Real-time monitoring of agent execution
- **Task Management**: Create, edit, and manage tasks
- **Execution History**: Complete audit trail of all executions

### Workflow Designer
- **Drag-and-Drop Interface**: Build workflows visually
- **Node Types**: Agent, AI Task, Condition, Parallel, GitHub Action
- **Connection Management**: Draw connections between nodes
- **Configuration Panels**: Configure each node with detailed settings

### Agent Management
- **Agent Library**: Browse 6+ specialized agent types
- **Custom Agents**: Create your own agent configurations
- **Agent Monitoring**: Track agent performance and status
- **Resource Usage**: Monitor API calls and costs

### Real-Time Monitoring
- **Live Updates**: See execution progress in real-time
- **Log Viewer**: Stream logs from running workflows
- **Status Indicators**: Visual status for all components
- **Error Tracking**: Immediate notification of failures

### GitHub Integration
- **Repository Browser**: Access your GitHub repos
- **Issue Management**: View and create issues directly
- **PR Viewer**: Review pull requests from agents
- **Project Boards**: Visual project tracking

### AI Provider Management
- **Multi-Provider Support**: OpenAI, Anthropic, Google
- **API Key Configuration**: Secure credential management
- **Model Selection**: Choose specific AI models
- **Usage Tracking**: Monitor API usage and costs

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

The GUI is automatically deployed to GitHub Pages when you push to the main branch!

**Steps:**

1. **Enable GitHub Pages**
   ```bash
   # Go to your repository Settings
   # Navigate to Pages
   # Source: Deploy from a branch
   # Branch: gh-pages
   # Folder: / (root)
   # Click Save
   ```

2. **Push to Main Branch**
   ```bash
   git push origin main
   ```

3. **Wait for Deployment**
   - Go to Actions tab
   - Wait for "Universal GitHub Pages Deploy" workflow
   - Usually takes 2-5 minutes

4. **Access Your GUI**
   ```
   https://YOUR-USERNAME.github.io/SWARM/
   ```

### Manual Deployment

You can also deploy manually:

```bash
# Build static export
npm run export

# The `out` directory contains your static site
# Deploy to GitHub Pages:
gh workflow run github-pages.yaml
```

## 🌐 Accessing the GUI

### Public Repository

If your repository is public:

```
https://YOUR-USERNAME.github.io/SWARM/
```

Example:
```
https://UniversalStandards.github.io/SWARM/
```

### Custom Domain (Optional)

You can use a custom domain:

1. Go to Settings → Pages
2. Enter your custom domain
3. Create DNS records:
   ```
   Type: CNAME
   Host: www
   Value: YOUR-USERNAME.github.io
   ```

### Direct Links

Once deployed, you can access:

- **Home**: `https://YOUR-USERNAME.github.io/SWARM/`
- **Dashboard**: `https://YOUR-USERNAME.github.io/SWARM/dashboard`
- **Workflows**: `https://YOUR-USERNAME.github.io/SWARM/workflows`
- **Agents**: `https://YOUR-USERNAME.github.io/SWARM/agents`
- **Settings**: `https://YOUR-USERNAME.github.io/SWARM/settings`

## 📱 Features & Screenshots

### 1. Landing Page

Beautiful hero section with:
- Feature highlights
- Quick start button
- Statistics overview
- Animated effects

### 2. Dashboard

Comprehensive dashboard showing:
- Active workflows (visual cards)
- Recent executions (timeline)
- Agent status (real-time)
- Quick actions (create, monitor)

### 3. Workflow Designer

Interactive workflow builder:
- **Canvas**: Drag nodes, draw connections
- **Palette**: All node types available
- **Properties**: Configure node settings
- **Preview**: Test workflow before running
- **Export**: Save as JSON

### 4. Agent Manager

Manage all agents:
- **Grid View**: All available agents
- **Detail View**: Agent configuration
- **Create New**: Custom agent builder
- **Deployment**: Deploy agents to workflows

### 5. Monitoring Dashboard

Real-time monitoring:
- **Status Board**: All active executions
- **Log Stream**: Live execution logs
- **Metrics**: Performance statistics
- **Alerts**: Failure notifications

### 6. Settings Panel

Configure everything:
- **API Keys**: Add OpenAI, Anthropic, Google keys
- **GitHub Auth**: Connect your GitHub account
- **Preferences**: UI customization
- **Advanced**: Expert settings

## 🎨 UI/UX Features

### Modern Design
- **Dark Theme**: Professional dark mode interface
- **Glassmorphism**: Modern frosted glass effects
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Works on desktop, tablet, mobile

### Interactive Elements
- **Drag & Drop**: Intuitive workflow building
- **Real-time Updates**: Live status changes
- **Toast Notifications**: Non-intrusive alerts
- **Loading States**: Clear progress indicators

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels
- **High Contrast**: Readable colors
- **Focus Indicators**: Clear focus states

## 🔧 Configuration

### Environment Variables

#### ⚠️ Security Note: GitHub Pages Limitations

**IMPORTANT**: GitHub Pages serves static files only. You **CANNOT** securely use API keys with GitHub Pages deployment because:
- There is no backend server to protect secrets
- All environment variables with `NEXT_PUBLIC_` prefix are embedded in the client-side JavaScript bundle
- Anyone can inspect the browser code and extract your API keys

#### Secure Configuration Options

**Option 1: For Development/Testing Only (Local)**
```bash
# These keys should NEVER be exposed publicly
# Use these ONLY for local development with `npm run dev`
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_AI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
```

**Option 2: For Production with Backend API (Recommended)**

Deploy to a platform with backend support (Vercel, AWS, etc.) and use API routes:
1. Store sensitive keys as server-side environment variables (without `NEXT_PUBLIC_` prefix)
2. Create API proxy routes in `app/api/` that call AI services
3. Frontend makes requests to your API routes, not directly to AI providers

**Option 3: GitHub Pages (Static Only - Limited Functionality)**
```bash
# Only non-sensitive configuration for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/SWARM  # If repo name is not at root
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=false  # Disable features requiring API keys
NEXT_PUBLIC_API_URL=https://your-backend-api.com  # Link to separate backend
```

For GitHub Pages, sensitive operations must be handled by:
- A separate backend service you control
- Serverless functions (AWS Lambda, Cloudflare Workers, etc.)
- GitHub Actions workflows (for automated tasks)

### Base Path Configuration

If your repository isn't at the root:

1. Edit `next.config.js`:
   ```javascript
   module.exports = {
     basePath: '/SWARM',
     assetPrefix: '/SWARM/',
     // ... rest of config
   }
   ```

2. Rebuild:
   ```bash
   npm run export
   ```

## 🌟 Two Deployment Options

The AI Swarm Orchestrator offers **two ways to work**:

### Option 1: GitHub-Native (No GUI Needed)

- ✅ Works entirely through GitHub Issues
- ✅ No server required
- ✅ Create tasks via issue templates
- ✅ Monitor in Actions tab
- ✅ Results in comments and PRs

**Best for:**
- Quick automation
- CI/CD integration
- Minimal setup
- GitHub-first workflows

### Option 2: GUI via GitHub Pages

- ✅ Beautiful visual interface
- ✅ Drag-and-drop workflow builder
- ✅ Real-time monitoring dashboard
- ✅ Advanced configuration
- ✅ Hosted on GitHub Pages (free!)

**Best for:**
- Complex workflows
- Visual workflow design
- Team collaboration
- Rich monitoring needs

### Using Both Together!

**Best approach**: Use both!

1. **Design in GUI**: Build workflows visually
2. **Export JSON**: Download workflow configuration
3. **Deploy via Issues**: Create issue with JSON
4. **Monitor in GUI**: Watch execution in real-time

## 📊 Comparison

| Feature | GitHub-Native | GUI |
|---------|---------------|-----|
| **Setup** | Zero config | Enable Pages |
| **Interface** | GitHub Issues | Beautiful UI |
| **Workflow Creation** | JSON in issues | Drag-and-drop |
| **Monitoring** | Actions/Comments | Real-time dashboard |
| **Cost** | Free | Free (Pages) |
| **Learning Curve** | Medium | Easy |
| **Power** | Full | Full |
| **Best For** | Automation | Visualization |

## 🚀 Quick Start

### 1. Enable GitHub Pages

```bash
# Via GitHub UI
Settings → Pages → Source: gh-pages branch

# Or via CLI
gh api repos/OWNER/REPO/pages -X POST -f source[branch]=gh-pages
```

### 2. Deploy

Push to main branch or run:
```bash
gh workflow run github-pages.yaml
```

### 3. Access

Wait 2-5 minutes, then visit:
```
https://YOUR-USERNAME.github.io/SWARM/
```

### 4. Configure

1. Click "Setup" or "Settings"
2. Add your API keys
3. Connect GitHub (optional)
4. Start creating workflows!

## 🎯 Use Cases

### Scenario 1: Visual Workflow Design

**Want to design complex workflows visually?**

1. Open GUI in browser
2. Use drag-and-drop designer
3. Configure nodes visually
4. Export JSON
5. Deploy via issue or directly from GUI

### Scenario 2: Team Collaboration

**Multiple team members working together?**

1. Share GUI URL with team
2. Everyone accesses same deployment
3. Real-time status visible to all
4. Collaborate on workflow design
5. Monitor executions together

### Scenario 3: Client Demonstrations

**Need to demo the system?**

1. Open GUI on projector/screen
2. Show beautiful interface
3. Create workflow in real-time
4. Execute and monitor live
5. Impress with visual feedback

### Scenario 4: Development

**Developing new workflows?**

1. Use GUI for rapid prototyping
2. Test in visual environment
3. Debug with log viewer
4. Iterate quickly
5. Export to production

## 🔒 Security

### ⚠️ CRITICAL: API Key Security

**Never expose API keys in client-side code!**

#### ❌ UNSAFE - DO NOT DO THIS:
```bash
# These expose your keys publicly in the browser bundle
NEXT_PUBLIC_OPENAI_API_KEY=sk-...     # ❌ NEVER USE
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-...  # ❌ NEVER USE
NEXT_PUBLIC_GITHUB_TOKEN=ghp_...      # ❌ NEVER USE
```

Anyone visiting your site can:
- Open browser DevTools
- View your compiled JavaScript
- Extract and steal your API keys
- Use your keys to make API calls at your expense

#### ✅ SAFE - Backend Only:
```bash
# Server-side only (not accessible in browser)
OPENAI_API_KEY=sk-...      # ✅ Safe - backend only
ANTHROPIC_API_KEY=sk-...   # ✅ Safe - backend only
GITHUB_TOKEN=ghp_...       # ✅ Safe - backend only
```

### GitHub Pages Deployment Considerations

GitHub Pages is a **static file host** with no backend:
- ❌ Cannot securely store API keys
- ❌ Cannot make authenticated API calls server-side
- ❌ All JavaScript runs in the browser
- ✅ Good for public, non-sensitive content
- ✅ Can connect to a separate backend API

### Secure Production Deployment

For production with AI features, use platforms with backend support:

1. **Vercel/Netlify** (Recommended)
   - Deploy the full Next.js app
   - Store API keys as environment variables
   - Use Next.js API routes as secure proxies

2. **AWS/GCP/Azure**
   - Deploy with EC2, App Engine, or Azure App Service
   - Keep API keys in secrets manager
   - Use serverless functions for API calls

3. **Hybrid Approach**
   - Host static UI on GitHub Pages
   - Deploy separate backend API
   - Configure `NEXT_PUBLIC_API_URL` to point to your backend

### Repository Secrets

GitHub repository secrets are for **GitHub Actions workflows**, not for static websites:

```bash
# These are for CI/CD workflows, not client-side code
gh secret set OPENAI_API_KEY -b"your-key-here"
```

### CORS and Client-Side Security

When using GitHub Pages:
- All code runs in the user's browser
- No server-side execution
- Cannot hide sensitive credentials
- Use for demos and public tools only

## 🐛 Troubleshooting

### Issue: 404 Error

**Problem**: Page shows 404

**Solutions**:
1. Check GitHub Pages is enabled
2. Wait 5 minutes after deployment
3. Clear browser cache
4. Check branch is `gh-pages`

### Issue: Blank Page

**Problem**: Page loads but blank

**Solutions**:
1. Check browser console for errors
2. Verify `basePath` in next.config.js
3. Check `.nojekyll` file exists
4. Rebuild with `npm run export`

### Issue: API Errors

**Problem**: Features not working

**Solutions**:
1. Add API keys to repository secrets
2. Check environment variables loaded
3. Verify API keys are valid
4. Check browser network tab

### Issue: Slow Loading

**Problem**: GUI loads slowly

**Solutions**:
1. Enable CDN (GitHub Pages uses one)
2. Check image optimization
3. Verify bundle size
4. Use browser caching

## 📚 Additional Resources

- [Next.js Static Export Docs](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)

## 🎓 Best Practices

### 1. Regular Updates

Keep the deployment fresh:
```bash
# Auto-deploy on every push to main
# Already configured in github-pages.yaml
```

### 2. Testing

Test before deploying:
```bash
# Local test
npm run export
npm run export:serve

# Open http://localhost:3000
```

### 3. Monitoring

Monitor deployment status:
```bash
# Check workflow runs
gh run list --workflow=github-pages.yaml

# View specific run
gh run view RUN_ID
```

### 4. Backup

Keep a backup of configuration:
```bash
# Export current workflows
# Download from GUI → Settings → Export
```

## 🎉 Summary

**The AI Swarm Orchestrator includes:**

✅ **Robust Next.js GUI** with enterprise features
✅ **Automatic GitHub Pages deployment**
✅ **Beautiful, modern interface**
✅ **Drag-and-drop workflow builder**
✅ **Real-time monitoring dashboard**
✅ **Free hosting on GitHub Pages**
✅ **Works alongside GitHub-native system**

**Access your GUI at:**
```
https://YOUR-USERNAME.github.io/SWARM/
```

**Two ways to work:**
1. **GitHub-Native**: Issues, Actions, Zero setup
2. **GUI**: Visual interface, GitHub Pages, Beautiful UX

**Best of both worlds!** 🚀

---

*Enterprise-grade GUI, completely free, hosted on GitHub Pages*
