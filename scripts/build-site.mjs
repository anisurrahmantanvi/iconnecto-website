// Writes plain HTML pages (no JavaScript needed, HTTP 200) next to the app so app stores and search engines can read them:
//   /about/  /privacy/  /terms/  /delete-account/   (and /privacy-policy/ for the link used inside the app)
// Usage: node scripts/build-site.mjs [distDir]   Settings come from site.config.json.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = process.argv[2] || 'dist'
const cfg = JSON.parse(readFileSync('site.config.json', 'utf8'))
const base = (process.env.VITE_BASE || '/').replace(/\/?$/, '/')
const email = cfg.contactEmail?.trim()
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const contact = email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : 'the contact form in the app (Settings → Contact Support)'

const css = `
:root{--bg:#f4f6ff;--fg:#14172b;--muted:#586079;--card:#fff;--line:#e2e6f5;--accent:#0a84ff}
@media(prefers-color-scheme:dark){:root{--bg:#0e1020;--fg:#eef0ff;--muted:#a3a9c6;--card:#171a30;--line:#2a2e4d}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header,main,footer{max-width:720px;margin:0 auto;padding:16px 20px}
header{display:flex;align-items:center;gap:10px;font-weight:700;font-size:20px}
header img{width:36px;height:36px;border-radius:9px}
main{background:var(--card);border:1px solid var(--line);border-radius:18px;margin-top:8px;padding:24px}
h1{margin:.2em 0 .1em;font-size:1.8rem}h2{margin-top:1.6em;font-size:1.2rem}h3{margin:1em 0 .2em;font-size:1rem;color:var(--accent)}
a{color:var(--accent)}ul{padding-left:1.2em}.muted{color:var(--muted)}
nav a{margin-right:14px}footer{color:var(--muted);font-size:.9rem}
.btn{display:inline-block;background:var(--accent);color:#fff;border-radius:999px;padding:10px 20px;text-decoration:none;font-weight:600}
`

