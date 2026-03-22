import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const m1 = useRef(null);
  const m2 = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (m1.current) m1.current.style.transform = `translate(-50%,-50%) rotate(${y * 0.02}deg)`;
      if (m2.current) m2.current.style.transform = `translate(-50%,-50%) rotate(${-y * 0.03}deg)`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={styles.hero} id="home">
      {/* Mandalas */}
      <svg ref={m1} className={styles.mandala1} viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="1"/>
        <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.5"/>
        <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1"/>
        <circle cx="200" cy="200" r="60"  stroke="white" strokeWidth="0.5"/>
        <line x1="200" y1="10"  x2="200" y2="390" stroke="white" strokeWidth="0.5"/>
        <line x1="10"  y1="200" x2="390" y2="200" stroke="white" strokeWidth="0.5"/>
        <line x1="65"  y1="65"  x2="335" y2="335" stroke="white" strokeWidth="0.5"/>
        <line x1="335" y1="65"  x2="65"  y2="335" stroke="white" strokeWidth="0.5"/>
        <polygon points="200,40 235,120 320,120 255,170 280,250 200,200 120,250 145,170 80,120 165,120" stroke="white" strokeWidth="0.8" fill="none"/>
        <polygon points="200,360 165,280 80,280 145,230 120,150 200,200 280,150 255,230 320,280 235,280" stroke="white" strokeWidth="0.8" fill="none"/>
        <circle cx="200" cy="200" r="20" stroke="white" strokeWidth="1"/>
        <circle cx="200" cy="200" r="5"  fill="white"/>
      </svg>
      <svg ref={m2} className={styles.mandala2} viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="190" stroke="gold" strokeWidth="0.5"/>
        <polygon points="200,20 380,340 20,340"  stroke="white" strokeWidth="0.8" fill="none"/>
        <polygon points="200,380 20,60 380,60"   stroke="white" strokeWidth="0.8" fill="none"/>
        <circle cx="200" cy="200" r="80"  stroke="white" strokeWidth="0.5"/>
        <circle cx="200" cy="200" r="130" stroke="white" strokeWidth="0.3"/>
      </svg>

      {/* Orbs */}
      <div className={`${styles.orb} ${styles.orb1}`}/>
      <div className={`${styles.orb} ${styles.orb2}`}/>
      <div className={`${styles.orb} ${styles.orb3}`}/>

      <div className={styles.content}>
        <div className={styles.badge}>✦ 10+ Years of Cosmic Wisdom ✦</div>
        <h1>Astro With<br /><span>Hrishi</span></h1>
        <p className={styles.sub}>Expert Vedic Astrology · Sacred Jewels · Divine Guidance</p>

        <div className={styles.btns}>
          <a href="https://wa.me/918799534254?text=Namaste!%20I%20want%20an%20astrology%20consultation"
             className="btn-primary" target="_blank" rel="noreferrer">
            💬 Chat on WhatsApp
          </a>
          <a href="#contact" className="btn-outline">🔮 Book Consultation</a>
        </div>

        <div className={styles.urgency}>⚡ LIMITED SLOTS AVAILABLE TODAY — BOOK BEFORE MIDNIGHT</div>
        <div className="divider" />

        <div className={styles.stats}>
          {[['10+','Years Exp'],['5000+','Lives Changed'],['98%','Accuracy'],['4.9★','Rating']].map(([n,l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statNum}>{n}</span>
              <span className={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
