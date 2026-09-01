/* Token Burn Dashboard — renderer.
   Loads the scrubbed aggregate in data.json and draws the calendar heatmap,
   weekly trend, drivers, recent table, and scale equivalents. No dependencies. */

const CELL = 13, GAP = 4, COL = CELL + GAP; // calendar geometry (matches CSS)
const tooltip = document.getElementById("tooltip");

// ---- formatting ------------------------------------------------------------
const fmt = (n) => {
  n = Math.round(n);
  if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 2).replace(/\.?0+$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
  return "" + n;
};
const fmtFull = (n) => Math.round(n).toLocaleString("en-US");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// parse "YYYY-MM-DD" as a local date at noon (avoids DST/TZ drift)
const parseDay = (s) => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d, 12); };
const keyOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
const addDays = (dt, n) => { const x = new Date(dt); x.setDate(x.getDate()+n); return x; };
const fmtDate = (dt, withYear) => `${MONTHS[dt.getMonth()]} ${dt.getDate()}${withYear ? ", "+dt.getFullYear() : ""}`;

// ---- tooltip ---------------------------------------------------------------
function showTip(html, x, y) {
  tooltip.innerHTML = html;
  tooltip.dataset.visible = "true";
  tooltip.style.left = x + "px";
  tooltip.style.top = (y - 12) + "px";
}
const hideTip = () => { tooltip.dataset.visible = "false"; };

// ---- state -----------------------------------------------------------------
let DATA = null;
// initial range from ?range= (90 | 180 | 365 | all), default 180
let range = (new URLSearchParams(location.search).get("range") || "180");
if (!["90", "180", "365", "all"].includes(range)) range = "180";

// measured math uses exact lanes only; estimate lanes render but never sum in.
const exactLanes = () => DATA.lanes.filter((l) => l.fidelity === "exact");
const estimateLanes = () => DATA.lanes.filter((l) => l.fidelity !== "exact");

// total per day across exact lanes, for a given window
function rangeBounds() {
  const today = parseDay(latestDay());
  if (range === "all") return [parseDay(earliestDay()), today];
  const days = Number(range);
  return [addDays(today, -days + 1), today];
}
function latestDay() {
  // anchor "today" to real measured data, not the estimate's weekly spread
  let max = null;
  for (const l of exactLanes()) if (l.lastDay && (!max || l.lastDay > max)) max = l.lastDay;
  return max || keyOf(new Date());
}
function earliestDay() {
  let min = null;
  for (const l of DATA.lanes) if (l.firstDay && (!min || l.firstDay < min)) min = l.firstDay;
  return min || latestDay();
}

// ---- log color level (0 empty, 1..5) --------------------------------------
function makeLeveler(values) {
  const nz = values.filter((v) => v > 0);
  if (!nz.length) return () => 0;
  const lo = Math.log(Math.min(...nz)), hi = Math.log(Math.max(...nz));
  const span = hi - lo || 1;
  return (v) => v <= 0 ? 0 : Math.min(5, 1 + Math.floor(((Math.log(v) - lo) / span) * 4.999));
}

