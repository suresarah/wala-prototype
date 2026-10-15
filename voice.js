// ---------- Voice: talk instead of tapping ----------
// Uses the browser's own speech recognition (Chrome, Edge, Safari incl. iPhone). Nothing is sent to us.
// Where it's missing or the mic is blocked, testers pick a sample phrase or type instead.

const VOICE = { rec: null, state: 'idle', text: '', interim: '', kind: null };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

const VOICE_SAMPLES = {
  ask: ['I need someone to drop in on Bear Sunday, morning and evening. Ask my circle first.',
    'Can someone walk Bear Saturday and Sunday evenings?'],
  answer: ['Yes, I can do both visits on Sunday. I’ll bring his favorite chews!',
    'I can do it, but could the morning one be at 10 instead?',
    'Sorry, I’m away that weekend.'],
  update: ['All good! He ate all his breakfast, we did a 25 minute walk, and he’s napping by the window.',
    'Gave him his pill with dinner and a short walk. He was a little stiff getting up.',
    'He didn’t eat much breakfast and threw up once. Otherwise calm.']
};

function voiceReset(kind) { try { VOICE.rec?.abort(); } catch (e) {} Object.assign(VOICE, { rec: null, state: 'idle', text: '', interim: '', kind }); }
function voiceRefresh() { const box = document.getElementById('voicebox'); if (VOICE.state === 'listening' && box) box.outerHTML = voiceBox(VOICE.kind); else rerender(); }

function voiceStart() {
  if (!SR) { VOICE.state = 'unsupported'; return voiceRefresh(); }
  const r = new SR();
  r.lang = 'en-US'; r.interimResults = true; r.continuous = true;
  r.onresult = (e) => {
    let fin = '', mid = '';
    for (let i = 0; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) fin += t + ' '; else mid += t; }
    VOICE.text = fin.trim(); VOICE.interim = mid; voiceRefresh();
  };
  r.onerror = (e) => {
    VOICE.state = (e.error === 'not-allowed' || e.error === 'service-not-allowed') ? 'denied' : e.error === 'no-speech' ? 'nospeech' : 'error';
    voiceRefresh();
  };
  r.onend = () => {
    if (VOICE.state !== 'listening') return;
    VOICE.text = (VOICE.text + ' ' + VOICE.interim).trim(); VOICE.interim = '';
    VOICE.state = VOICE.text ? 'done' : 'nospeech'; voiceRefresh();
  };
  VOICE.rec = r; VOICE.state = 'listening'; VOICE.text = ''; VOICE.interim = '';
  try { r.start(); } catch (e) { VOICE.state = 'error'; }
  voiceRefresh();
}
function voiceStop() { try { VOICE.rec?.stop(); } catch (e) {} }

