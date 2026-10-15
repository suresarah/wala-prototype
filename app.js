// ---------- router: #/  ·  #/s/<screen>  ·  #/admin ----------
const app = document.getElementById('app');
let current = null;
let pendingTr = 'enter';
let hotspots = false;

function flowOf(id) { return FLOWS.find(f => f.steps.includes(id)); }

function renderHub() {
  document.title = LIVE.on ? `Session ${LIVE.session} · Wala Prototype` : 'Wala Prototype';
  return `<div class="hub">
    <div class="hub-top"><span class="hub-mark"><i class="logo"></i></span>
      <div><h1>Neighbors & trusted friends</h1><p class="hub-sub">A clickable prototype for the Wala pilot: owners ask their circle first, friends answer by text with no app, and a neighborhood lead reviews new helpers.</p></div></div>
    ${LIVE.on ? renderSessionPanel() : `<section class="live-cta">
      <div class="grow"><div class="lbl" style="color:var(--butter)">Test with real people</div><h2>Run a live session across phones</h2>
        <p>Sarah, Ana, Lena and the neighborhood lead each open their own link on their own device. What one person does shows up on the others, and every step is logged with a timestamp.</p></div>
      ${window.top === window ? `<button class="btn" style="background:var(--butter);color:var(--ink);width:auto;padding:0 24px;flex:none" data-act="newSession">${icon('play', 16)}Start a test session</button>` : `<span class="pill butter" style="color:var(--ink);flex:none">Runs from the GitHub Pages link</span>`}
    </section>`}
    ${LIVE.on ? '<div class="lbl" style="margin:32px 0 12px">Or click through any flow on your own</div>' : ''}
    <div class="flows">
      ${FLOWS.map(f => `<section class="flow-card">
        ${pill(f.tag, 'white flow-tag')}
        <h2>${f.title}</h2><p>${f.blurb}</p>
        <ol class="flow-steps">${f.steps.map((s, i) => `<li><a href="#/s/${s}">${SCREENS[s].name}<span>${i + 1}</span></a></li>`).join('')}</ol>
        <a class="btn" href="#/s/${f.steps[0]}">${icon('play', 16)}Start this flow</a>
      </section>`).join('')}
      <section class="flow-card" style="background:var(--peri);color:var(--white)">
        <span class="pill butter flow-tag" style="color:var(--ink);font-weight:600">Pilot team · desktop</span>
        <h2>Admin: onboarding requests</h2><p style="color:var(--peri-pale)">The queue a neighborhood lead uses to approve neighbor helpers and pros. Select a row, then approve, ask for info, or decline.</p>
        <a class="btn" style="background:var(--butter);color:var(--ink)" href="#/admin">${icon('grid', 16)}Open the dashboard</a>
      </section>
    </div>
    <p class="hub-note">Prototype only. Names, prices ($20 neighbor, $28 pro, $40 for two visits), the $500 vet-approval limit and cover wording are placeholders until the insurance quote and professional review. Tap “Hotspots” in a flow to see what’s clickable.</p>
  </div>`;
}

// ---------- device sizes (points) ----------
const DEVICES = {
  'iphone-se': { label: 'iPhone SE', w: 375, h: 667, sb: 20, island: false, home: false, r: 28 },
  'iphone-16': { label: 'iPhone 16', w: 393, h: 852, sb: 54, island: true, home: true, r: 55 },
  'iphone-16-pro': { label: 'iPhone 16 Pro', w: 402, h: 874, sb: 54, island: true, home: true, r: 55 },
  'iphone-16-pro-max': { label: 'iPhone 16 Pro Max', w: 440, h: 956, sb: 54, island: true, home: true, r: 58 },
  'design': { label: 'Figma frame', w: 448, h: 900, sb: 0, island: false, home: false, r: 36 }
};
let deviceKey = 'iphone-16';
try { const k = localStorage.getItem('wala-device'); if (DEVICES[k]) deviceKey = k; } catch (e) {}
const isNative = () => matchMedia('(max-width: 520px)').matches; // viewing on an actual phone

