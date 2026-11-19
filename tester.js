// ---------- Tester mode: #/t (welcome) · #/t/<step> (the full journey, no prototype chrome) · #/t/end ----------
// Plays the full journey like a real app: no toolbar, no story panel, no hotspot flashes, a live clock,
// short "network" waits on main buttons, notifications that arrive, and a card each time the tester
// switches to someone else's phone. A slim task bar gives one task per step (written so it doesn't
// name the button to press), with "Next task" as the way out of a dead end. Time, skips and taps on
// nothing are recorded per task and shown at the end, ready to copy.

const TMODE = () => /^#\/t(\/|$)/.test(location.hash);

const TASKS = {
  'st-start': 'You’re going away for Thanksgiving weekend and someone needs to look in on your dog, Bear. A friend told you about Wala. Get started.',
  'st-preview': 'Have a look at what’s here, then carry on when you’re ready.',
  'st-phone': 'Set up your account.',
  'st-pet': 'Tell Wala a little about Bear.',
  'st-home': 'You need someone to drop in on Bear on Sat Nov 28 and Sun Nov 29. Ask for help.',
  'who': 'Ask the people you already trust.',
  'status': 'Check who can help. Who hasn’t answered yet?',
  'lock': 'Your phone just buzzed. See what it is.',
  'thread': 'Find out what Sarah is asking you.',
  'request': 'You’re away that weekend. Decide what to do.',
  'decline': 'Let Sarah know you can’t make it.',
  'j-status': 'Sunday is still open. Find someone else for Sunday.',
  'st-gate': 'Do what’s needed so neighbors can see your request.',
  'st-unlocked': 'Look over what changed, then carry on.',
  'kd-s-start': 'Have a look at Wala.',
  'kd-s-demand': 'See whether anyone near you needs help.',
  'kd-s-circle': 'Start helping the people who invited you.',
  'kd-s-today': 'Find out what you’d need to do to help neighbors you don’t know yet.',
  'kd-s-ring2': 'Get set up to help Elmwood neighbors.',
  'kd-s-ref': 'Megan next door has known you for years. Ask her to vouch for you.',
  'kd-s-board': 'Someone nearby needs help this Sunday. Find their request.',
  'kd-s-offer': 'Offer to cover both of Bear’s visits.',
  'owner': 'See who’s covering Sunday and what happens next.',
  'kd-s-visit': 'Let yourself in, do the visit, and tell Sarah how it went.',
  'st-update': 'Check how Bear is doing.',
  'st-thanks': 'Sunday went well. Thank Dana.',
  'nb-board': 'Have a look around your neighborhood’s page.',
  'nb-walk': 'Sign Bear up for Saturday’s pack walk.',
  'nb-ledger': 'See what you’ve given and gotten from neighbors.',
  'kd-s-pro': 'Start pet sitting professionally.',
  'st-pro-gate': 'Book Dana for two overnights while you’re in Denver.',
  'st-pro-booked': 'Check your booking.'
};

// what the tester reads when the story moves to another person's phone
const THAND = {
  'st-start': ['sarah', 'You’re Sarah', 'You live on Elm St with Bear, a 9-year-old German Shepherd. Thanksgiving weekend you’ll be away, and Bear needs someone to drop in.'],
  'lock': ['ana', 'Now you’re Ana', 'You’re Sarah’s sister. You don’t use Wala and haven’t heard of it. It’s Tuesday morning and your phone buzzes.'],
  'j-status': ['sarah', 'Back to Sarah', 'A little later. Ana has answered.'],
  'kd-s-start': ['dana', 'Now you’re Dana', 'You live three blocks from Sarah with your dog, Pepper. A couple of friends use Wala, and you’d like to help neighbors with their pets.'],
  'owner': ['sarah', 'Back to Sarah', 'Her phone just buzzed.'],
  'kd-s-visit': ['dana', 'Dana again', 'It’s Sunday, 8 am. You’re at Sarah’s front door for Bear’s morning visit.'],
  'st-update': ['sarah', 'Back to Sarah', 'It’s Sunday morning and you’re in Denver.'],
  'kd-s-pro': ['dana', 'Dana, a few weeks later', 'Neighbors keep asking you to pet-sit, and you’re thinking about doing it properly.'],
  'st-pro-gate': ['sarah', 'Sarah, in December', 'You’re going to Denver Dec 12–14 and want Dana to stay over with Bear.']
};

