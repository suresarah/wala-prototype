// ---------- helpers ----------
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hdr = (t, st = '', back = null) => `
  <header class="hdr">
    ${back ? `<button class="back" data-go="${back}" data-tr="back" aria-label="Back">${icon('back', 18)}</button>` : ''}
    <div><div class="t">${t}</div>${st ? `<div class="st">${st}</div>` : ''}</div>
  </header>`;
const navbar = (on = 'Find Care') => `
  <nav class="navbar">${[['house', 'Home'], ['search', 'Find Care'], ['paw', 'Bear'], ['message', 'Messages'], ['user', 'Profile']]
    .map(([i, n]) => `<a class="${n === on ? 'on' : ''}" data-toast="${n} isn’t part of this prototype"><span class="ico">${icon(i, 18)}</span>${n}</a>`).join('')}</nav>`;
const chk = (s) => `<span class="chk ${s}">${s === 'done' ? icon('check', 14) : s === 'wait' ? icon('clock', 14) : s === 'bad' ? icon('alert', 13) : ''}</span>`;
const av = (ini, cls = '') => `<span class="av ${cls}">${ini}</span>`;
const pill = (t, cls = '', ic = '') => `<span class="pill ${cls}">${ic ? icon(ic, 13) : ''}${t}</span>`;
const urlbar = (u = 'wala.app/r/7Q2K') => `<div class="urlbar"><div class="u">${icon('lock', 13)}${u}</div></div>`;
const msgHdr = (back) => `<div class="msg-hdr">${back ? `<button class="back" data-go="${back}" data-tr="back" aria-label="Back">${icon('back', 22)}</button>` : ''}<div class="msg-av"><i class="logo"></i></div><div class="nm">Wala</div></div>`;
const composer = `<div class="composer"><span class="plus">+</span><span class="in">Text Message</span></div>`;

// live answer from Ana (status screen) — empty in solo mode
const anaLive = () => L('ana');
// Ana's answer as Sarah sees it on the "Ana said yes" screen (solo mode shows the demo answer)
const anaAnswer = () => (LIVE.on || L('ana').stage || L('sarah').coveredBy) ? L('ana') : { stage: 'yes', visits: STATE.ana, note: STATE.anaNote ?? 'Of course! I’ll bring his favorite chews 🦴', thanks: STATE.anaThanks || '$40', via: 'web', verifiedAt: 1 };

// prototype state (resets on reload)
const STATE = {
  sit: { agreement: true, consent: true, health: true, key: false, pay: false },
  ana: { am: true, pm: true }
};

