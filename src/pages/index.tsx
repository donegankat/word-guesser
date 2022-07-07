import { NextPage } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import GameApp from './GameApp';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Word Guesser</title>
        <meta name="description" content="Guess the word based on clues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className="main">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <GameApp></GameApp>
      </main>
    </div>
  )
}

export default Home;