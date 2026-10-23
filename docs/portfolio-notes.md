# Portfolio & Interview Notes

## Portfolio card (short)

**HelpDesk ITSM Lab** — A ServiceNow-style Tier 1 service desk simulation. I triage 14 IT incidents — lockouts, password/MFA, Outlook, Wi-Fi, printers, software errors — using the ITIL Impact x Urgency matrix, track SLAs, resolve the routine ones at first contact, and escalate the rest to the right resolver group with a documented reason.

*Tags:* ServiceNow · ITIL 4 · Tier 1 Support · Incident Management · SLA · Escalation

## Portfolio modal (longer)

I built this lab to show how I'd actually work a service desk queue, not just close tickets. Each incident has a written prioritization rationale, timestamped work notes, separate customer-facing comments, and SLA tracking.

Highlights:
- **First-contact resolution:** account lockouts and expired passwords (with identity verification first), Outlook re-authentication, VPN/MFA after a phone swap, printer remapping, and an app that broke after an update.
- **Knowing when and where to escalate:** a Wi-Fi issue confirmed to be area-wide (-> Network), a dead printer that needs hands-on repair (-> Desktop Support), a shared drive down for a whole team (-> server team), and an Epic print-mapping issue (-> Clinical Apps).
- **Security:** a phishing email where the user entered their password — preserved the evidence, didn't investigate, and escalated to Security immediately.
- **Honest metrics:** 95% SLA compliance with one documented overnight response breach and a prevention recommendation.

## Resume bullets

- Built a ServiceNow-style ITSM incident-management lab (HTML/CSS/JS) modeling ITIL Impact x Urgency prioritization, SLA tracking, and Tier 1 escalation for a simulated service desk.
- Triaged 14 simulated IT incidents — lockouts, password/MFA resets, Outlook, Wi-Fi, printers, and software errors — resolving 86% at first contact and escalating the rest to the correct resolver group with documented reasons.
- Documented an escalation SOP and a priority/SLA guide, and demonstrated incident-vs-service-request handling and first-step security-incident reporting (phishing).

## Interview talking points

**"How do you prioritize tickets?"**
Impact times urgency. Impact is how many people or how critical the service is; urgency is how fast it hurts and whether there's a workaround. A single locked-out user is low impact but high urgency if they can't start their shift. I let the matrix set the priority instead of guessing.

**"When do you escalate?"**
When the fix needs access or skills I don't have, when it's a physical hardware repair, when it's a security incident, or when a lot of users are affected and it points past the endpoint. I escalate to the group that owns the problem — and I hand off what I already tested and the scope, so nobody has to re-ask the user. Example: a Wi-Fi issue where I confirmed three devices all dropped in the same area but one worked fine on another floor — that's an access point, so it went to the network team, not Desktop Support.

**"What would you do if a user said they clicked a phishing link and entered their password?"**
Tell them not to delete the email, get the details of what they entered and when, have them forward the original email as an attachment, and escalate to Security right away. I don't investigate it myself, and I tell the user not to change their password until Security says to, in case they want to review account activity first.

**"Tell me about a time an SLA was missed."**
A VPN/MFA ticket came in overnight and didn't get picked up until day shift, about 50 minutes past the response target. I documented the miss honestly rather than hiding it, and recommended an after-hours auto-reply with self-service MFA steps so users aren't stuck until morning.

**"What's the difference between an incident and a service request?"**
An incident is something broken that needs service restored. A service request is asking for something new or standard — like a second monitor. When a user asked for a second monitor, there was no fault, so I converted it to a request (RITM) that routes for approval, instead of working it as an incident.

**"How do you handle an account lockout or password reset?"**
Verify identity first — name, employee ID, a known callback number — before I touch the account. Then unlock or reset, have the user log in while I'm on the line to confirm, and point them to the self-service reset option for next time.
