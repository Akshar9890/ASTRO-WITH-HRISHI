import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>✦ Astro With Hrishi ✦</div>
      <div className={styles.social}>
        {[['📸','https://instagram.com'],['💬','https://wa.me/919999999999'],['▶️','#'],['📘','#']].map(([icon, href]) => (
          <a key={icon} href={href} className={styles.socialBtn} target="_blank" rel="noreferrer">{icon}</a>
        ))}
      </div>
      <ul className={styles.links}>
        {[['#home','Home'],['#services','Services'],['#shop','Shop'],['#testimonials','Reviews'],['#contact','Contact']].map(([href, label]) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
      <p className={styles.copy}>© 2025 Astro With Hrishi · All Rights Reserved · Crafted with ✦ and Cosmic Energy</p>
    </footer>
  );
}
