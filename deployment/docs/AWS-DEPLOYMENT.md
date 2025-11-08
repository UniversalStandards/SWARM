# AWS EC2 Deployment Guide for SWARM AI Orchestrator

This guide provides comprehensive instructions for deploying the SWARM AI Orchestrator on AWS EC2 Linux instances.

## Prerequisites

- AWS Account with EC2 access
- Basic knowledge of AWS services
- SSH key pair for EC2 access
- Domain name (optional, for SSL/TLS)

## AWS EC2 Instance Requirements

### Recommended Instance Types

- **Development/Testing**: t3.medium (2 vCPU, 4 GB RAM)
- **Production (Small)**: t3.large (2 vCPU, 8 GB RAM)
- **Production (Medium)**: t3.xlarge (4 vCPU, 16 GB RAM)
- **Production (Large)**: m5.2xlarge (8 vCPU, 32 GB RAM)

### Operating System

- Amazon Linux 2023
- Amazon Linux 2
- Ubuntu 22.04 LTS
- Ubuntu 20.04 LTS

### Storage

- Minimum 30 GB GP3 SSD
- Recommended 50+ GB for production

## Step 1: Launch EC2 Instance

### Using AWS Console

1. Navigate to EC2 Dashboard
2. Click "Launch Instance"
3. Configure instance:
   - **Name**: SWARM-Orchestrator
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04
   - **Instance Type**: t3.large (or as per requirements)
   - **Key Pair**: Select or create a new key pair
   - **Network**: Default VPC or custom VPC
   - **Storage**: 50 GB GP3 SSD
   - **Security Group**: Create new with the following rules:

### Security Group Configuration

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP access |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS access |
| Custom TCP | TCP | 3000 | Your IP | Development access (optional) |

### Using AWS CLI

```bash
# Create security group
aws ec2 create-security-group \
  --group-name swarm-orchestrator-sg \
  --description "Security group for SWARM AI Orchestrator"

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-name swarm-orchestrator-sg \
  --protocol tcp --port 22 --cidr YOUR_IP/32

aws ec2 authorize-security-group-ingress \
  --group-name swarm-orchestrator-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name swarm-orchestrator-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# Launch instance
aws ec2 run-instances \
  --image-id ami-xxxxxxxxx \
  --instance-type t3.large \
  --key-name your-key-pair \
  --security-groups swarm-orchestrator-sg \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":50,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=SWARM-Orchestrator}]'
```

## Step 2: Connect to EC2 Instance

```bash
# Replace with your key file and instance IP
ssh -i your-key-pair.pem ec2-user@your-instance-ip

# For Ubuntu instances, use:
ssh -i your-key-pair.pem ubuntu@your-instance-ip
```

## Step 3: Run Automated Setup Script

```bash
# Download and run the setup script
curl -o setup-ec2.sh https://raw.githubusercontent.com/UniversalStandards/SWARM/main/deployment/scripts/setup-ec2.sh
chmod +x setup-ec2.sh
sudo ./setup-ec2.sh
```

The script will automatically:
- Update system packages
- Install Node.js 18+
- Install Nginx
- Install PM2
- Clone the repository
- Install dependencies
- Build the application
- Configure Nginx reverse proxy
- Setup systemd service
- Start the application

## Step 4: Configure Environment Variables

```bash
# Edit the environment file
cd /opt/swarm
nano .env.local
```

Add your configuration:

```env
# AI Provider API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# GitHub OAuth Configuration (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/callback/github

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-min-32-characters
NEXTAUTH_URL=https://your-domain.com

# Database (Optional)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
NEXT_PUBLIC_ENABLE_REALTIME=true
```

After editing, restart the application:

```bash
pm2 restart swarm-orchestrator
```

## Step 5: Setup SSL/TLS (Recommended for Production)

### Prerequisites
- Domain name pointing to your EC2 instance IP
- Open ports 80 and 443 in security group

### Run SSL Setup Script

```bash
cd /opt/swarm/deployment/scripts
sudo ./setup-ssl.sh your-domain.com
```

The script will:
- Install Certbot
- Obtain SSL certificate from Let's Encrypt
- Configure Nginx with SSL
- Setup auto-renewal

