import type { NextApiRequest, NextApiResponse } from "next";
import { TestWord_Deice } from "../../game/constants/TestWords";
import IWord from "../../game/interfaces/IWord";
import { wordsApiConfig } from "../../config/wordsApiConfig";
import {
    SaveWordToDatabase,
    LoadRandomWordFromDatabase,
} from "../../data/WordDatabaseManager";
import WriteLog from "../../data/RemoteLogManager";

interface IWordApiManagerProps {
    wordLength: number;
}

const isDebugMode = process.env.IS_DEBUG_MODE;
const shouldLoadDebugFromRemote = process.env.LOAD_DEBUG_FROM_REMOTE_DB;
const apiUrl = wordsApiConfig.baseUrl;

const requestHeaderOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": process.env.WORDS_API_KEY ?? "",
        "X-RapidAPI-Host": wordsApiConfig.host,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse<IWord>) => {
    const props: IWordApiManagerProps = JSON.parse(req.body);

    console.log("API", props, props.wordLength, isDebugMode);
    WriteLog({
        message: "API",
        props: props,
        key: process.env.WORDS_API_KEY?.substring(0, 3),
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
            letters: props.wordLength,
            hasDetails: "definitions,synonyms,antonyms",
            syllablesMin: 1,
        };

        var encodedQueryKeyValuePairs: string[] = [];
        Object.entries(queryParams).forEach((param) => {
            encodedQueryKeyValuePairs.push(
                `${param[0]}=${encodeURIComponent(param[1])}`
            );
        });

        const queryString = encodedQueryKeyValuePairs.join("&");

        winningWord = await fetch(`${apiUrl}?${queryString}`, requestHeaderOptions)
            .then((response) => response.json())
            .then((jsonResponse: IWord) => {
                // The word should already come back lower-cased, but lower-case it again
                // anyway just in case. This ensures that we can accurately compare guesses.
                jsonResponse.word = jsonResponse.word.toLocaleLowerCase();
                return jsonResponse;
            })
            .catch((err) => {
                console.error(err);
                WriteLog(err);
                throw err;
            });

        // Save the word to the DB for future use.
        await SaveWordToDatabase(winningWord);
    }

    res.status(200).json(winningWord);
};

export default handler;