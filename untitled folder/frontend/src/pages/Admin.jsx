import { useState, useEffect, useCallback } from 'react';
import { adminStats, adminConsultations, adminOrders, updateConsultation, updateOrder } from '../api/client';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const STATUS_COLORS = {
  new: '#D4AF37', contacted: '#25D366', closed: '#888',
  pending: '#D4AF37', confirmed: '#25D366', shipped: '#4B9CD3', delivered: '#888',
};

export default function Admin() {
  const [authed, setAuthed]     = useState(!!sessionStorage.getItem('adminKey'));
  const [key, setKey]           = useState('');
  const [tab, setTab]           = useState('stats');
  const [stats, setStats]       = useState(null);
  const [leads, setLeads]       = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'stats') {
        const r = await adminStats();
        setStats(r.data);
      } else if (tab === 'leads') {
        const r = await adminConsultations({ limit: 100 });
        setLeads(r.data.rows || []);
      } else if (tab === 'orders') {
        const r = await adminOrders({ limit: 100 });
        setOrders(r.data.rows || []);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        sessionStorage.removeItem('adminKey');
        setAuthed(false);
        toast.error('Invalid admin key');
      } else if (e.code === 'ERR_NETWORK' || !e.response) {
        setError('Cannot connect to backend. Make sure the server is running on port 5001.');
      } else {
        setError(e.response?.data?.error || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const login = () => {
    if (!key.trim()) return toast.error('Enter your admin key');
    sessionStorage.setItem('adminKey', key.trim());
    setAuthed(true);
  };

  const logout = () => {
    sessionStorage.removeItem('adminKey');
    setAuthed(false);
    setKey('');
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await updateConsultation(id, { status });
      setLeads(l => l.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Order updated');
    } catch { toast.error('Update failed'); }
  };

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>✦ Astro With Hrishi</div>
          <h2>Admin Dashboard</h2>
          <p>Enter your admin key to continue</p>
          <input
            type="password"
            placeholder="Admin Key"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          <button className="btn-gold" style={{ justifyContent: 'center' }} onClick={login}>
            Enter Dashboard →
          </button>
          <a href="/" className={styles.backLink}>← Back to Site</a>
        </div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.admin}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>✦ Astro With Hrishi</div>
        <nav className={styles.sidebarNav}>
          {[
            ['stats',  '📊', 'Dashboard'],
            ['leads',  '📋', 'Leads'],
            ['orders', '📦', 'Orders'],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={`${styles.navBtn} ${tab === id ? styles.active : ''}`}
              onClick={() => setTab(id)}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.backBtn}>← Back to Site</a>
          <button className={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h2 className={styles.pageTitle}>
            {tab === 'stats' ? '📊 Dashboard' : tab === 'leads' ? '📋 Consultation Leads' : '📦 Orders'}
          </h2>
          <button className={styles.refreshBtn} onClick={load} disabled={loading}>
            {loading ? '...' : '↻ Refresh'}
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className={styles.errorBanner}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && <div className={styles.loading}><span className={styles.spinner} /> Loading...</div>}

        {/* ── STATS ── */}
        {tab === 'stats' && !loading && stats && (
          <div className={styles.statsGrid}>
            {[
              ['📋', 'Total Leads',     stats.consultations],
              ['🔔', 'New Leads',       stats.newLeads],
              ['📅', "Today's Leads",   stats.todayLeads],
              ['📦', 'Total Orders',    stats.orders],
              ['🛒', "Today's Orders",  stats.todayOrders],
              ['💰', 'Confirmed Rev.',  `₹${Number(stats.revenue || 0).toLocaleString()}`],
            ].map(([icon, label, val]) => (
              <div key={label} className={styles.statCard}>
                <span className={styles.statIcon}>{icon}</span>
                <div>
                  <div className={styles.statVal}>{val}</div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LEADS ── */}
        {tab === 'leads' && !loading && (
          <div className={styles.tableWrap}>
            {leads.length === 0 ? (
              <div className={styles.empty}>No consultation leads yet.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Phone</th>
                    <th>Problem</th><th>Status</th><th>Date</th><th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id}>
                      <td className={styles.idCell}>{l.id}</td>
                      <td>{l.name}</td>
                      <td>
                        <a href={`tel:${l.phone}`} className={styles.phoneLink}>{l.phone}</a>
                      </td>
                      <td>{l.problem}</td>
                      <td>
                        <span className={styles.statusBadge} style={{
                          background: (STATUS_COLORS[l.status] || '#888') + '22',
                          color: STATUS_COLORS[l.status] || '#888',
                          border: `1px solid ${(STATUS_COLORS[l.status] || '#888')}55`,
                        }}>
                          {l.status}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(l.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={l.status}
                          onChange={e => updateLeadStatus(l.id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && !loading && (
          <div className={styles.tableWrap}>
            {orders.length === 0 ? (
              <div className={styles.empty}>No orders yet.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Phone</th>
                    <th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className={styles.idCell}>{o.id}</td>
                      <td>{o.name}</td>
                      <td>
                        <a href={`tel:${o.phone}`} className={styles.phoneLink}>{o.phone}</a>
                      </td>
                      <td className={styles.itemsCell}>
                        {Array.isArray(o.items)
                          ? o.items.map(i => `${i.product} ×${i.qty}`).join(', ')
                          : o.items}
                      </td>
                      <td className={styles.totalCell}>₹{Number(o.total).toLocaleString()}</td>
                      <td>
                        <span className={styles.statusBadge} style={{
                          background: (STATUS_COLORS[o.status] || '#888') + '22',
                          color: STATUS_COLORS[o.status] || '#888',
                          border: `1px solid ${(STATUS_COLORS[o.status] || '#888')}55`,
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
