/**
 * History.jsx — Displays all stored incidents with detail expansion.
 */
import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { getIncidents, deleteIncident } from '../utils/api';
import { formatTimestamp } from '../utils/helpers';
import SeverityBadge from '../components/SeverityBadge';
import AnalysisResult from '../components/AnalysisResult';

export default function History() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch {
      setError('Could not load incidents. Make sure the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    try {
      await deleteIncident(id);
      setIncidents(prev => prev.filter(i => i.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      alert('Failed to delete incident.');
    }
  };

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title"><HistoryIcon size={20} />Incident History</h2>
          <p className="page-subtitle">All analysed cybersecurity incidents — click a row to expand</p>
        </div>
        <button className="btn" onClick={load}><RefreshCw size={13} />Refresh</button>
      </div>

      <div className="card">
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', padding: '16px 0' }}>
            <div className="spinner" />Loading incidents…
          </div>
        )}

        {error && (
          <div className="refusal-card">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && incidents.length === 0 && (
          <div className="empty-state">
            <HistoryIcon size={40} />
            <h3>No incidents yet</h3>
            <p>Analyse a cybersecurity incident to see it here.</p>
          </div>
        )}

        {!loading && incidents.length > 0 && (
          <>
            <table className="incident-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Time</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <React.Fragment key={inc.id}>
                    <tr
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggle(inc.id)}
                    >
                      <td className="incident-msg">{inc.user_message}</td>
                      <td><span className="category-chip">{inc.threat_category}</span></td>
                      <td><SeverityBadge severity={inc.severity} /></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        {formatTimestamp(inc.timestamp)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn"
                            style={{ padding: '4px 8px' }}
                            onClick={e => { e.stopPropagation(); toggle(inc.id); }}
                          >
                            {expanded === inc.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 8px' }}
                            onClick={e => { e.stopPropagation(); handleDelete(inc.id); }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === inc.id && (
                      <tr>
                        <td colSpan={5} style={{ padding: '0 0 12px 0', background: 'var(--bg-secondary)' }}>
                          <div style={{ padding: '12px 16px' }}>
                            <AnalysisResult analysis={inc} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
              {incidents.length} incident{incidents.length !== 1 ? 's' : ''} total
            </div>
          </>
        )}
      </div>
    </div>
  );
}
