import IWord from '../game/interfaces/IWord';
import {
    doc,
    collection,
    query,
    setDoc,
    getDoc,
    getDocs,
    where,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { firestoreDb } from '../config/firebaseInit';
import WriteLog from './RemoteLogManager';
import GameConstants from '../game/constants/GameConstants';

/**
 * Saves the word to the Google Firestore DB for later use & tracking.
 * @param word 
 */
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
                length: word.word.length,
                firstSeenTimestamp: serverTimestamp()
            });
        } else {
            WriteLog("WordDatabaseManager.SaveWordToDatabase", {
                message: "Word already exists in database",
                word
            });
        }
    }
}

/**
 * Returns true if the given word exists in the Google Firestore DB, or false otherwise.
 * @param word 
 * @returns 
 */
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

/**
 * Loads a random word that has already been seen before from the Google Firestore DB.
 * Primarily used for testing and debugging.
 * @param wordLengthToLoad 
 * @returns 
 */
async function LoadRandomWordFromDatabase(wordLengthToLoad?: number): Promise<IWord> {
    if (!wordLengthToLoad) wordLengthToLoad = GameConstants.DefaultGuessLetters;
    
    const wordsQuery = query(
        collection(firestoreDb, "words"),
        where("length", "==", wordLengthToLoad)
    );

    const querySnapshot = await getDocs(wordsQuery);
    const docsLength = querySnapshot.docs.length;

    if (docsLength === 0)
        throw `Failed to retrieve a random word from the database with the requested length of ${wordLengthToLoad}`;
    
    const randomDocIndex = getRandomDocIndex(0, docsLength);

    var docArray: IWord[] = [];
    querySnapshot.forEach((wordDoc) => {
        docArray.push(wordDoc.data().word);
    });
    
    console.log("LOADED RANDOM WORD FROM DB", docArray[randomDocIndex]);
    return docArray[randomDocIndex];
}

function getRandomDocIndex(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

/**
 * Helper function used when all docs need to be updated for some reason.
 * Not intended for normal app use.
 */
async function BulkUpdateDocuments() {
    const querySnapshot = await getDocs(collection(firestoreDb, "words"));

    querySnapshot.forEach((doc) => {
        //if (doc.data().word.word[0] === "a") {
            console.log("UPDATING", doc.data())
            
            updateDoc(doc.ref, {
                firstSeenTimestamp: serverTimestamp(),
                length: doc.data().word.word.length
              });
        //}
    });
}

export { SaveWordToDatabase, LoadRandomWordFromDatabase, CheckWordExistsInDatabase, BulkUpdateDocuments };