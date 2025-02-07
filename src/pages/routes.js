import CreateGame from "./CreateGame";
import FindingOpponent from "./FindingOpponent";
import Start from "./Start";
import GamesList from "./GamesList";
import Game from "./Game";
import Shop from "./Shop";
import Decoration from "./Decoration";
import NewGameParams from "./NewGameParams";

const routes = [
  {
    path: "/",
    element: Start,
  },
  {
    path: "/finding-opponent",
    element: FindingOpponent,
  },
  {
    path: "/create-game",
    element: CreateGame,
  },
  {
    path: "/games-list",
    element: GamesList,
  },
  {
    path: "/game",
    element: Game,
  },
  {
    path: "/shop",
    element: Shop,
  },
  {
    path: "/decoration",
    element: Decoration,
  },
  {
    path: "/new-game-params",
    element: NewGameParams,
  },
];

export default routes;
