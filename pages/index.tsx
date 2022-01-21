import type { NextPage } from 'next'
import Head from 'next/head'
import HomeLogin from '../components/homeLogin'

const Home: NextPage = () => {
  return (
    <><div className="h-12 min-w-full bg-pink-900"></div><div className="text-3xl h-screen bg-gray-800 text-white pt-2 px-96">
      <Head>
        <title>Lightning</title>
      </Head>
      <HomeLogin/>
    </div></>
  )
}

export default Home
