module.exports = {
  apps: [
    {
      name: 'k8s-minio',
      script: './dist/index.js',
      interpreter: '/usr/local/bin/node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // env: {
      //   NODE_ENV: 'production'
      // },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      merge_logs: true
    }
  ]
}
