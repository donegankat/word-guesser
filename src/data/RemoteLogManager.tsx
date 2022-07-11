import {
    doc,
    collection,
    setDoc
} from 'firebase/firestore';
import { firestoreDb } from '../config/firebaseInit';

export default async function WriteLog(caller: string, message: any) {
    if (firestoreDb && message) {
        const logsCollectionRef = collection(firestoreDb, "logs");
        setDoc(doc(logsCollectionRef), {
            caller: caller,
            logMessage: message,
            timestamp: Date.now()
        });
    }
}