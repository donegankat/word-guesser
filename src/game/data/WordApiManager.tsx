import { TestWord_Deice } from '../constants/TestWords';
import IWord from '../interfaces/IWord';
import { wordsApiConfig } from '../../config/wordsApiConfig'
import { SaveWordToDatabase, LoadRandomWordFromDatabase } from './WordDatabaseManager';
import { Firestore } from 'firebase/firestore';

interface IWordApiManagerProps {
    wordLength: number;
    isDebugMode: boolean;
    shouldLoadDebugFromRemote: boolean;
    firestoreDb: Firestore;
}

const apiUrl = wordsApiConfig.baseUrl;

const requestHeaderOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': wordsApiConfig.apiKey,
        'X-RapidAPI-Host': wordsApiConfig.host
    }
};

export default async function LoadWord(props: IWordApiManagerProps): Promise<IWord> {
    const queryParams = {
        random: true,
        letterPattern: "^[a-z]*$",
        letters: props.wordLength,
        hasDetails: "definitions,synonyms,antonyms",
        syllablesMin: 1
    };

    var encodedQueryKeyValuePairs: string[] = [];
    Object.entries(queryParams).forEach((param) => {
        encodedQueryKeyValuePairs.push(`${param[0]}=${encodeURIComponent(param[1])}`);
    });

    const queryString = encodedQueryKeyValuePairs.join("&");

    // In debug mode, avoid making live API calls and running out my credit.
    if (props.isDebugMode) {
        if (props.shouldLoadDebugFromRemote) {
            // If the app is configured to do so, load a random word from the
            // DB of previously seen words.
            return await LoadRandomWordFromDatabase(props.firestoreDb);
        } else {
            // Otherwise, load from the hardcoded test file.
            return new Promise((resolve, reject) => {
                resolve(TestWord_Deice);
            });
        }
    } else {
        const winningWord = await fetch(`${apiUrl}?${queryString}`, requestHeaderOptions)
            .then(response => response.json())
            .then((jsonResponse: IWord) => {
                // The word should already come back lower-cased, but lower-case it again
                // anyway just in case. This ensures that we can accurately compare guesses.
                jsonResponse.word = jsonResponse.word.toLocaleLowerCase();
                console.log(jsonResponse);
                return jsonResponse;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });

        // Save the word to the DB for future use.
        await SaveWordToDatabase(props.firestoreDb, winningWord);

        return winningWord;
    }
}