// ---------- Live test sessions ----------
// Each role's device owns one slice of state (sarah / ana / lena / admin) and
// broadcasts it. Every device keeps the last slice it saw from the others, so
// an answer stays visible even after that tester closes their phone.
// URL: ?s=K7Q2&as=ana   (no `as` = facilitator view of the session)

const ROLES = {
  sarah: { name: 'Sarah', who: 'Owner · asks her circle', start: 'who', av: 'S', screens: ['who', 'circle', 'invite', 'dana', 'status', 'sit', 'thanks', 'owner', 'handoff', 'vetpay'] },
  ana: { name: 'Ana', who: 'Sarah’s sister · not on the app', start: 'lock', av: 'A', screens: ['lock', 'thread', 'request', 'pick', 'verify', 'confirmed', 'sms', 'decline', 'agreement', 'doorcode', 'suggest', 'stop'] },
  lena: { name: 'Lena', who: 'Neighbor applying to help', start: 'h-invited', av: 'L', screens: ['h-invited', 'h-apply', 'h-review', 'h-agreement'] },
  admin: { name: 'Neighborhood lead', who: 'Reviews new helpers · desktop', start: 'admin', av: 'NL', screens: [] }
};
const SLICES = ['sarah', 'ana', 'lena', 'admin'];

const LIVE = {
  on: false, session: null, role: null, mode: 'off', connected: false,
  data: { sarah: {}, ana: {}, lena: {}, admin: {} },
  seen: {},            // role -> last time we heard from a device in that role
  listeners: [],
  transport: null
};

(function initLive() {
  const q = new URLSearchParams(location.search);
  const s = (q.get('s') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!s) return;
  const as = q.get('as');
  LIVE.on = true; LIVE.session = s; LIVE.role = ROLES[as] ? as : null;
  try { const saved = JSON.parse(localStorage.getItem('wala-live-' + s) || 'null'); if (saved) SLICES.forEach(k => { if (saved[k]) LIVE.data[k] = saved[k]; }); } catch (e) {}
  const cfg = window.WALA_SUPABASE || {};
  if (cfg.url && cfg.key) startSupabase(cfg); else startLocal();
  setInterval(() => emitChange(null), 5000); // refresh "online" dots
})();

function liveSave() { try { localStorage.setItem('wala-live-' + LIVE.session, JSON.stringify(LIVE.data)); } catch (e) {} }
function onLive(fn) { LIVE.listeners.push(fn); }
function emitChange(prev) { LIVE.listeners.forEach(fn => { try { fn(prev); } catch (e) { console.error(e); } }); }
function L(role) { return LIVE.data[role] || {}; }

// set fields on MY slice and broadcast it
function liveSet(patch) {
  if (!LIVE.on || !LIVE.role || LIVE.role === 'facilitator') return;
  const prev = JSON.parse(JSON.stringify(LIVE.data));
  LIVE.data[LIVE.role] = { ...LIVE.data[LIVE.role], ...patch, t: Date.now() };
  liveSave();
  LIVE.transport?.publish(LIVE.data[LIVE.role]);
  emitChange(prev);
}
// write as a given role: live → only from that role's device; solo → straight into the local store
function act(role, patch) {
  if (LIVE.on) { if (LIVE.role === role) liveSet(patch); return; }
  const prev = JSON.parse(JSON.stringify(LIVE.data));
  LIVE.data[role] = { ...LIVE.data[role], ...patch, t: Date.now() };
  emitChange(prev);
}
function actOnce(role, key, extra = {}) { if (!L(role)[key]) act(role, { [key]: Date.now(), ...extra }); }
// record a timestamp only the first time
function liveOnce(key, extra = {}) { if (LIVE.on && LIVE.role && !L(LIVE.role)[key]) liveSet({ [key]: Date.now(), ...extra }); }

function ingest(role, slice, from) {
  if (!SLICES.includes(role) && role !== 'facilitator') return;
  LIVE.seen[role] = Date.now();
  if (!slice || role === 'facilitator' || !SLICES.includes(role)) return;
  if (role === LIVE.role) return; // my own slice is authoritative on this device
  const cur = LIVE.data[role] || {};
  if ((slice.t || 0) <= (cur.t || 0)) return;
  const prev = JSON.parse(JSON.stringify(LIVE.data));
  LIVE.data[role] = slice; liveSave(); emitChange(prev);
}
function isOnline(role) { return role === LIVE.role || (LIVE.seen[role] && Date.now() - LIVE.seen[role] < 12000); }
function myRoleKey() { return LIVE.role || 'facilitator'; }

