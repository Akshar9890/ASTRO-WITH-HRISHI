import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}><img src="/logo.png" alt="Astro With Hrishi" className={styles.logoImg} /></div>
      <div className={styles.social}>
        {[['📸','https://www.instagram.com/astrowithhrishi_555'],['💬','https://wa.me/919558569555'],['▶️','#'],['📘','#']].map(([icon, href]) => (
          <a key={icon} href={href} className={styles.socialBtn} target="_blank" rel="noreferrer">{icon}</a>
        ))}
      </div>
      <ul className={styles.links}>
        {[['#home','Home'],['#services','Services'],['#shop','Shop'],['#testimonials','Reviews'],['#location','Location'],['#contact','Contact'],['/admin','Admin']].map(([href, label]) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
      <p className={styles.copy}>© 2025 Astro With Hrishi · All Rights Reserved · Crafted with ✦ and Cosmic Energy</p>
    </footer>
  );
}
