import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className = "text-3xl h-screen bg-red text-white">
      <Head>
        <title>Lightning</title>
      </Head>
      Now entering the twilight zone
    </div>
  )
}

export default Home