// ----- transport: same-browser tabs -----
function startLocal() {
  LIVE.mode = 'local';
  if (!('BroadcastChannel' in window)) return;
  const bc = new BroadcastChannel('wala-' + LIVE.session);
  const say = (type) => bc.postMessage({ type, role: myRoleKey(), slice: LIVE.role ? LIVE.data[LIVE.role] : null });
  bc.onmessage = (e) => { const m = e.data || {}; ingest(m.role, m.slice); if (m.type === 'hello') say('slice'); if (m.type !== 'ping') emitChange(null); };
  LIVE.transport = { publish: () => say('slice') };
  LIVE.connected = true;
  say('hello');
  setInterval(() => say('ping'), 4000);
}

// ----- transport: Supabase Realtime (presence + broadcast, no tables) -----
function startSupabase(cfg) {
  LIVE.mode = 'supabase';
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.js';
  s.onload = () => {
    const client = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: false } });
    const key = myRoleKey() + ':' + Math.random().toString(36).slice(2, 8);
    const ch = client.channel('wala-' + LIVE.session.toLowerCase(), { config: { presence: { key }, broadcast: { self: false } } });
    const mine = () => ({ role: myRoleKey(), slice: LIVE.role ? LIVE.data[LIVE.role] : null });
    ch.on('presence', { event: 'sync' }, () => {
      const st = ch.presenceState();
      Object.values(st).forEach(metas => { const m = metas[metas.length - 1]; if (m) ingest(m.role, m.slice); });
      emitChange(null);
    });
    ch.on('broadcast', { event: 'slice' }, ({ payload }) => { ingest(payload.role, payload.slice); emitChange(null); });
    ch.subscribe(async (status) => {
      LIVE.connected = status === 'SUBSCRIBED';
      if (status === 'SUBSCRIBED') await ch.track(mine());
      emitChange(null);
    });
    LIVE.transport = { publish: () => { ch.track(mine()); ch.send({ type: 'broadcast', event: 'slice', payload: mine() }); } };
    setInterval(() => { if (LIVE.connected) ch.track({ ...mine(), at: Date.now() }); }, 8000); // keeps "online" fresh
  };
  s.onerror = () => { LIVE.mode = 'local'; startLocal(); emitChange(null); };
  document.head.appendChild(s);
}

// ----- sessions & links -----
function newSessionCode() { const a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 4; i++) c += a[Math.floor(Math.random() * a.length)]; return c; }
function roleLink(role, s = LIVE.session) { return `${location.origin}${location.pathname}?s=${s}&as=${role}`; }
function facilitatorLink(s = LIVE.session) { return `${location.origin}${location.pathname}?s=${s}`; }

