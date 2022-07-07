import {
    doc,
    collection,
    setDoc
} from 'firebase/firestore';
import { firestoreDb } from '../config/firebaseInit';

export default async function WriteLog(message: any) {
    if (firestoreDb && message) {
        const logsCollectionRef = collection(firestoreDb, "logs");
        setDoc(doc(logsCollectionRef), {
            logMessage: message,
            timestamp: Date.now()
        });
    }
}