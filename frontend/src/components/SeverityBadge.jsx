/**
 * SeverityBadge.jsx — Displays a coloured severity indicator.
 */
import React from 'react';
import { AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';
import { severityClass } from '../utils/helpers';

const ICONS = {
  Low:      Info,
  Medium:   AlertCircle,
  High:     AlertTriangle,
  Critical: Zap,
};

export default function SeverityBadge({ severity }) {
  const cls = severityClass(severity);
  const Icon = ICONS[severity] || AlertCircle;
  return (
    <span className={`severity-badge ${cls}`}>
      <Icon size={10} />
      {severity || 'Unknown'}
    </span>
  );
}
