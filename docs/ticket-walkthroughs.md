# Ticket Walkthroughs

How I triaged, prioritized, and either resolved or escalated the key incidents in this lab. Each walkthrough follows the same pattern: **symptoms → scope → priority → action → outcome → takeaway.**

All organizations, people, and devices are fictional.

---

## 1. INC0010001 — P1 Major Incident: ED Track Board down

| Field | Value |
|---|---|
| Impact / Urgency | 1 – High / 1 – High → **P1 Critical** |
| Final group | Clinical Apps – Epic (Tier 2) |
| Escalations | Functional → Epic on-call · Hierarchical → Service Desk Lead / Major Incident Manager |
| SLA | Response 2 min (target 15) ✅ · Resolution 1 h 53 m (target 4 h) ✅ |

**Symptoms.** Charge nurse reports the Track Board is blank on every ED workstation. Staff can't see bed status, triage levels, or wait times.

**Scope check.** I remoted into three different workstations — same result on each, so it's not a single device. Charting and the MAR load fine, so network and Epic login are working. The problem is one application component affecting a whole department.

**Priority.** Whole department + patient flow lost with no workaround except paper downtime → Impact 1, Urgency 1 → **P1**. Declared a Major Incident.

**Actions.**
1. Paged the Epic on-call team (functional escalation — they have the access to fix it; I don't).
2. Notified the Service Desk Lead and Major Incident Manager and opened a bridge (hierarchical escalation — required for every P1).
3. Told the charge nurse to start ED downtime procedures and committed to updates every 30 minutes.
4. Checked the change calendar: an Epic ED patch (CHG0004121) went in at 06:00. Flagged it as the likely cause.
5. A second ED nurse called in — linked that ticket (INC0010012) as a **child** instead of working it separately.

**Outcome.** Epic team rolled back the Track Board component of the patch. I confirmed with the charge nurse before resolving. A problem record (PRB0000877) was opened for root cause.

**Takeaway.** On a P1, Tier 1's job is speed and coordination: confirm scope fast, get the right people engaged, protect patient care with a workaround, and keep everyone informed. Checking recent changes saved the resolver team time.

---

## 2. INC0010005 — P2 Security: phishing link clicked, credentials entered

| Field | Value |
|---|---|
| Impact / Urgency | 2 – Medium / 1 – High → **P2 High** |
| Final group | Security Operations (Tier 3) |
| Escalations | Functional → SecOps · Hierarchical → Service Desk Lead |

**Symptoms.** Registrar clicked a "Direct Deposit Update" email link and typed her network password.

**Priority.** One account, but it has access to patient data and can be used to phish others (Impact 2). Active compromise window — minutes matter (Urgency 1) → **P2**.

**Actions.**
1. Told the user not to delete the email or click anything else — preserve evidence.
2. Escalated **immediately** to Security Operations with the original email attached as `.eml` (headers intact). Security incidents skip Tier 2.
3. Notified the Service Desk Lead because of possible PHI exposure.
4. Only after SecOps directed it: verified identity, forced a password reset, revoked sessions, required MFA re-registration.

**Outcome (in progress).** SecOps found a foreign sign-in at 13:04 and blocked it, purged the email from 43 other mailboxes, and removed a malicious forwarding rule. Privacy Office notified per policy.

**Takeaway.** Tier 1 does **not** investigate security incidents. Preserve, escalate, follow instructions, and document every action with a timestamp.

---

## 3. INC0010004 — Re-prioritized P3 → P2: Wi-Fi drops on 4 West

| Field | Value |
|---|---|
| Initial | Impact 2 / Urgency 2 → **P3** |
| Revised | Impact 2 / Urgency 1 → **P2** |
| Final group | Network Operations (Tier 2) |

**Symptoms.** Workstations on wheels dropping Wi-Fi in the east hallway. Wired workstations at the nurse station worked, so I logged it as P3.

**What changed.** On callback, the nurse manager said the wireless **nurse call handsets** were also dropping — patient alerts could be missed. That raised urgency to High → **P2**, and the SLA clock tightened.

**Actions.** Checked the wireless controller (read-only): access point AP-4W-07 was offline and neighbors were overloaded. Escalated to Network Operations with that evidence. The unit activated its backup communication plan.

**Outcome.** Network Ops found a failed AP, replaced it, and walk-tested the hallway. I confirmed with the nurse manager before resolving.

**Takeaway.** Priority isn't set once and forgotten. A good callback question ("what else is affected?") changed the risk picture.

---

## 4. INC0010009 — Straight to Tier 3: Finance shared drive down

| Field | Value |
|---|---|
| Impact / Urgency | 2 / 2 → **P3 Moderate** |
| Final group | Server & Infrastructure (Tier 3) |

**Scope check.** 8 Finance users affected. From my own workstation, `\\MLH-FS02\Finance` was unreachable, but shares on a different server opened fine — the fault is on the server, not the endpoints.

**Decision.** Escalated **directly to Tier 3** instead of Desktop Support. Sending it to Tier 2 would have wasted time — they'd have nothing to fix on the PCs.

**Outcome.** The server's data volume was 100% full from runaway backup logs. Infra cleared logs, expanded the volume, and opened a problem record for the missing disk-space alert.

**Takeaway.** Escalate to the group that owns the failing component, not just "the next tier."

---

## 5. INC0010003 — P2 with a workaround first: pharmacy label printer

| Field | Value |
|---|---|
| Impact / Urgency | 2 / 1 → **P2 High** |
| Final group | Desktop Support (Tier 2) |

Cleared a stuck print queue, then had the pharmacist power-cycle the printer — it showed **PRINTHEAD ERROR** (hardware). Before escalating, I redirected the label queue to a backup printer so medications kept moving. Then escalated to Desktop Support for on-site repair. Printhead replaced; queue pointed back.

**Takeaway.** Restore service first (workaround), then fix the root cause. The escalation note included the workaround so the tech knew to revert it.

---

## 6. INC0010008 — The physician ticket stays P4

| Field | Value |
|---|---|
| Impact / Urgency | 3 / 2 → **P4 Low** |
| Group | Service Desk (resolved at Tier 1) |

Badge-tap login failed on one ED workstation. Other workstations and manual login worked. The caller being a physician doesn't change the matrix — one device with a workaround is P4. (It was quick to fix anyway: the reader's USB cable was loose.)

