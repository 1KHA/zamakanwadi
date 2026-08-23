/**
 * Outbound email for Zamakan — Mandrill (Mailchimp Transactional) over HTTPS.
 * Implemented from mdfiles/Mandrill_Implementation.md.
 *
 * DORMANT BY DEFAULT. With EMAIL_ENABLED unset, every function here is a
 * no-op that sends nothing, so importing or calling it cannot affect existing
 * behaviour. See mdfiles/EMAIL_SETUP.md for the activation steps.
 */

export {
  sendEmail,
  activeProvider,
  isEmailEnabled,
  describeTransport,
  assertSent,
  __resetMandrillClient,
  type EmailTransport,
  type EmailPayload,
  type EmailResult,
} from './transport';

export {
  renderOtpEmail,
  renderNotificationEmail,
  type Locale,
  type RenderedEmail,
} from './templates';

export {
  sendOtp,
  createOtp,
  verifyOtp,
  generateOtpCode,
  purgeExpiredOtps,
  OTP_LENGTH,
  OTP_TTL_MINUTES,
  OTP_MAX_ATTEMPTS,
  type OtpPurpose,
  type CreateOtpResult,
  type VerifyOtpResult,
} from './otp';

export { notify, type NotifyParams, type NotifyResult } from './notify';