// when a screen's natural next tap leads off the story, send it where the story goes next.
// act values: 'id' = the action runs and its navigation goes to id · {only} = go there instead of
// running the action · {after} = run the action, then go there a moment later
const TOVR = {
  'st-home': { go: { 'st-gate': 'who' } },
  'j-status': { act: { askNeighbors: { only: 'st-gate' } } },
  'st-unlocked': { go: { 'nb-board': 'kd-s-start', 'st-home': 'kd-s-start' } },
  'kd-s-ref': { act: { kdSendRef: 'kd-s-board' } },
  'kd-s-ring2': { act: { kdRing2Check: 'kd-s-ref' } },
  'kd-s-offer': { act: { kdOffer: 'owner' } },
  'kd-bgcheck': { go: { 'kd-today': 'st-pro-gate' } },
  'nb-walk': { act: { nbRsvp: { after: 'nb-ledger' } } }
};

// things that "arrive" when a step opens, the first time only
const TARRIVE = {
  'j-status': () => banner('Wala', 'Ana can’t make Sunday this time. Saturday is still covered by Megan.', ''),
  'kd-s-board': () => banner('Wala', 'Megan vouched for you 🎉 You can now help Elmwood neighbors.', ''),
  'owner': () => banner('Wala', 'Dana offered to cover Sunday 🎉', ''),
  'st-update': () => banner('Dana · visit update', 'Ate everything, did his yard loop, now back on his bed 🐾', '')
};

// copy that only makes sense to the design team
const TCOPY = [
  [/<div class="tiny muted"[^>]*>Prototype: skips ahead[^<]*<\/div>/g, ''],
  [/<div class="small muted"[^>]*>Amounts are placeholders[^<]*<\/div>/g, ''],
  [/This prototype’s scenario stays/g, 'For now, Wala can only book'],
  [/<div class="note rowx">.{0,80}What Sarah never had to do up front[\s\S]*?<\/div><\/div>/g, ''],
  [/<a class="link" href="#\/">All flows<\/a>/g, ''],
  [/>Start the journey again</g, '>Done<'],
  [/See it on Sarah’s phone →/g, 'Done'],
  [/>Simulate yes</g, '>Remind'],
  [/<div class="hint">Sent as a regular SMS[^<]*<\/div>/g, ''],
  [/ — placeholder count/g, '']
];
const tClean = (html) => TCOPY.reduce((h, [re, to]) => h.replace(re, to), html);
const tToast = (msg) => String(msg)
  .replace(/ isn’t part of this prototype/, ' is coming soon')
  .replace(/\s*\(simulated\)/g, '')
  .replace(/\s*— we’d turn what you say into this line/, '');

// ---- results log (survives a reload) ----
let TLOG = { started: 0, tasks: {} };
try { TLOG = JSON.parse(sessionStorage.getItem('wala-tlog')) || TLOG; } catch (e) {}
const tSave = () => { try { sessionStorage.setItem('wala-tlog', JSON.stringify(TLOG)); } catch (e) {} };
let TCUR = -1, TPEND = null, TSEEN = new Set(), TSKIP = false;

function tEnterStep(id) {
  const at = JIDS.indexOf(id); if (at < 0) return;
  const prevId = JIDS[TCUR];
  if (prevId && prevId !== id) { const t = TLOG.tasks[prevId]; if (t && !t.t1) { t.t1 = Date.now(); t.skipped = TSKIP; } }
  TSKIP = false;
  if (!TLOG.tasks[id]) TLOG.tasks[id] = { t0: Date.now(), misses: 0 };
  const forward = at > TCUR; TCUR = at; tSave();
  if (forward && THAND[id] && !TSEEN.has('h:' + id)) { TSEEN.add('h:' + id); setTimeout(() => tHandoff(id), 0); }
  else if (!TSEEN.has('a:' + id) && TARRIVE[id]) { TSEEN.add('a:' + id); setTimeout(TARRIVE[id], 900); }
}

