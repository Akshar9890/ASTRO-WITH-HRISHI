const router = require('express').Router();
const { getDb, run, get } = require('../db');
const { validateConsultation } = require('../middleware/validate');

// POST /api/consultations
router.post('/', validateConsultation, async (req, res) => {
  try {
    await getDb();
    const { name, phone, problem } = req.body;
    const result = run(
      `INSERT INTO consultations (name, phone, problem) VALUES (?, ?, ?)`,
      [name, phone, problem]
    );
    console.log(`[LEAD] New consultation #${result.lastInsertRowid} — ${name} (${phone}) — ${problem}`);
    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Request received! We will contact you within 30 minutes.',
    });
  } catch (e) {
    console.error('[LEAD ERROR]', e.message);
    res.status(500).json({ error: 'Could not save your request. Please try again.' });
  }
});

// GET /api/consultations/slots — live slot count for scarcity bar
router.get('/slots', async (req, res) => {
  try {
    await getDb();
    const row = get(`SELECT COUNT(*) as count FROM consultations WHERE date(created_at) = date('now','localtime')`);
    const remaining = Math.max(1, 20 - (row?.count || 0));
    res.json({ remaining });
  } catch {
    res.json({ remaining: 5 });
  }
});

module.exports = router;
