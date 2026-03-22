import { useEffect } from 'react';
import { trackPageView } from '../api/client';
import Cursor from '../components/Cursor';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Shop from '../components/Shop';
import Testimonials from '../components/Testimonials';
import ConsultForm from '../components/ConsultForm';
import Footer from '../components/Footer';
import styles from './Home.module.css';

export default function Home() {
  useEffect(() => {
    trackPageView().catch(() => {});
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />

        {/* Problems */}
        <section className={styles.problems} id="problems">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-tag">✦ You are not alone ✦</span>
            <h2 className="section-title">Are You <span>Struggling</span> With...</h2>
            <div className="divider" />
          </div>
          <div className={styles.problemsGrid}>
            {[
              ['💔','Love & Relationship','Heartbreak, breakup, or feeling disconnected from your partner?'],
              ['💍','Delay in Marriage','Struggling to find the right match or repeated rejections?'],
              ['💼','Career Confusion','Stuck in a job you hate or unsure which path to take?'],
              ['💸','Financial Problems','Debt, losses, or financial instability holding you back?'],
              ['😰','Family Conflicts','Constant fights, misunderstandings, or toxic relationships?'],
            ].map(([icon, title, desc]) => (
              <div key={title} className={`${styles.problemCard} reveal`}>
                <span className={styles.problemIcon}>{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <p className={`${styles.problemCta} reveal`}>
            👉 Astrology can give you clarity, direction & lasting solutions.
          </p>
        </section>

        <Services />
        <Shop />

        {/* Trust */}
        <section className={styles.trust}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-tag">✦ Why Trust Us ✦</span>
            <h2 className="section-title">Trusted by <span>Thousands</span></h2>
            <div className="divider" />
          </div>
          <div className={styles.trustGrid}>
            {[['🏆','5+','Years Experience'],['😊','5000+','Happy Clients'],['🌍','9+','Countries Served'],['🔒','100%','Confidential'],['⭐','4.9★','Google Rating']].map(([icon, num, label]) => (
              <div key={label} className={`${styles.trustBadge} reveal`}>
                <span>{icon}</span>
                <strong>{num}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />
        <ConsultForm />

        {/* Big CTA */}
        <section className={styles.cta}>
          <h2>Talk to Astrologer Now</h2>
          <p>Real solutions. Ancient wisdom. Instant guidance.</p>
          <div className={styles.ctaBtns}>
            <a href="https://wa.me/918799534254" className="btn-primary" target="_blank" rel="noreferrer">💬 WhatsApp Chat Now</a>
            <a href="tel:+918799534254" className="btn-outline">📞 Call Now</a>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating buttons */}
      <a href="https://wa.me/918799534254" className={styles.floatWa} target="_blank" rel="noreferrer">💬</a>
      <a href="tel:+918799534254" className={styles.floatCall}>📞</a>
    </>
  );
}
