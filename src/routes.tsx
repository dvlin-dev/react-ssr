import { FC } from 'react'
import Home from '@/pages/Home'
import Login from '@/pages/Login'

import { RouteObject } from 'react-router'

const ElementEnhance = (Comp: FC) => {
  const importable = (props: any) => <Comp {...props} />

  importable.fetchServerSideProps = (Comp as any).fetchServerSideProps
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
  {
    path:'/login',
    element:Login
  }
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