function page(slug, title, body, description) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · ${cfg.appName}</title><meta name="description" content="${esc(description)}">
<link rel="icon" href="${base}favicon-32.png"><style>${css}</style></head>
<body><header><img src="${base}icons/icon-192.png" alt=""><span>${cfg.appName}</span></header>
<nav style="max-width:720px;margin:0 auto;padding:0 20px"><a href="${base}about/">About</a><a href="${base}privacy/">Privacy Policy</a><a href="${base}terms/">Terms</a><a href="${base}delete-account/">Delete account</a></nav>
<main>${body}</main>
<footer>© ${cfg.appName} · Last updated ${cfg.updated} · Contact: ${contact}</footer></body></html>`
  for (const s of Array.isArray(slug) ? slug : [slug]) {
    const dir = join(dist, s)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
}

const APP = process.env.APP_URL || 'https://anisurrahmantanvi.github.io/hmm/'
page('about', 'About', `
<h1>${cfg.appName}</h1>
<p class="muted">Connect with friends, share moments, chat and call, in one app.</p>
<h2>Features</h2>
<h3>Share</h3>
<ul>
<li>Post text and photos, add music, and choose who sees it: Public, Friends only, or Only me.</li>
<li>Like, react with emoji, comment, reply, share and save posts.</li>
<li>Short videos in Reels.</li>
<li>Create a <strong>Page</strong> for yourself as a creator, or for a business, community or news source. Followers see Page posts in their feed, and Page owners get simple insights, notifications, an inbox for messages to the Page, and their own settings and policy page.</li>
<li>Switch between your personal profile and your Pages, like on other social apps.</li>
<li>Make your profile your own: theme colour, background, layout and a profile song.</li>
<li>Save posts, add accounts to Favorites, and see a Favorites-only feed.</li>
<li>Join and create communities.</li>
</ul>
<h3>Connect</h3>
<ul>
<li>Add friends, follow people, and discover new people, posts and communities with search.</li>
<li>Private chat with message requests, replies, forwarding, emoji reactions, read receipts, typing and online status, and chat archive.</li>
<li>Voice and video calls that ring even when the app is in the background (Android).</li>
<li><strong>Hmm AI</strong>, a free assistant in Messages for questions, writing help and ideas.</li>
<li>Push notifications with controls for messages, calls, likes, comments, pause and quiet hours.</li>
<li>Available in English, Bangla and Hindi.</li>
<li>Choose your layout: Thumb Arc (one round button under your thumb) or the classic bottom bar.</li>
</ul>
<h3>Privacy and safety</h3>
<ul>
<li>Private account, who can message you, who can comment, blocking and reporting.</li>
<li>Hidden words, Not interested, Snooze, and Digital Wellbeing with break and daily-limit reminders.</li>
<li>Accessibility and media settings: text size, reduce motion, high contrast and data saver.</li>
<li>Two-step verification with an authenticator app or email code, trusted devices and sign-in alerts.</li>
<li>Download your information, deactivate or permanently delete your account at any time.</li>
<li>Blue verified badge for verified accounts.</li>
<li>No ads and no selling of your data.</li>
</ul>
<h3>Coming soon</h3>
<ul>
<li>Buy &amp; Sell marketplace with safe-deal tools.</li>
<li>Stories and more creator tools.</li>
</ul>
<h2>Get the app</h2>
<p>Open Hmm in your browser now. The Android app is coming to Google Play.</p>
<p><a class="btn" href="${APP}">Open ${cfg.appName}</a></p>
<h2>Policies and help</h2>
<ul>
<li><a href="${base}privacy/">Privacy Policy</a></li>
<li><a href="${base}terms/">Terms of Service</a></li>
<li><a href="${base}delete-account/">How to delete your account and data</a></li>
</ul>
<h2>Contact</h2><p>Questions or problems? Reach us at ${contact}.</p>`,
  'Hmm is a social app for sharing posts, chatting and calling.')

const privacy = `
<h1>Privacy Policy</h1><p class="muted">${cfg.appName} · Last updated ${cfg.updated}</p>
<p>${cfg.appName} is a social app for sharing posts, chatting and calling. This page explains what information the app uses, why, who else handles it, and how you can control or delete it.</p>
<h2>What we collect</h2><ul>
<li><strong>Account:</strong> your email address and password (the password is stored only as a secure hash by our sign-in provider).</li>
<li><strong>Profile:</strong> username, display name, bio, profile and cover photos, and optional About details you add (work, education, location, relationship status).</li>
<li><strong>Content you create:</strong> posts, photos, music you attach, comments, reactions, saved posts, communities and Pages you join or manage, and messages you send.</li>
<li><strong>Connections and safety:</strong> your friends and followers, accounts you block, and reports you file. Reports are reviewed by Hmm administrators, who can remove content that breaks the rules; these actions are logged.</li>
<li><strong>On your phone only:</strong> your recent searches, hidden words, display and layout choices, and Digital Wellbeing usage totals are kept on your device and are not sent to us.</li>
<li><strong>Activity status:</strong> when you were last active, so friends can see "Online". You can turn this off in Settings.</li>
<li><strong>Security:</strong> the devices you sign in from (a device name and last-seen time) so we can show your active sessions and send sign-in alerts. If you turn on two-step verification, the sign-in provider stores the verification factor.</li>
<li><strong>Support requests:</strong> messages you send from Settings → Support, with basic device information to help us fix problems.</li>
<li><strong>Calls:</strong> the call's status and technical set-up messages so the call can connect. Voice and video go directly between phones where possible. We do not record calls.</li>
<li><strong>Page messages:</strong> messages people send to a Page and the Page's replies, visible to the Page's owner and admins and to the person who wrote.</li>
<li><strong>Hmm AI:</strong> the messages you type to the assistant are sent through our server to Google's Gemini service to produce a reply. We do not store those conversations on our servers. We only count how many requests you make each day to apply a daily limit. The chat history you see is kept on your own phone, and you can clear it at any time.</li>
<li><strong>Sign-in records:</strong> when you sign in or open the app, we record your IP address and your device or browser type, for security and to stop abuse. You can see your own records in Settings → Login activity. We keep them for 90 days and then delete them. Only a Hmm administrator investigating abuse can look at another person's records, and each look is logged. We do not sell them or use them for advertising, and we do not work out your location from them.</li>
<li><strong>Safe Deal chats:</strong> when you create or join a Safe Deal, the deal title, terms, amount note and messages are stored. Every Hmm administrator is added to the deal as a mediator and can read it. Hmm does not hold or move money and cannot guarantee payment or delivery. Deal messages cannot be edited or deleted.</li>
<li><strong>Notifications:</strong> a push token that identifies your phone, and your notification preferences.</li>
</ul>
<h2>What we do not do</h2><ul>
<li>We do not show ads and we do not sell your information.</li>
<li>We do not use third-party analytics or advertising trackers in the app.</li>
<li>We do not read your contacts or location.</li></ul>
<h2>Permissions</h2><p>The Android app may ask for the camera and microphone (calls, photos, video), photos you choose to upload, and permission to show notifications. You can change each one in your phone's settings.</p>
<h2>Who handles your information</h2><ul>
<li><strong>Google Gemini</strong> writes the replies of Hmm AI. Text you send to the assistant is processed by Google under its terms for the Gemini API. On free usage tiers Google may use such content to improve its products, so do not share passwords or private secrets with the assistant.</li>
<li><strong>Supabase</strong> stores the database, sign-in, uploaded files and real-time messages.</li>
<li><strong>Google Firebase Cloud Messaging</strong> delivers push notifications. A notification's text, such as the beginning of a message, passes through Google to reach your phone.</li>
<li><strong>Google (STUN)</strong> helps two phones find each other for a call, which shares network addresses needed to connect.</li>
<li><strong>GitHub Pages</strong> hosts the app's web pages.</li></ul>
<h2>Who can see what</h2><p>Posts can be Public, Friends only or Only me, and you choose this when you post. Your profile, posts and activity are shown according to your privacy settings. People you block cannot see your posts or message you.</p>
<h2>Your choices and your data</h2><ul>
<li>Download a copy of your information: Settings → Your Information.</li>
<li>Deactivate your account (hides your profile until you come back): Settings → Account Deactivation.</li>
<li>Delete your account and data (completed after a 30-day waiting period): see <a href="${base}delete-account/">How to delete your account</a>.</li>
<li>Edit or delete individual posts and comments at any time.</li></ul>
<h2>Children</h2><p>${cfg.appName} is not meant for children under 13, and we do not knowingly collect their information. If you believe a child has an account, contact us and we will remove it.</p>
<h2>Changes</h2><p>If this policy changes, the date at the top will change. Significant changes will be announced in the app.</p>
<h2>Contact</h2><p>Questions about privacy: ${contact}.</p>`
page(['privacy'], 'Privacy Policy', privacy, 'How Hmm uses, shares and protects your information.')

page('terms', 'Terms of Service', `
<h1>Terms of Service</h1><p class="muted">${cfg.appName} · Last updated ${cfg.updated}</p>
<p>By creating an account or using ${cfg.appName} you agree to these terms. If you do not agree, please do not use the app.</p>
<h2>Your account</h2><ul><li>Give a real email address and keep your password and verification codes private.</li><li>You are responsible for what happens under your account.</li><li>One person, one account. Do not pretend to be someone else.</li></ul>
<h2>Your content</h2><ul><li>You own what you post. You allow ${cfg.appName} to store and show it to the people you choose so the app can work.</li><li>Only post things you have the right to share, including photos and music.</li><li>You can delete your posts or your whole account at any time.</li></ul>
<h2>Not allowed</h2><ul><li>Harassment, threats, hate, or sexual content involving minors.</li><li>Spam, scams, fake accounts, or trying to break into other accounts.</li><li>Malware, or anything that harms the app or other people.</li><li>Sharing other people's private information without permission.</li></ul>
<h2>Safety and enforcement</h2><p>You can block and report people and content. We may remove content, or limit or close accounts that break these terms.</p>
<h2>Service</h2><p>We work to keep ${cfg.appName} available but cannot promise it will always be error-free or uninterrupted. Features may change.</p>
<h2>Changes</h2><p>We may update these terms. Important changes will be shown in the app. Using the app after a change means you accept it.</p>
<h2>Contact</h2><p>${contact}.</p>`, 'The rules for using Hmm.')

const ui = `
<div id="app"><p class="muted">Loading…</p></div>
<noscript><p>Please turn on JavaScript to delete your account here, or email ${contact} from your registered address.</p></noscript>
<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'
const sb = createClient(${JSON.stringify(cfg.supabaseUrl)}, ${JSON.stringify(cfg.supabasePublishableKey)}, { auth: { persistSession: false, autoRefreshToken: false } })
const app = document.getElementById('app')
const h = (html) => { app.innerHTML = html }
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const msg = (t, bad) => '<p style="color:' + (bad ? '#d33' : 'var(--muted)') + '" role="alert">' + esc(t) + '</p>'
const form = 'display:grid;gap:10px;max-width:360px'
const input = 'padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg);font:inherit'
const btn = (c) => 'padding:12px 20px;border:0;border-radius:999px;font:inherit;font-weight:600;cursor:pointer;color:#fff;background:' + c

