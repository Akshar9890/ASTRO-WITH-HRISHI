import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

const BOT_NAME = 'Astro Devi';
const PHONE = '918799534254';

const INITIAL_MESSAGES = [
  { from: 'bot', text: '🙏 Namaste! I am Astro Devi, your cosmic guide.' },
  { from: 'bot', text: 'How can I help you today? Please choose a topic below 👇' },
];

const QUICK_REPLIES = [
  { label: '🔮 Services & Pricing', key: 'services' },
  { label: '📅 Book Consultation', key: 'book' },
  { label: '💰 Money-Back Policy', key: 'moneyback' },
  { label: '⏱️ How Fast Are Results?', key: 'results' },
  { label: '📱 Mobile Numerology', key: 'numerology' },
  { label: '💬 Talk to Astrologer', key: 'talk' },
];

const RESPONSES = {
  services: [
    { from: 'bot', text: '✨ We offer the following services:' },
    { from: 'bot', text: '🔮 Kundli Analysis\n📱 Mobile Numerology\n💼 Business & Career Guidance\n❤️ Relationship & Marriage\n🧠 Life Coaching\n✨ Powerful Remedies' },
    { from: 'bot', text: 'All consultations are 100% result-oriented with a money-back challenge. Would you like to book one?' },
  ],
  book: [
    { from: 'bot', text: '📅 Booking is simple! Just fill the consultation form on this page, or WhatsApp us directly.' },
    { from: 'bot', text: '⚡ We respond within 30 minutes and slots fill up fast!', cta: { label: '💬 Book on WhatsApp', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20book%20a%20consultation` } },
  ],
  moneyback: [
    { from: 'bot', text: '💰 We are so confident in our results that we offer a Money-Back Challenge.' },
    { from: 'bot', text: '🔥 Your Kundli is Our Responsibility — if you don\'t see results from our remedies, we\'ll make it right. No questions asked.' },
    { from: 'bot', text: 'Would you like to talk to the astrologer directly?', cta: { label: '📞 Call Now', url: `tel:+${PHONE}` } },
  ],
  results: [
    { from: 'bot', text: '⚡ Most clients see results within 15–45 days of following our guidance.' },
    { from: 'bot', text: '✅ 98% Accuracy · 1000+ Happy Clients · 9+ Countries Served' },
    { from: 'bot', text: 'Right guidance at the right time can change everything. Ready to start?', cta: { label: '🔮 Get My Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20my%20astrology%20reading` } },
  ],
  numerology: [
    { from: 'bot', text: '📱 Mobile Numerology is one of our most popular services!' },
    { from: 'bot', text: 'Your phone number carries a specific vibration. The wrong number can block success, money & relationships.' },
    { from: 'bot', text: 'We\'ll analyze and correct your number to attract positive energy. Book now 👇', cta: { label: '💬 Get Numerology Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20a%20Mobile%20Numerology%20reading` } },
  ],
  talk: [
    { from: 'bot', text: '💬 You can reach Astro With Hrishi directly right now!' },
    { from: 'bot', text: 'Don\'t wait for time to change — change your time! 🔥', cta: { label: '💬 WhatsApp Now', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20an%20astrology%20consultation` } },
  ],
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showReplies, setShowReplies] = useState(true);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleQuickReply = (key, label) => {
    setShowReplies(false);
    setMessages(prev => [...prev, { from: 'user', text: label }]);

    const botReplies = RESPONSES[key] || [];
    botReplies.forEach((msg, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
        if (i === botReplies.length - 1) {
          setTimeout(() => setShowReplies(true), 400);
        }
      }, (i + 1) * 600);
    });
  };

  const reset = () => {
    setMessages(INITIAL_MESSAGES);
    setShowReplies(true);
  };

  return (
    <>
      {/* Launcher */}
      <button
        className={`${styles.launcher} ${pulse ? styles.pulse : ''}`}
        onClick={() => { setOpen(o => !o); setPulse(false); }}
        aria-label="Open chat"
      >
        {open ? '✕' : '🔮'}
        {!open && <span className={styles.launcherBadge}>1</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>✨</div>
            <div>
              <div className={styles.botName}>{BOT_NAME}</div>
              <div className={styles.status}>● Online · Replies instantly</div>
            </div>
            <button className={styles.resetBtn} onClick={reset} title="Restart">↺</button>
          </div>

          {/* Messages */}
          <div className={styles.body}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msg} ${msg.from === 'user' ? styles.user : styles.bot}`}>
                <span className={styles.bubble}>{msg.text}</span>
                {msg.cta && (
                  <a href={msg.cta.url} target="_blank" rel="noreferrer" className={styles.ctaBtn}>
                    {msg.cta.label}
                  </a>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showReplies && (
            <div className={styles.replies}>
              {QUICK_REPLIES.map(r => (
                <button key={r.key} className={styles.reply} onClick={() => handleQuickReply(r.key, r.label)}>
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer}>
            🔥 Your Kundli is Our Responsibility
          </div>
        </div>
      )}
    </>
  );
}
