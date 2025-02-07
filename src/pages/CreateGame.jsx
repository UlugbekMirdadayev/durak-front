import styled from "styled-components"; // Images
import hand from "../assets/images/hand-with-poker.png";
import sizeCalculator from "../hook/useSizeCalculator";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100dvw;
  overflow: scroll;
`;

const HandImage = styled.img.attrs(() => ({
  loading: "lazy",
}))`
  width: calc(100% - ${sizeCalculator(64)});
  max-width: ${sizeCalculator(400)};
  height: auto;
  object-fit: contain;
  pointer-events: none;
  margin-top: auto;
`;

const Title = styled.h1`
  font-size: ${sizeCalculator(64)};
  font-weight: 400;
  line-height: ${sizeCalculator(64)};
  text-align: center;
  color: #0098eb;
  text-transform: uppercase;
  margin-top: ${sizeCalculator(20)};
`;

const ButtonRow = styled.div`
  width: calc(100% - ${sizeCalculator(64)});
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizeCalculator(15)};
  margin-bottom: auto;
`;

const ButtonInner = styled.span`
  color: #fff;
  text-align: center;
  font-size: ${sizeCalculator(16)};
  font-weight: 500;
  line-height: ${sizeCalculator(24)};
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${sizeCalculator(10)};
  background: #10a5f7;
  padding: ${sizeCalculator(9)};
  border: none;
  margin-top: ${sizeCalculator(20)};
  gap: ${sizeCalculator(9)};
  cursor: pointer;
  transition: 0.3s;
  &:active {
    scale: 0.95;
    background: #0098eb;
  }
`;

const CreateGame = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <HandImage src={hand} alt="hand" />
      <Title className="russo">Дурак</Title>
      <ButtonRow>
        <Button onClick={() => navigate("/new-game-params")}>
          <ButtonInner>Создать игру</ButtonInner>
        </Button>
        <Button onClick={() => navigate("/games-list")}>
          <ButtonInner>Найти игру</ButtonInner>
        </Button>
      </ButtonRow>
    </Container>
  );
};

export default CreateGame;
