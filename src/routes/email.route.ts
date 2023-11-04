import { Hono } from 'hono'
import { EmailController } from '../controllers/email.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validationMiddleware } from '../middleware/validation.middleware'
import type { Routes } from '../interfaces/route.interface'

export class EmailRoute implements Routes {
  public router: Hono
  public emailController = new EmailController()
  public path = '/email'

  constructor() {
    this.router = new Hono()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(),
      authMiddleware(),
      this.emailController.sendEmail,
    )
  }
}
