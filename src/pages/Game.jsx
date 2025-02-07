/* eslint-disable no-unused-vars */
import { useState } from "react";
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

  function handleDragEnd({ over, active }) {
    // console.log(over?.id, active?.id);
    setOver(over?.id);
    setActive(JSON.parse(active?.id));
  }

  function handleDragMove({ over, active }) {
    // console.log(over?.id, JSON.parse(active?.id));
  }

  return (
    <GameWindow>
      <BackIcon onClick={() => dispatch(setExitVisible(true))} />
      <IconGiveUp onClick={() => dispatch(setGiveUpModal(true))} />
      <PlayersGame setUsersDone={setUsersDone} usersDone={usersDone} />

      {usersDone ? (
        <>
          <KuzersComponent />
          <DepositGameComponent />
          <BitasComponent />
        </>
      ) : (
        <>
          <ShareButton onClick={() => dispatch(setShareModal(true))}>
            <ShareInner>Пригласить друга</ShareInner>
          </ShareButton>
        </>
      )}

      <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
        <GameDecksComponent over={over} active={active} />
        <MyCartsComponent over={over} active={active} />
      </DndContext>

      <BottomBar
        Button={ShareButton}
        ButtonInner={ShareInner}
        dispatch={dispatch}
      />
    </GameWindow>
  );
};

export default Game;