// ---- calendar heatmap (one row per lane) -----------------------------------
function renderCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  const [start, end] = rangeBounds();

  // align grid to weeks: start on the Sunday on/before `start`
  const gridStart = addDays(start, -((start.getDay()) % 7));
  const weeks = Math.ceil((end - gridStart) / (7 * 864e5)) + 1;
  const gridW = weeks * COL;

  // ----- month label row -----
  cal.appendChild(document.createElement("div")); // spacer over row labels
  const monthRow = document.createElement("div");
  monthRow.className = "month-labels";
  monthRow.style.width = gridW + "px";
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const d = addDays(gridStart, w * 7);
    if (d.getMonth() !== lastMonth && d >= start) {
      lastMonth = d.getMonth();
      const lab = document.createElement("span");
      lab.className = "month-label";
      lab.style.left = (w * COL) + "px";
      lab.textContent = MONTHS[d.getMonth()];
      monthRow.appendChild(lab);
    }
  }
  cal.appendChild(monthRow);

  // ----- weekly total spark (sum of exact lanes per week, log y) -----
  const weeklyTotals = [];
  for (let w = 0; w < weeks; w++) {
    let sum = 0;
    for (let dow = 0; dow < 7; dow++) {
      const d = addDays(gridStart, w * 7 + dow);
      if (d < start || d > end) continue;
      const k = keyOf(d);
      for (const l of exactLanes()) sum += (l.byDay[k] || 0);
    }
    weeklyTotals.push(sum);
  }
  const wkLabel = document.createElement("div");
  wkLabel.className = "weekly-label";
  wkLabel.innerHTML = `<strong>Weekly total</strong><span>log y-scale</span>`;
  cal.appendChild(wkLabel);
  cal.appendChild(sparkRow(weeklyTotals, gridW, gridStart, start, end));

  // ----- one heatmap row per lane -----
  const rows = document.createElement("div");
  rows.id = "heatmapRows";
  const allDayVals = [];
  for (const l of DATA.lanes) for (const k in l.byDay) allDayVals.push(l.byDay[k]);
  const level = makeLeveler(allDayVals);
  const todayKey = keyOf(new Date(latestDay().replace(/-/g, "/")));

  for (const lane of DATA.lanes) {
    const label = document.createElement("div");
    label.className = "heatmap-row-label";
    const fidTag = lane.fidelity === "exact" ? "exact" : "estimate ~";
    label.innerHTML = `<strong>${lane.label}</strong><span>${fidTag}${fmt(laneTotalInRange(lane, start, end))}</span>`;
    rows.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "heatmap-grid";
    grid.style.width = gridW + "px";
    for (let w = 0; w < weeks; w++) {
      for (let dow = 0; dow < 7; dow++) {
        const d = addDays(gridStart, w * 7 + dow);
        const cell = document.createElement("button");
        cell.className = "day";
        cell.type = "button";
        if (d < start || d > end) { cell.style.visibility = "hidden"; grid.appendChild(cell); continue; }
        const k = keyOf(d);
        const v = lane.byDay[k] || 0;
        cell.dataset.level = level(v);
        if (k === latestDay()) cell.dataset.today = "true";
        const dd = d, vv = v, ll = lane;
        cell.addEventListener("mouseenter", (e) => {
          const r = e.target.getBoundingClientRect();
          showTip(
            `<div class="tooltip-title">${fmtDate(dd, true)}</div>` +
            `<div class="tooltip-grid"><span>${ll.label}</span><strong>${vv ? fmtFull(vv) : "—"}</strong></div>`,
            r.left + r.width / 2, r.top
          );
        });
        cell.addEventListener("mouseleave", hideTip);
        grid.appendChild(cell);
      }
    }
    rows.appendChild(grid);
  }
  cal.appendChild(rows);

  document.getElementById("activeDaysNote").textContent =
    `${countActiveDays(start, end)} active days · ${fmtDate(start, true)} → ${fmtDate(end, true)}`;
}

