import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Routes } from './interfaces/route.interface'
import type { WorkerBindings } from './interfaces/worker.interface'

export class App {
  private app: Hono<{ Bindings: WorkerBindings }>

  constructor(routes: Routes[]) {
    this.app = new Hono<{ Bindings: WorkerBindings }>()

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeRouteFallback()
    this.initializeErrorHandlers()
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.route('/api', route.router)
    })

    this.app.get('/', (ctx) => {
      return ctx.redirect('https://github.com/sumitkolhe/clouded')
    })
  }

  private initializeMiddlewares() {
    this.app.use('*', cors())
  }

  private initializeRouteFallback() {
    this.app.notFound((ctx) => {
      return ctx.json({ success: false, message: 'Not Found' }, 404)
    })
  }

  private initializeErrorHandlers() {
    this.app.onError((err, ctx) => {
      console.error(err)

      return ctx.json({ success: false, message: err.message }, 500)
    })
  }

  public getApp() {
    return this.app
  }
}
