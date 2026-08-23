import { prisma } from '@/lib/prisma';
import { sendEmail } from './transport';
import { renderNotificationEmail, type Locale } from './templates';

/**
 * Single entry point for user notifications (§5.2).
 *
 * Creates the in-app Notification row exactly as the existing inline calls do,
 * and — once EMAIL_ENABLED is on — also emails it. Designed as a drop-in for
 * the four current `prisma.notification.create(...)` sites so activating email
 * later is one edit per site rather than a rewrite:
 *
 *   await prisma.notification.create({ data: { userId, title, message } });
 *   await notify({ userIds: [userId], title, message });
 *
 * Three properties §5.2 insists on, all implemented here:
 *  1. Email failure is NON-FATAL — a provider outage must never roll back a
 *     booking approval or a payment.
 *  2. Bilingual copy is rendered server-side (emails have no frontend).
 *  3. Users have an off switch (User.emailNotifications); transactional OTPs
 *     bypass it, notifications respect it.
 */

export interface NotifyParams {
  userIds: string[];
  /** English copy — also what the in-app notification stores today. */
  title: string;
  message: string;
  /** Arabic copy for the email; falls back to the English text if omitted. */
  titleAr?: string;
  messageAr?: string;
  /** Which language to send the email in. */
  locale?: Locale;
  /** Set false for purely in-app notifications. */
  email?: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotifyResult {
  created: number;
  emailed: number;
}

export async function notify(params: NotifyParams): Promise<NotifyResult> {
  const {
    userIds,
    title,
    message,
    titleAr,
    messageAr,
    locale = 'ar',
    email = true,
    actionUrl,
    actionLabel,
  } = params;

  let created = 0;
  let emailed = 0;

  for (const userId of userIds) {
    // The in-app row is the source of truth and must always be written.
    await prisma.notification.create({ data: { userId, title, message } });
    created += 1;

    if (!email) continue;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, emailNotifications: true },
      });

      // §5.2 point 3 — respect the opt-out.
      if (!user?.email || !user.emailNotifications) continue;

      const useArabic = locale === 'ar';
      const rendered = renderNotificationEmail({
        title: useArabic ? titleAr ?? title : title,
        message: useArabic ? messageAr ?? message : message,
        locale,
        name: user.name,
        actionUrl,
        actionLabel,
      });

      const result = await sendEmail({
        to: user.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        tags: ['notification'],
      });
      if (result.sent) emailed += 1;
    } catch (err: unknown) {
      // §5.2 point 1 — swallow, never propagate. The business operation that
      // triggered this notification has already succeeded.
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`[email] notification to user ${userId} failed: ${detail}`);
    }
  }

  return { created, emailed };
}
