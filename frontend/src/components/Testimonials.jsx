import { useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';

const REVIEWS = [
  { text: "My business improved within 30 days of following Hrishi's guidance. The remedies were simple, practical, and actually worked. No complicated rituals — just real results!", author: 'Vikram S.', city: 'Mumbai, Maharashtra' },
  { text: "Relationship issues that lasted 2 years were solved with simple remedies in just weeks. Accurate predictions and powerful guidance — truly result-oriented!", author: 'Priya M.', city: 'Bengaluru, Karnataka' },
  { text: "I was confused about my career for years. One session with Hrishi gave me complete clarity and direction. Got my dream job within 45 days. His accuracy is unbelievable!", author: 'Rahul K.', city: 'Ahmedabad, Gujarat' },
  { text: "Marriage was delayed for 6 years. Hrishi identified the exact dosh and gave practical remedies. Now happily married! The money-back challenge shows how confident he is.", author: 'Neha P.', city: 'Surat, Gujarat' },
  { text: "Changed my mobile number as per Numerology advice and within a month, 3 new business deals closed. Right guidance at the right time really can change everything!", author: 'Amit R.', city: 'Delhi, NCR' },
];

export default function Testimonials() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="testimonials" ref={ref}>
      <div className="reveal" style={{ textAlign: 'center' }}>
        <span className="section-tag">✦ Real Stories ✦</span>
        <h2 className="section-title">Lives <span>Transformed</span></h2>
        <div className="divider" />
      </div>
      <div className={styles.grid}>
        {REVIEWS.map(r => (
          <div key={r.author} className={`${styles.card} reveal`}>
            <div className={styles.quote}>"</div>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.text}>{r.text}</p>
            <div className={styles.author}>— {r.author}</div>
            <div className={styles.city}>{r.city}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
