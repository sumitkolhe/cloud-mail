import type { Email, Recipient } from '../interfaces/email.interface'
import type { WorkerBindings } from '../interfaces/worker.interface'

export class EmailService {
  sendEmail = async (email: Email, bindings: WorkerBindings) => {
    const emailBody = this.sanitizeEmail(email, bindings)

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    })

    return {
      success: response.ok ? true : false,
      message:
        response.statusText === 'Accepted'
          ? 'email sent'
          : await response.text(),
    }
  }

  private sanitizeEmail = (email: Email, bindings: WorkerBindings) => {
    const personalizations = [
      {
        to: this.convertRecipients(email.to as Recipient[]),
        ...(bindings.DKIM_PRIVATE_KEY &&
          bindings.DKIM_DOMAIN && {
            dkim_domain: bindings.DKIM_DOMAIN,
            dkim_selector: 'mailchannels',
            dkim_private_key: bindings.DKIM_PRIVATE_KEY,
          }),
      },
    ]

    const content = [
      ...(email.text ? [{ type: 'text/plain', value: email.text }] : []),
      ...(email.html ? [{ type: 'text/html', value: email.html }] : []),
    ]

    return {
      personalizations,
      from: this.convertRecipient(email.from),
      cc: email.cc ? this.convertRecipients(email.cc) : undefined,
      bcc: email.bcc ? this.convertRecipients(email.bcc) : undefined,
      reply_to: email.replyTo
        ? this.convertRecipients(email.replyTo)[0]
        : undefined,
      subject: email.subject,
      content,
    }
  }

  convertRecipients = (recipients: Recipient | Recipient[]): Recipient[] => {
    const result = Array.isArray(recipients) ? recipients : [recipients]

    return result.map((element) => this.convertRecipient(element))
  }

  convertRecipient = (contact: Recipient): Recipient => {
    return typeof contact === 'string'
      ? { email: contact, name: undefined }
      : { email: contact.email, name: contact.name }
  }
}
