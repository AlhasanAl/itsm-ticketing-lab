# Priority & SLA Guide

Priority is **calculated**, never picked by hand: `Priority = Impact × Urgency` (ITIL model, ServiceNow default lookup).

## Impact — how many are affected?

| Level | Meaning | Examples |
|---|---|---|
| 1 – High | Whole department, site, or many users; or a patient-safety risk | ED Track Board down for all of ED |
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

1. **Score the business impact, not the volume of the caller.** A physician's single badge reader is still P4.
2. **Ask "what else is affected?"** before finalizing. One question turned a P3 Wi-Fi ticket into a P2.
3. **Patient care raises urgency.** If clinicians can't start or continue care, urgency is High.
4. **Security incidents with credentials entered are P2 minimum.**
5. **Re-score whenever facts change**, and write down why in the work notes.
6. **Requests aren't incidents.** "I want…" goes to the service catalog.

## Lab placements

| Ticket | I / U | Priority | Why |
|---|---|---|---|
| INC0010001 ED Track Board down | 1 / 1 | P1 | Entire ED, no workaround but paper |
| INC0010003 Pharmacy label printer | 2 / 1 | P2 | Department + delayed medications |
| INC0010004 4 West Wi-Fi (revised) | 2 / 1 | P2 | Nurse call handsets dropping |
| INC0010005 Phishing, creds entered | 2 / 1 | P2 | Active compromise, PHI access |
| INC0010002 Nurse lockout | 3 / 1 | P3 | One user, can't start shift |
| INC0010009 Finance share down | 2 / 2 | P3 | Department, not patient-facing |
| INC0010008 Badge reader | 3 / 2 | P4 | One device, workaround |
| INC0010011 Epic AVS printing | 3 / 2 | P4 | Few rooms, manual printer workaround |
| INC0010010 Slow laptop | 3 / 3 | P5 | Usable, no deadline |
| INC0010006 Second monitor | 3 / 3 | P5 | Request → converted to RITM |
