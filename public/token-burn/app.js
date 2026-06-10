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
function laneTotalInRange(lane, start, end) {
  let t = 0;
  for (const k in lane.byDay) { const d = parseDay(k); if (d >= start && d <= end) t += lane.byDay[k]; }
  return t;
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
function renderBreakdown() {
  const [start, end] = rangeBounds();
  const total = measuredTotalInRange(start, end) || 1;
  const rows = [];
  for (const lane of DATA.lanes) {
    const laneTotal = laneTotalInRange(lane, start, end);
    if (laneTotal <= 0) continue;
    const est = lane.fidelity !== "exact";
    rows.push({ name: lane.label, note: `${lane.fidelity} · ${lane.sessions} ${est ? "conversations" : "sessions"}`, tokens: laneTotal, spark: weeklySpark(lane, start, end), bold: true, est });
    // top projects within the lane
    const projs = (lane.byProject || []).slice(0, 4);
    for (const p of projs) {
      if (p.tokens <= 0 || p.key === lane.name) continue;
      rows.push({ name: p.key, note: "project", tokens: p.tokens, indent: true, est });
    }
  }
  rows.sort((a, b) => (b.bold === a.bold ? b.tokens - a.tokens : (b.bold ? 1 : -1)));
  const body = document.getElementById("breakdownBody");
  body.innerHTML = rows.map((r) => {
    const share = ((r.tokens / total) * 100);
    const sharePct = Math.max(0, Math.min(100, share)).toFixed(0);
    const shareCell = r.est
      ? `<span class="muted">est.</span>`
      : `<div class="share-cell"><div class="share-track"><div class="share-dot" style="--share:${sharePct}%"></div></div><span>${share < 1 ? "<1" : sharePct}%</span></div>`;
    return `<tr>
      <td><div class="tool-name"${r.indent ? ' style="font-weight:500;padding-left:14px"' : ''}>${r.name}</div><div class="tool-note">${r.note}</div></td>
      <td>${r.spark || ""}</td>
      <td>${shareCell}</td>
      <td>${r.est ? "~" : ""}${fmt(r.tokens)}</td>
    </tr>`;
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

// ---- recent days table -----------------------------------------------------
function renderRecent() {
  const dayMap = {}; // k -> {claude, codex}
  for (const lane of DATA.lanes) for (const k in lane.byDay) {
    dayMap[k] = dayMap[k] || {};
    dayMap[k][lane.name] = lane.byDay[k];
  }
  const keys = Object.keys(dayMap).sort().reverse().slice(0, 14);
  document.getElementById("recentBody").innerHTML = keys.map((k) => {
    const cc = dayMap[k]["claude-code"] || 0, cx = dayMap[k]["codex"] || 0, gp = dayMap[k]["chatgpt"] || 0;
    return `<tr><td>${fmtDate(parseDay(k), true)}</td><td>${fmt(cc + cx)}</td><td>${cc ? fmt(cc) : "—"}</td><td>${cx ? fmt(cx) : "—"}</td><td class="muted">${gp ? "~" + fmt(gp) : "—"}</td></tr>`;
  }).join("");
}

// ---- scale equivalents (Fermi) ---------------------------------------------
function renderEquivalents() {
  const [start, end] = rangeBounds();
  const total = measuredTotalInRange(start, end);
  const words = total * 0.75;            // ~0.75 words / token
  const books = words / 90000;           // ~90k words / novel
  const kjEnergy = total / 1000 * 0.3;   // rough order-of-magnitude inference energy
  const rows = [
    { m: "Tokens (measured)", e: fmtFull(total), b: "Claude Code + Codex, exact" },
    { m: "≈ Words", e: fmt(words), b: "~0.75 words per token" },
    { m: "≈ Novels", e: books.toFixed(books < 10 ? 1 : 0), b: "~90,000 words each" },
    { m: "Sessions", e: fmtFull(DATA.lanes.reduce((s, l) => s + l.sessions, 0)), b: "distinct conversations" },
  ];
  document.getElementById("equivBody").innerHTML = rows.map((r) =>
    `<tr><td>${r.m}</td><td>${r.e}</td><td class="muted">${r.b}</td></tr>`
  ).join("");
}

// ---- orchestration ---------------------------------------------------------
function renderAll() {
  renderNowStrip();
  renderCalendar();
  renderBreakdown();
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
