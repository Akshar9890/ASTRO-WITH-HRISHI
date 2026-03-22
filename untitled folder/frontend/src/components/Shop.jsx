import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Shop.module.css';

export default function Shop() {
  const { PRODUCTS, add } = useCart();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAdd = (product) => {
    add(product);
    toast.success(`✦ ${product.name} added to cart`);
  };

  return (
    <section className={styles.section} id="shop" ref={sectionRef}>
      <div className="reveal" style={{ textAlign: 'center' }}>
        <span className="section-tag">✦ Sacred Collection ✦</span>
        <h2 className="section-title">Cosmic <span>Jewels & Remedies</span></h2>
        <div className="divider" />
        <p className="section-sub">Energized and blessed sacred items for protection, abundance & healing</p>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map(p => (
          <div key={p.id} className={`${styles.card} reveal`}>
            <div className={styles.imgWrap}>
              <span className={styles.emoji}>{p.icon}</span>
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
            </div>
            <div className={styles.info}>
              <h3>{p.name}</h3>
              <div className={styles.price}>
                <span className={styles.original}>₹{p.original.toLocaleString()}</span>
                ₹{p.price.toLocaleString()}
              </div>
              <button className={styles.addBtn} onClick={() => handleAdd(p)}>
                ✦ Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