## Step 6: Verify Installation

### Check Application Status

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs swarm-orchestrator

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Test Application

```bash
# Get instance public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Test HTTP endpoint
curl http://your-instance-ip

# Test with domain (if SSL configured)
curl https://your-domain.com
```

## Step 7: Configure Auto-Start on Reboot

The systemd service is already configured to start automatically. Verify:

```bash
sudo systemctl is-enabled swarm.service
```

Test reboot:

```bash
sudo reboot

# After reboot, verify services
pm2 status
sudo systemctl status nginx
```

## Monitoring and Maintenance

### View Application Logs

```bash
# PM2 logs
pm2 logs swarm-orchestrator

# Specific log files
tail -f /var/log/swarm/error.log
tail -f /var/log/swarm/out.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Monitoring

```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

### Application Management

```bash
# Restart application
pm2 restart swarm-orchestrator

# Stop application
pm2 stop swarm-orchestrator

# Start application
pm2 start swarm-orchestrator

# View details
pm2 show swarm-orchestrator

# Update application
cd /opt/swarm
git pull
npm install
npm run build
pm2 restart swarm-orchestrator
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View configuration
cat /etc/nginx/conf.d/swarm.conf
```

## Backup and Disaster Recovery

### Backup Important Files

```bash
# Create backup directory
mkdir -p ~/backups

# Backup environment file
cp /opt/swarm/.env.local ~/backups/

# Backup custom configurations
tar -czf ~/backups/swarm-config-$(date +%Y%m%d).tar.gz \
  /opt/swarm/.env.local \
  /etc/nginx/conf.d/swarm.conf \
  /etc/systemd/system/swarm.service
```

### Create AMI Image

1. Go to EC2 Dashboard
2. Select your instance
3. Actions → Image and templates → Create image
4. Name: SWARM-Orchestrator-Backup-[DATE]
5. Click "Create image"

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs swarm-orchestrator --lines 100

# Check system logs
sudo journalctl -u swarm.service -n 50

# Verify Node.js version
node --version

# Reinstall dependencies
cd /opt/swarm
rm -rf node_modules
npm install
npm run build
pm2 restart swarm-orchestrator
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# View renewal logs
sudo cat /var/log/letsencrypt/letsencrypt.log
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Adjust PM2 instances
pm2 delete swarm-orchestrator
pm2 start ecosystem.config.js

# Modify ecosystem.config.js to use fewer instances or less memory
nano /opt/swarm/ecosystem.config.js
```

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo yum update -y  # Amazon Linux
   sudo apt-get update && sudo apt-get upgrade -y  # Ubuntu
   ```

2. **Use SSH keys only**: Disable password authentication
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

3. **Configure firewall**:
   ```bash
   # Amazon Linux
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

4. **Regular backups**: Schedule automated backups using AWS Backup or scripts

5. **Monitor logs**: Setup CloudWatch for log monitoring

6. **Use IAM roles**: Instead of hardcoding AWS credentials

7. **Enable AWS CloudTrail**: For audit logging

## Scaling Considerations

### Vertical Scaling (Increase Instance Size)

1. Stop application
2. Stop instance
3. Change instance type
4. Start instance
5. Start application

### Horizontal Scaling (Multiple Instances)

1. Setup Application Load Balancer
2. Create Auto Scaling Group
3. Configure health checks
4. Deploy application to multiple instances

### Database Considerations

For production workloads, consider:
- Amazon RDS for PostgreSQL
- Amazon ElastiCache for Redis
- Amazon S3 for file storage

## Cost Optimization

1. **Use Reserved Instances** for 1-3 year commitments (up to 75% savings)
2. **Enable detailed monitoring** to identify optimization opportunities
3. **Use Auto Scaling** to scale down during low usage
4. **Configure CloudWatch alarms** for cost anomalies
5. **Use GP3 volumes** instead of GP2 for better price/performance

## Support

For issues and questions:
- GitHub Issues: https://github.com/UniversalStandards/SWARM/issues
- Documentation: Check repository README
- AWS Support: Use AWS Support Center for infrastructure issues

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