function sparkRow(weeklyTotals, gridW, gridStart, start, end) {
  const wrap = document.createElement("div");
  wrap.className = "weekly-spark-wrap";
  const H = 42, pad = 4;
  const nz = weeklyTotals.filter((v) => v > 0);
  const lo = nz.length ? Math.log(Math.min(...nz)) : 0;
  const hi = nz.length ? Math.log(Math.max(...nz)) : 1;
  const span = hi - lo || 1;
  const y = (v) => v <= 0 ? H - pad : (H - pad) - ((Math.log(v) - lo) / span) * (H - 2 * pad);
  const x = (w) => w * COL + CELL / 2;
  const pts = weeklyTotals.map((v, w) => [x(w), y(v)]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  const area = pts.length
    ? `M${pts[0][0].toFixed(1)} ${H - pad} ` + pts.map((p) => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + ` L${last[0].toFixed(1)} ${H - pad} Z`
    : "";
  wrap.innerHTML =
    `<svg class="weekly-spark" viewBox="0 0 ${gridW} ${H}" preserveAspectRatio="none" style="width:${gridW}px">` +
    `<defs><linearGradient id="wkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.30"></stop><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"></stop></linearGradient></defs>` +
    `<line class="weekly-baseline" x1="0" y1="${H - pad}" x2="${gridW}" y2="${H - pad}"></line>` +
    `<path d="${area}" fill="url(#wkFill)" stroke="none"></path>` +
    `<path class="weekly-line" d="${path}"></path>` +
    (last ? `<circle class="weekly-point" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.6"></circle>` : "") +
    `</svg>`;
  return wrap;
}

// ---- helpers over a window -------------------------------------------------
// generic: sum a {day: tokens} map within [start,end]. Used for lane totals,
// per-model totals, and per-project totals alike (all serialize a byDay map).
function sumDayMapInRange(dayMap, start, end) {
  let t = 0;
  for (const k in dayMap) { const d = parseDay(k); if (d >= start && d <= end) t += dayMap[k]; }
  return t;
}
// busiest single day within [start,end] for a {day: tokens} map, or null.
function peakInRange(dayMap, start, end) {
  let day = null, tokens = 0;
  for (const k in dayMap) {
    const d = parseDay(k); if (d < start || d > end) continue;
    if (dayMap[k] > tokens) { tokens = dayMap[k]; day = k; }
  }
  return day ? { day, tokens } : null;
}
function activeDaysInRange(dayMap, start, end) {
  let n = 0;
  for (const k in dayMap) { const d = parseDay(k); if (d >= start && d <= end && dayMap[k] > 0) n++; }
  return n;
}
function laneTotalInRange(lane, start, end) {
  return sumDayMapInRange(lane.byDay, start, end);
}
function measuredTotalInRange(start, end) {
  return exactLanes().reduce((s, l) => s + laneTotalInRange(l, start, end), 0);
}
function countActiveDays(start, end) {
  const days = new Set();
  for (const l of exactLanes()) for (const k in l.byDay) { const d = parseDay(k); if (d >= start && d <= end && l.byDay[k] > 0) days.add(k); }
  return days.size;
}
function dailySeriesInRange(start, end) {
  const map = {};
  for (const l of exactLanes()) for (const k in l.byDay) { const d = parseDay(k); if (d >= start && d <= end) map[k] = (map[k] || 0) + l.byDay[k]; }
  return map;
}

// ---- now strip (headline measures) -----------------------------------------
function renderNowStrip() {
  const [start, end] = rangeBounds();
  const today = latestDay();
  const series = dailySeriesInRange(start, end);
  const last7 = sumLastDays(7), last30 = sumLastDays(30);
  let peakDay = null, peakVal = 0;
  for (const k in series) if (series[k] > peakVal) { peakVal = series[k]; peakDay = k; }

  const measures = [
    { label: "Measured total in range", value: fmt(measuredTotalInRange(start, end)), note: `${exactLanes().map(l => l.label).join(" + ")} · exact` },
    { label: "Day to date", value: fmt(series[today] || 0), note: fmtDate(parseDay(today), true) },
    { label: "Last 7 days", value: fmt(last7), note: "rolling" },
    { label: "Last 30 days", value: fmt(last30), note: "rolling" },
    { label: "Peak day in range", value: fmt(peakVal), note: peakDay ? fmtDate(parseDay(peakDay), true) : "—" },
    { label: "Est. chat band", value: DATA.estimate.conversations ? `~${fmt(DATA.estimate.low)}–${fmt(DATA.estimate.high)}` : "not counted", note: "ChatGPT · floor estimate, never summed" },
    { label: "API cost equivalent", value: DATA.estimatedCostUsd ? "$" + DATA.estimatedCostUsd.toLocaleString() : "—", note: "Claude Code · at published Anthropic rates" },
  ];
  const strip = document.getElementById("nowStrip");
  strip.innerHTML = measures.map((m) =>
    `<div class="now-measure"><div class="now-label">${m.label}</div>` +
    `<div class="now-value">${m.value}</div><div class="now-note">${m.note}</div></div>`
  ).join("");
}
function sumLastDays(n) {
  const end = parseDay(latestDay());
  const start = addDays(end, -n + 1);
  return measuredTotalInRange(start, end);
}

// ---- drivers (breakdown by tool + project) ---------------------------------
function fmtModel(key) {
  // "claude-opus-4-8" → "Opus 4.8", "codex:gpt-5-codex" → "GPT-5 Codex", etc.
  const k = key.replace(/^codex:/, "");
  if (k.startsWith("claude-")) {
    const rest = k.slice(7); // strip "claude-"
    // strip date suffix like -20251001
    const clean = rest.replace(/-\d{8}$/, "");
    // "opus-4-8" → "Opus 4.8"
    return clean.replace(/-(\d+)-(\d+)$/, " $1.$2")
      .replace(/^(\w)/, (c) => c.toUpperCase())
      .replace(/-(\w)/, (_, c) => " " + c.toUpperCase());
  }
  // GPT models: "gpt-5-codex" → "GPT-5 Codex"
  return k.replace(/^gpt-/, "GPT-").replace(/-(\w)/g, (_, c) => " " + c.toUpperCase());
}

// Driver ("work-family") categories = tracked project directories, the most
// defensible real grouping available — the logs carry no session-content or
// topic field, so this deliberately does NOT infer a task-type/topic taxonomy.
// Evidence lines below are real per-project facts (peak day, active-day count)
// pulled straight from each project's own byDay map, never invented.
function renderBreakdown() {
  const [start, end] = rangeBounds();
  const total = measuredTotalInRange(start, end) || 1;
  const rangeDays = Math.round((end - start) / 86400000) + 1;
  // Build groups (lane header + its sub-rows) then sort groups by lane total.
  // This keeps models and projects visually under their parent lane.
  const groups = [];
  for (const lane of DATA.lanes) {
    const laneTotal = laneTotalInRange(lane, start, end);
    if (laneTotal <= 0) continue;
    const est = lane.fidelity !== "exact";
    const header = { name: lane.label, note: `${lane.fidelity} · ${lane.sessions} ${est ? "conversations" : "sessions"}`, tokens: laneTotal, spark: weeklySpark(lane, start, end), bold: true, est };
    // range-filter every project this lane tracked, then keep the top 4 by
    // in-range volume (not lifetime volume — a project quiet in this window
    // shouldn't crowd out one that's actually active in it).
    const projRows = (lane.byProject || [])
      .filter((p) => p.key !== lane.name)
      .map((p) => {
        const hasDay = p.byDay && Object.keys(p.byDay).length > 0;
        const rangeTokens = hasDay ? sumDayMapInRange(p.byDay, start, end) : p.tokens;
        const peak = hasDay ? peakInRange(p.byDay, start, end) : (p.peakDay ? { day: p.peakDay, tokens: p.peakTokens } : null);
        const active = hasDay ? activeDaysInRange(p.byDay, start, end) : null;
        return { p, rangeTokens, peak, active };
      })
      .filter((r) => r.rangeTokens > 0)
      .sort((a, b) => b.rangeTokens - a.rangeTokens)
      .slice(0, 4);
    const subs = projRows.map(({ p, rangeTokens, peak, active }) => {
      const evidence = peak
        ? `peak ${fmtDate(parseDay(peak.day))}: ${fmt(peak.tokens)} tokens${active != null ? ` · active ${active}/${rangeDays}d in range` : ""}`
        : (active != null ? `active ${active}/${rangeDays}d in range` : "");
      return { name: p.key, note: "project", evidence, tokens: rangeTokens, indent: true, est };
    });
    groups.push({ header, subs, laneTotal });
  }
  groups.sort((a, b) => b.laneTotal - a.laneTotal);
  const body = document.getElementById("breakdownBody");
  body.innerHTML = groups.map((g) => {
    const r = g.header;
    const share = (r.tokens / total) * 100;
    const sharePct = Math.max(0, Math.min(100, share)).toFixed(0);
    const shareCell = r.est
      ? `<span class="muted">est.</span>`
      : `<div class="share-cell"><div class="share-track"><div class="share-dot" style="--share:${sharePct}%"></div></div><span>${share < 1 ? "<1" : sharePct}%</span></div>`;
    const headerRow = `<tr>
      <td><div class="tool-name">${r.name}</div><div class="tool-note">${r.note}</div></td>
      <td>${r.spark || ""}</td>
      <td>${shareCell}</td>
      <td>${fmt(r.tokens)}</td>
    </tr>`;
    const subRows = g.subs.map((s) => {
      const ss = (s.tokens / total) * 100;
      const ssPct = Math.max(0, Math.min(100, ss)).toFixed(0);
      const subShare = s.est
        ? `<span class="muted">est.</span>`
        : `<div class="share-cell"><div class="share-track"><div class="share-dot" style="--share:${ssPct}%"></div></div><span>${ss < 1 ? "<1" : ssPct}%</span></div>`;
      return `<tr>
        <td><div class="tool-name" style="font-weight:500;padding-left:14px">${s.name}</div><div class="tool-note">${s.note}</div>${s.evidence ? `<div class="tool-evidence">${s.evidence}</div>` : ""}</td>
        <td></td>
        <td>${subShare}</td>
        <td>${s.est ? "~" : ""}${fmt(s.tokens)}</td>
      </tr>`;
    }).join("");
    return headerRow + subRows;
  }).join("");
}
function weeklySpark(lane, start, end) {
  // mini sparkline of this lane's weekly totals within range
  const weeks = {};
  for (const k in lane.byDay) {
    const d = parseDay(k); if (d < start || d > end) continue;
    const monday = addDays(d, -((d.getDay() + 6) % 7));
    weeks[keyOf(monday)] = (weeks[keyOf(monday)] || 0) + lane.byDay[k];
  }
  const vals = Object.keys(weeks).sort().map((k) => weeks[k]);
  if (vals.length < 2) return "";
  const max = Math.max(...vals) || 1;
  const W = 118, H = 26;
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - (v / max) * (H - 4) - 2]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return `<svg class="spark" viewBox="0 0 ${W} ${H}"><line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}"></line><path d="${d}"></path></svg>`;
}

// ---- trend panels (7d / 30d moving avg, cumulative) ------------------------
function renderTrend() {
  const [start, end] = rangeBounds();
  const series = dailySeriesInRange(start, end);
  const days = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) days.push({ k: keyOf(d), v: series[keyOf(d)] || 0 });
  const movAvg = (win) => days.map((_, i) => {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - win + 1); j <= i; j++) { s += days[j].v; c++; }
    return s / (c || 1);
  });
  let run = 0; const cum = days.map((d) => (run += d.v));
  const panels = [
    { title: "7-day average", series: movAvg(7), fmtLast: (s) => fmt(s[s.length - 1] || 0) + "/day" },
    { title: "30-day average", series: movAvg(30), fmtLast: (s) => fmt(s[s.length - 1] || 0) + "/day" },
    { title: "Cumulative", series: cum, fmtLast: (s) => fmt(s[s.length - 1] || 0) },
  ];
  document.getElementById("trendGrid").innerHTML = panels.map((p) => trendPanel(p)).join("");
}
let trendGradId = 0;
function trendPanel({ title, series, fmtLast }) {
  const W = 300, H = 104, pad = 6;
  const max = Math.max(...series, 1);
  const pts = series.map((v, i) => [pad + (i / Math.max(1, series.length - 1)) * (W - 2 * pad), H - pad - (v / max) * (H - 2 * pad)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const gid = "tf" + (trendGradId++);
  const area = pts.length
    ? `M${pts[0][0].toFixed(1)} ${(H - pad)} ` + pts.map((p) => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + ` L${pts[pts.length - 1][0].toFixed(1)} ${(H - pad)} Z`
    : "";
  return `<div class="trend-panel">
    <div class="trend-panel-head"><strong>${title}</strong><span class="muted">${fmtLast(series)}</span></div>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.32"></stop>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"></stop>
      </linearGradient></defs>
      <line x1="0" y1="${H - pad}" x2="${W}" y2="${H - pad}"></line>
      <path d="${area}" fill="url(#${gid})" stroke="none"></path>
      <path class="main" d="${d}"></path>
    </svg>
  </div>`;
}

// ---- recent days table -------------------------------------------------
// Granular per-day view: exact lanes (Claude Code, Codex) get their own
// columns plus an exact-only Total; ChatGPT is split into its real fidelity
// sub-tiers (text-tokenized / dated-fallback / manual activity — whichever
// ones this machine's data actually has) rather than one blended estimate
// number. Exact and estimated cells are styled distinctly and never merged.
const SUBTIER_LABEL = { text: "ChatGPT — text est.", dated: "ChatGPT — dated est.", manual: "ChatGPT — manual est." };
const SUBTIER_ORDER = ["text", "dated", "manual"];

function renderRecent() {
  const dayMap = {}; // k -> {claude-code, codex, chatgpt}
  for (const lane of DATA.lanes) for (const k in lane.byDay) {
    dayMap[k] = dayMap[k] || {};
    dayMap[k][lane.name] = lane.byDay[k];
  }
  const gptLane = DATA.lanes.find((l) => l.name === "chatgpt");
  const subDay = (gptLane && gptLane.bySubDay) || {};
  // only show a sub-tier column if it actually has data somewhere — an unused
  // tier (e.g. no manual activity.json ever filled in) shouldn't clutter the table
  const activeTiers = SUBTIER_ORDER.filter((t) => Object.values(subDay).some((m) => (m[t] || 0) > 0));
  const showCombined = activeTiers.length > 1; // 2+ real tiers -> also show their (still-estimate) sum

  const headEl = document.getElementById("recentHead");
  if (headEl) {
    const cols = ["Date", "Claude Code (exact)", "Codex (exact)", "Total (exact)"]
      .concat(activeTiers.map((t) => SUBTIER_LABEL[t]))
      .concat(showCombined ? ["ChatGPT total (est.)"] : []);
    headEl.innerHTML = cols.map((c) => `<th>${c}</th>`).join("");
  }

  const keys = Object.keys(dayMap).sort().reverse().slice(0, 14);
  document.getElementById("recentBody").innerHTML = keys.map((k) => {
    const cc = dayMap[k]["claude-code"] || 0, cx = dayMap[k]["codex"] || 0;
    const sub = subDay[k] || {};
    const tierCells = activeTiers.map((t) => {
      const v = sub[t] || 0;
      return `<td class="estimate-cell">${v ? "~" + fmt(v) : "—"}</td>`;
    }).join("");
    const combinedCell = showCombined
      ? (() => { const v = activeTiers.reduce((s, t) => s + (sub[t] || 0), 0); return `<td class="estimate-cell">${v ? "~" + fmt(v) : "—"}</td>`; })()
      : "";
    return `<tr>
      <td>${fmtDate(parseDay(k), true)}</td>
      <td class="exact-cell">${cc ? fmt(cc) : "—"}</td>
      <td class="exact-cell">${cx ? fmt(cx) : "—"}</td>
      <td class="exact-cell"><strong>${fmt(cc + cx)}</strong></td>
      ${tierCells}${combinedCell}
    </tr>`;
  }).join("");
}

// ---- scale equivalents (Fermi) ----------------------------------------
// These are rough order-of-magnitude TRANSLATIONS, not measured utility,
// billing, or environmental accounting. Every factor is stated inline in the
// "Basis" column so nothing here is presented as a fact the way the exact
// lanes are — they're for intuition about scale, and only that.
function renderEquivalents() {
  const [start, end] = rangeBounds();
  const total = measuredTotalInRange(start, end);
  const words = total * 0.75;              // ~0.75 words / token
  const books = words / 90000;             // ~90k words / novel
  const linesOfCode = total / 12;          // ~12 tokens / line (denser than prose: syntax, indentation)
  const energyKwh = (total * 0.0004) / 1000; // ~0.0004 Wh/token, rough blended inference-energy order-of-magnitude
  const waterL = energyKwh * 1.8;          // ~1.8 L/kWh, rough datacenter-cooling order-of-magnitude
  const rows = [
    { m: "Tokens (measured)", e: fmtFull(total), b: "Claude Code + Codex, exact" },
    { m: "≈ Words", e: fmt(words), b: "~0.75 words per token — rough translation, not measured" },
    { m: "≈ Novels", e: books < 10 ? books.toFixed(1) : Math.round(books).toLocaleString("en-US"), b: "~90,000 words each — rough translation, not measured" },
    { m: "≈ Lines of code", e: fmt(linesOfCode), b: "~12 tokens per line, if this were all code — rough translation, not measured" },
    { m: "≈ Electricity", e: energyKwh < 1 ? energyKwh.toFixed(2) + " kWh" : fmt(energyKwh) + " kWh", b: "~0.0004 Wh/token, order-of-magnitude inference-energy guess — NOT a measured/billed figure, varies hugely by model & hardware" },
    { m: "≈ Water", e: waterL < 1 ? waterL.toFixed(2) + " L" : fmt(waterL) + " L", b: "~1.8 L per kWh, order-of-magnitude datacenter-cooling guess — NOT a measured/billed figure" },
    { m: "Sessions", e: fmtFull(DATA.lanes.reduce((s, l) => s + l.sessions, 0)), b: "distinct conversations" },
  ];
  document.getElementById("equivBody").innerHTML = rows.map((r) =>
    `<tr><td>${r.m}</td><td>${r.e}</td><td class="muted">${r.b}</td></tr>`
  ).join("");
}

// ---- work phases (tool-action classification) ------------------------------
const PHASE_COLORS = { plan: "#3b82f6", code: "#10b981", docs: "#a855f7", test: "#ef4444", ops: "#94a3b8" };
const PHASE_LABEL = { plan: "Plan / explore", code: "Code", docs: "Docs / spec", test: "Test / verify", ops: "Ops / run" };
// ---- model mix -------------------------------------------------------------
const MODEL_COLORS = ["#f59e0b", "#34d6f0", "#f97316", "#6366f1", "#94a3b8"];

function renderModelMix() {
  const lane = (DATA.lanes || []).find((l) => l.name === "claude-code");
  const barEl = document.getElementById("modelBar");
  const legEl = document.getElementById("modelLegend");
  const intEl = document.getElementById("modelIntensity");
  if (!lane || !barEl) return;
  const [start, end] = rangeBounds();
  // range-filter using each model's own per-day map, same window as everything
  // else the range control drives — falls back to the lifetime total only if
  // a data.json predates the byDay-per-model field (older build, still readable).
  const models = (lane.byModel || [])
    .map((m) => ({ ...m, rangeTokens: m.byDay && Object.keys(m.byDay).length ? sumDayMapInRange(m.byDay, start, end) : m.tokens }))
    .filter((m) => m.rangeTokens > 0);
  const total = models.reduce((s, m) => s + m.rangeTokens, 0) || 1;

  barEl.innerHTML = models.map((m, i) => {
    const pct = m.rangeTokens / total * 100;
    if (pct < 0.5) return "";
    const color = MODEL_COLORS[i] || MODEL_COLORS[MODEL_COLORS.length - 1];
    const label = fmtModel(m.key);
    return `<div class="phase-seg" style="width:${pct}%;background:${color}" title="${label} — ${pct.toFixed(0)}% (${fmt(m.rangeTokens)})">${pct >= 10 ? label + " " + pct.toFixed(0) + "%" : ""}</div>`;
  }).join("");

  legEl.innerHTML = models.filter((m) => m.rangeTokens / total * 100 >= 0.5).map((m, i) => {
    const pct = m.rangeTokens / total * 100;
    const color = MODEL_COLORS[i] || MODEL_COLORS[MODEL_COLORS.length - 1];
    return `<span class="phase-leg"><span class="phase-sw" style="background:${color}"></span>${fmtModel(m.key)} <strong>${pct.toFixed(0)}%</strong> <span class="muted">${fmt(m.rangeTokens)}</span></span>`;
  }).join("");

  // active-day count clipped to the selected range (not the model's lifetime span)
  const rates = models.map((m) => {
    const days = m.byDay ? activeDaysInRange(m.byDay, start, end) : 0;
    return days ? m.rangeTokens / days : 0;
  });
  const maxRate = Math.max(...rates, 1);
  intEl.innerHTML = models.map((m, i) => {
    const days = m.byDay ? activeDaysInRange(m.byDay, start, end) : 0;
    if (!days) return "";
    const rate = m.rangeTokens / days;
    const pct = rate / maxRate * 100;
    const color = MODEL_COLORS[i] || MODEL_COLORS[MODEL_COLORS.length - 1];
    return `<div class="mdl-int-row">
      <span class="mdl-int-label">${fmtModel(m.key)}</span>
      <div class="mdl-int-wrap"><div class="mdl-int-bar" style="width:${pct}%;background:${color}"></div></div>
      <span class="mdl-int-val">${fmt(Math.round(rate))}/day · ${days}d active in range</span>
    </div>`;
  }).filter(Boolean).join("");
}

function renderPhases() {
  const ph = DATA.phases;
  const bar = document.getElementById("phaseBar");
  const legend = document.getElementById("phaseLegend");
  const wkEl = document.getElementById("phaseWeeks");
  if (!ph || !bar) { return; }
  const order = (ph.order || Object.keys(ph.total || {})).filter((p) => PHASE_COLORS[p]);
  const [start, end] = rangeBounds();
  // sum within range from the weekly breakdown (so it tracks the range toggle)
  const weeks = Object.keys(ph.byWeek || {}).filter((w) => { const d = parseDay(w); return d >= addDays(start, -6) && d <= end; }).sort();
  const totals = {}; order.forEach((p) => totals[p] = 0);
  for (const w of weeks) { const m = ph.byWeek[w] || {}; for (const p of order) totals[p] += (m[p] || 0); }
  const grand = order.reduce((s, p) => s + totals[p], 0) || 1;

  bar.innerHTML = order.map((p) => {
    const pct = totals[p] / grand * 100;
    if (pct <= 0) return "";
    return `<div class="phase-seg" style="width:${pct}%;background:${PHASE_COLORS[p]}" title="${PHASE_LABEL[p]} — ${pct.toFixed(0)}% (${totals[p].toLocaleString()})">${pct >= 9 ? PHASE_LABEL[p].split(" ")[0] + " " + pct.toFixed(0) + "%" : ""}</div>`;
  }).join("");

  legend.innerHTML = order.map((p) => {
    const pct = totals[p] / grand * 100;
    return `<span class="phase-leg"><span class="phase-sw" style="background:${PHASE_COLORS[p]}"></span>${PHASE_LABEL[p]} <strong>${pct.toFixed(0)}%</strong> <span class="muted">${totals[p].toLocaleString()}</span></span>`;
  }).join("");

  // per-week normalized stacked bars (shows how the MIX shifts over time)
  wkEl.innerHTML = weeks.map((w) => {
    const m = ph.byWeek[w] || {};
    const tot = order.reduce((s, p) => s + (m[p] || 0), 0) || 1;
    const segs = order.map((p) => { const h = (m[p] || 0) / tot * 100; return h > 0 ? `<div style="height:${h}%;background:${PHASE_COLORS[p]}"></div>` : ""; }).join("");
    return `<div class="phase-week" title="week of ${w} · ${tot} actions">${segs}</div>`;
  }).join("");
}

// ---- spec verification -----------------------------------------------------
function renderVerify() {
  const v = DATA.verification;
  const el = document.getElementById("verifyStats");
  if (!v || !el) return;
  const [start, end] = rangeBounds();
  const weeks = Object.keys(v.byWeek || {}).filter((w) => { const d = parseDay(w); return d >= addDays(start, -6) && d <= end; }).sort();
  let runs = 0, passed = 0, failed = 0;
  for (const w of weeks) { const x = v.byWeek[w]; runs += x.runs; passed += x.passed; failed += x.failed; }
  const decided = passed + failed;
  const pr = decided > 0 ? Math.round(passed / decided * 100) : null;
  const sc = v.specCoverage;
  const tiles = [
    { label: "Verify runs", value: runs.toLocaleString(), note: "captured in logs" },
    { label: "Pass rate", value: pr != null ? pr + "%" : "—", note: `${passed.toLocaleString()} pass · ${failed.toLocaleString()} fail` },
    { label: "Spec coverage", value: sc ? "~" + sc.avgPct + "%" : "—", note: sc ? `${sc.over80}/${sc.samples} runs ≥80% (overall)` : "no X/Y lines captured" },
  ];
  el.innerHTML = tiles.map((t) => `<div class="verify-tile"><div class="now-label">${t.label}</div><div class="verify-val">${t.value}</div><div class="now-note">${t.note}</div></div>`).join("");
  document.getElementById("verifyWeeks").innerHTML = weeks.map((w) => {
    const x = v.byWeek[w]; const tot = (x.passed + x.failed) || 1;
    return `<div class="phase-week" title="week of ${w} · ${x.runs} runs · ${x.passed} pass / ${x.failed} fail"><div style="height:${x.failed / tot * 100}%;background:#ef4444"></div><div style="height:${x.passed / tot * 100}%;background:#10b981"></div></div>`;
  }).join("");
}

// ---- orchestration ---------------------------------------------------------
function renderAll() {
  renderNowStrip();
  renderCalendar();
  renderBreakdown();
  renderModelMix();
  renderPhases();
  renderVerify();
  renderTrend();
  renderRecent();
  renderEquivalents();
}

document.getElementById("rangeControls").addEventListener("click", (e) => {
  const btn = e.target.closest("button"); if (!btn) return;
  range = btn.dataset.range;
  for (const b of e.currentTarget.querySelectorAll("button")) b.removeAttribute("aria-pressed");
  btn.setAttribute("aria-pressed", "true");
  renderAll();
});

fetch("data.json")
  .then((r) => r.json())
  .then((d) => {
    DATA = d;
    // personalize the title from local config (generic in the repo / public build)
    if (d.owner) {
      const t = `${d.owner}'s AI Token Burn`;
      document.title = t;
      const h = document.getElementById("pageTitle"); if (h) h.textContent = t;
    }
    // reflect the initial range on the control buttons
    for (const b of document.querySelectorAll("#rangeControls button")) {
      if (b.dataset.range === range) b.setAttribute("aria-pressed", "true");
      else b.removeAttribute("aria-pressed");
    }
    const gen = new Date(d.generatedAt);
    document.getElementById("updated").textContent =
      `Updated ${fmtDate(gen, true)} · ${DATA.lanes.map(l => `${l.label} ${fmt(l.total)}`).join(" · ")}`;
    renderAll();
  })
  .catch((err) => {
    document.querySelector("main").insertAdjacentHTML("afterbegin",
      `<p style="color:#b00">Could not load data.json — run <code>node build/parse.mjs</code> first. (${err})</p>`);
  });
