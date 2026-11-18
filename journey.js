// ---------- Full journey: one end-to-end story across Sarah's, Ana's and Dana's phones ----------
// Routes: #/j/<screen-id> keeps you in the journey (side panel + chapter order); #/s/<id> is the single-flow viewer.
// Reuses screens from every flow and adds the missing links: Dana's visit, Sarah's update + thanks,
// and the ring-3 (first pro booking) gate. Names, prices and counts are placeholders.

const PEOPLE = {
  sarah: { name: 'Sarah', phone: 'Sarah’s phone', who: 'Owner · Bear’s person', av: 'S', cls: 'pbutter' },
  ana: { name: 'Ana', phone: 'Ana’s phone', who: 'Sarah’s sister · not on Wala', av: 'A', cls: '' },
  dana: { name: 'Dana', phone: 'Dana’s phone', who: 'Neighbor 3 blocks away · has Pepper', av: 'DR', cls: 'blue' }
};

// ---- new screens that close the gaps ----
const J = { codeShown: false, tasks: { food: true, yard: true, water: false }, updateSent: false, thanks: 'Pay $40 · what you agreed', vouch: true, circle: true, pay: false, passport: false, booked: false };

SCREENS['j-status'] = { ...SCREENS.status, name: 'Sunday’s still open' };

