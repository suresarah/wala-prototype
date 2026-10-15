# Wala prototype

A clickable prototype of the Wala pilot. It's built from the "Wala — warm restyle" Figma page.

- **Neighbors & trusted friends:** the owner asks their circle first, then vouched neighbors, then insured pros.
- **Circle invite by text:** Ana isn't on the app. She gets one SMS and answers by text or on a no-download web page.
- **Becoming a neighbor helper:** apply with an ID, address and two vouches.
- **Admin (desktop):** a neighborhood lead approves applicants, asks them for info, or declines them.

It's plain HTML, CSS and JS, with no build step. Every screen has its own link, like `#/s/request` or `#/admin`.

## Live test sessions (end to end)

On the home page, click **Start a test session**. You get a session code, plus a link and QR code for each role:

- **Sarah** (owner): asks her circle.
- **Ana** (her sister, not on the app): gets the text and answers on the web or by text.
- **Lena** (neighbor): applies to help.
- **Neighborhood lead** (desktop): reviews Lena's application.

Each tester opens their own link on their own device and only sees their part. What one person does shows up on the others' screens live: Ana's phone buzzes when Sarah asks, and Sarah gets a banner when Ana answers. The session page logs every step with a timestamp and the time since the previous step. Use **Copy log** to paste it into your research notes. Start a new session for each test.

### Turn on syncing across phones (one-time, ~10 minutes)

Until `config.js` has keys, sessions only sync between tabs of the same browser. That works for a demo, not for testing.

1. Go to https://supabase.com and sign up (the free plan is enough). Create a **New project**; any name, password and nearby region is fine.
2. Open **Project Settings → API Keys**. Copy the **Project URL** and the **anon / publishable** key.
3. Paste both into `config.js`, then commit and push with GitHub Desktop.

You don't need any tables. Sessions use Supabase Realtime, which is on by default. The anon key is designed to sit in front-end code. Free projects pause after about a week without use; click **Restore** in the Supabase dashboard before a test day.

## Voice

Sarah can say what Bear needs, Ana can answer the request by talking, and Ana can send a spoken update after a visit, which Sarah can read or listen to. It uses the browser's built-in speech recognition (Chrome, Edge, Safari, including iPhone), so there are no keys or services to set up. The first time, the browser asks for the microphone. Where speech isn't available or the mic is blocked, including the claude.ai copy, testers can tap a sample phrase or type instead.

What was said is turned into a request, answer or update with simple keyword rules. A production build would use a language model. Testers always see and can edit what was understood before anything is sent.

## Run locally

```
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765.

## Publish (GitHub Pages)

1. In GitHub Desktop, choose File → Add Local Repository, pick this folder, then click Publish repository. Untick "Keep this code private" if you want the link to be public.
2. On github.com, go to the repo's Settings → Pages. Under Source pick "Deploy from a branch", then choose `main` and `/ (root)`, and save.
3. After a minute or two the site is live at `https://suresarah.github.io/wala-prototype/`.

Prices, names, the $500 vet limit and the cover wording are all placeholders.
