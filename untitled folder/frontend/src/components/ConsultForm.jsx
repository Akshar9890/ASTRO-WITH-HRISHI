import { useState, useEffect, useRef } from 'react';
import { submitConsultation } from '../api/client';
import toast from 'react-hot-toast';
import styles from './ConsultForm.module.css';

const PROBLEMS = [
  'Love & Relationship', 'Marriage & Kundli', 'Career & Job',
  'Business & Finance', 'Family Problems', 'Health Issues',
  'General Horoscope', 'Gemstone / Bracelet Advice',
];

export default function ConsultForm() {
  const [form, setForm]     = useState({ name: '', phone: '', problem: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.problem)
      return toast.error('Please fill all fields 🙏');
    setLoading(true);
    try {
      await submitConsultation(form);
      setDone(true);
      toast.success('✦ Request received! We\'ll contact you within 30 mins.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="contact" ref={ref}>
      <div className="reveal" style={{ textAlign: 'center' }}>
        <span className="section-tag">✦ Begin Your Journey ✦</span>
        <h2 className="section-title">Get Your <span>Free</span> Consultation</h2>
        <div className="divider" />
        <p className="section-sub">Fill in your details and we'll reach out within 30 minutes</p>
      </div>

      <div className={`${styles.wrap} reveal`}>
        {done ? (
          <div className={styles.success}>
            <span>🙏</span>
            <h3>Namaste! We received your request.</h3>
            <p>Our astrologer will contact you within 30 minutes on the number you provided.</p>
            <a
              href={`https://wa.me/919999999999?text=Namaste!%20My%20name%20is%20${encodeURIComponent(form.name)}%20and%20I%20need%20guidance%20about%20${encodeURIComponent(form.problem)}`}
              className="btn-primary" target="_blank" rel="noreferrer"
            >
              💬 Chat on WhatsApp Now
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { id: 'name',  label: 'Your Name',     type: 'text', placeholder: 'Enter your full name' },
              { id: 'phone', label: 'Phone Number',   type: 'tel',  placeholder: '+91 XXXXX XXXXX' },
            ].map(f => (
              <div key={f.id} className={styles.group}>
                <label htmlFor={f.id}>{f.label}</label>
                <input
                  id={f.id} type={f.type} placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                />
              </div>
            ))}
            <div className={styles.group}>
              <label htmlFor="problem">Problem Area</label>
              <select
                id="problem"
                value={form.problem}
                onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}
              >
                <option value="">— Select Your Concern —</option>
                {PROBLEMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? '⏳ Sending...' : '✦ Get Free Consultation ✦'}
            </button>
            <p className={styles.note}>🔒 100% Confidential · No Spam · Respond within 30 mins</p>
          </form>
        )}
      </div>
    </section>
  );
}
