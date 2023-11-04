import { HTTPException } from 'hono/http-exception'
import { emailSchema } from '../helpers/schema'
import type { Context, MiddlewareHandler } from 'hono'
import type { WorkerBindings } from '../interfaces/worker.interface'

export const validationMiddleware = (): MiddlewareHandler => {
  return async ({ req }: Context<{ Bindings: WorkerBindings }>, next) => {
    const payload = await req.json()

    const result = emailSchema.safeParse(payload)

    if (!result.success) {
      throw new HTTPException(400, {
        message: result.error.issues.map((issue) => issue.message).join(', '),
      })
    }

    await next()
  }
}
