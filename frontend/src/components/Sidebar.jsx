/**
 * Sidebar.jsx — Navigation sidebar component.
 */
import React from 'react';
import {
  Shield, MessageSquare, History, LayoutDashboard,
  BookOpen, Info, Wifi,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',  icon: LayoutDashboard,  label: 'Dashboard' },
  { id: 'chat',       icon: MessageSquare,     label: 'Incident Analyzer' },
  { id: 'history',    icon: History,           label: 'Incident History' },
  { id: 'awareness',  icon: BookOpen,          label: 'Security Awareness' },
  { id: 'about',      icon: Info,              label: 'About' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={18} />
        </div>
        <div>
          <h1>CyberShield</h1>
          <span>AI Security Assistant</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Status indicator */}
      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="status-dot" />
          <Wifi size={12} />
          <span>System Active</span>
        </div>
      </div>
    </nav>
  );
}
