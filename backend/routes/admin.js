const router = require('express').Router();
const { getDb, run, get, all } = require('../db');
const { requireAdmin } = require('../middleware/validate');

// Protect all admin routes
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    await getDb();
    const consultations = get('SELECT COUNT(*) as c FROM consultations')?.c || 0;
    const newLeads      = get(`SELECT COUNT(*) as c FROM consultations WHERE status='new'`)?.c || 0;
    const todayLeads    = get(`SELECT COUNT(*) as c FROM consultations WHERE date(created_at)=date('now','localtime')`)?.c || 0;
    const orders        = get('SELECT COUNT(*) as c FROM orders')?.c || 0;
    const todayOrders   = get(`SELECT COUNT(*) as c FROM orders WHERE date(created_at)=date('now','localtime')`)?.c || 0;
    const revenue       = get(`SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status!='pending'`)?.s || 0;

    res.json({ consultations, newLeads, todayLeads, orders, todayOrders, revenue });
  } catch (e) {
    console.error('[ADMIN STATS]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/consultations
router.get('/consultations', async (req, res) => {
  try {
    await getDb();
    const { status, limit = 100, offset = 0 } = req.query;
    let sql = 'SELECT * FROM consultations';
    const params = [];
    if (status) { sql += ' WHERE status=?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows  = all(sql, params);
    const total = get('SELECT COUNT(*) as c FROM consultations')?.c || 0;
    res.json({ total, rows });
  } catch (e) {
    console.error('[ADMIN LEADS]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/consultations/:id
router.patch('/consultations/:id', async (req, res) => {
  try {
    await getDb();
    const { status, notes } = req.body;
    const allowed = ['new', 'contacted', 'closed'];
    if (status && !allowed.includes(status))
      return res.status(400).json({ error: 'Invalid status value' });
    if (status)
      run('UPDATE consultations SET status=? WHERE id=?', [status, req.params.id]);
    if (notes !== undefined)
      run('UPDATE consultations SET notes=? WHERE id=?', [notes, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    await getDb();
    const { status, limit = 100, offset = 0 } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];
    if (status) { sql += ' WHERE status=?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows  = all(sql, params).map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
    const total = get('SELECT COUNT(*) as c FROM orders')?.c || 0;
    res.json({ total, rows });
  } catch (e) {
    console.error('[ADMIN ORDERS]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/orders/:id
router.patch('/orders/:id', async (req, res) => {
  try {
    await getDb();
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!status || !allowed.includes(status))
      return res.status(400).json({ error: 'Invalid status value' });
    run('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
