#!/usr/bin/env node
/**
 * Mandrill pre-flight check. Run this BEFORE wiring email into any flow —
 * per Mandrill_Implementation.md §3.1, demo mode is the failure that looks
 * like a code or DNS bug and is neither.
 *
 * Usage:
 *   node scripts/email-check.mjs                      # key + domains only
 *   node scripts/email-check.mjs you@gmail.com        # + real external send
 *
 * Reads MAILCHIMP_API_KEY / MAIL_FROM / MAIL_FROM_NAME from .env.local or .env.
 */
import { readFileSync, existsSync } from 'fs';

// Minimal .env loader so this runs without extra deps.
for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const KEY = process.env.MAILCHIMP_API_KEY;
const FROM = process.env.MAIL_FROM;
const FROM_NAME = process.env.MAIL_FROM_NAME || 'Zamakan';
const recipient = process.argv[2];

const api = async (path, body) => {
  const res = await fetch(`https://mandrillapp.com/api/1.0/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, ...body }),
  });
  return res.json();
};

if (!KEY) {
  console.error('MAILCHIMP_API_KEY is not set (.env.local, .env, or the environment).');
  process.exit(1);
}

// ---- §1.2 key validity -----------------------------------------------------
console.log('1. Validating API key...');
const info = await api('users/info.json');
if (info?.status === 'error') {
  console.error(`   FAIL  ${info.name}: ${info.message}`);
  if (info.name === 'Invalid_Key') console.error('   → Re-copy the key; it is wrong or truncated.');
  process.exit(1);
}
console.log(`   OK    username=${info.username} reputation=${info.reputation} hourly_quota=${info.hourly_quota}`);

// ---- §3.2 verified sending domains ----------------------------------------
console.log('\n2. Verified sending domains...');
const domains = await api('senders/domains.json');
if (!Array.isArray(domains) || domains.length === 0) {
  console.log('   (none) → add your domain in Mandrill → Settings → Domains');
} else {
  for (const d of domains) {
    const ok = d.spf?.valid && d.dkim?.valid;
    console.log(
      `   ${ok ? 'OK   ' : 'CHECK'} ${d.domain}  spf=${!!d.spf?.valid} dkim=${!!d.dkim?.valid} verified=${!!d.verified_at}`
    );
  }
}

// ---- §1/§2.7 from-domain must match EXACTLY --------------------------------
console.log('\n3. MAIL_FROM vs verified domains...');
if (!FROM) {
  console.log('   MAIL_FROM is not set — required before sending.');
} else {
  const fromDomain = FROM.split('@')[1];
  const match = Array.isArray(domains) && domains.some((d) => d.domain === fromDomain);
  console.log(
    match
      ? `   OK    ${FROM} matches verified domain "${fromDomain}"`
      : `   FAIL  "${fromDomain}" is not a verified sending domain.\n` +
        '         A verified subdomain does NOT authorise its parent (or vice versa).'
  );
}

// ---- §3.1 the decisive test: can it reach an EXTERNAL address? -------------
if (!recipient) {
  console.log('\n4. External send test skipped.');
  console.log('   Re-run with a real external address to check for demo mode:');
  console.log('   node scripts/email-check.mjs you@gmail.com');
  process.exit(0);
}

console.log(`\n4. Sending a real test email to ${recipient}...`);
const sendRes = await api('messages/send.json', {
  message: {
    from_email: FROM,
    from_name: FROM_NAME,
    to: [{ email: recipient, type: 'to' }],
    subject: 'Zamakan — Mandrill external test',
    text: 'If you received this, Mandrill can deliver to external recipients.',
  },
});

if (sendRes?.status === 'error') {
  console.error(`   FAIL  ${sendRes.name}: ${sendRes.message}`);
  process.exit(1);
}

const r = Array.isArray(sendRes) ? sendRes[0] : null;
if (!r) {
  console.error('   FAIL  unexpected response:', JSON.stringify(sendRes).slice(0, 200));
  process.exit(1);
}

console.log(`   status=${r.status}${r.reject_reason ? ` reject_reason=${r.reject_reason}` : ''}`);
if (r.status === 'sent' || r.status === 'queued') {
  console.log('   OK    Billing is active — safe to enable EMAIL_ENABLED=true.');
} else if (r.reject_reason === 'recipient-domain-mismatch') {
  console.error('   FAIL  Account is still in DEMO MODE (billing not enabled).');
  console.error('         It can only deliver to your own verified domains, so every');
  console.error('         real user on gmail/outlook will silently fail. Enable billing first.');
  process.exit(1);
} else {
  console.error(`   FAIL  rejected: ${r.reject_reason}`);
  process.exit(1);
}
