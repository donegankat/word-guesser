import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import WriteLog from "../data/RemoteLogManager";
import { validateSettingsCookie } from "../contexts/SettingsContext";
import {
	BulkUpdateDocuments,
	LoadRandomWordFromDatabase,
	SaveWordToDatabase
} from "../data/WordDatabaseManager";
import GameConstants from "../game/constants/GameConstants";
import { TestWord_Deice } from "../game/constants/TestWords";
import { Game } from "../game/Game";
import IWord from "../game/interfaces/IWord";
import Router, { useRouter } from "next/router";
import Cookies from 'universal-cookie';
import LoadingOverlay from "../game/LoadingOverlay";

function Index({ winningWord }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

	/**
	 * Keep track of the router loading state so that we can show
	 * a loading indicator while the server loads data.
	 */
	React.useEffect(() => {
		const loadStart = () => {
			setLoading(true);
		};

		const loadEnd = () => {
			setLoading(false);
		};

		Router.events.on("routeChangeStart", loadStart);
		Router.events.on("routeChangeComplete", loadEnd);
		Router.events.on("routeChangeError", loadEnd);

		return () => {
			Router.events.off("routeChangeStart", loadStart);
			Router.events.off("routeChangeComplete", loadEnd);
			Router.events.off("routeChangeError", loadEnd);
		};
	}, []);

	const cookies = new Cookies();

	/**
	 * Watches for changes in the cookies and refreshes the game when the settings change.
	 */
	const handleSettingsCookieChanged = () => {
		if (validateSettingsCookie()) {
			// Only proceed to reloading the game with the new settings if everything checked out.
			router.replace(router.asPath);
		}
	}

	cookies.addChangeListener(handleSettingsCookieChanged);

	return (
		<div>
			<Head>
				<title>Word Guesser</title>
				<meta name="description" content="Guess the word based on clues" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />
			</Head>

			<main className="main">
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<LoadingOverlay isLoading={loading} />
				<Game winningWord={winningWord} />
			</main>
		</div>
	);
}

/**
 * This happens on the server-side, so this API request isn't visible to the end-user.
 * @returns
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
	// Default to loading the hardcoded default word frequency and number of letters per
	// guess word, but check to see whether the user has selected a different option in
	// the settings by reading the "gameSettings" cookie.
	var wordLengthToLoad = GameConstants.DefaultGuessLetters;
	var wordMinFrequencyToLoad = GameConstants.DefaultMinWordFrequency;
	const settingsCookieName = GameConstants.SettingsCookieName;

	if (context.req.cookies && context.req.cookies[settingsCookieName]) {
		var rawCookie = context.req.cookies[settingsCookieName];
		var gameSettings = rawCookie ? JSON.parse(rawCookie) : undefined;
		var wordLengthFromSettings =
			gameSettings && gameSettings.wordLength
				? parseInt(gameSettings.wordLength)
				: -1;

		// If the user has chosen a different word length to play with, use that instead.
		if (wordLengthFromSettings > 0) {
			wordLengthToLoad = wordLengthFromSettings;
		}

		var wordMinFrequencyFromSettings =
			gameSettings && gameSettings.wordMinFrequency
				? parseFloat(gameSettings.wordMinFrequency)
				: -1;

		// Same for the word frequency.
		if (wordMinFrequencyFromSettings > 0) {
			wordMinFrequencyToLoad = wordMinFrequencyFromSettings;
		}
	}

	const isDebugMode = process.env.IS_DEBUG_MODE == "true";
	const shouldLoadDebugFromRemote = process.env.LOAD_DEBUG_FROM_REMOTE_DB == "true";

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
		wordLengthToLoad: wordLengthToLoad,
		wordMinFrequencyToLoad: wordMinFrequencyToLoad
	});

	var winningWord: IWord;

	// In debug mode, avoid making live API calls and running out my credit.
	if (isDebugMode || !process.env.WORDS_API_KEY) {
		if (shouldLoadDebugFromRemote) {
			// If the app is configured to do so, load a random word from the
			// DB of previously seen words.
			try {
				winningWord = await LoadRandomWordFromDatabase(wordLengthToLoad);
			} catch (err) {
				WriteLog("index.getServerSideProps", {
					err: err
				});
				throw err;
			}
		} else {
			// Otherwise, load from the hardcoded test file.
			winningWord = TestWord_Deice;
		}
	} else {
		const queryParams = {
			random: true,
			letterPattern: "^[a-z]*$",
			letters: wordLengthToLoad,
			hasDetails: "definitions,synonyms,antonyms",
			syllablesMin: 1,
			frequencymin: wordMinFrequencyToLoad
		};

		var encodedQueryKeyValuePairs: string[] = [];
		Object.entries(queryParams).forEach((param) => {
			encodedQueryKeyValuePairs.push(
				`${param[0]}=${encodeURIComponent(param[1])}`
			);
		});

		const queryString = encodedQueryKeyValuePairs.join("&");

		console.log("URL", `${process.env.WORDS_API_BASE_URL}?${queryString}`);

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