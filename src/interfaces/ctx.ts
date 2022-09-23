import type { Request, Response } from 'express'

export interface ExpressContext {
  request: Request
  response: Response
}
