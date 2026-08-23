import mailchimpTransactional, {
  type MandrillClient,
  type MandrillSendResponse,
  type MandrillApiError,
} from '@mailchimp/mailchimp_transactional';

/**
 * Outbound email transport.
 *
 * Implements mdfiles/Mandrill_Implementation.md:
 *  - §2.2  HTTPS API only, never SMTP (PaaS hosts block ports 465/587)
 *  - §2.3  transport chosen per call, so switching is env-only
 *  - §2.4  lazily-built client, so this module imports without credentials
 *  - §2.5  assertSent() — the SDK RESOLVES on failure instead of throwing
 *  - §2.6  log the real reason and the active transport
 *
 * Deviation from §2.3, deliberate: the guide keeps Gmail SMTP as tier 2 for
 * projects migrating *from* SMTP. This project has never had SMTP, so adding
 * nodemailer would mean a dependency that exists only to be unused — and §2.2
 * says never to send over SMTP in production anyway. Tiers here are
 * disabled → mandrill → console.
 */

export type EmailTransport = 'disabled' | 'mandrill' | 'console';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional Mandrill tags, useful for filtering in the activity view. */
  tags?: string[];
}

export interface EmailResult {
  transport: EmailTransport;
  /** False when the transport is dormant — not an error. */
  sent: boolean;
}

function envFlag(name: string): boolean {
  const raw = process.env[name];
  return raw === 'true' || raw === '1';
}

/**
 * Master switch. Everything stays dormant until EMAIL_ENABLED is turned on,
 * so this module can ship without touching any existing behaviour.
 */
export function isEmailEnabled(): boolean {
  return envFlag('EMAIL_ENABLED');
}

/** §2.3 — resolved per call, never cached at module load. */
export function activeProvider(): EmailTransport {
  if (!isEmailEnabled()) return 'disabled';
  if (process.env.MAILCHIMP_API_KEY) return 'mandrill';
  return 'console';
}

/** §2.4 — build lazily so importing this file never requires credentials. */
let client: MandrillClient | null = null;
function getMandrill(): MandrillClient {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) throw new Error('MAILCHIMP_API_KEY is not set');
  if (!client) client = mailchimpTransactional(key);
  return client;
}

/** Test seam: drop the memoised client so a new key takes effect. */
export function __resetMandrillClient() {
  client = null;
}

/**
 * §2.5 — CRITICAL. @mailchimp/mailchimp_transactional returns an error object
 * rather than throwing, so a naive `await` reports success when nothing was
 * sent. Handles all three failure shapes: API error, AxiosError with the real
 * payload nested at response.data, and per-recipient rejection.
 *
 * PRESERVE THIS IF THIS FILE IS EVER REFACTORED — losing it reintroduces
 * silent failure, which is worse than the original bug because it looks fine.
 */
export function assertSent(response: MandrillSendResponse): void {
  // a) HTTP-level failure (bad key, 5xx) — payload nested inside an AxiosError
  const asRecord = response as { response?: { data?: MandrillApiError }; status?: string };
  const apiErr: MandrillApiError | null =
    asRecord?.response?.data ??
    (asRecord?.status === 'error' ? (response as MandrillApiError) : null);

  if (apiErr?.status === 'error') {
    throw new Error(`Mandrill ${apiErr.name}: ${apiErr.message}`);
  }
  if ((response as { name?: string })?.name === 'AxiosError') {
    throw new Error(`Mandrill request failed: ${(response as { message?: string }).message}`);
  }

  // b) per-recipient rejection
  const r = Array.isArray(response) ? response[0] : null;
  if (!r) {
    throw new Error('Unexpected response: ' + JSON.stringify(response).slice(0, 200));
  }
  if (r.status === 'rejected' || r.status === 'invalid') {
    // §Diagnostics: 'recipient-domain-mismatch' means the account is still in
    // demo mode (billing not enabled) — it is not a code or DNS problem.
    throw new Error(`Mandrill ${r.status}: ${r.reject_reason}`);
  }
}

async function sendViaMandrill(payload: EmailPayload): Promise<void> {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error('MAIL_FROM is not set');

  const response = await getMandrill().messages.send({
    message: {
      // §1/§2.7: must match a verified sending domain EXACTLY. A verified
      // subdomain does not authorise its parent, or vice versa.
      from_email: from,
      from_name: process.env.MAIL_FROM_NAME || 'Zamakan',
      to: [{ email: payload.to, type: 'to' }],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      auto_text: false,
      track_opens: false,
      track_clicks: false,
      ...(payload.tags ? { tags: payload.tags } : {}),
    },
  });

  assertSent(response);
}

/**
 * Single outbound path for the whole app. Every higher-level helper
 * (OTP, notifications) funnels through here.
 *
 * Throws on genuine send failure so callers can decide; notification callers
 * deliberately swallow it (§5.2) while OTP callers surface it.
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const provider = activeProvider();

  if (provider === 'disabled') {
    return { transport: 'disabled', sent: false };
  }

  if (provider === 'console') {
    console.log(
      `[email] (console transport) to=${payload.to} subject="${payload.subject}"\n${payload.text}`
    );
    return { transport: 'console', sent: true };
  }

  try {
    await sendViaMandrill(payload);
    return { transport: 'mandrill', sent: true };
  } catch (err: unknown) {
    // §2.6 — log the real reason; callers otherwise collapse this into a
    // generic failure that is undiagnosable in production.
    const detail =
      err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err);
    console.error(`[email] send to ${payload.to} failed via ${provider}: ${detail}`);
    throw err instanceof Error ? err : new Error(detail);
  }
}

/**
 * §2.6 — a misconfigured deploy looks identical to a working one until a user
 * fails to get a code. Call this once at startup to name the transport.
 */
export function describeTransport(): string {
  const provider = activeProvider();
  if (provider === 'mandrill') {
    return `mandrill (from ${process.env.MAIL_FROM ?? '<MAIL_FROM unset!>'})`;
  }
  if (provider === 'console') {
    return 'console (EMAIL_ENABLED=true but MAILCHIMP_API_KEY unset)';
  }
  return 'disabled (set EMAIL_ENABLED=true to activate)';
}