const sbarIcons = `<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true"><path d="M8 2.6c2.2 0 4.2.9 5.7 2.3l1.2-1.2A9.7 9.7 0 0 0 8 .9 9.7 9.7 0 0 0 1.1 3.7l1.2 1.2A8 8 0 0 1 8 2.6zm0 3.4c1.3 0 2.5.5 3.4 1.3l1.2-1.2A6.6 6.6 0 0 0 8 4.3a6.6 6.6 0 0 0-4.6 1.8l1.2 1.2C5.5 6.5 6.7 6 8 6zm0 3.3c.5 0 .9.2 1.2.5L8 11 6.8 9.8c.3-.3.7-.5 1.2-.5z"/></svg>
  <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg>`;

function renderViewer(id) {
  const f = flowOf(id); const i = f.steps.indexOf(id);
  const prev = f.steps[i - 1], next = f.steps[i + 1];
  const native = isNative(); const d = DEVICES[deviceKey];
  document.title = `${SCREENS[id].name} · Wala Prototype`;
  const frame = native
    ? `<div class="device native"><div class="screen ${pendingTr}" id="screen">${SCREENS[id].render()}</div></div>`
    : `<div class="dwrap" id="dwrap" style="width:${d.w}px;height:${d.h}px">
        <div class="device framed ${d.home ? 'has-home' : ''}" id="device" style="width:${d.w}px;height:${d.h}px;border-radius:${d.r}px">
          ${d.sb ? `<div class="sbar ${d.island ? 'tall' : ''}" id="sbar" style="height:${d.sb}px"><span class="sb-time">9:41</span>${d.island ? '<i class="di"></i>' : ''}<span class="sb-r">${sbarIcons}</span></div>` : ''}
          <div class="screen ${pendingTr}" id="screen" style="top:${d.sb}px">${SCREENS[id].render()}</div>
          ${d.home ? '<i class="homebar"></i>' : ''}
        </div></div>`;
  const devsel = native ? '' : `<label class="devsel"><span class="sr">Device size</span><select id="devSel">${Object.entries(DEVICES).map(([k, v]) => `<option value="${k}" ${k === deviceKey ? 'selected' : ''}>${v.label} · ${v.w}×${v.h}</option>`).join('')}</select></label>`;
  return `<div class="viewer ${hotspots ? 'show-hotspots' : ''}">
    ${LIVE.role ? roleBar(devsel) : `<div class="vbar">
      <a class="home" href="#/">${icon('back', 18)}Flows</a>
      <div class="crumb"><b>${SCREENS[id].name}</b> <span>· ${f.title} · ${i + 1}/${f.steps.length}</span></div>
      ${devsel}
      <button class="navbtn" ${prev ? `data-go="${prev}" data-tr="back"` : 'disabled'} aria-label="Previous screen">${icon('back', 18)}</button>
      <button class="navbtn" ${next ? `data-go="${next}"` : 'disabled'} aria-label="Next screen">${icon('next', 18)}</button>
      <button class="hs" aria-pressed="${hotspots}" data-act="hotspots">Hotspots</button>
    </div>`}
    <div class="stage">${frame}</div>
  </div>`;
}

// scale the phone to fit the window, and match the status bar to the screen's top
function fitDevice() {
  const dev = document.getElementById('device'), wrap = document.getElementById('dwrap');
  if (!dev || !wrap) return;
  const d = DEVICES[deviceKey];
  const barH = document.querySelector('.vbar')?.offsetHeight || 56;
  const s = Math.min(1, (window.innerHeight - barH - 40) / d.h, (window.innerWidth - 40) / d.w);
  dev.style.transform = `scale(${s})`;
  wrap.style.width = d.w * s + 'px'; wrap.style.height = d.h * s + 'px';
}
function paintStatusBar() {
  const sb = document.getElementById('sbar'), sc = document.getElementById('screen');
  if (!sb || !sc) return;
  const lock = sc.querySelector('.lock');
  if (lock) { sc.style.top = '0px'; sb.style.background = 'transparent'; sb.style.color = '#fff'; return; }
  sc.style.top = DEVICES[deviceKey].sb + 'px';
  const top = sc.querySelector('.hdr, .msg-hdr, .urlbar') || sc.firstElementChild;
  sb.style.background = top ? getComputedStyle(top).backgroundColor : 'var(--canvas)';
  sb.style.color = '#111';
}
let wasNative = isNative();
window.addEventListener('resize', () => {
  if (current && current !== 'admin' && isNative() !== wasNative) { wasNative = isNative(); rerender(); return; }
  fitDevice();
});
document.addEventListener('change', (e) => {
  if (e.target.id !== 'devSel') return;
  deviceKey = e.target.value;
  try { localStorage.setItem('wala-device', deviceKey); } catch (err) {}
  rerender();
});

