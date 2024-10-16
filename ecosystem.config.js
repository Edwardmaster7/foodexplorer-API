module.exports = {
  apps : [{
    name: 'foodxplorer_api',
    script: './src/server.js',
    instances: "max",
    exec_mode: 'cluster',
    watch: false,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};
