/**
 * Transactional email providers.
 *
 *   EMAIL_PROVIDER=resend  HTTPS API; needs RESEND_API_KEY, RESEND_FROM_EMAIL, QUOTE_INBOX_EMAIL
 *   EMAIL_PROVIDER=log     development only: prints the message to the server console
 *
 * If EMAIL_PROVIDER is unset but Resend variables are present, Resend is used.
 * Artwork is never attached; staff receive expiring links instead.
 */
export type MailMessage = { to: string; subject: string; text: string; replyTo?: string };

export interface Mailer {
  readonly name: string;
  /** Status recorded on the quote: "sent" for real delivery, "logged" for the development sink. */
  readonly resultStatus: "sent" | "logged";
  send(message: MailMessage): Promise<void>;
}

export type MailConfig = { mailer: Mailer; from: string; inbox: string };

export function resendMailer(key: string, from: string, fetchImpl: typeof fetch = fetch): Mailer {
  return {
    name: "resend",
    resultStatus: "sent",
    async send(message) {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, ...(message.replyTo ? { reply_to: message.replyTo } : {}) }),
      });
      if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    },
  };
}

export function logMailer(): Mailer {
  return {
    name: "log",
    resultStatus: "logged",
    async send(message) {
      console.info(`\n[mail:log] To: ${message.to}\n[mail:log] Subject: ${message.subject}\n${message.text}\n`);
    },
  };
}

export function resolveMailer(env: NodeJS.ProcessEnv = process.env): MailConfig | null {
  const provider = env.EMAIL_PROVIDER?.trim().toLowerCase();
  const key = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  const inbox = env.QUOTE_INBOX_EMAIL?.trim();

  if (provider === "log") {
    if (env.NODE_ENV === "production") return null;
    return { mailer: logMailer(), from: from || "dev@localhost", inbox: inbox || "staff@localhost" };
  }
  if (provider === "resend" || (!provider && key)) {
    if (!key || !from || !inbox) return null;
    return { mailer: resendMailer(key, from), from, inbox };
  }
  return null;
}
