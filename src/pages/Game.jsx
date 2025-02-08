import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import back from "../assets/images/game-back.png";
import { useDispatch } from "react-redux";
import { setExitVisible } from "../redux/exitSlice";
import { setGiveUpModal, setShareModal } from "../redux/profileSlice";
import { GiveUpIcon } from "../assets/images/svgs";
import BottomBar from "../components/BottomBar";
import PlayersGame from "../components/PlayersGame";
import BitasComponent from "../components/BitasComponent";
import GameDecksComponent from "../components/GameDecksComponent";
import KuzersComponent from "../components/KuzersComponent";
import DepositGameComponent from "../components/DepositGameComponent";
import MyCartsComponent from "../components/MyCartsComponent";
import { DndContext } from "@dnd-kit/core";
import usePusherGamesListener from "../hook/usePusherGamesListener";

const GameWindow = styled.div`
  width: 100dvw;
  height: 100dvh;

  background: linear-gradient(180deg, #a9b6c1, #8f9da8);
  overflow: hidden;
  position: relative;
  margin-top: ${window?.Telegram?.WebApp?.contentSafeAreaInset?.top}px;
`;

const BackIcon = styled.img.attrs(() => ({
  src: back,
  alt: "Back Icon",
  loading: "lazy",
}))`
  width: ${sizeCalculator(24)};
  height: ${sizeCalculator(24)};
  cursor: pointer;
  filter: drop-shadow(
      ${sizeCalculator(-1)} ${sizeCalculator(-1)} 0 rgba(255, 255, 255, 1)
    )
    drop-shadow(0 ${sizeCalculator(1)} 0 rgba(255, 255, 255, 1))
    drop-shadow(${sizeCalculator(1)} 0 0 rgba(255, 255, 255, 1));
  position: absolute;
  top: ${sizeCalculator(32)};
  left: ${sizeCalculator(24)};
`;

const Button = styled.button`
  cursor: pointer;
  border-radius: ${sizeCalculator(5)};
  border: ${sizeCalculator(0.5)} solid #cdeaff;
  background: linear-gradient(180deg, #5d8fcf, #3a6aa5);
  box-shadow: ${sizeCalculator([5, 5, 8, 0])} rgba(0, 0, 0, 0.1),
    ${sizeCalculator([-2, -2, 5, 0])} rgba(255, 255, 255, 0.28),
    ${sizeCalculator(1, 1, 3, 0)} rgba(0, 0, 0, 0.25) inset;
  color: #fff;
`;

const ShareButton = styled(Button)`
  position: absolute;
  bottom: ${sizeCalculator(108)};
  left: 50%;
  transform: translateX(-50%);
  padding: ${sizeCalculator(9)} ${sizeCalculator(25)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  &:active {
    transform: translateX(-50%) scale(0.95);
  }
`;

const ShareInner = styled.span`
  font-size: ${sizeCalculator(18)};
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;
const IconGiveUp = styled(GiveUpIcon)`
  position: absolute;
  top: ${sizeCalculator(10)};
  right: ${sizeCalculator(10)};
  cursor: pointer;
  filter: drop-shadow(
    0 ${sizeCalculator(4)} ${sizeCalculator(4)} rgba(0, 0, 0, 0.25)
  );
  width: ${sizeCalculator(45)};
  height: ${sizeCalculator(47)};
