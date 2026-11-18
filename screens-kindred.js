// ---------- Kindred sitter app (recreated from kindred-umber-kappa.vercel.app) + staged-by-ring + neighborhood ----------
// The live app is Danielle's (still branded "Pawtrust"); this is a prototype copy using the Kindred name.
// Theme: .kd swaps the Wala tokens for the app's lavender ones, so shared components (card, pill, btn…) restyle themselves.

const KD = { r2: { id: false, addr: false }, vouches: 1, refSent: false, offered: false, offer: { am: true, pm: true }, pay: 'Neighbor rate · $20/visit', proStarted: false };

const kdNav = (on = 'Today') => `
  <nav class="navbar">${[['house', 'Today', 'kd-s-today'], ['message', 'Messages', ''], ['calendar', 'Schedule', ''], ['money', 'Earnings', ''], ['user', 'Account', '']]
    .map(([i, n, g]) => `<a class="${n === on ? 'on' : ''}" ${g ? `data-go="${g}"` : `data-toast="${n} isn’t part of this prototype"`}><span class="ico">${icon(i, 18)}</span>${n}</a>`).join('')}</nav>`;
const kdMark = () => `<div class="kd-mark"><span>${icon('paw', 16)}</span>Kindred</div>`;
const kdPet = (e, bg = 'var(--pblue)') => `<span class="kd-pet" style="background:${bg}">${e}</span>`;
const kdStep = (ic, t, s, state = '', go = '', toastMsg = '') => `<div class="kd-step ${state} tap" ${go ? `data-go="${go}"` : `data-toast="${toastMsg || t + ' isn’t part of this prototype'}"`}><span class="kd-ic">${state === 'done' ? icon('check', 15) : icon(ic, 16)}</span><div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div>${icon('next', 16)}</div>`;
const kdRing = (n, title, sub, state, body = '') => `<div class="kd-ring ${state}"><div class="rowx c"><span class="kd-num">${state === 'done' ? icon('check', 14) : n}</span><div class="grow"><div class="ttl">${title}</div><div class="sub">${sub}</div></div>${state === 'done' ? pill('Open', 'pgrass sm') : state === 'now' ? pill('Next', 'peri sm') : pill('Later', 'sm')}</div>${body}</div>`;

