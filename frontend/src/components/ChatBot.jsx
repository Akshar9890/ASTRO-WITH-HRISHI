import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

const PHONE = '918799534254';

const INITIAL = [
  { from: 'bot', text: '🙏 Namaste! I am Astro Devi, your cosmic guide from Astro With Hrishi.' },
  { from: 'bot', text: 'Ask me anything about our services, pricing, or how to book a consultation. I\'m here to help! ✨', quickReplies: ['🔮 Services', '📅 Book Now', '💰 Pricing', '⏱️ Results'] },
];

// Keyword → response map
const INTENTS = [
  {
    keys: ['service', 'offer', 'what do you', 'help with', 'speciali'],
    reply: ['✨ We offer result-oriented services:\n\n🔮 Kundli Analysis\n📱 Mobile Numerology\n💼 Business & Career\n❤️ Relationship & Marriage\n🧠 Life Coaching\n✨ Powerful Remedies', 'All services come with a 💰 Money-Back Challenge. Which one interests you?'],
  },
  {
    keys: ['kundli', 'birth chart', 'horoscope', 'janam'],
    reply: ['🔮 Kundli Analysis is our most popular service!', 'We provide a deep reading of your birth chart covering career, marriage, finance & health — with real, actionable solutions.\n\nWould you like to book one?', { cta: true, label: '💬 Book Kundli Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20a%20Kundli%20Analysis` }],
  },
  {
    keys: ['numerology', 'mobile number', 'phone number', 'number'],
    reply: ['📱 Mobile Numerology is fascinating!', 'Your phone number carries a specific vibration. The wrong number can silently block your success, wealth & relationships.\n\nWe\'ll analyze and correct it to attract positive energy.', { cta: true, label: '💬 Get Numerology Reading', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20a%20Mobile%20Numerology%20reading` }],
  },
  {
    keys: ['career', 'job', 'business', 'work', 'profession'],
    reply: ['💼 Career & Business guidance is one of our strengths!', 'We use Vedic astrology to find the perfect timing for job changes, investments & business decisions.\n\n⚡ Most clients see results within 30–45 days.', { cta: true, label: '💬 Talk About My Career', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20need%20career%20guidance` }],
  },
  {
    keys: ['love', 'relationship', 'marriage', 'partner', 'breakup', 'divorce', 'wife', 'husband'],
    reply: ['❤️ Relationships are deeply connected to planetary alignments.', 'Hrishi has helped 1000+ clients find clarity in their love & marriage life with simple, practical remedies.\n\n🔥 Your Kundli is Our Responsibility.', { cta: true, label: '💬 Discuss My Relationship', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20need%20relationship%20guidance` }],
  },
  {
    keys: ['price', 'cost', 'fee', 'charge', 'how much', 'rate'],
    reply: ['💰 Our consultation fees are very affordable and transparent.', 'Pricing varies based on the service. You can discuss exact pricing directly with Hrishi on WhatsApp — he\'ll find the best option for you.', { cta: true, label: '💬 Ask About Pricing', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20know%20the%20consultation%20pricing` }],
  },
  {
    keys: ['money back', 'refund', 'guarantee', 'challenge', 'result guarantee'],
    reply: ['💰 Yes! We offer a bold Money-Back Challenge.', '🔥 If you follow our remedies sincerely and don\'t see results — we\'ll make it right. No questions asked.\n\nThat\'s how confident we are in our work!', 'Do you want to book a consultation?', { cta: true, label: '📅 Book Now', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20book%20a%20consultation` }],
  },
  {
    keys: ['book', 'appointment', 'consult', 'session', 'schedule'],
    reply: ['📅 Booking is super easy!', 'Just fill the consultation form on this page, or reach Hrishi directly on WhatsApp. We respond within 30 minutes! ⚡', { cta: true, label: '💬 Book on WhatsApp', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20book%20a%20consultation` }],
  },
  {
    keys: ['result', 'how long', 'time', 'fast', 'quick', 'days'],
    reply: ['⚡ Most clients start seeing results within 15–45 days.', '✅ 98% Accuracy · 1000+ Happy Clients · 9+ Countries Served\n\nRight guidance at the right time can change everything!', { cta: true, label: '🔮 Start My Journey', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20to%20start%20my%20astrology%20journey` }],
  },
  {
    keys: ['vastu', 'remedy', 'remedies', 'gemstone', 'bracelet', 'crystal'],
    reply: ['✨ Powerful Remedies — no complicated rituals!', 'We recommend simple, practical solutions: specific gemstones, bracelet energies, and Vastu corrections that work in your real daily life.\n\n💰 All backed by our Money-Back Challenge.', { cta: true, label: '💬 Get My Remedy', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20want%20powerful%20remedies` }],
  },
  {
    keys: ['life coach', 'clarity', 'confused', 'decision', 'guidance'],
    reply: ['🧠 Life Coaching based on astrology gives you extraordinary clarity!', 'Stop guessing. We use your birth chart to give you precise direction for the decisions that matter most in your life.', { cta: true, label: '💬 Get Life Coaching', url: `https://wa.me/${PHONE}?text=Namaste!%20I%20need%20life%20coaching%20guidance` }],
  },
  {
    keys: ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo'],
    reply: ['🙏 Namaste! So wonderful to connect with you.', 'I\'m Astro Devi, here to guide you on your cosmic journey. What topic can I help you with today?', { quickReplies: ['🔮 Services', '📅 Book Now', '💰 Pricing', '⏱️ Results'] }],
  },
  {
    keys: ['thank', 'thanks', 'ok', 'okay', 'great', 'nice', 'good'],
    reply: ['🙏 You\'re most welcome!', 'Remember — Don\'t wait for time to change, change your time! ✨\n\nFeel free to ask me anything else.'],
  },
  {
    keys: ['hrishi', 'astrologer', 'pandit', 'who are', 'about'],
    reply: ['🌟 Astro With Hrishi is led by a seasoned Vedic astrologer with 10+ years of experience.', 'Combining ancient Vedic knowledge with modern logical analysis, Hrishi provides solutions that actually work in real life.\n\n🤝 We believe in accountability — that\'s why we say:\n🔥 Your Kundli is Our Responsibility!'],
  },
];

const FALLBACK = [
  '🔮 That\'s a great question! For the most accurate answer, I\'d recommend connecting directly with Hrishi.',
  '💬 Our astrologer can answer this personally on WhatsApp within minutes!',
];

function getBotResponse(input) {
  const lower = input.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some(k => lower.includes(k))) {
      return intent.reply;
    }
  }
  return [...FALLBACK, { cta: true, label: '💬 Ask Hrishi Directly', url: `https://wa.me/${PHONE}?text=${encodeURIComponent(input)}` }];
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);
  useEffect(() => { const t = setTimeout(() => setPulse(false), 5000); return () => clearTimeout(t); }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    setTyping(true);

    const responses = getBotResponse(text);
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

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };
  const handleQuick = (label) => sendMessage(label);
  const reset = () => { setMessages(INITIAL); setTyping(false); setInput(''); };

  return (
    <>
      <button className={`${styles.launcher} ${pulse ? styles.pulse : ''}`}
        onClick={() => { setOpen(o => !o); setPulse(false); }} aria-label="Chat with Astro Devi">
        <span className={styles.launcherIcon}>{open ? '✕' : '🔮'}</span>
        {!open && <span className={styles.launcherBadge}>1</span>}
      </button>

      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.avatar}>✨</div>
            <div className={styles.headerInfo}>
              <div className={styles.botName}>Astro Devi</div>
              <div className={styles.status}>● Online · Replies instantly</div>
            </div>
            <button className={styles.resetBtn} onClick={reset} title="New chat">↺</button>
          </div>

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
                      <button key={q} className={styles.quickBtn} onClick={() => handleQuick(q)}>{q}</button>
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

          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
            />
            <button className={styles.sendBtn} onClick={() => sendMessage(input)} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
