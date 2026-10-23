# Ticket Walkthroughs

How and why each key ticket was prioritized, worked, and resolved or escalated. All data is fictional (Meridian Lakes Health). Priority is calculated from Impact x Urgency — see the [Priority & SLA guide](priority-and-sla.md).

---

## Resolved at Tier 1 (first contact)

### INC0010001 — Account locked out before shift (P3)
Impact LOW (one user), Urgency HIGH (can't start their shift, no workaround). **Verified identity first** — name, employee ID, known callback number — before unlocking the Active Directory account, then had the user log in while on the line. Shared the self-service unlock link so they don't have to call next time.

### INC0010002 — Password expired (P3)
Same shape as the lockout: one user, but patients were waiting at registration. Verified identity, reset the password with "must change at next logon," confirmed the login on the call.

### INC0010003 — Outlook keeps prompting for password (P4)
One user, and webmail still worked, so medium urgency. Cleared the stale cached credential in Windows Credential Manager and recreated the Outlook profile; it re-authenticated once and stopped prompting. Tested send/receive before closing.

### INC0010004 — VPN fails at MFA after a new phone (P4) — *the honest SLA miss*
Came in overnight by email and wasn't picked up until day shift — about 50 minutes past the P4 response target. I documented the breach instead of hiding it. The fix: removed the old MFA device and sent a re-enrollment so the user could register the authenticator on the new phone; confirmed VPN + MFA. Recommended an after-hours auto-reply with self-service MFA steps so overnight users aren't stuck.

### INC0010006 — Printer missing after a reimage (P4)
A reimage wiped the mapped printers. Remapped the network printer from the print server and printed a test page. Straightforward Tier 1 fix.

### INC0010014 — App won't launch after an update (P4)
Reproduced the launch error, cleared the app's local cache, and repaired the client install. Then checked whether anyone else reported the same error after the overnight update — nothing yet, but worth watching in case it needs grouping.

---

## Escalated — knowing when and where

### INC0010009 — Wi-Fi dropping on a whole unit (P3) -> Network Operations
Checked three devices on 4 West; all dropped Wi-Fi in the same area, but one connected fine on another floor. That rules out the device and points to an **access point** — area-wide wireless is the network team's, not a Tier 1 fix. Escalated with the device list and the "works elsewhere" evidence so they didn't have to re-test. (Network replaced a failing AP.)

### INC0010010 — Front desk printer won't power on (P4) -> Desktop Support
Walked the user through power checks — different outlet, reseated cable, held the power button — with no response. Remote troubleshooting was exhausted, so this is a **hardware fault that needs hands-on repair or a swap**. Escalated to Desktop Support with the steps already tried, and pointed the user to the next printer over as a workaround.

### INC0010011 — Shared drive down for a whole team (P3) -> Server & Infrastructure
Three Finance users all failed to reach the S: drive while other shares opened fine. Not an endpoint issue — it's **server/storage-side**, and it affects multiple users, so it went straight to the server team rather than Desktop Support.

### INC0010012 — Phishing with credentials entered (P2) -> Security Operations
The one that gets handled fast. The user clicked a "payroll update" email and typed their password into the page. I told them **not to delete the email**, confirmed what was entered and when, had them forward the original as an attachment, and **escalated to Security immediately** — Tier 1 doesn't investigate credential exposure. Told the user not to change their password until Security advised, in case they wanted to review activity first.

### INC0010013 — Epic After Visit Summary prints to the wrong printer (P4) -> Clinical Apps - Epic
A normal Windows test page from that exam room printed to the **correct** printer, so the device and OS mapping are fine — the misroute is in the **Epic print setup**, which the Clinical Apps team owns. Escalated with the test-page result so the diagnosis was already done.

---

## Judgment calls

### INC0010005 — "Laptop running slow" (P5, on hold)
One device, low urgency. Checked remotely: heavy startup apps, a nearly full C: drive, and a pending reboot from last week's updates. Asked the user to restart and report back, and placed the ticket **On Hold (Awaiting Caller)** — which correctly pauses the resolution SLA clock.

### INC0010007 — Monitor flickering (P5, awaiting triage)
Logged at end of shift, still **New**. Most likely a loose or failing video cable or the display itself — to be confirmed on pickup. Shown here to demonstrate the triage queue, not a worked ticket.

### INC0010008 — "I want a second monitor" — Incident vs. Service Request
Nothing was broken, so there's no service to restore. That makes it a **service request, not an incident**. Logged it, confirmed there was no fault, and converted it to a request (RITM0023301) that routes to the manager for approval — then closed the incident. Excluded from the incident resolution metrics on purpose.
