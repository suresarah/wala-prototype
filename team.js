// ---------- Wala · team view of submitted profiles ----------
// Sign in with an email link. Only emails in public.team_members can read profiles (see supabase/profiles.sql).
const CFG = window.WALA_SUPABASE || {};
const root = document.getElementById('team');
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let sb, rows = [], filter = 'all';
const pill = (t, cls = '') => `<span class="pill ${cls}">${t}</span>`;

function shell(inner) {
  root.innerHTML = `<div class="hub-top"><span class="hub-mark"><i class="logo"></i></span><div><h1 style="font-size:34px;margin:0">Profiles from testers</h1>
    <p class="hub-sub">Everything people entered at <b>profile.html</b>. Only the Wala team can see this page.</p></div></div>${inner}`;
}

async function init() {
  if (!CFG.url || !CFG.key) {
    return shell(`<div class="card pbutter" style="max-width:640px"><div class="h2">Not connected yet</div>
      <p>Profiles are saved to Supabase once <code>config.js</code> has your project’s URL and public key. Setup steps are in the README under “Collect tester profiles”.</p></div>`);
  }
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  sb = window.supabase.createClient(CFG.url, CFG.key);
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return signIn();
  load(session.user.email);
}

function signIn(sent) {
  shell(`<div class="card" style="max-width:480px"><div class="h2">Sign in</div>
    <p class="muted" style="margin:6px 0 14px">We’ll email you a sign-in link. Only team emails added in Supabase can see profiles.</p>
    ${sent ? `<div class="card pgrass">Check <b>${esc(sent)}</b> for the link, then open it on this device.</div>` : `<input class="field" id="em" type="email" autocomplete="email" placeholder="you@example.com" style="background:var(--canvas)">
    <button class="btn" style="margin-top:12px" id="go">Email me a link</button>`}</div>`);
  document.getElementById('go')?.addEventListener('click', async () => {
    const email = document.getElementById('em').value.trim(); if (!email) return;
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } });
    if (error) return alertBox(error.message);
    signIn(email);
  });
}
function alertBox(m) { root.insertAdjacentHTML('beforeend', `<div class="card prust" style="margin-top:12px;max-width:640px">${esc(m)}</div>`); }

async function load(email) {
  shell(`<p class="muted">Loading…</p>`);
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) return shell(`<div class="card prust">${esc(error.message)}</div>`);
  rows = data || [];
  if (!rows.length) {
    const { count } = await sb.from('profiles').select('id', { count: 'exact', head: true });
    return shell(`<div class="team-bar"><span class="muted">Signed in as ${esc(email)}</span><button class="btn ghost sm" id="out">Sign out</button></div>
      <div class="card pbutter" style="margin-top:16px;max-width:640px"><div class="h2">No profiles to show</div><p>Either nobody has submitted yet, or <b>${esc(email)}</b> isn’t in the <code>team_members</code> table. Add it in Supabase (SQL Editor) and reload.</p></div>`), bindOut();
  }
  const paths = rows.flatMap(r => r.photos || []);
  const urls = {};
  if (paths.length) { const { data: s } = await sb.storage.from('profile-photos').createSignedUrls(paths, 3600); (s || []).forEach(x => { if (x.signedUrl) urls[x.path] = x.signedUrl; }); }
  draw(email, urls);
}

function draw(email, urls) {
  const show = rows.filter(r => filter === 'all' || r.role === filter);
  const n = (role) => rows.filter(r => r.role === role).length;
  shell(`<div class="team-bar">
      <div class="pills">${[['all', `All · ${rows.length}`], ['owner', `Pet owners · ${n('owner')}`], ['helper', `Helpers · ${n('helper')}`]].map(([k, t]) => `<button class="pill lg ${filter === k ? 'ink' : 'white'}" data-f="${k}">${t}</button>`).join('')}</div>
      <span class="grow"></span><button class="btn ghost sm" id="csv">Download CSV</button><button class="btn ghost sm" id="json">Download JSON</button>
      <span class="small muted">${esc(email)}</span><button class="btn ghost sm" id="out">Sign out</button></div>
    <div class="team-grid">${show.map(r => card(r, urls)).join('')}</div>`);
  root.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; draw(email, urls); });
  document.getElementById('csv').onclick = () => dl('wala-profiles.csv', toCSV(show), 'text/csv');
  document.getElementById('json').onclick = () => dl('wala-profiles.json', JSON.stringify(show, null, 2), 'application/json');
  bindOut();
}
function bindOut() { const b = document.getElementById('out'); if (b) b.onclick = async () => { await sb.auth.signOut(); signIn(); }; }

function card(r, urls) {
  const d = r.data || {}, y = d.you || {};
  const when = new Date(r.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const line = (k, v) => v && (!Array.isArray(v) || v.length) ? `<div class="small"><span class="muted">${k}:</span> ${esc(Array.isArray(v) ? v.join(', ') : v)}</div>` : '';
  const body = r.role === 'helper'
    ? line('Does', d.helper?.services) + line('Animals', d.helper?.animals) + line('Days', d.helper?.days) + line('Thanks', d.helper?.thanks) + line('ID / background', [d.helper?.idOk, d.helper?.bgOk].filter(Boolean).join(' / ')) + line('Bio', d.helper?.bio)
    : (d.pets || []).map(p => line(p.name || 'Pet', [p.type, p.breed, p.age].filter(Boolean).join(' · ') + (p.line ? ` — “${p.line}”` : ''))).join('') + line('Needs', d.need?.services) + line('Ask first', d.need?.first) + line('Budget', d.need?.budget) + line('Circle', (d.circle || []).map(c => c.name));
  return `<article class="team-card">
    <div class="rowx c"><div class="grow"><div class="ttl lg">${esc(r.first_name || y.first)} ${esc(y.last || '')}</div><div class="tiny muted">${when} · ZIP ${esc(r.zip)}${y.neighborhood ? ' · ' + esc(y.neighborhood) : ''}</div></div>${pill(r.role === 'helper' ? 'Helper' : 'Pet owner', r.role === 'helper' ? 'pblue sm' : 'pbutter sm')}</div>
    ${(r.photos || []).length ? `<div class="ph">${r.photos.map(p => urls[p] ? `<img src="${urls[p]}" alt="">` : '').join('')}</div>` : ''}
    ${body}
    ${line('Contact', [y.phone, y.email].filter(Boolean).join(' · ') + (d.feedback?.followUp ? '' : ' (no follow-up)'))}
    ${line('Feedback', d.feedback?.confusing)}
    <details><summary>All answers</summary><pre>${esc(JSON.stringify(d, null, 2))}</pre></details>
  </article>`;
}

function flat(o, pre = '', out = {}) { for (const [k, v] of Object.entries(o || {})) { const key = pre ? pre + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out); else out[key] = Array.isArray(v) ? (v.length && typeof v[0] === 'object' ? JSON.stringify(v) : v.join('; ')) : v; } return out; }
function toCSV(list) {
  const recs = list.map(r => ({ created_at: r.created_at, role: r.role, first_name: r.first_name, zip: r.zip, photos: (r.photos || []).length, ...flat(r.data) }));
  const cols = [...new Set(recs.flatMap(Object.keys))];
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.map(q).join(','), ...recs.map(r => cols.map(c => q(r[c])).join(','))].join('\n');
}
function dl(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); }

init().catch(e => shell(`<div class="card prust">${esc(e.message || e)}</div>`));
