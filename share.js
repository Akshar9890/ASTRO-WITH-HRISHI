#!/usr/bin/env node
/**
 * share.js — Build frontend + start backend + open a public tunnel
 * Run: node share.js
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

const PORT = 5001;
const SUBDOMAIN = 'astro-with-hrishi'; // requested subdomain (may not always be available)

console.log('\n✦ Astro With Hrishi — Public Share\n');

// 1. Build frontend into backend/public
console.log('📦 Building frontend...');
try {
  execSync('npm run build', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });
  console.log('✅ Frontend built\n');
} catch (e) {
  console.error('❌ Build failed:', e.message);
  process.exit(1);
}

// 2. Start backend
console.log('🚀 Starting backend on port', PORT, '...');
const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env },
});

server.on('error', (e) => { console.error('Backend error:', e.message); process.exit(1); });

// 3. Wait for backend to be ready, then start tunnel
setTimeout(async () => {
  try {
    const localtunnel = require(path.join(__dirname, 'frontend', 'node_modules', 'localtunnel'));
    console.log('\n🌐 Opening public tunnel...');

    const tunnel = await localtunnel({
      port: PORT,
      subdomain: SUBDOMAIN,
    });

    console.log('\n' + '═'.repeat(60));
    console.log('  ✦ YOUR PUBLIC LINK:');
    console.log(`\n     👉  ${tunnel.url}\n`);
    console.log('  Share this link with anyone — it works worldwide!');
    console.log('  Admin panel: ' + tunnel.url + '/admin');
    console.log('  Admin key  : hrishi2025');
    console.log('═'.repeat(60) + '\n');

    tunnel.on('close', () => {
      console.log('\n⚠ Tunnel closed. Run node share.js again to reopen.');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
    });

    // Keep alive
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down...');
      tunnel.close();
      server.kill();
      process.exit(0);
    });

  } catch (e) {
    console.error('❌ Tunnel failed:', e.message);
    console.log('\nAlternative: Install ngrok from https://ngrok.com and run:');
    console.log(`  ngrok http ${PORT}\n`);
  }
}, 3000);
