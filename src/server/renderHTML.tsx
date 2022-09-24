import React, { ReactNode } from 'react'

import { Context } from 'koa'
import { matchRoutes, RouteMatch } from 'react-router'
import { dehydrate, QueryClient } from 'react-query'
import routes from '../routes'
import getReduxStore from '../store'
import App from '../App'

/**
 * 处理异步数据的服务端渲染。
 * @param matchedRoutes 服务端和 router 匹配到的路由
 * @param ctx koa context
 * @returns
 */
const setInitialDataToStore = async (
  matchedRoutes: RouteMatch[] | null,
  ctx: Context
) => {
  const queryClient = new QueryClient()
  const store = getReduxStore({})
  if (matchedRoutes)
    await Promise.allSettled(
      matchedRoutes.map((item) => {
        return Promise.resolve(
          (item.route.element as any)?.loadData?.({
            store,
            ctx,
            queryClient,
          }) ?? null
        )
      })
    )

  return { store, queryClient }
}

/**
 * 将 redux、react-query 在服务端的数据注入到 APP 中,在客户端进行脱水
 * @param ctx koa context
 * @param staticContext 找不到路由时，做 NOT_FOUND 处理
 * @returns
 */
const renderHTML = async (
  ctx: Context,
  staticContext: { NOT_FOUND: boolean }
) => {
  let markup: null | ReactNode = null

  const matchedRoutes = matchRoutes(routes, ctx.request.path)

  const { store, queryClient } = await setInitialDataToStore(matchedRoutes, ctx)
  const dehydratedState = dehydrate(queryClient)
  if (!matchedRoutes) staticContext.NOT_FOUND = true
  const helmetContext = {}

  try {
    markup = (
      <App
        store={store}
        isServer
        location={ctx.request.path}
        dehydratedState={dehydratedState}
        preloadedState={store.getState()}
        helmetContext={helmetContext}
      />
    )
  } catch (error) {
    console.log('renderHTML 70,', error)
  }

  return {
    markup,
    queryClient,
    helmetContext,
    dehydratedState,
    state: store.getState(),
  }
}

export default renderHTML
