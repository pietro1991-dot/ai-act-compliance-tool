module.exports = {
  apps: [{
    name: "ai-act",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: __dirname,
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
    instances: 1,
    exec_mode: "fork",
    max_memory_restart: "500M",
    error_file: "./logs/pm2/err.log",
    out_file: "./logs/pm2/out.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
  }]
};
