import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import GameConstants from "../game/constants/GameConstants";
import { Game } from "../game/Game";
import IWord from "../game/interfaces/IWord";
import MainNavbar from "../game/navbar/MainNavbar";

function Index({
	word,
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
					<Game winningWord={word} />
				</>
			</main>
		</div>
	);
}

export async function getServerSideProps() {
	console.log("GETSERVERSIDEPROPS", process.env.DEPLOY_URL);
	const bodyData = {
		wordLength: GameConstants.MaxLetters,
	};

	var word: IWord = await fetch(`${process.env.DEPLOY_URL}/api/wordsApi`, {
		method: "POST",
		body: JSON.stringify(bodyData),
	})
		.then((response) => response.json())
		.then((jsonResponse: IWord) => {
			console.log("WORD FETCHED", jsonResponse);
			return jsonResponse;
		})
		.catch((err) => {
			console.error("FAILED TO LOAD WORD", err);
			throw err;
		});

	return { props: { word } };
}

export default Index;