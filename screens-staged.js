// ---------- Staged onboarding + neighborhood (exploration, Nov 18) ----------
// Mirrors the Figma section "Staged onboarding + neighborhood — exploration" (A1–A7, B1–B7).
// Idea: each onboarding stage matches a trust ring. You only give what the next ring needs,
// at the moment you widen the ask. Counts, limits and names are placeholders.

const STG = {
  pet: 'Bear', kind: 'Dog', zip: '80129', phone: '(555) 014-2290',
  line: 'Joint pill with dinner. Scared of thunder — he hides in the bathtub, let him.',
  addr: false, plan: false, ring2: false,
  posts: [], swapped: false, rsvp: false, vouch: 'trust', vouched: false
};
const stgPet = () => esc(STG.pet || 'your pet');

// bottom nav for this exploration: "Neighbors" replaces "Find Care" (proposal, needs sign-off)
const navbar2 = (on = 'Home') => `
  <nav class="navbar">${[['house', 'Home', 'st-home'], ['people', 'Neighbors', 'nb-board'], ['paw', STG.pet || 'Bear', ''], ['message', 'Messages', ''], ['user', 'Profile', 'nb-privacy']]
    .map(([i, n, g]) => `<a class="${n === on ? 'on' : ''}" ${g ? `data-go="${g}"` : `data-toast="${esc(n)} isn’t part of this prototype"`}><span class="ico">${icon(i, 18)}</span>${esc(n)}</a>`).join('')}</nav>`;

const stageBar = (pct, label) => `<div class="stg-prog"><div class="stg-track"><i style="width:${pct}%"></i></div><span>${label}</span></div>`;
const ringRow = (state, title, sub, right = '') => `<div class="rowx c">${state === 'done' ? chk('done') : `<span class="chk ${state === 'now' ? 'wait' : ''}" style="font-size:11px;font-weight:700">${state === 'now' ? '2' : '3'}</span>`}<div class="grow"><div class="strong">${title}</div><div class="sub">${sub}</div></div>${right}</div>`;

