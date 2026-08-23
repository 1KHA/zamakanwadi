# Email (Mandrill) — implemented, dormant, how to activate

Built from `mdfiles/Mandrill_Implementation.md`. **Nothing sends today.** The
whole module is inert until `EMAIL_ENABLED=true`, and no existing route imports
it, so current behaviour is unchanged.

> Kept in `src/content/` rather than `mdfiles/` because `mdfiles/` is
> gitignored and therefore absent on the build server.

---

## What exists

| File | Purpose |
|---|---|
| `src/lib/email/transport.ts` | Provider selection, Mandrill HTTPS send, **`assertSent`** (§2.5) |
| `src/lib/email/templates.ts` | Bilingual ar/en branded OTP + notification templates |
| `src/lib/email/otp.ts` | `createOtp` / `verifyOtp` / `sendOtp` — hashed, expiring, attempt-limited |
| `src/lib/email/notify.ts` | `notify()` — in-app row + optional email, non-fatal (§5.2) |
| `src/lib/email/index.ts` | Public API |
| `scripts/email-check.mjs` | Pre-flight: key, domains, `MAIL_FROM` match, external-send test |
| `prisma` | `EmailOtp` model, `OtpPurpose` enum, `User.emailNotifications` flag |

Transport tiers (§2.3), resolved **per call** so switching is env-only:

| Priority | Condition | Transport |
|---|---|---|
| 1 | `EMAIL_ENABLED` not `true` | `disabled` — no-op, sends nothing |
| 2 | `MAILCHIMP_API_KEY` set | `mandrill` (HTTPS) |
| 3 | otherwise | `console` — prints to the server log (dev) |

**No SMTP tier, deliberately.** The guide keeps SMTP as tier 2 for projects
migrating *from* it; this project never had SMTP, and §2.2 says never to use it
in production anyway (PaaS hosts block ports 465/587, causing ~2-minute hangs).

---

## Activation

### 1. Verify the account *before* touching code — this is the big one

```bash
npm run email:check                    # key + domains + MAIL_FROM match
node scripts/email-check.mjs you@gmail.com   # the decisive external-send test
```

Per §3.1, a Mandrill account **without billing** only delivers to your own
verified domains. Everything looks perfect — valid key, domain Verified, DKIM
green — while every real user on gmail/outlook silently fails with
`recipient-domain-mismatch`. Testing with your own domain proves nothing. Use
an external address.

### 2. Verify the sending domain

Mandrill → Settings → Domains → add `zamakan.com`, publish SPF + DKIM (+ DMARC),
click **Test DNS Settings** until green.

`MAIL_FROM` must match a verified domain by **exact string match after the `@`**.
A verified subdomain does not authorise its parent, or vice versa:

```
Verified: zamakan.com            →  MAIL_FROM=x@zamakan.com          ✅
Verified: no-reply.zamakan.com   →  MAIL_FROM=x@zamakan.com          ❌
```

### 3. Set the environment

```bash
EMAIL_ENABLED=true
MAILCHIMP_API_KEY=md-xxxxxxxxxxxxx
MAIL_FROM=no-reply@zamakan.com     # exact verified domain
MAIL_FROM_NAME=Zamakan
```

Env changes take effect **only on a new deploy** (§2.7) — a running process
keeps the old values.

### 4. Wire it in (each of these is a separate, deliberate change)

**Notifications** — four sites currently create rows inline. `notify()` is a
drop-in, so each is a one-line swap:

```ts
// before
await prisma.notification.create({ data: { userId, title, message } });
// after
await notify({ userIds: [userId], title, message, titleAr, messageAr });
```

| Site | Event |
|---|---|
| `src/app/api/admin/bookings/route.ts` | booking approved / rejected / cancelled |
| `src/app/api/admin/purchase-requests/route.ts` | purchase approved / rejected |
| `src/app/api/admin/entitlements/route.ts` | service granted |
| `src/app/api/payments/route.ts` | payment received |

The Arabic copy is the real work (§5.3 estimates 1–2 days) — the plumbing is done.

**OTP** — nothing in the auth flow calls it yet. To enable email verification or
password reset, add routes that call `sendOtp({ email, purpose })` and then
`verifyOtp(email, purpose, code)`. Rate-limit the request endpoint with the
existing `src/lib/rateLimit.ts`, as signup and signin already do.

### 5. Verify after deploy

1. Log `describeTransport()` at startup and confirm it names `mandrill` (§2.6).
2. Trigger one real send to an **external** address.

---

## Design guarantees

- **`assertSent` (§2.5)** — the SDK *resolves* with an error object instead of
  throwing. Without this the app reports "sent" while nothing was sent, which is
  worse than the original bug because it looks fine. Covered by seven tests in
  `testapi/email-transport.test.ts`; **do not remove it in a refactor.**
- **Email failure is non-fatal for notifications (§5.2)** — a provider outage
  cannot roll back a booking approval. The in-app row is always written first.
- **OTP codes are stored hashed**, single-use, expire in 10 minutes, and lock
  out after 5 attempts, so a 6-digit code cannot be brute-forced.
- **Users have an off switch** — `User.emailNotifications`. Notifications respect
  it; OTPs bypass it, as transactional mail should.
- **Signatures are stable (§2.1/§4.3)** — changing provider later means editing
  `transport.ts` only, never a call site.

## Cost warning (§5.4)

Mandrill bills per email. OTPs are low volume; **notifications are not** — every
booking status change and payment, multiplied by users. Estimate
`notifications/day × recipients` against your credit balance before enabling
email on all four sites, and consider digests over per-event mail.

## Diagnostics

| Symptom | Cause | Fix |
|---|---|---|
| `recipient-domain-mismatch` | Demo mode, billing off | Enable billing |
| `unsigned` / `invalid-sender` | `MAIL_FROM` domain unverified / DKIM missing | Fix domain + DNS |
| `Invalid_Key` | Key wrong or truncated | Re-copy it |
| Reports success, nothing arrives | `assertSent` removed | Restore it |
| Config change had no effect | Process not restarted | Redeploy |

The reason only ever appears in the **application/stdout log**, never the
HTTP/edge router log. Test the provider directly with `npm run email:check`
rather than through the app.
