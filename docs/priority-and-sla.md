# Priority & SLA Guide

Priority is **calculated**, never picked by hand: `Priority = Impact × Urgency` (ITIL model, ServiceNow default lookup).

## Impact — how many are affected?

| Level | Meaning | Examples |
|---|---|---|
| 1 – High | Whole department, site, or many users; or a patient-safety risk | A core clinical system down for an entire department |
| 2 – Medium | A team/unit, or one critical shared system | One unit's Wi-Fi; pharmacy label printer; a phishing-compromised account with PHI access |
| 3 – Low | One user or one device | Lockout, single printer mapping, one badge reader |

## Urgency — how fast does it hurt?

| Level | Meaning |
|---|---|
| 1 – High | Work stopped, no workaround, or patient care is affected right now |
| 2 – Medium | Work degraded but a workaround exists |
| 3 – Low | Inconvenience; can wait |

## Matrix

| | U1 High | U2 Medium | U3 Low |
|---|---|---|---|
| **I1 High** | P1 | P2 | P3 |
| **I2 Medium** | P2 | P3 | P4 |
| **I3 Low** | P3 | P4 | P5 |

## SLA targets (24×7 — hospital environment)

| Priority | Response | Resolution | Customer updates |
|---|---|---|---|
| P1 Critical | 15 min | 4 h | Every 30 min |
| P2 High | 30 min | 8 h | Every 60 min |
| P3 Moderate | 2 h | 24 h | Daily |
| P4 Low | 8 h | 72 h | On change |
| P5 Planning | 24 h | 5 days | On change |

*Response* = first meaningful contact/assignment. *Resolution* = service restored. **On Hold – Awaiting Caller** pauses the resolution clock.

## Scoring rules I follow

1. **Score the business impact, not the seniority of the caller.** One locked-out user is low impact even if they're a manager.
2. **Ask "what else is affected?"** before finalizing — scope (one device vs. a whole area) often sets the priority.
3. **Patient care raises urgency.** If clinicians can't start or continue care, urgency is High.
4. **Security incidents with credentials entered are P2 minimum.**
5. **Requests aren't incidents.** "I want…" goes to the service catalog.

## Lab placements

| Ticket | I / U | Priority | Why |
|---|---|---|---|
| INC0010012 Phishing, creds entered | 2 / 1 | P2 | Active credential exposure |
| INC0010001 Account lockout before shift | 3 / 1 | P3 | One user, can't start shift, no workaround |
| INC0010002 Password expired | 3 / 1 | P3 | One user, patients waiting |
| INC0010009 Wi-Fi down on a unit | 2 / 2 | P3 | A whole unit, but workarounds exist |
| INC0010011 Finance shared drive down | 2 / 2 | P3 | A department, not patient-facing |
| INC0010003 Outlook auth prompts | 3 / 2 | P4 | One user, webmail workaround |
| INC0010004 VPN/MFA after new phone | 3 / 2 | P4 | One user, can work on-site |
| INC0010006 Printer missing after reimage | 3 / 2 | P4 | One workstation, nearby printer |
| INC0010010 Printer won't power on | 3 / 2 | P4 | One printer, hardware fault → Desktop Support |
| INC0010013 Epic AVS prints to wrong printer | 3 / 2 | P4 | One room's workflow |
| INC0010014 App error after update | 3 / 2 | P4 | One user's app |
| INC0010005 Slow laptop | 3 / 3 | P5 | Usable, no deadline |
| INC0010007 Monitor flickering | 3 / 3 | P5 | One display, awaiting triage |
| INC0010008 Second monitor | 3 / 3 | P5 | Request → converted to RITM |