function allowed(id) { return !LIVE.role || (LIVE.role !== 'admin' && ROLES[LIVE.role].screens.includes(id)); }
function roleBar(extra = '') {
  const r = ROLES[LIVE.role];
  return `<div class="vbar"><span class="role-chip">${av(r.av, 's32 ' + (LIVE.role === 'lena' || LIVE.role === 'admin' ? 'blue' : ''))}<span><b>You’re ${r.name}</b><span class="tiny muted"> · session ${LIVE.session}</span></span></span>
    <div class="crumb"></div>
    <span class="live-dot ${LIVE.connected ? 'on' : ''}" id="liveDot">${LIVE.connected ? (LIVE.mode === 'local' ? 'Live · this browser' : 'Live') : 'Connecting…'}</span>${extra}</div>`;
}
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  if (LIVE.role) {
    const want = LIVE.role === 'admin' ? 'admin' : (h.startsWith('s/') && allowed(h.slice(2)) ? h : 's/' + ROLES[LIVE.role].start);
    if (want !== h) { location.replace('#/' + want); return; }
  }
  if (h.startsWith('s/') && SCREENS[h.slice(2)]) {
    current = h.slice(2);
    SCREENS[current].before?.();
    app.innerHTML = renderViewer(current);
    fitDevice(); paintStatusBar();
    const el = document.getElementById('screen');
    SCREENS[current].after?.(el);
  } else if (h === 'admin') {
    current = 'admin'; document.title = 'Admin · Wala Prototype';
    app.innerHTML = renderAdmin();
  } else {
    current = null; app.innerHTML = renderHub(); if (LIVE.on) drawQRs();
  }
  pendingTr = 'enter';
  window.scrollTo(0, 0);
}

function rerender() { // keep scroll, no animation
  if (current === 'admin') { const s = document.querySelector('.adm-scroll')?.scrollLeft; app.innerHTML = renderAdmin(); if (s) document.querySelector('.adm-scroll').scrollLeft = s; return; }
  const sc = document.getElementById('screen'); const top = sc ? sc.scrollTop : 0;
  pendingTr = ''; app.innerHTML = renderViewer(current); pendingTr = 'enter';
  fitDevice(); paintStatusBar();
  document.getElementById('screen').scrollTop = top;
}

function go(id, tr = 'enter') {
  if (!allowed(id)) return toast('That screen belongs to another tester');
  pendingTr = tr === 'up' ? 'enter-up' : tr === 'back' ? 'enter-back' : 'enter';
  location.hash = '#/s/' + id;
}

let toastT;
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200);
}

