/**
 * Minimal type surface for @mailchimp/mailchimp_transactional, which ships
 * no bundled TypeScript declarations.
 *
 * Note the return type of messages.send(): the SDK *resolves* with an error
 * shape instead of throwing (see Mandrill_Implementation.md §2.5), so the
 * result is deliberately typed as a union that callers must narrow via
 * assertSent(). Do not "simplify" this to MandrillSendResult[].
 */
declare module '@mailchimp/mailchimp_transactional' {
  export interface MandrillRecipient {
    email: string;
    name?: string;
    type?: 'to' | 'cc' | 'bcc';
  }

  export interface MandrillMessage {
    from_email: string;
    from_name?: string;
    to: MandrillRecipient[];
    subject: string;
    html?: string;
    text?: string;
    auto_text?: boolean;
    track_opens?: boolean;
    track_clicks?: boolean;
    headers?: Record<string, string>;
    tags?: string[];
  }

  /** Per-recipient outcome. */
  export interface MandrillSendResult {
    email: string;
    status: 'sent' | 'queued' | 'scheduled' | 'rejected' | 'invalid';
    reject_reason?: string | null;
    _id?: string;
  }

  /** API-level error the SDK resolves with rather than throwing. */
  export interface MandrillApiError {
    status: 'error';
    code: number;
    name: string;
    message: string;
  }

  /** An AxiosError the SDK resolves with; real payload at response.data. */
  export interface MandrillAxiosError {
    name: string;
    message: string;
    response?: { data?: MandrillApiError };
  }

  export type MandrillSendResponse =
    | MandrillSendResult[]
    | MandrillApiError
    | MandrillAxiosError;

  export interface MandrillClient {
    messages: {
      send(body: { message: MandrillMessage }): Promise<MandrillSendResponse>;
    };
    users: {
      info(body?: Record<string, unknown>): Promise<unknown>;
      ping(body?: Record<string, unknown>): Promise<unknown>;
    };
  }

  export default function mailchimpTransactional(apiKey: string): MandrillClient;
}
