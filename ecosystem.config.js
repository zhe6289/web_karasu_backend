module.exports = {
  apps: [
    {
      name: 'NestServer',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_stage: {
        NODE_ENV: 'stage',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
