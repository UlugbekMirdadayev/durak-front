import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { BackImage, deck } from "../helper/deck";
import { useState, memo } from "react";
import Card from "./Card";

const Bitas = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 3;
  height: ${sizeCalculator(200)};
  width: ${sizeCalculator(40)};

  .cards {
    position: relative;
    .card {
      position: absolute;
      top: 0;
      left: 0;
      transition: transform 0.3s ease;
      z-index: ${({ index }) => index};
    }
  }
`;

const BitasComponent = () => {
  const [updatePosition, setUpdatePosition] = useState(0);
  return (
    <Bitas onClick={() => setUpdatePosition(Math.random() * 1)}>
      <div className="cards">
        {deck.map((card, index) => (
          <Card
            key={index}
            rank={card.rank}
            suit={card.suit}
            image={BackImage}
            style={{
              zIndex: index,
              transform: `rotate(${
                Math.random() * 15 - 15 + updatePosition
              }deg) translate(${sizeCalculator(
                Math.random() * 50 - 5
              )}, ${sizeCalculator(Math.random() * 100 - 5)})`,
            }}
          />
        ))}
      </div>
    </Bitas>
  );
};

export default memo(BitasComponent);