function tHandoff(id) {
  const [who, title, text] = THAND[id]; const p = PEOPLE[who];
  document.querySelector('.thand')?.remove();
  const o = document.createElement('div'); o.className = 'thand';
  o.innerHTML = `<div class="thand-card" role="dialog" aria-modal="true" aria-labelledby="thandT">
    <div class="thand-av">${av(p.av, 's56 ' + p.cls)}</div>
    <div class="lbl">${p.phone}</div><h2 id="thandT">${title}</h2><p>${text}</p>
    <button class="btn" id="thandGo">Continue</button></div>`;
  document.body.appendChild(o);
  const t = TLOG.tasks[id]; if (t) t.t0 = Date.now() + 99e9; // restart the clock when they tap Continue
  o.querySelector('#thandGo').addEventListener('click', () => {
    if (t) { t.t0 = Date.now(); tSave(); }
    o.classList.add('out'); setTimeout(() => o.remove(), 250);
    if (!TSEEN.has('a:' + id) && TARRIVE[id]) { TSEEN.add('a:' + id); setTimeout(TARRIVE[id], 700); }
  });
  o.querySelector('#thandGo').focus();
}

function tTaskBar(id) {
  const at = JIDS.indexOf(id) >= 0 ? JIDS.indexOf(id) : TCUR; const sid = JIDS[at];
  const task = TASKS[sid] || 'Carry on.'; const p = PEOPLE[(JSTEPS[at] || {}).who] || PEOPLE.sarah;
  const side = JIDS.indexOf(id) < 0;
  return `<div class="tbar" id="tbar">
    <span class="tbar-n" title="${p.phone}">${av(p.av, 's32 ' + p.cls)}</span>
    <div class="tbar-t"><div class="tbar-k">Task ${at + 1} of ${JIDS.length}${side ? ' · you’ve wandered off, that’s fine' : ''}</div><div class="tbar-q">${task}</div></div>
    <button class="tbar-next" data-act="tNext">${at + 1 === JIDS.length ? 'Finish' : 'Next task'}${icon('next', 14)}</button>
  </div>`;
}

