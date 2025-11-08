#!/bin/bash
# AWS EC2 Linux Instance Setup Script for SWARM AI Orchestrator
# This script automates the complete setup of the application on a fresh Amazon Linux 2 or Ubuntu EC2 instance

set -e

echo "=========================================="
echo "SWARM AI Orchestrator - EC2 Setup"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    print_error "Cannot detect OS"
    exit 1
fi

print_status "Detected OS: $OS"

# Update system packages
print_status "Updating system packages..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    sudo yum update -y
    sudo yum install -y git curl wget
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get update -y
    sudo apt-get upgrade -y
    sudo apt-get install -y git curl wget build-essential
else
    print_error "Unsupported OS: $OS"
    exit 1
fi

# Install Node.js 18+
print_status "Installing Node.js 18..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
elif [ "$OS" = "ubuntu" ]; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verify Node.js installation
NODE_VERSION=$(node --version)
print_status "Node.js installed: $NODE_VERSION"

# Install npm packages globally
print_status "Installing global npm packages..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    sudo amazon-linux-extras install -y nginx1
    sudo yum install -y nginx
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y nginx
fi

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
print_status "Configuring firewall..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
fi

# Create application directory
APP_DIR="/opt/swarm"
print_status "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone repository (if not already present)
if [ ! -d "$APP_DIR/.git" ]; then
    print_status "Cloning SWARM repository..."
    cd /opt
    sudo git clone https://github.com/UniversalStandards/SWARM.git swarm
    sudo chown -R $USER:$USER $APP_DIR
fi

# Navigate to application directory
cd $APP_DIR

# Install dependencies
print_status "Installing application dependencies..."
npm install

# Create environment file
print_status "Creating environment configuration..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    print_warning "Please edit .env.local with your API keys and configuration"
fi

# Build application
print_status "Building application..."
npm run build

# Setup PM2 ecosystem file
print_status "Setting up PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'swarm-orchestrator',
    script: 'npm',
    args: 'start',
    cwd: '/opt/swarm',
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/swarm/error.log',
    out_file: '/var/log/swarm/out.log',
    log_file: '/var/log/swarm/combined.log',
    time: true
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/swarm
sudo chown -R $USER:$USER /var/log/swarm

# Configure Nginx
print_status "Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/conf.d/swarm.conf > /dev/null << 'EOF'
upstream swarm_backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name _;

    client_max_body_size 100M;

    location / {
        proxy_pass http://swarm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://swarm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Setup systemd service
print_status "Setting up systemd service..."
sudo tee /etc/systemd/system/swarm.service > /dev/null << EOF
[Unit]
Description=SWARM AI Orchestrator
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable swarm.service

# Start application with PM2
print_status "Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

print_status "=========================================="
print_status "Installation completed successfully!"
print_status "=========================================="
print_status ""
print_status "Next steps:"
print_status "1. Edit environment file: nano /opt/swarm/.env.local"
print_status "2. Add your API keys and configuration"
print_status "3. Restart the application: pm2 restart swarm-orchestrator"
print_status "4. Check status: pm2 status"
print_status "5. View logs: pm2 logs swarm-orchestrator"
print_status ""
print_status "To configure SSL/TLS, run: sudo ./setup-ssl.sh your-domain.com"
print_status ""
print_status "Access your application at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