// ---------- actions ----------
const ACTS = {
  hotspots() { hotspots = !hotspots; rerender(); },
  sitDone(el) { STATE.sit[el.dataset.k] = true; if (Object.values(STATE.sit).every(Boolean)) actOnce('sarah', 'sitDoneAt'); rerender(); },
  sendThanks() {
    const how = document.querySelector('[data-radio] .opt.selected')?.dataset.label || 'Pay';
    act('sarah', { thanksAt: Date.now(), thanksHow: how });
    toast('Thanks sent to Megan 💛');
    setTimeout(() => { if (LIVE.role) go('status', 'back'); else location.hash = '#/'; }, 1000);
  },
  // Sarah
  sarahAsk() { actOnce('sarah', 'askedAt'); go('status'); },
  // Ana
  anaYes() { STATE.ana = { am: true, pm: true }; STATE.anaNote = ''; STATE.anaThanks = '$40'; go('verify'); },
  anaVisit(el) { const k = el.dataset.k; STATE.ana[k] = !STATE.ana[k]; const n = document.querySelector('textarea'); if (n) STATE.anaNote = n.value; rerender(); },
  anaSend() {
    if (!STATE.ana.am && !STATE.ana.pm) return toast('Pick at least one visit');
    STATE.anaNote = document.querySelector('textarea')?.value.trim() || '';
    STATE.anaThanks = document.querySelector('[data-single] .chip.on')?.textContent.trim() || '$40';
    go('verify');
  },
  anaVerify() { actOnce('ana', 'verifiedAt'); go(STATE.verifyNext || 'confirmed'); STATE.verifyNext = null; },
  anaDecline() {
    const reason = document.querySelector('[data-single] .chip.on')?.textContent.trim() || '';
    const again = document.querySelector('[data-radio] .opt.selected')?.textContent.trim() || '';
    act('ana', { stage: 'declined', reason, askAgain: again, answeredAt: Date.now() });
    toast('Sarah’s been told — thanks for letting her know');
    setTimeout(() => go('lock'), 1100);
  },
  // Lena
  lenaJoin() { actOnce('lena', 'joinedAt'); toast('Phone confirmed — you’re in Bear’s circle'); setTimeout(() => go('h-apply'), 900); },
  lenaApply() {
    const wants = [...document.querySelectorAll('[data-multi] .chip.on')].map(c => c.textContent.trim());
    const who = document.querySelector('[data-radio] .opt.selected')?.textContent.trim() || '';
    act('lena', { appliedAt: Date.now(), wants: [...wants, who].filter(Boolean) });
    go('h-review');
  },
  // gap-fill: paperwork, door code, time changes, opting out
  toggleCheck(el) { const on = !el.classList.contains('selected'); el.classList.toggle('selected', on); const b = el.querySelector('.box'); b.classList.toggle('on', on); b.innerHTML = on ? icon('check', 14) : ''; },
  signAgreement(el) {
    const name = document.getElementById('signName')?.value.trim();
    const boxes = [...document.querySelectorAll('[data-checks] .opt')];
    if (boxes.some(b => !b.classList.contains('selected'))) return toast('Tick all three house rules first');
    if (!name || name.length < 3) return toast('Type your full name to sign');
    if (el.dataset.k === 'lena') { act('lena', { resubmittedAt: Date.now(), signedName: name }); toast('Signed and sent back to the lead'); go('h-review', 'back'); }
    else { act('ana', { signedAt: Date.now(), signedName: name }); rerender(); }
  },
  codeVerify() { STATE.codeOpen = true; STATE.verifyNext = 'doorcode'; go('verify'); },
  resendCode() { toast('New code sent'); const sc = document.getElementById('screen'); sc.querySelectorAll('#otp span').forEach(c => { c.textContent = ''; c.classList.remove('cur'); }); SCREENS.verify.after(sc); },
  anaSuggest() {
    const am = document.querySelector('#sgAm .chip.on')?.textContent.trim() || '';
    const pm = document.querySelector('#sgPm .chip.on')?.textContent.trim() || '';
    const suggest = { am: am.startsWith('Keep') ? '' : am, pm: pm.startsWith('Keep') ? '' : pm };
    if (!suggest.am && !suggest.pm) return toast('Pick a new time, or go back to keep the original');
    act('ana', { stage: 'suggested', suggest, suggestNote: document.getElementById('sgNote')?.value.trim() || '', suggestedAt: Date.now(), visits: { ...STATE.ana } });
    rerender();
    if (!LIVE.on) setTimeout(() => act('sarah', { suggestReply: 'accepted', suggestReplyAt: Date.now() }), 3500); // solo: Sarah answers
  },
  anaLeave() { act('ana', { stage: 'left', leftAt: Date.now() }); rerender(); },
  sitSave(el) { STATE.sit[el.dataset.k] = true; if (Object.values(STATE.sit).every(Boolean)) actOnce('sarah', 'sitDoneAt'); toast('Saved'); go('sit', 'back'); },
  sendInvite() {
    const name = (document.getElementById('inviteWho')?.value || '').split('·')[0].trim() || 'your friend';
    STATE.invites = [...(STATE.invites || []), name];
    toast(`Invite sent to ${name.split(' ')[0]}`); setTimeout(() => go('circle', 'back'), 900);
  },
  askNeighbors() {
    act('sarah', { neighborsAskedAt: Date.now() }); toast('Dana and Omar were asked for Sunday'); rerender();
    setTimeout(() => act('sarah', { danaYesAt: Date.now(), coveredBy: 'Dana' }), 6000); // Dana is simulated
  },
  sarahAcceptSuggest() { act('sarah', { suggestReply: 'accepted', suggestReplyAt: Date.now() }); toast('Ana’s been told the new time works'); rerender(); },
  sarahKeepTime() { act('sarah', { suggestReply: 'declined', suggestReplyAt: Date.now() }); toast('Ana’s been asked if 8 am still works'); rerender(); },
  // voice
  voiceStart() { voiceStart(); },
  voiceStop() { voiceStop(); },
  voiceSample(el) { VOICE.text = VOICE_SAMPLES[VOICE.kind][+el.dataset.k]; VOICE.state = 'done'; rerender(); },
  voiceAgain() { voiceReset('update'); STATE.visitMore = true; rerender(); },
  voiceAskSend() { const t = (document.getElementById('voiceText')?.value || VOICE.text).trim(); act('sarah', { askedAt: L('sarah').askedAt || Date.now(), askVia: 'voice', askText: t }); go('status'); },
  voiceAnswerSend() {
    const t = (document.getElementById('voiceText')?.value || VOICE.text).trim(); const p = parseAnswer(t);
    const pick = document.querySelector('#vaPick .chip.on')?.dataset.k || p.kind;
    if (pick === 'yes') { STATE.ana = p.visits || { am: true, pm: true }; STATE.anaNote = t; STATE.anaThanks = '$40'; STATE.anaVia = 'voice'; go('verify'); }
    else if (pick === 'no') { act('ana', { stage: 'declined', reason: t, via: 'voice', answeredAt: Date.now() }); toast('Sarah’s been told — thanks for letting her know'); setTimeout(() => go('lock'), 1100); }
    else if (pick === 'suggest') {
      act('ana', { stage: 'suggested', suggest: p.suggest || { am: '10 am', pm: '' }, suggestNote: t, suggestedAt: Date.now(), visits: { am: true, pm: true }, via: 'voice' }); go('suggest');
      if (!LIVE.on) setTimeout(() => act('sarah', { suggestReply: 'accepted', suggestReplyAt: Date.now() }), 3500);
    } else toast('Pick yes, a different time, or can’t');
  },
  voiceUpdateSend() {
    const t = (document.getElementById('voiceText')?.value || VOICE.text).trim(); if (!t) return toast('Say or type a quick update first');
    const p = parseUpdate(t); STATE.visitMore = false;
    act('ana', { updates: [...(L('ana').updates || []), { at: Date.now(), text: t, chips: p.chips, flag: p.flag }] });
    toast(p.flag ? 'Sent — flagged for Sarah' : 'Update sent to Sarah'); rerender();
  },
  speakUpdate() { const u = (L('ana').updates || []).slice(-1)[0]; if (u) speak(`Ana says: ${u.text}`); },
  // live session
  newSession() { location.href = facilitatorLink(newSessionCode()); },
  copyLink(el) { copyText(roleLink(el.dataset.k), `${ROLES[el.dataset.k].name}’s link copied`); },
  copyLinks() { copyText(Object.entries(ROLES).map(([k, r]) => `${r.name}: ${roleLink(k)}`).join('\n'), 'All four links copied'); },
  copyLog() { copyText(logText(), 'Log copied'); },
  // admin
  admTab(el) { ADM.tab = el.dataset.k; ADM.sel = null; rerender(); },
  admSel(el) { ADM.sel = el.dataset.k; rerender(); },
  admApprove() { const a = APPLICANTS.find(x => x.id === ADM.sel); if (a.id === 'lena') act('admin', { lena: { decision: 'approved', at: Date.now() } }); a.prev = a.status; a.status = 'approved'; a.badge = ['Approved', 'pgrass']; toast(`${a.name} approved — now askable in Elmwood`); ADM.sel = null; rerender(); },
  admDecline() { const a = APPLICANTS.find(x => x.id === ADM.sel); STATE.declineReason = null; document.body.insertAdjacentHTML('beforeend', declineModal(a)); },
  admDeclineReason(el) { const a = APPLICANTS.find(x => x.id === ADM.sel); STATE.declineReason = el.dataset.k; document.querySelector('.modal-bg').remove(); document.body.insertAdjacentHTML('beforeend', declineModal(a)); },
  admDeclineConfirm() { STATE.declineMsg = document.getElementById('declineMsg')?.value || ''; document.querySelector('.modal-bg')?.remove(); const a = APPLICANTS.find(x => x.id === ADM.sel); if (a.id === 'lena') act('admin', { lena: { decision: 'declined', msg: STATE.declineMsg || '', at: Date.now() } }); a.prev = a.status; a.status = 'declined'; a.badge = ['Declined', 'prust']; toast(`${a.name} declined — they’ll get a kind note`); ADM.sel = null; rerender(); },
  admUndo() { const a = APPLICANTS.find(x => x.id === ADM.sel); if (a.id === 'lena') act('admin', { lena: null }); a.status = 'review'; a.badge = ['Ready to review', 'pbutter']; ADM.tab = 'review'; toast(`${a.name} moved back to review`); rerender(); },
  admAsk() { const a = APPLICANTS.find(x => x.id === ADM.sel); document.body.insertAdjacentHTML('beforeend', askModal(a)); },
  admMiss(el) { const a = APPLICANTS.find(x => x.id === ADM.sel); const k = el.dataset.k; a.missing = a.missing.includes(k) ? a.missing.filter(m => m !== k) : [...a.missing, k]; document.querySelector('.modal-bg').remove(); document.body.insertAdjacentHTML('beforeend', askModal(a)); },
  admClose(el, e) { if (el.classList.contains('modal-bg') && e.target !== el) return; document.querySelector('.modal-bg')?.remove(); },
  admSendAsk() { const a = APPLICANTS.find(x => x.id === ADM.sel); if (a.id === 'lena') act('admin', { lena: { decision: 'asked', msg: document.getElementById('askMsg')?.value || '', at: Date.now() } }); a.status = 'waiting'; a.badge = ['Asked for info', 'fill']; document.querySelector('.modal-bg')?.remove(); toast(`Sent to ${a.name.split(' ')[0]} — request paused until they reply`); ADM.sel = null; rerender(); }
};

