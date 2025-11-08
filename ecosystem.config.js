module.exports = {
  apps: [{
    name: 'swarm-orchestrator',
    script: 'npm',
    args: 'start',
    cwd: process.cwd(),
    instances: process.env.PM2_INSTANCES || 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000
    },
    error_file: process.env.PM2_ERROR_LOG || './logs/error.log',
    out_file: process.env.PM2_OUT_LOG || './logs/out.log',
    log_file: process.env.PM2_LOG || './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 10000,
    shutdown_with_message: true
  }]
};
