// ---------- Zero state: #/z (pick a user type) · #/z/<screen> · #/z/z-lead (desktop) ----------
// What each kind of user sees on day one, before anything has happened: a new pet owner, a new helper,
// a friend who was just added to a circle, and a neighborhood lead with an empty queue.
// Main buttons do small believable things (add a pet, send an invite, turn on alerts) so the empty
// states fill in a little as people try them. Same realistic chrome as tester / explore mode.

const ZMODE = () => /^#\/z(\/|$)/.test(location.hash);
const ZS = { pet: null, kind: 'Dog', invites: 0, neighborInvites: 0, helperShared: 0, days: [], fAlerts: true, oAlerts: true };
let ZWHO = null; try { ZWHO = sessionStorage.getItem('wala-zwho'); } catch (e) {}

const ZTYPES = [
  { k: 'owner', who: 'sarah', start: 'z-o-home', title: 'New pet owner', what: 'Just signed up. No pet, circle, requests or messages yet.' },
  { k: 'helper', who: 'dana', start: 'z-h-today', title: 'New helper', what: 'Just joined to help neighbors. No visits, asks or earnings yet.' },
  { k: 'friend', who: 'ana', start: 'z-f-lock', title: 'Friend added to a circle', what: 'Not on the app. Added to Bear’s circle, but nobody has asked for anything yet.' },
  { k: 'lead', who: 'lead', start: 'z-lead', title: 'Neighborhood lead', what: 'Runs the Elmwood pilot on a laptop. Nobody has applied yet.' }
];
const ZPEOPLE = { lead: { name: 'Lead', phone: 'Lead’s laptop', av: 'NL', cls: 'blue' } };
const zPerson = (k) => PEOPLE[k] || ZPEOPLE[k] || PEOPLE.sarah;

// ---- building blocks ----
const zEmpty = (ic, title, text, cta = '') => `<div class="card zempty"><span class="ring zring">${icon(ic, 26)}</span><div class="ttl lg">${title}</div><div class="sub">${text}</div>${cta}</div>`;
const zDash = (n = 3) => `<div class="zdash">${Array.from({ length: n }, () => `<span>${icon('user', 16)}</span>`).join('')}</div>`;
const zNavO = (on) => `<nav class="navbar">${[['house', 'Home', 'z-o-home'], ['people', 'Neighbors', 'z-o-neighbors'], ['paw', ZS.pet || 'Pet', 'z-o-pet'], ['message', 'Messages', 'z-o-msgs'], ['user', 'Profile', 'z-o-profile']]
  .map(([i, n, g]) => `<a class="${g === on ? 'on' : ''}" data-go="${g}" data-tr="fade"><span class="ico">${icon(i, 18)}</span>${esc(n)}</a>`).join('')}</nav>`;
const zNavH = (on) => `<nav class="navbar">${[['house', 'Today', 'z-h-today'], ['message', 'Messages', 'z-h-msgs'], ['calendar', 'Schedule', 'z-h-sched'], ['money', 'Earnings', 'z-h-earn'], ['user', 'Account', 'z-h-acct']]
  .map(([i, n, g]) => `<a class="${g === on ? 'on' : ''}" data-go="${g}" data-tr="fade"><span class="ico">${icon(i, 18)}</span>${n}</a>`).join('')}</nav>`;
const zToday = () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
const zRow = (ic, t, s, right = icon('next', 16), attrs = '') => `<div class="rowx c ${attrs ? 'tap' : ''}" ${attrs}><span class="ring" style="width:36px;height:36px;background:var(--fill)">${icon(ic, 16)}</span><div class="grow"><div class="strong">${t}</div>${s ? `<div class="sub">${s}</div>` : ''}</div>${right}</div>`;

