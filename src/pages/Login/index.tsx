import { Suspense, lazy } from 'react'

const LoginLazy = lazy(() => import('./Login'))

const Home = (props: any) => {
  return (
    <Suspense fallback={'loading'}>
      <LoginLazy {...props} />
    </Suspense>
  )
}

export default Home
