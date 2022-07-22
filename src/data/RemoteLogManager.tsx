import {
    doc,
    collection,
    setDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { firestoreDb } from '../config/firebaseInit';

export default async function WriteLog(caller: string, message: any) {
    if (firestoreDb && message) {
        const logsCollectionRef = collection(firestoreDb, "logs");
        setDoc(doc(logsCollectionRef, Timestamp.now().toDate().toUTCString()), {
            caller: caller,
            logMessage: message,
            timestamp: serverTimestamp()
        });
    }
}