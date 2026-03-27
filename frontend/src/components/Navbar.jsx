import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getSlots } from '../api/client';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { count, setOpen } = useCart();
  const [slots, setSlots]   = useState(5);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getSlots().then(r => setSlots(r.data.remaining)).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services',     label: 'Services' },
    { href: '#shop',         label: 'Sacred Shop' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#location',     label: 'Location' },
    { href: '#contact',      label: 'Consult Now', cta: true },
  ];

  return (
    <>
      <div className={styles.scarcityBar}>
        ⚠ Only <strong>{slots}</strong> consultation slots remaining today — Book now
      </div>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#home" className={styles.logo}>
          <img src="/logo.png" alt="Astro With Hrishi" className={styles.logoImg} />
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className={l.cta ? styles.cta : ''} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button className={styles.cartBtn} onClick={() => setOpen(true)}>
            🛒 {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>
          <button className={styles.hamburger} onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </>
  );
}
