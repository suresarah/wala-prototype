// ---------- Wala · create your profile (prototype test) ----------
// A real form testers fill in on their own phone. Saves to Supabase when config.js has keys
// (table "profiles", private bucket "profile-photos" — see supabase/profiles.sql); otherwise keeps it on this device.

const PF_KEY = 'wala-profile-draft-v1';
const CFG = window.WALA_SUPABASE || {};
const CONNECTED = !!(CFG.url && CFG.key);

const blankPet = () => ({ name: '', type: 'Dog', breed: '', age: '', weight: '', line: '', feeding: '', meds: 'No', medsDetail: '', tags: [], loves: '', avoid: '' });
const blank = () => ({
  step: 0, role: '', consent: false,
  you: { first: '', last: '', phone: '', email: '', zip: '', neighborhood: '' },
  pets: [blankPet()],
  vet: { clinic: '', phone: '' }, emergency: { name: '', rel: '', phone: '' }, vetLimit: '',
  circle: [{ name: '', rel: '' }, { name: '', rel: '' }],
  need: { services: [], often: '', first: '', budget: '', when: '' },
  helper: { services: [], animals: [], meds: [], days: [], times: [], notice: '', years: '', ownPets: '', cared: '', bio: '', vouches: [{ name: '', rel: '', contact: '' }, { name: '', rel: '', contact: '' }], idOk: '', bgOk: '', thanks: [], rate: '' },
  feedback: { confusing: '', followUp: true }
});
let S = blank();
try { const d = JSON.parse(localStorage.getItem(PF_KEY) || 'null'); if (d && d.v === 1) S = { ...blank(), ...d.s }; } catch (e) {}
const PHOTOS = { you: null, pets: {} }; // File objects (not kept in the draft)
const save = () => { try { localStorage.setItem(PF_KEY, JSON.stringify({ v: 1, s: S })); } catch (e) {} };

const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S);
const set = (path, v) => { const ks = path.split('.'); let o = S; ks.slice(0, -1).forEach(k => { o = o[k]; }); o[ks[ks.length - 1]] = v; save(); };

// ---- form bits ----
const inp = (path, label, o = {}) => `<label class="pf-f"><span class="lbl">${label}${o.opt ? ' <i>optional</i>' : ''}</span>
  <input class="field" data-k="${path}" value="${esc(get(path))}" ${o.type ? `type="${o.type}"` : ''} ${o.mode ? `inputmode="${o.mode}"` : ''} ${o.ac ? `autocomplete="${o.ac}"` : ''} placeholder="${esc(o.ph || '')}"></label>`;
const area = (path, label, o = {}) => `<label class="pf-f"><span class="lbl">${label}${o.opt ? ' <i>optional</i>' : ''}</span>
  <textarea class="field" rows="${o.rows || 3}" data-k="${path}" placeholder="${esc(o.ph || '')}">${esc(get(path))}</textarea></label>`;
const chips = (path, label, opts, o = {}) => { const v = get(path); const multi = Array.isArray(v);
  return `<div class="pf-f"><span class="lbl">${label}${o.opt ? ' <i>optional</i>' : ''}${multi ? ' <i>pick any</i>' : ''}</span><div class="pills">${opts.map(x => `<button type="button" class="pill lg pf-chip ${multi ? (v.includes(x) ? 'on' : '') : (v === x ? 'on' : '')}" data-chip="${path}" data-v="${esc(x)}" aria-pressed="${multi ? v.includes(x) : v === x}">${esc(x)}</button>`).join('')}</div></div>`; };
const photo = (key, label) => { const f = key === 'you' ? PHOTOS.you : PHOTOS.pets[key];
  return `<div class="pf-f"><span class="lbl">${label} <i>optional</i></span><label class="pf-photo">${f ? `<img src="${URL.createObjectURL(f)}" alt="">` : `<span>${icon('user', 22)}</span>`}<span class="pf-photo-t">${f ? 'Change photo' : 'Add a photo'}</span><input type="file" accept="image/*" data-photo="${key}" hidden></label></div>`; };

// ---- steps ----
const OWNER = ['start', 'you', 'pets', 'care', 'vet', 'circle', 'need', 'review'];
const HELPER = ['start', 'you', 'help', 'avail', 'exp', 'trust', 'review'];
const steps = () => S.role === 'helper' ? HELPER : OWNER;
const petName = (i) => S.pets[i]?.name?.trim() || (S.pets.length > 1 ? `Pet ${i + 1}` : 'your pet');

