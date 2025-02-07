import styled from "styled-components";
import { deck } from "../helper/deck";
import Card from "./Card";
import { memo, useEffect, useState } from "react";
import Draggable from "./Draggable";
import PropTypes from "prop-types";

const MyCarts = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2;
  overflow: visible;

  [role="button"] {
    transition: bottom 0.3s ease;
    position: relative;
    bottom: 0;
    &:active {
      z-index: 99999 !important;
      bottom: 20px;
    }
  }
`;

const MyCartsComponent = ({ over, active, isAttackState }) => {
  const [cards, setCards] = useState(deck?.filter((_, index) => index < 25));
  const calculateCardStyle = (index, totalCards) => {
    const calculateSpacing = (cardCount) => (10 * 25) / cardCount;

    // Misol uchun
    const spacing = calculateSpacing(totalCards);
    // const maxGap = 10; // Maksimal oraliq (px)
    const baseGap = spacing;
    const centerIndex = (totalCards - 1) / 2; // O‘rta karta indeksini topish
    const offsetX = (index - centerIndex) * baseGap; // Translatsiya (chap va o‘ng)

    const angle = (index - centerIndex) * 1; // Burilish burchagi (7°)

    return {
      translate: `${offsetX}px ${0}px`,
      zIndex: index,
      rotate: `${angle}deg`,
    };
  };

  useEffect(() => {
    if (active && over && isAttackState) {
      setCards((prev) =>
        prev?.filter((card) =>
          card.rank === active.rank && card.suit === active.suit ? false : true
        )
      );
    }
  }, [active, over, isAttackState]);

  return (
    <MyCarts>
      {cards
        ?.sort((a, b) => {
          const aIndex = `${a.suit}-${a.rank}`;
          const bIndex = `${b.suit}-${b.rank}`;
          return aIndex.localeCompare(bIndex);
        })

        ?.map((card, index) => (
          <Draggable
            key={card.rank + card.suit}
            id={JSON.stringify({
              rank: card.rank,
              suit: card.suit,
              image: card.image,
              index: index,
            })}
            style={{
              ...calculateCardStyle(index, cards.length),
              minWidth: "32vw", // Kartaning kengligi
              minHeight: "44.8vw", // Kartaning balandligi
              position: "absolute",
            }}
          >
            <Card
              rank={card.rank}
              suit={card.suit}
              image={card.image}
              index={index}
              mycart
              style={{
                minWidth: "32vw", // Kartaning kengligi
                minHeight: "44.8vw", // Kartaning balandligi
              }}
            />
          </Draggable>
        ))}
    </MyCarts>
  );
};

MyCartsComponent.propTypes = {
  over: PropTypes.string,
  active: PropTypes.object,
  isAttackState: PropTypes.bool,
};

export default memo(MyCartsComponent);
