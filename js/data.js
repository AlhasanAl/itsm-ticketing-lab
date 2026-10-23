/* ==========================================================================
   HelpDesk ITSM Lab — simulated incident data
   Organization: Meridian Lakes Health (FICTIONAL). All people, devices,
   and ticket numbers are invented for this portfolio lab.
   Analyst (Tier 1): A. Abdulrazzaq, Service Desk
   ========================================================================== */

// Fixed "current time" for the simulation so SLA timers are reproducible.
const SIM_NOW = "2026-10-20T15:00";

const ANALYST = "A. Abdulrazzaq";

// ITIL Impact x Urgency matrix (ServiceNow default model). 1 = High, 3 = Low.
const PRIORITY_MATRIX = {
  "1-1": 1, "1-2": 2, "1-3": 3,
  "2-1": 2, "2-2": 3, "2-3": 4,
  "3-1": 3, "3-2": 4, "3-3": 5,
};

const PRIORITY_LABELS = {
  1: "1 - Critical", 2: "2 - High", 3: "3 - Moderate", 4: "4 - Low", 5: "5 - Planning",
};

const IMPACT_LABELS  = { 1: "1 - High", 2: "2 - Medium", 3: "3 - Low" };
const URGENCY_LABELS = { 1: "1 - High", 2: "2 - Medium", 3: "3 - Low" };

// SLA targets in minutes (24x7 clock — hospital environment).
const SLA_TARGETS = {
  1: { response: 15,   resolve: 240,  update: "Every 30 min" },
  2: { response: 30,   resolve: 480,  update: "Every 60 min" },
  3: { response: 120,  resolve: 1440, update: "Daily" },
  4: { response: 480,  resolve: 4320, update: "On change" },
  5: { response: 1440, resolve: 7200, update: "On change" },
};

const GROUPS = {
  "Service Desk":              { tier: 1, desc: "First point of contact. Triage, prioritize, resolve with runbooks/KB, escalate." },
  "Desktop Support":           { tier: 2, desc: "On-site hardware, imaging, peripherals, printers." },
  "Network Operations":        { tier: 2, desc: "LAN/WLAN, switches, access points, VPN infrastructure." },
  "Clinical Apps - Epic":      { tier: 2, desc: "Epic build, printing/device mapping, clinical application issues." },
  "Identity & Access":         { tier: 2, desc: "AD/Entra provisioning, role access, MFA policy." },
  "Server & Infrastructure":   { tier: 3, desc: "Windows servers, storage, virtualization, backups." },
  "Security Operations":       { tier: 3, desc: "Security incidents, phishing, account compromise, forensics." },
};

// Suggested routing used by the "New Incident" triage assistant.
const CATEGORY_ROUTING = {
  "Access / Account":         { group: "Service Desk", note: "Lockouts, password resets, MFA re-enrollment are Tier 1 runbook tasks. Escalate role/permission changes to Identity & Access." },
  "Hardware":                 { group: "Service Desk", note: "Troubleshoot remotely first. Escalate to Desktop Support when a physical repair or swap is required." },
  "Printer":                  { group: "Service Desk", note: "Clear queue / test page first. Hardware faults → Desktop Support. Epic print mapping → Clinical Apps - Epic." },
  "Network / Wi-Fi":          { group: "Network Operations", note: "Confirm scope (one device vs. area). Area-wide or AP down → Network Operations." },
  "Clinical Application":     { group: "Clinical Apps - Epic", note: "Gather user, workstation, activity, and screenshot. Department-wide = consider Major Incident." },
  "Server / Shared Drive":    { group: "Server & Infrastructure", note: "If the share/server is unreachable for multiple users, route directly to Tier 3." },
  "Security":                 { group: "Security Operations", note: "Do NOT investigate. Preserve evidence, escalate immediately, follow SecOps instructions." },
  "Software":                 { group: "Service Desk", note: "Standard desktop software issues are Tier 1. Packaging/deployment failures → Desktop Support." },
};

