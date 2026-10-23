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
  "Printer":                  { group: "Service Desk", note: "Clear queue / remap / test page first. Hardware faults → Desktop Support. Epic print mapping → Clinical Apps - Epic." },
  "Network / Wi-Fi":          { group: "Network Operations", note: "Confirm scope (one device vs. area). Area-wide or AP down → Network Operations." },
  "Clinical Application":     { group: "Clinical Apps - Epic", note: "Gather user, workstation, activity, and a screenshot. App-side config (like print mapping) → Clinical Apps - Epic." },
  "Server / Shared Drive":    { group: "Server & Infrastructure", note: "If the share/server is unreachable for multiple users, route directly to the server team." },
  "Security":                 { group: "Security Operations", note: "Do NOT investigate. Preserve evidence, escalate immediately, follow Security's instructions." },
  "Software":                 { group: "Service Desk", note: "Standard desktop software issues are Tier 1. Packaging/deployment failures → Desktop Support." },
};

const INCIDENTS = [
  /* -------------------------------------------------------- Tier 1 resolved */
  {
    number: "INC0010001",
    opened: "2026-10-20T06:40", responded: "2026-10-20T06:45", resolved: "2026-10-20T06:52",
    caller: "Dana Reyes, Registration Clerk", department: "Patient Registration", location: "Main Campus - Admitting",
    channel: "Phone", category: "Access / Account", subcategory: "Account Lockout",
    ci: "Active Directory account",
    short: "Locked out of account - cannot log in before shift",
    description: "Caller entered the wrong password a few times and is now locked out. Shift starts in 15 minutes.",
    impact: 3, urgency: 1,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user, one account. Urgency HIGH: blocks the user from starting their shift and there is no workaround. → P3.",
    escalations: [],
    notes: [
      { time: "2026-10-20T06:40", author: "System", type: "system", text: "Incident created via phone by Service Desk." },
      { time: "2026-10-20T06:46", author: ANALYST, type: "work", text: "Verified caller identity (full name, employee ID, verified callback number) before making any account change." },
      { time: "2026-10-20T06:50", author: ANALYST, type: "work", text: "Unlocked the account in Active Directory. Had the user attempt login while on the line — successful." },
      { time: "2026-10-20T06:52", author: ANALYST, type: "comment", text: "Confirmed you're able to log in. Shared the self-service password reset link so you can unlock without calling next time." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Verified identity, unlocked AD account, confirmed successful login. Shared self-service reset link." },
  },

  {
    number: "INC0010002",
    opened: "2026-10-20T07:05", responded: "2026-10-20T07:08", resolved: "2026-10-20T07:15",
    caller: "Marcus Bell, Patient Registration", department: "Patient Registration", location: "Main Campus - Admitting",
    channel: "Phone", category: "Access / Account", subcategory: "Password Reset",
    ci: "Active Directory account",
    short: "Password expired - cannot log in to registration workstation",
    description: "Login rejects the correct password with a 'password expired' message. User is at the front desk with patients waiting.",
    impact: 3, urgency: 1,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency HIGH: can't log in and patients are waiting, no workaround. → P3.",
    escalations: [],
    notes: [
      { time: "2026-10-20T07:05", author: "System", type: "system", text: "Incident created via phone by Service Desk." },
      { time: "2026-10-20T07:09", author: ANALYST, type: "work", text: "Verified identity, then reset the password and set 'must change at next logon'." },
      { time: "2026-10-20T07:14", author: ANALYST, type: "work", text: "User set a new password and logged in successfully while on the call." },
      { time: "2026-10-20T07:15", author: ANALYST, type: "comment", text: "You're back in. Passwords expire every 90 days — you'll get a reminder banner before it does next time." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Verified identity, reset expired password, confirmed login." },
  },

  {
    number: "INC0010003",
    opened: "2026-10-19T10:20", responded: "2026-10-19T10:35", resolved: "2026-10-19T11:10",
    caller: "Priya Shah, Billing", department: "Patient Financial Services", location: "Business Office",
    channel: "Portal", category: "Software", subcategory: "Outlook / Email",
    ci: "Outlook (Microsoft 365)",
    short: "Outlook repeatedly prompting for password",
    description: "Outlook keeps popping the credential prompt and won't stay connected. Webmail in the browser works fine.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency MEDIUM: email is interrupted but webmail is a working workaround. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-19T10:20", author: "System", type: "system", text: "Incident created via self-service portal." },
      { time: "2026-10-19T10:40", author: ANALYST, type: "work", text: "Removed the stale cached entry from Windows Credential Manager and closed Outlook fully." },
      { time: "2026-10-19T11:05", author: ANALYST, type: "work", text: "Recreated the Outlook profile; account re-authenticated once and stopped prompting. Sent/received a test email." },
      { time: "2026-10-19T11:10", author: ANALYST, type: "comment", text: "Outlook should stay signed in now. If the prompt comes back, let me know — it can point to a password change that didn't sync." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Cleared cached credentials, recreated Outlook profile, confirmed mail flow." },
  },

  {
    number: "INC0010004",
    opened: "2026-10-18T21:40", responded: "2026-10-19T06:30", resolved: "2026-10-19T06:55",
    caller: "Tom Alvarez, Case Management", department: "Case Management", location: "Remote / Home",
    channel: "Email", category: "Access / Account", subcategory: "MFA / VPN",
    ci: "VPN + MFA (Authenticator)",
    short: "VPN fails at MFA step after getting a new phone",
    description: "Set up a new phone and the authenticator app didn't carry over, so VPN now rejects at the MFA prompt. Needs remote access for on-call.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user. Urgency MEDIUM: remote access is down but the user can work on-site. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-18T21:40", author: "System", type: "system", text: "Incident created via email (after hours)." },
      { time: "2026-10-19T06:30", author: ANALYST, type: "work", text: "Picked this up at the start of day shift — it came in overnight and sat past the P4 response target (see SLA note below)." },
      { time: "2026-10-19T06:45", author: ANALYST, type: "work", text: "Verified identity, removed the old MFA device, and sent a re-enrollment so the user could register the authenticator on the new phone." },
      { time: "2026-10-19T06:54", author: ANALYST, type: "work", text: "User re-enrolled MFA and connected to VPN successfully while on the call." },
      { time: "2026-10-19T06:55", author: ANALYST, type: "comment", text: "VPN + MFA working on the new phone. For future phone swaps, re-enroll MFA before wiping the old device and it'll carry over cleanly." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Re-enrolled MFA on the new phone, confirmed VPN login. Response SLA was missed (overnight ticket) — recommended an after-hours auto-reply with self-service MFA steps so users aren't stuck until day shift." },
  },

  {
    number: "INC0010006",
    opened: "2026-10-19T14:05", responded: "2026-10-19T14:20", resolved: "2026-10-19T14:40",
    caller: "Nina Park, RN", department: "Nursing - Unit 3", location: "Main Campus - 3rd Floor",
    channel: "Phone", category: "Printer", subcategory: "Printer Mapping",
    ci: "Network printer (PRN-U3-02)",
    short: "Nurse station printer missing after workstation reimage",
    description: "The workstation was reimaged yesterday and the usual ward printer no longer shows up in the printer list.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one workstation. Urgency MEDIUM: can walk to another printer in the meantime. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-19T14:05", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T14:25", author: ANALYST, type: "work", text: "Reimage wiped the mapped printers. Remapped PRN-U3-02 from the print server by name and printed a test page." },
      { time: "2026-10-19T14:40", author: ANALYST, type: "comment", text: "Printer's back and the test page printed. Let me know if any other printers are missing from that workstation." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Remapped the network printer from the print server, confirmed with a test page." },
  },

  {
    number: "INC0010014",
    opened: "2026-10-20T11:20", responded: "2026-10-20T11:30", resolved: "2026-10-20T11:55",
    caller: "Kevin Moore, Scheduling", department: "Central Scheduling", location: "Business Office",
    channel: "Phone", category: "Software", subcategory: "Application Error",
    ci: "Scheduling client",
    short: "Scheduling app won't open after this morning's update",
    description: "The scheduling app throws an error on launch after an update was pushed overnight. It was working fine yesterday.",
    impact: 3, urgency: 2,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one user's app. Urgency MEDIUM: blocks their main task but a coworker can cover briefly. → P4.",
    escalations: [],
    notes: [
      { time: "2026-10-20T11:20", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T11:35", author: ANALYST, type: "work", text: "Reproduced the launch error. Cleared the app's local cache and repaired the client install." },
      { time: "2026-10-20T11:50", author: ANALYST, type: "work", text: "App launches normally after the repair. Checked for other reports of the same error after the overnight update — none so far." },
      { time: "2026-10-20T11:55", author: ANALYST, type: "comment", text: "You're good to go. If anyone else on your team hits the same error after the update, point them to this ticket so we can group it." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Service Desk", notes: "Cleared cache and repaired the client. Flagged to watch for more reports of the same overnight update." },
  },

  /* -------------------------------------------------------- On hold */
  {
    number: "INC0010005",
    opened: "2026-10-20T13:10", responded: "2026-10-20T13:25", onHoldSince: "2026-10-20T13:40",
    caller: "Elaine Woods, HIM", department: "Health Information Management", location: "Records",
    channel: "Chat", category: "Hardware", subcategory: "Performance",
    ci: "Laptop (LT-HIM-18)",
    short: "Laptop running slow",
    description: "Laptop is slow to open programs and switch windows. No specific error. Started sometime this week.",
    impact: 3, urgency: 3,
    state: "On Hold", holdReason: "Awaiting Caller", group: "Service Desk", assignedTo: ANALYST,
    rationale: "Impact LOW: one device. Urgency LOW: an annoyance, work continues. → P5.",
    escalations: [],
    notes: [
      { time: "2026-10-20T13:10", author: "System", type: "system", text: "Incident created via chat." },
      { time: "2026-10-20T13:30", author: ANALYST, type: "work", text: "Checked remotely: several heavy apps in startup, and the C: drive is ~85% full. No malware flags. A reboot was pending from last week's updates." },
      { time: "2026-10-20T13:40", author: ANALYST, type: "comment", text: "Please restart the laptop when you get a moment and let it finish updating, then tell me if it's any faster. Placing the ticket on hold until I hear back." },
    ],
  },

  /* -------------------------------------------------------- New / awaiting triage */
  {
    number: "INC0010007",
    opened: "2026-10-20T14:30",
    caller: "Front Desk 2", department: "Patient Registration", location: "Main Campus - Admitting",
    channel: "Portal", category: "Hardware", subcategory: "Display",
    ci: "Monitor (registration desk 2)",
    short: "Monitor flickering at registration desk 2",
    description: "The second monitor flickers on and off intermittently. Reported at the end of shift; not yet triaged.",
    impact: 3, urgency: 3,
    state: "New", group: "Service Desk", assignedTo: "",
    rationale: "Awaiting triage. One display, low urgency — most likely a loose/failing video cable or the monitor itself. Confirm P5 on pickup.",
    escalations: [],
    notes: [
      { time: "2026-10-20T14:30", author: "System", type: "system", text: "Incident created via self-service portal. Awaiting triage." },
    ],
  },

  /* -------------------------------------------------------- Incident vs. service request */
  {
    number: "INC0010008",
    opened: "2026-10-19T09:15", responded: "2026-10-19T09:30", resolved: "2026-10-19T09:35",
    caller: "Omar Haddad, Coding", department: "Health Information Management", location: "Records",
    channel: "Portal", category: "Hardware", subcategory: "Equipment Request",
    ci: "Workstation (WS-COD-07)",
    short: "Requesting a second monitor",
    description: "User is asking for a second monitor to work faster. Nothing is broken — this is a new-equipment request, not a service outage.",
    impact: 3, urgency: 3,
    state: "Closed", group: "Service Desk", assignedTo: ANALYST, convertedTo: "RITM0023301",
    rationale: "There's no outage to restore — a working setup, just a request for more hardware. That's a Service Request, not an Incident, so it's logged and converted to a request (RITM) for approval/fulfillment. Excluded from incident resolution metrics.",
    escalations: [],
    notes: [
      { time: "2026-10-19T09:15", author: "System", type: "system", text: "Incident created via self-service portal." },
      { time: "2026-10-19T09:32", author: ANALYST, type: "work", text: "Confirmed with the user there is no fault — the current monitor works; they'd simply like a second one." },
      { time: "2026-10-19T09:35", author: ANALYST, type: "comment", text: "New equipment goes through the request catalog rather than an incident. I've converted this to RITM0023301, which routes to your manager for approval. You'll get updates on that record." },
    ],
    resolution: { code: "Closed (Converted to Request)", by: "Service Desk", notes: "No service outage. Converted to RITM0023301. Incidents restore broken service; new equipment goes through the request catalog." },
  },

  /* -------------------------------------------------------- Escalations (know when / where) */
  {
    number: "INC0010009",
    opened: "2026-10-19T11:30", responded: "2026-10-19T11:40", resolved: "2026-10-19T15:50",
    caller: "Laura Kim, RN", department: "Nursing - 4 West", location: "Main Campus - 4 West",
    channel: "Phone", category: "Network / Wi-Fi", subcategory: "Wireless",
    ci: "Wireless - 4 West",
    short: "Wi-Fi dropping for multiple devices on 4 West",
    description: "Several laptops and tablets on 4 West keep dropping Wi-Fi. Wired devices on the same unit are fine.",
    impact: 2, urgency: 2,
    state: "Resolved", group: "Network Operations", assignedTo: "S. Okafor",
    rationale: "Impact MEDIUM: a whole unit's wireless, multiple users. Urgency MEDIUM: workarounds exist (wired ports, move to another area). → P3.",
    escalations: [
      { time: "2026-10-19T11:55", from: "Service Desk (T1)", to: "Network Operations (T2)", type: "Functional", reason: "Confirmed it affects multiple devices across one area, not a single device — that points to an access point, which the network team owns." },
    ],
    notes: [
      { time: "2026-10-19T11:30", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T11:50", author: ANALYST, type: "work", text: "Checked 3 different devices on 4 West — all drop Wi-Fi in the same area. One of them connects fine on another floor, so it's not the device. Scope is area-wide → not a Tier 1 fix." },
      { time: "2026-10-19T11:55", author: ANALYST, type: "escalation", text: "Escalated to Network Operations with the device list, the area, and 'works elsewhere' evidence so they don't have to re-test with the user." },
      { time: "2026-10-19T11:57", author: ANALYST, type: "comment", text: "This looks like a wireless access-point issue on 4 West, so I've handed it to the network team. For now, a wired port or moving toward the nurses' station holds a connection." },
      { time: "2026-10-19T15:50", author: "S. Okafor", type: "work", text: "Access point AP-4W-07 was faulty; replaced it. Wireless stable across 4 West on re-test." },
    ],
    resolution: { code: "Solved (Permanently)", by: "Network Operations", notes: "Replaced failing access point AP-4W-07; confirmed stable coverage on 4 West." },
  },

  {
    number: "INC0010010",
    opened: "2026-10-20T10:05", responded: "2026-10-20T10:15",
    caller: "Greg Santos, Admitting", department: "Patient Registration", location: "Main Campus - Admitting",
    channel: "Phone", category: "Printer", subcategory: "Hardware Fault",
    ci: "Front desk printer (PRN-ADM-01)",
    short: "Front desk printer won't power on",
    description: "Printer is completely dead — no lights, no power. User already tried a known-good outlet and a different power cable.",
    impact: 3, urgency: 2,
    state: "In Progress", group: "Desktop Support", assignedTo: "R. Nguyen",
    rationale: "Impact LOW: one printer. Urgency MEDIUM: slows front-desk paperwork but another printer is nearby. → P4.",
    escalations: [
      { time: "2026-10-20T10:20", from: "Service Desk (T1)", to: "Desktop Support (T2)", type: "Functional", reason: "Dead unit after power troubleshooting — a hardware fault that needs an on-site repair or swap, which Tier 1 can't do remotely." },
    ],
    notes: [
      { time: "2026-10-20T10:05", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T10:18", author: ANALYST, type: "work", text: "Walked the user through power checks: different outlet, reseated power cable, held the power button — no response at all. Remote troubleshooting exhausted." },
      { time: "2026-10-20T10:20", author: ANALYST, type: "escalation", text: "Escalated to Desktop Support for an on-site look / swap. Noted the power steps already tried so they aren't repeated." },
      { time: "2026-10-20T10:22", author: ANALYST, type: "comment", text: "This needs hands-on hardware help, so I've sent it to Desktop Support. In the meantime, the printer at the next registration pod is available." },
    ],
  },

  {
    number: "INC0010011",
    opened: "2026-10-20T09:30", responded: "2026-10-20T09:38",
    caller: "Beth Carlson, Finance", department: "Finance", location: "Business Office",
    channel: "Phone", category: "Server / Shared Drive", subcategory: "Network Share",
    ci: "Finance shared drive (S:)",
    short: "Finance shared drive (S:) not accessible for the whole team",
    description: "Nobody in Finance can open the S: drive this morning — it returns 'network path not found'. Local files still open.",
    impact: 2, urgency: 2,
    state: "In Progress", group: "Server & Infrastructure", assignedTo: "D. Kowalski",
    rationale: "Impact MEDIUM: a whole department's shared drive. Urgency MEDIUM: slows work but local files are available. → P3.",
    escalations: [
      { time: "2026-10-20T09:45", from: "Service Desk (T1)", to: "Server & Infrastructure (T3)", type: "Functional", reason: "Multiple users can't reach the same share and it's not on the endpoints — that's server/storage-side, so it routes straight to the server team rather than Desktop Support." },
    ],
    notes: [
      { time: "2026-10-20T09:30", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T09:42", author: ANALYST, type: "work", text: "Confirmed with 3 different Finance users — the S: mapping fails for all of them, while other shares open normally. Not an endpoint issue; it's the server/share itself." },
      { time: "2026-10-20T09:45", author: ANALYST, type: "escalation", text: "Escalated directly to Server & Infrastructure (skipping Desktop Support) because the evidence points server-side and multiple users are affected." },
      { time: "2026-10-20T09:47", author: ANALYST, type: "comment", text: "Several of you can't reach S:, so I've sent this to the server team. I'll update this ticket as they investigate." },
    ],
  },

  {
    number: "INC0010012",
    opened: "2026-10-20T08:50", responded: "2026-10-20T08:55",
    caller: "Sara Lin, Billing", department: "Patient Financial Services", location: "Business Office",
    channel: "Phone", category: "Security", subcategory: "Phishing",
    ci: "User account / mailbox",
    short: "User clicked a 'payroll update' email and entered their password",
    description: "User got an email about a payroll update, clicked the link, and typed their username and password into the page before realizing it looked wrong.",
    impact: 2, urgency: 1,
    state: "In Progress", group: "Security Operations", assignedTo: "M. Chen",
    rationale: "Impact MEDIUM: a potentially compromised account with access to internal systems. Urgency HIGH: credentials are actively exposed — the longer it sits, the more it can be abused. → P2. Handled as a security incident.",
    escalations: [
      { time: "2026-10-20T08:58", from: "Service Desk (T1)", to: "Security Operations (T3)", type: "Functional", reason: "Credentials were entered on a phishing page. Per the security runbook, Tier 1 does not investigate — preserve the evidence and escalate to Security immediately." },
    ],
    notes: [
      { time: "2026-10-20T08:50", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-20T08:56", author: ANALYST, type: "work", text: "Told the user NOT to delete the email. Confirmed exactly what was entered (username + password) and the time. Did not click the link myself." },
      { time: "2026-10-20T08:57", author: ANALYST, type: "work", text: "Had the user forward the original phishing email as an attachment and noted the sender and link so Security has the evidence." },
      { time: "2026-10-20T08:58", author: ANALYST, type: "escalation", text: "Escalated to Security Operations immediately as a credential-exposure incident." },
      { time: "2026-10-20T09:00", author: ANALYST, type: "comment", text: "Thanks for reporting this quickly. Security is handling it. Please don't change your password or touch the email until they tell you to — they may want to check activity first." },
    ],
  },

  {
    number: "INC0010013",
    opened: "2026-10-19T13:50", responded: "2026-10-19T14:05",
    caller: "Rachel Diaz, MA", department: "Primary Care Clinic", location: "Clinic - Exam Room 4",
    channel: "Phone", category: "Clinical Application", subcategory: "Epic - Print Mapping",
    ci: "Epic Hyperspace - AVS printing",
    short: "After Visit Summary prints to front desk instead of the exam room",
    description: "When staff print the Epic After Visit Summary from exam room 4, it comes out at the front desk printer. Normal Windows printing from that room works fine.",
    impact: 3, urgency: 2,
    state: "In Progress", group: "Clinical Apps - Epic", assignedTo: "L. Brooks",
    rationale: "Impact LOW: one room's workflow. Urgency MEDIUM: staff have to walk to retrieve printouts, which slows rooming. → P4.",
    escalations: [
      { time: "2026-10-19T14:10", from: "Service Desk (T1)", to: "Clinical Apps - Epic (T2)", type: "Functional", reason: "A normal Windows test page from that room prints to the correct printer, so the printer and OS mapping are fine — the misroute is in the Epic print setup, which the Clinical Apps team owns." },
    ],
    notes: [
      { time: "2026-10-19T13:50", author: "System", type: "system", text: "Incident created via phone." },
      { time: "2026-10-19T14:08", author: ANALYST, type: "work", text: "Printed a normal Windows test page from the exam-room 4 workstation — it went to the correct exam-room printer. So hardware and Windows mapping are fine; only the Epic AVS misroutes." },
      { time: "2026-10-19T14:10", author: ANALYST, type: "escalation", text: "Escalated to Clinical Apps - Epic with the test-page result, since this is Epic print mapping rather than a device fault." },
      { time: "2026-10-19T14:12", author: ANALYST, type: "comment", text: "The printer itself is fine — this is an Epic printing setting, so I've handed it to the Epic team. For now the AVS can be retrieved from the front desk printer." },
    ],
  },
];
