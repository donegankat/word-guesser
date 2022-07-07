import { Game } from '../src/game/Game'
import { firebaseConfig } from '../src/config/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import MainNavbar from '../src/game/navbar/MainNavbar';

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