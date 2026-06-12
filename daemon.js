const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PID_FILE = '/home/z/my-project/.server.pid';
const LOG_FILE = '/home/z/my-project/.server.log';

function startServer() {
  const env = { ...process.env, HOSTNAME: '0.0.0.0', PORT: '3000', NODE_ENV: 'production' };
  
  const child = spawn('node', ['.next/standalone/server.js'], {
    cwd: '/home/z/my-project',
    env,
    stdio: ['ignore', fs.openSync(LOG_FILE, 'a'), fs.openSync(LOG_FILE, 'a')],
    detached: true
  });
  
  child.unref();
  fs.writeFileSync(PID_FILE, child.pid.toString());
  console.log('Server started with PID:', child.pid);
  
  child.on('error', (err) => {
    fs.appendFileSync(LOG_FILE, `[ERROR] ${err.message}\n`);
  });
  
  child.on('exit', (code, signal) => {
    fs.appendFileSync(LOG_FILE, `[EXIT] code=${code} signal=${signal}\n`);
    // Auto restart after 3 seconds
    setTimeout(startServer, 3000);
  });
}

startServer();
