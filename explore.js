// ---------- Explore mode: #/e (pick a phone) · #/e/<screen> (click around freely) · #/e/end ----------
// Same realistic app as tester mode (no prototype chrome, live clock, button waits, cleaned-up copy),
// but no tasks and no story order: testers pick whose phone to use and tap wherever they like.
// A slim bar lets them switch phones or finish; the end page lists the screens they visited, ready to copy.

const EMODE = () => /^#\/e(\/|$)/.test(location.hash);
const REAL = () => TMODE() || EMODE() || ZMODE();

const EPHONES = [
  { k: 'sarah', start: 'st-start', title: 'Sarah’s phone', what: 'Pet owner with Bear, a 9-year-old German Shepherd. Uses the Wala app to find help when she’s away.' },
  { k: 'ana', start: 'lock', title: 'Ana’s phone', what: 'Sarah’s sister. Doesn’t have the app; Wala reaches her by text and a web page.' },
  { k: 'dana', start: 'kd-s-start', title: 'Dana’s phone', what: 'Neighbor three blocks away with her dog, Pepper. Wants to help neighbors with their pets.' }
];

let ELOG = { started: 0, visits: [] };
try { ELOG = JSON.parse(sessionStorage.getItem('wala-elog')) || ELOG; } catch (e) {}
const eSave = () => { try { sessionStorage.setItem('wala-elog', JSON.stringify(ELOG)); } catch (e) {} };
let EWHO = null; try { EWHO = sessionStorage.getItem('wala-ewho'); } catch (e) {}

function eEnter(id) {
  const last = ELOG.visits[ELOG.visits.length - 1];
  if (last && last.id === id) return;
  ELOG.visits.push({ id, who: EWHO, at: Date.now(), misses: 0 }); eSave();
}
function eMiss() { const v = ELOG.visits[ELOG.visits.length - 1]; if (v) { v.misses++; eSave(); } }

function eBar() {
  const p = PEOPLE[EWHO] || PEOPLE.sarah;
  return `<div class="tbar" id="tbar">
    <span class="tbar-n">${av(p.av, 's32 ' + p.cls)}</span>
    <div class="tbar-t"><div class="tbar-k">Exploring</div><div class="tbar-q">${p.phone}</div></div>
    <a class="tbar-next" href="#/e">Switch</a>
    <a class="tbar-next" href="#/e/end">Done</a>
  </div>`;
}

function renderEWelcome() {
  document.title = 'Wala';
  return `<div class="twel"><div class="twel-card">
    <i class="logo twel-logo"></i>
    <h1>Have a look around Wala</h1>
    <p>Wala helps pet owners find someone they trust to look in on their pet: friends first, then neighbors, then pros. There’s no task. Tap around however you like, and say what you’re thinking as you go.</p>
    <div class="lbl" style="margin-top:4px">Whose phone do you want to pick up?</div>
    <div class="ephones">${EPHONES.map(x => { const p = PEOPLE[x.k]; return `<button class="ephone" data-act="eStart" data-k="${x.k}">${av(p.av, 's36 ' + p.cls)}<span class="grow"><b>${x.title}</b><span>${x.what}</span></span>${icon('next', 16)}</button>`; }).join('')}</div>
    <p class="tiny muted">You can switch phones any time. Names, places and prices are made up, nothing is charged, and no texts are really sent.</p>
    ${ELOG.visits.length ? '<a class="link" href="#/e/end">I’m done exploring</a>' : ''}
  </div></div>`;
}

function eRows() {
  return ELOG.visits.map((v, i) => { const nx = ELOG.visits[i + 1]; return { ...v, s: Math.round(((nx ? nx.at : Date.now()) - v.at) / 1000), name: SCREENS[v.id]?.name || v.id }; });
}
function renderEEnd() {
  document.title = 'Thank you · Wala';
  const rows = eRows(); const uniq = new Set(rows.map(r => r.id)).size;
  const mins = ELOG.started ? Math.round((Date.now() - ELOG.started) / 60000) : 0;
  return `<div class="twel"><div class="twel-card">
    <div style="font-size:40px">🐾</div>
    <h1>Thanks for exploring!</h1>
    <p>That’s really helpful. If anything surprised or confused you, tell us; that’s the good stuff.</p>
    <details class="tres"><summary>Results for the Wala team (${uniq} screens · ${rows.length} visits · ${mins} min)</summary>
      <table><tr><th>#</th><th>Phone</th><th>Screen</th><th>Time</th><th>Off-target taps</th></tr>
      ${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${PEOPLE[r.who]?.name || ''}</td><td>${esc(r.name)}</td><td>${r.s}s</td><td>${r.misses || ''}</td></tr>`).join('')}</table></details>
    <button class="btn" data-act="eCopy">Copy results to send back</button>
    <a class="link" href="#/e">Keep exploring</a>
    <a class="link" data-act="eReset">Start fresh</a>
  </div></div>`;
}

const E_ACTS = {
  eStart(el) {
    const x = EPHONES.find(p => p.k === el.dataset.k); if (!x) return;
    if (!ELOG.started) ELOG.started = Date.now();
    EWHO = x.k; try { sessionStorage.setItem('wala-ewho', EWHO); } catch (e) {}
    eSave(); location.hash = '#/e/' + x.start;
  },
  eCopy() {
    const txt = ['Wala explore results · ' + new Date().toLocaleString(), '#\tphone\tscreen\tseconds\toff-target taps\tid']
      .concat(eRows().map((r, i) => [i + 1, PEOPLE[r.who]?.name || '', r.name, r.s, r.misses || 0, r.id].join('\t'))).join('\n');
    copyText(txt, 'Results copied. Paste them into a message to the Wala team');
  },
  eReset() { ELOG = { started: 0, visits: [] }; eSave(); try { sessionStorage.removeItem('wala-ewho'); } catch (e) {} location.hash = '#/e'; location.reload(); }
};
document.addEventListener('DOMContentLoaded', () => Object.assign(ACTS, E_ACTS));
