const express = require('express');
const router  = express.Router();
const { getDb, run, all, get } = require('../db');

// GET /api/appointments/slots?date=<date> — returns booked time slots for a date (public)
router.get('/slots', async (req, res) => {
  try {
    await getDb();
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query param required' });
    const rows = all(
      "SELECT appt_time FROM appointments WHERE appt_date = ? AND status != 'cancelled'",
      [date.trim()]
    );
    res.json({ bookedSlots: rows.map(r => r.appt_time) });
  } catch (e) {
    console.error('[appointments] GET /slots error:', e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/appointments — create appointment from chatbot
router.post('/', async (req, res) => {
  try {
    await getDb();
    const { name, phone = '', service = 'General Consultation', appt_date, appt_time } = req.body;
    if (!name || !appt_date || !appt_time) {
      return res.status(400).json({ error: 'name, appt_date and appt_time are required' });
    }

    // Check if slot is already taken
    const existing = get(
      "SELECT id FROM appointments WHERE appt_date = ? AND appt_time = ? AND status != 'cancelled'",
      [appt_date.trim(), appt_time.trim()]
    );
    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another time.' });
    }

    const { lastInsertRowid } = run(
      'INSERT INTO appointments (name, phone, service, appt_date, appt_time) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), phone.trim(), service.trim(), appt_date.trim(), appt_time.trim()]
    );
    res.status(201).json({ id: lastInsertRowid });
  } catch (e) {
    console.error('[appointments] POST error:', e.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/appointments — admin only (requires x-admin-key header)
router.get('/', (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit  || 100), 500);
    const offset = parseInt(req.query.offset || 0);
    const rows = all(
      'SELECT * FROM appointments ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const total = get('SELECT COUNT(*) as count FROM appointments')?.count || 0;
    res.json({ rows, total });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/appointments/:id — update status / notes
router.patch('/:id', (req, res) => {
  try {
    const { status, notes } = req.body;
    const appt = get('SELECT id FROM appointments WHERE id = ?', [req.params.id]);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    if (status) run('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    if (notes  !== undefined) run('UPDATE appointments SET notes = ? WHERE id = ?', [notes, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