Object.assign(SCREENS, {

  // ===== Flow D · Staged onboarding (owner) =====
  'st-start': {
    name: 'Stage 0 · start without an account', render: () => `<div class="s">
    <div class="body">
      <div class="rowx c"><i class="logo" style="width:72px;height:32px;background-color:var(--peri)"></i><span class="grow"></span>${pill('Stage 0 · no account', 'white sm')}</div>
      <h1 class="h1" style="margin-top:20px;font-size:30px">Who are we looking out for?</h1>
      <p class="intro muted">Tell us two things and we’ll show you who’s nearby. No account yet.</p>
      <div class="lbl">Your pet’s first name</div>
      <input class="field" id="stgPet" value="${esc(STG.pet)}" aria-label="Pet's first name">
      <div class="lbl">They’re a…</div>
      <div class="pills" data-single id="stgKind">${['Dog', 'Cat', 'Something else'].map(k => `<span class="pill lg chip ${k === STG.kind ? 'on' : ''}">${k}</span>`).join('')}</div>
      <div class="lbl">Your neighborhood or ZIP</div>
      <div class="stg-field"><input class="field" id="stgZip" value="${esc(STG.zip)}" aria-label="ZIP code" inputmode="numeric"><span class="stg-hit">${icon('check', 14)}Elmwood</span></div>
      <div class="sub">Only used to show what’s nearby. Nothing is saved until you join.</div>
      <div class="card rowx" style="margin-top:20px"><span class="ring" style="background:var(--pbutter)">${icon('location', 18)}</span><div><div class="strong">Why ask this first?</div><div class="sub">So the first thing you see is your neighbors, not a form. Name, email and password come later, or never.</div></div></div>
      <div class="foot"><button class="btn" data-act="stgStart">See who’s nearby</button><a class="link" data-toast="Sign-in isn’t part of this prototype">Already on Wala? Sign in</a></div>
    </div></div>`
  },

  'st-preview': {
    name: 'Stage 0 · neighborhood preview', render: () => `<div class="s">
    ${hdr('Elmwood on Wala', `Near ${esc(STG.zip)} · what ${stgPet()} would have nearby`, 'st-start')}
    <div class="body">
      <div class="card pbutter"><div class="lbl">${stgPet()} has neighbors here</div>
        <div class="stg-stats"><div><b>9</b><span>neighbor helpers</span></div><div><b>41</b><span>pets on Wala</span></div><div><b>2</b><span>pack walks / mo</span></div></div></div>
      <div class="lbl">Helpers a few blocks away</div>
      <div class="card divide">
        ${[['D', 'Dana R.', '3 blocks · vouched by 4 neighbors', 'blue'], ['P', 'Priya H.', '5 blocks · cats & small pets', 'pterra'], ['O', 'Omar K.', '6 blocks · walks before 8 am', 'pbutter']]
          .map(([i, n, s, c]) => `<div class="rowx c">${av(i, 's36 ' + c)}<div class="grow"><div class="strong">${n}</div><div class="sub">${s}</div></div>${pill('Verified', 'pgrass sm', 'check')}</div>`).join('')}
        <div class="rowx c small muted">${icon('lock', 14)}Full names, photos and the board open when you join.</div>
      </div>
      <div class="card rowx c tap" data-toast="Pack walks are covered in the Elmwood flow">
        <span class="ring" style="background:var(--peri-pale)">${icon('paw', 18)}</span><div class="grow"><div class="strong">Sat pack walk · Elmwood Park</div><div class="sub">9:00 am · 7 dogs going · hosted by a neighbor</div></div>${pill('Open to all', 'sm')}</div>
      <div class="foot"><button class="btn" data-go="st-phone">Save ${stgPet()}’s spot</button><div class="small muted" style="text-align:center">30 seconds · just your phone number</div></div>
    </div></div>`
  },

  'st-phone': {
    name: 'Stage 1 · phone is your login', render: () => `<div class="s">
    ${hdr(`Save ${stgPet()}’s spot`, 'Stage 1 of 3 · your circle', 'st-preview')}
    <div class="body">
      ${stageBar(33, '~1 min')}
      <h1 class="h1" style="margin-top:16px">What’s your number?</h1>
      <p class="intro muted">No password. It’s how the people you invite say yes too: a text and a code.</p>
      <div class="lbl">Mobile number</div>
      <input class="field" id="stgPhone" value="${esc(STG.phone)}" aria-label="Mobile number" inputmode="tel">
      <div class="lbl">Code we texted</div>
      <div class="otp" id="otp">${'<span></span>'.repeat(6)}</div>
      <div class="card"><div class="lbl">What this unlocks now</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">
          ${[[`${stgPet()}’s page`, 'Photo + one line, shareable by link'], ['Invite people you trust', 'Friends, family, next-door neighbors'], ['Read the Elmwood board', 'Posting comes at ring 2']].map(([t, s]) => `<div class="rowx c">${chk('done')}<div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
        </div></div>
      <div class="foot"><button class="btn" data-go="st-pet">Continue</button><div class="small muted" style="text-align:center">Your name can come from your first text reply. Email is optional.</div></div>
    </div></div>`,
    after: (el) => {
      const cells = el.querySelectorAll('#otp span'); if (!cells.length) return; cells[0].classList.add('cur');
      '482917'.split('').forEach((d, i) => setTimeout(() => { if (!el.isConnected) return; cells[i].textContent = d; cells[i].classList.remove('cur'); cells[i + 1]?.classList.add('cur'); }, 500 + i * 200));
    }
  },

  'st-pet': {
    name: `Stage 1 · pet in one line`, render: () => `<div class="s">
    ${hdr(`${stgPet()}’s page`, 'Stage 1 of 3 · your circle', 'st-phone')}
    <div class="body">
      ${stageBar(66, 'almost')}
      <div class="rowx c" style="margin-top:16px"><img src="assets/bear.jpg" alt="" class="stg-photo"><div><div class="h2">${stgPet()}</div><div class="pills" style="margin-top:6px">${pill('9 yrs', 'sm')}${pill(STG.kind === 'Dog' ? 'German Shepherd' : STG.kind, 'sm')}${pill('Change photo', 'white sm')}</div></div></div>
      <h2 class="h2" style="margin-top:20px">One thing a helper should know?</h2>
      <div class="card stg-line"><textarea id="stgLine" rows="3" aria-label="One thing a helper should know">${esc(STG.line)}</textarea>
        <div class="rowx c"><span class="tiny muted grow" id="stgCount">${STG.line.length} / 200</span><span class="pill peri sm tap" data-act="stgSay">${icon('mic', 13)}Say it instead</span></div></div>
      <div class="note rowx">${icon('info', 18)}<div><b>That’s enough for your circle.</b> Megan and Ana know ${stgPet()} already. The full care plan only comes up if you ask neighbors or pros.</div></div>
      <div class="foot"><button class="btn" data-act="stgPetDone">Done — go to Home</button><a class="link" data-go="st-home">Skip, look around first</a></div>
    </div></div>`
  },

  'st-home': {
    name: 'Home · setup grows by ring', render: () => `<div class="s">
    <div class="body">
      <div class="rowx c"><div class="grow"><div class="small muted">Tuesday, Nov 18</div><div class="h1">Hi Sarah</div></div>${av('S', 'pbutter')}</div>
      <button class="btn" style="margin-top:16px" data-go="st-gate">${icon('people', 18)}Ask someone to help with ${stgPet()}</button>
      <div class="card">
        <div class="rowx c"><div class="ttl lg grow">${stgPet()}’s setup</div>${pill(STG.ring3 ? '3 of 3 rings' : STG.ring2 ? '2 of 3 rings' : '1 of 3 rings', 'pgrass sm')}</div>
        <div class="sub">Each ring opens when you need it. Nothing here is required today.</div>
        <div class="divide" style="margin-top:12px">
          ${ringRow('done', 'Ring 1 · Your circle', 'Ready · Megan and Ana can be asked')}
          ${STG.ring2 ? ringRow('done', 'Ring 2 · Elmwood neighbors', 'Open · board, vouches, neighbor asks') : ringRow('now', 'Ring 2 · Elmwood neighbors', `${2 - STG.addr - STG.plan} thing${2 - STG.addr - STG.plan === 1 ? '' : 's'} · about 3 min`, `<button class="btn sm ghost" data-go="st-gate">Start</button>`)}
          ${STG.ring3 ? ringRow('done', 'Ring 3 · Pros', 'Payment + care profile added at your first booking') : ringRow('later', 'Ring 3 · Pros', 'Payment + meds · we’ll ask when you book', '')}
        </div>
      </div>
      <div class="lbl">Elmwood this week</div>
      <div class="card divide">
        <div class="rowx c tap" data-go="nb-board">${av('P', 's36 pterra')}<div class="grow"><div class="strong">Priya offered help</div><div class="sub">Home all Thanksgiving week · cats on Linden St</div></div>${icon('next', 16)}</div>
        <div class="rowx c tap" data-go="nb-walk"><span class="ring" style="width:36px;height:36px;background:var(--peri-pale)">${icon('paw', 16)}</span><div class="grow"><div class="strong">Sat pack walk</div><div class="sub">Elmwood Park · 9 am · 7 dogs</div></div>${icon('next', 16)}</div>
      </div>
      <div class="card stg-dash rowx c tap" data-go="nb-cold"><span class="ring" style="width:36px;height:36px;background:var(--pbutter)">${icon('people', 16)}</span><div class="grow"><div class="strong">Invite a neighbor</div><div class="sub">Elmwood gets more useful with every helper on your block</div></div></div>
    </div>${navbar2('Home')}</div>`
  },

  'st-gate': {
    name: 'Just in time · widening the ask', render: () => `<div class="s stg-dim">
    ${hdr('Asking ' + stgPet() + '’s people', 'Drop-ins · Sat Nov 28 – Sun Nov 29', 'st-home')}
    <div class="body">
      <div class="card pbutter"><div class="strong">Megan can do Saturday.</div><div class="sub" style="color:var(--ink)">No one in your circle can do Sunday yet.</div></div>
      <div class="stg-sheet">
        <div class="rowx c"><div class="h2 grow">Ask Elmwood neighbors?</div><button class="stg-x" data-go="st-home" data-tr="back" aria-label="Close">${icon('x', 16)}</button></div>
        <p class="muted" style="margin:6px 0 0;font-size:14px">${STG.ring2 ? 'Ring 2 is open. Dana, Priya and Omar will be asked at 6 pm.' : `Before 3 vouched neighbors see ${stgPet()}’s ask, ${2 - STG.addr - STG.plan === 0 ? 'you’re all set:' : '2 quick things:'}`}</p>
        <div class="stg-step ${STG.addr ? 'done' : ''}">${chk(STG.addr ? 'done' : '')}<div class="grow"><div class="strong">Confirm your address</div><div class="sub">Neighbors see “300s block of Elm St”, never your number</div></div>${STG.addr ? '' : `<button class="btn sm ghost" data-act="stgAddr">Confirm</button>`}</div>
        <div class="stg-step ${STG.plan ? 'done' : ''}">${chk(STG.plan ? 'done' : '')}<div class="grow"><div class="strong">${stgPet()}’s care plan</div><div class="sub">${STG.plan ? 'Drafted from your voice note · you checked it' : 'Talk for 2 min; Wala writes it, you check it'}</div></div>${STG.plan ? '' : `<button class="btn sm ghost" data-act="stgPlan">${icon('mic', 15)}Talk it</button>`}</div>
        <div class="stg-step done">${chk('done')}<div class="grow"><div class="strong">Emergency vet consent</div><div class="sub">Already signed for Megan’s sit · reused</div></div></div>
        <button class="btn" style="margin-top:16px" data-act="stgFinish">${STG.ring2 ? 'Done' : 'Finish & ask neighbors'}</button>
        <a class="link" style="margin-top:12px" data-go="st-home" data-tr="back">Not now — keep asking my circle</a>
      </div>
    </div></div>`
  },

  'st-unlocked': {
    name: 'Ring 2 unlocked', render: () => `<div class="s">
    ${hdr('Elmwood can see ' + stgPet() + '’s ask', 'Ring 2 open', 'st-gate')}
    <div class="body">
      <div class="card pblue" style="padding:20px"><div style="font-size:36px">🎉</div><div class="h1" style="margin-top:6px">Neighbors are in.</div>
        <div class="sub" style="color:var(--ink);font-size:14px">Dana, Priya and Omar will be asked at 6 pm if Sunday is still open. You approve whoever says yes.</div></div>
      <div class="lbl">What changed</div>
      <div class="card divide">
        ${[['3 vouched neighbors asked', 'Only people within 6 blocks with 2+ vouches'], ['You can post on the Elmwood board', 'Asks, offers and trades'], ['You can vouch for people you know', 'Megan’s vouch for you counts too'], [`${stgPet()}’s care plan saved`, 'Shared only with confirmed helpers']].map(([t, s]) => `<div class="rowx c">${chk('done')}<div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="card stg-dash rowx c"><span class="chk" style="font-size:11px;font-weight:700">3</span><div><div class="strong">Ring 3 · Pros</div><div class="sub">When you first book a pro we’ll ask for payment and ${stgPet()}’s meds. Not before.</div></div></div>
      <div class="foot"><button class="btn" data-go="nb-board">See the Elmwood board</button><a class="link" data-go="st-home" data-tr="back">Back to Home</a></div>
    </div></div>`
  },

  // ===== Flow E · Neighborhood & community =====
  'nb-invite': {
    name: 'Web: invited by a neighbor', render: () => `<div class="s">
    ${urlbar('wala.app/n/elmwood?from=megan')}
    <div class="body">
      <div class="rowx c">${av('M', 's56 pbutter')}<div><div class="small muted">Megan invited you</div><div class="h1">Join Elmwood on Wala</div></div></div>
      <div class="card pbutter"><div style="font-size:16px;line-height:1.4">“Bear and Pepper should finally meet. We trade drop-ins here — no more group-chat chaos.”</div><div class="sub" style="margin-top:8px">— Megan, next door</div></div>
      <div class="lbl">What neighbors do here</div>
      <div class="card divide inset">
        <div class="rowx c"><span class="ring" style="background:var(--pblue)">${icon('calendar', 18)}</span><div><div class="strong">Cover each other’s trips</div><div class="sub">Ask, offer or trade drop-ins</div></div></div>
        <div class="rowx c"><span class="ring" style="background:var(--peri-pale)">${icon('paw', 18)}</span><div><div class="strong">Walk together</div><div class="sub">Pack walks most Saturdays</div></div></div>
        <div class="rowx c"><span class="ring" style="background:var(--pgrass)">${icon('shield', 18)}</span><div><div class="strong">Know who’s vouched for</div><div class="sub">Helpers are ID-checked and vouched for by people you know</div></div></div>
      </div>
      <div class="card pgrass rowx c">${chk('done')}<div><div class="strong">You start with 1 of 2 vouches</div><div class="sub" style="color:var(--ink)">Megan vouched for you when she sent this</div></div></div>
      <div class="foot"><button class="btn" data-act="nbJoin">Join with Bear</button><div class="small muted" style="text-align:center">Stage 0 → 1: pet name + phone. No download until you want it.</div></div>
    </div></div>`
  },

  'nb-board': {
    name: 'Neighbors tab · Elmwood board', render: () => {
      const post = (i, c, n, meta, tag, tc, body, acts = '') => `<div class="card"><div class="rowx c">${av(i, 's32 ' + c)}<div class="grow"><div class="strong">${n}</div><div class="tiny muted">${meta}</div></div>${pill(tag, 'sm ' + tc)}</div><div style="margin-top:10px;font-size:14px;line-height:1.4">${body}</div>${acts ? `<div class="rowx c" style="margin-top:12px;gap:8px">${acts}</div>` : ''}</div>`;
      return `<div class="s">
      <div class="body">
        <div class="rowx c"><div class="grow"><div class="h1">Elmwood</div><div class="small muted">41 pets · 9 helpers · you’re on Elm St</div></div><button class="btn sm" data-act="nbPost">+ Post</button></div>
        <div class="stg-tabs"><a class="on">Board</a><a data-go="nb-cold">Helpers</a><a data-go="nb-walk">Walks</a><a data-go="nb-ledger">Give & get</a></div>
        <div id="nbCompose"></div>
        ${STG.posts.map(p => post('S', 'pbutter', 'Sarah · you', 'Elm St · just now', 'Offer', 'pgrass', esc(p))).join('')}
        ${post('S', 'pbutter', 'Sarah · you', `Elm St · 2h · ${STG.ring2 ? '3 neighbors asked' : 'circle only'}`, 'Ask', 'pbutter', 'Sunday drop-ins for Bear, 8 am + 6 pm. Senior shepherd, one dinner pill.')}
        ${post('P', 'pterra', 'Priya H.', 'Linden St · 5h', 'Offer', 'pgrass', 'Home all Thanksgiving week. Happy to cover cats on Linden or Elm.', `<button class="btn sm ghost" data-toast="Asked Priya — she’ll see it in Messages">Ask Priya</button>`)}
        ${post('O', 'pbutter', 'Omar K.', 'Birch Ave · yesterday', 'Trade', 'pblue', 'Swap weekends? I’ll take your Dec 12 if you take my Dec 19 (one lab, easy).', STG.swapped ? pill('Swap offered · Omar will confirm', 'pgrass', 'check') : `<button class="btn sm ghost" data-act="nbSwap">I can swap</button><a class="link" style="font-size:13px" data-toast="Messages aren’t part of this prototype">Message</a>`)}
      </div>${navbar2('Neighbors')}</div>`;
    }
  },

  'nb-ledger': {
    name: 'Give & get · favors, not points', render: () => `<div class="s">
    ${hdr('Give & get', 'Your Elmwood history', 'nb-board')}
    <div class="body">
      <div class="card pblue"><div class="stg-stats two"><div><b>${3 + STG.posts.length}</b><span>times you helped</span></div><div><b>2</b><span>times you were helped</span></div></div>
        <div class="sub" style="color:var(--ink);margin-top:8px">Nobody’s keeping score, but it’s easy to see who you owe a coffee.</div></div>
      <div class="lbl">This fall</div>
      <div class="card divide">
        ${[['up', 'You covered Priya’s cats', 'Oct 12 · favor'], ['down', 'Megan did Saturday drop-ins', 'Nov 28 · favor · thanked'], ['down', 'Dana walked Bear', 'Nov 1 · paid $20'], ['up', 'You walked Pepper', 'Sep 30 · traded for Nov 1']]
          .map(([d, t, s]) => `<div class="rowx c"><span class="stg-dir ${d}">${d === 'up' ? '↑' : '↓'}</span><div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="note rowx">${icon('info', 18)}<div><b>Three ways to settle up:</b> pay what you agreed, call it a favor, or trade a sit. Same as “Thank Megan”. No points to buy, no leaderboards.</div></div>
      <div class="foot"><button class="btn" data-act="nbOffer">Offer to help this week</button></div>
    </div>${navbar2('Neighbors')}</div>`
  },

  'nb-walk': {
    name: 'Pack walk · meet before you need them', render: () => `<div class="s">
    ${hdr('Saturday pack walk', 'Elmwood Park · Sat Nov 22 · 9:00 am', 'nb-board')}
    <div class="body">
      <div class="card pgrass" style="padding:20px"><div style="font-size:32px">🌳</div><div class="h2" style="margin-top:6px">Meet the people you might ask later.</div>
        <div class="sub" style="color:var(--ink);font-size:14px">One loop, about 40 min. Hosted by Megan. Walking together once means you can vouch for each other.</div></div>
      <div class="lbl">${STG.rsvp ? 8 : 7} dogs going</div>
      <div class="stg-dogs">${(STG.rsvp ? ['B'] : []).concat(['P', 'L', 'M', 'R', 'K', 'T', '+1']).map((d, i) => av(d, 's36 ' + ['pbutter', 'blue', 'pterra', 'white', 'pbutter', 'blue', 'pterra', 'white'][i % 8])).join('')}</div>
      <div class="card rowx"><span class="ring" style="width:32px;height:32px;background:var(--pterra)">${icon('alert', 15)}</span><div><div class="strong">Bear’s note goes to the host only</div><div class="sub">“Nervous around big dogs.” Megan will pair him with the calm group.</div></div></div>
      <div class="card rowx"><span class="ring" style="width:32px;height:32px;background:var(--peri-pale)">${icon('people', 15)}</span><div><div class="strong">Helpers walking</div><div class="sub">Dana R. and Omar K. are coming. Say hi, and you can ask them directly after.</div></div></div>
      <div class="foot">${STG.rsvp
        ? `<div class="card pgrass rowx c">${chk('done')}<div class="strong">Bear’s going · see you at 9</div></div><button class="btn" data-go="nb-vouch">After the walk: do you know Dana? →</button>`
        : `<button class="btn" data-act="nbRsvp">Bear’s going</button><a class="link" data-go="nb-board" data-tr="back">Maybe next time</a>`}</div>
    </div>${navbar2('Neighbors')}</div>`
  },

  'nb-vouch': {
    name: 'Vouch for a neighbor', render: () => `<div class="s">
    ${hdr('Do you know Dana?', 'You walked together Saturday', 'nb-walk')}
    <div class="body">
      <div class="rowx c">${av('DR', 's64 blue')}<div><div class="h2">Dana Ruiz</div><div class="small muted">Neighbor helper · 3 blocks · has Pepper</div>
        <div class="pills" style="margin-top:6px">${pill('ID verified', 'pgrass sm', 'check')}${pill(`${STG.vouched ? 5 : 4} vouches`, 'white sm')}</div></div></div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px;margin-top:20px" id="vouchOpts">
        ${[['trust', 'I know Dana and trust them with pets', 'I’d let them into my home'], ['met', 'We’ve met', 'Shows “met at a pack walk”, not a vouch'], ['no', 'Not really', 'Nothing is shared']]
          .map(([k, t, s]) => `<div class="opt ${STG.vouch === k ? 'selected' : ''}" data-k="${k}"><span class="radio"></span><div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`).join('')}
      </div>
      <div class="card pbutter"><div class="lbl">What a vouch means</div><div style="margin-top:6px;font-size:13px;line-height:1.45">You’ve met in person and would let them in your home. Elmwood neighbors see “Vouched by Sarah L.” on Dana’s profile. You can take it back anytime.</div></div>
      <div class="foot"><button class="btn" data-act="nbVouch">${STG.vouched ? 'Update' : 'Vouch for Dana'}</button><div class="small muted" style="text-align:center">Up to 5 vouches a month, so they keep meaning something.</div></div>
    </div></div>`
  },

  'nb-privacy': {
    name: 'What Elmwood sees', render: () => {
      const r = (ic, bg, t, s) => `<div class="rowx c"><span class="ring" style="width:32px;height:32px;background:var(--${bg})">${icon(ic, 15)}</span><div><div class="strong">${t}</div><div class="sub">${s}</div></div></div>`;
      return `<div class="s">
      ${hdr('What Elmwood sees', 'Neighbors · privacy', 'nb-vouch')}
      <div class="body">
        <div class="lbl">Neighbors can see</div>
        <div class="card divide">${r('user', 'pgrass', 'Sarah L. and your photo', 'First name + last initial')}${r('paw', 'pgrass', 'Bear’s name, photo and tags', '“Senior”, “Gentle”, “Joint pill”')}${r('location', 'pgrass', 'Your block', '300s block of Elm St')}${r('shield', 'pgrass', 'Who vouched for you', 'Megan · next door')}</div>
        <div class="lbl">Only confirmed helpers see</div>
        <div class="card divide">${r('house', 'fill', 'Your exact address', 'Sent after you approve a sit')}${r('notes', 'fill', 'Bear’s full care plan & meds', 'From the care profile')}${r('key', 'fill', 'Door and alarm codes', 'Secure link on the day, never in a text')}</div>
        <div class="card divide">
          <div class="rowx c"><div class="grow"><div class="strong">Show me as available to help</div><div class="sub">Puts you in the Helpers list</div></div><span class="toggle" role="switch"></span></div>
          <div class="rowx c"><div class="grow"><div class="strong">Show Bear on the board</div><div class="sub">Pack walks and playdates</div></div><span class="toggle on" role="switch"></span></div>
        </div>
        <div class="foot"><button class="btn" data-act="nbSavePrivacy">Save</button></div>
      </div></div>`;
    }
  },

  'nb-cold': {
    name: 'Cold start · few helpers nearby', render: () => `<div class="s">
    ${hdr('Elmwood on Wala', 'If a neighborhood is just starting', 'nb-board')}
    <div class="body">
      <div class="note" style="font-size:12px">Variant: what Elmwood would look like with only 2 helpers.</div>
      <div class="card pbutter" style="padding:20px"><div class="h2">You’d be one of Elmwood’s first 👋</div>
        <div class="sub" style="color:var(--ink);font-size:14px;margin-top:6px">Only 2 helpers nearby so far. Asking still works through your circle, and pros are 1.2 mi away.</div>
        <div class="stg-track" style="margin-top:14px"><i style="width:40%;background:var(--grass)"></i></div><div class="tiny muted" style="margin-top:6px">2 of 5 helpers until the Elmwood board opens</div></div>
      <div class="lbl">Get it going</div>
      <div class="card divide">
        <div class="rowx c"><span class="ring" style="background:var(--peri-pale)">${icon('send', 17)}</span><div class="grow"><div class="strong">Invite 3 neighbors</div><div class="sub">A text with Bear’s photo. They start with your vouch.</div></div><button class="btn sm ghost" data-go="nb-invite">Preview</button></div>
        <div class="rowx c"><span class="ring" style="background:var(--pgrass)">${icon('paw', 17)}</span><div class="grow"><div class="strong">Start a pack walk</div><div class="sub">Posted to anyone within 6 blocks</div></div><button class="btn sm ghost" data-toast="Walk planning isn’t part of this prototype">Plan</button></div>
        <div class="rowx c"><span class="ring" style="background:var(--pblue)">${icon('notes', 17)}</span><div class="grow"><div class="strong">Print a flyer</div><div class="sub">QR code for your building or the dog park</div></div><button class="btn sm ghost" data-toast="Flyer download isn’t part of this prototype">Get</button></div>
      </div>
      <div class="card stg-dash rowx c">${icon('authorized', 18)}<div><div class="strong">Ring 3 still works</div><div class="sub">Insured pros nearby can be booked today if you need someone now.</div></div></div>
    </div>${navbar2('Neighbors')}</div>`
  }
});

const STG_ACTS = {
  stgStart() {
    const n = document.getElementById('stgPet')?.value.trim(); if (!n) return toast('Add your pet’s first name');
    STG.pet = n; STG.zip = document.getElementById('stgZip')?.value.trim() || STG.zip;
    STG.kind = document.querySelector('#stgKind .chip.on')?.textContent.trim() || STG.kind;
    go('st-preview');
  },
  stgSay() { toast('Listening… (simulated) — we’d turn what you say into this line'); },
  stgPetDone() { STG.line = document.getElementById('stgLine')?.value || STG.line; toast(`${STG.pet}’s page is ready · ring 1 open`); setTimeout(() => go('st-home'), 700); },
  stgAddr() { STG.addr = true; toast('Address confirmed · neighbors see your block only'); rerender(); },
  stgPlan() { STG.plan = true; toast('Care plan drafted from your voice note (simulated)'); rerender(); },
  stgFinish() {
    if (STG.ring2) return go('st-home', 'back');
    if (!STG.addr || !STG.plan) return toast(`${!STG.addr ? 'Confirm your address' : 'Add the care plan'} first, or tap “Not now”`);
    STG.ring2 = true; actOnce('sarah', 'neighborsAskedAt'); go('st-unlocked');
  },
  nbJoin() { toast('Joined Elmwood with Bear · 1 of 2 vouches'); setTimeout(() => go('nb-board'), 800); },
  nbPost() {
    if (!STG.ring2) { toast('Posting opens at ring 2 — two quick things first'); return setTimeout(() => go('st-gate'), 900); }
    const box = document.getElementById('nbCompose'); if (!box) return;
    if (box.innerHTML) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="card" style="box-shadow:inset 0 0 0 2px var(--peri)"><div class="lbl">New offer</div><textarea id="nbText" rows="2" class="stg-ta" aria-label="Post">Around all weekend — happy to do drop-ins on Elm St.</textarea><div class="rowx c" style="justify-content:flex-end;gap:8px"><button class="btn sm ghost" data-act="nbPost">Cancel</button><button class="btn sm" data-act="nbPublish">Post</button></div></div>`;
  },
  nbPublish() { const t = document.getElementById('nbText')?.value.trim(); if (!t) return toast('Write something first'); STG.posts.unshift(t); toast('Posted to Elmwood'); rerender(); },
  nbOffer() {
    if (!STG.ring2) { toast('Offering help opens at ring 2 — two quick things first'); return setTimeout(() => go('st-gate'), 900); }
    STG.posts.unshift('Free this week for drop-ins or walks on Elm St — just ask.'); toast('Offer posted to the Elmwood board'); setTimeout(() => go('nb-board'), 700);
  },
  nbSwap() { STG.swapped = true; toast('Swap offered to Omar'); rerender(); },
  nbRsvp() { STG.rsvp = true; toast('Bear’s going · Megan has his note'); rerender(); },
  nbVouch() {
    const k = document.querySelector('#vouchOpts .opt.selected')?.dataset.k || 'trust'; STG.vouch = k;
    STG.vouched = k === 'trust';
    toast(k === 'trust' ? 'Vouch saved · Dana now has 5' : k === 'met' ? 'Saved as “met at a pack walk”' : 'Nothing shared');
    setTimeout(() => go('nb-privacy'), 800);
  },
  nbSavePrivacy() { toast('Saved · Elmwood sees only what’s listed'); }
};
// ACTS lives in app.js, which loads after this file
document.addEventListener('DOMContentLoaded', () => Object.assign(ACTS, STG_ACTS));

document.addEventListener('input', (e) => {
  if (e.target.id === 'stgLine') { STG.line = e.target.value.slice(0, 200); const c = document.getElementById('stgCount'); if (c) c.textContent = `${STG.line.length} / 200`; }
});

FLOWS.push(
  { id: 'staged', title: 'Staged onboarding', tag: 'Owner · new · exploration', blurb: 'Start with no account and see your neighborhood. Each stage asks only what the next trust ring needs, right when you widen the ask.', steps: ['st-start', 'st-preview', 'st-phone', 'st-pet', 'st-home', 'st-gate', 'st-unlocked'] },
  { id: 'elmwood', title: 'Neighborhood & community', tag: 'Elmwood · new · exploration', blurb: 'Join from a neighbor’s link, then use the board, give & get, pack walks, vouching and privacy. Includes a cold-start variant.', steps: ['nb-invite', 'nb-board', 'nb-ledger', 'nb-walk', 'nb-vouch', 'nb-privacy', 'nb-cold'] }
);
