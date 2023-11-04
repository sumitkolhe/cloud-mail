import { App } from './app'
import { EmailRoute } from './routes/email.route'

const app = new App([new EmailRoute()])

export default app.getApp()
