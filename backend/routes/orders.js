const router = require('express').Router();
const { getDb, run, get } = require('../db');
const { validateOrder } = require('../middleware/validate');

// POST /api/orders
router.post('/', validateOrder, async (req, res) => {
  try {
    await getDb();
    const { name, phone, address, items } = req.body;
    const total = items.reduce((s, i) => s + (i.price * i.qty), 0);
    const result = run(
      `INSERT INTO orders (name, phone, address, items, total) VALUES (?, ?, ?, ?, ?)`,
      [name, phone, address, JSON.stringify(items), total]
    );
    console.log(`[ORDER] New order #${result.lastInsertRowid} — ${name} — ₹${total}`);
    res.status(201).json({
      success: true,
      orderId: result.lastInsertRowid,
      total,
      message: 'Order placed! We will confirm via WhatsApp shortly.',
    });
  } catch (e) {
    console.error('[ORDER ERROR]', e.message);
    res.status(500).json({ error: 'Could not place order. Please try again.' });
  }
});

// GET /api/orders/:id — track order
router.get('/:id', async (req, res) => {
  try {
    await getDb();
    const order = get(
      `SELECT id, name, status, total, created_at FROM orders WHERE id = ?`,
      [req.params.id]
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
