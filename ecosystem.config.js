module.exports = {
  apps: [
    {
      name: 'medusa-backend',
      cwd: './apps/medusa',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 7901
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 7901
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/medusa-error.log',
      out_file: './logs/medusa-out.log',
      log_file: './logs/medusa-combined.log',
      time: true
    },
    {
      name: 'storefront',
      cwd: './apps/storefront',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 7109
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 7109
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/storefront-error.log',
      out_file: './logs/storefront-out.log',
      log_file: './logs/storefront-combined.log',
      time: true
    }
  ],
};
