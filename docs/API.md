# CyberShield AI — API Reference

## Base URL
`http://localhost:5000/api`

---

## Authentication
No authentication required for local development. For production, add JWT or API key middleware.

---

## Endpoints

### Health Check
```
GET /health
```
**Response 200:**
```json
{ "status": "ok", "service": "CyberShield AI Backend" }
```

---

### Analyze Incident
```
POST /chat/analyze
Content-Type: application/json
```
**Request body:**
```json
{ "message": "string (1–2000 characters)" }
```
**Success response 200:**
```json
{
  "incident_id":             "string (UUID)",
  "timestamp":               "ISO 8601 string",
  "safe_response":           true,
  "threat_category":         "Phishing | Malware | Ransomware | Account Compromise | Password Attack | Social Engineering | Data Breach | Suspicious Login | Scam | Other",
  "severity":                "Low | Medium | High | Critical",
  "severity_reason":         "string",
  "summary":                 "string",
  "immediate_actions":       ["string", ...],
  "prevention_tips":         ["string", ...],
  "indicators_of_compromise": ["string", ...]
}
```
**Blocked (offensive) response 200:**
```json
{
  "safe_response":   false,
  "refusal_message": "string"
}
```
**Error 400:**
```json
{ "error": "Message cannot be empty." }
```

---

### List Incidents
```
GET /incidents/?limit=100
```
**Response 200:** Array of incident objects.

---

### Get Incident
```
GET /incidents/<uuid>
```
**Response 200:** Single incident object.
**Response 404:** `{ "error": "Incident not found" }`

---

### Delete Incident
```
DELETE /incidents/<uuid>
```
**Response 200:** `{ "message": "Incident deleted" }`
**Response 404:** `{ "error": "Incident not found" }`

---

### Dashboard Statistics
```
GET /dashboard/stats
```
**Response 200:**
```json
{
  "total":                 0,
  "high_critical":         0,
  "most_common_category":  "—",
  "category_counts":       { "Phishing": 3, "Malware": 2 },
  "severity_counts":       { "High": 3, "Medium": 2 },
  "recent":                [...]
}
```

---

### Awareness Question
```
POST /awareness/ask
Content-Type: application/json
```
**Request body:**
```json
{ "question": "string (1–500 characters)" }
```
**Response 200:**
```json
{
  "safe_response": true,
  "answer": "string"
}
```
