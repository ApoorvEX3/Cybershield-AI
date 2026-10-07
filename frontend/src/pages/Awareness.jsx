/**
 * Awareness.jsx — Security awareness Q&A mode.
 * Users can ask general cybersecurity education questions.
 */
import React, { useState } from 'react';
import { BookOpen, Send, HelpCircle } from 'lucide-react';
import { askAwarenessQuestion } from '../utils/api';

const SAMPLE_QUESTIONS = [
  'What is phishing and how do I spot it?',
  'What makes a strong password?',
  'What is Multi-Factor Authentication (MFA)?',
  'What is ransomware and how does it spread?',
  'How does a VPN protect me?',
  'What is a data breach?',
  'How do I safely use public Wi-Fi?',
  'What is social engineering?',
];

export default function Awareness() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const ask = async (q) => {
    const text = (q || question).trim();
    if (!text || loading) return;
    setQuestion(text);
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const result = await askAwarenessQuestion(text);
      setAnswer(result);
    } catch {
      setError('Could not reach the backend. Make sure the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><BookOpen size={20} />Security Awareness</h2>
        <p className="page-subtitle">Ask any cybersecurity question and get a clear, educational answer</p>
      </div>

      {/* Sample questions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title"><HelpCircle size={14} />Sample Questions</span>
        </div>
        <div className="quick-prompts">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button key={i} className="quick-prompt-btn" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Question input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title"><BookOpen size={14} />Ask a Question</span>
        </div>
        <div className="chat-input-wrapper">
          <textarea
            className="chat-textarea"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
            placeholder="Ask a cybersecurity awareness question…"
            rows={2}
            maxLength={500}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => ask()} disabled={!question.trim() || loading}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Answer */}
      {loading && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" />Thinking…
        </div>
      )}

      {error && (
        <div className="refusal-card">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      )}

      {answer && !loading && (
        <div className="card">
          <div className="card-header">
            <span className="card-title"><BookOpen size={14} />Answer</span>
          </div>
          {!answer.safe_response ? (
            <div className="refusal-card">
              <h4>Not Allowed</h4>
              <p>{answer.answer}</p>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 13.5 }}>
              {answer.answer.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}{i < answer.answer.split('\n').length - 1 && <br />}</React.Fragment>
              ))}
              {answer.api_error && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                  [fallback mode — no API key configured]
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
