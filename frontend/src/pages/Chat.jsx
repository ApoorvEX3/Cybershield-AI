/**
 * Chat.jsx — Main incident analysis chat interface.
 * Users describe a cybersecurity problem; the AI analyses it.
 */
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { analyzeIncident } from '../utils/api';
import { formatTimestamp } from '../utils/helpers';
import AnalysisResult from '../components/AnalysisResult';

const QUICK_PROMPTS = [
  'I received an email asking me to verify my bank account.',
  'My computer is running very slowly and showing strange pop-ups.',
  'Someone logged into my Gmail account from a different country.',
  'I got a call from "Microsoft Support" asking for remote access.',
  'My files are encrypted and there\'s a ransom note on my desktop.',
  'I may have clicked a phishing link — what do I do now?',
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Welcome to CyberShield AI 🛡️\n\nDescribe a cybersecurity incident and I\'ll analyse it, classify the threat, assess severity, and give you clear defensive steps.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: userText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const analysis = await analyzeIncident(userText);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          analysis,
          timestamp: analysis.timestamp || new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Unable to reach the backend server. Please make sure the Flask server is running on port 5000.',
          error: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: 'Chat cleared. Describe a new cybersecurity incident to begin.',
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title"><MessageSquare size={20} />Incident Analyzer</h2>
          <p className="page-subtitle">Describe a cybersecurity problem to receive AI-powered analysis and guidance</p>
        </div>
        <button className="btn btn-danger" onClick={clearChat}>
          <Trash2 size={13} /> Clear
        </button>
      </div>

      <div className="card">
        <div className="chat-container">
          {/* Message list */}
          <div className="chat-messages">
            {messages.map(msg => (
              <Message key={msg.id} msg={msg} />
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                <div className="spinner" />
                Analysing incident…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="chat-input-area">
            {/* Quick prompts */}
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} className="quick-prompt-btn" onClick={() => send(p)}>
                  {p.length > 40 ? p.slice(0, 40) + '…' : p}
                </button>
              ))}
            </div>

            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Describe a cybersecurity incident… (Enter to send, Shift+Enter for new line)"
                rows={2}
                maxLength={2000}
                disabled={loading}
              />
              <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>
                <Send size={18} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              {input.length}/2000 characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Individual message bubble ───────────────────────────────── */
function Message({ msg }) {
  if (msg.role === 'user') {
    return (
      <div>
        <div className="message-bubble user">{msg.text}</div>
        <div className="message-meta" style={{ textAlign: 'right' }}>{formatTimestamp(msg.timestamp)}</div>
      </div>
    );
  }

  return (
    <div>
      {msg.analysis ? (
        <AnalysisResult analysis={msg.analysis} />
      ) : (
        <div className={`message-bubble assistant ${msg.error ? 'refusal-card' : ''}`} style={msg.error ? { border: '1px solid rgba(248,81,73,0.3)' } : {}}>
          {msg.text.split('\n').map((line, i) => (
            <React.Fragment key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</React.Fragment>
          ))}
        </div>
      )}
      <div className="message-meta">{formatTimestamp(msg.timestamp)}</div>
    </div>
  );
}
