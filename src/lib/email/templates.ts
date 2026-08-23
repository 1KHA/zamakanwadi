/**
 * Bilingual (ar/en) branded email templates.
 *
 * §5.2 point 2: emails have no frontend, so text must be rendered server-side
 * rather than relying on translation keys the way in-app notifications do.
 *
 * Inline styles only — email clients strip <style> blocks and ignore most
 * modern CSS. Arabic renders RTL via dir on the wrapper.
 */

export type Locale = 'ar' | 'en';

const BRAND = {
  primary: '#9e1c45',
  secondary: '#e2a026',
  dark: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#f6f7f9',
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const COPY = {
  brandName: { ar: 'زمكان', en: 'Zamakan' },
  footerNote: {
    ar: 'هذه رسالة آلية من منصة زمكان، يرجى عدم الرد عليها.',
    en: 'This is an automated message from Zamakan. Please do not reply.',
  },
  otpSubject: { ar: 'رمز التحقق الخاص بك', en: 'Your verification code' },
  otpHeading: { ar: 'رمز التحقق', en: 'Verification code' },
  otpIntro: {
    ar: 'استخدم الرمز التالي لإكمال العملية:',
    en: 'Use the following code to complete your request:',
  },
  otpExpiry: {
    ar: (m: number) => `ينتهي هذا الرمز خلال ${m} دقائق.`,
    en: (m: number) => `This code expires in ${m} minutes.`,
  },
  otpIgnore: {
    ar: 'إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.',
    en: "If you didn't request this code, you can safely ignore this email.",
  },
  greeting: { ar: 'مرحباً', en: 'Hello' },
  unsubscribeNote: {
    ar: 'يمكنك إيقاف إشعارات البريد الإلكتروني من لوحة التحكم الخاصة بك.',
    en: 'You can turn off email notifications from your dashboard.',
  },
} as const;

/** Shared branded shell. */
function shell(locale: Locale, bodyHtml: string, opts: { showPreferences?: boolean } = {}): string {
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';
  const font = isRTL
    ? "'Segoe UI', Tahoma, Arial, sans-serif"
    : "'Segoe UI', Helvetica, Arial, sans-serif";

  return `<!doctype html>
<html dir="${dir}" lang="${locale}">
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:${font};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:${BRAND.primary};padding:20px 28px;text-align:${align};">
            <span style="color:#ffffff;font-size:20px;font-weight:bold;">${COPY.brandName[locale]}</span>
          </td>
        </tr>
        <tr>
          <td dir="${dir}" style="padding:28px;text-align:${align};color:${BRAND.dark};font-size:15px;line-height:1.7;">
${bodyHtml}
          </td>
        </tr>
        <tr>
          <td dir="${dir}" style="padding:16px 28px 24px;text-align:${align};border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-size:12px;line-height:1.6;">
            ${COPY.footerNote[locale]}${
              opts.showPreferences ? `<br/>${COPY.unsubscribeNote[locale]}` : ''
            }
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/** One-time passcode email. */
export function renderOtpEmail(params: {
  code: string;
  locale: Locale;
  expiresInMinutes: number;
  name?: string | null;
}): RenderedEmail {
  const { code, locale, expiresInMinutes, name } = params;
  const greeting = name ? `${COPY.greeting[locale]} ${escapeHtml(name)}،` : '';

  const bodyHtml = `
            ${greeting ? `<p style="margin:0 0 12px;">${greeting}</p>` : ''}
            <h1 style="margin:0 0 12px;font-size:20px;color:${BRAND.primary};">${COPY.otpHeading[locale]}</h1>
            <p style="margin:0 0 20px;">${COPY.otpIntro[locale]}</p>
            <div style="margin:0 0 20px;padding:16px;background:${BRAND.bg};border:1px dashed ${BRAND.border};border-radius:12px;text-align:center;">
              <span dir="ltr" style="font-size:32px;font-weight:bold;letter-spacing:8px;color:${BRAND.dark};">${escapeHtml(code)}</span>
            </div>
            <p style="margin:0 0 8px;color:${BRAND.muted};">${COPY.otpExpiry[locale](expiresInMinutes)}</p>
            <p style="margin:0;color:${BRAND.muted};">${COPY.otpIgnore[locale]}</p>`;

  const text = [
    greeting,
    COPY.otpIntro[locale],
    code,
    COPY.otpExpiry[locale](expiresInMinutes),
    COPY.otpIgnore[locale],
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    subject: `${COPY.otpSubject[locale]} — ${COPY.brandName[locale]}`,
    html: shell(locale, bodyHtml),
    text,
  };
}

/** Generic notification email (booking approved, payment received, …). */
export function renderNotificationEmail(params: {
  title: string;
  message: string;
  locale: Locale;
  name?: string | null;
  actionUrl?: string;
  actionLabel?: string;
}): RenderedEmail {
  const { title, message, locale, name, actionUrl, actionLabel } = params;
  const align = locale === 'ar' ? 'right' : 'left';
  const greeting = name ? `${COPY.greeting[locale]} ${escapeHtml(name)}،` : '';

  const button =
    actionUrl && actionLabel
      ? `<p style="margin:24px 0 0;text-align:${align};">
              <a href="${escapeHtml(actionUrl)}" style="display:inline-block;padding:12px 24px;background:${BRAND.primary};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold;">${escapeHtml(actionLabel)}</a>
            </p>`
      : '';

  const bodyHtml = `
            ${greeting ? `<p style="margin:0 0 12px;">${greeting}</p>` : ''}
            <h1 style="margin:0 0 12px;font-size:20px;color:${BRAND.primary};">${escapeHtml(title)}</h1>
            <p style="margin:0;white-space:pre-line;">${escapeHtml(message)}</p>
            ${button}`;

  const text = [greeting, title, message, actionUrl ? `${actionLabel ?? ''}: ${actionUrl}` : '']
    .filter(Boolean)
    .join('\n\n');

  return {
    subject: `${title} — ${COPY.brandName[locale]}`,
    // Notifications are not transactional-critical, so they show the
    // preference note (§5.2 point 3). OTP emails deliberately do not.
    html: shell(locale, bodyHtml, { showPreferences: true }),
    text,
  };
}
