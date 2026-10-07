/**
 * api.js — Axios instance and API helper functions.
 * All backend calls go through this module.
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Chat / Incident Analysis ──────────────────────────────────────────────────

/**
 * Send a cybersecurity incident description for AI analysis.
 * @param {string} message - User's plain-English description
 * @returns {Promise<object>} - Structured analysis result
 */
export async function analyzeIncident(message) {
  const { data } = await api.post('/chat/analyze', { message });
  return data;
}

// ── Incidents (history) ───────────────────────────────────────────────────────

export async function getIncidents(limit = 100) {
  const { data } = await api.get('/incidents/', { params: { limit } });
  return data;
}

export async function getIncident(id) {
  const { data } = await api.get(`/incidents/${id}`);
  return data;
}

export async function deleteIncident(id) {
  const { data } = await api.delete(`/incidents/${id}`);
  return data;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}

// ── Awareness ─────────────────────────────────────────────────────────────────

export async function askAwarenessQuestion(question) {
  const { data } = await api.post('/awareness/ask', { question });
  return data;
}

export default api;
