module.exports = {
    apps: [
      {
        name: 'ALOP2',
        port: '3001',
        exec_mode: 'cluster',
        instances: '2',
        script: './index.mjs'
      }
    ]
  }