import IWord from '../game/interfaces/IWord';
import {
    doc,
    collection,
    query,
    setDoc,
    getDoc,
    getDocs
} from 'firebase/firestore';
import { firestoreDb } from '../config/firebaseInit';
import WriteLog from './RemoteLogManager';

async function SaveWordToDatabase(word: IWord) {
    if (word) {
        var doesDocExist = await CheckWordExistsInDatabase(word.word);

        if (!doesDocExist) {
            WriteLog("WordDatabaseManager.SaveWordToDatabase", {
                message: "Word doesn't exist in database. Adding",
                word
            });

            const wordsCollectionRef = collection(firestoreDb, "words");
            setDoc(doc(wordsCollectionRef, word.word), {
                word: word,
                firstSeenTimestamp: Date.now()
            });
        } else {
            WriteLog("WordDatabaseManager.SaveWordToDatabase", {
                message: "Word already exists in database",
                word
            });
        }
    }
}

async function CheckWordExistsInDatabase(word: string) {
    if (!word || word.length <= 0) return false;
    
    var docRef = doc(firestoreDb, 'words', word);
    const docData = await getDoc(docRef);

    if (docData.exists()) {
        return true;
    } else {
        return false;
    }
}

async function LoadRandomWordFromDatabase(): Promise<IWord> {
    const wordsQuery = query(
        collection(firestoreDb, "words")
    );

    const querySnapshot = await getDocs(wordsQuery);
    const docsLength = querySnapshot.docs.length;
    const randomDocIndex = getRandomDocIndex(0, docsLength);

    var docArray: IWord[] = [];
    querySnapshot.forEach((wordDoc) => {
        docArray.push(wordDoc.data().word);
    });
    
    console.log("RAND", docArray[randomDocIndex]);
    return docArray[randomDocIndex];
}

function getRandomDocIndex(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export { SaveWordToDatabase, LoadRandomWordFromDatabase, CheckWordExistsInDatabase };