# HelpDesk ITSM Lab — Incident Triage, Prioritization & Escalation

A ServiceNow-style IT service desk simulation for a **fictional hospital, Meridian Lakes Health**. I work a queue of 14 realistic IT incidents as a **Tier 1 Service Desk analyst**: scoring priority with the ITIL **Impact × Urgency** matrix, tracking **SLAs**, resolving the routine issues at first contact, and **escalating** the rest to the right resolver group.

**Live demo:** https://alhasanal.github.io/itsm-ticketing-lab/

![Service Desk Dashboard](screenshots/01-dashboard.png)

> **Lab disclaimer:** This is a simulated environment built for my portfolio. The organization, people, devices, and ticket numbers are fictional. The workflow, fields, states, and priority model mirror ServiceNow ITSM Incident Management and ITIL 4 practices.

---

## What this project shows

| Skill | Where to see it |
|---|---|
| Prioritizing with Impact x Urgency (never "gut feel") | Every ticket has a written *prioritization rationale* |
| First-contact resolution at Tier 1 | INC0010001 (lockout), 0002 (expired password), 0003 (Outlook auth), 0004 (VPN/MFA), 0006 (printer remap), 0014 (app error) |
| Verifying identity before any account change | INC0010001, INC0010002 — identity check logged before unlock/reset |
| Knowing *when* to escalate | Beyond Tier 1's access or skills, a hardware fault, many users affected, or a security incident |
| Escalating to the *right* group | Wi-Fi area outage -> Network (INC0010009) · dead printer -> Desktop Support (INC0010010) · shared drive down -> server team (INC0010011) · Epic print mapping -> Clinical Apps (INC0010013) |
| Security incident handling at Tier 1 | INC0010012 — phishing with credentials entered: preserve evidence, don't investigate, escalate to Security immediately |
| Incident vs. Service Request | INC0010008 — "I want a second monitor" converted to a request (RITM) |
| Honest SLA reporting | INC0010004 — an overnight ticket that missed its response target, documented with a prevention recommendation |
| Clear work notes & customer communication | Activity stream on every ticket separates *work notes* from *customer comments* |

### Shift metrics (from the dashboard)

- **14** incidents · **6** open · **1** awaiting triage
- **95%** SLA compliance (20 of 21 response + resolution targets met)
- **86%** first-contact / Tier 1 resolution (6 of 7 resolved incidents)
- **42%** escalation rate (5 of 12 worked incidents) — weighted to show *routing decisions*: recognizing what's beyond Tier 1 and sending it to the right team

---

## Priority model

| | **Urgency 1 – High** | **Urgency 2 – Medium** | **Urgency 3 – Low** |
|---|---|---|---|
| **Impact 1 – High** | P1 Critical | P2 High | P3 Moderate |
| **Impact 2 – Medium** | P2 High | P3 Moderate | P4 Low |
| **Impact 3 – Low** | P3 Moderate | P4 Low | P5 Planning |

| Priority | Response | Resolution | Customer updates |
|---|---|---|---|
| P1 Critical | 15 min | 4 h | Every 30 min |
| P2 High | 30 min | 8 h | Every 60 min |
| P3 Moderate | 2 h | 24 h | Daily |
| P4 Low | 8 h | 72 h | On change |
| P5 Planning | 24 h | 5 days | On change |

Full definitions and scoring examples: [docs/priority-and-sla.md](docs/priority-and-sla.md)

---

## Screenshots

### Incident queue — sorted by priority, with live SLA bars
![Incident queue](screenshots/02-incident-queue.png)

### Tier 1 first-contact resolution — account lockout before shift
![Tier 1 resolution](screenshots/06-tier1-first-contact-resolution.png)

### Security escalation — phishing with credentials entered
![Security escalation](screenshots/04-security-escalation.png)

### Honest SLA reporting — an overnight response breach, documented with a fix
![SLA breach](screenshots/10-sla-breach-honest-reporting.png)

### New incident triage assistant — priority is calculated, routing is suggested
![New incident triage](screenshots/07-new-incident-triage.png)

### Escalated incidents view
![Escalated queue](screenshots/11-escalated-queue.png)

### Priority & SLA matrix
![Priority matrix](screenshots/08-priority-matrix.png)

### Escalation policy
![Escalation policy](screenshots/09-escalation-policy.png)

---

## Documentation

- [Ticket walkthroughs](docs/ticket-walkthroughs.md) — how and why each key ticket was prioritized, worked, and resolved or escalated
- [Escalation SOP](docs/escalation-sop.md) — tiers, assignment groups, when and how to escalate
- [Priority & SLA guide](docs/priority-and-sla.md) — scoring rules and examples
- [Portfolio & interview notes](docs/portfolio-notes.md) — summary, resume bullets, talking points

---

**Publish on GitHub Pages:** repo **Settings -> Pages -> Deploy from a branch -> `main` / `(root)` -> Save**. The site appears at `https://<username>.github.io/itsm-ticketing-lab/` within a minute or two.

The simulation clock is fixed at **Oct 20, 2026 15:00** so SLA timers are reproducible. Tickets created on the *Create New Incident* page live in memory and reset on refresh.


## Concepts

ITIL 4 Incident Management · ServiceNow Incident states (New, In Progress, On Hold, Resolved, Closed) · Impact / Urgency / Priority · SLA response and resolution targets · functional escalation to the right resolver group · Incident vs. Service Request · first-contact resolution · identity verification before account changes · recognizing and reporting a security incident
