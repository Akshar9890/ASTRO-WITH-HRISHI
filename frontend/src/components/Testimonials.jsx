import { useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';

const REVIEWS = [
  { text: "I was on the verge of breaking up with my partner of 5 years. After one session, Panditji revealed a Saturn transit affecting us both. The remedy changed everything. We're getting married next month!", author: 'Priya S.', city: 'Mumbai, Maharashtra' },
  { text: "Stuck in the wrong job for 3 years. After the career reading and wearing the recommended gemstone bracelet, I got 3 job offers within 45 days. His accuracy is unbelievable!", author: 'Rahul M.', city: 'Bengaluru, Karnataka' },
  { text: "Marriage was delayed for 6 years. He identified the Manglik dosh and gave precise remedies. Kundli matching was done perfectly. Now happily married for 2 years!", author: 'Neha K.', city: 'Ahmedabad, Gujarat' },
  { text: "My business was in huge loss. Panditji told me exactly which months to be careful and which to invest. Now my business has tripled! The 7 Chakra bracelet is always on my wrist.", author: 'Amit P.', city: 'Surat, Gujarat' },
  { text: "I ordered the Tiger Eye bracelet online and it came beautifully packaged with a blessing card. Felt the energy shift within a week. The WhatsApp consultation was so detailed!", author: 'Anjali R.', city: 'Delhi, NCR' },
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
