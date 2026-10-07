# 🛡️ CyberShield AI — Intelligent Cybersecurity Response Assistant

> **An AI-powered, defensive cybersecurity assistant that helps users understand, respond to, and learn from cybersecurity incidents.**

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)](https://flask.palletsprojects.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Project Architecture](#project-architecture)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Example Queries](#example-queries)
10. [Security Considerations](#security-considerations)
11. [Limitations](#limitations)
12. [Future Improvements](#future-improvements)
13. [GitHub Upload Instructions](#github-upload-instructions)
14. [Screenshots Guide](#screenshots-guide)
15. [Project Abstract](#project-abstract)
16. [Viva Questions & Answers](#viva-questions--answers)
17. [PPT Presentation Outline](#ppt-presentation-outline)
18. [License](#license)

---

## Overview

CyberShield AI is a full-stack web application that acts as an intelligent cybersecurity incident response assistant. It uses OpenAI's GPT models (or a built-in rule-based fallback when no API key is provided) to:

- Analyse cybersecurity incidents described in plain English
- Classify the threat type (Phishing, Malware, Ransomware, etc.)
- Assess severity (Low / Medium / High / Critical)
- Provide clear, actionable defensive response steps
- Offer prevention recommendations
- Answer general cybersecurity awareness questions
- Maintain an incident history with statistics

**This project is strictly defensive and educational. It will never provide offensive hacking instructions.**

---

## Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Incident Analysis** | Describe an incident in plain English and receive structured analysis |
| 🏷️ **Threat Classification** | 10 categories: Phishing, Malware, Ransomware, Account Compromise, Password Attack, Social Engineering, Data Breach, Suspicious Login, Scam, Other |
| 🔴 **Severity Assessment** | Low / Medium / High / Critical with explanation |
| 🛡️ **Defensive Guidance** | Immediate action steps tailored to the threat |
| 💡 **Prevention Tips** | Recommendations to prevent future incidents |
| 📚 **Security Awareness Mode** | Ask cybersecurity education questions |
| 📊 **Dashboard** | Statistics: total incidents, high/critical count, top threat category, trend chart |
| 📜 **Incident History** | Full history with expandable detail and delete |
| 🔒 **Safety Filter** | Multi-layer block for offensive requests |
| 🔄 **Fallback Mode** | Works without an API key using rule-based analysis |

---

## Project Architecture

```
cybershield-ai/
├── frontend/                   # React 18 Single Page Application
│   ├── public/
│   │   └── index.html          # HTML entry point
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── SeverityBadge.jsx  # Colour-coded severity indicator
│   │   │   └── AnalysisResult.jsx # Renders full AI analysis
│   │   ├── pages/              # Full page views
│   │   │   ├── Dashboard.jsx   # Stats overview
│   │   │   ├── Chat.jsx        # Incident analyzer chat
│   │   │   ├── History.jsx     # Incident history table
│   │   │   ├── Awareness.jsx   # Security Q&A mode
│   │   │   └── About.jsx       # Project info
│   │   ├── utils/
│   │   │   ├── api.js          # Axios API calls
│   │   │   └── helpers.js      # Utility functions
│   │   ├── styles/
│   │   │   └── global.css      # Dark cybersecurity theme
│   │   ├── App.jsx             # Root component + routing
│   │   └── index.js            # React entry point
│   └── package.json
│
├── backend/                    # Python / Flask REST API
│   ├── app.py                  # Flask app factory + blueprints
│   ├── routes/
│   │   ├── chat.py             # POST /api/chat/analyze
│   │   ├── incidents.py        # GET/DELETE /api/incidents/
│   │   ├── dashboard.py        # GET /api/dashboard/stats
│   │   └── awareness.py        # POST /api/awareness/ask
│   ├── services/
│   │   └── ai_service.py       # OpenAI + fallback analysis logic
│   ├── models/
│   │   └── incident_store.py   # In-memory + JSON persistence
│   └── utils/
│       ├── safety_filter.py    # Offensive request detection
│       ├── threat_classifier.py # Rule-based category/severity
│       └── validators.py       # Input validation
│
├── tests/
│   ├── test_api.py             # Integration tests (Flask test client)
│   └── test_utils.py           # Unit tests (classifier + filter)
│
├── docs/                       # Additional documentation
├── screenshots/                # Screenshots for README/presentation
├── .env.example                # Environment variable template
├── .gitignore
├── requirements.txt
├── LICENSE
└── README.md
```

### Data Flow

```
User (Browser)
     │  HTTP POST /api/chat/analyze { message }
     ▼
Flask Backend
     │
     ├─► Safety Filter  ──── BLOCKED ──► Return refusal JSON
     │
     ├─► OpenAI API (if key set)
     │        └─► Structured JSON analysis
     │
     ├─► Rule-based Fallback (no API key)
     │        └─► Pattern-matched analysis
     │
     ├─► Incident Store (save)
     │
     └─► Return analysis JSON
          │
          ▼
React Frontend — renders AnalysisResult component
```

---

## Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.11+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | included with Node.js |
| Git | any | [git-scm.com](https://git-scm.com) |

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/cybershield-ai.git
cd cybershield-ai
```

**2. Set up the Python backend**
```bash
# Create and activate a virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

**3. Configure environment variables**
```bash
cp .env.example .env
# Open .env and set your OPENAI_API_KEY (optional — app works without it)
```

**4. Set up the React frontend**
```bash
cd frontend
npm install
cd ..
```

---

## Configuration

Edit `.env` (copied from `.env.example`):

```env
# Required
SECRET_KEY=your-secret-key-here

# Optional — leave blank for rule-based fallback mode
OPENAI_API_KEY=sk-...your-key...

# Optional
AI_MODEL=gpt-4o-mini          # or gpt-4o for best results
FLASK_DEBUG=false
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
```

> **Without an API key**: The application uses a built-in rule-based classifier that still classifies threats, assigns severity, and provides defensive guidance — just less context-aware than the LLM version. Perfect for demos.

---

## Running the Application

### Terminal 1 — Backend

```bash
cd cybershield-ai
source venv/bin/activate          # Windows: venv\Scripts\activate
cd backend
python app.py
# Server starts at http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd cybershield-ai/frontend
npm start
# App opens at http://localhost:3000
```

Open **http://localhost:3000** in your browser. Done! 🎉

---

## API Documentation

All endpoints are prefixed with `/api`.

### `GET /api/health`
Health check.
```json
{ "status": "ok", "service": "CyberShield AI Backend" }
```

---

### `POST /api/chat/analyze`
Analyse a cybersecurity incident.

**Request:**
```json
{ "message": "I received an email asking me to verify my bank account." }
```

**Response (safe incident):**
```json
{
  "incident_id": "uuid",
  "timestamp": "2024-01-15T10:30:00Z",
  "threat_category": "Phishing",
  "severity": "High",
  "severity_reason": "Phishing attacks directly target credentials.",
  "summary": "This appears to be a phishing attempt...",
  "immediate_actions": ["Do NOT click any links...", "..."],
  "prevention_tips": ["Verify sender addresses...", "..."],
  "indicators_of_compromise": ["Suspicious sender domain", "..."],
  "safe_response": true
}
```

**Response (offensive request blocked):**
```json
{
  "safe_response": false,
  "refusal_message": "I'm designed exclusively for DEFENSIVE cybersecurity..."
}
```

**Errors:** `400` for empty/too-long input.

---

### `GET /api/incidents/`
List all incidents (newest first).
- Query param: `?limit=50`

### `GET /api/incidents/<id>`
Get a single incident by ID.

### `DELETE /api/incidents/<id>`
Delete an incident.

---

### `GET /api/dashboard/stats`
Dashboard statistics.
```json
{
  "total": 12,
  "high_critical": 4,
  "most_common_category": "Phishing",
  "category_counts": { "Phishing": 6, "Malware": 3, "...": 1 },
  "severity_counts": { "High": 5, "Critical": 2, "Medium": 4, "Low": 1 },
  "recent": [...]
}
```

---

### `POST /api/awareness/ask`
Ask a cybersecurity awareness question.

**Request:** `{ "question": "What is phishing?" }`

**Response:** `{ "safe_response": true, "answer": "Phishing is..." }`

---

## Testing

```bash
# From the cybershield-ai/ directory, with venv active:
pytest tests/ -v
```

### Test categories

| Test | File | Description |
|------|------|-------------|
| Health check | test_api.py | Backend is reachable |
| Empty input | test_api.py | Validates 400 response |
| Too-long input | test_api.py | Validates 2000-char limit |
| Phishing query | test_api.py | Classifies phishing correctly |
| Malware query | test_api.py | Classifies malware correctly |
| Ransomware query | test_api.py | Classifies ransomware + high severity |
| Account compromise | test_api.py | Classifies account hacking |
| Offensive blocked | test_api.py | Safety filter blocks hacking request |
| Malware creation blocked | test_api.py | Safety filter blocks malware request |
| Awareness benign | test_api.py | Awareness Q&A works |
| Awareness offensive | test_api.py | Offensive awareness question blocked |
| Full incident flow | test_api.py | Analyze → store → retrieve → delete |
| Classifier unit tests | test_utils.py | 9 category classification tests |
| Severity unit tests | test_utils.py | 3 severity level tests |
| Safety filter unit tests | test_utils.py | 7 offensive/benign detection tests |

---

## Example Queries

Try these in the chat interface:

### Phishing
> "I received an email from security@paypa1.com asking me to click a link and verify my payment information."

### Malware
> "After downloading a free software crack, my computer started running very slowly and my antivirus is disabled."

### Ransomware
> "All my Word and Excel files are encrypted and renamed with a .locked extension. There's a file called HOW_TO_DECRYPT.txt on my desktop."

### Account Compromise
> "Someone changed my Gmail password and recovery email. I can no longer log into my account."

### Social Engineering
> "Someone called me claiming to be from Microsoft saying my computer has a virus and asking for remote access."

### Suspicious Login
> "I received an alert that someone logged into my Facebook account from Romania at 3am."

### Data Breach
> "I got an email from my bank saying there was a data breach and my personal information may have been exposed."

### Awareness Question
> "What is Multi-Factor Authentication and should I use it?"

---

## Security Considerations

1. **API keys**: Never commit `.env` to version control. The `.gitignore` excludes it.
2. **Input validation**: All inputs are validated for length and content before processing.
3. **Safety filter**: Two layers — keyword regex filter + LLM system prompt — block offensive requests.
4. **CORS**: Configured to only accept requests from the React frontend origin.
5. **Rate limiting**: Not implemented in this demo; add `Flask-Limiter` for production.
6. **Authentication**: No user auth in this demo; add for production use.
7. **HTTPS**: Use a reverse proxy (nginx) with Let's Encrypt for production deployment.
8. **Data persistence**: Incidents are stored in a local JSON file; use a proper database for production.

---

## Limitations

- No user authentication or multi-user support
- In-memory/JSON storage (not suitable for production)
- No rate limiting on API endpoints
- Rule-based fallback is less accurate than LLM analysis
- LLM analysis quality depends on the model and API key availability
- Not a replacement for professional incident response or forensic analysis
- Cannot access external systems or verify the described incident

---

## Future Improvements

- [ ] User authentication and multi-tenant support
- [ ] PostgreSQL database integration
- [ ] Real-time threat intelligence feed integration (VirusTotal API, etc.)
- [ ] Email analysis — paste raw email headers for phishing analysis
- [ ] URL/domain reputation checking
- [ ] File hash checking against known malware databases
- [ ] Export incident reports as PDF
- [ ] Email notifications for high/critical incidents
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Integration with SIEM systems (Splunk, ELK)
- [ ] Containerisation with Docker

---

## GitHub Upload Instructions

```bash
# 1. Initialize git in the project root
cd cybershield-ai
git init

# 2. Add all files
git add .

# 3. First commit
git commit -m "Initial commit: CyberShield AI v1.0"

# 4. Create a new repository on GitHub (github.com → New Repository)
#    Name: cybershield-ai
#    Visibility: Public
#    Do NOT initialize with README (we have one)

# 5. Connect and push
git remote add origin https://github.com/YOUR_USERNAME/cybershield-ai.git
git branch -M main
git push -u origin main
```

> ✅ Verify `.env` is in `.gitignore` before pushing — **never push real API keys.**

---

## Screenshots Guide

Take these screenshots for your presentation:

| # | Screen | What to show |
|---|--------|-------------|
| 1 | **Dashboard** | Stats cards + category bar chart (after submitting a few incidents) |
| 2 | **Chat — User input** | Typing a phishing incident description |
| 3 | **Chat — Phishing analysis** | Full analysis result with High severity badge |
| 4 | **Chat — Ransomware analysis** | Critical severity + immediate actions |
| 5 | **Chat — Safety refusal** | Offensive request being blocked |
| 6 | **Incident History** | Table with multiple incidents |
| 7 | **History — Expanded row** | Expanded incident with full analysis |
| 8 | **Awareness Mode** | A cybersecurity education Q&A |
| 9 | **About page** | Feature grid + tech stack |
| 10 | **Mobile view** (optional) | Responsive layout at narrower width |

---

## Project Abstract

CyberShield AI is an AI-powered, web-based cybersecurity response assistant designed to help individuals and organisations understand and respond to common cybersecurity threats. The system integrates a Python/Flask backend with a React frontend and leverages OpenAI's large language models to provide intelligent, contextual analysis of cybersecurity incidents described in plain English. When a user describes a security problem — such as receiving a suspicious email, detecting malware, or discovering an account compromise — the system classifies the threat into one of ten categories, assigns a severity level from Low to Critical, and delivers clear defensive response steps and prevention recommendations. A multi-layer safety filter ensures the assistant operates exclusively in a defensive and educational capacity, blocking any requests for offensive hacking guidance. The project includes a real-time dashboard with incident statistics, a full incident history, a security awareness Q&A mode, and a rule-based fallback that functions without an external API key. CyberShield AI demonstrates the practical application of artificial intelligence in the cybersecurity domain, combining modern web technologies with responsible AI deployment principles.

---

## Viva Questions & Answers

**Q1: What is the main objective of CyberShield AI?**
A: To provide an AI-powered, defensive cybersecurity assistant that helps users understand, respond to, and learn from cybersecurity incidents. It classifies threats, assesses severity, and provides actionable guidance — all in a strictly defensive and educational manner.

**Q2: What technologies did you use and why?**
A: Python/Flask for the backend because Python is dominant in AI/ML ecosystems and Flask is lightweight and easy to learn. React for the frontend because it enables component-based UI development and fast interactivity. OpenAI's API for AI analysis because it provides high-quality natural-language understanding. The project is designed to be beginner-friendly.

**Q3: How does the AI analysis work?**
A: User messages are sent to the Flask backend, which first passes them through a regex-based safety filter. If safe, the message is sent to the OpenAI API with a carefully crafted system prompt that instructs the model to respond with structured JSON containing the threat category, severity, actions, and prevention tips. If no API key is configured, a rule-based classifier provides pattern-matched analysis as a fallback.

**Q4: How do you prevent the AI from giving harmful advice?**
A: Two layers of protection: (1) a regex-based safety filter that checks for offensive patterns before the AI is called, and (2) a strict LLM system prompt that explicitly instructs the model never to provide offensive instructions and defines the exact JSON response format it must follow. Offensive requests receive a polite refusal with an educational redirect.

**Q5: What threat categories does CyberShield AI support?**
A: Ten categories: Phishing, Malware, Ransomware, Account Compromise, Password Attack, Social Engineering, Data Breach, Suspicious Login, Scam, and Other.

**Q6: What are the severity levels and what do they mean?**
A: Low (minor risk, no immediate action required), Medium (moderate risk, investigate), High (significant risk, act promptly), Critical (immediate threat to data, systems, or identity — act immediately).

**Q7: Does the application work without an OpenAI API key?**
A: Yes. The fallback mode uses a rule-based threat classifier (`threat_classifier.py`) and a set of pre-written response templates. It correctly identifies threat categories using regex patterns and provides standard defensive guidance, though it is less context-aware than the LLM version.

**Q8: How is incident data stored?**
A: In an in-memory Python list that is persisted to a JSON file (`incidents.json`) after every write. This is suitable for a demonstration project. A production system would use a proper relational database like PostgreSQL with SQLAlchemy.

**Q9: How did you test the application?**
A: Using pytest with the Flask test client for integration tests (covering all endpoints, edge cases, safety filter, and a full incident lifecycle), and unit tests for the threat classifier and safety filter utilities. The test suite covers 20+ scenarios including benign queries, threat classifications, offensive request blocking, input validation, and CRUD operations.

**Q10: What are the limitations of the project?**
A: No user authentication, JSON-only storage, no rate limiting, and the rule-based fallback is less accurate than LLM analysis. The system also cannot access external systems to verify described incidents.

**Q11: What would you improve if you had more time?**
A: Add user authentication, integrate a real threat intelligence API (like VirusTotal), add URL/domain reputation checking, export incidents as PDF reports, containerise with Docker, and add email header analysis for phishing detection.

**Q12: Is CyberShield AI production-ready?**
A: Not as-is. For production, you would need: proper database, user authentication, HTTPS, rate limiting, horizontal scaling, security auditing, and compliance review. This project demonstrates the concept and architecture clearly and is ready for demonstration and academic submission.

---

## PPT Presentation Outline

### Slide 1 — Title Slide
- **CyberShield AI**
- Intelligent Cybersecurity Response Assistant
- Your Name | Course | Date
- Shield logo / cybersecurity imagery

### Slide 2 — Problem Statement
- Cybercrime costs the world $8 trillion/year (2023)
- Most individuals and SMBs lack cybersecurity expertise
- When an incident happens, people don't know what to do
- **Gap**: No accessible, intelligent, immediate guidance tool

### Slide 3 — Project Objective
- Build an AI-powered web assistant for defensive cybersecurity
- Help users: understand threats, respond correctly, prevent recurrence
- Strictly defensive and educational
- Accessible to non-technical users

### Slide 4 — System Architecture
- Architecture diagram: Browser → React → Flask API → OpenAI / Fallback
- Key components: Safety Filter, AI Service, Incident Store
- Frontend: React + dark theme CSS
- Backend: Python Flask REST API

### Slide 5 — Core Features (Part 1)
- AI Incident Analysis with structured output
- 10-category Threat Classification
- 4-level Severity Assessment (Low/Medium/High/Critical)
- Immediate Defensive Actions
- Prevention Recommendations

### Slide 6 — Core Features (Part 2)
- Incident History with persistence
- Real-time Dashboard with statistics
- Security Awareness Q&A Mode
- Multi-layer Safety Filter (no offensive output)
- Fallback mode — works without API key

### Slide 7 — Live Demo / Screenshots
- Screenshot: Dashboard with stats
- Screenshot: Chat — phishing analysis
- Screenshot: Critical severity (ransomware)
- Screenshot: Safety refusal (blocked offensive request)

### Slide 8 — Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS3 |
| Backend | Python 3.11, Flask 3 |
| AI | OpenAI GPT-4o-mini |
| Storage | In-memory + JSON |
| Testing | pytest, pytest-flask |

### Slide 9 — Safety & Ethics
- Safety filter with 15+ offensive patterns
- LLM system prompt guardrails
- Defensive-only design principle
- No credential storage, no external data collection
- MIT License — open source

### Slide 10 — Testing
- 20+ test cases
- Integration tests: all API endpoints
- Unit tests: threat classifier, safety filter
- Test types: phishing, malware, account compromise, offensive blocking, input validation, full lifecycle
- All tests pass ✅

### Slide 11 — Limitations & Future Work
**Limitations:** Demo storage, no auth, no rate limiting
**Future:** VirusTotal integration, PDF export, Docker, email header analysis, multi-language support

### Slide 12 — Conclusion
- Successfully built a full-stack AI-powered cybersecurity assistant
- Demonstrates AI + web + cybersecurity integration
- Defensive-first design with ethical AI guardrails
- Extensible architecture for future enhancements
- **Thank you — Questions?**

---

## License

This project is licensed under the [MIT License](LICENSE).

---

*CyberShield AI — Defensive. Educational. Intelligent.*
