import './App.scss';
import { Game } from './game/Game'
import { firebaseConfig } from './config/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const firestoreDb = getFirestore();

function App() {
  return (
    <Game firestoreDb={firestoreDb} isDebugMode={false} shouldLoadDebugFromRemote={true} />
  );
}

export default App;