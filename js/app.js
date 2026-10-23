/* HelpDesk ITSM Lab — single-page app (vanilla JS, no dependencies) */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const NOW = new Date(SIM_NOW);

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const d = (s) => (s ? new Date(s) : null);
  const mins = (a, b) => Math.round((b - a) / 60000);
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (s) => { if (!s) return "—"; const x = d(s); return `${MONTHS[x.getMonth()]} ${x.getDate()} ${pad(x.getHours())}:${pad(x.getMinutes())}`; };
  const dur = (m) => { if (m == null) return "—"; const neg = m < 0; m = Math.abs(m); const dd = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60; const s = (dd ? dd + "d " : "") + (h ? h + "h " : "") + (dd ? "" : mm + "m"); return (neg ? "-" : "") + s.trim(); };
  const priorityOf = (i, u) => PRIORITY_MATRIX[`${i}-${u}`];
  const isOpen = (t) => !["Resolved", "Closed"].includes(t.state);
  const isExcluded = (t) => t.parent || t.convertedTo; // duplicates / requests don't count toward FCR/escalation metrics
  const byNum = (n) => INCIDENTS.find((t) => t.number === n);
  const tierOf = (g) => (GROUPS[g] ? GROUPS[g].tier : "?");
  const priPill = (p) => `<span class="pri-pill p${p}">${PRIORITY_LABELS[p]}</span>`;
  const priDot = (p) => `<span class="pri pri-${p}">${PRIORITY_LABELS[p]}</span>`;
  const stateHtml = (t) => `<span class="state state-${t.state.replace(/\s/g, "-")}">${esc(t.state)}${t.holdReason ? " – " + esc(t.holdReason) : ""}</span>`;

  INCIDENTS.forEach((t) => (t.priority = priorityOf(t.impact, t.urgency)));

  function sla(t) {
    const tgt = SLA_TARGETS[t.priority];
    const opened = d(t.opened);
    const r = {};
    if (t.responded) {
      const e = mins(opened, d(t.responded));
      r.response = { elapsed: e, target: tgt.response, status: e <= tgt.response ? "met" : "breached" };
    } else {
      const e = mins(opened, NOW);
      r.response = { elapsed: e, target: tgt.response, status: e > tgt.response ? "breached" : "running" };
    }
    const end = d(t.resolved) || d(t.onHoldSince) || NOW;
    const e = mins(opened, end);
    const pct = e / tgt.resolve;
    let status;
    if (t.resolved) status = e <= tgt.resolve ? "met" : "breached";
    else if (t.onHoldSince) status = "paused";
    else status = pct >= 1 ? "breached" : pct >= 0.75 ? "warning" : "on track";
    r.resolve = { elapsed: e, target: tgt.resolve, pct, status };
    return r;
  }

  function slaBar(t) {
    const s = sla(t).resolve;
    const pct = Math.min(100, Math.round(s.pct * 100));
    const color = s.status === "breached" ? "var(--bad)" : s.status === "warning" ? "var(--warn)" : s.status === "paused" ? "var(--p3)" : "var(--ok)";
    const label = t.resolved ? `${s.status === "met" ? "Met" : "Breached"} · ${dur(s.elapsed)}` : s.status === "paused" ? `Paused · ${pct}%` : `${pct}% · ${dur(s.target - s.elapsed)} left`;
    return `<div class="sla"><div class="sla-track"><div class="sla-fill" style="width:${pct}%;background:${color}"></div></div><div class="sla-text">${label}</div></div>`;
  }

  function tags(t) {
    const out = [];
    if (t.majorIncident) out.push(`<span class="tag major">MAJOR INCIDENT</span>`);
    if (t.parent) out.push(`<span class="tag">Child of ${t.parent}</span>`);
    if (t.escalations.length) out.push(`<span class="tag esc">Escalated → T${Math.max(...t.escalations.map((e) => (/T3/.test(e.to) ? 3 : /T2/.test(e.to) ? 2 : 1)))}</span>`);
    if (!isOpen(t) && !t.escalations.length && !isExcluded(t)) out.push(`<span class="tag fcr">Resolved at T1</span>`);
    if (t.convertedTo) out.push(`<span class="tag">→ ${t.convertedTo}</span>`);
    const s = sla(t);
    if (s.response.status === "breached" || s.resolve.status === "breached") out.push(`<span class="tag breach">SLA breached</span>`);
    if (t.state === "On Hold") out.push(`<span class="tag hold">SLA paused</span>`);
    return out.join(" ");
  }

  function setActive(route) {
    document.querySelectorAll(".sidebar a").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
    document.getElementById("sidebar").classList.remove("open");
  }

  /* ---------------- views ---------------- */
  function viewDashboard() {
    const open = INCIDENTS.filter(isOpen);
    const worked = INCIDENTS.filter((t) => !isExcluded(t) && t.state !== "New");
    const resolved = INCIDENTS.filter((t) => !isOpen(t) && !isExcluded(t));
    const fcr = resolved.filter((t) => !t.escalations.length);
    const escalated = worked.filter((t) => t.escalations.length);
    let slaTotal = 0, slaMet = 0;
    INCIDENTS.forEach((t) => {
      const s = sla(t);
      if (t.responded) { slaTotal++; if (s.response.status === "met") slaMet++; }
      if (t.resolved) { slaTotal++; if (s.resolve.status === "met") slaMet++; }
    });
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

    const priCounts = [1, 2, 3, 4, 5].map((p) => ({ p, all: INCIDENTS.filter((t) => t.priority === p).length, open: open.filter((t) => t.priority === p).length }));
    const maxAll = Math.max(...priCounts.map((x) => x.all), 1);
    const groupCounts = Object.keys(GROUPS).map((g) => ({ g, n: INCIDENTS.filter((t) => t.group === g).length })).filter((x) => x.n);
    const maxG = Math.max(...groupCounts.map((x) => x.n), 1);
    const priColor = { 1: "var(--p1)", 2: "var(--p2)", 3: "#e0b400", 4: "var(--p4)", 5: "#9aa6b2" };

    const escLog = INCIDENTS.flatMap((t) => t.escalations.map((e) => ({ ...e, t }))).sort((a, b) => d(b.time) - d(a.time));
    const attention = open
      .filter((t) => t.state === "New" || ["warning", "breached"].includes(sla(t).resolve.status) || t.priority <= 2)
      .sort((a, b) => a.priority - b.priority);

    app.innerHTML = `
      <div class="page-head">
        <div><h1>Service Desk Dashboard</h1><div class="muted">Shift snapshot · ${INCIDENTS.length} incidents · Oct 18–20, 2026</div></div>
        <a class="btn btn-primary" href="#/new">+ New Incident</a>
      </div>
      <div class="grid kpis">
        <div class="kpi"><div class="label">Open incidents</div><div class="value">${open.length}</div><div class="sub">${open.filter((t) => t.state === "New").length} awaiting triage</div></div>
        <div class="kpi"><div class="label">Open P1 / P2</div><div class="value" style="color:var(--p2)">${open.filter((t) => t.priority <= 2).length}</div><div class="sub">critical &amp; high</div></div>
        <div class="kpi"><div class="label">SLA compliance</div><div class="value ${pct(slaMet, slaTotal) >= 90 ? "ok" : "warn"}">${pct(slaMet, slaTotal)}%</div><div class="sub">${slaMet}/${slaTotal} response + resolution targets</div></div>
        <div class="kpi"><div class="label">First-contact / T1 resolution</div><div class="value">${pct(fcr.length, resolved.length)}%</div><div class="sub">${fcr.length} of ${resolved.length} resolved incidents</div></div>
        <div class="kpi"><div class="label">Escalation rate</div><div class="value">${pct(escalated.length, worked.length)}%</div><div class="sub">${escalated.length} of ${worked.length} worked incidents</div></div>
      </div>

      <div class="grid three-col">
        <div class="panel">
          <h3>Needs attention</h3>
          <div class="table-wrap" style="border:0">
          <table>
            <thead><tr><th>Number</th><th>Priority</th><th>State</th><th>Short description</th><th>Group</th><th>Resolution SLA</th></tr></thead>
            <tbody>${attention.map((t) => `
              <tr data-href="#/incident/${t.number}">
                <td class="num"><a href="#/incident/${t.number}">${t.number}</a></td>
                <td>${priDot(t.priority)}</td><td>${stateHtml(t)}</td>
                <td class="short">${esc(t.short)}</td><td>${esc(t.group)}</td><td>${slaBar(t)}</td>
              </tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div class="grid">
          <div class="panel">
            <h3>Incidents by priority</h3>
            ${priCounts.map((x) => `<div class="bar-row"><span>${priDot(x.p)}</span><div class="bar-track"><div class="bar-fill" style="width:${(x.all / maxAll) * 100}%;background:${priColor[x.p]}"></div></div><b>${x.all}</b></div>`).join("")}
          </div>
          <div class="panel">
            <h3>By assignment group</h3>
            ${groupCounts.map((x) => `<div class="bar-row"><span>${esc(x.g)} <span class="muted">T${tierOf(x.g)}</span></span><div class="bar-track"><div class="bar-fill" style="width:${(x.n / maxG) * 100}%;background:${tierOf(x.g) === 1 ? "var(--accent)" : tierOf(x.g) === 2 ? "var(--p4)" : "#6a3fb5"}"></div></div><b>${x.n}</b></div>`).join("")}
          </div>
        </div>
      </div>

      <div class="panel section">
        <h3>Escalation log</h3>
        <div class="table-wrap" style="border:0">
        <table>
          <thead><tr><th>Time</th><th>Incident</th><th>Priority</th><th>Type</th><th>From → To</th><th>Reason</th></tr></thead>
          <tbody>${escLog.map((e) => `
            <tr data-href="#/incident/${e.t.number}">
              <td>${fmt(e.time)}</td><td class="num"><a href="#/incident/${e.t.number}">${e.t.number}</a></td>
              <td>${priDot(e.t.priority)}</td><td><span class="tag ${e.type === "Functional" ? "esc" : "major"}">${e.type}</span></td>
              <td>${esc(e.from)} → <b>${esc(e.to)}</b></td><td class="short">${esc(e.reason)}</td>
            </tr>`).join("")}</tbody>
        </table></div>
      </div>`;
  }

  const QUEUES = {
    all:       { title: "All Incidents",        fn: () => true },
    open:      { title: "Open Incidents",       fn: isOpen },
    new:       { title: "Unassigned (New)",     fn: (t) => t.state === "New" },
    mine:      { title: "Assigned to Me",       fn: (t) => t.assignedTo === ANALYST },
    escalated: { title: "Escalated Incidents",  fn: (t) => t.escalations.length > 0 },
    major:     { title: "Major Incidents",      fn: (t) => t.majorIncident || t.parent },
  };
  const qState = { search: "", pri: "", group: "", sort: "priority" };

  function viewQueue(key) {
    const q = QUEUES[key] || QUEUES.all;
    const groups = [...new Set(INCIDENTS.map((t) => t.group))].sort();
    app.innerHTML = `
      <div class="page-head"><div><h1>${q.title}</h1><div class="muted" id="qcount"></div></div><a class="btn btn-primary" href="#/new">+ New Incident</a></div>
      <div class="toolbar">
        <input id="qSearch" type="search" placeholder="Search number, description, caller…" value="${esc(qState.search)}">
        <select id="qPri"><option value="">All priorities</option>${[1, 2, 3, 4, 5].map((p) => `<option value="${p}" ${qState.pri == p ? "selected" : ""}>${PRIORITY_LABELS[p]}</option>`).join("")}</select>
        <select id="qGroup"><option value="">All groups</option>${groups.map((g) => `<option ${qState.group === g ? "selected" : ""}>${esc(g)}</option>`).join("")}</select>
        <select id="qSort">
          <option value="priority" ${qState.sort === "priority" ? "selected" : ""}>Sort: Priority, then oldest</option>
          <option value="opened" ${qState.sort === "opened" ? "selected" : ""}>Sort: Newest opened</option>
          <option value="sla" ${qState.sort === "sla" ? "selected" : ""}>Sort: SLA % elapsed</option>
        </select>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Number</th><th>Priority</th><th>State</th><th>Short description</th><th>Caller</th><th>Assignment group</th><th>Assigned to</th><th>Opened</th><th>Resolution SLA</th></tr></thead>
        <tbody id="qBody"></tbody>
      </table></div>`;

    const render = () => {
      const s = qState.search.toLowerCase();
      let rows = INCIDENTS.filter(q.fn)
        .filter((t) => !qState.pri || t.priority == qState.pri)
        .filter((t) => !qState.group || t.group === qState.group)
        .filter((t) => !s || [t.number, t.short, t.caller, t.department, t.ci].join(" ").toLowerCase().includes(s));
      if (qState.sort === "priority") rows.sort((a, b) => a.priority - b.priority || d(a.opened) - d(b.opened));
      if (qState.sort === "opened") rows.sort((a, b) => d(b.opened) - d(a.opened));
      if (qState.sort === "sla") rows.sort((a, b) => sla(b).resolve.pct - sla(a).resolve.pct);
      document.getElementById("qcount").textContent = `${rows.length} record${rows.length === 1 ? "" : "s"}`;
      document.getElementById("qBody").innerHTML = rows.map((t) => `
        <tr data-href="#/incident/${t.number}">
          <td class="num"><a href="#/incident/${t.number}">${t.number}</a></td>
          <td>${priDot(t.priority)}</td><td>${stateHtml(t)}</td>
          <td class="short">${esc(t.short)} ${t.majorIncident ? '<span class="tag major">MI</span>' : ""}</td>
          <td>${esc(t.caller)}</td><td>${esc(t.group)}</td><td>${esc(t.assignedTo) || '<span class="muted">(empty)</span>'}</td>
          <td>${fmt(t.opened)}</td><td>${slaBar(t)}</td>
        </tr>`).join("") || `<tr><td colspan="9" class="muted">No records match.</td></tr>`;
    };
    render();
    document.getElementById("qSearch").addEventListener("input", (e) => { qState.search = e.target.value; render(); });
    document.getElementById("qPri").addEventListener("change", (e) => { qState.pri = e.target.value; render(); });
    document.getElementById("qGroup").addEventListener("change", (e) => { qState.group = e.target.value; render(); });
    document.getElementById("qSort").addEventListener("change", (e) => { qState.sort = e.target.value; render(); });
  }

  function viewIncident(num) {
    const t = byNum(num);
    if (!t) { app.innerHTML = `<div class="panel">Incident ${esc(num)} not found. <a href="#/queue/all">Back to list</a></div>`; return; }
    const s = sla(t);
    const tgt = SLA_TARGETS[t.priority];
    const field = (l, v) => `<div class="field"><label>${l}</label><div class="val">${v}</div></div>`;
    const resp = s.response;
    const respTxt = t.responded ? `${dur(resp.elapsed)} / ${dur(resp.target)} target — <b class="${resp.status === "met" ? "ok" : "bad"}">${resp.status.toUpperCase()}</b>` : `${dur(resp.elapsed)} elapsed / ${dur(resp.target)} target — <b class="${resp.status === "breached" ? "bad" : "warn"}">${resp.status === "breached" ? "BREACHED" : "RUNNING"}</b>`;

    // Escalation path: T1 Service Desk → each functional escalation target
    const fx = t.escalations.filter((e) => e.type === "Functional");
    const steps = [{ name: "Service Desk", tier: 1 }].concat(fx.map((e) => ({ name: e.to.replace(/\s*\(.*\)/, ""), tier: /T3/.test(e.to) ? 3 : 2 })));
    const path = steps.map((st, i) => `<div class="esc-step ${i === steps.length - 1 ? "active" : ""}"><span class="muted">Tier ${st.tier}</span><b>${esc(st.name)}</b></div>`).join(`<div class="esc-arrow">→</div>`);

    const related = [];
    if (t.parent) related.push(`Parent incident: <a href="#/incident/${t.parent}">${t.parent}</a>`);
    if (t.children) related.push(`Child incidents: ${t.children.map((c) => `<a href="#/incident/${c}">${c}</a>`).join(", ")}`);
    if (t.problem) related.push(`Problem: <b>${t.problem}</b> (root-cause analysis)`);
    if (t.change) related.push(`Related change: <b>${t.change}</b> (probable cause)`);
    if (t.convertedTo) related.push(`Converted to request: <b>${t.convertedTo}</b>`);

    app.innerHTML = `
      <div class="form-head">
        <a href="#/queue/all">← Incidents</a>
        <h1>${t.number}</h1> ${priPill(t.priority)} ${stateHtml(t)} ${tags(t)}
      </div>
      <div class="panel">
        <h2>${esc(t.short)}</h2>
        <div class="fields">
          <div>
            ${field("Caller", esc(t.caller))}
            ${field("Department", esc(t.department))}
            ${field("Location", esc(t.location))}
            ${field("Channel", esc(t.channel))}
            ${field("Category", `${esc(t.category)} / ${esc(t.subcategory)}`)}
            ${field("Configuration item", esc(t.ci))}
          </div>
          <div>
            ${field("Opened", fmt(t.opened))}
            ${field("Impact", IMPACT_LABELS[t.impact])}
            ${field("Urgency", URGENCY_LABELS[t.urgency])}
            ${field("Priority", priDot(t.priority) + ' <span class="muted">(calculated)</span>')}
            ${field("Assignment group", `${esc(t.group)} <span class="muted">· Tier ${tierOf(t.group)}</span>`)}
            ${field("Assigned to", esc(t.assignedTo) || '<span class="muted">(empty)</span>')}
          </div>
        </div>
        ${field("Description", esc(t.description))}

        <div class="callout ${t.priority === 1 ? "p1" : ""}"><b>Prioritization rationale:</b> ${esc(t.rationale)}</div>
        ${t.priorityHistory ? `<div class="callout warnc"><b>Priority changes</b><ul class="plain">${t.priorityHistory.map((h) => `<li>${fmt(h.time)} — ${h.from ? `P${h.from} → ` : "Set "}<b>P${h.to}</b>: ${esc(h.reason)}</li>`).join("")}</ul></div>` : ""}

        <div class="grid two-col section">
          <div>
            <h3>SLA</h3>
            ${field("Response", respTxt)}
            ${field("Resolution", `${dur(s.resolve.elapsed)} / ${dur(s.resolve.target)} target — <b class="${{ met: "ok", breached: "bad", warning: "warn", paused: "warn", "on track": "ok" }[s.resolve.status]}">${s.resolve.status.toUpperCase()}</b>`)}
            ${field("Progress", slaBar(t))}
            ${field("Update cadence", tgt.update)}
          </div>
          <div>
            <h3>Escalation path</h3>
            <div class="esc-path">${path}</div>
            ${t.escalations.length ? `<ul class="esc-list">${t.escalations.map((e) => `<li><span class="tag ${e.type === "Functional" ? "esc" : "major"}">${e.type}</span> <b>${fmt(e.time)}</b> → ${esc(e.to)}<div class="muted" style="margin-top:4px">${esc(e.reason)}</div></li>`).join("")}</ul>` : `<p class="muted">Not escalated — handled within Tier 1 scope.</p>`}
          </div>
        </div>

        ${related.length ? `<div class="section"><h3>Related records</h3><ul class="plain">${related.map((r) => `<li>${r}</li>`).join("")}</ul></div>` : ""}

        <div class="section">
          <h3>Activity (work notes &amp; customer comments)</h3>
          <ul class="timeline">${t.notes.map((n) => `
            <li class="${n.type}"><div class="meta">${fmt(n.time)} · <b>${esc(n.author)}</b><span class="kind">${{ work: "Work note", comment: "Customer comment", escalation: "Escalation", system: "System" }[n.type]}</span></div>${esc(n.text)}</li>`).join("")}
          </ul>
        </div>

        ${t.resolution ? `<div class="section"><h3>Resolution information</h3>
          ${field("Resolution code", esc(t.resolution.code))}
          ${field("Resolved by", esc(t.resolution.by))}
          ${field("Resolved", fmt(t.resolved))}
          ${field("Resolution notes", esc(t.resolution.notes))}</div>` : ""}
      </div>`;
  }

  function viewNew() {
    const cats = Object.keys(CATEGORY_ROUTING);
    app.innerHTML = `
      <div class="page-head"><div><h1>Create New Incident</h1><div class="muted">Priority is calculated from Impact × Urgency — it is never picked by hand.</div></div></div>
      <div class="grid three-col">
        <form class="panel form" id="newForm" autocomplete="off">
          <div class="row"><label>Caller</label><input name="caller" required placeholder="Name (role)"></div>
          <div class="row"><label>Department</label><input name="department" required placeholder="e.g., Emergency Department"></div>
          <div class="row"><label>Category</label><select name="category">${cats.map((c) => `<option>${c}</option>`).join("")}</select></div>
          <div class="row"><label>Configuration item</label><input name="ci" placeholder="Device / application affected"></div>
          <div class="row"><label>Short description</label><input name="short" required placeholder="What is broken, for whom"></div>
          <div class="row"><label>Description</label><textarea name="description" placeholder="Symptoms, scope, what was tried, workaround"></textarea></div>
          <div class="row"><label>Impact</label><select name="impact">
            <option value="1">1 - High (department / site / many users / patient safety)</option>
            <option value="2">2 - Medium (group or team, or a critical single system)</option>
            <option value="3" selected>3 - Low (single user or device)</option></select></div>
          <div class="row"><label>Urgency</label><select name="urgency">
            <option value="1">1 - High (work stopped, no workaround, patient care affected)</option>
            <option value="2" selected>2 - Medium (degraded, workaround exists)</option>
            <option value="3">3 - Low (inconvenience, can wait)</option></select></div>
          <div class="row"><label></label><div><button class="btn btn-primary" type="submit">Submit</button></div></div>
        </form>
        <aside class="panel assist" id="assist"></aside>
      </div>`;

    const form = document.getElementById("newForm");
    const assist = document.getElementById("assist");
    const update = () => {
      const i = +form.impact.value, u = +form.urgency.value, p = priorityOf(i, u);
      const tgt = SLA_TARGETS[p];
      const route = CATEGORY_ROUTING[form.category.value];
      const activeMI = INCIDENTS.filter((t) => t.majorIncident && isOpen(t));
      assist.innerHTML = `
        <h3>Triage assistant</h3>
        <div class="muted">Calculated priority</div>
        <div class="big">${priPill(p)}</div>
        <div class="field"><label>Response target</label><div class="val">${dur(tgt.response)}</div></div>
        <div class="field"><label>Resolution target</label><div class="val">${dur(tgt.resolve)}</div></div>
        <div class="field"><label>Suggested group</label><div class="val">${esc(route.group)} <span class="muted">· T${tierOf(route.group)}</span></div></div>
        <div class="callout">${esc(route.note)}</div>
        ${p === 1 ? `<div class="callout p1"><b>P1:</b> Page the owning team now, notify Service Desk Lead / Major Incident Manager, open a bridge, update every 30 min.</div>` : ""}
        <h3 style="margin-top:14px">Before you submit</h3>
        <ul class="checklist">
          <li>Verify caller identity (SOP) before any account change</li>
          <li>Confirm scope: one user, one area, or many?</li>
          <li>Check for an active Major Incident ${activeMI.length ? `(${activeMI.map((t) => t.number).join(", ")})` : "(none open)"}</li>
          <li>Check recent changes on the affected CI</li>
          <li>Search the knowledge base for a known fix</li>
          <li>Offer a workaround and set expectations</li>
        </ul>`;
    };
    form.addEventListener("change", update);
    update();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const next = "INC" + String(Math.max(...INCIDENTS.map((t) => +t.number.slice(3))) + 1).padStart(7, "0");
      const i = +f.get("impact"), u = +f.get("urgency");
      const route = CATEGORY_ROUTING[f.get("category")];
      const nowIso = SIM_NOW;
      const t = {
        number: next, opened: nowIso, responded: nowIso, resolved: null,
        caller: f.get("caller"), department: f.get("department"), location: "—", channel: "Phone",
        category: f.get("category"), subcategory: "—", ci: f.get("ci") || "—",
        short: f.get("short"), description: f.get("description") || "—",
        impact: i, urgency: u, priority: priorityOf(i, u),
        state: route.group === "Service Desk" ? "In Progress" : "New",
        group: route.group, assignedTo: route.group === "Service Desk" ? ANALYST : "",
        rationale: `Impact ${IMPACT_LABELS[i]} × Urgency ${URGENCY_LABELS[u]} → ${PRIORITY_LABELS[priorityOf(i, u)]}.`,
        escalations: route.group === "Service Desk" ? [] : [{ time: nowIso, from: "Service Desk (T1)", to: `${route.group} (T${tierOf(route.group)})`, type: "Functional", reason: route.note }],
        notes: [{ time: nowIso, author: "System", type: "system", text: "Incident created in lab session." }],
        resolution: null,
      };
      INCIDENTS.push(t);
      location.hash = `#/incident/${next}`;
    });
  }

  function viewMatrix() {
    const cell = (i, u) => { const p = priorityOf(i, u); return `<td class="cell p${p}">P${p}<div style="font-weight:400;font-size:.78rem">${PRIORITY_LABELS[p].split(" - ")[1]}</div></td>`; };
    app.innerHTML = `
      <div class="page-head"><div><h1>Priority &amp; SLA Matrix</h1><div class="muted">ITIL model used by ServiceNow: Priority = f(Impact, Urgency)</div></div></div>
      <div class="grid two-col">
        <div class="panel">
          <h3>Impact × Urgency</h3>
          <div class="matrix-wrap"><table class="matrix">
            <tr><th></th><th colspan="3" class="axis">URGENCY →</th></tr>
            <tr><th></th><th class="axis">1 - High</th><th class="axis">2 - Medium</th><th class="axis">3 - Low</th></tr>
            ${[1, 2, 3].map((i) => `<tr><th class="axis">${i === 1 ? "IMPACT ↓<br>" : ""}${IMPACT_LABELS[i]}</th>${[1, 2, 3].map((u) => cell(i, u)).join("")}</tr>`).join("")}
          </table></div>
          <div class="section">
            <h3>How I score it</h3>
            <ul class="plain">
              <li><b>Impact</b> = how many are affected: 1 department/site/many users or patient safety · 2 a team or one critical system · 3 one user/device.</li>
              <li><b>Urgency</b> = how fast it hurts: 1 work stopped, no workaround, patient care affected · 2 degraded, workaround exists · 3 can wait.</li>
              <li>Title or seniority of the caller does <b>not</b> change priority (see INC0010008).</li>
              <li>Re-score when facts change (see INC0010004, raised P3 → P2).</li>
            </ul>
          </div>
        </div>
        <div class="panel">
          <h3>SLA targets (24×7)</h3>
          <div class="table-wrap" style="border:0"><table>
            <thead><tr><th>Priority</th><th>Response</th><th>Resolution</th><th>Customer updates</th></tr></thead>
            <tbody>${[1, 2, 3, 4, 5].map((p) => `<tr style="cursor:default"><td>${priDot(p)}</td><td>${dur(SLA_TARGETS[p].response)}</td><td>${dur(SLA_TARGETS[p].resolve)}</td><td>${SLA_TARGETS[p].update}</td></tr>`).join("")}</tbody>
          </table></div>
          <div class="section">
            <h3>Example placements from this lab</h3>
            <ul class="plain">
              ${[1, 2, 3, 4, 5].flatMap((p) => INCIDENTS.filter((t) => t.priority === p && !t.parent).slice(0, 2)).map((t) => `<li>${priDot(t.priority)} <a href="#/incident/${t.number}">${t.number}</a> — ${esc(t.short)}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>`;
  }

  function viewEscalation() {
    app.innerHTML = `
      <div class="page-head"><div><h1>Escalation Policy</h1><div class="muted">When, where, and how a ticket leaves Tier 1</div></div></div>
      <div class="grid two-col">
        <div class="panel">
          <h3>Support tiers &amp; assignment groups</h3>
          <div class="table-wrap" style="border:0"><table>
            <thead><tr><th>Group</th><th>Tier</th><th>Owns</th></tr></thead>
            <tbody>${Object.entries(GROUPS).map(([g, v]) => `<tr style="cursor:default"><td><b>${esc(g)}</b></td><td>T${v.tier}</td><td>${esc(v.desc)}</td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div class="panel">
          <h3>Two kinds of escalation</h3>
          <ul class="plain">
            <li><span class="tag esc">Functional</span> Move the ticket to the group with the <b>skills or access</b> to fix it (e.g., Epic team, Network Ops). Escalate to the <i>right</i> group, not just the next tier — INC0010009 went straight to Tier 3.</li>
            <li><span class="tag major">Hierarchical</span> Notify <b>management</b> when business risk is high: every P1, any security incident with possible PHI exposure, or an SLA about to breach.</li>
          </ul>
          <h3 style="margin-top:16px">Escalate when…</h3>
          <ul class="plain">
            <li>The fix needs access or permissions Tier 1 doesn't have (server, Epic build, network gear).</li>
            <li>A physical repair is required (failed printhead, dead access point).</li>
            <li>It's a security incident — <b>escalate immediately, don't investigate</b>.</li>
            <li>Many users/one department are affected → likely infrastructure.</li>
            <li>Runbook/KB steps are exhausted, or ~75% of the resolution SLA is used.</li>
          </ul>
          <h3 style="margin-top:16px">Every escalation includes</h3>
          <ul class="checklist">
            <li>Clear symptom and scope (who / how many / since when)</li>
            <li>What Tier 1 already tested and the results</li>
            <li>Workaround in place (if any)</li>
            <li>Screenshots, device names, error text, attachments</li>
            <li>Customer told who has it and when the next update is</li>
          </ul>
        </div>
      </div>`;
  }

  /* ---------------- router ---------------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, "") || "dashboard";
    const [view, arg] = h.split("/");
    if (view === "queue") { setActive(`queue/${arg || "all"}`); viewQueue(arg || "all"); }
    else if (view === "incident") { setActive(""); viewIncident(arg); }
    else if (view === "new") { setActive("new"); viewNew(); }
    else if (view === "matrix") { setActive("matrix"); viewMatrix(); }
    else if (view === "escalation") { setActive("escalation"); viewEscalation(); }
    else { setActive("dashboard"); viewDashboard(); }
    window.scrollTo(0, 0);
  }

  app.addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-href]");
    if (tr && !e.target.closest("a")) location.hash = tr.dataset.href;
  });
  document.getElementById("navToggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  document.getElementById("simClock").textContent = fmt(SIM_NOW) + ", 2026";
  window.addEventListener("hashchange", route);
  route();
})();