Object.assign(SCREENS, {
  // ===== New pet owner =====
  'z-o-home': {
    name: 'Owner · home, day one', render: () => `<div class="s">
    <div class="body">
      <div class="rowx c"><div class="grow"><div class="small muted">${zToday()}</div><div class="h1">Welcome, Sarah</div></div>${av('S', 'pbutter')}</div>
      ${ZS.pet
        ? `<div class="card rowx c tap" data-go="z-o-pet" style="margin-top:16px"><span class="ring" style="width:48px;height:48px;background:var(--pbutter)">${icon('paw', 22)}</span><div class="grow"><div class="ttl lg">${esc(ZS.pet)}</div><div class="sub">${esc(ZS.kind)} · care plan not started</div></div>${icon('next', 16)}</div>`
        : `<div class="card pbutter zstart" style="margin-top:16px"><div class="ttl lg">Start with your pet</div><div class="sub" style="color:var(--ink)">A name is enough for now. Care details can wait until someone’s actually helping.</div><button class="btn" data-go="z-o-pet" style="margin-top:12px">${icon('paw', 18)}Add your pet</button></div>`}
      <div class="lbl">Your circle</div>
      ${ZS.invites
        ? `<div class="card"><div class="rowx c">${zDash(1)}<div class="grow"><div class="strong">${ZS.invites} invite${ZS.invites > 1 ? 's' : ''} sent</div><div class="sub">Waiting for them to tap the link. No app needed on their side.</div></div></div><button class="btn sm ghost" style="margin-top:12px;width:100%" data-act="zInvite">Invite someone else</button></div>`
        : `<div class="card zempty">${zDash(3)}<div class="ttl lg">No one in your circle yet</div><div class="sub">Add the few people you’d hand your keys to. They’re asked first when you need help, by text.</div><button class="btn sm" data-act="zInvite">Invite someone</button></div>`}
      <div class="lbl">Requests</div>
      ${zEmpty('calendar', 'Nothing booked', 'Going away? Ask here and Wala texts your circle first, then neighbors if you want.', `<button class="btn sm ghost" data-act="zAsk">Ask for help</button>`)}
      <div class="lbl">Elmwood</div>
      ${zEmpty('location', 'You’re early', ZS.neighborInvites ? `You invited ${ZS.neighborInvites} neighbor${ZS.neighborInvites > 1 ? 's' : ''}. We’ll let you know when people near you join.` : 'Nobody near you is on Wala yet. Neighbors you invite can help each other out.', `<button class="btn sm ghost" data-act="zInviteNeighbor">Invite a neighbor</button>`)}
    </div>${zNavO('z-o-home')}</div>`
  },
  'z-o-neighbors': {
    name: 'Owner · empty neighborhood board', render: () => `<div class="s">
    <div class="body">
      <div class="h1">Elmwood</div><div class="sub" style="margin-top:4px">Asks, offers and pack walks from people nearby</div>
      <div class="stg-tabs" style="margin-top:14px"><a class="on">All</a><a>Asks</a><a>Offers</a><a>Walks</a></div>
      ${zEmpty('people', 'The board is quiet', 'Nothing posted near you yet. When neighbors ask for help or offer it, it shows up here.', `<button class="btn sm" data-act="zInviteNeighbor">Invite a neighbor</button>`)}
      <div class="card rowx c fill"><span>${icon('lock', 16)}</span><div class="sub" style="color:var(--ink)">Posting opens once you confirm your address. Neighbors only ever see your block, never your house number.</div></div>
    </div>${zNavO('z-o-neighbors')}</div>`
  },
  'z-o-pet': {
    name: 'Owner · add a pet', render: () => ZS.pet ? `<div class="s">
    <div class="body">
      <div class="rowx c"><span class="ring" style="width:64px;height:64px;background:var(--pbutter)">${icon('paw', 28)}</span><div class="grow"><div class="h1">${esc(ZS.pet)}</div><div class="sub">${esc(ZS.kind)}</div></div></div>
      <div class="lbl">Care details · add when you need them</div>
      <div class="card divide">
        ${zRow('notes', 'Care plan', 'Food, walks, quirks', `<span class="tiny muted">Not started</span>`, 'data-toast="Care plan opens before your first sit"')}
        ${zRow('medical', 'Vet & meds', 'Only needed for sits with meds or overnights', `<span class="tiny muted">Later</span>`, 'data-toast="Vet details open before your first sit"')}
        ${zRow('key', 'Getting in', 'Door code or key handoff', `<span class="tiny muted">Later</span>`, 'data-toast="Door codes open before your first sit"')}
      </div>
      <div class="card rowx c" style="margin-top:4px"><span>${icon('sparkle', 18)}</span><div class="sub" style="color:var(--ink)">Nothing here is required today. Wala asks for each piece only when a sit needs it.</div></div>
    </div>${zNavO('z-o-pet')}</div>` : `<div class="s">
    ${hdr('Add your pet', 'Takes about 10 seconds', 'z-o-home')}
    <div class="body">
      <div class="lbl">Their first name</div>
      <input class="field" id="zPetName" placeholder="e.g. Bear" autocomplete="off">
      <div class="lbl">They’re a…</div>
      <div class="pills" data-single id="zPetKind">${['Dog', 'Cat', 'Something else'].map((k, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${k}</span>`).join('')}</div>
      <div class="foot"><button class="btn" data-act="zAddPet">Add pet</button></div>
    </div></div>`
  },
  'z-o-msgs': {
    name: 'Owner · no messages', render: () => `<div class="s">
    <div class="body"><div class="h1">Messages</div>
      ${zEmpty('message', 'No messages yet', 'Chats with your circle and helpers land here. People who answer by text show up too.')}
    </div>${zNavO('z-o-msgs')}</div>`
  },
  'z-o-profile': {
    name: 'Owner · profile', render: () => `<div class="s">
    <div class="body">
      <div class="rowx c"><span class="av s56 pbutter" data-toast="Photo upload is coming soon">S</span><div class="grow"><div class="h1">Sarah</div><div class="sub">Joined today · Elmwood</div></div></div>
      <div class="card divide" style="margin-top:16px">
        ${zRow('user', 'Add a photo', 'Helps neighbors recognise you', icon('next', 16), 'data-toast="Photo upload is coming soon"')}
        ${zRow('phone', 'Phone', 'Verified · this is how you sign in', '')}
        ${zRow('heart', 'Vouches', 'None yet · neighbors vouch after they meet you', '')}
      </div>
      <div class="card divide">
        <div class="rowx c"><div class="grow"><div class="strong">Text me about requests</div><div class="sub">Replies from your circle</div></div><span class="toggle ${ZS.oAlerts ? 'on' : ''}" role="switch" data-act="zToggle" data-k="oAlerts"></span></div>
        ${zRow('lock', 'Privacy', 'Who sees your block and pet', icon('next', 16), 'data-toast="Privacy settings are coming soon"')}
      </div>
    </div>${zNavO('z-o-profile')}</div>`
  },

  // ===== New helper =====
  'z-h-today': {
    name: 'Helper · today, day one', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    <div class="body">
      <div class="rowx c"><div class="grow"><div class="small muted">${zToday()}</div><h1 class="kd-h1">Hi Dana</h1></div>${av('DR', 'kd-av')}</div>
      <div class="lbl">Today</div>
      ${zEmpty('calendar', 'No visits today', 'When someone you’re helping books you, the visit and their pet’s care plan show up here.')}
      <div class="lbl">People you help</div>
      ${ZS.helperShared
        ? `<div class="card"><div class="rowx c">${zDash(1)}<div class="grow"><div class="strong">Link shared ${ZS.helperShared > 1 ? ZS.helperShared + ' times' : ''}</div><div class="sub">When someone adds you to their pet’s circle, they’ll appear here.</div></div></div></div>`
        : `<div class="card zempty">${zDash(3)}<div class="ttl lg">Nobody yet</div><div class="sub">Start with people who already know you. Share your link and they can add you to their pet’s circle. No checks needed for them.</div><button class="btn sm" data-act="zShareHelper">Share your link</button></div>`}
      <div class="lbl">Help neighbors you don’t know yet</div>
      <div class="card"><div class="sub" style="color:var(--ink)">Three quick things open up neighbor asks in Elmwood:</div>
        <div class="divide" style="margin-top:6px">${[['contact', 'Verify your ID'], ['location', 'Confirm your address'], ['people', 'Get 2 vouches']].map(([i, t]) => `<div class="rowx c"><span class="kd-ic">${icon(i, 16)}</span><div class="grow strong">${t}</div><span class="tiny muted">When you’re ready</span></div>`).join('')}</div></div>
    </div>${zNavH('z-h-today')}</div>`
  },
  'z-h-msgs': {
    name: 'Helper · no messages', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    <div class="body"><h1 class="kd-h1">Messages</h1>
      ${zEmpty('message', 'No messages yet', 'Owners you help can message you here about visits and updates.')}
    </div>${zNavH('z-h-msgs')}</div>`
  },
  'z-h-sched': {
    name: 'Helper · empty schedule', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    <div class="body"><h1 class="kd-h1">Schedule</h1>
      ${zEmpty('calendar', 'Nothing scheduled', 'Your visits and sits will line up here.')}
      <div class="lbl">When are you usually free?</div>
      <div class="card"><div class="pills">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<span class="pill lg chip ${ZS.days.includes(d) ? 'on' : ''}" data-zday="${d}">${d}</span>`).join('')}</div>
        <div class="sub" style="margin-top:10px">Optional. It just helps us show you asks that fit.</div>
        <button class="btn sm" style="margin-top:12px;width:100%" data-act="zSaveDays">Save</button></div>
    </div>${zNavH('z-h-sched')}</div>`
  },
  'z-h-earn': {
    name: 'Helper · no earnings', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    <div class="body"><h1 class="kd-h1">Earnings</h1>
      <div class="card"><div class="lbl">So far</div><div class="h1" style="font-size:40px;margin-top:4px">$0</div><div class="sub">0 visits · 0 favors</div></div>
      ${zEmpty('money', 'Nothing yet', 'When someone pays you or calls it a favor, it shows up here. Payouts only matter if you go pro later.')}
    </div>${zNavH('z-h-earn')}</div>`
  },
  'z-h-acct': {
    name: 'Helper · account', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    <div class="body">
      <div class="rowx c">${av('DR', 's56 kd-av')}<div class="grow"><h1 class="kd-h1">Dana</h1><div class="sub">Joined today · Elmwood · has Pepper</div></div></div>
      <div class="card divide" style="margin-top:16px">
        ${zRow('user', 'Add a photo and short bio', 'Owners like to see who’s coming', icon('next', 16), 'data-toast="Photo upload is coming soon"')}
        ${zRow('heart', 'Vouches', 'None yet', '')}
        ${zRow('shield', 'Background check', 'Only if you go pro', '')}
      </div>
    </div>${zNavH('z-h-acct')}</div>`
  },

  // ===== Friend added to a circle (no app) =====
  'z-f-lock': {
    name: 'Friend · welcome text arrives', render: () => `<div class="lock">
      <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div><div class="time">${tClock()}</div>
      <div class="notif" data-go="z-f-thread" data-tr="up"><span class="app">${icon('message', 20)}</span>
        <div class="grow"><div style="display:flex;justify-content:space-between"><b style="font-size:15px">Wala</b><span style="color:var(--sys);font-size:13px">now</span></div>
        <div style="font-size:14px;line-height:19px;margin-top:2px">Hi Ana 👋 Sarah added you to Bear’s circle. Nothing’s needed right now.</div></div></div></div>`
  },
  'z-f-thread': {
    name: 'Friend · welcome text, no ask', render: () => `<div class="s white">
    ${msgHdr('z-f-lock')}
    <div class="thread">
      <div class="sysmsg">Text Message · Today ${tClock()}</div>
      <div class="bub">Hi Ana 👋 it’s Wala, for Sarah Leach. She added you to Bear’s circle: the few people she trusts to help with him. No app or account needed.</div>
      <div class="bub">Nothing’s needed right now. If Sarah ever asks for help, you’ll get a text like this and can say yes or no.</div>
      <div class="linkprev" data-go="z-f-circle" data-tr="up"><img src="assets/bear.jpg" alt="Bear">
        <div class="in"><div class="strong" style="color:#111">Bear’s circle</div><div class="small" style="color:var(--sys)">wala.app</div></div></div>
      <div class="bub">Reply STOP anytime to opt out.</div>
    </div>${composer}</div>`
  },
  'z-f-circle': {
    name: 'Friend · circle page, nothing pending', render: () => `<div class="s">
    ${urlbar('wala.app/c/bear')}
    <div class="body">
      <div class="rowx c">${av('S', 's36 pbutter')}<div><div class="small muted">Sarah added you to</div><div class="ttl lg">Bear’s circle</div></div></div>
      <div class="card butter photo" style="border-radius:28px"><img class="ph" src="assets/bear.jpg" alt="Bear"><div class="in"><div class="h1">Bear</div><div style="font-size:13px;margin-top:2px">German Shepherd · Sarah’s dog</div></div></div>
      ${zEmpty('check', 'Nothing needed right now', 'There are no asks from Sarah. When there is one, you’ll get a text and it will show up here.')}
      <div class="lbl">Who’s in the circle</div>
      <div class="card divide">
        <div class="rowx c">${av('S', 's32 pbutter')}<div class="grow"><div class="strong">Sarah</div><div class="sub">Bear’s person</div></div></div>
        <div class="rowx c">${av('A', 's32')}<div class="grow"><div class="strong">You</div><div class="sub">Added today</div></div></div>
      </div>
      <div class="card"><div class="rowx c"><div class="grow"><div class="strong">Text me when Sarah asks</div><div class="sub">Only for Bear · usually a few times a year</div></div><span class="toggle ${ZS.fAlerts ? 'on' : ''}" role="switch" data-act="zToggle" data-k="fAlerts"></span></div></div>
      <div class="foot"><a class="link" style="color:var(--rust)" data-toast="You can leave anytime. Sarah won’t be told why.">Leave Bear’s circle</a></div>
    </div></div>`
  }
});

function renderZLead() {
  document.title = 'Onboarding · Wala';
  const tabs = [['Ready to review', 0], ['Waiting on them', 0], ['Approved', 0], ['Declined', 0]];
  return `<div class="zlead">
    <div class="zlead-top"><i class="logo" style="width:72px;height:24px;color:var(--peri)"></i><span class="pill white sm">Elmwood pilot</span><span class="grow"></span><a class="tbar-next" href="#/z" style="text-decoration:none">Switch</a>${av('NL', 's36 blue')}</div>
    <div class="zlead-main">
      <h1>Onboarding requests</h1><p class="muted" style="margin:4px 0 20px">Neighbors and pros who want to help in Elmwood. You review each one before they can be asked.</p>
      <div class="zlead-stats">${[['Helpers in Elmwood', 0], ['Waiting on you', 0], ['Owners in Elmwood', 0], ['Asks this month', 0]].map(([t, n]) => `<div class="card"><div class="lbl">${t}</div><div class="h1" style="font-size:34px;margin-top:6px">${n}</div></div>`).join('')}</div>
      <div class="stg-tabs" style="margin:22px 0 14px">${tabs.map(([t, n], i) => `<a class="${i === 0 ? 'on' : ''}">${t} · ${n}</a>`).join('')}</div>
      <div class="card zempty zlead-empty"><span class="ring zring">${icon('check', 28)}</span><div class="ttl lg">No one’s waiting for review</div>
        <div class="sub">When a neighbor or pro applies, they’ll show up here with their ID, address and vouches, and you’ll get an email.</div>
        <div class="rowx c" style="gap:10px;justify-content:center;margin-top:6px"><button class="btn sm" style="width:auto;padding:0 18px" data-act="zCopyHelper">Copy the helper sign-up link</button><button class="btn sm ghost" style="width:auto;padding:0 18px" data-toast="Flyers are coming soon">Print a flyer</button></div></div>
    </div></div>`;
}

function renderZPicker() {
  document.title = 'Wala';
  return `<div class="twel"><div class="twel-card">
    <i class="logo twel-logo"></i>
    <h1>Day one on Wala</h1>
    <p>What each kind of user sees before anything has happened. Pick one and tap around.</p>
    <div class="ephones">${ZTYPES.map(x => { const p = zPerson(x.who); return `<button class="ephone" data-act="zStart" data-k="${x.k}">${av(p.av, 's36 ' + p.cls)}<span class="grow"><b>${x.title}</b><span>${x.what}</span></span>${icon('next', 16)}</button>`; }).join('')}</div>
    <p class="tiny muted">The neighborhood lead view is a desktop page. Names and places are made up, and nothing is sent.</p>
  </div></div>`;
}

function zBar() {
  const t = ZTYPES.find(x => x.k === ZWHO) || ZTYPES[0]; const p = zPerson(t.who);
  return `<div class="tbar" id="tbar">
    <span class="tbar-n">${av(p.av, 's32 ' + p.cls)}</span>
    <div class="tbar-t"><div class="tbar-k">Day one</div><div class="tbar-q">${t.title}</div></div>
    <a class="tbar-next" href="#/z">Switch</a>
  </div>`;
}

async function zShare(text, done) {
  const url = location.origin + location.pathname.replace(/index\.html$/, '');
  try { if (navigator.share) { await navigator.share({ title: 'Wala', text, url }); toast(done); return true; } } catch (e) { return false; } // cancelled
  await copyText(`${text} ${url}`, done.replace(/sent|shared/, 'copied'));
  return true;
}

const Z_ACTS = {
  zStart(el) {
    const t = ZTYPES.find(x => x.k === el.dataset.k); if (!t) return;
    ZWHO = t.k; try { sessionStorage.setItem('wala-zwho', ZWHO); } catch (e) {}
    location.hash = '#/z/' + t.start;
  },
  zAddPet() {
    const n = document.getElementById('zPetName')?.value.trim(); if (!n) return toast('Add your pet’s first name');
    ZS.pet = n.slice(0, 24); ZS.kind = document.querySelector('#zPetKind .chip.on')?.textContent.trim() || 'Dog';
    toast(`${ZS.pet} added 🐾`); go('z-o-home', 'back');
  },
  async zInvite() { if (await zShare('Sarah added you to her pet’s circle on Wala.', 'Invite sent')) { ZS.invites++; rerender(); } },
  async zInviteNeighbor() { if (await zShare('Join me on Wala, neighbors helping with each other’s pets in Elmwood.', 'Invite sent')) { ZS.neighborInvites++; rerender(); } },
  async zShareHelper() { if (await zShare('I’m helping with pets on Wala. Add me to your pet’s circle:', 'Link shared')) { ZS.helperShared++; rerender(); } },
  zAsk() { toast(!ZS.pet ? 'Add your pet first' : !ZS.invites ? 'Invite someone to your circle first' : 'Your circle hasn’t joined yet. We’ll nudge them'); },
  zToggle(el) { const k = el.dataset.k; ZS[k] = el.classList.contains('on'); toast(ZS[k] ? 'Texts on' : 'Texts off'); },
  zSaveDays() { ZS.days = [...document.querySelectorAll('[data-zday].on')].map(c => c.dataset.zday); toast(ZS.days.length ? `Saved · ${ZS.days.join(', ')}` : 'Saved · no set days'); },
  zCopyHelper() { copyText(location.origin + location.pathname.replace(/index\.html$/, '') + '#/s/kd-s-start', 'Helper sign-up link copied'); }
};
document.addEventListener('DOMContentLoaded', () => Object.assign(ACTS, Z_ACTS));
