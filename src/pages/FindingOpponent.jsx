import styled from "styled-components";
// Components
// import { ForwardIcon } from "../assets/images/svgs";
// Images
import hand from "../assets/images/hand-with-poker.png";
import loaderimage from "../assets/images/loader.png";
import sizeCalculator from "../hook/useSizeCalculator";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow: scroll;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const HandImage = styled.img.attrs(() => ({
  loading: "lazy",
}))`
  width: calc(100% - ${sizeCalculator(64)});
  max-width: ${sizeCalculator(400)};
  height: auto;
  object-fit: contain;
  pointer-events: none;
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

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${sizeCalculator(20)};
  padding: ${sizeCalculator(16)};
  width: 100%;
  background-color: #fff;
`;

const LoaderImage = styled.img.attrs(() => ({
  loading: "lazy",
}))`
  object-fit: contain;
  pointer-events: none;
  width: ${sizeCalculator(50)};
  height: ${sizeCalculator(50)};
  animation: spin 1s linear infinite;
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TabTitle = styled.h3`
  font-size: ${sizeCalculator(24)};
  font-weight: 400;
  line-height: ${sizeCalculator(26.4)};
  text-align: center;
  color: #10a5f7;
  flex: 1;
`;

// Functional component
const FindingOpponent = () => {
  return (
    <Container>
      <Top>
        <HandImage src={hand} alt="hand" />
        <Title className="russo">Дурак</Title>
      </Top>
      <BottomRow>
        {/* <ForwardIcon
          style={{
            width: sizeCalculator(23),
            height: sizeCalculator(33),
          }}
        /> */}

        <TabTitle className="pribambas">Поиск Игрока</TabTitle>
        <LoaderImage src={loaderimage} alt="loader" />
      </BottomRow>
    </Container>
  );
};

export default FindingOpponent;
