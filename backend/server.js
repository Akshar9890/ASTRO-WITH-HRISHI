require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const fs        = require('fs');

const consultationsRouter = require('./routes/consultations');
const ordersRouter        = require('./routes/orders');
const adminRouter         = require('./routes/admin');
const analyticsRouter     = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Rate limiting — ONLY on public form endpoints, NOT admin ──────────────────
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30,                   // 30 submissions per IP per hour
  skip: (req) => req.method === 'GET', // only limit POST/PATCH, never GET polling
  message: { error: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply form limiter only to public POST routes
app.use('/api/consultations', formLimiter);
app.use('/api/orders', formLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/consultations', consultationsRouter);
app.use('/api/orders',        ordersRouter);
app.use('/api/admin',         adminRouter);   // NO rate limit on admin
app.use('/api/analytics',     analyticsRouter);

// ── Serve built frontend (production) ────────────────────────────────────────
const PUBLIC_DIR = path.join(__dirname, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
  // SPA fallback — serve index.html for all non-API routes
  app.get(/^(?!\/api|\/health).*$/, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ Astro With Hrishi API → http://localhost:${PORT}`);
  console.log(`  Admin key : ${process.env.ADMIN_SECRET}`);
  console.log(`  Health    : GET  /health`);
  console.log(`  Leads     : POST /api/consultations`);
  console.log(`  Orders    : POST /api/orders`);
  console.log(`  Admin     : GET  /api/admin/stats  [x-admin-key header]\n`);
});
