import { useEffect, useRef } from 'react';
import styles from './Services.module.css';

const SERVICES = [
  { icon: '🔮', title: 'Kundli & Birth Chart',      desc: 'Deep analysis of your birth chart to reveal life\'s hidden patterns and planetary influences.', tag: 'Most Popular' },
  { icon: '💑', title: 'Love & Relationship',        desc: 'Heal broken relationships, attract soulmates, and strengthen your love life with cosmic guidance.' },
  { icon: '💍', title: 'Marriage & Compatibility',   desc: 'Kundli matching, auspicious muhurat, and marriage problem solutions.' },
  { icon: '🌟', title: 'Career & Business',          desc: 'Find your dharmic career path, predict business growth, and remove professional obstacles.' },
  { icon: '🧿', title: 'Vastu & Remedies',           desc: 'Gemstone recommendations, yantras, mantras, and Vastu corrections for prosperity.' },
  { icon: '📿', title: 'Numerology & Tarot',         desc: 'Unlock your life path number and receive intuitive tarot readings for guidance.' },
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
