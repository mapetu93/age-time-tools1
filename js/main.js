// AgeTimeTools main.js — all tools (Age + Time)
// Works with static HTML pages using data-tool attributes.

// ---------- Basic helpers ----------
function pad2(n){ return String(n).padStart(2, "0"); }

function toISODate(d){
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function clampDateInputValue(el, value){
  if (!el) return;
  el.value = value;
}

function diffYMD(from, to){
  // from <= to assumed
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0){
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0){
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

function daysBetween(from, to){
  const ms = 24 * 60 * 60 * 1000;
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / ms);
}

function renderAgeResult(container, from, to){
  const d = diffYMD(from, to);
  const totalDays = daysBetween(from, to);
  const totalWeeks = Math.floor(totalDays / 7);

  container.innerHTML = `
    <div><strong>Result:</strong> ${d.years} years, ${d.months} months, ${d.days} days</div>
    <div class="kpi">
      <div class="box">
        <div class="label">Years</div>
        <div class="value">${d.years}</div>
      </div>
      <div class="box">
        <div class="label">Total days</div>
        <div class="value">${totalDays}</div>
      </div>
      <div class="box">
        <div class="label">Total weeks</div>
        <div class="value">${totalWeeks}</div>
      </div>
    </div>
  `;
}

// ---------- Homepage quick calc ----------
function setupHomepageQuickCalc(){
  const dob = document.getElementById("hp_dob");
  const asof = document.getElementById("hp_asof");
  const btn = document.getElementById("hp_calc");
  const out = document.getElementById("hp_result");
  if (!dob || !asof || !btn || !out) return;

  const today = new Date();
  clampDateInputValue(asof, toISODate(today));

  btn.addEventListener("click", () => {
    if (!dob.value || !asof.value){
      out.textContent = "Please enter both dates.";
      return;
    }
    const from = new Date(dob.value + "T00:00:00");
    const to = new Date(asof.value + "T00:00:00");
    if (to < from){
      out.textContent = "As of date must be after date of birth.";
      return;
    }
    const d = diffYMD(from, to);
    out.textContent = `${d.years}y ${d.months}m ${d.days}d`;
  });
}

// ---------- Tool: Age Calculator ----------
function setupAgeCalculatorPage(){
  const shell = document.querySelector('[data-tool="age-calculator"]');
  if (!shell) return;

  const dob = document.getElementById("dob");
  const asof = document.getElementById("asof");
  const calc = document.getElementById("calc");
  const reset = document.getElementById("reset");
  const out = document.getElementById("result");

  const today = new Date();
  clampDateInputValue(asof, toISODate(today));

  function run(){
    if (!dob.value || !asof.value){
      out.innerHTML = '<div class="result-empty">Enter dates to see your result.</div>';
      return;
    }
    const from = new Date(dob.value + "T00:00:00");
    const to = new Date(asof.value + "T00:00:00");
    if (to < from){
      out.innerHTML = '<div class="result-empty">As of date must be after date of birth.</div>';
      return;
    }
    renderAgeResult(out, from, to);
  }

  calc.addEventListener("click", run);
  reset.addEventListener("click", () => {
    dob.value = "";
    clampDateInputValue(asof, toISODate(today));
    out.innerHTML = '<div class="result-empty">Enter dates to see your result.</div>';
  });

  [dob, asof].forEach(el => el && el.addEventListener("change", () => {
    if (dob.value && asof.value) run();
  }));
}

// ---------- Tool: Age in Weeks ----------
function setupAgeInWeeksPage(){
  const shell = document.querySelector('[data-tool="age-in-weeks"]');
  if (!shell) return;

  const dob = document.getElementById("w_dob");
  const asof = document.getElementById("w_asof");
  const calc = document.getElementById("w_calc");
  const reset = document.getElementById("w_reset");
  const out = document.getElementById("w_result");

  const today = new Date();
  clampDateInputValue(asof, toISODate(today));

  function run(){
    if (!dob.value || !asof.value){
      out.innerHTML = '<div class="result-empty">Enter dates to see your result.</div>';
      return;
    }
    const from = new Date(dob.value + "T00:00:00");
    const to = new Date(asof.value + "T00:00:00");
    if (to < from){
      out.innerHTML = '<div class="result-empty">As of date must be after date of birth.</div>';
      return;
    }

    const totalDays = daysBetween(from, to);
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const d = diffYMD(from, to);

    out.innerHTML = `
      <div><strong>Result:</strong> ${weeks} weeks, ${remainingDays} days</div>
      <div class="kpi">
        <div class="box">
          <div class="label">Total weeks</div>
          <div class="value">${weeks}</div>
        </div>
        <div class="box">
          <div class="label">Total days</div>
          <div class="value">${totalDays}</div>
        </div>
        <div class="box">
          <div class="label">Exact age</div>
          <div class="value">${d.years}y ${d.months}m</div>
        </div>
      </div>
    `;
  }

  calc.addEventListener("click", run);
  reset.addEventListener("click", () => {
    dob.value = "";
    clampDateInputValue(asof, toISODate(today));
    out.innerHTML = '<div class="result-empty">Enter dates to see your result.</div>';
  });

  [dob, asof].forEach(el => el && el.addEventListener("change", () => {
    if (dob.value && asof.value) run();
  }));
}

// ---------- Tool: Age Difference ----------
function setupAgeDifferencePage(){
  const shell = document.querySelector('[data-tool="age-difference"]');
  if (!shell) return;

  const a = document.getElementById("d_a");
  const b = document.getElementById("d_b");
  const calc = document.getElementById("d_calc");
  const reset = document.getElementById("d_reset");
  const out = document.getElementById("d_result");

  function run(){
    if (!a.value || !b.value){
      out.innerHTML = '<div class="result-empty">Enter both dates to see the difference.</div>';
      return;
    }
    const d1 = new Date(a.value + "T00:00:00");
    const d2 = new Date(b.value + "T00:00:00");

    const older = d1 <= d2 ? d1 : d2;
    const younger = d1 <= d2 ? d2 : d1;

    const gap = diffYMD(older, younger);
    const totalDays = daysBetween(older, younger);
    const totalWeeks = Math.floor(totalDays / 7);

    const who = (d1.getTime() === d2.getTime())
      ? "Same date"
      : (older.getTime() === d1.getTime() ? "Person A is older" : "Person B is older");

    out.innerHTML = `
      <div><strong>${who}:</strong> ${gap.years} years, ${gap.months} months, ${gap.days} days</div>
      <div class="kpi">
        <div class="box">
          <div class="label">Years</div>
          <div class="value">${gap.years}</div>
        </div>
        <div class="box">
          <div class="label">Total days</div>
          <div class="value">${totalDays}</div>
        </div>
        <div class="box">
          <div class="label">Total weeks</div>
          <div class="value">${totalWeeks}</div>
        </div>
      </div>
    `;
  }

  calc.addEventListener("click", run);
  reset.addEventListener("click", () => {
    a.value = "";
    b.value = "";
    out.innerHTML = '<div class="result-empty">Enter both dates to see the difference.</div>';
  });

  [a, b].forEach(el => el && el.addEventListener("change", () => {
    if (a.value && b.value) run();
  }));
}

// ---------- Tool: How Old Am I ----------
function setupHowOldAmI(){
  const shell = document.querySelector('[data-tool="how-old-am-i"]');
  if (!shell) return;

  const dob = document.getElementById("hoi_dob");
  const todayInput = document.getElementById("hoi_today");
  const calc = document.getElementById("hoi_calc");
  const reset = document.getElementById("hoi_reset");
  const out = document.getElementById("hoi_result");

  const today = new Date();
  if (todayInput) todayInput.value = toISODate(today);

  function run(){
    if (!dob.value){
      out.innerHTML = '<div class="result-empty">Enter your birth date to see your result.</div>';
      return;
    }
    const from = new Date(dob.value + "T00:00:00");
    const to = new Date(toISODate(today) + "T00:00:00");
    if (to < from){
      out.innerHTML = '<div class="result-empty">Birth date must be in the past.</div>';
      return;
    }
    renderAgeResult(out, from, to);
  }

  calc.addEventListener("click", run);
  reset.addEventListener("click", () => {
    dob.value = "";
    out.innerHTML = '<div class="result-empty">Enter your birth date to see your result.</div>';
  });

  dob.addEventListener("change", () => { if (dob.value) run(); });
}

// ---------- Time zone helpers ----------
function formatInTimeZone(date, timeZone){
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  }).format(date);
}

