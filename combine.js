#!/usr/bin/env node
/**
 * Combines all project source files into a single text file
 * for pasting into another AI agent.
 * Run: node combine.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'FULL_CODEBASE.txt');

const files = [
  // Config files
  '.gitignore',
  'netlify.toml',
  'render.yaml',
  'share.js',

  // Backend
  'backend/.env.example',
  'backend/package.json',
  'backend/server.js',
  'backend/db.js',
  'backend/middleware/validate.js',
  'backend/routes/consultations.js',
  'backend/routes/orders.js',
  'backend/routes/analytics.js',
  'backend/routes/appointments.js',
  'backend/routes/admin.js',

  // Frontend
  'frontend/package.json',
  'frontend/vite.config.js',
  'frontend/index.html',
  'frontend/src/main.jsx',
  'frontend/src/App.jsx',
  'frontend/src/api/client.js',
  'frontend/src/context/CartContext.jsx',
  'frontend/src/styles/global.css',
  'frontend/src/pages/Home.jsx',
  'frontend/src/pages/Home.module.css',
  'frontend/src/pages/Admin.jsx',
  'frontend/src/pages/Admin.module.css',
  'frontend/src/components/Navbar.jsx',
  'frontend/src/components/Navbar.module.css',
  'frontend/src/components/Hero.jsx',
  'frontend/src/components/Hero.module.css',
  'frontend/src/components/Services.jsx',
  'frontend/src/components/Services.module.css',
  'frontend/src/components/Shop.jsx',
  'frontend/src/components/Shop.module.css',
  'frontend/src/components/Testimonials.jsx',
  'frontend/src/components/Testimonials.module.css',
  'frontend/src/components/ConsultForm.jsx',
  'frontend/src/components/ConsultForm.module.css',
  'frontend/src/components/Location.jsx',
  'frontend/src/components/Location.module.css',
  'frontend/src/components/Footer.jsx',
  'frontend/src/components/Footer.module.css',
  'frontend/src/components/ChatBot.jsx',
  'frontend/src/components/ChatBot.module.css',
  'frontend/src/components/CartDrawer.jsx',
  'frontend/src/components/CartDrawer.module.css',
  'frontend/src/components/Cursor.jsx',
  'frontend/src/components/StarCanvas.jsx',
];

let output = `# ASTRO WITH HRISHI — FULL CODEBASE
# This is the complete source code for the Astro With Hrishi website.
# Tech Stack: React (Vite) frontend + Express.js + SQLite backend
# Total files: ${files.length}
# Generated: ${new Date().toISOString()}
${'='.repeat(80)}

## PROJECT STRUCTURE:
##   /backend    — Express.js API server with SQLite (sql.js)
##   /frontend   — React + Vite SPA
##   netlify.toml, render.yaml — deployment configs

${'='.repeat(80)}\n\n`;

let count = 0;
for (const rel of files) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    output += `\n${'─'.repeat(80)}\n## FILE: ${rel}  [NOT FOUND — SKIPPED]\n${'─'.repeat(80)}\n\n`;
    continue;
  }
  count++;
  const content = fs.readFileSync(full, 'utf-8');
  output += `${'─'.repeat(80)}\n## FILE: ${rel}\n${'─'.repeat(80)}\n${content}\n\n`;
}

output += `${'='.repeat(80)}\n# END OF CODEBASE — ${count} files included\n${'='.repeat(80)}\n`;

fs.writeFileSync(OUTPUT, output, 'utf-8');
const sizeMB = (Buffer.byteLength(output, 'utf-8') / 1024 / 1024).toFixed(2);
console.log(`\n✅ Combined ${count} files into FULL_CODEBASE.txt (${sizeMB} MB)`);
console.log(`📄 ${OUTPUT}\n`);