const INCIDENTS = [
  /* ---------------------------------------------------------------- P1 */
  {
    number: "INC0010001",
    opened: "2026-10-20T07:12", responded: "2026-10-20T07:14", resolved: "2026-10-20T09:05",
    caller: "Maria Lopez, RN (Charge Nurse)", department: "Emergency Department", location: "Main Campus - ED",
    channel: "Phone", category: "Clinical Application", subcategory: "Epic - ED Track Board",
    ci: "Epic Hyperspace - ED Track Board",
    short: "ED Track Board not loading for entire Emergency Department",
    description: "Track Board shows a blank screen / spinning wheel on every ED workstation. Staff cannot see bed status, triage levels, or wait times. Other Epic activities (charting, MAR) work.",
    impact: 1, urgency: 1,
    state: "Resolved", group: "Clinical Apps - Epic", assignedTo: "J. Patel",
    majorIncident: true, children: ["INC0010012"], problem: "PRB0000877", change: "CHG0004121",
    rationale: "Impact HIGH: entire department (~25 workstations, all ED staff). Urgency HIGH: patient flow and triage visibility lost, only workaround is paper downtime. → P1 Critical. Declared Major Incident.",
    escalations: [
      { time: "2026-10-20T07:16", from: "Service Desk (T1)", to: "Clinical Apps - Epic (T2 on-call)", type: "Functional", reason: "Application-side failure across many devices — requires Epic analyst access T1 does not have." },
      { time: "2026-10-20T07:16", from: "Service Desk (T1)", to: "Service Desk Lead / Major Incident Manager", type: "Hierarchical", reason: "P1 policy: management notified within 15 min, bridge call opened, comms cadence every 30 min." },
    ],
    notes: [
      { time: "2026-10-20T07:12", author: "System", type: "system", text: "Incident created via phone by Service Desk." },
      { time: "2026-10-20T07:14", author: ANALYST, type: "work", text: "Caller reports Track Board blank on all ED workstations. Remoted into 3 different workstations (EDWS-03, EDWS-11, EDWS-22) — same result on each, so not a single-device issue. Charting and MAR load normally, so network and Epic login are fine. Set Impact 1 / Urgency 1 → P1." },
      { time: "2026-10-20T07:16", author: ANALYST, type: "escalation", text: "Paged Clinical Apps - Epic on-call (functional escalation). Notified Service Desk Lead and Major Incident Manager per P1 procedure (hierarchical escalation). Bridge line opened." },
      { time: "2026-10-20T07:18", author: ANALYST, type: "comment", text: "Advised charge nurse to start ED downtime procedures (paper tracking / whiteboard). Next update in 30 minutes or sooner." },
      { time: "2026-10-20T07:20", author: ANALYST, type: "work", text: "Checked change calendar: CHG0004121 (Epic ED module patch) was implemented at 06:00 today. Flagged to Epic team as probable cause." },
      { time: "2026-10-20T07:21", author: ANALYST, type: "work", text: "INC0010012 (duplicate report from ED Pod B) linked as a child of this incident." },
      { time: "2026-10-20T07:45", author: "J. Patel", type: "work", text: "Confirmed Track Board web service throwing errors since CHG0004121. Recycling the application pool on the web tier." },
      { time: "2026-10-20T07:48", author: ANALYST, type: "comment", text: "Update to ED leadership: probable cause identified (overnight patch), fix in progress. Continue downtime procedures." },
      { time: "2026-10-20T08:20", author: "J. Patel", type: "work", text: "App pool recycle restored ~60% of workstations. Remaining clients holding cached config. Requesting approval to roll back the Track Board component of CHG0004121." },
      { time: "2026-10-20T08:50", author: "J. Patel", type: "work", text: "Emergency rollback of Track Board component completed. Track Board loading on all test workstations." },
      { time: "2026-10-20T08:58", author: ANALYST, type: "work", text: "Called charge nurse — Track Board confirmed loading on all ED workstations. ED ending downtime and back-entering paper data." },
      { time: "2026-10-20T09:05", author: ANALYST, type: "system", text: "State changed to Resolved. Child INC0010012 auto-resolved." },
    ],
    resolution: { code: "Solved (Workaround)", by: "Clinical Apps - Epic", notes: "Rolled back Track Board component of CHG0004121. Problem PRB0000877 opened for root-cause analysis; change team to review testing gap before re-deploying." },
  },

  /* ---------------------------------------------------------------- child of P1 */
  {
    number: "INC0010012",
    opened: "2026-10-20T07:19", responded: "2026-10-20T07:21", resolved: "2026-10-20T09:05",
    caller: "Kevin Brooks, RN", department: "Emergency Department", location: "Main Campus - ED Pod B",
    channel: "Phone", category: "Clinical Application", subcategory: "Epic - ED Track Board",
    ci: "Epic Hyperspace - ED Track Board",
    short: "Track Board blank in ED Pod B",
    description: "Nurse reports Track Board not displaying patients in Pod B.",
    impact: 1, urgency: 1,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    parent: "INC0010001",
    rationale: "Same symptoms, same CI, same department as open Major Incident INC0010001 → linked as child rather than worked separately (avoids duplicate effort and keeps one source of truth).",
    escalations: [],
    notes: [
      { time: "2026-10-20T07:19", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T07:21", author: ANALYST, type: "work", text: "Matches active Major Incident INC0010001. Linked as child. Informed caller that the issue is known, Epic team engaged, and ED downtime procedures are in effect." },
      { time: "2026-10-20T09:05", author: "System", type: "system", text: "Resolved automatically with parent INC0010001." },
    ],
    resolution: { code: "Duplicate", by: "Service Desk", notes: "Resolved with parent Major Incident INC0010001." },
  },

  /* ---------------------------------------------------------------- P2 printer */
  {
    number: "INC0010003",
    opened: "2026-10-20T10:05", responded: "2026-10-20T10:07", resolved: "2026-10-20T11:10",
    caller: "Tom Reyes, PharmD", department: "Inpatient Pharmacy", location: "Main Campus - B1 Pharmacy",
    channel: "Phone", category: "Printer", subcategory: "Label printer",
    ci: "PHARM-LBL-02 (thermal label printer)",
    short: "IV room label printer offline - medication labels cannot print",
    description: "Label printer in the IV room is not printing. Medication labels for inpatient units are backing up.",
    impact: 2, urgency: 1,
    state: "Resolved", group: "Desktop Support", assignedTo: "R. Nguyen",
    rationale: "Impact MEDIUM: one department, but downstream inpatient units waiting on medications. Urgency HIGH: patient medication delivery delayed. → P2 High.",
    escalations: [
      { time: "2026-10-20T10:22", from: "Service Desk (T1)", to: "Desktop Support (T2)", type: "Functional", reason: "Printhead hardware error — requires on-site repair/swap. Remote troubleshooting exhausted." },
    ],
    notes: [
      { time: "2026-10-20T10:05", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T10:07", author: ANALYST, type: "work", text: "Ping to PHARM-LBL-02 fails. Print server shows 14 jobs stuck in queue. Cleared queue. Set Impact 2 / Urgency 1 → P2." },
      { time: "2026-10-20T10:12", author: ANALYST, type: "work", text: "Had pharmacist power-cycle the printer. Display shows 'PRINTHEAD ERROR' — hardware fault, not a queue/driver problem." },
      { time: "2026-10-20T10:18", author: ANALYST, type: "work", text: "Workaround: redirected the label queue to PHARM-LBL-03 (satellite pharmacy). Test label printed. Pharmacy tech running labels from there." },
      { time: "2026-10-20T10:22", author: ANALYST, type: "escalation", text: "Escalated to Desktop Support for on-site printhead replacement. Workaround in place documented for the tech." },
      { time: "2026-10-20T10:40", author: "R. Nguyen", type: "work", text: "On site. Printhead failed. Swapped with spare from stock, recalibrated media." },
      { time: "2026-10-20T11:05", author: "R. Nguyen", type: "work", text: "Test labels print correctly. Queue pointed back to PHARM-LBL-02. Pharmacist confirmed." },
      { time: "2026-10-20T11:10", author: "System", type: "system", text: "State changed to Resolved." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Desktop Support", notes: "Replaced failed printhead, recalibrated. Workaround queue removed." },
  },

  /* ---------------------------------------------------------------- P3 -> P2 wifi */
  {
    number: "INC0010004",
    opened: "2026-10-20T11:30", responded: "2026-10-20T11:32", resolved: "2026-10-20T14:10",
    caller: "Angela Morris (Nurse Manager)", department: "4 West Med-Surg", location: "Main Campus - 4 West",
    channel: "Phone", category: "Network / Wi-Fi", subcategory: "Wireless coverage",
    ci: "AP-4W-07 (wireless access point)",
    short: "Wi-Fi dropping on 4 West - WOWs and nurse handsets disconnecting",
    description: "Workstations on wheels lose Wi-Fi in the east hallway. Later confirmed that wireless nurse handsets are also dropping.",
    impact: 2, urgency: 1,
    priorityHistory: [
      { time: "2026-10-20T11:32", from: null, to: 3, reason: "Initial: department affected, wired workstations at nurse station available (Impact 2 / Urgency 2)." },
      { time: "2026-10-20T11:48", from: 3, to: 2, reason: "Re-assessed: nurse call handsets also dropping — patient alerts could be missed. Urgency raised to 1 (Impact 2 / Urgency 1)." },
    ],
    state: "Resolved", group: "Network Operations", assignedTo: "S. Okafor",
    rationale: "Started as P3 (I2/U2). New information during callback — patient call handsets affected — raised Urgency to High → P2. Priority is re-evaluated whenever the facts change.",
    escalations: [
      { time: "2026-10-20T11:50", from: "Service Desk (T1)", to: "Network Operations (T2)", type: "Functional", reason: "Controller shows AP-4W-07 offline; area-wide wireless outage requires network team." },
    ],
    notes: [
      { time: "2026-10-20T11:30", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T11:32", author: ANALYST, type: "work", text: "Multiple WOWs on 4 West dropping Wi-Fi in east hallway. Wired workstations at the nurse station work. Logged Impact 2 / Urgency 2 → P3." },
      { time: "2026-10-20T11:48", author: ANALYST, type: "work", text: "Callback: nurse manager confirms wireless nurse handsets also disconnecting. Patient call alerts may be missed → raised Urgency to 1. Priority P3 → P2. SLA recalculated." },
      { time: "2026-10-20T11:50", author: ANALYST, type: "escalation", text: "Wireless controller (read-only view) shows AP-4W-07 offline and neighboring APs overloaded. Escalated to Network Operations." },
      { time: "2026-10-20T11:52", author: ANALYST, type: "comment", text: "Nurse manager activating unit backup communication plan while network team works the issue. Will update hourly." },
      { time: "2026-10-20T12:30", author: "S. Okafor", type: "work", text: "Switch port for AP-4W-07 showing errors. Bounced port — AP does not come back. Hardware failure. Pulling replacement AP." },
      { time: "2026-10-20T13:40", author: "S. Okafor", type: "work", text: "Replacement AP installed and adopted by controller." },
      { time: "2026-10-20T13:55", author: "S. Okafor", type: "work", text: "Walk test end-to-end on east hallway: WOWs and handsets roam cleanly." },
      { time: "2026-10-20T14:05", author: ANALYST, type: "work", text: "Confirmed with nurse manager — no further drops. Resolving." },
      { time: "2026-10-20T14:10", author: "System", type: "system", text: "State changed to Resolved." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Network Operations", notes: "Replaced failed access point AP-4W-07. Coverage validated by walk test." },
  },

  /* ---------------------------------------------------------------- P2 phishing (open) */
  {
    number: "INC0010005",
    opened: "2026-10-20T13:10", responded: "2026-10-20T13:12", resolved: null,
    caller: "Priya Shah (Patient Access Registrar)", department: "ED Registration", location: "Main Campus - ED",
    channel: "Phone", category: "Security", subcategory: "Phishing - credentials entered",
    ci: "User account / Email",
    short: "User clicked 'payroll update' phishing link and entered credentials",
    description: "Email titled 'Action Required: Direct Deposit Update' from an external sender. User clicked the link and entered network username and password around 13:00.",
    impact: 2, urgency: 1,
    state: "In Progress", group: "Security Operations", assignedTo: "M. Chen",
    rationale: "Impact MEDIUM: one account, but it has access to patient data (PHI) and could be used to phish others. Urgency HIGH: active compromise window — every minute counts. → P2. Security incidents are escalated immediately; Tier 1 does not investigate.",
    escalations: [
      { time: "2026-10-20T13:15", from: "Service Desk (T1)", to: "Security Operations (T3)", type: "Functional", reason: "Confirmed credential entry on phishing site. Security incidents bypass Tier 2 per SOP." },
      { time: "2026-10-20T13:15", from: "Service Desk (T1)", to: "Service Desk Lead", type: "Hierarchical", reason: "Potential PHI exposure — lead notified for awareness." },
    ],
    notes: [
      { time: "2026-10-20T13:10", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T13:12", author: ANALYST, type: "work", text: "User entered credentials on link from external 'payroll' email. Told user NOT to delete the email and not to click anything else. Set Impact 2 / Urgency 1 → P2." },
      { time: "2026-10-20T13:15", author: ANALYST, type: "escalation", text: "Escalated to Security Operations with the original email attached as .eml (headers preserved). Notified Service Desk Lead." },
      { time: "2026-10-20T13:17", author: ANALYST, type: "work", text: "At SecOps direction: verified user identity, forced password reset, revoked active sessions, required MFA re-registration." },
      { time: "2026-10-20T13:40", author: "M. Chen", type: "work", text: "Sign-in logs show a successful login from an unfamiliar foreign IP at 13:04 — blocked. Purged the same email from 43 other mailboxes." },
      { time: "2026-10-20T14:20", author: "M. Chen", type: "work", text: "Found and removed a malicious inbox forwarding rule. Reviewing mailbox audit logs; Privacy Office notified for PHI exposure review per policy." },
      { time: "2026-10-20T14:25", author: ANALYST, type: "comment", text: "Let user know her account is secured and she can resume work. Security team is continuing the investigation and may follow up." },
    ],
    resolution: null,
  },

  /* ---------------------------------------------------------------- P3 lockout FCR */
  {
    number: "INC0010002",
    opened: "2026-10-20T06:41", responded: "2026-10-20T06:42", resolved: "2026-10-20T06:52",
    caller: "Danielle Kim, RN", department: "Intensive Care Unit", location: "Main Campus - 5 East ICU",
    channel: "Phone", category: "Access / Account", subcategory: "Account lockout",
    ci: "Active Directory",
    short: "Locked out of network account - cannot log in before shift",
    description: "Nurse cannot log into ICU workstation; account locked. Shift starts at 07:00.",
    impact: 3, urgency: 1,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency HIGH: clinician cannot begin patient care at shift change. → P3. Within Tier 1 runbook — no escalation needed.",
    escalations: [],
    notes: [
      { time: "2026-10-20T06:41", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T06:42", author: ANALYST, type: "work", text: "Verified identity per SOP (employee ID + callback to registered unit extension). AD shows account locked: 10 bad attempts from her phone's mail app. Password was changed yesterday — phone still has the old one." },
      { time: "2026-10-20T06:47", author: ANALYST, type: "work", text: "Unlocked account. Walked user through updating the saved password on her phone. Monitored 5 minutes — no new failed attempts." },
      { time: "2026-10-20T06:50", author: ANALYST, type: "comment", text: "User confirmed she is logged in and ready for shift." },
      { time: "2026-10-20T06:52", author: "System", type: "system", text: "Resolved — First Contact Resolution." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Unlocked AD account; removed stale credential from mobile mail client (root cause of repeat lockouts). KB0010045." },
  },

  /* ---------------------------------------------------------------- P4 badge tap (VIP) */
  {
    number: "INC0010008",
    opened: "2026-10-20T08:15", responded: "2026-10-20T08:17", resolved: "2026-10-20T08:40",
    caller: "Dr. Samuel Ortiz (ED Physician)", department: "Emergency Department", location: "Main Campus - ED",
    channel: "Walk-up / Phone", category: "Hardware", subcategory: "Badge reader",
    ci: "EDWS-14 badge reader",
    short: "Badge tap login not working on workstation EDWS-14",
    description: "Tapping badge does nothing on EDWS-14. Other workstations work.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one workstation. Urgency MEDIUM: other ED workstations are available and manual login works. → P4. Caller seniority does not change priority — the matrix does. Still handled promptly as it was quick to fix.",
    escalations: [],
    notes: [
      { time: "2026-10-20T08:15", author: "System", type: "system", text: "Incident created." },
      { time: "2026-10-20T08:17", author: ANALYST, type: "work", text: "Remoted into EDWS-14. Badge reader not listed in Device Manager. Manual username/password login works — provided as workaround. Set Impact 3 / Urgency 2 → P4." },
      { time: "2026-10-20T08:30", author: ANALYST, type: "work", text: "Asked ED unit tech to reseat the reader's USB cable. Device re-detected, driver loaded. Test tap successful." },
      { time: "2026-10-20T08:38", author: ANALYST, type: "comment", text: "Dr. Ortiz confirmed badge tap works." },
      { time: "2026-10-20T08:40", author: "System", type: "system", text: "Resolved." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Loose USB connection on badge reader. Reseated; device re-enumerated." },
  },

  /* ---------------------------------------------------------------- P3 Finance share -> T3 */
  {
    number: "INC0010009",
    opened: "2026-10-19T15:10", responded: "2026-10-19T15:13", resolved: "2026-10-19T16:45",
    caller: "Greg Hanson (Finance Manager)", department: "Finance", location: "Admin Building - 2nd Floor",
    channel: "Self-service portal", category: "Server / Shared Drive", subcategory: "File share",
    ci: "MLH-FS02 (file server)",
    short: "Finance shared drive (S:) not accessible for whole department",
    description: "S: drive shows disconnected for all Finance staff. Month-end reports stored there.",
    impact: 2, urgency: 2,
    state: "Closed", group: "Server & Infrastructure", assignedTo: "D. Kowalski",
    rationale: "Impact MEDIUM: one department (8 users). Urgency MEDIUM: work is delayed but not patient-facing; local copies available for some tasks. → P3. Routed straight to Tier 3 because the fault was isolated to the server.",
    escalations: [
      { time: "2026-10-19T15:20", from: "Service Desk (T1)", to: "Server & Infrastructure (T3)", type: "Functional", reason: "\\\\MLH-FS02 unreachable while other servers respond — server-side fault. Skipped Desktop Support since the issue is not on the endpoints." },
    ],
    notes: [
      { time: "2026-10-19T15:10", author: "System", type: "system", text: "Incident created via self-service portal." },
      { time: "2026-10-19T15:13", author: ANALYST, type: "work", text: "Confirmed 8 Finance users affected. From my workstation \\\\MLH-FS02\\Finance is unreachable, but shares on MLH-FS01 open fine → not a user/endpoint issue. Impact 2 / Urgency 2 → P3." },
      { time: "2026-10-19T15:20", author: ANALYST, type: "escalation", text: "Escalated directly to Server & Infrastructure with test results attached." },
      { time: "2026-10-19T15:22", author: ANALYST, type: "comment", text: "Told Finance the server team is engaged. Suggested working from local copies where possible." },
      { time: "2026-10-19T16:30", author: "D. Kowalski", type: "work", text: "Data volume on FS02 at 100% — runaway backup agent logs. Cleared logs and expanded volume by 200 GB. Share online." },
      { time: "2026-10-19T16:40", author: ANALYST, type: "work", text: "Confirmed with two Finance users that S: opens and files save." },
      { time: "2026-10-19T16:45", author: "System", type: "system", text: "Resolved. Infra opened a problem record for the missing disk-space alert." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Server & Infrastructure", notes: "Freed and expanded full data volume. Monitoring gap tracked in problem record." },
  },

  /* ---------------------------------------------------------------- P4 Outlook FCR */
  {
    number: "INC0010007",
    opened: "2026-10-19T13:45", responded: "2026-10-19T13:50", resolved: "2026-10-19T14:20",
    caller: "Linda Carter (Billing Specialist)", department: "Patient Financial Services", location: "Admin Building - 3rd Floor",
    channel: "Phone", category: "Software", subcategory: "Email client",
    ci: "Microsoft Outlook",
    short: "Outlook repeatedly prompting for password",
    description: "Outlook asks for password every few minutes. Webmail works.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency MEDIUM: webmail works as a workaround. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-19T13:45", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T13:50", author: ANALYST, type: "work", text: "Confirmed account not locked, webmail works → problem is local to Outlook. Found stale cached credentials in Windows Credential Manager." },
      { time: "2026-10-19T14:05", author: ANALYST, type: "work", text: "Removed stale credentials, created a new Outlook profile, re-signed in. Sent/received test email." },
      { time: "2026-10-19T14:20", author: ANALYST, type: "comment", text: "User confirmed no more prompts after 15 minutes. Resolved — First Contact Resolution." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Cleared stale credentials and rebuilt Outlook profile. KB0010311." },
  },

  /* ---------------------------------------------------------------- P4 VPN — response SLA breached */
  {
    number: "INC0010013",
    opened: "2026-10-18T22:40", responded: "2026-10-19T07:10", resolved: "2026-10-19T07:35",
    caller: "Mark Ellis (Remote Medical Coder)", department: "Health Information Management", location: "Remote",
    channel: "Self-service portal", category: "Access / Account", subcategory: "MFA / VPN",
    ci: "VPN client / MFA",
    short: "VPN fails at MFA step after getting a new phone",
    description: "Submitted overnight via portal. VPN connects, then fails waiting for MFA approval. User replaced phone this weekend.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency MEDIUM: user can't work, but coding is not time-critical overnight. → P4. Response SLA breached because the portal ticket arrived after hours — documented honestly with an improvement recommendation.",
    escalations: [],
    notes: [
      { time: "2026-10-18T22:40", author: "System", type: "system", text: "Incident created via self-service portal (after hours)." },
      { time: "2026-10-19T07:10", author: ANALYST, type: "work", text: "Picked up at start of day shift. Response SLA breached (8h30m vs 8h target for P4). Called user; MFA app was never re-enrolled on the new phone." },
      { time: "2026-10-19T07:25", author: ANALYST, type: "work", text: "Verified identity per SOP, reset MFA registration, user re-enrolled authenticator on new phone. VPN connects." },
      { time: "2026-10-19T07:35", author: ANALYST, type: "comment", text: "User confirmed connected and working. Resolved." },
      { time: "2026-10-19T07:40", author: ANALYST, type: "work", text: "Shift handoff note: recommend overnight queue check for P4 portal tickets, or an auto-reply with MFA self-service steps, to prevent repeat response breaches." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Reset MFA registration; user re-enrolled. Process improvement suggested for after-hours portal tickets." },
  },

  /* ---------------------------------------------------------------- P4 Epic AVS printing -> Epic (open) */
  {
    number: "INC0010011",
    opened: "2026-10-20T12:15", responded: "2026-10-20T12:20", resolved: null,
    caller: "Nicole Adams (Medical Assistant)", department: "Family Medicine Clinic", location: "Lakeview Outpatient Center",
    channel: "Phone", category: "Clinical Application", subcategory: "Epic printing",
    ci: "Epic print mapping - Family Medicine",
    short: "After Visit Summary prints to front desk printer instead of exam room printer",
    description: "AVS from exam rooms 3–6 prints at the front desk. Other documents print to the correct exam room printer.",
    impact: 3, urgency: 2,
    state: "In Progress", group: "Clinical Apps - Epic", assignedTo: "L. Brooks",
    rationale: "Impact LOW: a few rooms in one clinic. Urgency MEDIUM: workaround (select printer manually) exists. → P4. Escalated because Epic print mapping is owned by the Epic team, not the desktop.",
    escalations: [
      { time: "2026-10-20T12:35", from: "Service Desk (T1)", to: "Clinical Apps - Epic (T2)", type: "Functional", reason: "Windows default printer and non-Epic printing are correct; only the Epic AVS report misroutes → Epic department print mapping." },
    ],
    notes: [
      { time: "2026-10-20T12:15", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T12:20", author: ANALYST, type: "work", text: "Remoted into exam room 4 PC. Windows default printer is correct; Word test page prints to exam room printer. Only Epic AVS goes to the front desk → Epic-side mapping. Impact 3 / Urgency 2 → P4." },
      { time: "2026-10-20T12:30", author: ANALYST, type: "comment", text: "Workaround: choose the exam room printer manually from the Epic print dialog until fixed." },
      { time: "2026-10-20T12:35", author: ANALYST, type: "escalation", text: "Escalated to Clinical Apps - Epic with workstation names, printer names, and screenshots of the print dialog." },
      { time: "2026-10-20T14:10", author: "L. Brooks", type: "work", text: "Department printer classification for exam rooms 3–6 points at the front desk device after last week's room remodel. Building correction for next Epic print config refresh." },
    ],
    resolution: null,
  },

  /* ---------------------------------------------------------------- P5 on hold */
  {
    number: "INC0010010",
    opened: "2026-10-20T09:30", responded: "2026-10-20T09:45", resolved: null,
    onHoldSince: "2026-10-20T10:15",
    caller: "Jessica Turner (Scheduling Coordinator)", department: "Outpatient Scheduling", location: "Lakeview Outpatient Center",
    channel: "Email", category: "Hardware", subcategory: "Performance",
    ci: "LT-SCH-0231 (laptop)",
    short: "Laptop running slow",
    description: "Laptop slow to open apps since yesterday. Still usable.",
    impact: 3, urgency: 3,
    state: "On Hold", holdReason: "Awaiting Caller", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency LOW: slow but usable, no deadline. → P5.",
    escalations: [],
    notes: [
      { time: "2026-10-20T09:30", author: "System", type: "system", text: "Incident created via email." },
      { time: "2026-10-20T09:45", author: ANALYST, type: "work", text: "Remote session: disk at 100% from a stuck Windows Update. Stopped update service, cleared SoftwareDistribution cache, restarted service. Restart required to finish." },
      { time: "2026-10-20T10:15", author: ANALYST, type: "comment", text: "User asked to restart at end of day (patients on the phone). Placed On Hold - Awaiting Caller (SLA paused). Contact attempt 1 of 3 per follow-up policy." },
    ],
    resolution: null,
  },

  /* ---------------------------------------------------------------- P5 converted to request */
  {
    number: "INC0010006",
    opened: "2026-10-19T09:20", responded: "2026-10-19T09:25", resolved: "2026-10-19T09:30",
    caller: "Brian Walsh (Revenue Cycle Analyst)", department: "Revenue Cycle", location: "Admin Building - 3rd Floor",
    channel: "Self-service portal", category: "Hardware", subcategory: "Peripheral",
    ci: "N/A",
    short: "Requesting a second monitor",
    description: "Would like a second monitor for reconciliation work.",
    impact: 3, urgency: 3,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST, convertedTo: "RITM0023301",
    rationale: "Nothing is broken → this is a Service Request, not an Incident. Converted so incident metrics stay accurate and the request gets manager approval.",
    escalations: [],
    notes: [
      { time: "2026-10-19T09:20", author: "System", type: "system", text: "Incident created via self-service portal." },
      { time: "2026-10-19T09:25", author: ANALYST, type: "work", text: "Request for new equipment, not a service disruption. Converted to catalog item 'Peripheral - Additional Monitor' (RITM0023301), which routes to the manager for approval." },
      { time: "2026-10-19T09:30", author: ANALYST, type: "comment", text: "Let user know the request was submitted on their behalf and they'll get approval/fulfillment updates on RITM0023301." },
    ],
    resolution: { code: "Closed - Converted to Request", by: "Service Desk", notes: "Converted to RITM0023301." },
  },

  /* ---------------------------------------------------------------- quick Tier 1 resolutions */
  {
    number: "INC0010016",
    opened: "2026-10-19T10:05", responded: "2026-10-19T10:06", resolved: "2026-10-19T10:14",
    caller: "Carlos Mendez (Unit Secretary)", department: "Labor & Delivery", location: "Main Campus - 3 North",
    channel: "Phone", category: "Printer", subcategory: "Printer mapping",
    ci: "LD-NS-PRN01",
    short: "Nurse station printer missing after workstation reimage",
    description: "Workstation was reimaged last night; the nurse station printer is no longer listed.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one workstation. Urgency MEDIUM: other workstation at the station can print. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-19T10:05", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T10:06", author: ANALYST, type: "work", text: "Remote session: printer not mapped after reimage. Added \\\\MLH-PRT01\\LD-NS-PRN01 and set as default. Test page printed." },
      { time: "2026-10-19T10:14", author: ANALYST, type: "comment", text: "User confirmed printing works. Resolved — First Contact Resolution." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Re-mapped department printer after reimage." },
  },
  {
    number: "INC0010017",
    opened: "2026-10-19T11:30", responded: "2026-10-19T11:31", resolved: "2026-10-19T11:40",
    caller: "Hannah Price (Registration Supervisor)", department: "Patient Access", location: "Main Campus - Admitting",
    channel: "Phone", category: "Access / Account", subcategory: "Password expired",
    ci: "Active Directory",
    short: "Password expired - cannot log in to registration workstation",
    description: "Password expired over the weekend; Windows login rejects it.",
    impact: 3, urgency: 1,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency HIGH: patient registration line is waiting and she has no other login. → P3.",
    escalations: [],
    notes: [
      { time: "2026-10-19T11:30", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T11:31", author: ANALYST, type: "work", text: "Verified identity per SOP. Password expired. Issued temporary password with 'must change at next logon'." },
      { time: "2026-10-19T11:40", author: ANALYST, type: "comment", text: "User set a new password and logged in. Pointed her to the self-service password reset portal for next time. Resolved — First Contact Resolution." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Temporary password issued; user enrolled in self-service reset. KB0010046." },
  },
  {
    number: "INC0010018",
    opened: "2026-10-20T13:35", responded: "2026-10-20T13:40", resolved: "2026-10-20T13:58",
    caller: "Ahmed Saleh (Interpreter Services)", department: "Interpreter Services", location: "Main Campus - 1st Floor",
    channel: "Phone", category: "Software", subcategory: "Video conferencing",
    ci: "Teams / headset",
    short: "No audio in video interpreting calls",
    description: "Patients can't hear the interpreter on video calls. Started after headset was swapped.",
    impact: 3, urgency: 1,
    state: "Resolved", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency HIGH: interpreter needed for active patient visits, no spare headset on hand. → P3.",
    escalations: [],
    notes: [
      { time: "2026-10-20T13:35", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T13:40", author: ANALYST, type: "work", text: "Remote session: new USB headset detected but app still using the old (removed) device for microphone and speaker. Set the new headset as default in both Windows Sound settings and the app's device settings." },
      { time: "2026-10-20T13:55", author: ANALYST, type: "comment", text: "Ran a test call together — audio both ways. User back on patient calls." },
      { time: "2026-10-20T13:58", author: "System", type: "system", text: "Resolved — First Contact Resolution." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Set new headset as default audio device in OS and app." },
  },

  /* ---------------------------------------------------------------- New, unworked */
  {
    number: "INC0010014",
    opened: "2026-10-20T14:40", responded: null, resolved: null,
    caller: "Sandra Lee (Release of Information)", department: "Health Information Management", location: "Main Campus - Lower Level",
    channel: "Phone", category: "Software", subcategory: "Fax",
    ci: "Fax server",
    short: "Outbound faxes failing from HIM - records requests delayed",
    description: "Outbound faxes fail with 'transmission error'. Incoming faxes work.",
    impact: 2, urgency: 2,
    state: "New", group: "Service Desk", assignedTo: "",
    rationale: "Impact MEDIUM: whole HIM department. Urgency MEDIUM: records requests delayed, not patient-critical. → P3.",
    escalations: [],
    notes: [
      { time: "2026-10-20T14:40", author: "System", type: "system", text: "Incident created via phone. Awaiting triage." },
    ],
    resolution: null,
  },
  {
    number: "INC0010015",
    opened: "2026-10-20T14:52", responded: null, resolved: null,
    caller: "Omar Haddad (Patient Access Rep)", department: "Outpatient Registration", location: "Lakeview Outpatient Center",
    channel: "Self-service portal", category: "Hardware", subcategory: "Monitor",
    ci: "REG-02 monitor",
    short: "Monitor flickering at registration desk 2",
    description: "Monitor flickers occasionally. Still usable.",
    impact: 3, urgency: 3,
    state: "New", group: "Service Desk", assignedTo: "",
    rationale: "Impact LOW: one device. Urgency LOW: usable. → P5.",
    escalations: [],
    notes: [
      { time: "2026-10-20T14:52", author: "System", type: "system", text: "Incident created via self-service portal. Awaiting triage." },
    ],
    resolution: null,
  },
];
