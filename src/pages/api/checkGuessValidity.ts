import type { NextApiRequest, NextApiResponse } from "next";
import IWord from "../../game/interfaces/IWord";
import WriteLog from "../../data/RemoteLogManager";
import { CheckWordExistsInDatabase, SaveWordToDatabase } from "../../data/WordDatabaseManager";

interface IWordApiManagerProps {
    wordToCheck: string;
}

const requestHeaderOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": process.env.WORDS_API_KEY ?? "",
        "X-RapidAPI-Host": process.env.WORDS_API_HOST ?? ""
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const props: IWordApiManagerProps = JSON.parse(req.body);
    const shouldCheckGuessValidity = process.env.CHECK_GUESS_VALIDITY && process.env.CHECK_GUESS_VALIDITY == "true";

    // To save on API/DB hits, only check validity when configuration demands it.
    if (!shouldCheckGuessValidity) {
        console.log("SKIPPING VALIDITY CHECK", props.wordToCheck);
        return res.status(200).json({ isValidGuess: true });
    }

    console.log("CHECKING GUESS", props.wordToCheck);
    WriteLog("checkGuessValidity.handler", {
        message: "Checking guess",
        wordToCheck: props.wordToCheck
    });

    // To avoid hitting the Words API and incurring charges, check to see if we've
    // seen this word before in the game's Firebase database.
    var isValidGuess = await CheckWordExistsInDatabase(props.wordToCheck);

    // We didn't manage to find it in the words we already know about, so fall back
    // to calling the actual Words API.
    if (!isValidGuess) {
        isValidGuess = await fetch(`${process.env.WORDS_API_BASE_URL}${props.wordToCheck}`, requestHeaderOptions)
            .then((response) => {
                if (response.status < 300) {
                    return response.json();
                } else {
                    throw `Invalid guess: ${props.wordToCheck}`
                }
            })
            .then((jsonResponse: IWord) => {
                // The word should already come back lower-cased, but lower-case it again
                // anyway just in case. This ensures that we can accurately compare guesses.
                jsonResponse.word = jsonResponse.word.toLocaleLowerCase();

                // If we managed to find a matching word, save it to our own DB so that we
                // never have to call the Words API again to check for it.
                SaveWordToDatabase(jsonResponse);
                return true;
            })
            .catch((err) => {
                console.error("VALIDITY RESULT ERROR", props.wordToCheck, err);
                WriteLog("checkGuessValidity.handler", {
                    message: "Invalid check",
                    wordToCheck: props.wordToCheck,
                    error: err
                });
                return false;
            });
    }

    return res.status(200).json({isValidGuess: isValidGuess});
};

export default handler;