const STEPS = {
  start: { title: 'Help us test Wala', render: () => `
    <p class="pf-lead">Wala helps neighbors look after each other’s pets — starting with the people you already trust. We’re testing it, and we’d love your profile. It takes about 5 minutes.</p>
    <div class="pf-f"><span class="lbl">Which sounds like you?</span>
      <div class="pf-roles">
        <button type="button" class="pf-role ${S.role === 'owner' ? 'on' : ''}" data-role="owner"><span class="ring" style="background:var(--pbutter)">${icon('paw', 20)}</span><span><b>I have a pet</b><small>Set up your pet’s profile and the people who help you</small></span></button>
        <button type="button" class="pf-role ${S.role === 'helper' ? 'on' : ''}" data-role="helper"><span class="ring" style="background:var(--pblue)">${icon('heart', 20)}</span><span><b>I want to help pets nearby</b><small>Friends, neighbors, or as a paid sitter</small></span></button>
      </div></div>
    <div class="card fill pf-consent">
      <div class="strong">Before you start</div>
      <ul><li>This is a prototype test. What you enter is saved and seen only by the Wala team.</li>
        <li>Use real-ish details, but <b>never</b> door codes, alarm codes, passwords, or card/bank numbers.</li>
        <li>Phone and email are optional — only add them if you’re happy for us to follow up.</li></ul>
      <label class="pf-check"><input type="checkbox" data-check="consent" ${S.consent ? 'checked' : ''}><span>I understand and I’m happy to share my answers with the Wala team.</span></label>
    </div>`,
    ok: () => !S.role ? 'Pick one to start' : !S.consent ? 'Please tick the box to continue' : '' },

  you: { title: () => S.role === 'helper' ? 'About you' : 'About you', render: () => `
    <p class="pf-lead">${S.role === 'helper' ? 'Owners see your first name, photo and your block — never your number or address.' : 'Helpers see your first name and your block. Your number and address stay private.'}</p>
    ${photo('you', 'Your photo')}
    <div class="pf-row">${inp('you.first', 'First name', { ac: 'given-name' })}${inp('you.last', 'Last name', { opt: 1, ac: 'family-name' })}</div>
    <div class="pf-row">${inp('you.zip', 'ZIP code', { mode: 'numeric', ac: 'postal-code' })}${inp('you.neighborhood', 'Neighborhood', { opt: 1, ph: 'e.g. Elmwood' })}</div>
    ${inp('you.phone', 'Mobile', { opt: 1, type: 'tel', ac: 'tel', ph: 'Only if we can text you about this test' })}
    ${inp('you.email', 'Email', { opt: 1, type: 'email', ac: 'email' })}`,
    ok: () => !S.you.first.trim() ? 'Add your first name' : !/^\s*\d{5}\s*$/.test(S.you.zip) ? 'Add a 5-digit ZIP code' : '' },

  // owner
  pets: { title: 'Your pets', render: () => `
    <p class="pf-lead">Add everyone in your home. This becomes each pet’s profile — every helper sees it.</p>
    ${S.pets.map((p, i) => `<div class="card pf-pet">
      <div class="rowx c"><div class="h2 grow">${esc(petName(i))}</div>${S.pets.length > 1 ? `<button type="button" class="pf-x" data-rm-pet="${i}" aria-label="Remove">${icon('x', 16)}</button>` : ''}</div>
      ${photo(i, 'Photo')}
      ${inp(`pets.${i}.name`, 'Name')}
      ${chips(`pets.${i}.type`, 'They’re a…', ['Dog', 'Cat', 'Small pet', 'Bird', 'Reptile', 'Fish', 'Other'])}
      <div class="pf-row">${inp(`pets.${i}.breed`, 'Breed', { opt: 1 })}${inp(`pets.${i}.age`, 'Age', { opt: 1, ph: 'e.g. 9 yrs' })}</div>
      ${inp(`pets.${i}.weight`, 'Weight', { opt: 1, ph: 'e.g. 68 lb' })}
    </div>`).join('')}
    <button type="button" class="btn ghost" data-add-pet>${icon('paw', 18)}Add another pet</button>`,
    ok: () => S.pets.some(p => !p.name.trim()) ? 'Give each pet a name (or remove the empty one)' : '' },

  care: { title: 'Care basics', render: () => S.pets.map((p, i) => `<div class="card pf-pet">
      <div class="h2">${esc(petName(i))}</div>
      ${area(`pets.${i}.line`, 'The one thing a helper should know', { ph: 'e.g. Joint pill with dinner. Scared of thunder — let him hide.' })}
      ${area(`pets.${i}.feeding`, 'Feeding', { opt: 1, rows: 2, ph: 'What, how much, when' })}
      ${chips(`pets.${i}.meds`, 'Takes medication?', ['No', 'Yes'])}
      ${p.meds === 'Yes' ? area(`pets.${i}.medsDetail`, 'Which meds, when, and how to give them', { rows: 2 }) : ''}
      ${chips(`pets.${i}.tags`, 'Personality', ['Gentle', 'Shy', 'Energetic', 'Senior', 'Good with kids', 'Good with dogs', 'Nervous around big dogs', 'Escape artist', 'Pulls on leash', 'Separation anxiety'], { opt: 1 })}
      <div class="pf-row">${inp(`pets.${i}.loves`, 'Loves', { opt: 1 })}${inp(`pets.${i}.avoid`, 'Avoid', { opt: 1 })}</div>
    </div>`).join(''),
    ok: () => S.pets.some(p => p.meds === 'Yes' && !p.medsDetail.trim()) ? 'Add the medication details' : '' },

  vet: { title: 'Vet & emergencies', render: () => `
    <p class="pf-lead">So a helper knows what to do if something goes wrong while you’re away.</p>
    <div class="pf-row">${inp('vet.clinic', 'Vet clinic', { opt: 1 })}${inp('vet.phone', 'Clinic phone', { opt: 1, type: 'tel' })}</div>
    <div class="card fill"><div class="strong">Emergency contact</div><div class="sub">Who we call if we can’t reach you</div>
      ${inp('emergency.name', 'Name', { opt: 1 })}<div class="pf-row">${inp('emergency.rel', 'They’re your…', { opt: 1, ph: 'e.g. neighbor' })}${inp('emergency.phone', 'Phone', { opt: 1, type: 'tel' })}</div></div>
    ${chips('vetLimit', 'A helper can approve emergency vet care up to…', ['$250', '$500', '$1,000', 'Always call me first'])}`, ok: () => '' },

  circle: { title: 'Who already helps?', render: () => `
    <p class="pf-lead">Friends, family or neighbors you’d ask first. We won’t contact them — this is just for the test.</p>
    ${S.circle.map((c, i) => `<div class="pf-row">${inp(`circle.${i}.name`, `Person ${i + 1}`, { opt: 1, ph: 'First name' })}${inp(`circle.${i}.rel`, 'They’re your…', { opt: 1, ph: 'sister, neighbor…' })}</div>`).join('')}
    ${S.circle.length < 6 ? `<button type="button" class="btn ghost" data-add-circle>${icon('people', 18)}Add someone</button>` : ''}`, ok: () => '' },

  need: { title: 'The care you need', render: () => `
    ${chips('need.services', 'What kind of help?', ['Drop-ins', 'Walks', 'Overnights at my place', 'Boarding', 'Daycare', 'Meds only'])}
    ${chips('need.often', 'How often?', ['A few times a year', 'Monthly', 'Weekly', 'Most days'])}
    ${chips('need.first', 'Who would you rather ask first?', ['Friends & family', 'Vouched neighbors', 'Professional sitters'])}
    ${chips('need.budget', 'For a 30-min drop-in, you’d expect to pay…', ['Nothing — a favor', 'Under $20', '$20–30', '$30+'])}
    ${inp('need.when', 'Next time you’ll need someone', { opt: 1, ph: 'e.g. Thanksgiving weekend' })}`, ok: () => !S.need.services.length ? 'Pick at least one kind of help' : '' },

  // helper
  help: { title: 'How you’d help', render: () => `
    ${chips('helper.services', 'What would you do?', ['Drop-ins', 'Walks', 'Overnights at their place', 'Boarding at mine', 'Daycare', 'Meds only'])}
    ${chips('helper.animals', 'Animals you’re comfortable with', ['Small dogs', 'Medium dogs', 'Big dogs', 'Puppies', 'Senior pets', 'Cats', 'Small pets', 'Birds', 'Reptiles'])}
    ${chips('helper.meds', 'Medication you’re OK giving', ['Pills', 'Liquid', 'Eye/ear drops', 'Injections', 'None yet'], { opt: 1 })}`,
    ok: () => !S.helper.services.length ? 'Pick at least one way to help' : !S.helper.animals.length ? 'Pick at least one kind of animal' : '' },

  avail: { title: 'When you’re free', render: () => `
    ${chips('helper.days', 'Days', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])}
    ${chips('helper.times', 'Times', ['Early morning', 'Midday', 'Evening', 'Overnight'])}
    ${chips('helper.notice', 'How much notice do you need?', ['Same day is fine', 'A day', 'A few days', 'A week+'])}`,
    ok: () => !S.helper.days.length ? 'Pick at least one day' : '' },

  exp: { title: 'Your experience', render: () => `
    ${chips('helper.years', 'Time spent caring for pets', ['Just my own', 'Under 1 year', '1–3 years', '3+ years', 'Professional'])}
    ${inp('helper.ownPets', 'Your own pets', { opt: 1, ph: 'e.g. Pepper, 6, calm lab' })}
    ${area('helper.cared', 'Pets you’ve looked after', { opt: 1, rows: 2, ph: 'Whose, what kind, for how long' })}
    ${area('helper.bio', 'A few lines for owners', { rows: 4, ph: 'What should a neighbor know about you?' })}`,
    ok: () => !S.helper.bio.trim() ? 'Add a few lines for owners' : '' },

  trust: { title: 'Trust & thanks', render: () => `
    <p class="pf-lead">On Wala, neighbors see you after two people they know vouch for you. Who might vouch for you? We won’t contact them.</p>
    ${S.helper.vouches.map((v, i) => `<div class="card fill"><div class="strong">Vouch ${i + 1}</div><div class="pf-row">${inp(`helper.vouches.${i}.name`, 'Name', { opt: 1 })}${inp(`helper.vouches.${i}.rel`, 'They know you as…', { opt: 1, ph: 'neighbor, client…' })}</div></div>`).join('')}
    ${chips('helper.idOk', 'Would you verify your ID to help neighbors?', ['Yes', 'Maybe', 'No'])}
    ${chips('helper.bgOk', 'Would you do a background check to get paid bookings?', ['Yes', 'Maybe', 'No', 'Already have one'])}
    ${chips('helper.thanks', 'How would you like to be thanked?', ['Paid', 'A favor back', 'Trading sits', 'Nothing needed'])}
    ${S.helper.thanks.includes('Paid') ? inp('helper.rate', 'Your rate for a 30-min drop-in', { opt: 1, ph: 'e.g. $20', mode: 'decimal' }) : ''}`, ok: () => '' },

  review: { title: 'Check it over', render: () => `
    ${summary()}
    ${area('feedback.confusing', 'Anything confusing or missing?', { opt: 1, rows: 3 })}
    <label class="pf-check"><input type="checkbox" data-check="feedback.followUp" ${S.feedback.followUp ? 'checked' : ''}><span>The Wala team can contact me about this test${S.you.phone || S.you.email ? '' : ' (add a phone or email on the “About you” step)'}</span></label>
    ${CONNECTED ? '' : `<div class="note">Test mode: the team database isn’t connected yet, so this saves on this device only. You can download your answers after.</div>`}`, ok: () => '' }
};

