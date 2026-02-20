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

  [dob, asof].forEach(el => el.addEventListener("change", () => {
    if (dob.value && asof.value) run();
  }));
}

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

  [dob, asof].forEach(el => el.addEventListener("change", () => {
    if (dob.value && asof.value) run();
  }));
}

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

  [a, b].forEach(el => el.addEventListener("change", () => {
    if (a.value && b.value) run();
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  setupHomepageQuickCalc();
  setupAgeCalculatorPage();
  setupAgeInWeeksPage();
  setupAgeDifferencePage();
});