function tClock() { const d = new Date(); return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`; }
setInterval(() => document.querySelectorAll('.sb-time.live').forEach(s => { s.textContent = tClock(); }), 15000);

function renderTWelcome() {
  document.title = 'Wala';
  return `<div class="twel"><div class="twel-card">
    <i class="logo twel-logo"></i>
    <h1>Thanks for trying Wala</h1>
    <p>Wala helps pet owners find someone they trust to look in on their pet: friends first, then neighbors, then pros.</p>
    <ul>
      <li>${icon('people', 18)}<span>You’ll play three people in one story: Sarah, her sister Ana, and Dana, a neighbor.</span></li>
      <li>${icon('check', 18)}<span>Each step gives you a short task at the top. Do it the way you would in a real app.</span></li>
      <li>${icon('message', 18)}<span>Please think out loud. If something’s confusing, that’s exactly what we want to hear.</span></li>
      <li>${icon('next', 18)}<span>Stuck? Tap “Next task”. There are no wrong answers. We’re testing the app, not you.</span></li>
    </ul>
    <p class="tiny muted">About 15 minutes. Names, places and prices are made up, nothing is charged, and no texts are really sent.</p>
    <button class="btn" data-act="tStart">${icon('play', 16)}Start</button>
  </div></div>`;
}

function renderTEnd() {
  document.title = 'Thank you · Wala';
  const prevId = JIDS[TCUR]; const pt = prevId && TLOG.tasks[prevId]; if (pt && !pt.t1) { pt.t1 = Date.now(); pt.skipped = TSKIP; tSave(); }
  const rows = JIDS.filter(id => TLOG.tasks[id]).map(id => { const t = TLOG.tasks[id]; return { id, s: Math.max(0, Math.round(((t.t1 || Date.now()) - t.t0) / 1000)), skipped: !!t.skipped, misses: t.misses || 0 }; });
  const total = TLOG.started ? Math.round((Date.now() - TLOG.started) / 60000) : 0;
  return `<div class="twel"><div class="twel-card">
    <div style="font-size:40px">🐾</div>
    <h1>That’s everything. Thank you!</h1>
    <p>Bear’s covered, Dana’s a pro, and you’ve been a huge help.</p>
    <details class="tres"><summary>Results for the Wala team (${rows.length} tasks · ${total} min · ${rows.filter(r => r.skipped).length} skipped)</summary>
      <table><tr><th>#</th><th>Task</th><th>Time</th><th>Skipped</th><th>Off-target taps</th></tr>
      ${rows.map(r => `<tr><td>${JIDS.indexOf(r.id) + 1}</td><td>${esc(TASKS[r.id] || r.id)}</td><td>${r.s}s</td><td>${r.skipped ? 'yes' : ''}</td><td>${r.misses || ''}</td></tr>`).join('')}</table></details>
    <button class="btn" data-act="tCopy">Copy results to send back</button>
    <a class="link" data-act="tStart">Start over</a>
  </div></div>`;
}
function tResultsText() {
  return ['Wala test results · ' + new Date().toLocaleString(), 'task\tseconds\tskipped\toff-target taps\tstep'].concat(
    JIDS.filter(id => TLOG.tasks[id]).map(id => { const t = TLOG.tasks[id]; return [JIDS.indexOf(id) + 1 + '. ' + (TASKS[id] || ''), Math.round(((t.t1 || Date.now()) - t.t0) / 1000), t.skipped ? 'yes' : 'no', t.misses || 0, id].join('\t'); })).join('\n');
}

const T_ACTS = {
  tStart() { TLOG = { started: Date.now(), tasks: {} }; tSave(); location.hash = '#/t/st-start'; location.reload(); },
  tNext() {
    const at = JIDS.indexOf(current) >= 0 ? JIDS.indexOf(current) : TCUR;
    TSKIP = true;
    if (at + 1 >= JIDS.length) { location.hash = '#/t/end'; return; }
    go(JIDS[at + 1]);
  },
  tCopy() { copyText(tResultsText(), 'Results copied. Paste them into a message to the Wala team'); }
};

document.addEventListener('DOMContentLoaded', () => {
  Object.assign(ACTS, T_ACTS);
  const restart = ACTS.jRestart;
  ACTS.jRestart = (...a) => { if (TMODE()) { location.hash = '#/t/end'; return; } restart(...a); };
});

// tap feedback, a short wait on main buttons, and off-target taps (capture phase, before app.js)
document.addEventListener('click', (e) => {
  if (!TMODE()) return;
  const scr = e.target.closest('#screen');
  if (!scr) return;
  const hit = e.target.closest('[data-act], [data-go], [data-toast], .chip, .opt, .toggle, .tap, input, textarea, select, a[href], button, label, .notif, .linkprev');
  if (!hit) { const t = TLOG.tasks[JIDS[TCUR]]; if (t) { t.misses = (t.misses || 0) + 1; tSave(); } return; }
  try { navigator.vibrate?.(8); } catch (err) {}
  const btn = e.target.closest('.btn');
  if (!btn || btn.classList.contains('sm') || !(btn.dataset.go || btn.dataset.act)) return;
  if (btn.dataset.tReady) { delete btn.dataset.tReady; return; }
  e.preventDefault(); e.stopImmediatePropagation();
  if (btn.classList.contains('busy')) return;
  btn.classList.add('busy');
  setTimeout(() => { btn.classList.remove('busy'); btn.dataset.tReady = '1'; btn.click(); }, 380 + Math.random() * 320);
}, true);

// run an action with tester-mode rerouting; returns true when handled here
function tRunAct(name, el, e) {
  const ov = TMODE() && TOVR[current]?.act?.[name];
  TPEND = null;
  if (!ov) return false;
  if (typeof ov === 'string') { TPEND = { to: ov, until: Date.now() + 2500 }; ACTS[name](el, e); return true; }
  if (ov.only) { go(ov.only); return true; }
  const here = current; ACTS[name](el, e); setTimeout(() => { if (current === here) go(ov.after); }, 1300); return true;
}
