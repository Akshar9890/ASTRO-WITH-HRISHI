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
    const newLeads = get(`SELECT COUNT(*) as c FROM consultations WHERE status='new'`)?.c || 0;
    const todayLeads = get(`SELECT COUNT(*) as c FROM consultations WHERE date(created_at)=date('now','localtime')`)?.c || 0;
    const orders = get('SELECT COUNT(*) as c FROM orders')?.c || 0;
    const todayOrders = get(`SELECT COUNT(*) as c FROM orders WHERE date(created_at)=date('now','localtime')`)?.c || 0;
    const revenue = get(`SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status!='pending'`)?.s || 0;

    const totalAppts = get('SELECT COUNT(*) as c FROM appointments')?.c || 0;
    const pendingAppts = get(`SELECT COUNT(*) as c FROM appointments WHERE status='pending'`)?.c || 0;
    const confirmedAppts = get(`SELECT COUNT(*) as c FROM appointments WHERE status='confirmed'`)?.c || 0;
    const todayAppts = get(`SELECT COUNT(*) as c FROM appointments WHERE date(appt_date)=date('now','localtime')`)?.c || 0;

    res.json({
      consultations, newLeads, todayLeads, orders, todayOrders, revenue,
      totalAppts, pendingAppts, confirmedAppts, todayAppts
    });
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

    const rows = all(sql, params);
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

    const rows = all(sql, params).map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
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

// GET /api/admin/appointments — all appointments
router.get('/appointments', async (req, res) => {
  try {
    await getDb();
    const { status, limit = 200, offset = 0 } = req.query;
    let sql = 'SELECT * FROM appointments';
    const params = [];
    if (status) { sql += ' WHERE status=?'; params.push(status); }
    sql += ' ORDER BY appt_date ASC, appt_time ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = all(sql, params);
    const total = get('SELECT COUNT(*) as c FROM appointments')?.c || 0;
    res.json({ total, rows });
  } catch (e) {
    console.error('[ADMIN APPTS]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/appointments/:id — confirm / cancel / reset
router.patch('/appointments/:id', async (req, res) => {
  try {
    await getDb();
    const { status, notes } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (status && !allowed.includes(status))
      return res.status(400).json({ error: 'Invalid status value' });
    const appt = get('SELECT id FROM appointments WHERE id=?', [req.params.id]);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    if (status)
      run('UPDATE appointments SET status=? WHERE id=?', [status, req.params.id]);
    if (notes !== undefined)
      run('UPDATE appointments SET notes=? WHERE id=?', [notes, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  try {
    await getDb();
    run('DELETE FROM appointments WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/consultations/:id
router.delete('/consultations/:id', async (req, res) => {
  try {
    await getDb();
    run('DELETE FROM consultations WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/orders/:id
router.delete('/orders/:id', async (req, res) => {
  try {
    await getDb();
    run('DELETE FROM orders WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;

