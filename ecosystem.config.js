module.exports = {
  apps: [
    {
      name: 'medusa-backend',
      cwd: './apps/medusa',
      script: 'bash',
      args: '-c "yarn start"',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8102,
      },
    },
    {
      name: 'medusa-storefront',
      cwd: './apps/storefront',
      script: 'bash',
      args: '-c "yarn start"',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8109,
      },
    },
  ],
};
