module.exports = {
  apps: [
    {
      name: 'medusa',
      script: 'yarn',
      args: 'start',
      autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       interpreter: "/bin/bash",
    }
  ],
};
