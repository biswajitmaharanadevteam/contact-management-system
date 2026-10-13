import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('----------------------------------------------------');
console.log('🚀 Starting Contact Management System Full Stack Dev');
console.log('----------------------------------------------------');

// Start Server
const serverProcess = spawn(npmCmd, ['--prefix', 'server', 'start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start Client
const clientProcess = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\nShutting down dev servers...');
  try { serverProcess.kill(); } catch {}
  try { clientProcess.kill(); } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