Object.assign(SCREENS, {

  // ===== Flow F · Kindred sitter app, recreated as it is today =====
  'kd-welcome': {
    name: 'Welcome', render: () => `<div class="s kd">
    <div class="body">
      ${kdMark()}
      <div class="kd-hero"><img src="assets/bear.jpg" alt=""><span class="pill white sm">${icon('shield', 13)}Background-checked caregivers</span></div>
      <h1 class="kd-h1" style="margin-top:20px">Care you’ll be proud of. Pay you can count on.</h1>
      <p class="muted" style="margin:8px 0 0">The caregiver app for professional pet sitters. Accept jobs, deliver great care, and grow trusted client relationships all in one place.</p>
      <div class="rowx c small" style="margin-top:14px">${['🐕', '🐈', '🐕', '🐇'].map(e => kdPet(e)).join('')}<span><b>4.9</b> · 20,000+ pets cared for</span></div>
      <div class="foot"><button class="btn" data-go="kd-role">Create your account</button><button class="btn ghost kd-outline" data-go="kd-today-new">I already have an account</button>
      <div class="tiny muted" style="text-align:center">By continuing you agree to Kindred’s Terms of Service and Privacy Policy.</div></div>
    </div></div>`
  },

  'kd-role': {
    name: 'How will you use Kindred?', render: () => `<div class="s kd">
    ${hdr('', '', 'kd-welcome')}
    <div class="body">
      ${kdMark()}
      <h1 class="kd-h1">How will you use Kindred?</h1>
      <p class="muted" style="margin:6px 0 0">You can always add the other role later from your profile.</p>
      ${[['authorized', 'I’m a pet sitter', 'Offer walks, sitting, and boarding — and get booked by nearby owners.', 'kd-today-new'], ['paw', 'I’m a pet owner', 'Find trusted, background-checked care for your pets when you need it.', 'st-start'], ['heart', 'I’m helping someone I know', 'Watch a friend, family, or neighbor’s pets — no pro profile needed.', 'h-invited']]
        .map(([i, t, s, g]) => `<div class="kd-step tap" data-go="${g}"><span class="kd-ic">${icon(i, 17)}</span><div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div>${icon('next', 16)}</div>`).join('')}
      <div class="note" style="margin-top:20px"><b>Today:</b> the sitter path goes straight to a 5-step checklist (next screen). The staged flow replaces this picker with “Help pets near you”.</div>
    </div></div>`
  },

  'kd-today-new': {
    name: 'Today · new account (as is)', render: () => `<div class="s kd">
    <div class="body">
      <div class="rowx c"><div class="grow"><div class="small muted">Welcome to Kindred</div><h1 class="kd-h1">Let’s get you booked, Taylor</h1></div>${av('TM', 'kd-av')}</div>
      <p class="muted" style="margin:6px 0 0">Finish these steps and owners near you can start booking. Your upcoming visits will show up here.</p>
      <div class="kd-group">
        <div class="kd-group-h rowx c"><span class="kd-ic">${icon('sparkle', 16)}</span><div><div class="kd-h3">Get bookable</div><div class="sub">5 steps left before owners can book you.</div></div></div>
        <div class="rowx c small" style="padding:12px 16px 4px"><b class="grow">0 of 5 required</b><span class="muted">0%</span></div>
        <div style="padding:8px 16px 16px;display:flex;flex-direction:column;gap:8px">
          ${kdStep('shield', 'Complete your background check', 'Free for you · results in 1–3 business days', '', 'kd-bgcheck')}
          ${kdStep('user', 'Add a profile photo & bio', 'Owners book people they can picture')}
          ${kdStep('money', 'Choose your animals, services & rates', 'What you offer and your rates')}
          ${kdStep('house', 'Set up payouts', 'Add a bank account so you can get paid')}
          ${kdStep('calendar', 'Set your availability', 'Pick the days and times you can take visits')}
        </div>
      </div>
      <div class="card"><div class="kd-h3">Stand out to owners</div><div class="sub">Optional · 0 of 5 done · complete profiles get up to 3x more bookings</div></div>
      <div class="note"><b>The gap:</b> a new sitter has nothing to do until all 5 are done, the background check alone takes 1–3 days, and the people who already trust them can’t book them yet.</div>
    </div>${kdNav('Today')}</div>`
  },

  'kd-bgcheck': {
    name: 'Background check (as is)', render: () => `<div class="s kd">
    ${hdr('Background check', 'Get bookable · finish later', 'kd-today-new')}
    <div class="body">
      <p class="muted" style="margin:0">Every sitter on Kindred passes the same check before owners can book them. It’s free for you and won’t affect your credit.</p>
      <div class="lbl">What we check</div>
      ${[['contact', 'Identity & SSN trace', 'Confirms who you are and finds the addresses linked to you.'], ['search', 'National criminal database', 'Searches criminal records across all 50 states.'], ['shield', 'Sex offender registry', 'Checks the national sex offender public registry.'], ['location', 'County criminal records', 'Checks each county you’ve lived in over the past 7 years.']]
        .map(([i, t, s]) => `<div class="kd-step"><span class="kd-ic">${icon(i, 16)}</span><div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      <div class="card fill small"><div class="rowx c">${icon('clock', 16)}Results usually take 1–3 business days.</div><div class="rowx c" style="margin-top:8px">${icon('lock', 16)}Encrypted and only shared with our screening partner.</div></div>
      <div class="foot"><button class="btn" data-go="kd-today">Start background check</button><div class="tiny muted" style="text-align:center">Prototype: skips ahead to a bookable sitter’s Today.</div></div>
    </div></div>`
  },

  'kd-today': {
    name: 'Today · bookable (as is)', render: () => `<div class="s kd">
    <div class="body">
      <div class="rowx c"><div class="grow"><div class="small muted">Wednesday, Nov 18</div><h1 class="kd-h1">Good afternoon, Taylor</h1></div>${av('TM', 'kd-av')}</div>
      <div class="pills"><span class="pill peri">All</span><span class="pill white">To do <b class="kd-badge">5</b></span><span class="pill white">Staying with you 1</span><span class="pill white">Today 5</span></div>
      <div class="lbl">To do · 5</div>
      <div class="card divide">
        ${[['🐈', 'New request', 'Pixel', 'House sitting · Nov 22–24', '4h left', 'View request'], ['🐈', 'New request', 'Miso + Tofu', 'Drop-in · Tomorrow', '22h left', 'View request'], ['🐕', 'Needs confirmation', 'Luna', 'Daycare · Tomorrow', '12h left', 'Confirm visit']]
          .map(([e, k, n, s, t, b]) => `<div class="rowx c">${kdPet(e)}<div class="grow"><div class="kd-kicker">${k}</div><div class="strong">${n}</div><div class="sub">${s}</div><span class="pill prust sm" style="margin-top:4px">${icon('clock', 12)}${t}</span></div><button class="btn sm" data-toast="Requests aren’t part of this prototype">${b}</button></div>`).join('')}
      </div>
      <div class="lbl">Staying with you · 1</div>
      <div class="card"><div class="rowx c">${kdPet('🐶', 'var(--pbutter)')}<div class="grow"><div class="strong">Cooper · Boarding</div><div class="sub">Night 2 of 3 · Pickup Fri, Nov 20 · 10:00 AM</div></div>${pill('4/8 today', 'sm')}</div></div>
      <div class="lbl">Today · 5</div>
      <div class="card"><div class="rowx c">${kdPet('🐈')}<div class="grow"><div class="strong">Miso + Tofu ${pill('In progress', 'pgrass sm')}</div><div class="sub">Drop-in · Cole Valley · arrive 4:30–5:30 PM</div></div></div><button class="btn sm" style="margin-top:12px;width:100%" data-toast="Visits aren’t part of this prototype">Continue visit</button></div>
    </div>${kdNav('Today')}</div>`
  },

  // ===== Flow G · Sitter side, staged by ring + Elmwood =====
  'kd-s-start': {
    name: 'Stage 0 · help pets near you', render: () => `<div class="s kd">
    <div class="body">
      <div class="rowx c">${kdMark()}<span class="grow"></span>${pill('Stage 0 · no account', 'white sm')}</div>
      <h1 class="kd-h1" style="margin-top:18px;font-size:30px">Help pets near you</h1>
      <p class="muted" style="margin:6px 0 0">See who needs a hand on your block before you sign up for anything.</p>
      <div class="lbl">Your neighborhood or ZIP</div>
      <div class="stg-field"><input class="field" value="80129" aria-label="ZIP code"><span class="stg-hit">${icon('check', 14)}Elmwood</span></div>
      <div class="lbl">How do you want to help?</div>
      <div class="pills">${['Drop-ins', 'Walks', 'Overnights', 'Cats', 'Big dogs'].map((t, i) => `<span class="pill lg chip ${i < 2 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="card rowx" style="margin-top:20px"><span class="kd-ic">${icon('info', 16)}</span><div><div class="strong">You don’t need to be a pro to start</div><div class="sub">Help people you know with no checks. Add ID and vouches to help neighbors. Go pro when you want paid bookings from anyone.</div></div></div>
      <div class="foot"><button class="btn" data-go="kd-s-demand">See who needs help</button><a class="link" data-go="kd-role">I’m here to book care instead</a></div>
    </div></div>`
  },

  'kd-s-demand': {
    name: 'Stage 0 · demand nearby', render: () => `<div class="s kd">
    ${hdr('Elmwood this month', 'Near 80129', 'kd-s-start')}
    <div class="body">
      <div class="kd-group" style="padding:16px"><div class="stg-stats"><div><b>14</b><span>asks from neighbors</span></div><div><b>3</b><span>on your block</span></div><div><b>$20</b><span>typical neighbor drop-in</span></div></div></div>
      <div class="lbl">Recent asks</div>
      <div class="card divide">
        ${[['🐕', 'Senior shepherd · Elm St', 'Sun drop-ins · 8 am + 6 pm'], ['🐈', 'Two cats · Linden St', 'Thanksgiving week · daily'], ['🐕', 'Lab · Birch Ave', 'Weekend walks · Dec 19']]
          .map(([e, t, s]) => `<div class="rowx c">${kdPet(e)}<div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div>${icon('lock', 15, 'muted')}</div>`).join('')}
        <div class="small muted">Owner names and exact streets open at ring 2.</div>
      </div>
      <div class="lbl">Three rings, one at a time</div>
      <div class="card divide">
        <div class="rowx c"><span class="kd-num">1</span><div><div class="strong">Your circle · today</div><div class="sub">Help people who invite you. Phone number only.</div></div></div>
        <div class="rowx c"><span class="kd-num">2</span><div><div class="strong">Elmwood neighbors · ~1 day</div><div class="sub">ID, address and 2 vouches. Answer asks like these.</div></div></div>
        <div class="rowx c"><span class="kd-num">3</span><div><div class="strong">Pro · when you’re ready</div><div class="sub">Background check, payouts, rates. Booked by anyone nearby.</div></div></div>
      </div>
      <div class="foot"><button class="btn" data-go="kd-s-circle">Start with ring 1</button></div>
    </div></div>`
  },

  'kd-s-circle': {
    name: 'Ring 1 · people who already trust you', render: () => `<div class="s kd">
    ${hdr('Your circle', 'Ring 1 · phone number only', 'kd-s-demand')}
    <div class="body">
      <h2 class="kd-h2">Who already asks you for help?</h2>
      <p class="muted" style="margin:6px 0 0">We found 2 invites waiting for your number. Saying yes needs no checks — their trust is the check.</p>
      <div class="card divide">
        ${[['🐈', 'Maya Chen · Miso', 'Your neighbor · invited you Nov 2'], ['🐕', 'Jordan Ellis · Biscuit', 'Your friend · invited you Oct 28']].map(([e, t, s]) => `<div class="rowx c">${kdPet(e)}<div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div>${pill('Joined', 'pgrass sm', 'check')}</div>`).join('')}
      </div>
      <button class="btn ghost kd-outline" data-toast="Sends a link so a friend can add you to their pet’s circle">${icon('send', 16)}Tell someone you can help</button>
      <div class="note rowx">${icon('info', 18)}<div>No ratings, no penalties in ring 1. You see each pet’s care plan and say yes when you can.</div></div>
      <div class="foot"><button class="btn" data-act="kdCircleDone">Go to Today</button></div>
    </div></div>`
  },

  'kd-s-today': {
    name: 'Today · rings replace “Get bookable”', render: () => {
      const r2done = KD.r2.id && KD.r2.addr && KD.vouches >= 2;
      const r2body = r2done ? '' : `<div class="kd-ring-steps">
        ${kdStep('contact', 'Verify your ID', KD.r2.id ? 'Matched · Driver’s license' : 'Photo of your license · ~2 min', KD.r2.id ? 'done' : '', 'kd-s-ring2')}
        ${kdStep('location', 'Confirm your address', KD.r2.addr ? 'Elm St · neighbors see your block only' : 'So neighbors know you’re close', KD.r2.addr ? 'done' : '', 'kd-s-ring2')}
        ${kdStep('people', `Get 2 vouches (${Math.min(KD.vouches, 2)} of 2)`, KD.vouches >= 2 ? 'Maya and Megan vouched' : 'Maya vouched · ask one more', KD.vouches >= 2 ? 'done' : '', 'kd-s-ring2')}
      </div>`;
      const r3body = `<div class="kd-ring-steps">${['Background check', 'Payouts', 'Services & rates', 'Availability', 'Photo & bio'].map(t => `<span class="pill white sm">${t}</span>`).join('')}</div>`;
      return `<div class="s kd">
      <div class="body">
        <div class="rowx c"><div class="grow"><div class="small muted">Wednesday, Nov 18</div><h1 class="kd-h1">Hi Taylor</h1></div>${av('TM', 'kd-av')}</div>
        <div class="lbl">Today · 2</div>
        <div class="card divide">
          ${[['🐈', 'Miso · Maya Chen', 'Morning & evening · your neighbor'], ['🐕', 'Biscuit · Jordan Ellis', 'Midday walk · your friend']].map(([e, t, s]) => `<div class="rowx c">${kdPet(e)}<div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div><button class="btn sm" data-toast="Visits aren’t part of this prototype">Start</button></div>`).join('')}
        </div>
        ${r2done ? `<div class="card tap kd-elm" data-go="kd-s-board"><div class="rowx c"><span class="kd-ic">${icon('people', 16)}</span><div class="grow"><div class="strong">Elmwood · 3 asks you can answer</div><div class="sub">Sarah needs Sunday drop-ins for Bear</div></div>${icon('next', 16)}</div></div>` : ''}
        <div class="lbl">Where you can help</div>
        ${kdRing(1, 'Your circle', 'Helping Maya and Jordan', 'done')}
        ${kdRing(2, 'Elmwood neighbors', r2done ? 'Open · you can answer neighbor asks' : '3 things · unlocks 14 asks a month nearby', r2done ? 'done' : 'now', r2body)}
        ${kdRing(3, 'Pro sitter', KD.proStarted ? 'Background check started · results in 1–3 days' : 'Paid bookings from anyone nearby · when you’re ready', 'later', r2done ? `${r3body}<button class="btn sm ghost kd-outline" style="margin-top:12px;width:100%" data-go="kd-s-pro">See what carries over</button>` : r3body)}
        <div class="card"><div class="kd-h3">Stand out to owners</div><div class="sub">Optional · references and past pets count toward your vouches</div></div>
      </div>${kdNav('Today')}</div>`;
    }
  },

  'kd-s-ring2': {
    name: 'Ring 2 · become a neighbor helper', render: () => {
      const done = KD.r2.id && KD.r2.addr && KD.vouches >= 2;
      return `<div class="s kd">
      ${hdr('Help Elmwood neighbors', 'Ring 2 · about a day, mostly waiting on a vouch', 'kd-s-today')}
      <div class="body">
        <p class="muted" style="margin:0">Neighbors see you only after these three. No SSN, no credit check — that’s only for pros.</p>
        <div class="kd-check ${KD.r2.id ? 'done' : ''}">${chk(KD.r2.id ? 'done' : '')}<div class="grow"><div class="strong">Verify your ID</div><div class="sub">${KD.r2.id ? 'Driver’s license · matched just now' : 'Photo of your license + a selfie'}</div></div>${KD.r2.id ? '' : `<button class="btn sm" data-act="kdId">Scan</button>`}</div>
        <div class="kd-check ${KD.r2.addr ? 'done' : ''}">${chk(KD.r2.addr ? 'done' : '')}<div class="grow"><div class="strong">Confirm your address</div><div class="sub">${KD.r2.addr ? '300s block of Elm St · shown to neighbors' : 'We show your block, never your number'}</div></div>${KD.r2.addr ? '' : `<button class="btn sm" data-act="kdAddr">Confirm</button>`}</div>
        <div class="kd-check ${KD.vouches >= 2 ? 'done' : ''}">${chk(KD.vouches >= 2 ? 'done' : 'wait')}<div class="grow"><div class="strong">2 vouches from people who know you</div><div class="sub">${KD.vouches >= 2 ? 'Maya Chen · Megan (next door)' : KD.refSent ? 'Maya ✓ · Megan asked · usually replies same day' : 'Maya Chen vouched ✓ · one more to go'}</div></div>${KD.vouches >= 2 ? '' : KD.refSent ? `<button class="btn sm ghost" data-act="kdVouchIn">Simulate yes</button>` : `<button class="btn sm" data-go="kd-s-ref">Ask</button>`}</div>
        <div class="card fill small"><div class="lbl">Same as the owner side</div><div style="margin-top:6px">Owners see “Vouched by Maya C.” and your block. Your number, address and last name stay private.</div></div>
        <div class="foot">${done ? `<button class="btn" data-go="kd-s-board">See Elmwood asks</button>` : `<button class="btn" data-act="kdRing2Check">I’m done for now</button>`}</div>
      </div></div>`;
    }
  },

  'kd-s-ref': {
    name: 'Ask for a vouch (reuses “Request a reference”)', render: () => `<div class="s kd">
    ${hdr('Ask for a vouch', 'Ring 2 · one more to go', 'kd-s-ring2')}
    <div class="body">
      <p class="muted" style="margin:0">A vouch from someone who’s seen you with animals. It also counts as a reference if you go pro later.</p>
      <div class="lbl">How do they know you?</div>
      <div class="pills" data-single>${['Friend or neighbor', 'Past client', 'Vet or vet tech', 'Employer'].map((t, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="lbl">Who</div>
      <input class="field" value="Megan · 555-0188" aria-label="Who">
      <div class="lbl">Personal note</div>
      <textarea class="field" rows="3" aria-label="Note">Hi Megan! I’m signing up to help neighbors with their pets on Elmwood. Would you vouch for me? You’ve seen me with Pepper.</textarea>
      <div class="sub">They get a text with one button. No account needed.</div>
      <div class="foot"><button class="btn" data-act="kdSendRef">Send request</button></div>
    </div></div>`
  },

  'kd-s-board': {
    name: 'Elmwood asks · sitter view', render: () => `<div class="s kd">
    ${hdr('Elmwood asks', 'Ring 2 · within 6 blocks', 'kd-s-today')}
    <div class="body">
      <div class="card kd-elm">
        <div class="rowx c">${av('S', 'pbutter s36')}<div class="grow"><div class="strong">Sarah L. · Bear</div><div class="tiny muted">Elm St · 2 blocks · vouched by Megan</div></div>${pill('Ask', 'pbutter sm')}</div>
        <div style="margin-top:10px">Sunday drop-ins, 8 am + 6 pm. Senior shepherd, one dinner pill.</div>
        <div class="pills" style="margin-top:8px">${pill('Senior', 'white sm')}${pill('Joint pill', 'white sm')}${pill('Nervous around big dogs', 'white sm')}</div>
        ${KD.offered ? `<div class="card pgrass rowx c" style="margin-top:12px">${chk('done')}<div><div class="strong">Offer sent</div><div class="sub" style="color:var(--ink)">Sarah approves who helps · you’ll get a text</div></div></div>` : `<button class="btn" style="margin-top:12px" data-go="kd-s-offer">I can help</button>`}
      </div>
      <div class="card"><div class="rowx c">${av('P', 'pterra s36')}<div class="grow"><div class="strong">Priya H. · 2 cats</div><div class="tiny muted">Linden St · 5 blocks</div></div>${pill('Offer', 'pgrass sm')}</div><div style="margin-top:10px">Home all Thanksgiving week. Happy to cover cats on Linden or Elm.</div></div>
      <div class="card"><div class="rowx c">${av('O', 'pbutter s36')}<div class="grow"><div class="strong">Omar K. · Lab</div><div class="tiny muted">Birch Ave · 6 blocks</div></div>${pill('Trade', 'pblue sm')}</div><div style="margin-top:10px">Swap weekends? I’ll take your Dec 12 if you take my Dec 19.</div></div>
      <div class="note">This is the same board owners see in the Wala “Neighborhood & community” flow, from the helper’s side.</div>
    </div>${kdNav('Today')}</div>`
  },

  'kd-s-offer': {
    name: 'Offer to help Sarah', render: () => `<div class="s kd">
    ${hdr('Help with Bear', 'Sun Nov 29 · Sarah L. · 2 blocks', 'kd-s-board')}
    <div class="body">
      <div class="lbl">Which visits?</div>
      <div class="card divide">
        ${[['am', '8:00 am', 'Breakfast · out to the yard'], ['pm', '6:00 pm', 'Dinner + joint pill · short walk']].map(([k, t, s]) => `<div class="rowx c tap" data-act="kdVisit" data-k="${k}"><span class="box ${KD.offer[k] ? 'on' : ''}">${KD.offer[k] ? icon('check', 14) : ''}</span><div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="lbl">How would you like to be thanked?</div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px" id="kdPay">
        ${['Neighbor rate · $20/visit', 'A favor — no charge', 'Trade a sit'].map(t => `<div class="opt ${KD.pay === t ? 'selected' : ''}"><span class="radio"></span><div class="strong">${t}</div></div>`).join('')}
      </div>
      <div class="lbl">Note to Sarah (optional)</div>
      <input class="field" value="Happy to! I walk past your place every morning." aria-label="Note">
      <div class="card fill small rowx">${icon('shield', 16)}<div>If Sarah picks you, you both sign the same 2-minute sit agreement. The door code comes by secure link on the day.</div></div>
      <div class="foot"><button class="btn" data-act="kdOffer">Send offer</button></div>
    </div></div>`
  },

  'kd-s-pro': {
    name: 'Ring 3 · go pro when you’re ready', render: () => `<div class="s kd">
    ${hdr('Go pro', 'Ring 3 · paid bookings from anyone', 'kd-s-today')}
    <div class="body">
      <div class="kd-group" style="padding:20px"><div class="kd-h2">You’re already halfway there.</div><div class="sub" style="font-size:14px;margin-top:6px">What you’ve done as a neighbor helper carries over, so owners who don’t know you yet still have a reason to book.</div></div>
      <div class="lbl">Carries over</div>
      <div class="card divide">
        <div class="rowx c">${chk('done')}<div><div class="strong">ID and address</div><div class="sub">Counts toward the background check identity step</div></div></div>
        <div class="rowx c">${chk('done')}<div><div class="strong">2 vouches</div><div class="sub">Shown as references on your pro profile</div></div></div>
        <div class="rowx c">${chk('done')}<div><div class="strong">Circle and neighbor sits</div><div class="sub">Shown as “6 sits in Elmwood” — placeholder count</div></div></div>
      </div>
      <div class="lbl">Still to do · 5</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${kdStep('shield', 'Background check', KD.proStarted ? 'Started · results in 1–3 business days' : 'Free for you · SSN needed', KD.proStarted ? 'done' : '', 'kd-bgcheck')}
        ${kdStep('house', 'Set up payouts', 'Add a bank account so you can get paid')}
        ${kdStep('money', 'Services & rates', 'Pre-filled from your neighbor offers')}
        ${kdStep('calendar', 'Availability', 'Pre-filled from the visits you’ve taken')}
        ${kdStep('user', 'Photo & bio', 'Draft written from your vouches')}
      </div>
      <div class="foot"><button class="btn" data-act="kdPro">${KD.proStarted ? 'Back to Today' : 'Start with the background check'}</button><a class="link" data-go="kd-s-today" data-tr="back">Not now — keep helping neighbors</a></div>
    </div></div>`
  }
});

const KD_ACTS = {
  kdCircleDone() { toast('Ring 1 open · you’re helping Maya and Jordan'); setTimeout(() => go('kd-s-today'), 700); },
  kdId() { KD.r2.id = true; toast('ID matched (simulated)'); rerender(); },
  kdAddr() { KD.r2.addr = true; toast('Address confirmed · neighbors see your block only'); rerender(); },
  kdSendRef() { KD.refSent = true; toast('Vouch request sent to Megan'); setTimeout(() => go('kd-s-ring2', 'back'), 700); },
  kdVouchIn() { KD.vouches = 2; toast('Megan vouched for you 🎉'); rerender(); },
  kdRing2Check() { toast('Saved · we’ll text you when Megan replies'); setTimeout(() => go('kd-s-today', 'back'), 700); },
  kdVisit(el) { const k = el.dataset.k; KD.offer[k] = !KD.offer[k]; rerender(); },
  kdOffer() {
    if (!KD.offer.am && !KD.offer.pm) return toast('Pick at least one visit');
    KD.pay = document.querySelector('#kdPay .opt.selected')?.textContent.trim() || KD.pay;
    KD.offered = true; toast('Offer sent to Sarah'); setTimeout(() => go('kd-s-board', 'back'), 700);
  },
  kdPro() { if (KD.proStarted) return go('kd-s-today', 'back'); KD.proStarted = true; go('kd-bgcheck'); }
};
document.addEventListener('DOMContentLoaded', () => Object.assign(ACTS, KD_ACTS));

FLOWS.push(
  { id: 'kindred', title: 'Kindred sitter app · as it is', tag: 'Sitter · recreated', blurb: 'A copy of the live sitter app (kindred-umber-kappa.vercel.app, still branded Pawtrust): role picker, the 5-step “Get bookable” checklist, background check and a bookable Today.', steps: ['kd-welcome', 'kd-role', 'kd-today-new', 'kd-bgcheck', 'kd-today'] },
  { id: 'kindred-staged', title: 'Sitter · staged by ring + Elmwood', tag: 'Sitter · new · exploration', blurb: 'The sitter side of the same idea: help your circle today, add ID and two vouches to answer neighbor asks, and go pro later with what you’ve built carrying over.', steps: ['kd-s-start', 'kd-s-demand', 'kd-s-circle', 'kd-s-today', 'kd-s-ring2', 'kd-s-ref', 'kd-s-board', 'kd-s-offer', 'kd-s-pro'] }
);
