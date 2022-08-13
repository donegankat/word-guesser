const GameConstants = {
	MaxGuesses: 6,
	DefaultGuessLetters: 5,
	MinGuessLetters: 4,
	MaxGuessLetters: 10,

	// The Rapid API documentation claims that the frequency range is from 1.74 to 8.03, but
	// this appears to be a lie according to both https://www.wordsapi.com/docs/#frequency
	// and from simply testing the API using extremely common words. The actual range is more
	// like ~1 to ~7.5-ish
	DefaultMinWordFrequency: 4.5,
	MinWordFrequency: 1,
	MaxWordFrequency: 8,

	SettingsCookieName: "gameSettings"
};

export default GameConstants;