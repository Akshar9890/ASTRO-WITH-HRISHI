import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

const PHONE = '918799534254';

/* ── Helpers ─────────────────────────────────────────────────── */
const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];

function getNext7Days() {
  const days = [];
  const now = new Date();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({ label: `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`, value: d.toLocaleDateString('en-IN') });
  }
  return days;
}

/* ── Initial conversation ────────────────────────────────────── */
const INITIAL = [
  { from: 'bot', text: '🙏 Namaste! I am Astro Devi, your cosmic guide from Astro With Hrishi.' },
  { from: 'bot', text: 'Ask me anything, or tap below to get started ✨', quickReplies: ['🔮 Services', '📅 Book Appointment', '💰 Pricing', '⏱️ Results'] },
];

/* ── Keyword intents ─────────────────────────────────────────── */
const INTENTS = [
  { keys: ['book','appointment','consult','session','schedule','slot'], type: 'book' },
  { keys: ['service','offer','what do you','help with','speciali'],
    reply: ['✨ Our result-oriented services:\n\n🔮 Kundli Analysis\n📱 Mobile Numerology\n💼 Business & Career\n❤️ Relationship & Marriage\n🧠 Life Coaching\n✨ Powerful Remedies','All backed by a 💰 Money-Back Challenge. Which one interests you?'] },
  { keys: ['kundli','birth chart','horoscope','janam'],
    reply: ['🔮 Kundli Analysis is our most popular service! Deep reading for career, marriage, finance & health with real solutions.', { cta: true, label: '📅 Book Kundli Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20a%20Kundli%20Analysis` }] },
  { keys: ['numerology','mobile number','phone number'],
    reply: ['📱 Your phone number carries a vibration. The wrong number can block success & wealth. We correct it to attract positive energy.', { cta: true, label: '💬 Get Numerology Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20a%20Mobile%20Numerology%20reading` }] },
  { keys: ['career','job','business','work'],
    reply: ['💼 Vedic astrology gives perfect timing for job changes, investments & business success. Most clients see results in 30–45 days.', { cta: true, label: '💬 Career Guidance', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20need%20career%20guidance` }] },
  { keys: ['love','relationship','marriage','partner','breakup'],
    reply: ['❤️ Planetary alignments deeply affect relationships. Hrishi has helped 1000+ clients find harmony with practical remedies.', { cta: true, label: '💬 Relationship Guidance', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20need%20relationship%20guidance` }] },
  { keys: ['price','cost','fee','charge','how much','rate'],
    reply: ['💰 Pricing varies by service and is very affordable. Discuss directly with Hrishi for the best option.', { cta: true, label: '💬 Ask About Pricing', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20know%20the%20consultation%20pricing` }] },
  { keys: ['money back','refund','guarantee'],
    reply: ['💰 Yes! Bold Money-Back Challenge — follow remedies sincerely and don\'t see results? We make it right. No questions asked. 🔥'] },
  { keys: ['result','how long','fast','quick','days'],
    reply: ['⚡ Most clients see results within 15–45 days.\n✅ 98% Accuracy · 1000+ Happy Clients · 9+ Countries\n\nRight guidance at the right time changes everything!'] },
  { keys: ['hi','hello','hey','namaste','hii'],
    reply: ['🙏 Namaste! Wonderful to connect with you.', 'I can help with astrology guidance or book an appointment. What would you like?', { quickReplies: ['📅 Book Appointment','🔮 Services','💰 Pricing'] }] },
  { keys: ['thank','thanks','ok','okay','great','nice'],
    reply: ['🙏 You\'re most welcome! Don\'t wait for time to change — change your time! ✨'] },
  { keys: ['hrishi','astrologer','pandit','who are','about'],
    reply: ['🌟 Astro With Hrishi — 10+ years of Vedic astrology expertise. Combining ancient knowledge with modern logic for solutions that actually work.\n\n🔥 Your Kundli is Our Responsibility!'] },
];

const FALLBACK = ['🔮 Great question! For the most accurate answer, connect directly with Hrishi.',
  { cta: true, label: '💬 Ask Hrishi Directly', url: `https://wa.me/${PHONE}` }];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some(k => lower.includes(k))) {
      if (intent.type === 'book') return 'BOOK';
      return intent.reply;
    }
  }
  const cta = FALLBACK[1];
  return [FALLBACK[0], { cta: true, label: cta.label, url: `${cta.url}?text=${encodeURIComponent(input)}` }];
}

/* ── Component ───────────────────────────────────────────────── */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  // Booking state
  const [booking, setBooking] = useState(null); // null | { step, name, date, time }
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing, booking]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);
  useEffect(() => { const t = setTimeout(() => setPulse(false), 5000); return () => clearTimeout(t); }, []);

  /* ── Add bot message(s) with delay ── */
  const addBotMsgs = (responses) => {
    responses.forEach((r, i) => {
      setTimeout(() => {
        setTyping(false);
        if (typeof r === 'string') {
          setMessages(prev => [...prev, { from: 'bot', text: r }]);
          if (i < responses.length - 1) setTyping(true);
        } else if (r.cta) {
          setMessages(prev => [...prev, { from: 'bot', cta: true, label: r.label, url: r.url }]);
        } else if (r.quickReplies) {
          setMessages(prev => [...prev, { from: 'bot', quickReplies: r.quickReplies }]);
        }
      }, (i + 1) * 700);
    });
  };

  /* ── Start booking flow ── */
  const startBooking = () => {
    setBooking({ step: 'name', name: '', date: '', time: '' });
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: '📅 Let\'s book your appointment! I\'ll need a few details.' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'bot', text: '👤 What\'s your name?', isNameStep: true }]);
      }, 700);
    }, 800);
  };

  /* ── Booking step handlers ── */
  const handleNameSubmit = (name) => {
    if (!name.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: name }]);
    setBooking(b => ({ ...b, step: 'date', name: name.trim() }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: `✨ Namaste ${name.trim()}! Please choose your preferred date:`, dateSelector: true }]);
    }, 800);
  };

  const handleDateSelect = (date) => {
    setMessages(prev => [...prev, { from: 'user', text: `📅 ${date}` }]);
    setBooking(b => ({ ...b, step: 'time', date }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: `Great! Now choose a time slot for ${date}:`, timeSelector: true }]);
    }, 700);
  };

  const handleTimeSelect = (time) => {
    setBooking(b => {
      const appt = { ...b, step: 'done', time };
      const waText = `Namaste! I want to book a consultation.\n\nName: ${appt.name}\nDate: ${appt.date}\nTime: ${time}\n\nPlease confirm my appointment. 🙏`;
      setMessages(prev => [
        ...prev,
        { from: 'user', text: `⏰ ${time}` },
      ]);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev,
          { from: 'bot', text: `✅ Appointment Summary:\n\n👤 Name: ${appt.name}\n📅 Date: ${appt.date}\n⏰ Time: ${time}` },
        ]);
        setTimeout(() => {
          setMessages(prev => [...prev,
            { from: 'bot', text: '🔥 Tap below to confirm with Hrishi on WhatsApp. He will confirm your slot within 30 minutes!' },
            { from: 'bot', cta: true, label: '💬 Confirm Appointment on WhatsApp', url: `https://wa.me/${PHONE}?text=${encodeURIComponent(waText)}` },
          ]);
          setBooking(null);
        }, 700);
      }, 900);
      return appt;
    });
  };

  /* ── Main send handler ── */
  const sendMessage = (text) => {
    if (!text.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    setTyping(true);
    const response = getResponse(text);
    if (response === 'BOOK') {
      setTyping(false);
      startBooking();
    } else {
      addBotMsgs(response);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };
  const reset = () => { setMessages(INITIAL); setTyping(false); setInput(''); setBooking(null); };

  const days = getNext7Days();

  return (
    <>
      <button className={`${styles.launcher} ${pulse ? styles.pulse : ''}`}
        onClick={() => { setOpen(o => !o); setPulse(false); }} aria-label="Chat with Astro Devi">
        <span className={styles.launcherIcon}>{open ? '✕' : '🔮'}</span>
        {!open && <span className={styles.launcherBadge}>1</span>}
      </button>

      {open && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>✨</div>
            <div className={styles.headerInfo}>
              <div className={styles.botName}>Astro Devi</div>
              <div className={styles.status}>● Online · Replies instantly</div>
            </div>
            <button className={styles.resetBtn} onClick={reset} title="New chat">↺</button>
          </div>

          {/* Messages */}
          <div className={styles.body}>
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.from === 'user' && (
                  <div className={styles.userRow}>
                    <span className={`${styles.bubble} ${styles.userBubble}`}>{msg.text}</span>
                  </div>
                )}
                {msg.from === 'bot' && msg.text && (
                  <div className={styles.botRow}>
                    <span className={styles.botAvatar}>✨</span>
                    <span className={`${styles.bubble} ${styles.botBubble}`}>{msg.text}</span>
                  </div>
                )}
                {msg.from === 'bot' && msg.cta && (
                  <div className={styles.botRow}>
                    <span className={styles.botAvatar}>✨</span>
                    <a href={msg.url} target="_blank" rel="noreferrer" className={styles.ctaBtn}>{msg.label}</a>
                  </div>
                )}
                {msg.from === 'bot' && msg.quickReplies && (
                  <div className={styles.quickWrap}>
                    {msg.quickReplies.map(q => (
                      <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
                    ))}
                  </div>
                )}
                {/* Inline date selector */}
                {msg.from === 'bot' && msg.dateSelector && booking?.step === 'date' && (
                  <div className={styles.dateGrid}>
                    {days.map(d => (
                      <button key={d.value} className={styles.dateBtn} onClick={() => handleDateSelect(d.label)}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
                {/* Inline time selector */}
                {msg.from === 'bot' && msg.timeSelector && booking?.step === 'time' && (
                  <div className={styles.timeGrid}>
                    {TIME_SLOTS.map(t => (
                      <button key={t} className={styles.timeBtn} onClick={() => handleTimeSelect(t)}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className={styles.botRow}>
                <span className={styles.botAvatar}>✨</span>
                <span className={styles.typing}><span /><span /><span /></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input / Name step */}
          {booking?.step === 'name' ? (
            <NameInput onSubmit={handleNameSubmit} />
          ) : (
            <div className={styles.inputRow}>
              <input ref={inputRef} className={styles.input} value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask me anything..." />
              <button className={styles.sendBtn} onClick={() => sendMessage(input)} disabled={!input.trim()}>➤</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function NameInput({ onSubmit }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(212,175,55,0.12)', background: 'rgba(255,255,255,0.02)' }}>
      <input ref={ref} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 24, padding: '9px 16px', color: '#F5EDD6', fontSize: '0.8rem', outline: 'none', fontFamily: 'Cormorant Garamond, serif' }}
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSubmit(val); }}
        placeholder="Enter your name..." />
      <button style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#b8860b)', border: 'none', color: '#0a0118', fontSize: '1rem', cursor: val.trim() ? 'pointer' : 'not-allowed', opacity: val.trim() ? 1 : 0.35, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 }}
        onClick={() => onSubmit(val)} disabled={!val.trim()}>➤</button>
    </div>
  );
}
