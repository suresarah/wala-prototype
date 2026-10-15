// ---------- Gap-fill screens: trust paperwork, door code, time changes, opting out ----------

// Shared sit agreement + emergency vet consent (Ana signs for Bear's sit; Lena signs as a neighbor helper)
function agreementBody(who, forHelper) {
  return `
    <div class="card pbutter"><div class="lbl">${forHelper ? 'Neighbor helper agreement' : 'Sit agreement · Sun Nov 29'}</div>
      <div class="ttl lg" style="margin-top:6px">${forHelper ? 'One agreement for every sit you take in Elmwood' : 'Two drop-ins for Bear · 8 am + 6 pm · $40'}</div>
      <div class="sub" style="color:var(--ink);margin-top:4px">Plain-language summary. The full text is one tap away.</div></div>
    <div class="lbl">If Bear needs a vet</div>
    <div class="card divide inset">
      <div class="rowx">${icon('medical')}<div class="grow"><div class="strong">${forHelper ? 'You can approve emergency care up to each owner’s limit' : `${who} can approve emergency care up to $500`}</div><div class="sub">Above that, Wala calls ${forHelper ? 'the owner, then their backup' : 'Sarah, then Megan'} before anything else is done.</div></div></div>
      <div class="rowx">${icon('money')}<div class="grow"><div class="strong">The owner’s card pays the vet</div><div class="sub">${forHelper ? 'You' : who} never front costs. The clinic bills the card on file.</div></div></div>
      <div class="rowx">${icon('location')}<div class="grow"><div class="strong">Elmwood Animal Clinic · after-hours: Riverside Pet ER</div><div class="sub">Both have the signed consent on file before the sit starts.</div></div></div>
    </div>
    ${forHelper ? '' : `<div class="lbl">Bear’s health card</div>
    <div class="card divide">
      <div class="rowx c"><span class="pill pbutter sm">Meds</span><span style="font-size:13px">Rimadyl, 1 tablet with dinner</span></div>
      <div class="rowx c"><span class="pill prust sm">Allergy</span><span style="font-size:13px">Chicken — check treat labels</span></div>
      <div class="rowx c"><span class="pill pblue sm">Microchip</span><span style="font-size:13px">985…4471 · registered to Sarah</span></div>
    </div>`}
    <div class="lbl">House rules</div>
    <div style="display:flex;flex-direction:column;gap:8px" data-checks>
      ${[forHelper ? 'I’ll only enter a home during a confirmed sit' : 'I’ll only use the door code during the sit', 'I’ll send a quick update after each visit', 'I’ll call Wala first if anything feels off'].map(t => `<div class="opt" data-act="toggleCheck"><span class="box"></span><div class="grow" style="font-size:14px">${t}</div></div>`).join('')}
    </div>
    <div class="lbl">Sign with your full name</div>
    <input class="field" id="signName" placeholder="Your full name" autocomplete="name">
    <div class="small muted" style="margin-top:8px">Pet-in-care cover applies once this is signed (placeholder until the insurance quote).</div>`;
}

