/**
 * App.jsx — Root component. Handles client-side navigation via state.
 */
import React, { useState } from 'react';
import './styles/global.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import History from './pages/History';
import Awareness from './pages/Awareness';
import About from './pages/About';

const PAGES = {
  dashboard: Dashboard,
  chat:      Chat,
  history:   History,
  awareness: Awareness,
  about:     About,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        <PageComponent onNavigate={setActivePage} />
      </main>
    </div>
  );
}