document.addEventListener('click', (e) => {
  // chips / radios / toggles / checkboxes
  const chip = e.target.closest('.chip');
  if (chip) { const g = chip.parentElement; if (g.hasAttribute('data-single')) g.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip)); else chip.classList.toggle('on'); return; }
  const opt = e.target.closest('[data-radio] > .opt');
  if (opt) { opt.parentElement.querySelectorAll('.opt').forEach(o => o.classList.toggle('selected', o === opt)); return; }
  const tg = e.target.closest('.toggle');
  if (tg) { tg.classList.toggle('on'); return; }

  const actEl = e.target.closest('[data-act]');
  if (actEl && ACTS[actEl.dataset.act]) { e.preventDefault(); ACTS[actEl.dataset.act](actEl, e); return; }

  const el = e.target.closest('[data-go], [data-toast]');
  if (el) {
    e.preventDefault();
    if (el.dataset.toast) toast(el.dataset.toast);
    if (el.dataset.go) { const d = +(el.dataset.delay || 0); const doGo = () => go(el.dataset.go, el.dataset.tr); d ? setTimeout(doGo, d) : doGo(); }
    return;
  }
  // tap on nothing inside a screen → flash hotspots (like Figma)
  const scr = e.target.closest('#screen');
  if (scr && !e.target.closest('input, textarea, a[href]')) { scr.classList.remove('flash'); void scr.offsetWidth; scr.classList.add('flash'); }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'voiceText') { VOICE.text = e.target.value; const v = document.getElementById('voiceParse'); if (v) v.innerHTML = voiceParseView(VOICE.kind, e.target.value); return; } if (e.target.id === 'admQ') { ADM.q = e.target.value; const pos = e.target.selectionStart; rerender(); const q = document.getElementById('admQ'); q.focus(); q.setSelectionRange(pos, pos); } });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelector('.modal-bg')?.remove();
  if (LIVE.role || !current || current === 'admin' || /input|textarea|select/i.test(e.target.tagName)) return;
  const f = flowOf(current); const i = f.steps.indexOf(current);
  if (e.key === 'ArrowRight' && f.steps[i + 1]) go(f.steps[i + 1]);
  if (e.key === 'ArrowLeft' && f.steps[i - 1]) go(f.steps[i - 1], 'back');
});

