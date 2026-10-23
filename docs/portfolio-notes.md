# Portfolio & Interview Notes

## Portfolio card (short)

**HelpDesk ITSM Lab** — A ServiceNow-style service desk simulation for a fictional hospital. I triage 18 healthcare IT incidents using the ITIL Impact × Urgency matrix, track SLAs, resolve Tier 1 issues, and escalate the rest to the right resolver group — including a P1 major incident, a phishing compromise, and a live re-prioritization.

*Tags:* ServiceNow · ITIL 4 · Incident Management · SLA · Escalation · Healthcare IT · JavaScript

## Portfolio modal (longer)

I built this lab to show how I work a service desk queue, not just close tickets. Each incident has a written prioritization rationale, timestamped work notes, separate customer-facing comments, SLA tracking, and — where needed — a documented escalation with a reason.

Highlights:
- **P1 Major Incident:** ED Track Board outage — confirmed scope on multiple workstations, paged the Epic team, notified the Major Incident Manager, started clinical downtime, tied the outage to an overnight change, linked duplicate calls as child tickets.
- **Security:** phishing with credentials entered — preserved evidence and escalated to SecOps immediately.
- **Judgment:** raised a Wi-Fi ticket from P3 to P2 when nurse call handsets were affected; kept a physician's single-device issue at P4; sent a server fault straight to Tier 3.
- **Honest metrics:** 97% SLA compliance with one documented response breach and a process fix.

## Resume bullets

- Built a ServiceNow-style ITSM incident management lab (HTML/CSS/JS) modeling ITIL priority, SLA tracking, and tiered escalation for a simulated hospital service desk.
- Triaged 18 simulated healthcare IT incidents with the Impact × Urgency matrix, resolving 64% at Tier 1 and escalating the rest with documented functional and hierarchical escalation paths.
- Wrote an escalation SOP, priority/SLA guide, and ticket walkthroughs covering Major Incident, security incident, and service-request handling.

## Interview talking points

**"How do you prioritize tickets?"**
Impact times urgency. Impact is how many people or how critical the service is; urgency is how fast it hurts and whether there's a workaround. In a hospital, anything stopping patient care raises urgency. I don't let caller title change priority, and I re-score if facts change — like the Wi-Fi ticket I raised from P3 to P2 when I learned nurse call phones were dropping.

**"When do you escalate?"**
When the fix needs access or skills I don't have, a physical repair, it's a security incident, a lot of users are affected, or my runbook steps are exhausted. I escalate to the group that owns the problem — sometimes that's Tier 3 directly. And I always hand off what I tested, the scope, and the workaround so nobody re-asks the user.

**"Walk me through a P1."**
Confirm scope from more than one device, set P1, page the owning team, notify the lead and Major Incident Manager, get the business on a workaround (downtime procedures), check recent changes, link duplicates as child tickets, and update every 30 minutes until it's confirmed fixed with the business.

**"What would you do if a user says they clicked a phishing link?"**
Tell them not to delete it, get the details, attach the original email, and escalate to Security immediately. I only take containment actions like password resets when Security tells me to, and I document everything with timestamps.

**"Tell me about a time you missed an SLA."**
A portal ticket came in overnight and day shift picked it up 30 minutes past the response target. I documented it honestly and recommended an overnight check for portal tickets or an auto-reply with self-service steps.