Object.assign(SCREENS, {
  'kd-s-visit': {
    name: 'Dana’s Sunday visit', render: () => `<div class="s kd ${typeof KD_SKIN !== 'undefined' ? KD_SKIN : 'wala'}">
    ${hdr('Bear · Sunday drop-in', 'Sun Nov 29 · 8:00 am · Sarah’s place, Elm St', 'kd-s-board')}
    <div class="body">
      <div class="card ${J.codeShown ? 'pgrass' : 'pbutter'}">
        <div class="rowx c"><span class="kd-ic">${icon('key', 16)}</span><div class="grow"><div class="strong">${J.codeShown ? 'Door code · 4 8 2 9' : 'Door code is ready'}</div><div class="sub" style="color:var(--ink)">${J.codeShown ? 'Opened 8:01 am · Sarah was notified · expires 9 am' : 'Secure link, opens 7:45–8:30 am. Never sent as a text.'}</div></div>
        ${J.codeShown ? '' : `<button class="btn sm" data-act="jCode">Show</button>`}</div></div>
      <div class="lbl">Morning visit · from Bear’s care plan</div>
      <div class="card divide">
        ${[['food', 'Breakfast · 2 cups', 'Bowl is on the counter'], ['yard', 'Out to the yard', 'Let him sniff; he’s stiff in the mornings'], ['water', 'Fresh water', 'Bowl by the back door']]
          .map(([k, t, s]) => `<div class="rowx c tap" data-act="jTask" data-k="${k}"><span class="box ${J.tasks[k] ? 'on' : ''}">${J.tasks[k] ? icon('check', 14) : ''}</span><div class="grow"><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="lbl">Quick update for Sarah</div>
      <div class="card"><div class="rowx">${'<img src="assets/bear.jpg" alt="" class="stg-photo" style="width:56px;height:56px;border-radius:14px">'}<div class="grow" style="font-size:14px;line-height:1.4">Ate everything, did his yard loop, now back on his bed. Pepper says hi 🐾</div></div>
        <div class="pills" style="margin-top:10px">${pill('Ate all', 'white sm')}${pill('Yard', 'white sm')}${pill('All calm', 'white sm')}</div></div>
      <div class="foot">${J.updateSent ? `<div class="card pgrass rowx c">${chk('done')}<div class="strong">Sent to Sarah · 8:24 am</div></div><button class="btn" data-go="st-update">See it on Sarah’s phone →</button>` : `<button class="btn" data-act="jSendUpdate">Finish visit & send update</button>`}</div>
    </div></div>`
  },

  'st-update': {
    name: 'Sarah gets Dana’s update', render: () => `<div class="s">
    ${hdr('Bear’s Sunday', 'Dana · neighbor helper', 'owner')}
    <div class="body">
      <div class="card photo"><img class="ph" src="assets/bear.jpg" alt="Bear on his bed"><div class="in">
        <div class="rowx c">${av('DR', 's32 blue')}<div class="grow"><div class="strong">Dana · 8:24 am</div><div class="tiny muted">Morning drop-in done</div></div>${pill('All calm', 'pgrass sm')}</div>
        <div style="margin-top:10px;font-size:15px;line-height:1.4">“Ate everything, did his yard loop, now back on his bed. Pepper says hi 🐾”</div>
        <div class="pills" style="margin-top:10px">${pill('Ate all', 'sm')}${pill('Yard', 'sm')}${pill('Water', 'sm')}</div></div></div>
      <div class="lbl">Today</div>
      <div class="card divide">
        <div class="rowx c">${chk('done')}<div class="grow"><div class="strong">8:01 am · Door code opened</div><div class="sub">Code expired at 9 am</div></div></div>
        <div class="rowx c">${chk('done')}<div class="grow"><div class="strong">8:24 am · Visit done</div><div class="sub">23 minutes</div></div></div>
        <div class="rowx c">${chk('wait')}<div class="grow"><div class="strong">6:00 pm · Dinner + joint pill</div><div class="sub">Dana again · reminder at 5:30</div></div></div>
      </div>
      <div class="foot"><button class="btn" data-go="st-thanks">After tonight: thank Dana</button></div>
    </div></div>`
  },

  'st-thanks': {
    name: 'Thank Dana · vouch · add to circle', render: () => `<div class="s">
    ${hdr('Thank Dana', 'Sunday · 2 visits', 'st-update')}
    <div class="body">
      <div class="card pbutter"><div class="lbl">Bear’s Sunday</div><div style="margin-top:6px;font-size:15px">Two visits, breakfast and dinner, joint pill at 6:10 pm. Nothing flagged.</div>
        <div class="pills" style="margin-top:10px">${pill('🍽 Ate all', 'white sm')}${pill('💊 Med given', 'white sm')}${pill('🚶 Yard ×2', 'white sm')}</div></div>
      <div class="lbl">How do you want to say thanks?</div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px" id="jThanks">
        ${['Pay $40 · what you agreed', 'Call it a favor', 'Trade a sit · I’ll cover Pepper sometime'].map(t => `<div class="opt ${J.thanks === t ? 'selected' : ''}"><span class="radio"></span><div class="strong">${t}</div></div>`).join('')}
      </div>
      <div class="card divide">
        <div class="rowx c"><div class="grow"><div class="strong">Vouch for Dana</div><div class="sub">She’s been in your home. Elmwood sees “Vouched by Sarah L.”</div></div><span class="toggle ${J.vouch ? 'on' : ''}" role="switch" id="jVouch"></span></div>
        <div class="rowx c"><div class="grow"><div class="strong">Add Dana to Bear’s circle</div><div class="sub">Ring 2 → ring 1: next time she’s asked first, with Megan and Ana</div></div><span class="toggle ${J.circle ? 'on' : ''}" role="switch" id="jCircle"></span></div>
      </div>
      <div class="foot"><button class="btn" data-act="jThanks">Send thanks</button></div>
    </div></div>`
  },

  'st-pro-gate': {
    name: 'Ring 3 · first pro booking', render: () => {
      const ready = J.pay && J.passport;
      return `<div class="s">
      ${hdr('Book Dana · 2 overnights', 'Fri Dec 12 – Sun Dec 14 · you’re in Denver', 'st-home')}
      <div class="body">
        <div class="card rowx c">${av('DR', 's56 blue')}<div class="grow"><div class="ttl lg">Dana Ruiz · now a pro</div><div class="sub">Background-checked & insured since Dec 2 · in Bear’s circle</div>
          <div class="pills" style="margin-top:6px">${pill('Insured', 'pterra sm', 'authorized')}${pill('Vouched ×5', 'pblue sm', 'check')}</div></div></div>
        <div class="card pbutter"><div class="strong">Your first pro booking</div><div class="sub" style="color:var(--ink)">Ring 3 needs two things your circle and neighbors never did. Most of it is already filled in.</div></div>
        <div class="stg-step ${J.pay ? 'done' : ''}">${chk(J.pay ? 'done' : '')}<div class="grow"><div class="strong">Payment method</div><div class="sub">${J.pay ? 'Apple Pay · charged after the stay' : 'Charged after the stay, never up front'}</div></div>${J.pay ? '' : `<button class="btn sm ghost" data-act="jPay">Add</button>`}</div>
        <div class="stg-step ${J.passport ? 'done' : ''}">${chk(J.passport ? 'done' : '')}<div class="grow"><div class="strong">Bear’s full care profile</div><div class="sub">${J.passport ? 'Confirmed · meds, vet, allergies, behavior' : 'Pre-filled from his care plan and vet consent · check it'}</div></div>${J.passport ? '' : `<button class="btn sm ghost" data-act="jPassport">Check</button>`}</div>
        <div class="stg-step done">${chk('done')}<div class="grow"><div class="strong">Address, vet consent, door code</div><div class="sub">Already set up for the neighbor sits · reused</div></div></div>
        <div class="card divide">
          <div class="rowx c"><div class="grow">2 nights × $65</div><b>$130</b></div>
          <div class="rowx c"><div class="grow">Booking & insurance</div><b>$12</b></div>
          <div class="rowx c"><div class="grow strong">Total</div><b>$142</b></div>
        </div>
        <div class="foot"><button class="btn" ${ready ? 'data-act="jBook"' : 'data-toast="Add a payment method and check Bear’s profile first"'} style="${ready ? '' : 'opacity:.55'}">Book Dana</button></div>
      </div></div>`;
    }
  },

  'st-pro-booked': {
    name: 'All three rings', render: () => `<div class="s">
    ${hdr('Booked', 'Dana · Dec 12–14 · 2 overnights', 'st-pro-gate')}
    <div class="body">
      <div class="card pgrass" style="padding:20px"><div style="font-size:34px">🏡</div><div class="h1" style="margin-top:6px">Bear’s covered for December.</div>
        <div class="sub" style="color:var(--ink);font-size:14px;margin-top:6px">Dana confirmed. Same door code flow, same vet consent, now with insurance and backup cover.</div></div>
      <div class="lbl">Bear’s setup</div>
      <div class="card divide">
        ${[['Ring 1 · Your circle', 'Megan, Ana, Chris — and now Dana'], ['Ring 2 · Elmwood neighbors', 'Board, vouches, neighbor asks'], ['Ring 3 · Pros', 'Payment + full care profile, added at the first booking']].map(([t, s]) => `<div class="rowx c">${chk('done')}<div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="note rowx">${icon('info', 18)}<div><b>What Sarah never had to do up front:</b> make a password, fill in a 5-step profile, add a card, or write a full care plan. Each came up only when the next ring needed it.</div></div>
      <div class="foot"><button class="btn" data-act="jRestart">Start the journey again</button><a class="link" href="#/">All flows</a></div>
    </div></div>`
  }
});

const J_ACTS = {
  jCode() { J.codeShown = true; rerender(); },
  jTask(el) { const k = el.dataset.k; J.tasks[k] = !J.tasks[k]; rerender(); },
  jSendUpdate() { if (!J.codeShown) return toast('Open the door code first'); J.updateSent = true; act('sarah', { danaUpdateAt: Date.now() }); toast('Update sent to Sarah'); rerender(); },
  jThanks() {
    J.thanks = document.querySelector('#jThanks .opt.selected')?.textContent.trim() || J.thanks;
    J.vouch = document.getElementById('jVouch')?.classList.contains('on'); J.circle = document.getElementById('jCircle')?.classList.contains('on');
    toast(`Thanks sent${J.vouch ? ' · vouched' : ''}${J.circle ? ' · Dana’s in Bear’s circle' : ''}`);
    setTimeout(() => go('nb-board'), 900);
  },
  jPay() { J.pay = true; toast('Apple Pay added (simulated)'); rerender(); },
  jPassport() { J.passport = true; toast('Care profile confirmed'); rerender(); },
  jBook() { J.booked = true; STG.ring3 = true; go('st-pro-booked'); },
  jRestart() { location.hash = '#/j/st-start'; location.reload(); }
};

// ---- the story ----
const JOURNEY = [
  { title: 'Sarah finds Wala', steps: [
    ['st-start', 'sarah', 'Sarah is going away for Thanksgiving weekend. She opens Wala with no account: just Bear’s name and her ZIP.'],
    ['st-preview', 'sarah', 'The first thing she sees is her neighborhood, not a form: 9 helpers near Elmwood and a Saturday pack walk.'],
    ['st-phone', 'sarah', 'Stage 1. Her phone number is her login. No password, no email.'],
    ['st-pet', 'sarah', 'One line about Bear is enough to ask the people who already know him.'],
    ['st-home', 'sarah', 'Home shows the three rings. Ring 1 is open; rings 2 and 3 wait until she needs them.']] },
  { title: 'Sarah asks her circle', steps: [
    ['who', 'sarah', 'She needs drop-ins Sat Nov 28 – Sun Nov 29. Wala asks her circle first, and only widens if nobody can.'],
    ['status', 'sarah', 'Megan next door takes Saturday. Chris is away. Ana, her sister, hasn’t answered yet.']] },
  { title: 'Ana gets a text', steps: [
    ['lock', 'ana', 'Ana isn’t on Wala. The ask arrives as a normal text that also adds her to Bear’s circle.'],
    ['thread', 'ana', 'One message: invite + the ask. She can answer by text or tap through to a web page.'],
    ['request', 'ana', 'The no-download page shows Bear’s Sunday. Ana is away that weekend.'],
    ['decline', 'ana', 'She says no kindly. Sarah only sees a reason if Ana adds one.']] },
  { title: 'Sunday’s still open', steps: [
    ['j-status', 'sarah', 'Saturday is covered, Sunday isn’t. Time to widen the ask to Elmwood neighbors.'],
    ['st-gate', 'sarah', 'Just-in-time stage 2: confirm her address and talk through Bear’s care plan. Vet consent from Megan’s sit is reused.'],
    ['st-unlocked', 'sarah', 'Ring 2 is open. Three vouched neighbors will see Bear’s ask.']] },
  { title: 'Dana starts helping', steps: [
    ['kd-s-start', 'dana', 'Meanwhile, Dana — three blocks away, dog named Pepper — wants to help neighbors. No account needed to look.'],
    ['kd-s-demand', 'dana', 'She sees real demand on her block before signing up for anything.'],
    ['kd-s-circle', 'dana', 'Ring 1 for helpers: two people already invited her. No checks needed to help them.'],
    ['kd-s-today', 'dana', 'Her Today screen shows rings instead of a 5-step “Get bookable” wall.'],
    ['kd-s-ring2', 'dana', 'Ring 2: ID, address and two vouches. No SSN — that’s only for pros.'],
    ['kd-s-ref', 'dana', 'She asks Megan for her second vouch. Megan has seen her with Pepper for years.']] },
  { title: 'Dana answers Sarah', steps: [
    ['kd-s-board', 'dana', 'Sarah’s Sunday ask shows up on Dana’s Elmwood board.'],
    ['kd-s-offer', 'dana', 'She offers both visits at the neighbor rate. Sarah still approves who helps.']] },
  { title: 'Sunday is covered', steps: [
    ['owner', 'sarah', 'Back on Sarah’s phone: Dana said yes. Same agreement, vet consent and door-code handoff as everyone else.']] },
  { title: 'The visit', steps: [
    ['kd-s-visit', 'dana', 'Sunday 8 am. The door code opens by secure link, tasks come from Bear’s care plan, and Dana sends one quick update.']] },
  { title: 'Thanks, and a vouch', steps: [
    ['st-update', 'sarah', 'Sarah sees the update from Denver with a photo and a simple timeline.'],
    ['st-thanks', 'sarah', 'She pays what they agreed, vouches for Dana, and moves her into Bear’s circle (ring 2 → ring 1).']] },
  { title: 'Life in Elmwood', steps: [
    ['nb-board', 'sarah', 'Now Sarah is part of the neighborhood: asks, offers and trades on the Elmwood board.'],
    ['nb-walk', 'sarah', 'Pack walks let neighbors meet before they need each other — and vouch after.'],
    ['nb-ledger', 'sarah', 'Give & get keeps track of favors, not points.']] },
  { title: 'December: ring 3', steps: [
    ['kd-s-pro', 'dana', 'Dana decides to go pro. Her ID, vouches and sits carry over; she adds the background check and payouts.'],
    ['st-pro-gate', 'sarah', 'Sarah books Dana for two overnights. Her first pro booking asks for the last two things: payment and Bear’s full profile.'],
    ['st-pro-booked', 'sarah', 'All three rings, and Sarah never filled in a long form up front.']] }
];
const JSTEPS = []; JOURNEY.forEach((c, ci) => c.steps.forEach(([id, who, note]) => JSTEPS.push({ id, who, note, ci })));
const JIDS = JSTEPS.map(s => s.id);
const JFLOW = { id: 'journey', title: 'Full journey', steps: JIDS };

// state each step expects, so jumping around (or using the arrows) still tells a consistent story
const JENTER = {
  'j-status': () => { if (!L('sarah').askedAt) act('sarah', { askedAt: Date.now() }); if (!L('ana').stage) act('ana', { stage: 'declined', reason: 'Away that weekend', answeredAt: Date.now() }); },
  'st-gate': () => { if (!L('ana').stage) act('ana', { stage: 'declined', reason: 'Away that weekend', answeredAt: Date.now() }); },
  'kd-s-board': () => { KD.r2 = { id: true, addr: true }; KD.vouches = 2; STG.ring2 = true; },
  'kd-s-offer': () => { KD.r2 = { id: true, addr: true }; KD.vouches = 2; },
  'owner': () => { if (L('sarah').coveredBy !== 'Dana') act('sarah', { danaYesAt: Date.now(), coveredBy: 'Dana' }); KD.offered = true; },
  'kd-s-visit': () => { if (L('sarah').coveredBy !== 'Dana') act('sarah', { danaYesAt: Date.now(), coveredBy: 'Dana' }); },
  'st-update': () => { J.codeShown = true; J.updateSent = true; },
  'nb-board': () => { STG.ring2 = true; },
  'nb-ledger': () => { STG.ring2 = true; },
  'kd-s-pro': () => { KD.r2 = { id: true, addr: true }; KD.vouches = 2; },
  'st-pro-gate': () => { KD.proStarted = true; STG.ring2 = true; }
};

function journeyPanel(id) {
  const i = JIDS.indexOf(id), s = JSTEPS[i], p = PEOPLE[s.who], ch = JOURNEY[s.ci];
  const prev = JIDS[i - 1], next = JIDS[i + 1];
  return `<aside class="jpanel">
    <div class="lbl">Full journey · chapter ${s.ci + 1} of ${JOURNEY.length} · step ${i + 1} of ${JIDS.length}</div>
    <h2 class="jtitle">${ch.title}</h2>
    <div class="jwho">${av(p.av, 's36 ' + p.cls)}<div><b>On ${p.phone}</b><div class="tiny muted">${p.who}</div></div></div>
    <p class="jnote">${s.note}</p>
    <div class="jbtns">${prev ? `<button class="btn ghost sm" data-go="${prev}" data-tr="back">${icon('back', 16)}Back</button>` : ''}${next ? `<button class="btn sm" data-go="${next}">Next step${icon('next', 16)}</button>` : `<button class="btn sm" data-act="jRestart">Start again</button>`}</div>
    <ol class="jch">${JOURNEY.map((c, k) => {
      const first = c.steps[0][0]; const whos = [...new Set(c.steps.map(x => x[1]))];
      return `<li class="${k === s.ci ? 'on' : k < s.ci ? 'done' : ''}"><a data-go="${first}"><span class="n">${k < s.ci ? icon('check', 12) : k + 1}</span><span class="grow">${c.title}</span>${whos.map(w => `<span class="jdot ${PEOPLE[w].cls}">${PEOPLE[w].av}</span>`).join('')}</a></li>`;
    }).join('')}</ol>
    <a class="link" style="text-align:left;font-size:12px;margin-top:12px" href="#/admin">Side trip: the neighborhood lead’s review queue (desktop) →</a>
  </aside>`;
}
const journeyCrumb = (id) => { const s = JSTEPS[JIDS.indexOf(id)]; return `Ch ${s.ci + 1} · ${JOURNEY[s.ci].title} · <b>${PEOPLE[s.who].phone}</b>`; };

document.addEventListener('DOMContentLoaded', () => {
  Object.assign(ACTS, J_ACTS);
  // in the journey, Ana's "no" leads to Sarah's phone instead of back to Ana's lock screen
  const decline = ACTS.anaDecline;
  ACTS.anaDecline = (...a) => { if (!JMODE()) return decline(...a); decline(...a); setTimeout(() => go('j-status'), 1200); };
});
