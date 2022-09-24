import { Suspense, lazy } from 'react'

const HomeLazy = lazy(() => import('./Home'))

const Home = (props: any) => {
  return (
    <Suspense fallback={'loading'}>
      <HomeLazy {...props} />
    </Suspense>
  )
}

export default Home