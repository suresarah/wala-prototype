// ---------- Admin · onboarding requests ----------
// checks: d = done, w = waiting, t = to do, x = problem
const APPLICANTS = [
  { id: 'lena', ini: 'LP', name: 'Lena Park', area: 'Elmwood · 4 blocks', type: 'Neighbor', c: ['d', 'd', '2/2', 'w'], wait: 1, status: 'review', badge: ['Ready to review', 'pbutter'],
    circle: 'Already in 1 circle (Sarah · Bear)', wants: ['Drop-ins', 'Walks', 'My block + people I know'],
    vouches: [['M', 'Megan Lee', 'Knows her 6 yrs · neighbor', '“Lena has watched our cats every summer.”', '14 months'], ['P', 'Priya Shah', 'Knows her 2 yrs · dog park', '“Reliable, calm with anxious dogs.”', '8 months']],
    note: 'Approve once agreement is signed. Good fit for the Dec 19–26 gap on Linden St.', missing: ['agmt'] },
  { id: 'rosa', ini: 'RG', name: 'Rosa Gómez', area: 'Elmwood · 2 blocks', type: 'Neighbor', c: ['d', 'd', '2/2', 'd'], wait: 2, status: 'review', badge: ['Ready to review', 'pbutter'],
    wants: ['Walks', 'Feeding', 'Anyone vouched within a mile'], vouches: [['D', 'Dana Ruiz', 'Knows her 4 yrs · neighbor', '“Rosa is the first person I call.”', '11 months'], ['O', 'Omar Khan', 'Knows her 1 yr · block party', '“Great with big dogs.”', '6 months']], note: '', missing: [] },
  { id: 'theo', ini: 'TB', name: 'Theo Brandt', area: 'Riverside', type: 'Pro sitter', c: ['d', 'd', '—', 'd'], wait: 2, status: 'review', badge: ['Background check', 'fill'],
    wants: ['Overnights', 'Meds', 'Boarding'], vouches: [], note: 'Background check vendor ETA Thu.', missing: ['bg'] },
  { id: 'kemi', ini: 'KN', name: 'Kemi Nwosu', area: 'Elmwood · 6 blocks', type: 'Neighbor', c: ['d', 'w', '1/2', 't'], wait: 3, status: 'review', badge: ['Waiting on vouch', 'fill'],
    wants: ['Drop-ins', 'Only people I know'], vouches: [['C', 'Chris Alvarez', 'Knows her 3 yrs · coworker', '“Super dependable.”', '9 months']], note: '', missing: ['addr', 'vouch', 'agmt'] },
  { id: 'sam', ini: 'SO', name: 'Sam Ortiz', area: 'Elmwood · 1 block', type: 'Neighbor', c: ['x', 'd', '2/2', 't'], wait: 3, status: 'review', badge: ['ID mismatch', 'prust'],
    wants: ['Walks', 'My block + people I know'], vouches: [['M', 'Megan Lee', 'Knows him 2 yrs · neighbor', '“Walks his own lab twice a day.”', '14 months'], ['MR', 'Marcus Reed', 'Knows him 1 yr · climbing gym', '“Kind and on time.”', '1 month']],
    note: 'License says Samuel Ortiz-Reyes. Probably fine — confirm with him.', missing: ['id', 'agmt'] },
  { id: 'june', ini: 'JW', name: 'June Walsh', area: 'Hillcrest', type: 'Pro sitter', c: ['d', 'd', '—', 'w'], wait: 4, status: 'review', badge: ['Needs bond proof', 'fill'], wants: ['Boarding', 'House sitting'], vouches: [], note: '', missing: ['bond'] },
  { id: 'marco', ini: 'MB', name: 'Marco Bell', area: 'Elmwood · 3 blocks', type: 'Neighbor', c: ['d', 'd', '0/2', 't'], wait: 5, status: 'review', badge: ['Waiting on vouch', 'fill'], wants: ['Drop-ins'], vouches: [], note: 'Nudge — no vouches after 5 days.', missing: ['vouch', 'agmt'] },
  { id: 'aiko', ini: 'AY', name: 'Aiko Yamada', area: 'Outside pilot area', type: 'Neighbor', c: ['d', 'x', '1/2', 't'], wait: 5, status: 'review', badge: ['Outside area', 'prust'], wants: ['Walks'], vouches: [['P', 'Priya Shah', 'Knows her 5 yrs · friend', '“Lovely with senior dogs.”', '8 months']], note: 'Lives 2.4 mi out. Waitlist for the next neighborhood?', missing: ['addr'] },
  { id: 'pat', ini: 'PH', name: 'Pat Hughes', area: 'Elmwood · 5 blocks', type: 'Neighbor', c: ['d', 'd', '2/2', 'd'], wait: 6, status: 'review', badge: ['Ready to review', 'pbutter'], wants: ['Feeding', 'Overnights'], vouches: [['D', 'Dana Ruiz', 'Knows him 3 yrs', '“Retired vet tech!”', '11 months'], ['M', 'Megan Lee', 'Knows him 8 yrs', '“The neighborhood dog whisperer.”', '14 months']], note: '', missing: [] },
  { id: 'gus', ini: 'GE', name: 'Gus Erikson', area: 'Riverside', type: 'Pro sitter', c: ['d', 'd', '—', 'd'], wait: 6, status: 'review', badge: ['Ready to review', 'pbutter'], wants: ['Boarding', 'Meds'], vouches: [], note: '', missing: [] },
  { id: 'nia', ini: 'NB', name: 'Nia Brooks', area: 'Elmwood · 2 blocks', type: 'Neighbor', c: ['d', 'd', '1/2', 'w'], wait: 2, status: 'waiting', badge: ['Asked for info', 'fill'], wants: ['Walks'], vouches: [], note: 'Asked Mon for a second vouch.', missing: ['vouch'] },
  { id: 'eli', ini: 'EW', name: 'Eli Ward', area: 'Hillcrest', type: 'Pro sitter', c: ['d', 'd', '—', 'w'], wait: 4, status: 'waiting', badge: ['Asked for info', 'fill'], wants: ['Boarding'], vouches: [], note: '', missing: ['bond'] },
  { id: 'dana', ini: 'DR', name: 'Dana Ruiz', area: 'Elmwood · 3 blocks', type: 'Neighbor', c: ['d', 'd', '2/2', 'd'], wait: 0, status: 'approved', badge: ['Approved', 'pgrass'], wants: ['Drop-ins', 'Walks', 'Feeding'], vouches: [], note: '', missing: [] },
  { id: 'omar', ini: 'OK', name: 'Omar Khan', area: 'Elmwood · 0.6 mi', type: 'Neighbor', c: ['d', 'd', '2/2', 'd'], wait: 0, status: 'approved', badge: ['Approved', 'pgrass'], wants: ['Walks'], vouches: [], note: '', missing: [] },
  { id: 'rex', ini: 'RT', name: 'Rex Tan', area: 'Outside pilot area', type: 'Neighbor', c: ['d', 'x', '0/2', 't'], wait: 0, status: 'declined', badge: ['Declined', 'prust'], wants: [], vouches: [], note: 'Outside area, no vouches.', missing: [] }
];
const MISSING = { id: 'ID name doesn’t match application', addr: 'Address proof unclear or outside pilot area', vouch: 'Need another vouch', agmt: 'Sit agreement not signed', bg: 'Background check pending', bond: 'Proof of bond / insurance' };
const ADM = { tab: 'review', sel: 'lena', q: '' };