function summary() {
  const row = (k, v) => v && (!Array.isArray(v) || v.length) ? `<div class="pf-sum-r"><span>${k}</span><b>${esc(Array.isArray(v) ? v.join(', ') : v)}</b></div>` : '';
  const edit = (step) => `<button type="button" class="link pf-edit" data-goto="${steps().indexOf(step)}">Edit</button>`;
  const you = `<div class="card"><div class="rowx c"><div class="h2 grow">${esc(S.you.first)} ${esc(S.you.last)}</div>${edit('you')}</div>${row('ZIP', S.you.zip)}${row('Neighborhood', S.you.neighborhood)}${row('Mobile', S.you.phone)}${row('Email', S.you.email)}</div>`;
  if (S.role === 'helper') { const h = S.helper;
    return you + `<div class="card"><div class="rowx c"><div class="h2 grow">Helping</div>${edit('help')}</div>${row('Does', h.services)}${row('Animals', h.animals)}${row('Meds', h.meds)}${row('Days', h.days)}${row('Times', h.times)}${row('Notice', h.notice)}</div>
      <div class="card"><div class="rowx c"><div class="h2 grow">About</div>${edit('exp')}</div>${row('Experience', h.years)}${row('Own pets', h.ownPets)}${row('Cared for', h.cared)}${row('Bio', h.bio)}${row('Vouches', h.vouches.filter(v => v.name).map(v => v.name + (v.rel ? ` (${v.rel})` : '')))}${row('ID check', h.idOk)}${row('Background check', h.bgOk)}${row('Thanks', h.thanks)}${row('Rate', h.rate)}</div>`; }
  return you + S.pets.map((p, i) => `<div class="card"><div class="rowx c"><div class="h2 grow">${esc(petName(i))}</div>${edit('pets')}</div>${row('Type', [p.type, p.breed, p.age, p.weight].filter(Boolean).join(' · '))}${row('Know this', p.line)}${row('Feeding', p.feeding)}${row('Meds', p.meds === 'Yes' ? p.medsDetail : 'None')}${row('Personality', p.tags)}${row('Loves', p.loves)}${row('Avoid', p.avoid)}</div>`).join('')
    + `<div class="card"><div class="rowx c"><div class="h2 grow">Care & people</div>${edit('vet')}</div>${row('Vet', [S.vet.clinic, S.vet.phone].filter(Boolean).join(' · '))}${row('Emergency', [S.emergency.name, S.emergency.rel, S.emergency.phone].filter(Boolean).join(' · '))}${row('Vet limit', S.vetLimit)}${row('Circle', S.circle.filter(c => c.name).map(c => c.name + (c.rel ? ` (${c.rel})` : '')))}${row('Needs', S.need.services)}${row('How often', S.need.often)}${row('Ask first', S.need.first)}${row('Budget', S.need.budget)}${row('Next time', S.need.when)}</div>`;
}

