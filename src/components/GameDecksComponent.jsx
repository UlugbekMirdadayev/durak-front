import styled from "styled-components";
import Card from "./Card";
import sizeCalculator from "../hook/useSizeCalculator";
import { memo, useEffect, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import Droppable from "./Droppable";
import PropTypes from "prop-types";
import { EmptyCardIcon } from "../assets/images/svgs";
const Deck = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: ${sizeCalculator(20)};
  width: 100%;

  .row {
    display: flex;
    gap: ${sizeCalculator(20)};

    .cards-block {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      .card {
        position: absolute;
        inset: 0;

        &:first-child {
          position: relative;
        }
        &:nth-child(2) {
          rotate: 7deg;
          translate: ${sizeCalculator([5, 5])};
          z-index: 2;
        }
      }
    }
  }
`;

const EmptyCard = styled(EmptyCardIcon)`
  width: ${sizeCalculator(60)};
  height: ${sizeCalculator(90)};
  path {
    stroke: var(--color-primary, #d9d9d9);
  }
`;

const AnimatedCard = animated(Card); // React Spring animatsiyali karta

const GameDecksComponent = ({ over, active }) => {
  // Kartalar uchun animatsiya holatlarini yaratish
  const [springs] = useSprings(3, () => ({
    from: { scale: 1.1, transform: `translateY(-20px)` },
    to: { scale: 1, transform: `translateY(0px)` },
    config: { mass: 1, tension: 200, friction: 20, duration: 100 },
  }));

  const [tables, setTables] = useState([
    {
      id: "table-0",
      cards: [],
    },
    {
      id: "table-1",
      cards: [],
    },

    {
      id: "table-2",
      cards: [],
    },

    {
      id: "table-3",
      cards: [],
    },

    {
      id: "table-4",
      cards: [],
    },

    {
      id: "table-5",
      cards: [],
    },
  ]);

  useEffect(() => {
    if (active && over) {
      setTables((prev) =>
        prev.map(({ id, cards }) => {
          if (id === over) {
            return { id, cards: [...cards, active] };
          }
          return { id, cards };
        })
      );
    }
  }, [active, over]);

  return (
    <Deck>
      <div className="row">
        <div className="cards-block">
          {springs.map((style, card) => (
            <Droppable
              disabled={
                tables?.find((table) => table?.id === `table-${card}`)?.cards
                  ?.length === 2
              }
              id={`table-${card}`}
              key={card}
              style={{
                position: "relative",
              }}
            >
              {tables?.find((table) => table?.id === `table-${card}`)?.cards
                ?.length > 0 ? (
                tables
                  ?.find((table) => table.id === `table-${card}`)
                  ?.cards?.map((cardItem, indexItem) => (
                    <AnimatedCard
                      style={style}
                      rank={cardItem?.rank}
                      suit={cardItem?.suit}
                      image={cardItem?.image}
                      index={indexItem}
                      key={indexItem}
                    />
                  ))
              ) : (
                <EmptyCard />
              )}
            </Droppable>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="cards-block">
          {springs.map((style, card) => (
            <Droppable
              disabled={
                tables?.find((table) => table?.id === `table-${card + 3}`)
                  ?.cards?.length === 2
              }
              id={`table-${card + 3}`}
              style={{
                position: "relative",
              }}
              key={card}
            >
              {tables?.find((table) => table?.id === `table-${card + 3}`)?.cards
                ?.length > 0 ? (
                tables
                  ?.find((table) => table.id === `table-${card + 3}`)
                  ?.cards?.map((cardItem, indexItem) => (
                    <AnimatedCard
                      style={style}
                      rank={cardItem?.rank}
                      suit={cardItem?.suit}
                      image={cardItem?.image}
                      index={indexItem}
                      key={indexItem}
                    />
                  ))
              ) : (
                <EmptyCard />
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </Deck>
  );
};

GameDecksComponent.propTypes = {
  over: PropTypes.string,
  active: PropTypes.object,
};

export default memo(GameDecksComponent);