// ---------- screens ----------
const SCREENS = {

  // ===== Flow A · Owner: neighbors & trusted friends =====
  'who': {
    name: 'Who should we ask?', render: () => `<div class="s">
    ${hdr('Who should we ask?', 'Drop-ins for Bear · Sat Nov 28 – Sun Nov 29')}
    <div class="body">
      <p class="intro">Start with people Bear already knows. We only widen the ask if no one can make it.</p>
      <button class="opt tap" style="text-align:left" data-go="voice-ask"><span class="ring" style="width:36px;height:36px;background:var(--peri);color:var(--white)">${icon('mic', 18)}</span><div class="grow"><div class="strong">Or just say what you need</div><div class="sub">“Drop-ins for Bear Sunday, morning and evening”</div></div>${icon('next', 18)}</button>
      <div class="card pbutter selected tap" data-go="circle">
        <div class="rowx">
          <span class="ring" style="background:var(--butter)">${icon('people')}</span>
          <div class="grow"><div class="ttl lg">Your circle</div><div class="sub">Friends & family you invited</div>
            <div class="strong" style="margin-top:10px;font-size:13px">4 people · Megan, Chris +2</div><div class="sub">Free, a favor, or what you agree</div></div>
          ${pill('Ask first', 'ink sm')}
        </div>
        <div style="border-top:1px solid var(--line);margin-top:12px;padding-top:10px"><a class="link" style="text-align:left;font-size:13px" data-act="sarahAsk">Ask everyone at once instead</a></div>
      </div>
      <div class="card tap" data-go="circle">
        <div class="rowx"><span class="ring" style="background:var(--blue)">${icon('house')}</span>
          <div class="grow"><div class="ttl lg">Neighbors</div><div class="sub">Verified, vouched for by people you know</div>
          <div class="strong" style="margin-top:10px;font-size:13px">7 within a mile · 3 vouched by your circle</div><div class="sub">Neighbor rate · ~$20/visit</div></div>
          ${pill('Then, if needed', 'sm')}</div>
      </div>
      <div class="card tap" data-toast="Pros are only asked if no one in your circle or neighborhood can help">
        <div class="rowx"><span class="ring" style="background:var(--pterra)">${icon('authorized')}</span>
          <div class="grow"><div class="ttl lg">Pro sitters</div><div class="sub">Background-checked, insured & bonded</div>
          <div class="strong" style="margin-top:10px;font-size:13px">12 available · from $28/visit</div><div class="sub">Pro rate</div></div>
          ${pill('Then, if needed', 'sm')}</div>
      </div>
      <div class="card fill">
        <div class="lbl">How the ask widens</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;font-size:13px">
          <div class="rowx c">${icon('clock', 18)}Circle has until 6 pm Thu to reply</div>
          <div class="rowx c">${icon('people', 18)}Then neighbors vouched by your circle</div>
          <div class="rowx c">${icon('authorized', 18)}Pros only if no one is free — you approve each step</div>
        </div>
      </div>
      <div class="foot"><button class="btn" data-act="sarahAsk">Ask my circle</button></div>
    </div></div>`
  },

  'circle': {
    name: "Bear's circle", render: () => {
      const grp = (title, sub, people) => `
        <div class="lbl">${title}</div>
        <div class="sub" style="margin-top:2px">${sub}</div>
        <div class="card divide inset" style="margin-top:8px">${people.map(([ini, n, r, badge, bc, bi, go, ac]) => `
          <div class="rowx c ${go ? 'tap' : ''}" ${go ? `data-go="${go}"` : `data-toast="${n}’s profile isn’t part of this prototype"`}>
            ${av(ini, ac || '')}<div class="grow"><div class="ttl">${n}</div><div class="sub">${r}</div></div>${pill(badge, 'sm ' + (bc || ''), bi)}</div>`).join('')}
        </div>`;
      return `<div class="s">${hdr("Bear's circle", 'People Bear knows & trusts', 'who')}
      <div class="body">
        ${grp('Ring 1 · Your circle', 'Invited by you. No platform checks — your trust is the check.', [
          ['M', 'Megan', 'Neighbor · next door · emergency contact', 'Has a key', 'pbutter', 'house'],
          ['C', 'Chris', 'Friend · walks Bear on Tuesdays', 'Walks'],
          ['A', 'Ana', 'Sister · lives 20 min away', 'Overnights', '', '', 'lock'],
          ['DP', 'Dr. Patel', 'Vet · Elmwood Animal Clinic', 'Vet', 'pblue', 'medical'],
          ...(STATE.invites || []).map(n => [n.split(' ').map(w => w[0]).join('').slice(0, 2), n, 'Invite sent · hasn’t joined yet', 'Invited', 'fill', 'clock', '', 'pbutter'])])}
        <div style="margin-top:24px">${grp('Ring 2 · Neighbors', 'Verified ID + address, vouched for by 2+ people you know.', [
          ['DR', 'Dana Ruiz', '3 blocks away · vouched by Megan, Priya', 'Vouched ×2', 'pblue', 'check', 'dana', 'blue'],
          ['OK', 'Omar Khan', '0.6 mi · vouched by Chris, Marcus', 'Vouched ×2', 'pblue', 'check', '', 'blue']])}</div>
        <div style="margin-top:24px">${grp('Ring 3 · Pros', 'Background-checked, insured and bonded.', [
          ['TM', 'Taylor Morgan', 'Primary sitter · 96% match', 'Insured', 'pterra', 'authorized', '', 'pterra'],
          ['JC', 'Jamie Chen', 'Backup caregiver', 'Insured', 'pterra', 'authorized', '', 'pterra']])}</div>
        <button class="btn ghost" style="margin-top:24px" data-go="invite">${icon('people', 18)}Invite a friend or neighbor</button>
      </div>${navbar('Find Care')}</div>`;
    }
  },

  'invite': {
    name: 'Invite a friend', render: () => `<div class="s">
    ${hdr("Invite to Bear's circle", 'They’ll get a text — no app needed to say yes', 'circle')}
    <div class="body">
      <div class="lbl">Who</div>
      <input class="field" id="inviteWho" value="Jordan Avila · 555-0134" aria-label="Name or phone">
      <div class="lbl">They are Bear’s…</div>
      <div class="pills" data-single>${['Friend', 'Neighbor', 'Family', 'Walker'].map((t, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="lbl">What they can do</div>
      <div class="card divide inset">${[
        ['notes', 'See Bear’s care plan', 'Routine, meds, quirks', 1],
        ['house', 'Get home access for a sit', 'Key/door code shared 24h before, expires after', 1],
        ['alert', 'Be an emergency contact', 'We call them if we can’t reach you', 0],
        ['medical', 'Approve emergency vet care', 'Only if you name them on the vet consent form', 0]]
        .map(([i, t, d, on]) => `<div class="rowx c">${icon(i)}<div class="grow" style="padding-left:12px"><div class="strong">${t}</div><div class="sub">${d}</div></div><span class="toggle ${on ? 'on' : ''}" role="switch"></span></div>`).join('')}</div>
      <div class="lbl">Preview</div>
      <div class="bub tap" style="background:var(--pblue);max-width:330px;border-radius:20px;padding:14px 16px" data-go="lock" data-tr="up">Sarah added you to Bear’s circle on Wala 🐾 You’d be someone she can ask for walks and drop-ins — always your call to say yes. Tap to see Bear’s care plan: wala.app/c/bear</div>
      <div class="small muted" style="margin-top:12px">Tap the preview to see what they receive. Circle members don’t go through platform checks. For anything beyond a favor, they sign the same sit agreement as everyone else.</div>
      <div class="foot"><button class="btn" data-act="sendInvite">Send invite</button></div>
    </div></div>`
  },

  'dana': {
    name: 'Neighbor · Dana', render: () => `<div class="s">
    ${hdr('Dana Ruiz', 'Neighbor helper · Elmwood', 'circle')}
    <div class="body">
      <div class="card blue" style="border-radius:28px;padding:20px">
        <div class="rowx c">${av('DR', 's72 white')}<div><div class="h1">Dana Ruiz</div><div class="lbl" style="color:var(--ink);margin-top:4px">Neighbor helper · 3 blocks away</div>
          <div class="pills" style="margin-top:8px">${pill('ID verified', 'white sm', 'check')}${pill('Address verified', 'white sm', 'location')}</div></div></div>
        <div style="border-top:1px solid #8FA7BC;margin-top:16px;padding-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          <div><b style="font-size:24px;letter-spacing:-.03em">2</b><div class="tiny">Vouches from your circle</div></div>
          <div><b style="font-size:24px;letter-spacing:-.03em">11</b><div class="tiny">Neighbor sits</div></div>
          <div><b style="font-size:16px">Has a dog</b><div class="tiny">Pepper, 6, calm</div></div></div>
      </div>
      <div class="lbl">Vouched for by people you know</div>
      <div class="card divide inset">
        <div class="rowx">${av('M', 's36')}<div class="grow"><div class="strong">Megan</div><div class="sub" style="font-size:13px">“Dana fed our cats for two weeks in August. Spotless.”</div></div></div>
        <div class="rowx">${av('P', 's36 pbutter')}<div class="grow"><div class="strong">Priya · Mochi</div><div class="sub" style="font-size:13px">“Walked Mochi every evening after her surgery.”</div></div></div>
      </div>
      <div class="lbl">Helps with</div>
      <div class="pills">${['Drop-ins', 'Walks', 'Feeding', 'Overnights at your place'].map(t => pill(t, 'lg')).join('')}</div>
      <div class="lbl">How Dana likes to be thanked</div>
      <div class="card pbutter"><div style="font-size:14px">$20 per drop-in, or trade — she’s away most of December and needs someone for Pepper.</div><div style="margin-top:10px">${pill('Open to trades', 'butter sm')}</div></div>
      <div class="card rowx">${icon('authorized')}<div><div class="strong">Covered when booked through Wala</div><div class="sub">Pet-in-care cover + the same sit agreement and vet consent as pros. Not a pro — no background check.</div></div></div>
      <div class="foot row"><button class="btn ghost" style="width:52px;flex:none" data-toast="Messaging isn’t part of this prototype" aria-label="Message">${icon('message')}</button><button class="btn" data-go="status">Ask Dana for Nov 28–29</button></div>
    </div></div>`
  },

  'status': {
    name: 'Asking Bear’s people', render: () => {
      const a = anaLive(), sr = L('sarah');
      const top = sr.coveredBy ? `<div class="card pgrass tap" data-go="owner"><div class="h2">You’re covered all weekend.</div><div class="sub" style="font-size:13px">Megan has Saturday · Dana said yes to Sunday · <span style="color:var(--peri);font-weight:500">see details →</span></div></div>`
        : a.stage === 'suggested' && !(sr.suggestReplyAt > a.suggestedAt) ? `<div class="card pblue"><div class="lbl" style="color:var(--ink)">Ana suggested a change</div><div class="h2" style="margin-top:6px">Sunday at ${esc([a.suggest?.am, a.suggest?.pm].filter(Boolean).join(' and '))} instead?</div>${a.suggestNote ? `<div class="sub" style="color:var(--ink);font-size:13px;margin-top:4px">“${esc(a.suggestNote)}”</div>` : ''}
            <div class="rowx" style="margin-top:14px;gap:8px"><button class="btn sm" data-act="sarahAcceptSuggest">That works</button><button class="btn ghost sm" style="background:var(--white)" data-act="sarahKeepTime">Keep 8 am</button></div></div>`
        : a.stage === 'left' ? `<div class="card pbutter"><div class="h2">Ana left Bear’s circle.</div><div class="sub" style="font-size:13px">She won’t get asks through Wala. Neighbors get asked at 6 pm Thu, or ask them now below.</div></div>`
        : a.stage === 'yes'
        ? `<div class="card pgrass tap" data-go="owner"><div class="h2">You’re covered all weekend.</div><div class="sub" style="font-size:13px">Megan has Saturday · Ana said yes to Sunday · <span style="color:var(--peri);font-weight:500">see details →</span></div></div>`
        : a.stage === 'declined'
          ? `<div class="card pbutter"><div class="h2">Ana can’t make Sunday.</div><div class="sub" style="font-size:13px">${a.reason ? a.reason + ' · ' : ''}Neighbors get asked at 6 pm Thu, or ask them now below.</div></div>`
          : `<div class="card pbutter"><div class="h2">Megan can do Saturday.</div><div class="sub" style="font-size:13px">Still need Sunday · neighbors get asked at 6 pm Thu</div></div>`;
      const anaLine = a.stage === 'yes' ? `<div class="small" style="color:var(--grass)">Yes — Sunday · ${visitText(a.visits, a.times)}</div>`
        : a.stage === 'suggested' ? `<div class="small" style="color:var(--peri)">Suggested a new time · waiting on you</div>`
        : a.stage === 'left' ? `<div class="small muted">Left Bear’s circle</div>`
        : a.stage === 'declined' ? `<div class="small muted">Can’t this time${a.reason ? ' · ' + a.reason : ''}</div>`
        : a.stage === 'opened' ? `<div class="small muted">Read your text · deciding…</div>`
        : `<div class="small muted">No reply yet${LIVE.role ? '' : ' · <span style="color:var(--peri);font-weight:500">see Ana’s side →</span>'}</div>`;
      const anaGo = a.stage === 'yes' ? 'data-go="owner"' : LIVE.role ? '' : 'data-go="lock" data-tr="up"';
      return `<div class="s">
    ${hdr('Asking Bear’s people', 'Drop-ins · Sat Nov 28 – Sun Nov 29', 'who')}
    <div class="body">
      ${top}
      <div class="timeline" style="margin-top:20px">
        <div class="tl-step">${chk('done')}<div class="grow"><div class="ttl">Ring 1 · Your circle</div><div class="sub">Asked 4 · Tue 9:12 am</div>
          <div class="tl-people">
            <div class="rowx c">${av('M', 's32')}<div><div class="strong">Megan</div><div class="small" style="color:var(--grass)">Yes — Saturday</div></div></div>
            <div class="rowx c">${av('C', 's32')}<div><div class="strong">Chris</div><div class="small muted">Away for Thanksgiving</div></div></div>
            <div class="rowx c ${anaGo ? 'tap' : ''}" ${anaGo}>${av('A', 's32')}<div class="grow"><div class="strong">Ana ${a.stage === 'opened' ? '<span class="dot on" style="display:inline-block;vertical-align:middle;margin-left:4px"></span>' : ''}</div>${anaLine}</div></div>
          </div></div></div>
        <div class="tl-step">${chk(sr.danaYesAt ? 'done' : 'wait')}<div class="grow"><div class="ttl">Ring 2 · Neighbors</div><div class="sub">${sr.neighborsAskedAt ? 'Asked ' + new Date(sr.neighborsAskedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' · 2 vouched neighbors' : 'Opens Thu 6 pm · 3 vouched neighbors'}</div>
          <div class="tl-people">
            <div class="rowx c tap" data-go="dana">${av('DR', 's32 blue')}<div><div class="strong">Dana Ruiz</div>${sr.danaYesAt ? '<div class="small" style="color:var(--grass)">Yes — Sunday · 8 am + 6 pm</div>' : sr.neighborsAskedAt ? '<div class="small muted">Asked · usually answers within the hour</div>' : '<div class="small muted">Will be asked</div>'}</div></div>
            <div class="rowx c">${av('OK', 's32 blue')}<div><div class="strong">Omar Khan</div><div class="small muted">${sr.danaYesAt ? 'Told Sunday’s covered' : sr.neighborsAskedAt ? 'Asked · no reply yet' : 'Will be asked'}</div></div></div>
          </div></div></div>
        <div class="tl-step">${chk('')}<div class="grow"><div class="ttl">Ring 3 · Pros</div><div class="sub">Only if you approve</div></div></div>
      </div>
      ${a.stage === 'yes' || sr.neighborsAskedAt ? '' : `<div class="card"><div class="ttl">Want to skip the wait?</div><div class="sub" style="font-size:13px">Ask Dana and Omar now for Sunday instead of Thursday evening.</div>
        <button class="btn ghost sm" style="margin-top:12px" data-act="askNeighbors">Ask neighbors now</button></div>`}
      <div class="foot"><button class="btn" data-go="sit">Confirm Megan for Saturday</button></div>
    </div></div>`;
    },
    after: () => { if (['yes', 'declined', 'left'].includes(anaLive().stage)) actOnce('sarah', 'sawAnswerAt'); }
  },

  'sit': {
    name: 'Before the first sit', render: () => {
      const s = STATE.sit, done = Object.values(s).filter(Boolean).length;
      const items = [
        ['agreement', 'Sit agreement', 'Who does what, dates, pay or favor. Both signed Tue.'],
        ['consent', 'Emergency vet consent', 'Megan can approve care up to $500. Above that, we call you, then Ana.'],
        ['health', 'Bear’s health card', 'Meds: Rimadyl with dinner · Allergy: chicken · Microchip 985…4471'],
        ['key', 'Key & door code handoff', 'Released Fri 9 am · expires Mon 9 am · logged'],
        ['pay', 'Who pays the vet', 'Card on file · Megan never fronts costs']];
      return `<div class="s">${hdr('Before Megan’s first sit', 'Same for friends, neighbors and pros', 'status')}
      <div class="body">
        <div class="card ink"><div class="h2" style="font-size:22px">${done} of 5 ready</div>
          <div class="small" style="color:#D9CFC6;margin-top:4px">${done === 5 ? 'All set — Megan gets the door code Friday at 9 am.' : 'Megan can’t get the door code until everything is signed.'}</div>
          <div class="bar" style="margin-top:14px"><i style="width:${done * 20}%"></i></div></div>
        <div class="card divide inset">${items.map(([k, t, d]) => `
          <div class="rowx">${chk(s[k] ? 'done' : '')}<div class="grow"><div class="ttl">${t}</div><div class="sub">${d}</div></div>
          ${s[k] ? '' : `<button class="pill pbutter sm" ${k === 'key' ? 'data-go="handoff"' : k === 'pay' ? 'data-go="vetpay"' : `data-act="sitDone" data-k="${k}"`}>Set up</button>`}</div>`).join('')}</div>
        <div class="card pblue rowx">${icon('info')}<div><div class="strong">Why this matters for friends too</div><div class="sub" style="color:var(--ink)">If you’re on a plane when Bear eats a sock, Megan needs to be able to say yes to the vet — and the vet needs to see it in writing.</div></div></div>
        <div class="foot"><button class="btn" ${done === 5 ? 'data-go="thanks"' : 'data-toast="Tap “Set up” on the last two items first"'}>${done === 5 ? 'Done — skip to after the sit' : 'Finish setup'}</button></div>
      </div></div>`;
    }
  },

  'thanks': {
    name: 'Thank Megan', render: () => `<div class="s">
    ${hdr('Thank Megan', 'Saturday drop-ins · 2 visits', 'sit')}
    <div class="body">
      <div class="card pbutter" style="border-radius:28px"><div class="lbl">Bear’s Saturday</div>
        <div class="ttl lg" style="margin-top:6px">Two visits, one long sniff walk, dinner pill taken at 6:10 pm.</div>
        <div class="pills" style="margin-top:12px">${pill('🍽 Ate all', 'white')}${pill('💊 Med given', 'white')}${pill('🚶 32 min', 'white')}</div></div>
      <div class="lbl">How do you want to say thanks?</div>
      <div data-radio style="display:flex;flex-direction:column;gap:12px">
        ${[['money', 'Pay', '$40 · what you agreed', 1], ['heart', 'Call it a favor', 'Logged so you remember', 0], ['paw', 'Trade a sit', 'Megan gets a credit with you', 0]]
          .map(([i, a, b, on]) => `<div class="opt ${on ? 'selected' : ''}" data-label="${a}">${icon(i)}<div class="grow"><div class="ttl">${a}</div><div class="sub">${b}</div></div><span class="radio"></span></div>`).join('')}
      </div>
      <div class="lbl">Add a note</div>
      <textarea class="field" aria-label="Note">You’re the best. Bear did his happy spin when I got home.</textarea>
      <div class="card pblue rowx c">${icon('people')}<div class="strong" style="font-size:13px">Megan’s away Dec 19–26. Offer to watch her cat?</div></div>
      <div class="foot"><button class="btn" data-act="sendThanks">Send thanks + note</button></div>
    </div></div>`
  },

  // ===== Flow B · Helper side =====
  'h-invited': {
    name: 'You’re in Bear’s circle', render: () => `<div class="s">
    ${hdr('You’re in Bear’s circle', 'Invited by Sarah · Elmwood')}
    <div class="body">
      <div class="card butter" style="border-radius:28px;padding:20px">${av('B', 's64 white')}<div class="h2" style="font-size:22px;margin-top:16px">Sarah added you as someone she trusts with Bear.</div></div>
      <div class="lbl">What this means</div>
      <div class="card divide inset">${[['heart', 'You’re never on the hook', 'Sarah asks; you say yes or no. No ratings, no penalties.'], ['notes', 'You can see Bear’s care plan', 'Routine, meds, and the vet — always up to date.'], ['house', 'Home access only during a sit', 'Door code arrives 24h before and expires after.']]
        .map(([i, a, b]) => `<div class="rowx">${icon(i)}<div class="grow"><div class="ttl" style="font-size:14px">${a}</div><div class="sub">${b}</div></div></div>`).join('')}</div>
      <div class="card pblue tap" data-go="h-apply"><div class="strong">No background check needed for a circle.</div><div class="sub" style="color:var(--ink)">Just confirm your phone. <span style="color:var(--peri);font-weight:500">Want to help other neighbors too? Apply →</span></div></div>
      <div class="foot"><button class="btn" data-act="lenaJoin">Join with my phone number</button><a class="link" data-toast="Sarah can still text you directly">Not now — Sarah can still text you directly</a></div>
    </div></div>`
  },

  'h-apply': {
    name: 'Help neighbors nearby', render: () => `<div class="s">
    ${hdr('Help neighbors nearby', 'Step 2 of 3 · Trust', 'h-invited')}
    <div class="body">
      <p class="intro">Neighbors see you only after you’re verified and vouched for by two people they know.</p>
      <div class="card divide inset">${[['done', 'Verify your ID', 'Driver’s license · matched Tue'], ['done', 'Confirm your address', 'We show neighbors your block, never your number'], ['wait', 'Get 2 vouches', '1 of 2 · Megan vouched'], ['', 'Sit agreement & house rules', 'Read and sign once']]
        .map(([s, t, d]) => `<div class="rowx">${chk(s)}<div class="grow"><div class="ttl">${t}</div><div class="sub">${d}</div></div></div>`).join('')}</div>
      <div class="lbl">Ask someone to vouch</div>
      <input class="field" value="Priya Shah · 555-0188" aria-label="Who to ask">
      <div class="lbl">Who can ask you</div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px">${[['Only people I know', 0], ['My block + people I know', 1], ['Anyone vouched within a mile', 0]].map(([t, on]) => `<div class="opt ${on ? 'selected' : ''}"><div class="grow">${t}</div><span class="radio"></span></div>`).join('')}</div>
      <div class="lbl">Help with</div>
      <div class="pills" data-multi>${[['Drop-ins', 1], ['Walks', 1], ['Overnights', 0], ['Meds', 0]].map(([t, on]) => `<span class="pill lg chip ${on ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="foot"><button class="btn" data-act="lenaApply">Send for review</button></div>
    </div></div>`
  },

  'h-review': {
    name: 'In review', render: () => {
      const d = L('admin').lena; const le = L('lena');
      const sub = le.appliedAt ? 'Submitted ' + new Date(L('lena').appliedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Submitted Wed 2:14 pm';
      const hero = !d ? `<div class="card blue" style="border-radius:28px;padding:20px"><div class="lbl" style="color:var(--ink)">Neighbor helper · in review</div>
        <div class="h2" style="margin-top:6px">A Wala neighborhood lead is checking your ID match and vouches.</div>
        <div style="margin-top:14px">${pill(sub, 'white sm', 'clock')}</div></div>`
        : d.decision === 'approved' ? `<div class="card pgrass" style="border-radius:28px;padding:20px"><div class="lbl" style="color:var(--grass)">Neighbor helper · approved</div>
        <div class="h2" style="margin-top:6px">You’re visible in Elmwood 🎉</div><div style="margin-top:6px;font-size:14px">Owners who know Megan or Priya can now ask you for drop-ins and walks. You’ll always get to say yes or no.</div></div>`
        : d.decision === 'asked' ? `<div class="card pbutter" style="border-radius:28px;padding:20px"><div class="lbl">Neighbor helper · one more thing</div>
        <div class="h2" style="margin-top:6px">${le.resubmittedAt > d.at ? 'Sent back — the lead will take another look' : 'The neighborhood lead has a question'}</div><div class="bub" style="background:var(--white);max-width:none;margin-top:12px">${esc(d.msg || '')}</div>
        ${le.resubmittedAt > d.at ? `<div class="pills" style="margin-top:12px">${pill('Agreement signed', 'white sm', 'check')}</div>` : `<button class="btn" style="margin-top:14px" data-go="h-agreement">Sign the agreement</button>`}</div>`
        : `<div class="card fill" style="border-radius:28px;padding:20px"><div class="lbl">Neighbor helper</div>
        <div class="h2" style="margin-top:6px">Not this time</div><div style="margin-top:6px;font-size:14px">${d.msg ? esc(d.msg) : 'We can’t add you as a neighbor helper right now.'}</div><div style="margin-top:8px;font-size:14px">You’re still in Sarah’s circle, and she can ask you directly.</div></div>`;
      const reviewState = !d ? 'wait' : d.decision === 'declined' ? 'bad' : d.decision === 'asked' ? 'wait' : 'done';
      return `<div class="s">
    ${hdr(d && d.decision === 'approved' ? 'You’re a neighbor helper' : 'You’re almost visible', d ? 'Decision from your neighborhood lead' : 'Application in review · usually 1–2 days')}
    <div class="body">
      ${hero}
      <div class="lbl">What we’re checking</div>
      <div class="card" style="display:flex;flex-direction:column;gap:14px">${[['done', 'ID matches your name & photo'], ['done', 'Address is in the Elmwood pilot area'], ['done', 'Megan vouched · knows you 6 years'], ['done', 'Priya vouched · knows you 2 years'], [reviewState, 'Neighborhood lead review']].map(([s, t]) => `<div class="rowx c">${chk(s)}${t}</div>`).join('')}</div>
      <div class="card pbutter"><div class="strong">Meanwhile, you’re already in Sarah’s circle.</div><div class="sub" style="color:var(--ink)">She can ask you for Bear any time — that doesn’t wait on review.</div></div>
      ${LIVE.role ? '' : '<div class="foot"><a class="btn ghost" href="#/admin">See the admin side of this review →</a></div>'}
    </div></div>`;
    },
    after: () => { if (L('admin').lena) actOnce('lena', 'sawDecisionAt'); }
  },

  // ===== Flow C · Text invite & visit request (Ana) =====
  'lock': {
    name: 'Text arrives', render: () => `<div class="lock">
      <div class="date">Tuesday, November 24</div><div class="time">9:14</div>
      ${lockState() || (LIVE.on && LIVE.role === 'ana' && !L('sarah').askedAt ? `<div class="lock-wait">${icon('clock', 16)}Waiting for Sarah to ask…</div>` : `<div class="notif" data-go="thread" data-tr="up"><span class="app">${icon('message', 20)}</span>
        <div class="grow"><div style="display:flex;justify-content:space-between"><b style="font-size:15px">Wala</b><span style="color:var(--sys);font-size:13px">now</span></div>
        <div style="font-size:14px;line-height:19px;margin-top:2px">Sarah’s asking if you can drop in on Bear this Sunday 🐾 She added you to Bear’s circle — no app needed. Tap to see the details.</div></div></div>`)}
      <div class="hint">Sent as a regular SMS / iMessage from Wala’s number</div></div>`
  },

  'thread': {
    name: 'Invite + ask in one text', render: () => `<div class="s white">
    ${msgHdr('lock')}
    <div class="thread">
      <div class="sysmsg">Text Message · Today 9:14 AM</div>
      <div class="bub">Hi Ana 👋 it’s Wala, for Sarah Leach. She added you to Bear’s circle: the few people she trusts to help with him. No app or account needed.</div>
      <div class="bub">Sarah’s asking: could you drop in on Bear on Sun, Nov 29? Two short visits (8 am + 6 pm): breakfast, his dinner pill, a quick walk. $40, or call it a favor. Your call.</div>
      <div class="linkprev" data-go="request" data-tr="up"><img src="assets/bear.jpg" alt="Bear">
        <div class="in"><div class="strong" style="color:#111">Can you help with Bear on Sunday?</div><div class="small" style="color:var(--sys)">wala.app</div><div style="margin-top:6px">${pill('2 visits · Sun Nov 29', 'white sm')}</div></div></div>
      <div class="bub">Reply YES, NO, or tap above for details. Reply STOP anytime to opt out.</div>
      <div class="qr"><button data-go="sms">Yes 👍</button><button data-go="decline" data-tr="up">No, sorry</button><button data-go="request" data-tr="up">Tell me more</button></div>
    </div>${composer}</div>`,
    after: () => { if (!L('ana').openedAt) act('ana', { openedAt: Date.now(), stage: L('ana').stage || 'opened' }); }
  },

  'request': {
    name: 'Web: the request', render: () => `<div class="s">
    ${urlbar()}
    <div class="body">
      <div class="rowx c">${av('S', 's36')}<div><div class="small muted">Sarah is asking you</div><div class="ttl lg">Can you help with Bear on Sunday?</div></div></div>
      <div class="card butter photo" style="border-radius:28px"><img class="ph" src="assets/bear.jpg" alt="Bear">
        <div class="in"><div class="h1">Bear</div><div style="font-size:13px;margin-top:2px">9 · German Shepherd · gentle, a bit stiff in the mornings</div>
        <div class="pills" style="margin-top:12px">${pill('Senior', 'white sm')}${pill('Dinner pill', 'white sm', 'medical')}${pill('Loves Ana already', 'white sm', 'heart')}</div></div></div>
      <div class="lbl">Sunday, November 29</div>
      <div class="card divide">${[['8:00 am', 'Breakfast (2 cups) · out to the yard', '~20 min'], ['6:00 pm', 'Dinner + Rimadyl pill · short walk', '~30 min']].map(([t, a, b]) => `<div class="rowx c"><span class="time-tag">${t}</span><div><div class="strong">${a}</div><div class="sub">${b}</div></div></div>`).join('')}</div>
      <div class="card pblue rowx">${icon('heart')}<div><div class="strong">$40, or call it a favor</div><div class="sub" style="color:var(--ink)">Megan has Saturday covered. Sunday is the gap.</div></div></div>
      <div class="foot">
        <button class="btn" data-act="anaYes">Yes, I can help</button>
        <button class="btn ghost" data-go="voice-answer">${icon('mic', 18)}Answer by voice</button>
        <button class="btn ghost" data-go="pick">Pick visits or suggest a time</button>
        <a class="link" data-go="decline">Not this time</a>
        <div class="small muted" style="text-align:center">No app, no password. Sarah only sees your reply.</div>
      </div>
    </div></div>`,
    after: () => actOnce('ana', 'webAt', L('ana').stage ? {} : { stage: 'opened' })
  },

  'pick': {
    name: 'Web: pick visits', render: () => `<div class="s">
    ${urlbar()}
    <div class="body">
      <h1 class="h1">Which visits work?</h1>
      <p class="muted" style="margin:4px 0 0">Pick one or both. Sarah will sort out the rest.</p>
      ${[['am', '8:00 am', 'Breakfast · yard'], ['pm', '6:00 pm', 'Dinner + pill · walk']].map(([k, t, d]) => `
        <div class="opt ${STATE.ana[k] ? 'selected' : ''}" data-act="anaVisit" data-k="${k}" style="margin-top:12px"><span class="box ${STATE.ana[k] ? 'on' : ''}">${STATE.ana[k] ? icon('check', 14) : ''}</span><div class="grow"><div class="ttl lg">${t}</div><div class="sub">${d}</div></div><span class="small muted">Sun Nov 29</span></div>`).join('')}
      <div class="opt tap" data-go="suggest">${icon('clock')}<div class="grow"><div class="ttl" style="font-size:14px">Suggest a different time</div><div class="sub">e.g. 10 am instead of 8</div></div></div>
      <div class="lbl">Note to Sarah (optional)</div>
      <textarea class="field" aria-label="Note to Sarah">Of course! I’ll bring his favorite chews 🦴</textarea>
      <div class="lbl">Thank-you</div>
      <div class="pills" data-single>${pill('$40', 'lg chip on')}${pill('It’s a favor', 'lg chip')}${pill('Trade a sit', 'lg chip')}</div>
      <div class="foot"><button class="btn" data-act="anaSend">Send to Sarah</button></div>
    </div></div>`
  },

  'verify': {
    name: 'Web: verify number', render: () => `<div class="s">
    ${urlbar()}
    <div class="body">
      <span class="ring" style="width:56px;height:56px;background:var(--pbutter)">${icon('phone', 24)}</span>
      <h1 class="h1" style="margin-top:20px">Quick check it’s you</h1>
      <p class="muted" style="margin:6px 0 0">We texted a 6-digit code to (•••) •••-0172. This keeps Bear’s home details with the right person.</p>
      <div class="otp" style="margin-top:20px" id="otp">${'<span></span>'.repeat(6)}</div>
      <div class="small muted">Didn’t get it? <a class="link" style="display:inline;font-size:12px" data-act="resendCode">Send a new code</a></div>
      <div class="card pblue rowx" style="margin-top:24px">${icon('shield')}<div><div class="strong">No password, no account</div><div class="sub" style="color:var(--ink)">Your number is your login. You’ll verify again before a door code is shown.</div></div></div>
      <div class="foot"><button class="btn" data-act="anaVerify">Confirm</button></div>
    </div></div>`,
    after: (el) => {
      const cells = el.querySelectorAll('#otp span'); const code = '482917';
      cells[0].classList.add('cur');
      code.split('').forEach((d, i) => setTimeout(() => {
        if (!el.isConnected) return;
        cells[i].textContent = d; cells[i].classList.remove('cur'); if (cells[i + 1]) cells[i + 1].classList.add('cur');
      }, 500 + i * 220));
    }
  },

  'confirmed': {
    name: 'Web: you’re on', render: () => {
      const a = L('ana');
      const n = a.visits ? (a.visits.am ? 1 : 0) + (a.visits.pm ? 1 : 0) : (STATE.ana.am ? 1 : 0) + (STATE.ana.pm ? 1 : 0);
      const v = a.stage === 'yes' ? visitText(a.visits, a.times) : visitText(STATE.ana);
      return `<div class="s">${urlbar()}
      <div class="body">
        <div class="card butter" style="border-radius:28px;padding:20px">${av('B', 's56 white')}<div class="h1" style="font-size:24px;margin-top:14px">You’re on for Sunday 🎉</div><div style="margin-top:6px">Sarah’s been told. Bear has no idea how lucky he is.</div></div>
        <div class="lbl">Before Sunday</div>
        <div class="card divide inset">
          <div class="rowx">${chk('done')}<div class="grow"><div class="ttl">Visits confirmed</div><div class="sub">${v} · ${n === 2 ? '$40' : '$20'}</div></div></div>
          <div class="rowx">${chk(a.signedAt ? 'done' : '')}<div class="grow"><div class="ttl">${a.signedAt ? 'Sit agreement signed' : 'Sign the sit agreement'}</div><div class="sub">${a.signedAt ? 'Includes the emergency vet consent' : '2 minutes · includes the emergency vet consent'}</div></div>${a.signedAt ? '' : '<button class="pill peri" data-go="agreement">Sign</button>'}</div>
          <div class="rowx ${a.signedAt ? 'tap' : ''}" ${a.signedAt ? 'data-go="doorcode"' : ''}>${chk(a.codeViewedAt ? 'done' : 'wait')}<div class="grow"><div class="ttl">Door code</div><div class="sub">${a.signedAt ? 'Arrives Sat 9 am via secure link · <span style="color:var(--peri);font-weight:500">preview Saturday →</span>' : 'Arrives Sat 9 am via secure link · after you sign'}</div></div></div>
        </div>
        <div class="card peri" style="padding:20px"><div class="h2" style="font-size:18px;max-width:300px">Want photo checklists and updates for Sarah?</div>
          <div class="small" style="color:var(--peri-pale);margin-top:8px">Get Wala to tick off each visit and send Sarah a photo in one tap. Totally optional.</div>
          <div class="store" style="margin-top:14px"><span class="tap" data-toast="App Store link goes here">Download on App Store</span><span class="tap" data-toast="Google Play link goes here">Get it on Google Play</span></div></div>
        <div class="foot">${LIVE.role ? `<a class="link" data-toast="Sarah’s been told. You’ll get the door code by text Saturday.">Or keep doing everything by text. That works too.</a>` : `<a class="link" data-go="owner">Or keep doing everything by text. That works too.</a><button class="btn ghost" data-go="owner">See what Sarah sees →</button>`}</div>
      </div></div>`;
    },
    after: () => { if (L('ana').stage !== 'yes') act('ana', { stage: 'yes', via: STATE.anaVia || 'web', visits: { ...STATE.ana }, note: STATE.anaNote || '', thanks: STATE.anaThanks || '$40', answeredAt: Date.now() }); }
  },

  'sms': {
    name: 'Alt: answer by text', render: () => `<div class="s white">
    ${msgHdr('thread')}
    <div class="thread" id="smsThread"><div class="sysmsg">Today 9:21 AM</div></div>${composer}</div>`,
    after: (el) => {
      const t = el.querySelector('#smsThread');
      const seq = [
        ['me', 'Yes 👍'],
        ['w', 'Amazing, Sarah will be thrilled. Which visits work?\n1 = 8 am\n2 = 6 pm\n3 = both'],
        ['me', '3'],
        ['w', 'You’re on for both Sunday visits ✓\nBefore then, please sign a 2-min sit agreement (it includes who can OK the vet): wala.app/a/7Q2K', 'agreement'],
        ['sys', 'Saturday 9:00 AM'],
        ['w', '🔐 Bear’s door code is ready. Open the secure link and confirm your number to see it. It expires Mon 9 am.\nwala.app/k/••••', 'doorcode'],
        ['w', 'Bear’s care plan, anytime: wala.app/bear', LIVE.role ? '' : 'owner']];
      let delay = 300;
      seq.forEach(([who, txt, go]) => {
        const isW = who === 'w';
        if (isW) setTimeout(() => { if (!el.isConnected) return; const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; t.appendChild(ty); }, delay);
        delay += isW ? 700 : 450;
        setTimeout(() => {
          if (!el.isConnected) return;
          t.querySelector('.typing')?.remove();
          const d = document.createElement('div');
          if (who === 'sys') { d.className = 'sysmsg'; d.textContent = txt; }
          else { d.className = 'bub pop' + (who === 'me' ? ' me' : ''); d.textContent = txt; if (go) { d.dataset.go = go; d.classList.add('tap'); } }
          t.appendChild(d); d.scrollIntoView({ block: 'end', behavior: 'smooth' });
          if (/You’re on/.test(txt) && L('ana').stage !== 'yes') act('ana', { stage: 'yes', via: 'text', visits: { am: true, pm: true }, note: '', thanks: '$40', answeredAt: Date.now() });
          if (go === 'owner') { const h = document.createElement('div'); h.className = 'sysmsg'; h.innerHTML = '<a class="link" style="font-size:12px" data-go="owner">See what Sarah sees →</a>'; t.appendChild(h); }
        }, delay);
        delay += 250;
      });
    }
  },

  'decline': {
    name: 'Alt: not this time', render: () => `<div class="s">
    ${urlbar()}
    <div class="body">
      <h1 class="h1">No worries at all</h1>
      <p class="muted" style="margin:6px 0 0">We’ll let Sarah know kindly. She won’t see a reason unless you add one.</p>
      <div class="lbl">Add a reason? (optional)</div>
      <div class="pills" data-single>${['Away that weekend', 'Busy that day', 'Not comfortable with meds', 'Something else'].map((t, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="lbl">Can Sarah ask again?</div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px">${[['Yes, anytime', 1], ['Only for short walks', 0], ['Not until after the holidays', 0]].map(([t, on]) => `<div class="opt ${on ? 'selected' : ''}"><div class="grow">${t}</div><span class="radio"></span></div>`).join('')}</div>
      <div class="foot"><a class="link rust" data-go="stop">Leave Bear’s circle & stop texts</a><button class="btn" data-act="anaDecline">Let Sarah know</button></div>
    </div></div>`
  },

  'owner': {
    name: 'Owner: Sunday is covered', render: () => {
      const a = anaAnswer(), sr = L('sarah');
      const dana = sr.coveredBy === 'Dana';
      if (!dana && a.stage !== 'yes') return `<div class="s">${hdr('Asking Bear’s people', 'Drop-ins · Sat Nov 28 – Sun Nov 29', 'status')}<div class="body"><div class="card pbutter"><div class="h2">Waiting on Ana</div><div class="sub">You’ll get a notification as soon as she answers.</div></div></div></div>`;
      const who = dana ? 'Dana' : 'Ana';
      const steps = dana
        ? [['done', 'Verified neighbor · vouched by Megan and Priya'], ['wait', 'Sit agreement + vet consent sent'], ['', 'Door code goes out Sat 9 am']]
        : [[a.verifiedAt || a.via === 'text' ? 'done' : 'wait', a.via === 'text' ? 'Answered from her own number' : 'Verified her number'],
           [a.signedAt ? 'done' : 'wait', a.signedAt ? 'Signed the sit agreement + vet consent' : 'Sit agreement + vet consent sent'],
           [a.codeViewedAt ? 'done' : '', a.codeViewedAt ? `Opened the door code · ${new Date(a.codeViewedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Door code goes out Sat 9 am']];
      const left = steps.filter(x => x[0] !== 'done').length;
      const ready = !dana && a.signedAt;
      return `<div class="s">
    ${hdr('Asking Bear’s people', 'Drop-ins · Sat Nov 28 – Sun Nov 29', 'status')}
    <div class="body">
      <div class="card rowx" style="border-radius:22px"><span class="ring" style="width:36px;height:36px;border-radius:10px;background:var(--peri);color:var(--butter)"><i class="logo" style="width:26px;height:13px"></i></span>
        <div class="grow"><div class="ttl">${who} said yes for Sunday 🎉</div><div class="sub">${dana ? '“Happy to — Pepper and Bear are old friends.” · 8 am + 6 pm · $20 per visit' : `${a.note ? `“${esc(a.note)}” · ` : ''}${visitText(a.visits, a.times)} · ${esc(a.thanks || '$40')}`}</div></div></div>
      ${!dana && (a.updates || []).length ? (() => { const u = a.updates[a.updates.length - 1]; return `<div class="card ${u.flag ? 'prust' : 'pbutter'}"><div class="rowx c" style="justify-content:space-between"><div class="lbl" ${u.flag ? 'style="color:var(--rust)"' : ''}>${u.flag ? 'Needs a look · ' : ''}Latest from Ana · ${new Date(u.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div><button class="pill white sm" data-act="speakUpdate">${icon('speaker', 13)}Listen</button></div>
        <div style="margin-top:8px;font-size:14px">“${esc(u.text)}”</div><div class="pills" style="margin-top:10px">${u.chips.map(c => pill(c, 'white sm')).join('')}</div></div>`; })() : ''}
      <div class="card pgrass"><div class="h2">You’re covered all weekend.</div><div class="sub" style="font-size:13px">${dana ? 'Dana is a vouched neighbor, covered when booked through Wala.' : 'Neighbors won’t be asked. Pros were never needed.'}</div></div>
      <div class="lbl">The weekend</div>
      <div class="card divide inset">
        <div class="rowx c">${av('M')}<div class="grow"><div class="ttl">Megan</div><div class="sub">Sat · 2 visits</div></div>${pill('Ready', 'pgrass sm')}</div>
        <div class="rowx c">${av(dana ? 'DR' : 'A', dana ? 'blue' : '')}<div class="grow"><div class="ttl">${who}</div><div class="sub">Sun · ${dana ? '8 am + 6 pm · neighbor' : `${visitText(a.visits, a.times)} · answered by ${a.via || 'web'}`}</div></div>${ready && left <= 1 ? pill('Ready', 'pgrass sm') : pill(left + (left === 1 ? ' step left' : ' steps left'), 'pbutter sm')}</div>
      </div>
      <div class="card"><div class="lbl">${who} · before Sunday</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">${steps.map(([st, t]) => `<div class="rowx c">${chk(st)}<span style="font-size:13px">${t}</span></div>`).join('')}</div></div>
      <div class="foot"><button class="btn ghost" data-go="sit">See the first-sit checklist</button>${LIVE.role ? '' : '<a class="link" href="#/">Back to all flows</a>'}</div>
    </div></div>`;
    },
    after: () => { if (anaAnswer().stage === 'yes' || L('sarah').coveredBy) actOnce('sarah', 'sawAnswerAt'); }
  }
};

// ---------- flows ----------
const FLOWS = [
  { id: 'owner', title: 'Neighbors & trusted friends', tag: 'Owner · Sarah', blurb: 'Ask your circle first, then neighbors vouched for by people you know, then insured pros. Same paperwork for everyone.', steps: ['who', 'circle', 'invite', 'dana', 'status', 'sit', 'thanks'] },
  { id: 'text', title: 'Circle invite by text', tag: 'Friend · Ana, not on the app', blurb: 'One text invites Ana to Bear’s circle and asks about Sunday. She answers by text or on a no-download web page.', steps: ['lock', 'thread', 'request', 'pick', 'verify', 'confirmed', 'sms', 'decline', 'owner'] },
  { id: 'helper', title: 'Becoming a neighbor helper', tag: 'Helper · Lena', blurb: 'Joining a circle needs no checks. Helping the wider neighborhood needs ID, address and two vouches.', steps: ['h-invited', 'h-apply', 'h-review'] }
];
