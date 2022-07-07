import {
    doc,
    collection,
    setDoc,
    getFirestore
} from 'firebase/firestore';

const firestoreDb = getFirestore();

export default async function WriteLog(message: any) {
    if (firestoreDb && message) {
        const logsCollectionRef = collection(firestoreDb, "logs");
        setDoc(doc(logsCollectionRef), {
            logMessage: message,
            timestamp: Date.now()
        });
    }
}