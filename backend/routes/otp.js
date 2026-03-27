const router = require('express').Router();

// In-memory OTP store: phone → { otp, expiresAt }
const otpStore = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSms(phone, otp) {
  const key = process.env.FAST2SMS_KEY;
  if (key) {
    try {
      const axios = require('axios');
      const res = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'q',
          message: `Your Astro With Hrishi OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
          language: 'english',
          numbers: phone,
        },
        {
          headers: { authorization: key },
          timeout: 8000,
        }
      );
      console.log(`[OTP] SMS sent to ${phone}:`, res.data?.message || 'ok');
      return;
    } catch (e) {
      console.warn('[OTP] Fast2SMS failed, falling back to log:', e.response?.data || e.message);
    }
  }
  // Dev fallback — print OTP to terminal
  console.log(`[OTP] Phone: ${phone}  OTP: ${otp}  (expires in 5 min)`);
}


// POST /api/otp/send  { phone }
router.post('/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))
      return res.status(400).json({ error: 'Invalid phone number' });

    const cleaned = phone.replace(/\D/g, '');
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(cleaned, { otp, expiresAt });

    await sendSms(cleaned, otp);
    res.json({ success: true, message: 'OTP sent' });
  } catch (e) {
    console.error('[OTP SEND]', e.message);
    res.status(500).json({ error: 'Could not send OTP. Please try again.' });
  }
});

// POST /api/otp/verify  { phone, otp }
router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  const cleaned = phone?.replace(/\D/g, '');
  const entry = otpStore.get(cleaned);

  if (!entry) return res.status(400).json({ error: 'OTP not found. Please request again.' });
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleaned);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }
  if (entry.otp !== String(otp).trim()) {
    return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  }

  otpStore.delete(cleaned); // single use
  res.json({ success: true, verified: true });
});

module.exports = router;
