import GameConstants from "../game/constants/GameConstants";
import Cookies from "universal-cookie";
import ISettings from "../game/interfaces/ISettings";

const cookies = new Cookies();

/**
 * If the user has a settings cookie, this loads the stored word length setting they've chosen.
 * Otherwise, this returns the default number of letters for the word length.
 * 
 * Sadly, this needs to rely on a cookie rather than something like local browser storage due to
 * the need for the server-side portion of Next.js to be able to access the stored values.
 * @returns 
 */
const getStoredWordLengthFromCookieOrDefault = (): number => {
    var gameSettingsCookie = cookies.get(GameConstants.SettingsCookieName);

    if (gameSettingsCookie && gameSettingsCookie.wordLength) {
        return gameSettingsCookie.wordLength;
    }

    return GameConstants.DefaultGuessLetters;
}

/**
 * If the user has a settings cookie, this loads the stored word minimum frequency setting they've
 * chosen. Otherwise, this returns the default word minimum frequency.
 * 
 * Sadly, this needs to rely on a cookie rather than something like local browser storage due to
 * the need for the server-side portion of Next.js to be able to access the stored values.
 * @returns 
 */
const getStoredWordMinFrequencyFromCookieOrDefault = (): number => {
	var gameSettingsCookie = cookies.get(GameConstants.SettingsCookieName);

	if (gameSettingsCookie && gameSettingsCookie.wordMinFrequency) {
		return gameSettingsCookie.wordMinFrequency;
	}

	return GameConstants.DefaultMinWordFrequency;
};

/**
 * Returns an object representing the current state of the global settings.
 * @returns 
 */
export const getGlobalSettings = (): ISettings => {
	return {
		wordLength: getStoredWordLengthFromCookieOrDefault(),
		wordMinFrequency: getStoredWordMinFrequencyFromCookieOrDefault()
	}
}

/**
 * Updates the global settings with new values.
 * @param newSettings 
 */
export const updateGlobalSettings = (newSettings: ISettings) => {
	// Update the settings in the cookie.

	// For now, strip the word frequency out of the settings cookie before we store it
	// because the Words API is broken and this option doesn't actually do anything.
	// Hopefully someday it gets fixed and I can re-implement this.
	var choppedUpCookie = {
		wordLength: newSettings.wordLength
	};
	
	cookies.set(
		GameConstants.SettingsCookieName,
		JSON.stringify(choppedUpCookie)
	);
}

/**
 * Validates whether the settings cookie exists and has valid values for each setting,
 * and returns true if so.
 * @returns 
 */
export const validateSettingsCookie = (): boolean => {
	var gameSettingsCookie = cookies.get(GameConstants.SettingsCookieName);

	if (gameSettingsCookie) {
		var cookieIsValid = true;

		if (gameSettingsCookie.wordLength) {
			// Check for any funny business and correct it if we find it.
			cookieIsValid =
				gameSettingsCookie.wordLength >= GameConstants.MinGuessLetters &&
				gameSettingsCookie.wordLength <= GameConstants.MaxGuessLetters;
		}

		if (gameSettingsCookie.wordMinFrequency && cookieIsValid) {
			// Check for any funny business and correct it if we find it.
			cookieIsValid =
				gameSettingsCookie.wordMinFrequency >= GameConstants.MinWordFrequency &&
				gameSettingsCookie.wordMinFrequency <= GameConstants.MaxWordFrequency;
		}

		if (!cookieIsValid) {
			console.log(
				"Invalid settings detected. Falling back to default settings.",
				gameSettingsCookie
			);

			updateGlobalSettings({
				wordLength: GameConstants.DefaultGuessLetters,
				wordMinFrequency: GameConstants.DefaultMinWordFrequency
			});

			return false;
		}

		// If the cookie exists and everything checks out, signal to the caller that
		// everything is a-ok.
		return true;
	}

	// If no cookie was found, no need to take any action.
	return false;
}