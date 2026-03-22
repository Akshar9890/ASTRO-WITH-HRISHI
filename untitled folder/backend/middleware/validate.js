// Lightweight field validator — no external deps needed

function validateConsultation(req, res, next) {
  const { name, phone, problem } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2)
    return res.status(400).json({ error: 'Valid name is required' });

  if (!phone || !/^[+\d\s\-()]{7,20}$/.test(phone.trim()))
    return res.status(400).json({ error: 'Valid phone number is required' });

  if (!problem || typeof problem !== 'string' || problem.trim().length < 2)
    return res.status(400).json({ error: 'Problem area is required' });

  // Sanitize
  req.body.name    = name.trim().slice(0, 100);
  req.body.phone   = phone.trim().slice(0, 20);
  req.body.problem = problem.trim().slice(0, 200);

  next();
}

function validateOrder(req, res, next) {
  const { name, phone, address, items } = req.body;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Valid name is required' });

  if (!phone || !/^[+\d\s\-()]{7,20}$/.test(phone.trim()))
    return res.status(400).json({ error: 'Valid phone number is required' });

  if (!address || address.trim().length < 10)
    return res.status(400).json({ error: 'Full delivery address is required' });

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Cart is empty' });

  for (const item of items) {
    if (!item.product || typeof item.qty !== 'number' || typeof item.price !== 'number')
      return res.status(400).json({ error: 'Invalid cart item format' });
  }

  req.body.name    = name.trim().slice(0, 100);
  req.body.phone   = phone.trim().slice(0, 20);
  req.body.address = address.trim().slice(0, 500);

  next();
}

function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_SECRET)
    return res.status(401).json({ error: 'Unauthorized' });
  next();
}

module.exports = { validateConsultation, validateOrder, requireAdmin };