function admRows() {
  return APPLICANTS.filter(a => a.status === ADM.tab && (!ADM.q || a.name.toLowerCase().includes(ADM.q.toLowerCase())));
}
function admCell(v) {
  if (v === 'd') return chk('done'); if (v === 'w') return chk('wait'); if (v === 't') return chk(''); if (v === 'x') return chk('bad');
  return `<b style="font-weight:500;${v === '0/2' ? 'color:var(--rust)' : ''}">${v}</b>`;
}
function renderAdmin() {
  liveAdminSync();
  const count = s => APPLICANTS.filter(a => a.status === s).length;
  const rows = admRows();
  if (!rows.find(r => r.id === ADM.sel)) ADM.sel = rows[0]?.id || null;
  const a = APPLICANTS.find(x => x.id === ADM.sel);
  return `<div class="adm-wrap">
  ${LIVE.role ? roleBar() : `<div class="vbar"><a class="home" href="#/">${icon('back', 18)}All flows</a><div class="crumb"><b>Pilot admin</b> <span>· onboarding requests · try Approve, Ask for info, Decline</span></div></div>`}
  <div class="adm-scroll"><div class="adm">
    <aside class="adm-side">
      <div class="brand"><i class="logo"></i><div class="lbl">Pilot admin · Elmwood</div></div>
      <nav class="adm-nav">${[['house', 'Overview'], ['people', 'Onboarding requests', count('review')], ['paw', 'Helpers & sitters'], ['calendar', 'Upcoming sits'], ['notes', 'Agreements & consent', 3], ['alert', 'Incidents'], ['shield', 'Coverage']]
        .map(([i, t, n]) => `<a class="${t === 'Onboarding requests' ? 'on' : ''}" ${t === 'Onboarding requests' ? '' : `data-toast="${t} isn’t part of this prototype"`}>${icon(i, 18)}${t}${n ? `<span class="cnt">${n}</span>` : ''}</a>`).join('')}</nav>
      <div class="adm-me">${av('NL', 's32 blue')}<div><div class="strong" style="font-size:13px">You</div><div class="tiny" style="color:var(--peri-pale)">Neighborhood lead</div></div></div>
    </aside>
    <main class="adm-main">
      <div class="adm-head"><div><h1>Onboarding requests</h1><div class="muted" style="margin-top:4px">Neighbor helpers and pro sitters waiting to be visible in Elmwood</div></div>
        <label class="adm-search">${icon('search', 16)}<input id="admQ" placeholder="Search name" value="${ADM.q}"></label></div>
      <div class="stats">
        <div class="stat hl"><b>${count('review')}</b><span class="small muted">In review</span></div>
        <div class="stat"><b>${APPLICANTS.filter(x => x.status === 'review' && /vouch/i.test(x.badge[0])).length + count('waiting')}</b><span class="small muted">Waiting on vouches or info</span></div>
        <div class="stat"><b>1.6 d</b><span class="small muted">Median time to approve</span></div>
        <div class="stat peri"><b>${21 + count('approved')} / 30</b><span class="small muted">Helpers ready for Christmas sits</span></div>
      </div>
      <div class="tabs">${[['review', 'Needs review'], ['waiting', 'Waiting on applicant'], ['approved', 'Approved'], ['declined', 'Declined']].map(([k, t]) => `<button class="${ADM.tab === k ? 'on' : ''}" data-act="admTab" data-k="${k}">${t}<span class="n">${count(k)}</span></button>`).join('')}</div>
      <div class="filters">${pill('Type: all', 'white lg')}${pill('Area: Elmwood', 'white lg')}${pill('Check: any', 'white lg')}${pill('Oldest first', 'white lg')}</div>
      <div class="tbl">${rows.length ? `<table>
        <thead><tr><th>Applicant</th><th>Type</th><th>ID</th><th>Addr</th><th>Vouch</th><th>Agmt</th><th>Waiting</th><th>Status</th></tr></thead>
        <tbody>${rows.map(r => `<tr class="${r.id === ADM.sel ? 'sel' : ''}" data-act="admSel" data-k="${r.id}">
          <td><div class="rowx c">${av(r.ini, 's36 ' + (r.type === 'Pro sitter' ? 'pterra' : r.id === ADM.sel ? 'white' : 'blue'))}<div><div class="strong">${r.name}</div><div class="sub">${r.area}</div></div></div></td>
          <td>${r.type}</td>${r.c.map(v => `<td>${admCell(v)}</td>`).join('')}
          <td class="${r.wait >= 5 ? 'late' : ''}">${r.wait ? r.wait + 'd' : r.status === 'review' ? 'just now' : '—'}</td><td>${pill(r.badge[0], 'sm ' + r.badge[1])}</td></tr>`).join('')}</tbody></table>
        <div class="tbl-foot">Waiting 5+ days turns red — the pilot promises an answer within a week.</div>` : `<div class="empty">Nothing here right now.</div>`}</div>
    </main>
    <aside class="drawer">${a ? drawer(a) : '<div class="empty">Select a request</div>'}</aside>
  </div></div></div>`;
}
function drawer(a) {
  const idRows = [[a.c[0], a.c[0] === 'x' ? 'ID name doesn’t match application' : 'ID matches name & selfie', a.c[0] === 'x' ? 'License: Samuel Ortiz-Reyes' : 'Driver’s license · 98% face match'],
    [a.c[1], a.c[1] === 'x' ? 'Address outside the pilot area' : a.c[1] === 'w' ? 'Address proof in review' : 'Address in Elmwood pilot area', a.c[1] === 'x' ? '2.4 mi from the Elmwood boundary' : 'Utility bill · matched to ID']];
  const st = s => s === 'd' ? 'done' : s === 'w' ? 'wait' : s === 'x' ? 'bad' : '';
  const pro = a.type === 'Pro sitter';
  return `
    <div class="small muted">Request #N-0${142 + APPLICANTS.indexOf(a)}</div>
    <div class="rowx c" style="margin-top:12px">${av(a.ini, 's56 ' + (pro ? 'pterra' : 'blue'))}<div><div class="h2" style="font-size:22px">${a.name}</div><div class="sub" style="font-size:13px">${a.type} · ${a.area}</div></div></div>
    <div class="pills" style="margin-top:14px">${pill(a.badge[0], 'sm ' + a.badge[1])}${a.circle ? pill(a.circle, 'sm', 'people') : ''}</div>
    <div class="sec"><span class="lbl">Identity</span><div class="box2">${idRows.map(([s, t, d]) => `<div class="rowx">${chk(st(s))}<div><div class="strong" style="font-size:13px">${t}</div><div class="tiny muted">${d}</div></div></div>`).join('')}</div></div>
    ${pro ? `<div class="sec"><span class="lbl">Pro checks</span><div class="box2">
        <div class="rowx">${chk(a.missing.includes('bg') ? 'wait' : 'done')}<div><div class="strong" style="font-size:13px">Background check</div><div class="tiny muted">${a.missing.includes('bg') ? 'Vendor ETA Thu' : 'Clear · Oct 9'}</div></div></div>
        <div class="rowx">${chk(a.missing.includes('bond') ? 'wait' : 'done')}<div><div class="strong" style="font-size:13px">Insured & bonded</div><div class="tiny muted">${a.missing.includes('bond') ? 'Bond certificate not uploaded' : 'Certificate on file'}</div></div></div></div></div>`
      : `<div class="sec"><span class="lbl">Vouches · ${a.vouches.length} of 2</span><div class="box2">${a.vouches.length ? a.vouches.map(([i, n, rel, q, m]) => `<div class="rowx">${av(i, 's32')}<div><div class="strong" style="font-size:13px">${n}</div><div class="tiny muted">${rel}</div><div class="tiny" style="margin-top:2px">${q}</div><div class="tiny" style="color:var(--grass);font-weight:500;margin-top:2px">Active member · ${m} · 0 flags</div></div></div>`).join('') : '<div class="tiny muted">No vouches yet.</div>'}</div></div>`}
    ${a.wants.length ? `<div class="sec"><span class="lbl">Wants to help with</span><div class="pills">${a.wants.map(w => pill(w, 'sm')).join('')}</div></div>` : ''}
    <div class="sec"><span class="lbl">Paperwork & cover</span><div class="box2">
      <div class="rowx">${chk(st(a.c[3]))}<div><div class="strong" style="font-size:13px">Sit agreement + house rules</div><div class="tiny muted">${a.c[3] === 'd' ? 'Signed' : a.c[3] === 'w' ? 'Sent Wed · not signed yet' : 'Not sent yet'}</div></div></div>
      <div class="rowx">${chk('done')}<div><div class="strong" style="font-size:13px">Pet-in-care cover</div><div class="tiny muted">Added to pilot policy on approval (placeholder)</div></div></div></div></div>
    ${a.note ? `<div class="sec"><span class="lbl">Internal note</span><div class="note">${a.note}</div></div>` : ''}
    ${a.status === 'review' || a.status === 'waiting' ? `
    <div class="tiny muted" style="margin-top:16px">Approving makes ${a.name.split(' ')[0]} askable by Elmwood owners${pro ? '' : ' who know their vouchers'}.</div>
    <div class="acts"><button class="btn" style="flex:1.4" data-act="admApprove">Approve</button><button class="btn ghost" style="flex:1" data-act="admAsk">Ask for info</button><button class="btn danger" style="flex:.8" data-act="admDecline">Decline</button></div>`
    : `<div class="acts"><button class="btn ghost" data-act="admUndo">Move back to review</button></div>`}`;
}
function askModal(a) {
  const keys = Object.keys(MISSING);
  const first = a.name.split(' ')[0];
  const lines = a.missing.map(k => MISSING[k].toLowerCase());
  const msg = `Hi ${first} — thanks for applying to help in Elmwood! ${lines.length ? `Before we can approve you we need: ${lines.join('; ')}.` : 'Just a couple of quick questions before we approve you.'} Reply here any time. — Elmwood neighborhood lead`;
  return `<div class="modal-bg" data-act="admClose"><div class="modal" role="dialog" aria-modal="true">
    <h2 class="h1" style="font-size:24px">Ask ${a.name} for more info</h2>
    <div class="muted" style="margin-top:6px">Sent as a text and in-app. Their request pauses until they reply.</div>
    <div class="lbl" style="margin-top:20px;display:block">What’s missing</div>
    <div class="opts">${keys.map(k => `<div class="mopt ${a.missing.includes(k) ? 'on' : ''}" data-act="admMiss" data-k="${k}"><span class="box ${a.missing.includes(k) ? 'on' : ''}">${a.missing.includes(k) ? icon('check', 14) : ''}</span>${MISSING[k]}</div>`).join('')}</div>
    <div class="lbl" style="margin-top:20px;display:block">Message</div>
    <textarea class="field" id="askMsg" style="background:var(--canvas);min-height:110px;margin-top:8px">${msg}</textarea>
    <div class="pills" style="margin-top:12px">${pill('Auto-reminder in 3 days', 'sm', 'clock')}${pill('Vouchers not notified', 'sm', 'people')}</div>
    <div class="mfoot"><button class="btn ghost sm" data-act="admClose">Cancel</button><button class="btn sm" data-act="admSendAsk">Send to ${first}</button></div>
  </div></div>`;
}

