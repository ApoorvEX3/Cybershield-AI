/**
 * Dashboard.jsx — Overview page with statistics and recent incidents.
 */
import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, ShieldAlert, Flame, Tag, Clock, RefreshCw,
} from 'lucide-react';
import { getDashboardStats } from '../utils/api';
import { formatTimestamp } from '../utils/helpers';
import SeverityBadge from '../components/SeverityBadge';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError('Could not reach the backend. Make sure the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">
          <LayoutDashboard size={20} />
          Dashboard
        </h2>
        <p className="page-subtitle">Real-time overview of cybersecurity incidents</p>
      </div>

      {error && (
        <div className="refusal-card" style={{ marginBottom: 20 }}>
          <h4><ShieldAlert size={14} /> Backend Unavailable</h4>
          <p>{error}</p>
        </div>
      )}

      {loading && !error && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" />
          Loading statistics…
        </div>
      )}

      {stats && !loading && (
        <>
          {/* Stat cards */}
          <div className="stats-grid">
            <StatCard
              label="Total Incidents"
              value={stats.total}
              icon={<ShieldAlert size={18} />}
              color="#00d4aa"
            />
            <StatCard
              label="High / Critical"
              value={stats.high_critical}
              icon={<Flame size={18} />}
              color="#f85149"
            />
            <StatCard
              label="Top Threat"
              value={stats.most_common_category}
              icon={<Tag size={18} />}
              color="#d29922"
              small
            />
            <StatCard
              label="Recent (last 24 h)"
              value={stats.recent?.length ?? 0}
              icon={<Clock size={18} />}
              color="#58a6ff"
            />
          </div>

          {/* Threat distribution */}
          {stats.category_counts && Object.keys(stats.category_counts).length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <span className="card-title"><Tag size={14} /> Threat Categories</span>
              </div>
              <CategoryBar counts={stats.category_counts} total={stats.total} />
            </div>
          )}

          {/* Recent incidents */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><Clock size={14} /> Recent Incidents</span>
              <button className="btn" style={{ fontSize: 12, padding: '5px 10px' }} onClick={load}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            {stats.recent?.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px' }}>
                <p>No incidents yet. Use the Incident Analyzer to get started.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('chat')}>
                  Analyze Incident →
                </button>
              </div>
            ) : (
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map(inc => (
                    <tr key={inc.id}>
                      <td className="incident-msg">{inc.user_message}</td>
                      <td><span className="category-chip">{inc.threat_category}</span></td>
                      <td><SeverityBadge severity={inc.severity} /></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        {formatTimestamp(inc.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function StatCard({ label, value, icon, color, small }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: `${color}22`, color }}>
          {icon}
        </div>
      </div>
      <div className={small ? '' : 'stat-value'} style={small ? { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' } : {}}>
        {value ?? '—'}
      </div>
    </div>
  );
}

function CategoryBar({ counts, total }) {
  const COLORS = [
    '#00d4aa', '#f85149', '#d29922', '#58a6ff',
    '#bc8cff', '#ff7b72', '#79c0ff', '#56d364',
  ];
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entries.map(([cat, count], i) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={cat}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {count} ({pct}%)
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
