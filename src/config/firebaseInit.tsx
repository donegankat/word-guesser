import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { getAnalytics, logEvent } from "firebase/analytics";

function createFirebaseApp(config: FirebaseOptions) {
	try {
		// If the Firebase app has already been initialized, return it.
		return getApp();
	} catch {
		// Otherwise, initialize it from scratch.
		return initializeApp(config);
	}
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const firestoreDb = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);

const firebaseAnalytics =
	typeof window !== "undefined" ? getAnalytics(firebaseApp) : null;

/**
 * Logs an event to Google Analytics when the game begins.
 * @param winningWord 
 */
export const logGameStart = (winningWord: string) => {
	if (firebaseAnalytics) {
    logEvent(firebaseAnalytics, "level_start", {
			// Sadly, we can't currently pass the correct word along with the guess because these
			// analytics requests are visible in the browser's network traffic and would easily give
			// the winning word away :(
			//level_name: winningWord
		});
	}
};

/**
 * Logs an event to Google Analytics when the game ends.
 * @param winningWord 
 * @param success 
 */
export const logGameEnd = (winningWord: string, success: boolean) => {
	if (firebaseAnalytics) {
		logEvent(firebaseAnalytics, "level_end", {
			level_name: winningWord,
			success: success
		});
	}
};

export const logGuessAttempt = (winningWord: string, guess: string,	isValid: boolean) => {
	if (firebaseAnalytics) {
    logEvent(firebaseAnalytics, "level_guess", {
      // Sadly, we can't currently pass the correct word along with the guess because these
      // analytics requests are visible in the browser's network traffic and would easily give
      // the winning word away :(
			//level_name: winningWord,
			guess: guess,
			success: isValid
		});
	}
};