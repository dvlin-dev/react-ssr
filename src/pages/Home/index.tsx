import { Suspense, lazy } from 'react'
import { fetchServerSideProps } from './fetchServerSideProps'

const HomeLazy = lazy(() => import('./Home'))

const Home = (props: any) => {
  return (
    <Suspense fallback={'loading'}>
      <HomeLazy {...props} />
    </Suspense>
  )
}


Home.fetchServerSideProps = fetchServerSideProps

export default Home