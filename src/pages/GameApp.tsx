import { Game } from '../game/Game'
import { firebaseConfig } from '../config/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import MainNavbar from '../game/navbar/MainNavbar';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//getAnalytics(app);

const firestoreDb = getFirestore();

function GameApp() {
  return (
    <>
      <MainNavbar></MainNavbar>
      <Game firestoreDb={firestoreDb} isDebugMode={false} shouldLoadDebugFromRemote={true} />
    </>
  );
}

export default GameApp;