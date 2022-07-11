import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import WriteLog from "../data/RemoteLogManager";
import {
	LoadRandomWordFromDatabase,
	SaveWordToDatabase
} from "../data/WordDatabaseManager";
import GameConstants from "../game/constants/GameConstants";
import { TestWord_Deice } from "../game/constants/TestWords";
import { Game } from "../game/Game";
import IWord from "../game/interfaces/IWord";
import MainNavbar from "../game/navbar/MainNavbar";

function Index({
	winningWord
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
				<>
					<MainNavbar></MainNavbar>
					<Game winningWord={winningWord} />
				</>
			</main>
		</div>
	);
}

export async function getServerSideProps() {
	const isDebugMode = process.env.IS_DEBUG_MODE;
	const shouldLoadDebugFromRemote = process.env.LOAD_DEBUG_FROM_REMOTE_DB;

	const requestHeaderOptions = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": process.env.WORDS_API_KEY ?? "",
			"X-RapidAPI-Host": process.env.WORDS_API_HOST ?? ""
		}
	};

	WriteLog("index.getServerSideProps", {
		isDebugMode: isDebugMode,
		shouldLoadDebugFromRemote: shouldLoadDebugFromRemote,
		key: process.env.WORDS_API_KEY?.substring(0, 3)
	});

	var winningWord: IWord;

	// In debug mode, avoid making live API calls and running out my credit.
	if (isDebugMode || !process.env.WORDS_API_KEY) {
		if (shouldLoadDebugFromRemote) {
			// If the app is configured to do so, load a random word from the
			// DB of previously seen words.
			winningWord = await LoadRandomWordFromDatabase();
		} else {
			// Otherwise, load from the hardcoded test file.
			winningWord = TestWord_Deice;
		}
	} else {
		const queryParams = {
			random: true,
			letterPattern: "^[a-z]*$",
			letters: GameConstants.MaxLetters,
			hasDetails: "definitions,synonyms,antonyms",
			syllablesMin: 1
		};

		var encodedQueryKeyValuePairs: string[] = [];
		Object.entries(queryParams).forEach((param) => {
			encodedQueryKeyValuePairs.push(
				`${param[0]}=${encodeURIComponent(param[1])}`
			);
		});

		const queryString = encodedQueryKeyValuePairs.join("&");

		winningWord = await fetch(
			`${process.env.WORDS_API_BASE_URL}?${queryString}`,
			requestHeaderOptions
		)
			.then((response) => response.json())
			.then((jsonResponse: IWord) => {
				// The word should already come back lower-cased, but lower-case it again
				// anyway just in case. This ensures that we can accurately compare guesses.
				jsonResponse.word = jsonResponse.word.toLocaleLowerCase();
				console.log("WORD FETCHED", jsonResponse);
				return jsonResponse;
			})
			.catch((err) => {
				console.error("FAILED TO LOAD WORD", err);
				WriteLog("index.getServerSideProps", {
					message: "Failed to load word",
					error: err
				});
				throw err;
			});

		// Save the word to the DB for future use.
		await SaveWordToDatabase(winningWord);
	}

	return { props: { winningWord } };
}

export default Index;