// ---------- understanding what was said (simple rules; a real build would use an LLM) ----------
const norm = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'");
const has = (t, re) => re.test(norm(t));
function parseAsk(t) {
  const days = [];
  if (has(t, /\b(sat|saturday|weekend)\b/)) days.push('Sat Nov 28');
  if (has(t, /\b(sun|sunday|weekend)\b/)) days.push('Sun Nov 29');
  const times = [];
  if (has(t, /\b(morning|breakfast|am)\b/)) times.push('Morning');
  if (has(t, /\b(evening|night|dinner|pm)\b/)) times.push('Evening');
  const type = has(t, /\b(overnight|stay|sleep)/) ? 'Overnight' : has(t, /\bwalk/) ? 'Walks' : 'Drop-ins';
  const who = has(t, /\bpro(s|fessional)?\b/) ? 'Pros' : has(t, /\bneighbou?r/) ? 'Neighbors' : 'Your circle first';
  return { type, days: days.length ? days : ['Sun Nov 29'], times: times.length ? times : ['Morning', 'Evening'], who };
}
function parseAnswer(t) {
  const no = has(t, /\b(no|nope|can'?t|cannot|won'?t|sorry|busy|away|not this time|out of town)\b/);
  const yes = has(t, /\b(yes|yeah|yep|sure|can do|i can|happy to|of course|absolutely|count me in|works)\b/);
  const m = norm(t).match(/\b(?:at|be at|around)\s*(\d{1,2})(?:\s*(am|pm))?\b/);
  const instead = has(t, /\b(instead|later|earlier|could .* be|move)\b/) && m;
  const amOnly = has(t, /\b(just|only)\b.*\bmorning\b|\bmorning (one )?only\b/);
  const pmOnly = has(t, /\b(just|only)\b.*\b(evening|night)\b|\bevening (one )?only\b/);
  if (instead) { const h = +m[1]; const ap = m[2] || (h >= 5 && h <= 11 ? 'am' : 'pm'); const lbl = `${h} ${ap}`; return { kind: 'suggest', suggest: ap === 'am' ? { am: lbl, pm: '' } : { am: '', pm: lbl }, label: `Can do it, suggests ${lbl}` }; }
  if (no && !yes) return { kind: 'no', label: 'Can’t make it' };
  if (yes || amOnly || pmOnly) return { kind: 'yes', visits: { am: !pmOnly, pm: !amOnly }, label: `Yes · ${visitText({ am: !pmOnly, pm: !amOnly })}` };
  return { kind: 'unclear', label: 'Not sure what you meant — pick below' };
}
function parseUpdate(t) {
  const chips = [];
  if (has(t, /\b(ate|eat|fed|breakfast|dinner|food|meal)\b/) && !has(t, /\b(didn'?t|did not|wouldn'?t|not much)\b.*\b(eat|breakfast|food)/)) chips.push('🍽 Ate');
  if (has(t, /\b(pill|med|meds|medicine|rimadyl)\b/)) chips.push('💊 Med given');
  const w = norm(t).match(/(\d{1,3})\s*(?:-|\s)?\s*min/);
  if (has(t, /\bwalk/)) chips.push(w ? `🚶 ${w[1]} min walk` : '🚶 Walk');
  if (has(t, /\b(pee|poop|potty|business|yard)\b/)) chips.push('🌿 Potty break');
  if (has(t, /\b(nap|napping|sleep|calm|relaxed|happy|good)\b/)) chips.push('😌 Calm');
  const flag = has(t, /\b(threw up|vomit|sick|limp|limping|blood|didn'?t eat|not much breakfast|stiff|cough|diarrh)/);
  return { chips, flag };
}

// ---------- the voice panel ----------
function voiceBox(kind) {
  const st = VOICE.state;
  const samples = `<div class="lbl" style="margin-top:16px">${SR && st !== 'denied' ? 'Or try a sample' : 'Try a sample'}</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">${VOICE_SAMPLES[kind].map((s, i) => `<button class="opt" style="text-align:left" data-act="voiceSample" data-k="${i}"><span style="font-size:13px">“${esc(s)}”</span></button>`).join('')}</div>`;
  if (st === 'listening') return `<div id="voicebox" class="voicebox">
      <button class="mic on" data-act="voiceStop" aria-label="Stop listening">${icon('mic', 30)}</button>
      <div class="vb-state">Listening… tap to stop</div>
      <div class="vb-live">${esc(VOICE.text)} <span class="muted">${esc(VOICE.interim)}</span></div></div>`;
  if (st === 'done') return `<div id="voicebox" class="voicebox done">
      <div class="lbl">You said</div>
      <textarea class="field" id="voiceText" aria-label="What you said">${esc(VOICE.text)}</textarea>
      <div id="voiceParse">${voiceParseView(kind, VOICE.text)}</div>
      <button class="link" style="margin-top:12px" data-act="voiceStart">${icon('mic', 14)} Say it again</button></div>`;
  const msg = st === 'unsupported' ? 'This browser can’t listen. Try Chrome or Safari, or pick a sample.'
    : st === 'denied' ? 'The microphone is blocked here. Allow it in your browser settings, or pick a sample.'
    : st === 'nospeech' ? 'Didn’t catch that. Tap the mic and try again.'
    : st === 'error' ? 'Something went wrong listening. Try again or pick a sample.' : '';
  return `<div id="voicebox" class="voicebox">
      <button class="mic" data-act="voiceStart" aria-label="Start talking">${icon('mic', 30)}</button>
      <div class="vb-state">${msg ? esc(msg) : 'Tap and talk'}</div>
      ${samples}</div>`;
}
function voiceParseView(kind, t) {
  if (kind === 'ask') {
    const p = parseAsk(t);
    return `<div class="card pbutter" style="margin-top:12px"><div class="lbl">Here’s the request</div>
      <div class="pills" style="margin-top:8px">${[p.type, ...p.days, ...p.times, p.who].map(x => pill(esc(x), 'white')).join('')}</div>
      ${p.days.join() !== 'Sun Nov 29' ? '<div class="small muted" style="margin-top:8px">This prototype’s scenario stays Sun Nov 29 · 8 am + 6 pm.</div>' : ''}</div>`;
  }
  if (kind === 'answer') {
    const p = parseAnswer(t);
    return `<div class="card ${p.kind === 'no' ? 'fill' : p.kind === 'unclear' ? 'prust' : 'pgrass'}" style="margin-top:12px"><div class="lbl">Sounds like</div><div class="ttl" style="margin-top:4px">${esc(p.label)}</div>
      <div class="pills" style="margin-top:10px" data-single id="vaPick">${[['yes', 'Yes'], ['suggest', 'Different time'], ['no', 'Can’t']].map(([k, l]) => `<span class="pill chip ${k === p.kind ? 'on' : ''}" data-k="${k}">${l}</span>`).join('')}</div></div>`;
  }
  const p = parseUpdate(t);
  return `<div class="card ${p.flag ? 'prust' : 'pgrass'}" style="margin-top:12px"><div class="lbl">Sarah will see</div>
    <div class="pills" style="margin-top:8px">${p.chips.map(c => pill(c, 'white')).join('') || '<span class="small muted">Just your words</span>'}</div>
    ${p.flag ? `<div class="small" style="margin-top:8px;color:var(--rust)">${icon('alert', 13)} Flagged so Sarah sees it first. If it’s urgent, call Wala.</div>` : ''}</div>`;
}

// ---------- screens ----------
Object.assign(SCREENS, {
  'voice-ask': {
    name: 'Ask by voice', render: () => `<div class="s">
    ${hdr('Say what Bear needs', 'We’ll turn it into a request', 'who')}
    <div class="body">
      <p class="intro">Talk like you’d text a friend: which days, what times, who to ask.</p>
      ${voiceBox('ask')}
      ${VOICE.state === 'done' ? `<div class="foot"><button class="btn" data-act="voiceAskSend">Ask my circle</button></div>` : ''}
    </div></div>`
  },
  'voice-answer': {
    name: 'Web: answer by voice', render: () => `<div class="s">
    ${urlbar()}
    <div class="body">
      <h1 class="h1">Just say it</h1>
      <p class="muted" style="margin:6px 0 0">Yes, no, or a different time — however you’d say it to Sarah. You’ll check it before it’s sent.</p>
      ${voiceBox('answer')}
      ${VOICE.state === 'done' ? `<div class="foot"><button class="btn" data-act="voiceAnswerSend">Send to Sarah</button></div>` : `<div class="foot"><a class="link" data-go="request" data-tr="back">Answer with buttons instead</a></div>`}
    </div></div>`
  },
  'visit': {
    name: 'Web: Sunday visit', render: () => {
      const a = L('ana'); const sent = (a.updates || []).length;
      return `<div class="s">
    ${urlbar('wala.app/v/7Q2K')}
    <div class="body">
      <div class="pills">${pill('Sun · 8:00 am visit', 'pbutter', 'clock')}</div>
      <h1 class="h1" style="margin-top:12px">Bear’s morning</h1>
      <div class="lbl">Checklist</div>
      <div data-checks style="display:flex;flex-direction:column;gap:8px">${['Breakfast · 2 cups, no chicken treats', 'Out to the yard', 'Fresh water'].map(t => `<div class="opt" data-act="toggleCheck"><span class="box"></span><div class="grow" style="font-size:14px">${t}</div></div>`).join('')}</div>
      <div class="lbl">Tell Sarah how it went</div>
      ${sent && !STATE.visitMore ? `<div class="card pgrass">${chk('done')}<div class="strong" style="margin-top:8px">Update sent to Sarah</div><div class="sub">${esc(a.updates[sent - 1].text)}</div><button class="link" style="margin-top:10px;text-align:left" data-act="voiceAgain">${icon('mic', 14)} Send another</button></div>` : voiceBox('update')}
      ${(!sent || STATE.visitMore) && VOICE.state === 'done' ? `<div class="foot"><button class="btn" data-act="voiceUpdateSend">Send update</button></div>` : ''}
    </div></div>`;
    }
  }
});

ROLES.ana.screens.push('voice-answer', 'visit');
ROLES.sarah.screens.push('voice-ask');
FLOWS.find(f => f.id === 'owner').steps.splice(1, 0, 'voice-ask');
const tf = FLOWS.find(f => f.id === 'text').steps;
tf.splice(tf.indexOf('request') + 1, 0, 'voice-answer');
tf.splice(tf.indexOf('doorcode') + 1, 0, 'visit');

// reset the mic whenever a voice screen opens
['voice-ask', 'voice-answer', 'visit'].forEach(id => { const k = { 'voice-ask': 'ask', 'voice-answer': 'answer', visit: 'update' }[id]; SCREENS[id].before = () => voiceReset(k); });

// read an update aloud for Sarah
function speak(text) {
  if (!('speechSynthesis' in window)) return toast('This browser can’t read aloud');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.rate = 1; speechSynthesis.speak(u);
}
