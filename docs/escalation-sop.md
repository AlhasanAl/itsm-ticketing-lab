# Escalation SOP — Service Desk (Tier 1)

*Meridian Lakes Health (fictional) · HelpDesk ITSM Lab*

## 1. Purpose

Get every incident to the people who can fix it as fast as its priority demands, with enough information that nobody has to ask the user the same questions twice.

## 2. Support tiers and assignment groups

| Tier | Group | Owns |
|---|---|---|
| 1 | **Service Desk** | First contact. Triage, prioritize, resolve with runbooks/KB, escalate. |
| 2 | Desktop Support | On-site hardware, imaging, peripherals, printers |
| 2 | Network Operations | LAN/WLAN, switches, access points, VPN infrastructure |
| 2 | Clinical Apps – Epic | Epic build, print/device mapping, clinical application issues |
| 2 | Identity & Access | Provisioning, role-based access, MFA policy |
| 3 | Server & Infrastructure | Servers, storage, virtualization, backups |
| 3 | Security Operations | Phishing, account compromise, malware, forensics |

## 3. Two types of escalation

**Functional escalation** — move the ticket to the group with the **skills or access** to resolve it. Route to the group that owns the failing component; skip tiers when the evidence is clear (e.g., server-side fault → Tier 3).

**Hierarchical escalation** — notify **management** when business or patient risk is high. Required for:

- Every **P1** (Service Desk Lead + Major Incident Manager within 15 minutes)
- Any **security incident** with possible PHI exposure
- Any ticket about to breach its resolution SLA with no clear path to fix
- Customer complaints about service handling

## 4. When Tier 1 escalates

Escalate when **any** of these are true:

1. The fix needs access or permissions Tier 1 does not have (server admin, Epic build, network gear).
2. A physical repair or swap is needed.
3. It is a **security incident** — escalate immediately; do not investigate.
4. Multiple users or a whole area are affected — likely infrastructure.
5. Runbook/KB steps are exhausted.
6. ~75% of the resolution SLA has elapsed without a clear fix.

Do **not** escalate just because a ticket is hard or the caller is senior.

## 5. What every escalation must include

- [ ] Clear symptom and **scope** (who, how many, since when, where)
- [ ] What Tier 1 already tested and the results
- [ ] Workaround in place, if any (and whether it needs reverting)
- [ ] Device names, error text, screenshots, attachments (e.g., `.eml` for phishing)
- [ ] Correct priority with a one-line rationale
- [ ] The user has been told who has the ticket and when to expect the next update

## 6. Major Incident (P1) procedure

1. Confirm scope from more than one device/user.
2. Set Impact 1 / Urgency 1. Flag as Major Incident.
3. Page the owning resolver group's on-call.
4. Notify Service Desk Lead + Major Incident Manager; open a bridge.
5. Give the business a workaround (e.g., clinical downtime procedures).
6. Check the change calendar for recent changes on the affected CI.
7. Link duplicate calls as **child** incidents.
8. Update stakeholders every 30 minutes.
9. Confirm resolution with the business before resolving; ensure a Problem record is opened for root cause.

## 7. Security incident procedure (Tier 1)

1. Tell the user not to delete, forward, or click anything further.
2. Collect: time of click, what was entered, the original email as an attachment.
3. Escalate to Security Operations immediately (P2 minimum if credentials were entered).
4. Take containment actions (password reset, session revoke, MFA reset) **only when directed by SecOps** and after identity verification.
5. Document every action with a timestamp.

## 8. After escalation

Tier 1 still owns the **customer relationship**: confirm the fix with the user, keep the ticket's customer comments current, and close the loop.
