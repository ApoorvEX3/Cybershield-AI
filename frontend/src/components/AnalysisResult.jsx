/**
 * AnalysisResult.jsx — Renders the full structured AI analysis.
 * Shows threat category, severity, actions, IOCs, and prevention tips.
 */
import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, CheckCircle, BookOpen,
  ClipboardList, ChevronDown, ChevronUp,
} from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function AnalysisResult({ analysis }) {
  const [showPrevention, setShowPrevention] = useState(false);

  // Safety refusal
  if (!analysis.safe_response) {
    return (
      <div className="refusal-card">
        <h4><ShieldAlert size={14} /> Request Not Allowed</h4>
        <p>{analysis.refusal_message}</p>
      </div>
    );
  }

  return (
    <div className="analysis-card">
      {/* Header: category + severity */}
      <div className="analysis-header">
        <span className="category-chip">
          <ShieldAlert size={11} />
          {analysis.threat_category}
        </span>
        <SeverityBadge severity={analysis.severity} />
        {analysis.mode === 'fallback' && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [rule-based mode]
          </span>
        )}
      </div>

      <div className="analysis-body">
        {/* Summary */}
        <div className="analysis-section">
          <h4>Situation Summary</h4>
          <p>{analysis.summary}</p>
        </div>

        {/* Severity reason */}
        {analysis.severity_reason && (
          <div className="analysis-section">
            <h4>Severity Reason</h4>
            <p>{analysis.severity_reason}</p>
          </div>
        )}

        {/* IOCs */}
        {analysis.indicators_of_compromise?.length > 0 && (
          <div className="analysis-section">
            <h4>Indicators of Compromise</h4>
            <div className="ioc-list">
              {analysis.indicators_of_compromise.map((ioc, i) => (
                <span key={i} className="ioc-tag">{ioc}</span>
              ))}
            </div>
          </div>
        )}

        {/* Immediate actions */}
        {analysis.immediate_actions?.length > 0 && (
          <div className="analysis-section">
            <h4><CheckCircle size={11} style={{ display: 'inline', marginRight: 4 }} />
              Immediate Actions</h4>
            <ul className="action-list">
              {analysis.immediate_actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Prevention tips — collapsible */}
        {analysis.prevention_tips?.length > 0 && (
          <div className="analysis-section">
            <button
              className="btn"
              style={{ marginBottom: 8, fontSize: 12 }}
              onClick={() => setShowPrevention(v => !v)}
            >
              <BookOpen size={13} />
              Prevention Recommendations
              {showPrevention ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showPrevention && (
              <ul className="action-list">
                {analysis.prevention_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
