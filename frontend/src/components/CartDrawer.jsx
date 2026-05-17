import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, remove, update, clear, total, open, setOpen } = useCart();
  const [step, setStep]     = useState('cart');   // cart | checkout
  const [form, setForm]     = useState({ name: '', phone: '', address: '' });

  const WHATSAPP_NUMBER = '919558569555'; // Hrishi's WhatsApp

  const handlePhoneInput = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setForm(p => ({ ...p, phone: digits }));
  };

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address)
      return toast.error('Please fill all fields');
    if (!/^\d{10,15}$/.test(form.phone))
      return toast.error('Please enter a valid phone number (digits only)');

    // Build WhatsApp message with order details
    const itemLines = items.map(i => `• ${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString()}`).join('\n');
    const message = [
      `🙏 *New Order — Astro With Hrishi*`,
      ``,
      `*Items:*`,
      itemLines,
      ``,
      `*Total: ₹${total.toLocaleString()}*`,
      ``,
      `*Customer Details:*`,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `📍 Address: ${form.address}`,
      ``,
      `Please confirm my order and share the payment details. 🙏`,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    clear();
    toast.success('Redirecting to WhatsApp…');
    close();
  };

  const close = () => { setOpen(false); setTimeout(() => setStep('cart'), 400); };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{step === 'success' ? '✦ Order Placed' : step === 'checkout' ? '✦ Checkout' : '✦ Your Cart'}</h2>
          <button className={styles.close} onClick={close}>✕</button>
        </div>

        {step === 'cart' && (
          <>
            {items.length === 0 ? (
              <div className={styles.empty}>
                <span>🛒</span>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  {items.map(i => (
                    <div key={i.id} className={styles.item}>
                      <span className={styles.itemIcon}>{i.icon}</span>
                      <div className={styles.itemInfo}>
                        <p>{i.name}</p>
                        <span>₹{i.price.toLocaleString()}</span>
                      </div>
                      <div className={styles.qty}>
                        <button onClick={() => update(i.id, i.qty - 1)}>−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => update(i.id, i.qty + 1)}>+</button>
                      </div>
                      <button className={styles.removeBtn} onClick={() => remove(i.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className={styles.footer}>
                  <div className={styles.total}>
                    Total: <strong>₹{total.toLocaleString()}</strong>
                  </div>
                  <button className="btn-gold" onClick={() => setStep('checkout')}>
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === 'checkout' && (
          <div className={styles.checkoutForm}>
            <div className={styles.orderSummary}>
              {items.map(i => (
                <div key={i.id} className={styles.summaryRow}>
                  <span>{i.icon} {i.name} × {i.qty}</span>
                  <span>₹{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.field}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={handlePhoneInput}
                onKeyDown={e => {
                  // Allow control keys but block letters
                  if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
            <div className={styles.field}>
              <label>Address</label>
              <input
                type="text"
                placeholder="Full delivery address"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              />
            </div>
            <div className={styles.checkoutBtns}>
              <button className="btn-outline" onClick={() => setStep('cart')}>← Back</button>
              <button className="btn-gold" onClick={handleOrder}>
                💬 Order on WhatsApp
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
