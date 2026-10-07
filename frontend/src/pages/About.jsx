/**
 * About.jsx — Project information and feature overview.
 */
import React from 'react';
import { Info, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const FEATURES = [
  { title: 'AI-Powered Analysis', desc: 'Uses OpenAI GPT models (or a rule-based fallback) to analyse cybersecurity incidents and provide structured guidance.' },
  { title: 'Threat Classification', desc: 'Classifies incidents into 10 categories: Phishing, Malware, Ransomware, Account Compromise, Password Attack, Social Engineering, Data Breach, Suspicious Login, Scam, and Other.' },
  { title: 'Severity Assessment', desc: 'Assigns Low / Medium / High / Critical severity levels with clear explanations.' },
  { title: 'Defensive Guidance', desc: 'Provides immediate action steps and prevention recommendations tailored to each threat type.' },
  { title: 'Incident History', desc: 'Stores and displays a history of all analysed incidents for review and audit.' },
  { title: 'Security Awareness Mode', desc: 'Answers general cybersecurity education questions in plain English.' },
  { title: 'Safe AI Guardrails', desc: 'Multi-layer safety filter prevents offensive or harmful requests from being fulfilled.' },
  { title: 'Dashboard', desc: 'Live statistics showing total incidents, high/critical count, most common threat, and recent activity.' },
];

const TECH_STACK = [
  { label: 'Frontend', value: 'React 18, CSS3 (dark theme)' },
  { label: 'Backend',  value: 'Python 3.11+, Flask 3, Flask-CORS' },
  { label: 'AI Layer', value: 'OpenAI GPT-4o-mini (optional) + rule-based fallback' },
  { label: 'Storage',  value: 'In-memory + JSON persistence (demo)' },
  { label: 'Testing',  value: 'pytest, pytest-flask' },
];

export default function About() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><Info size={20} />About CyberShield AI</h2>
        <p className="page-subtitle">Intelligent Cybersecurity Response Assistant — defensive & educational</p>
      </div>

      {/* Hero */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #161b22 0%, #0d1f12 100%)', borderColor: 'rgba(0,212,170,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent)' }}>
            <Shield size={32} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              CyberShield AI
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 560 }}>
              An AI-powered cybersecurity assistant that helps users understand and respond to
              security incidents through intelligent analysis, threat classification, and
              clear defensive guidance. 100% educational and defensive — never offensive.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title"><CheckCircle size={14} />Features</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent)', marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Tech Stack</span>
        </div>
        <table className="incident-table">
          <thead>
            <tr><th>Layer</th><th>Technology</th></tr>
          </thead>
          <tbody>
            {TECH_STACK.map(t => (
              <tr key={t.label}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)', width: 120 }}>{t.label}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="refusal-card" style={{ background: 'rgba(248,81,73,0.05)' }}>
        <h4><AlertTriangle size={14} />Disclaimer & Limitations</h4>
        <p style={{ marginTop: 8 }}>
          CyberShield AI is an educational tool. It does <strong>not</strong> replace professional cybersecurity services,
          incident response teams, or law enforcement. For serious incidents (data breaches, ransomware),
          contact your organisation's security team, a professional IR firm, or relevant authorities.
          Without an OpenAI API key, the system uses a rule-based fallback that provides general guidance —
          configure an API key for more accurate, context-aware analysis.
        </p>
      </div>
    </div>
  );
}
