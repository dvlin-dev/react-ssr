import { FC } from 'react'
import Home from '@/components/Home'

import { RouteObject } from 'react-router'

const ElementEnhance = (Comp: FC) => {
  const importable = (props: any) => <Comp {...props} />

  importable.loadData = (Comp as any).loadData
  return importable
}

type IRoute = {
  path: RouteObject['path']
  element: FC
  children?: IRoute[]
}

const routes: IRoute[] = [
  {
    path: '/',
    element: Home,
  },
]

const mappedRoutes: RouteObject[] = routes.map((route) => {
  const Ele = ElementEnhance(route.element)
  const enhanceRoute: RouteObject = {
    path: route.path,
    element: <Ele />,
  }
  if (route.children) {
    enhanceRoute.children = route.children.map((child) => {
      const ChildEle = ElementEnhance(child.element)
      return { path: child.path, element: <ChildEle /> }
    })
  }
  return enhanceRoute
})

export default mappedRoutes