// ---- render ----
const app = document.getElementById('pf');
let lastDone = null;
function render(focusTop = true) {
  if (lastDone) return renderDone();
  const st = steps(), id = st[S.step] || 'start', def = STEPS[id];
  const n = st.length - 1, pct = Math.round((S.step / n) * 100);
  app.innerHTML = `
    <header class="pf-top">${S.step ? `<button type="button" class="pf-back" data-back aria-label="Back">${icon('back', 18)}</button>` : ''}<i class="logo pf-logo" aria-label="Wala"></i><span class="grow"></span>${S.step ? `<span class="pf-count">${S.step} of ${n}</span>` : `<span class="pill white sm">Prototype test</span>`}</header>
    ${S.step ? `<div class="pf-bar"><i style="width:${pct}%"></i></div>` : ''}
    <main class="pf-main"><h1 class="h1">${typeof def.title === 'function' ? def.title() : def.title}</h1>${def.render()}</main>
    <footer class="pf-foot"><button type="button" class="btn" data-next>${id === 'review' ? 'Submit my profile' : S.step ? 'Continue' : 'Start'}</button>
      ${S.step === 0 && (S.you.first || S.role) ? `<button type="button" class="link" data-reset>Start over</button>` : ''}</footer>`;
  if (focusTop) window.scrollTo(0, 0);
}

