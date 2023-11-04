import { HTTPException } from 'hono/http-exception'
import type { Context, MiddlewareHandler } from 'hono'
import type { WorkerBindings } from '../interfaces/worker.interface'

export const authMiddleware = (): MiddlewareHandler => {
  return async ({ req, env }: Context<{ Bindings: WorkerBindings }>, next) => {
    const token = req.raw.headers.get('Authorization')

    if (!env.AUTH_TOKEN || env.AUTH_TOKEN.length === 0) {
      throw new HTTPException(401, {
        message: 'Please set the AUTH_TOKEN environment variable',
      })
    }

    if (token !== env.AUTH_TOKEN) {
      throw new HTTPException(401, { message: 'unauthorized' })
    }

    await next()
  }
}
