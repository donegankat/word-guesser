<p align="center">
    <img src="./public/logo192.png" alt="Next.js React Word Guesser Game"/>
    <h1 align="center">
        Next.js React Word Guesser Game
    </h1>
</p>
<p align="center">
    <a href="https://app.netlify.com/sites/kd-word-guesser/deploys" aria-label="Netlify Status">
        <img src="https://api.netlify.com/api/v1/badges/0c2ccd66-0f58-43a3-a70a-197834cc0f20/deploy-status" alt="Netlify Status" />        
    </a>
</p>
<hr/>

# Game Overview
This game is inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html), with a few major differences:

- This version gives you access to hints that you can use at any point during the game
- You can configure the game's options, such as being able to choose how long you want the word you're guessing to be
- You can play as many times as you like per day

You can find the deployed app live here: https://main--kd-word-guesser.netlify.app/

See the help/instructions menu in the game for more information.

# Technical Overview
- This game was written in React TypeScript and was built on the Next.js framework
- It utilizes a combination of React/Next's client-side rendering for the bulk of the user interaction and game funcitonality, plus Next.js' server-side rendering capabilities to be able to load and process data behind the scenes so as to protect API keys and other pieces of data
- The deployed version of the app linked above is hosted by Netlify, and integrates with this repository for continuous deployment
- This app utilizes Google Firebase for cloud database storage, validation, and logging

# Build & Deploy

## Prerequisites
1. Sign up for an API key for [Words API](https://www.wordsapi.com/)
2. Add the following file to your local copy of the repo in the root directory: .env.local
3. Inside of .env.local, add the following line and provide your Words API key: `WORDS_API_KEY="YOUR_API_KEY_HERE"`
4. Edit the [Firebase config settings](./src/config/firebaseConfig.tsx) and replace the `firebaseConfig` with your own Firebase account settings
5. Update the [Firebase project name](.firebaserc)
6. Install Firebase Tools: `npm install -g firebase-tools`
7. Authenticate with Firebase: `firebase login`

## Build Locally in Development Mode
Run `npm run dev` from the command line inside of the main directory to run in development mode and automatically recompile when files change.

## Build Locally in Release Mode
To build and run the app in release mode locally:
- Run `npm run build` to build in release mode.
- Then run `npm run start` to launch the release build locally.

## Build and Deploy Live to Netlify
To build and deploy a new update live to the hosted Netlify site where the app is hosted, you don't need to run any commands at all. Netlify is already automatically integrated with this repository for continuous deployment, so simply committing to this repo will automatically trigger a build and deployment to https://main--kd-word-guesser.netlify.app/.

# About and Attributions
This game and repository were created and are maintained by [Kat Donegan](https://github.com/donegankat).

This game is a hobby project inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html), and was primarily used as a way to learn new tools, patterns, and practices in addition to adding a few fun features that are missing from the original game.

The app logo was adapted from the &quot;Dice Question Mark&quot; icon by icon4yu on NounProject.com.