function login(note) {
  h(msg(note || '') + '<form id="f" style="' + form + '"><label>Email<br><input name="email" type="email" required autocomplete="username" style="' + input + ';width:100%"></label>' +
    '<label>Password<br><input name="password" type="password" required autocomplete="current-password" style="' + input + ';width:100%"></label>' +
    '<button style="' + btn('var(--accent)') + '">Sign in</button></form>' +
    '<p class="muted" style="font-size:.9rem">Forgot your password? Open the app, tap "Forgot password", then come back here.</p>')
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const { error } = await sb.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') })
    if (error) return login(error.message)
    mfaThenStatus()
  }
}

async function mfaThenStatus() {
  const { data } = await sb.auth.mfa.getAuthenticatorAssuranceLevel()
  if (data && data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') {
    const { data: f } = await sb.auth.mfa.listFactors()
    const factor = (f?.totp || []).find((x) => x.status === 'verified')
    if (factor) return askCode(factor.id)
  }
  status()
}

function askCode(id, note) {
  h(msg(note || 'Enter the 6-digit code from your authenticator app.') + '<form id="f" style="' + form + '"><input name="code" inputmode="numeric" maxlength="6" required style="' + input + ';letter-spacing:.3em;text-align:center"><button style="' + btn('var(--accent)') + '">Verify</button></form>')
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault()
    const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: id, code: new FormData(e.target).get('code') })
    if (error) return askCode(id, error.message)
    status()
  }
}

