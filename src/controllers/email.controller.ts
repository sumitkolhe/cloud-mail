import { HTTPException } from 'hono/http-exception'
import { EmailService } from '../services/email.service'
import type { Context } from 'hono'

export class EmailController {
  private emailService: EmailService

  constructor() {
    this.emailService = new EmailService()
  }

  sendEmail = async (ctx: Context) => {
    const emailBody = await ctx.req.json()

    try {
      const response = await this.emailService.sendEmail(emailBody, ctx.env)

      return ctx.json(response)
    } catch (error) {
      throw new HTTPException(400, { message: error.message })
    }
  }
}
