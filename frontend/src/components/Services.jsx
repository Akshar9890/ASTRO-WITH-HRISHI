import { useEffect, useRef } from 'react';
import styles from './Services.module.css';

const SERVICES = [
  { icon: '🔮', title: 'Kundli Analysis',          desc: 'Detailed birth chart reading for career, marriage, finance & health — with accurate predictions and real solutions.', tag: 'Most Popular' },
  { icon: '📱', title: 'Mobile Numerology',          desc: 'Correct your mobile number to attract success, positive energy & financial abundance into your life.' },
  { icon: '💼', title: 'Business & Career Guidance', desc: 'Perfect timing & direction for career growth, job change & business success — backed by Vedic analysis.' },
  { icon: '❤️', title: 'Relationship & Marriage',    desc: 'Solve conflicts, attract the right partner, and build lasting harmony through cosmic guidance.' },
  { icon: '🧠', title: 'Life Coaching',              desc: 'Gain clarity, confidence & decision-making power with astrology-based life coaching sessions.' },
  { icon: '✨', title: 'Powerful Remedies',          desc: 'Simple, practical & effective remedies — no complicated rituals. Results guaranteed or money back.', tag: 'Money-Back' },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="services" ref={sectionRef}>
      <div className="reveal" style={{ textAlign: 'center' }}>
        <span className="section-tag">✦ What I Offer ✦</span>
        <h2 className="section-title">Sacred <span>Services</span></h2>
        <div className="divider" />
        <p className="section-sub">Ancient wisdom interpreted for your modern life challenges</p>
      </div>
      <div className={styles.grid}>
        {SERVICES.map(s => (
          <div key={s.title} className={`${styles.card} reveal`}>
            <span className={styles.icon}>{s.icon}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {s.tag && <span className={styles.tag}>{s.tag}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