function getOffsetMinutes(timeZone, date){
  try{
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit", minute: "2-digit"
    }).formatToParts(date);
    const tz = parts.find(p => p.type === "timeZoneName")?.value || "";
    const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
    if (m){
      const sign = m[1] === "-" ? -1 : 1;
      const hh = parseInt(m[2], 10);
      const mm = parseInt(m[3] || "0", 10);
      return sign * (hh * 60 + mm);
    }
  }catch(e){}

  try{
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
      hour: "2-digit", minute: "2-digit"
    }).formatToParts(date);
    const tz = parts.find(p => p.type === "timeZoneName")?.value || "";
    const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
    if (m){
      const sign = m[1] === "-" ? -1 : 1;
      const hh = parseInt(m[2], 10);
      const mm = parseInt(m[3] || "0", 10);
      return sign * (hh * 60 + mm);
    }
  }catch(e){}

  return 0;
}

function populateTimeZones(selectEl){
  if (!selectEl) return;
  selectEl.innerHTML = "";

  const fallbackCommon = [
    "UTC",
    "Europe/London",
    "Europe/Bucharest",
    "Europe/Paris",
    "Europe/Berlin",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  let zones = fallbackCommon;
  if (typeof Intl.supportedValuesOf === "function"){
    try{
      zones = Intl.supportedValuesOf("timeZone");
    }catch(e){
      zones = fallbackCommon;
    }
  }

  zones.forEach(z => {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    selectEl.appendChild(opt);
  });
}

function setDefaultTZ(selectEl, tz){
  if (!selectEl) return;
  const opt = Array.from(selectEl.options).find(o => o.value === tz);
  if (opt) selectEl.value = tz;
}

function zonedLocalToUTC(datetimeLocalStr, fromTZ){
  const guess = new Date(datetimeLocalStr + ":00Z");
  let offset = getOffsetMinutes(fromTZ, guess);
  let utc = new Date(guess.getTime() - offset * 60000);
  offset = getOffsetMinutes(fromTZ, utc);
  utc = new Date(guess.getTime() - offset * 60000);
  return utc;
}

// ---------- Tool: Time Zone Converter ----------
function setupTimeZoneConverter(){
  const shell = document.querySelector('[data-tool="time-zone-converter"]');
  if (!shell) return;

  const dt = document.getElementById("tz_dt");
  const from = document.getElementById("tz_from");
  const to = document.getElementById("tz_to");
  const quick = document.getElementById("tz_quick");
  const calc = document.getElementById("tz_calc");
  const nowBtn = document.getElementById("tz_now");
  const out = document.getElementById("tz_result");

  populateTimeZones(from);
  populateTimeZones(to);

  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  setDefaultTZ(from, localTZ);
  setDefaultTZ(to, "UTC");

  function setNow(){
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = pad2(now.getMonth()+1);
    const dd = pad2(now.getDate());
    const hh = pad2(now.getHours());
    const mi = pad2(now.getMinutes());
    if (dt) dt.value = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }
  setNow();

  if (quick){
    quick.addEventListener("change", () => {
      if (!quick.value) return;
      const [a,b] = quick.value.split("|");
      if (from) from.value = a;
      if (to) to.value = b;
    });
  }

  function run(){
    if (!dt || !dt.value){
      out.innerHTML = '<div class="result-empty">Pick a date/time to convert.</div>';
      return;
    }
    const fromTZ = from.value;
    const toTZ = to.value;

    const utcInstant = zonedLocalToUTC(dt.value, fromTZ);
    const fromText = formatInTimeZone(utcInstant, fromTZ);
    const toText = formatInTimeZone(utcInstant, toTZ);

    const offFrom = getOffsetMinutes(fromTZ, utcInstant);
    const offTo = getOffsetMinutes(toTZ, utcInstant);
    const diffMin = offTo - offFrom;
    const sign = diffMin >= 0 ? "+" : "-";
    const abs = Math.abs(diffMin);
    const dh = Math.floor(abs/60);
    const dm = abs%60;

    out.innerHTML = `
      <div><strong>From (${fromTZ}):</strong> ${fromText}</div>
      <div style="margin-top:8px;"><strong>To (${toTZ}):</strong> ${toText}</div>
      <div class="kpi" style="margin-top:14px;">
        <div class="box">
          <div class="label">Offset difference</div>
          <div class="value">${sign}${dh}h ${pad2(dm)}m</div>
        </div>
        <div class="box">
          <div class="label">From offset</div>
          <div class="value">GMT${offFrom>=0?"+":""}${Math.trunc(offFrom/60)}</div>
        </div>
        <div class="box">
          <div class="label">To offset</div>
          <div class="value">GMT${offTo>=0?"+":""}${Math.trunc(offTo/60)}</div>
        </div>
      </div>
    `;
  }

  if (calc) calc.addEventListener("click", run);
  if (nowBtn) nowBtn.addEventListener("click", () => { setNow(); run(); });
}

// ---------- Tool: Time Difference Between Cities ----------
function setupTimeDifference(){
  const shell = document.querySelector('[data-tool="time-difference"]');
  if (!shell) return;

  const a = document.getElementById("td_a");
  const b = document.getElementById("td_b");
  const calc = document.getElementById("td_calc");
  const swap = document.getElementById("td_swap");
  const out = document.getElementById("td_result");

  populateTimeZones(a);
  populateTimeZones(b);

  setDefaultTZ(a, "Europe/London");
  setDefaultTZ(b, "America/New_York");

  function run(){
    const tzA = a.value;
    const tzB = b.value;
    const now = new Date();

    const offA = getOffsetMinutes(tzA, now);
    const offB = getOffsetMinutes(tzB, now);
    const diffMin = offB - offA;

    const sign = diffMin >= 0 ? "+" : "-";
    const abs = Math.abs(diffMin);
    const hh = Math.floor(abs / 60);
    const mm = abs % 60;

    const timeA = formatInTimeZone(now, tzA);
    const timeB = formatInTimeZone(now, tzB);

    out.innerHTML = `
      <div><strong>Time difference:</strong> ${sign}${hh}h ${pad2(mm)}m</div>
      <div style="margin-top:8px;"><strong>Now in ${tzA}:</strong> ${timeA}</div>
      <div style="margin-top:6px;"><strong>Now in ${tzB}:</strong> ${timeB}</div>
      <div class="kpi" style="margin-top:14px;">
        <div class="box">
          <div class="label">${tzA} offset</div>
          <div class="value">GMT${offA>=0?"+":""}${Math.trunc(offA/60)}</div>
        </div>
        <div class="box">
          <div class="label">${tzB} offset</div>
          <div class="value">GMT${offB>=0?"+":""}${Math.trunc(offB/60)}</div>
        </div>
        <div class="box">
          <div class="label">Minutes difference</div>
          <div class="value">${diffMin}</div>
        </div>
      </div>
    `;
  }

  if (calc) calc.addEventListener("click", run);
  if (swap) swap.addEventListener("click", () => {
    const tmp = a.value;
    a.value = b.value;
    b.value = tmp;
    run();
  });

  [a,b].forEach(el => el && el.addEventListener("change", run));
  run();
}

// -------clock
function setupLiveTime(){
  const timeEl = document.getElementById("live_time");
  const gmtEl = document.getElementById("live_gmt");
  if(!timeEl) return;

  function update(){
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();

    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offsetMin)/60);
    const minutes = Math.abs(offsetMin)%60;
    gmtEl.textContent = `(GMT${sign}${hours}:${String(minutes).padStart(2,"0")})`;
  }

  update();
  setInterval(update, 1000);
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  setupHomepageQuickCalc();
  setupAgeCalculatorPage();
  setupAgeInWeeksPage();
  setupAgeDifferencePage();
  setupHowOldAmI();
  setupTimeZoneConverter();
  setupTimeDifference();
  setupLiveTime();
});

