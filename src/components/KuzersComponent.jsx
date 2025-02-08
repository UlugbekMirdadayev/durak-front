import { BackImage, deck } from "../helper/deck";
import Card from "./Card";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const icons = {
  clubs: <pre>♣</pre>,
  hearts: <pre style={{ color: "red" }}>♥</pre>,
  diamonds: <pre style={{ color: "red" }}>♦</pre>,
  spades: <pre>♠</pre>,
};

const Kuzers = styled.div`
  position: absolute;

  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 3;
  .cards {
    position: relative;
    left: 0;
    transform: translateX(-50%);
    .card {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: ${sizeCalculator(2)};
      overflow: hidden;
      width: ${sizeCalculator(45)};
      height: ${sizeCalculator(69)};

      &:first-child {
        position: relative;
      }
    }
  }
`;

const ActiveKuzer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .card {
    width: ${sizeCalculator(45)};
    height: ${sizeCalculator(69)};
    transform: rotate(90deg);
    filter: drop-shadow(
        0 ${sizeCalculator(2)} ${sizeCalculator(4)} rgba(0, 0, 0, 0.45)
      )
      drop-shadow(0 ${sizeCalculator(5)} 0 #000);
  }
  span {
    position: absolute;
    z-index: 2;
    bottom: 100%;
    right: 0;
  }
  pre {
    font-size: ${sizeCalculator(40)};
    text-transform: uppercase;
    text-shadow: 0 0 ${sizeCalculator(2)} #fff;
  }
`;

const PribambasText = styled.span`
  color: #fff;
  text-align: center;
  font-family: Pribambas;
  font-size: ${sizeCalculator(18)};
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  text-transform: uppercase;
`;

const KuzersComponent = ({ setActiveSuit }) => {
  const [random, setRandom] = useState(Math.floor(Math.random() * 48) + 1);
  const game = useSelector(({ exitgame }) => exitgame?.game);
  useEffect(() => {
    setActiveSuit(deck[random].suit);
  }, [random, setActiveSuit]);

  return (
    <>
      <Kuzers onClick={() => setRandom(Math.floor(Math.random() * 48) + 1)}>
        <div className="cards">
          {Array.from({ length: game?.remaining_cards_count }, (_, index) => (
            <Card
              key={index}
              rank={deck[index].rank}
              suit={deck[index].suit}
              image={BackImage}
              index={index}
              kuzer
            />
          ))}
        </div>
      </Kuzers>
      <ActiveKuzer>
        {game?.remaining_cards_count ? (
          <>
            <PribambasText>{game?.remaining_cards_count}</PribambasText>
            <Card
              image={
                deck?.filter((card) => card.suit === game?.trump_suit)[
                  Math.floor(
                    Math.random() *
                      deck?.filter((card) => card.suit === game?.trump_suit)
                        .length
                  )
                ].image
              }
            />
          </>
        ) : (
          icons[game?.trump_suit]
        )}
      </ActiveKuzer>
    </>
  );
};

KuzersComponent.propTypes = {
  setActiveSuit: PropTypes.func,
};

export default memo(KuzersComponent);