// ---------- live updates ----------
function banner(title, body, goTo) { setTimeout(() => showBanner(title, body, goTo), 80); } // after any re-render in the same tick
function showBanner(title, body, goTo) {
  document.querySelectorAll('.ibanner').forEach(x => x.remove());
  const host = document.getElementById('device') || document.querySelector('.device') || document.body;
  const b = document.createElement('div');
  b.className = 'ibanner' + (host === document.body ? ' desk' : '');
  b.innerHTML = `<span class="app"><i class="logo"></i></span><div class="grow"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(title)}</b><span class="tiny" style="color:var(--sys)">now</span></div><div>${esc(body)}</div></div>`;
  b.addEventListener('click', () => { b.remove(); if (goTo === 'admin') location.hash = '#/admin'; else if (goTo) go(goTo, 'up'); });
  host.appendChild(b);
  try { navigator.vibrate?.(180); } catch (e) {}
  setTimeout(() => b.classList.add('out'), 6500); setTimeout(() => b.remove(), 7000);
}
const DEPENDS = { lock: ['sarah', 'ana'], status: ['ana', 'sarah'], owner: ['ana', 'sarah'], 'h-review': ['admin'], admin: ['lena'], suggest: ['sarah', 'ana'], request: ['sarah'], confirmed: ['ana'] };
let livePending = false;
function liveAdminSync() {
  const a = APPLICANTS.find(x => x.id === 'lena'); const le = L('lena'), d = L('admin').lena;
  if (!LIVE.on && !le.appliedAt && !d) return; // solo demo keeps the seeded row
  if (d && d.decision === 'asked' && le.resubmittedAt > d.at) { a.status = 'review'; a.badge = ['Replied · ready to review', 'pbutter']; a.c = ['d', 'd', '2/2', 'd']; a.missing = []; }
  else if (d) {
    a.status = { approved: 'approved', asked: 'waiting', declined: 'declined' }[d.decision];
    a.badge = { approved: ['Approved', 'pgrass'], asked: ['Asked for info', 'fill'], declined: ['Declined', 'prust'] }[d.decision];
  } else if (le.appliedAt) { a.status = 'review'; a.badge = ['New · ready to review', 'pbutter']; a.wait = 0; if (le.wants?.length) a.wants = le.wants; }
  else a.status = 'hidden';
}
onLive((prev) => {
  const dot = document.getElementById('liveDot');
  if (dot) { dot.classList.toggle('on', LIVE.connected); dot.textContent = LIVE.connected ? (LIVE.mode === 'local' ? 'Live · this browser' : 'Live') : 'Connecting…'; }
  if (current === null) {
    if (!LIVE.on || LIVE.role) return;
    if (!prev) { Object.keys(ROLES).forEach(k => document.getElementById('dot-' + k)?.classList.toggle('on', !!isOnline(k))); return; } // heartbeat: just the dots
    const y = window.scrollY; app.innerHTML = renderHub(); drawQRs(); window.scrollTo(0, y); return;
  }
  if (!prev) return; // heartbeat only
  const n = LIVE.data, r = LIVE.role, solo = !LIVE.on;
  // Ana's device turns Sarah's reply to a suggested time into an answer
  if ((r === 'ana' || solo) && n.ana.stage === 'suggested' && n.sarah.suggestReplyAt > (n.ana.suggestedAt || 0) && !(prev.sarah.suggestReplyAt > (prev.ana.suggestedAt || 0))) {
    if (n.sarah.suggestReply === 'accepted') {
      const sg = n.ana.suggest || {};
      act('ana', { stage: 'yes', via: 'web', times: { am: sg.am || '8 am', pm: sg.pm || '6 pm' }, note: n.ana.suggestNote || '', thanks: '$40', answeredAt: Date.now() });
      banner('Wala', `Sarah said ${[sg.am, sg.pm].filter(Boolean).join(' and ')} works ✓ You’re on for Sunday.`, 'confirmed');
      if (current === 'suggest') { go('confirmed'); return; }
    } else banner('Wala', 'Sarah needs to keep 8 am. Could you still do it?', 'suggest');
  }
  if ((r === 'sarah' || solo) && !prev.sarah.danaYesAt && n.sarah.danaYesAt) banner('Wala', 'Dana said yes for Sunday 🎉 Tap to see', 'owner');
  if (r === 'sarah' && prev.ana.stage !== n.ana.stage) {
    if (n.ana.stage === 'suggested') banner('Wala', `Ana can do Sunday, but suggested ${[n.ana.suggest?.am, n.ana.suggest?.pm].filter(Boolean).join(' and ')}`, 'status');
    if (n.ana.stage === 'left') banner('Wala', 'Ana left Bear’s circle', 'status');
  }
  if (r === 'sarah' && !prev.ana.signedAt && n.ana.signedAt) banner('Wala', 'Ana signed the sit agreement ✓', 'owner');
  if (r === 'sarah' && (n.ana.updates || []).length > (prev.ana.updates || []).length) { const u = n.ana.updates.slice(-1)[0]; banner(u.flag ? 'Ana · needs a look' : 'Ana · visit update', u.text, 'owner'); }
  if (r === 'admin' && n.lena.resubmittedAt && n.lena.resubmittedAt !== prev.lena.resubmittedAt) { ADM.tab = 'review'; ADM.sel = 'lena'; banner('Lena replied', 'She signed the agreement and sent it back', 'admin'); }
  if (r === 'ana' && !prev.sarah.askedAt && n.sarah.askedAt && current !== 'lock') banner('Wala', 'Sarah’s asking if you can drop in on Bear this Sunday 🐾', 'thread');
  if (r === 'sarah' && prev.ana.stage !== n.ana.stage) {
    if (n.ana.stage === 'yes') banner('Wala', 'Ana said yes for Sunday 🎉 Tap to see', 'owner');
    if (n.ana.stage === 'declined') banner('Wala', 'Ana can’t make Sunday this time', 'status');
  }
  if (r === 'lena' && (prev.admin.lena?.decision !== n.admin.lena?.decision) && n.admin.lena) {
    banner('Wala', { approved: 'You’re approved as a neighbor helper 🎉', asked: 'Your neighborhood lead has a question', declined: 'An update on your neighbor helper application' }[n.admin.lena.decision], 'h-review');
  }
  if (r === 'admin' && !prev.lena.appliedAt && n.lena.appliedAt) { ADM.tab = 'review'; ADM.sel = 'lena'; banner('New request', 'Lena Park applied to help neighbors in Elmwood', 'admin'); }
  if (r === 'ana' && !prev.sarah.askedAt && n.sarah.askedAt && current === 'lock') { try { navigator.vibrate?.(180); } catch (e) {} }
  // re-render only screens that show another tester's data, and never mid-typing
  const deps = DEPENDS[current];
  if (!deps || deps.every(d => JSON.stringify(prev[d]) === JSON.stringify(n[d]))) return;
  if (/input|textarea|select/i.test(document.activeElement?.tagName || '') && document.activeElement.id !== 'admQ') { livePending = true; return; }
  rerender(); SCREENS[current]?.after?.(document.getElementById('screen'));
});
document.addEventListener('focusout', () => { if (livePending) { livePending = false; setTimeout(rerender, 50); } });

window.addEventListener('hashchange', route);
route();
