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
import Location from '../components/Location';
import ChatBot from '../components/ChatBot';
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
            👉 We don't predict problems — we provide solutions. Right guidance at the right time can change everything.
          </p>
        </section>

        <Services />
        <Shop />

        {/* Trust */}
        <section className={styles.trust}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-tag">✦ Why Choose Us ✦</span>
            <h2 className="section-title">100% <span>Result-Oriented</span></h2>
            <div className="divider" />
            <p className="section-sub">We don't confuse you — we guide you</p>
          </div>
          <div className={styles.trustGrid}>
            {[['💰','Money-Back','Challenge'],['🏆','10+','Years Experience'],['😊','1000+','Happy Clients'],['🌍','9+','Countries Served'],['⭐','4.9★','Google Rating']].map(([icon, num, label]) => (
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
        <Location />

        {/* Big CTA */}
        <section className={styles.cta}>
          <h2>🔥 Your Kundli is Our Responsibility 🔥</h2>
          <p>Stop guessing your future — start controlling it.</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginBottom: '8px' }}>✅ 100% Result-Focused &nbsp;|&nbsp; 💰 Money-Back Challenge &nbsp;|&nbsp; 🚀 Fast Results</p>
          <div className={styles.ctaBtns}>
            <a href="https://wa.me/919558569555" className="btn-primary" target="_blank" rel="noreferrer">💬 WhatsApp Now</a>
            <a href="tel:+919558569555" className="btn-outline">📞 Call Now</a>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating buttons */}
      <a href="https://wa.me/919558569555" className={styles.floatWa} target="_blank" rel="noreferrer">💬</a>
      <a href="tel:+919558569555" className={styles.floatCall}>📞</a>
      <ChatBot />
    </>
  );
}
