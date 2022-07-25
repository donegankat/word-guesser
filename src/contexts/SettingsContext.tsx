import React from "react";
import GameConstants from "../game/constants/GameConstants";
import Cookies from "universal-cookie";

interface ISettingsContext {
	globalWordLength: number;
	setGlobalWordLength: (newWordLength: number) => void;
}

/**
 * If the user has a settings cookie, this loads the stored word length setting they've chosen.
 * Otherwise, this returns the default number of letters for the word length.
 * @returns 
 */
export const getStoredWordLengthFromCookieOrDefault = (): number => {
    const cookies = new Cookies();
    var gameSettingsCookie = cookies.get(GameConstants.SettingsCookieName);

    if (gameSettingsCookie && gameSettingsCookie.wordLength) {
        return gameSettingsCookie.wordLength;
    }

    return GameConstants.DefaultGuessLetters;
}

const defaultSettings: ISettingsContext = {
	globalWordLength: getStoredWordLengthFromCookieOrDefault(),
	setGlobalWordLength: (newWordLength: number) => {}
};

export const SettingsContext = React.createContext<ISettingsContext>(defaultSettings);