import IWord from '../game/interfaces/IWord';
import {
    doc,
    collection,
    query,
    setDoc,
    getDoc,
    getDocs
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

async function SaveWordToDatabase(firestoreDb: Firestore, word: IWord) {
    if (word) {
        var doesDocExist = await CheckWordExistsInDatabase(firestoreDb, word);

        if (!doesDocExist) {
            console.log("DOC DOESN'T EXIST. ADDING", word);
            const wordsCollectionRef = collection(firestoreDb, "words");
            setDoc(doc(wordsCollectionRef, word.word), {
                word: word,
                firstSeenTimestamp: Date.now()
            });
        } else {
            console.log("DOC ALREADY EXISTS", word);
        }
    }
}

async function CheckWordExistsInDatabase(firestoreDb: Firestore, word: IWord) {
    var docRef = doc(firestoreDb, 'words', word.word);
    const docData = await getDoc(docRef);

    if (docData.exists()) {
        return true;
    } else {
        return false;
    }
}

async function LoadRandomWordFromDatabase(firestoreDb: Firestore): Promise<IWord> {
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
    
    console.log("RAND", querySnapshot, docArray[randomDocIndex]);
    return docArray[randomDocIndex];
}

function getRandomDocIndex(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export { SaveWordToDatabase, LoadRandomWordFromDatabase };