// Decline is irreversible for the applicant, so it gets a reason and a note they'll actually read
const DECLINE_REASONS = { area: 'Lives outside the pilot area', id: 'We couldn’t verify their ID', vouch: 'No vouches after two weeks', other: 'Something else' };
function declineModal(a) {
  const first = a.name.split(' ')[0];
  const k = STATE.declineReason || (a.c[1] === 'x' ? 'area' : a.c[0] === 'x' ? 'id' : 'vouch');
  const notes = {
    area: `Hi ${first} — thank you for offering to help. Wala’s pilot only covers Elmwood for now, so we can’t add you yet. We’ll text you when we open your neighborhood.`,
    id: `Hi ${first} — thank you for applying. We couldn’t match your ID to your application, so we can’t add you as a neighbor helper right now. Reply here if you’d like to try again.`,
    vouch: `Hi ${first} — thanks for applying. Neighbor helpers need two vouches from active members, and we haven’t received them. You can apply again anytime.`,
    other: `Hi ${first} — thank you for applying. We can’t add you as a neighbor helper right now.`
  };
  return `<div class="modal-bg" data-act="admClose"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="declineTitle">
    <h2 class="h1" id="declineTitle" style="font-size:24px">Decline ${esc(a.name)}?</h2>
    <div class="muted" style="margin-top:6px">They’ll get this note by text. Their vouchers aren’t told. You can move them back to review later.</div>
    <div class="lbl" style="margin-top:20px;display:block">Reason (only the pilot team sees this)</div>
    <div class="opts">${Object.entries(DECLINE_REASONS).map(([key, t]) => `<div class="mopt ${key === k ? 'on' : ''}" data-act="admDeclineReason" data-k="${key}"><span class="radio" style="${key === k ? 'background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),inset 0 0 0 5px var(--white)' : ''}"></span>${t}</div>`).join('')}</div>
    <div class="lbl" style="margin-top:20px;display:block">Note to ${esc(first)}</div>
    <textarea class="field" id="declineMsg" style="background:var(--canvas);min-height:96px;margin-top:8px">${esc(notes[k])}</textarea>
    <div class="mfoot"><button class="btn ghost sm" data-act="admClose">Cancel</button><button class="btn danger sm" data-act="admDeclineConfirm">Decline and send note</button></div>
  </div></div>`;
}
