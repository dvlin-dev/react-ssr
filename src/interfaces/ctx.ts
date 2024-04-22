import type { Request, Response } from 'express'
import type { Context } from "koa"
import type { QueryClient } from "react-query"
import type { Store } from "@reduxjs/toolkit"

export interface ExpressContext {
  request: Request
  response: Response
}

export type FetchServerSideProps = ({
  store,
  ctx,
  queryClient,
}: {
  queryClient: QueryClient
  ctx: Context
  store: Store
}) => void
