import { TestWord_Deice } from './constants/TestWords';
import IWord from './interfaces/IWord';

interface IWordApiManagerProps {
    wordLength: number;
    //onWordLoaded: (word: IWord) => void;
    isDebugMode: boolean;
}

const apiUrl = "https://wordsapiv1.p.rapidapi.com/words/";

const requestHeaderOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'dc818ba535mshc7f1b245ece40d0p11f50ejsnc7c6b6b374f4',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
    }
};

export default async function LoadWord(props: IWordApiManagerProps): Promise<IWord> {
    const queryParams = {
        random: true,
        letterPattern: "^[a-z]*$",
        letters: props.wordLength,
        hasDetails: "definitions,examples",
        syllablesMin: 1
    };

    var encodedQueryKeyValuePairs:string[] = [];
    Object.entries(queryParams).forEach((param) => {
        encodedQueryKeyValuePairs.push(`${param[0]}=${encodeURIComponent(param[1])}`);
    });

    const queryString = encodedQueryKeyValuePairs.join("&");
    console.log(queryString);

    // In debug mode, avoid making live API calls and running out my credit.
    if (props.isDebugMode) {
        return new Promise((resolve, reject) => {
            resolve(TestWord_Deice);
        });
    } else {
        const winningWord = await fetch(`${apiUrl}?${queryString}`, requestHeaderOptions)
                .then(response => response.json())
                .then((jsonResponse: IWord) => {
                    //setWinningWord(jsonResponse);
                    
                    //props.onWordLoaded(jsonResponse);
                    
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

        return winningWord;
    }
}

// const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': 'dc818ba535mshc7f1b245ece40d0p11f50ejsnc7c6b6b374f4',
//         'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
//     }
// };

// export default function LoadWord(props: IWordApiManagerProps) {
//     const [, setWord] = React.useState<IWord>();
//     const onWordLoadedCallback = props.onWordLoaded;
    
//     React.useEffect(() => {

//     fetch('https://wordsapiv1.p.rapidapi.com/words/?letterPattern=%5E%5Ba-z%5D*%24&letters=5&random=true&hasDetails=definitions%2Cexamples', options)
//             .then(response => response.json())
//             .then((jsonResponse: IWord) => {
//                 console.log(jsonResponse);
//                 setWord(jsonResponse);

//                 onWordLoadedCallback(jsonResponse);
//                 //return jsonResponse;
//             })
//             .catch(err => {
//                 console.error(err);
//                 throw err;
//             });
//          return () => {};
//      }, [onWordLoadedCallback]);

//     return (
//         <></>
//     );
// }