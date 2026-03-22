import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/client';
import toast from 'react-hot-toast';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, remove, update, clear, total, open, setOpen } = useCart();
  const [step, setStep]     = useState('cart');   // cart | checkout | success
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ name: '', phone: '', address: '' });
  const [orderId, setOrderId] = useState(null);

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address)
      return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await placeOrder({
        ...form,
        items: items.map(i => ({ product: i.name, qty: i.qty, price: i.price })),
      });
      setOrderId(res.data.orderId);
      clear();
      setStep('success');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Order failed. Try again.');
    } finally {
      setLoading(false);
    }
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
            {['name','phone','address'].map(f => (
              <div key={f} className={styles.field}>
                <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input
                  type={f === 'phone' ? 'tel' : 'text'}
                  placeholder={f === 'address' ? 'Full delivery address' : ''}
                  value={form[f]}
                  onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                />
              </div>
            ))}
            <div className={styles.checkoutBtns}>
              <button className="btn-outline" onClick={() => setStep('cart')}>← Back</button>
              <button className="btn-gold" onClick={handleOrder} disabled={loading}>
                {loading ? 'Placing...' : '✦ Place Order'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.success}>
            <span>✦</span>
            <h3>Order #{orderId} Confirmed!</h3>
            <p>We'll contact you on WhatsApp to confirm delivery details.</p>
            <a
              href={`https://wa.me/918799534254?text=Hi!%20My%20order%20ID%20is%20%23${orderId}`}
              className="btn-primary" target="_blank" rel="noreferrer"
            >
              💬 Chat on WhatsApp
            </a>
            <button className={styles.closeBtn} onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