**Takeaway.** Priority comes from impact and urgency, not job title. Consistency keeps the queue fair and the SLAs meaningful.

---

## 7. INC0010002 — First contact resolution: lockout at shift change

| Field | Value |
|---|---|
| Impact / Urgency | 3 / 1 → **P3 Moderate** |
| Time to resolve | 11 minutes |

ICU nurse locked out 20 minutes before shift. Verified identity per SOP (employee ID + callback to the unit's registered extension). AD showed 10 bad attempts from her phone's mail app — she'd changed her password yesterday and the phone still had the old one. Unlocked the account **and** fixed the phone so it wouldn't lock again.

**Takeaway.** Fix the cause, not just the symptom — otherwise the same ticket comes back in an hour.

---

## 8. INC0010006 — Not an incident: converted to a Service Request

"I'd like a second monitor" — nothing is broken, so it's a **request**, not an incident. Converted to catalog item RITM0023301 (routes to the manager for approval) and closed the incident.

**Takeaway.** Logging requests as incidents inflates incident counts and skips approval workflows.

---

## 9. INC0010011 — Epic print mapping: know who owns it

After Visit Summaries from exam rooms 3–6 printed at the front desk. Windows default printer and Word printing were correct — only Epic's AVS misrouted. That points to Epic's department print mapping, which the Epic team owns. Gave the user a workaround (choose printer manually) and escalated with workstation and printer names plus screenshots. Epic found the mapping hadn't been updated after a room remodel.

---

## 10. INC0010013 — An SLA breach, reported honestly

A remote coder submitted a VPN/MFA ticket through the portal at 22:40. Day shift picked it up at 07:10 — **8 h 30 m against an 8 h response target (breached)**. The fix itself took 25 minutes (MFA re-enrollment on a new phone).

I documented the breach and added a shift-handoff recommendation: an overnight check of P4 portal tickets, or an auto-reply with MFA self-service steps.

**Takeaway.** SLA data is only useful if it's honest. A breach with a fix proposed is more valuable than a hidden one.

---

## 11. INC0010010 — On Hold, done right

Slow laptop (P5). Found a stuck Windows Update using 100% disk, cleared the update cache, but a restart was required and the user was on patient calls. Set **On Hold – Awaiting Caller** (pauses the SLA) and logged contact attempt 1 of 3 per the follow-up policy.
