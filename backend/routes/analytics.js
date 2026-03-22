const router = require('express').Router();
const { getDb, run } = require('../db');

router.post('/pageview', async (req, res) => {
  try {
    await getDb();
    const page     = String(req.body?.page     || '/').slice(0, 200);
    const referrer = String(req.body?.referrer || '').slice(0, 500);
    const ua       = String(req.headers['user-agent'] || '').slice(0, 300);
    run('INSERT INTO page_views (page, referrer, ua) VALUES (?, ?, ?)', [page, referrer, ua]);
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

module.exports = router;