function renderDone() {
  const d = lastDone;
  app.innerHTML = `<header class="pf-top"><i class="logo pf-logo" aria-label="Wala"></i></header>
  <main class="pf-main">
    <div class="card ${d.ok ? 'pgrass' : 'pbutter'}" style="padding:22px"><div style="font-size:36px">${d.ok ? '🎉' : '💾'}</div>
      <h1 class="h1" style="margin-top:8px">${d.ok ? `Thanks, ${esc(d.first)}!` : 'Saved on this device'}</h1>
      <p style="margin:8px 0 0">${d.ok ? 'Your profile is with the Wala team. That’s everything — you can close this page.' : d.err ? `We couldn’t reach the Wala team (${esc(d.err)}). Your answers are saved here; download them and send them over, or try again.` : 'The team database isn’t connected yet. Download your answers and send them to whoever shared this link.'}</p></div>
    ${d.ok ? '' : `<button type="button" class="btn" data-download>${icon('notes', 18)}Download my answers</button>${d.err ? `<button type="button" class="btn ghost" data-retry>Try again</button>` : ''}`}
    <div class="card fill"><div class="strong">What happens next</div><div class="sub" style="font-size:13px">Wala is a prototype. Nobody will be contacted from your answers, and nothing is booked.${d.ok && S.feedback.followUp ? ' The team may reach out about the test.' : ''}</div></div>
    <a class="link" href="index.html#/j/st-start">See the clickable prototype →</a>
    <button type="button" class="link" data-new>Create another profile</button>
  </main>`;
  window.scrollTo(0, 0);
}

