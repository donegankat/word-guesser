import { Game } from '../game/Game'
import MainNavbar from '../game/navbar/MainNavbar';

function GameApp() {
  return (
    <>
      <MainNavbar></MainNavbar>
      <Game isDebugMode={false} shouldLoadDebugFromRemote={true} />
    </>
  );
}

export default GameApp;