async function status() {
  const { data: due } = await sb.rpc('my_account_deletion')
  if (due) return scheduled(due)
  h('<p>You are signed in. Deleting your account <strong>hides your profile now</strong> and <strong>permanently deletes your account and all your data after 30 days</strong>. You can cancel any time before then by signing in here or in the app.</p>' +
    '<p><label><input type="checkbox" id="ok"> I understand and want to delete my account.</label></p>' +
    '<button id="del" style="' + btn('#d33') + '" disabled>Delete my account</button> <button id="out" style="' + btn('#6b7280') + '">Sign out</button><div id="m"></div>')
  const ok = document.getElementById('ok'), del = document.getElementById('del')
  ok.onchange = () => { del.disabled = !ok.checked }
  document.getElementById('out').onclick = async () => { await sb.auth.signOut(); login() }
  del.onclick = async () => {
    del.disabled = true
    const { data: when, error } = await sb.rpc('request_account_deletion')
    if (error) { document.getElementById('m').innerHTML = msg(error.message, true); del.disabled = false; return }
    scheduled(when)
  }
}

function scheduled(when) {
  h('<p><strong>Deletion scheduled.</strong> Your account and data will be permanently deleted on <strong>' + esc(new Date(when).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })) + '</strong>. Your profile is hidden until then.</p>' +
    '<p>Changed your mind?</p><button id="cancel" style="' + btn('var(--accent)') + '">Cancel deletion</button> <button id="out" style="' + btn('#6b7280') + '">Sign out</button><div id="m"></div>')
  document.getElementById('out').onclick = async () => { await sb.auth.signOut(); login() }
  document.getElementById('cancel').onclick = async () => {
    const { error } = await sb.rpc('cancel_account_deletion')
    if (error) return (document.getElementById('m').innerHTML = msg(error.message, true))
    status()
  }
}
login()
</script>`

page('delete-account', 'Delete your account', `
<h1>Delete your account and data</h1><p class="muted">${cfg.appName}</p>
<h2>Delete it here</h2>
<p>Sign in with your ${cfg.appName} email and password to request deletion. You can also do it in the app: <strong>Settings → Account Center → Delete account</strong>.</p>
${ui}
<h2>How it works</h2>
<ol><li><strong>Day 0:</strong> you request deletion. Your profile is hidden from everyone right away.</li>
<li><strong>Days 1–30:</strong> nothing is deleted yet. Sign in (here or in the app) and tap <em>Cancel deletion</em> to keep your account.</li>
<li><strong>After 30 days:</strong> your account is permanently deleted and the data below is removed from our database and file storage. This cannot be undone.</li></ol>
<h2>What is deleted</h2><ul>
<li>Your profile, photos, posts, comments, reactions and saved posts.</li>
<li>Your messages, call history, friends list and support requests.</li>
<li>Pages you own, and files you uploaded (photos and audio).</li>
<li>Your sign-in account.</li></ul>
<p>Copies of messages you sent that other people already received on their own phones are theirs and are not on our servers after deletion.</p>
<h2>Can't sign in?</h2>
<p>Email ${contact} from the address registered on your account with the subject "Delete my account" and your username. We will confirm the request is yours and start the same 30-day deletion.</p>
<h2>Just want a break?</h2><p>Use <strong>Settings → Account Deactivation</strong> in the app to hide your profile without deleting anything.</p>
<p><a href="${base}privacy/">Privacy Policy</a></p>`, 'Delete your Hmm account and data. Deletion completes after 30 days.')

// Home page = About page
writeFileSync(join(dist, 'index.html'), readFileSync(join(dist, 'about', 'index.html'), 'utf8'))
if (!email) console.warn('::warning title=No contact email::site.config.json has no contactEmail. App stores require a public contact address.')
console.log('Site pages written to', dist)