// ---- photos ----
async function shrink(file, max = 1200) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return new Promise(res => c.toBlob(res, 'image/jpeg', 0.85));
}

// ---- submit ----
let sb = null;
function client() {
  if (sb) return Promise.resolve(sb);
  return new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.js';
    s.onload = () => { sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: false } }); res(sb); };
    s.onerror = () => rej(new Error('could not load the database library')); document.head.appendChild(s);
  });
}
function payload() {
  const base = { role: S.role, you: S.you, feedback: S.feedback, consent: S.consent };
  return S.role === 'helper' ? { ...base, helper: S.helper }
    : { ...base, pets: S.pets, vet: S.vet, emergency: S.emergency, vetLimit: S.vetLimit, circle: S.circle.filter(c => c.name.trim()), need: S.need };
}
async function submit(btn) {
  const data = payload();
  if (!CONNECTED) { lastDone = { ok: false, first: S.you.first, data }; return render(); }
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const c = await client(); const id = crypto.randomUUID(); const paths = [];
    const files = [['you', PHOTOS.you], ...Object.entries(PHOTOS.pets).map(([i, f]) => ['pet-' + i, f])].filter(x => x[1]);
    for (const [k, f] of files) {
      const blob = await shrink(f); const path = `${id}/${k}.jpg`;
      const { error } = await c.storage.from('profile-photos').upload(path, blob, { contentType: 'image/jpeg' });
      if (!error) paths.push(path);
    }
    const { error } = await c.from('profiles').insert({ id, role: S.role, first_name: S.you.first.trim().slice(0, 60), zip: S.you.zip.trim(), data, photos: paths, user_agent: navigator.userAgent.slice(0, 200) });
    if (error) throw new Error(error.message);
    lastDone = { ok: true, first: S.you.first }; try { localStorage.removeItem(PF_KEY); } catch (e) {}
  } catch (e) { lastDone = { ok: false, first: S.you.first, err: e.message || 'network error', data }; }
  render();
}

// ---- events ----
function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400); }
document.addEventListener('input', (e) => { const k = e.target.dataset.k; if (k) set(k, e.target.value); });
document.addEventListener('change', (e) => {
  const c = e.target.dataset.check; if (c) { set(c, e.target.checked); return; }
  const p = e.target.dataset.photo; if (p != null && e.target.files[0]) { if (p === 'you') PHOTOS.you = e.target.files[0]; else PHOTOS.pets[p] = e.target.files[0]; render(false); }
});
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, [data-goto]'); if (!t) return;
  if (t.dataset.chip) { const path = t.dataset.chip, v = t.dataset.v, cur = get(path);
    if (Array.isArray(cur)) set(path, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]); else set(path, cur === v ? '' : v);
    return render(false); }
  if (t.dataset.role) { S.role = t.dataset.role; save(); return render(false); }
  if ('addPet' in t.dataset) { S.pets.push(blankPet()); save(); return render(false); }
  if (t.dataset.rmPet != null) { S.pets.splice(+t.dataset.rmPet, 1); PHOTOS.pets = {}; save(); return render(false); }
  if ('addCircle' in t.dataset) { S.circle.push({ name: '', rel: '' }); save(); return render(false); }
  if (t.dataset.goto != null) { S.step = +t.dataset.goto; save(); return render(); }
  if ('back' in t.dataset) { S.step = Math.max(0, S.step - 1); save(); return render(); }
  if ('next' in t.dataset) {
    const id = steps()[S.step]; const msg = STEPS[id].ok();
    if (msg) return toast(msg);
    if (id === 'review') return submit(t);
    S.step++; save(); return render();
  }
  if ('reset' in t.dataset || 'new' in t.dataset) { S = blank(); PHOTOS.you = null; PHOTOS.pets = {}; lastDone = null; save(); return render(); }
  if ('retry' in t.dataset) { lastDone = null; S.step = steps().indexOf('review'); return render(); }
  if ('download' in t.dataset) {
    const blob = new Blob([JSON.stringify({ savedAt: new Date().toISOString(), ...lastDone.data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `wala-profile-${(S.you.first || 'me').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`; a.click();
  }
});
render();