`;

const Game = () => {
  const dispatch = useDispatch();
  const [usersDone, setUsersDone] = useState(false);
  const [over, setOver] = useState(null);
  const [active, setActive] = useState(null);
  const [activeSuit, setActiveSuit] = useState(null); // ♣, ♠, ♥, ♦
  const [bitas, setBitas] = useState([]);
  const [isAttackState, setIsAttackState] = useState(true);
  const [tables, setTables] = useState(
    Array.from({ length: 1 }, (_, index) => ({
      id: `table-${index}`,
      cards: [],
    }))
  );

  const { gameStatus } = usePusherGamesListener();

  useEffect(() => {
    gameStatus;
  }, [gameStatus]);

  const handleSetBitas = useCallback((card, tableId) => {
    if (!card && !tableId)
      return setTables((prev) => {
        const newBitas = prev.reduce((acc, table) => {
          acc.push(...table.cards);
          return acc;
        }, []);
        setBitas((bitas) => [...new Set([...bitas, ...newBitas])]);
        return Array.from({ length: 1 }, (_, index) => ({
          id: `table-${index}`,
          cards: [],
        }));
      });

    setTables((prev) => {
      const newBitas = prev.find((table) => table.id === tableId).cards;
      setBitas((oldBitas) => [...oldBitas, ...newBitas]);
      return prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              cards: [],
            }
          : table
      );
    });
  }, []);

  function handleDragEnd({
    over,
    active,
    // , delta
  }) {
    // if (Math.abs(delta.y) > 50) {
    //   setActive(JSON.parse(active?.id));
    //   setOver(`table-0`);
    // } else
    if (isAttackState) {
      setOver(over?.id);
      setActive(JSON.parse(active?.id));
    } else {
      setOver(null);
      setActive(null);
    }
  }

  const handleAttack = (tableCard, handCard, kozirSuit) => {
    // Если на столе нет карты, разрешаем ходить любой
    if (!tableCard) return true;

    const figures = ["10", "J", "Q", "K", "A"];
    const isHandKozir = handCard.suit === kozirSuit;
    const isTableKozir = tableCard.suit === kozirSuit;

    // Если карты одной масти
    if (tableCard.suit === handCard.suit) {
      // Для фигур
      if (figures.includes(tableCard.rank) && figures.includes(handCard.rank)) {
        return figures.indexOf(handCard.rank) > figures.indexOf(tableCard.rank);
      } else if (figures.includes(tableCard.rank)) {
        return false;
      } else if (figures.includes(handCard.rank)) {
        return true;
      }
      // Для обычных карт
      return +handCard.rank > +tableCard.rank;
    }

    // Если бьём козырем не козырную карту
    if (isHandKozir && !isTableKozir) {
      return true;
    }

    return false;
  };

  function handleDragMove({ over, active }) {
    // if (Math.abs(delta.y) > 50) {
    //   over = { id: `table-0` };
    // }
    const isTable = tables.find((table) => table.id === over?.id);
    const isAttack = over?.id
      ? handleAttack(isTable?.cards[0], JSON.parse(active?.id), activeSuit)
      : false;
    setOver(null);
    setActive(null);

    setIsAttackState(isAttack);
  }

  return (
    <GameWindow>
      <BackIcon onClick={() => dispatch(setExitVisible(true))} />
      <IconGiveUp onClick={() => dispatch(setGiveUpModal(true))} />
      <PlayersGame usersDone={usersDone} />

      {usersDone ? null : (
        <>
          <ShareButton onClick={() => dispatch(setShareModal(true))}>
            <ShareInner>Пригласить друга</ShareInner>
          </ShareButton>
        </>
      )}
      <KuzersComponent setActiveSuit={setActiveSuit} />
      <DepositGameComponent />
      <BitasComponent bitas={bitas} />
      <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
        <GameDecksComponent
          over={over}
          active={active}
          tables={tables}
          setTables={setTables}
          handleSetBitas={handleSetBitas}
          isAttackState={isAttackState}
        />
        <MyCartsComponent
          over={over}
          active={active}
          isAttackState={isAttackState}
        />
      </DndContext>

      <BottomBar
        Button={ShareButton}
        ButtonInner={ShareInner}
        dispatch={dispatch}
        setUsersDone={setUsersDone}
        usersDone={usersDone}
        bitas={bitas}
        handleSetBitas={handleSetBitas}
      />
    </GameWindow>
  );
};

export default Game;
