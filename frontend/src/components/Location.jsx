import styles from './Location.module.css';

export default function Location() {
  return (
    <section className={styles.section} id="location">
      <div style={{ textAlign: 'center' }}>
        <span className="section-tag">✦ Find Us ✦</span>
        <h2 className="section-title">Visit <span>Our Office</span></h2>
        <div className="divider" />
        <p className="section-sub">Come meet us in person or reach out online — we're here for you</p>
      </div>

      <div className={styles.container}>
        {/* Info Cards */}
        <div className={styles.infoCol}>
          <div className={styles.card}>
            <span className={styles.icon}>📍</span>
            <div>
              <h4>Address</h4>
              <p>Astro With Hrishi<br />BSNL Colony, Karelibagh,<br />Vadodara, Gujarat 390022</p>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>📞</span>
            <div>
              <h4>Phone</h4>
              <a href="tel:+919558569555">+91 95585 69555</a>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>💬</span>
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/919558569555" target="_blank" rel="noreferrer">Chat with Us</a>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>📸</span>
            <div>
              <h4>Instagram</h4>
              <a href="https://www.instagram.com/astrowithhrishi_555" target="_blank" rel="noreferrer">@astrowithhrishi_555</a>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🕐</span>
            <div>
              <h4>Consultation Hours</h4>
              <p>Mon – Sun &nbsp;|&nbsp; 9 AM – 9 PM IST</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className={styles.mapCol}>
          <div className={styles.mapWrapper}>
            <iframe
              title="Astro With Hrishi Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59046.22220464245!2d73.217182!3d22.3389404!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcf1ac95fa38f%3A0x5741e69175821a5!2sShree%20Bhidbhanjan%20Hanuman%20Temple!5e0!3m2!1sen!2sin!4v1743015486588!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