// ----- what happened, in order (for the facilitator's notes) -----
function liveLog() {
  const s = L('sarah'), a = L('ana'), le = L('lena'), ad = L('admin');
  const ev = [];
  const add = (t, who, text) => { if (t) ev.push({ t, who, text }); };
  add(s.askedAt, 'Sarah', `Asked her circle for Nov 28–29${s.askVia === 'voice' ? ' by voice' : ''}`);
  add(a.openedAt, 'Ana', 'Opened the text');
  add(a.webAt, 'Ana', 'Opened the request page');
  add(a.verifiedAt, 'Ana', 'Verified her number');
  if (a.stage === 'yes') add(a.answeredAt, 'Ana', `Said yes by ${a.via || 'web'} · ${visitText(a.visits, a.times)}`);
  if (a.stage === 'declined') add(a.answeredAt, 'Ana', `Said no${a.reason ? ' · ' + a.reason : ''}`);
  if (a.suggestedAt) add(a.suggestedAt, 'Ana', `Suggested ${a.suggest?.am || ''}${a.suggest?.am && a.suggest?.pm ? ' / ' : ''}${a.suggest?.pm || ''} instead`);
  if (s.suggestReplyAt) add(s.suggestReplyAt, 'Sarah', s.suggestReply === 'accepted' ? 'Accepted Ana’s new time' : 'Kept the original time');
  if (a.stage === 'left') add(a.leftAt, 'Ana', 'Left Bear’s circle and stopped texts');
  add(s.sawAnswerAt, 'Sarah', 'Saw Ana’s answer');
  add(s.neighborsAskedAt, 'Sarah', 'Asked neighbors for Sunday');
  add(s.danaYesAt, 'Dana', 'Said yes for Sunday (simulated)');
  add(a.signedAt, 'Ana', 'Signed the sit agreement + vet consent');
  add(a.codeViewedAt, 'Ana', 'Opened the door code');
  (a.updates || []).forEach(u => add(u.at, 'Ana', `Sent a visit update by voice${u.flag ? ' · flagged' : ''}`));
  add(s.sitDoneAt, 'Sarah', 'Finished the first-sit checklist');
  add(s.thanksAt, 'Sarah', `Sent thanks${s.thanksHow ? ' · ' + s.thanksHow : ''}`);
  add(le.joinedAt, 'Lena', 'Joined Bear’s circle');
  add(le.appliedAt, 'Lena', 'Applied to help neighbors');
  if (ad.lena) add(ad.lena.at, 'Lead', { approved: 'Approved Lena', asked: 'Asked Lena for more info', declined: 'Declined Lena' }[ad.lena.decision]);
  add(le.sawDecisionAt, 'Lena', 'Saw the lead’s decision');
  add(le.resubmittedAt, 'Lena', 'Signed the agreement and sent it back');
  return ev.sort((x, y) => x.t - y.t);
}
function visitText(v, times) { const am = times?.am || '8 am', pm = times?.pm || '6 pm'; if (!v) return `${am} + ${pm}`; return v.am && v.pm ? `${am} + ${pm}` : v.am ? am : v.pm ? pm : 'no visits'; }
function fmtDur(ms) { const s = Math.round(ms / 1000); return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`; }
function fmtClock(t) { return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' }); }

// ----- facilitator panel (hub when ?s= has no role) -----
function renderSessionPanel() {
  const log = liveLog();
  const modeNote = LIVE.mode === 'supabase'
    ? `<span class="pill pgrass sm">${icon('check', 12)}Syncing across devices</span>`
    : `<span class="pill pbutter sm">${icon('info', 12)}Local mode: syncs between tabs in this browser only. Add Supabase keys in config.js for phones.</span>`;
  return `<section class="live-panel">
    <div class="live-head">
      <div><div class="lbl">Live test session</div><h2 class="live-code">${LIVE.session}</h2>${modeNote}</div>
      <div class="live-actions"><button class="btn ghost sm" data-act="copyLinks">Copy all links</button><button class="btn sm" data-act="newSession">Start a new session</button></div>
    </div>
    <p class="muted" style="margin:8px 0 0">Open one link per device. Each tester only sees their own part, and what they do shows up on the others live.</p>
    <div class="live-roles">${Object.entries(ROLES).map(([k, r]) => `
      <div class="live-role">
        <div class="rowx c">${av(r.av, 's36 ' + (k === 'admin' ? 'blue' : k === 'lena' ? 'blue' : ''))}<div class="grow"><div class="strong">${r.name}</div><div class="sub">${r.who}</div></div>
          <span class="dot ${isOnline(k) ? 'on' : ''}" id="dot-${k}" title="${isOnline(k) ? 'Connected' : 'Not connected'}"></span></div>
        <div class="qr" id="qr-${k}" aria-label="QR code for ${r.name}’s link"></div>
        <div class="live-link"><input readonly value="${roleLink(k)}" id="link-${k}" aria-label="${r.name}’s link"><button class="pill sm" data-act="copyLink" data-k="${k}">Copy</button></div>
        <a class="link" href="${roleLink(k)}" target="_blank" rel="noopener" style="font-size:13px">Open here in a new tab →</a>
      </div>`).join('')}</div>
    <div class="live-log">
      <div class="rowx c" style="justify-content:space-between"><div class="lbl">What happened</div>${log.length ? `<button class="pill sm" data-act="copyLog">Copy log</button>` : ''}</div>
      ${log.length ? `<ol>${log.map((e, i) => `<li><span class="tm">${fmtClock(e.t)}</span><span class="who">${e.who}</span><span class="what">${e.text}</span><span class="gap">${i ? '+' + fmtDur(e.t - log[i - 1].t) : ''}</span></li>`).join('')}</ol>`
        : `<div class="muted small" style="margin-top:8px">Nothing yet. Steps appear here with timestamps as testers move through.</div>`}
    </div>
  </section>`;
}
function drawQRs() {
  if (!document.querySelector('.qr')) return;
  const go = () => Object.keys(ROLES).forEach(k => { const el = document.getElementById('qr-' + k); if (el && !el.dataset.done) { el.dataset.done = 1; new QRCode(el, { text: roleLink(k), width: 112, height: 112, colorDark: '#3A1D10', colorLight: '#ffffff' }); } });
  if (window.QRCode) return go();
  if (document.getElementById('qrlib')) return;
  const s = document.createElement('script'); s.id = 'qrlib';
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  s.onload = go; document.head.appendChild(s);
}
function logText() { return liveLog().map((e, i, a) => `${fmtClock(e.t)}  ${e.who}: ${e.text}${i ? `  (+${fmtDur(e.t - a[i - 1].t)})` : ''}`).join('\n'); }
async function copyText(text, done) {
  try { await navigator.clipboard.writeText(text); toast(done); }
  catch (e) { toast('Couldn’t copy — select the text and copy it instead'); }
}