Object.assign(SCREENS, {

  // ===== Ana: sign the agreement + vet consent =====
  'agreement': {
    name: 'Web: sign the agreement', render: () => L('ana').signedAt
      ? `<div class="s">${urlbar('wala.app/a/7Q2K')}<div class="body">
          <div class="card pgrass" style="border-radius:28px;padding:20px">${chk('done')}<div class="h1" style="font-size:24px;margin-top:12px">Signed. You’re all set for Sunday.</div><div style="margin-top:6px">Sarah and the vet clinic both have a copy. Your door code arrives Saturday at 9 am.</div></div>
          <div class="foot"><button class="btn" data-go="confirmed" data-tr="back">Back to your sit</button></div></div></div>`
      : `<div class="s">${urlbar('wala.app/a/7Q2K')}<div class="body">
          <h1 class="h1">Before Sunday</h1>
          <p class="muted" style="margin:6px 0 0">The same agreement everyone signs — friends, neighbors and pros. About 2 minutes.</p>
          ${agreementBody('Ana', false)}
          <div class="foot"><button class="btn" data-act="signAgreement" data-k="ana">Sign agreement</button></div></div></div>`
  },

  // ===== Ana: Saturday's secure door-code link =====
  'doorcode': {
    name: 'Web: door code', render: () => {
      const a = L('ana');
      if (!a.signedAt) return `<div class="s">${urlbar('wala.app/k/••••')}<div class="body">
        <span class="ring" style="width:56px;height:56px;background:var(--pbutter)">${icon('lock', 24)}</span>
        <h1 class="h1" style="margin-top:20px">Sign the agreement first</h1>
        <p class="muted" style="margin:6px 0 0">The door code only unlocks for a sitter who has signed the sit agreement and vet consent.</p>
        <div class="foot"><button class="btn" data-go="agreement">Sign agreement</button><button class="btn ghost" data-go="confirmed" data-tr="back">Back</button></div></div></div>`;
      if (!STATE.codeOpen) return `<div class="s">${urlbar('wala.app/k/••••')}<div class="body">
        <div class="pills">${pill('Saturday · 9:00 am', 'pbutter', 'clock')}</div>
        <span class="ring" style="width:56px;height:56px;background:var(--pblue);margin-top:16px">${icon('key', 24)}</span>
        <h1 class="h1" style="margin-top:20px">Bear’s door code is ready</h1>
        <p class="muted" style="margin:6px 0 0">Confirm it’s you to see it. Sarah sees each time it’s opened.</p>
        <div class="card" style="margin-top:20px"><div class="rowx">${icon('clock')}<div><div class="strong">Works Sat 9 am → Mon 9 am</div><div class="sub">After that this link stops working by itself.</div></div></div></div>
        <div class="foot"><button class="btn" data-act="codeVerify">Text me a code</button></div></div></div>`;
      return `<div class="s">${urlbar('wala.app/k/••••')}<div class="body">
        <div class="lbl">Sarah’s place · 412 Linden St</div>
        <div class="card peri" style="border-radius:28px;padding:24px;text-align:center">
          <div class="small" style="color:var(--peri-pale)">Front door keypad</div>
          <div style="font-size:52px;font-weight:600;letter-spacing:.3em;margin:8px 0 4px;font-variant-numeric:tabular-nums;color:var(--butter)">4829</div>
          <div class="small" style="color:var(--peri-pale)">then press ✓</div></div>
        <div class="card divide inset">
          <div class="rowx">${icon('clock')}<div class="grow"><div class="strong">Expires Mon 9:00 am</div><div class="sub">You’ll get a new code for any future sit.</div></div></div>
          <div class="rowx">${icon('notes')}<div class="grow"><div class="strong">Opened ${new Date(a.codeViewedAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · logged</div><div class="sub">Sarah can see when the code was viewed.</div></div></div>
          <div class="rowx">${icon('paw')}<div class="grow"><div class="strong">Inside</div><div class="sub">Leash on the hook by the door. Food in the pantry, pill bottle on the counter.</div></div></div>
        </div>
        <div class="foot"><button class="btn" data-go="visit">Start the 8 am visit</button><a class="link rust" data-toast="Wala would call you right back and alert Sarah">Code not working? Call Wala</a></div></div></div>`;
    }
  },

  // ===== Ana: suggest a different time =====
  'suggest': {
    name: 'Web: suggest a time', render: () => {
      const a = L('ana'), s = L('sarah');
      if (a.stage === 'suggested') {
        const kept = s.suggestReply === 'declined' && s.suggestReplyAt > a.suggestedAt;
        return `<div class="s">${urlbar()}<div class="body">
          ${kept ? `<div class="card pbutter" style="border-radius:28px;padding:20px"><div class="lbl">Sarah replied</div><div class="h2" style="margin-top:6px">She needs to keep 8 am — Bear’s breakfast can’t wait.</div><div style="margin-top:6px">Could you still do the original times?</div></div>
            <div class="foot"><button class="btn" data-act="anaYes">Yes, 8 am + 6 pm work</button><a class="link" data-go="decline">I can’t make it</a></div>`
          : `<div class="card pblue" style="border-radius:28px;padding:20px"><div class="lbl" style="color:var(--ink)">Sent to Sarah</div><div class="h2" style="margin-top:6px">You suggested ${esc([a.suggest?.am, a.suggest?.pm].filter(Boolean).join(' and '))}.</div><div style="margin-top:6px">We’ll text you as soon as she answers.</div></div>
            <div class="rowx c muted small" style="margin-top:16px"><span class="dot on"></span>Waiting for Sarah…</div>`}
        </div></div>`;
      }
      return `<div class="s">${urlbar()}<div class="body">
        <h1 class="h1">Suggest a different time</h1>
        <p class="muted" style="margin:6px 0 0">Sarah decides. Your original yes isn’t sent until she answers.</p>
        <div class="lbl">Instead of 8:00 am</div>
        <div class="pills" data-single id="sgAm">${['Keep 8 am', '9 am', '10 am', '11 am'].map((t, i) => `<span class="pill lg chip ${i === 2 ? 'on' : ''}">${t}</span>`).join('')}</div>
        <div class="lbl">Instead of 6:00 pm</div>
        <div class="pills" data-single id="sgPm">${['Keep 6 pm', '5 pm', '7 pm'].map((t, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>
        <div class="lbl">Why? (optional)</div>
        <textarea class="field" id="sgNote" aria-label="Reason">I have a 9 am thing nearby — 10 is easy.</textarea>
        <div class="foot"><button class="btn" data-act="anaSuggest">Send to Sarah</button><button class="btn ghost" data-go="pick" data-tr="back">Back</button></div>
      </div></div>`;
    }
  },

  // ===== Ana: leave the circle & stop texts =====
  'stop': {
    name: 'Web: stop texts', render: () => L('ana').stage === 'left'
      ? `<div class="s">${urlbar()}<div class="body">
          <span class="ring" style="width:56px;height:56px;background:var(--fill)">${icon('check', 24)}</span>
          <h1 class="h1" style="margin-top:20px">You’re out of Bear’s circle</h1>
          <p class="muted" style="margin:6px 0 0">No more texts from Wala. Sarah sees that you left, not why. You can rejoin anytime from her invite.</p>
        </div></div>`
      : `<div class="s">${urlbar()}<div class="body">
          <h1 class="h1">Stop texts for Bear’s circle?</h1>
          <p class="muted" style="margin:6px 0 0">You won’t get asks from Sarah through Wala anymore. Texting STOP does the same thing.</p>
          <div class="card fill" style="margin-top:20px"><div class="strong">Just want fewer asks?</div><div class="sub">Pick “Not until after the holidays” instead and stay in the circle.</div><button class="btn ghost sm" style="margin-top:12px;background:var(--white)" data-go="decline" data-tr="back">Choose a break instead</button></div>
          <div class="foot"><button class="btn danger" data-act="anaLeave">Leave and stop texts</button><button class="btn ghost" data-go="decline" data-tr="back">Keep me in</button></div>
        </div></div>`
  },

  // ===== Sarah: set up key / door-code handoff =====
  'handoff': {
    name: 'Set up door code', render: () => `<div class="s">
    ${hdr('Key & door code', 'For Megan’s sit · Sat Nov 28', 'sit')}
    <div class="body">
      <div class="lbl">How do sitters get in?</div>
      <div data-radio style="display:flex;flex-direction:column;gap:8px">${[['Keypad door code', 1], ['Lockbox', 0], ['Hand off a key in person', 0]].map(([t, on]) => `<div class="opt ${on ? 'selected' : ''}"><div class="grow">${t}</div><span class="radio"></span></div>`).join('')}</div>
      <div class="lbl">Door code</div>
      <input class="field" type="password" value="4829" aria-label="Door code" inputmode="numeric">
      <div class="small muted">Stored encrypted. Never sent in a plain text message.</div>
      <div class="lbl">When it’s shared</div>
      <div class="pills" data-single>${['24 hours before', 'Morning of the sit', 'Only when they arrive'].map((t, i) => `<span class="pill lg chip ${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="card divide inset" style="margin-top:20px">
        <div class="rowx">${icon('authorized')}<div class="grow"><div class="strong">Only the confirmed sitter sees it</div><div class="sub">After they verify their number again on the secure link.</div></div></div>
        <div class="rowx">${icon('clock')}<div class="grow"><div class="strong">Expires when the sit ends</div><div class="sub">Megan’s link stops working Sun 9 am.</div></div></div>
        <div class="rowx">${icon('notes')}<div class="grow"><div class="strong">Every view is logged</div><div class="sub">You get a quiet notification when it’s opened.</div></div></div>
      </div>
      <div class="foot"><button class="btn" data-act="sitSave" data-k="key">Save</button></div>
    </div></div>`
  },

  // ===== Sarah: who pays the vet =====
  'vetpay': {
    name: 'Set up vet payment', render: () => `<div class="s">
    ${hdr('If Bear needs a vet', 'Applies to every sit', 'sit')}
    <div class="body">
      <p class="intro">Sitters can say yes to urgent care without paying for it. Decide the limit once.</p>
      <div class="lbl">Card the clinic bills</div>
      <div class="card rowx c">${icon('money')}<div class="grow"><div class="strong">Card ending 4242</div><div class="sub">Shared with Elmwood Animal Clinic and Riverside Pet ER only</div></div><span class="pill sm">Change</span></div>
      <div class="lbl">Sitter can approve up to</div>
      <div class="pills" data-single>${['$250', '$500', '$1,000', 'Any amount'].map((t, i) => `<span class="pill lg chip ${i === 1 ? 'on' : ''}">${t}</span>`).join('')}</div>
      <div class="lbl">Above that, call</div>
      <div class="card divide inset">
        <div class="rowx c">${av('S', 's32')}<div class="grow"><div class="strong">You first</div><div class="sub">(•••) •••-0110</div></div>${pill('1', 'sm')}</div>
        <div class="rowx c">${av('M', 's32')}<div class="grow"><div class="strong">Then Megan</div><div class="sub">Neighbor · emergency contact</div></div>${pill('2', 'sm')}</div>
      </div>
      <div class="small muted" style="margin-top:12px">Amounts are placeholders until the pilot’s insurance quote and professional review.</div>
      <div class="foot"><button class="btn" data-act="sitSave" data-k="pay">Save</button></div>
    </div></div>`
  },

  // ===== Lena: answer the lead's question by signing =====
  'h-agreement': {
    name: 'Sign helper agreement', render: () => `<div class="s">
    ${hdr('Neighbor helper agreement', 'Asked for by your neighborhood lead', 'h-review')}
    <div class="body">
      ${agreementBody('Lena', true)}
      <div class="foot"><button class="btn" data-act="signAgreement" data-k="lena">Sign and send back</button></div>
    </div></div>`
  }
});

// flows: add the new screens to their journeys
FLOWS.find(f => f.id === 'owner').steps.splice(6, 0, 'handoff', 'vetpay');
FLOWS.find(f => f.id === 'text').steps.splice(6, 0, 'agreement', 'doorcode');
FLOWS.find(f => f.id === 'text').steps.splice(FLOWS.find(f => f.id === 'text').steps.indexOf('decline') + 1, 0, 'suggest', 'stop');
FLOWS.find(f => f.id === 'helper').steps.push('h-agreement');

// ---------- lock screen after Ana has answered ----------
function lockNotif(body, goTo) {
  return `<div class="notif" ${goTo ? `data-go="${goTo}" data-tr="up"` : ''}><span class="app">${icon('message', 20)}</span>
    <div class="grow"><div style="display:flex;justify-content:space-between"><b style="font-size:15px">Wala</b><span style="color:var(--sys);font-size:13px">now</span></div>
    <div style="font-size:14px;line-height:19px;margin-top:2px">${body}</div></div></div>`;
}
function lockState() {
  const a = L('ana'), s = L('sarah');
  if (a.stage === 'left') return `<div class="lock-wait">${icon('check', 16)}You left Bear’s circle · no more texts</div>`;
  if (s.coveredBy && a.stage !== 'yes') return lockNotif('Sunday’s covered — Sarah found a neighbor. Thanks anyway, and no need to reply 💛', '');
  if (a.stage === 'declined') return lockNotif('Thanks for letting Sarah know. She’ll find someone else for Sunday 💛', '');
  if (a.stage === 'suggested') return lockNotif(s.suggestReply === 'declined' && s.suggestReplyAt > a.suggestedAt ? 'Sarah needs to keep 8 am. Could you still do it? Tap to answer.' : 'We sent Sarah your new time. We’ll text you when she answers.', 'suggest');
  if (a.stage === 'yes' && !a.signedAt) return lockNotif('You’re on for Sunday ✓ Please sign the 2-minute sit agreement before Saturday.', 'agreement');
  if (a.stage === 'yes') return lockNotif('🔐 Saturday 9:00 am — Bear’s door code is ready. Confirm it’s you to see it.', 'doorcode');
  return '';
}

// ---------- request page when Sunday is already covered ----------
const requestRender = SCREENS.request.render;
SCREENS.request.render = () => (L('sarah').coveredBy && L('ana').stage !== 'yes')
  ? `<div class="s">${urlbar()}<div class="body">
      <span class="ring" style="width:56px;height:56px;background:var(--pgrass);color:var(--grass)">${icon('check', 24)}</span>
      <h1 class="h1" style="margin-top:20px">Sunday’s covered</h1>
      <p class="muted" style="margin:6px 0 0">A neighbor said yes before you saw this. Nothing for you to do — Sarah may ask you next time.</p>
      <div class="foot"><a class="link rust" data-go="stop">Leave Bear’s circle & stop texts</a></div></div></div>`
  : requestRender();

// the door code counts as "opened" once it's actually revealed
SCREENS.doorcode.after = () => { if (STATE.codeOpen && L('ana').signedAt) actOnce('ana', 'codeViewedAt'); };
