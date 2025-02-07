import styled from "styled-components";
import Card from "./Card";
import sizeCalculator from "../hook/useSizeCalculator";
import { memo, useEffect, useCallback } from "react";
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

const AnimatedCards = memo(({ tableId, cards, handleSetBitas }) => {
  const [springs] = useSprings(cards.length, () => ({
    from: {
      transform: "scale(1.1) translateY(-20px)",
      opacity: 0,
    },
    to: {
      transform: "scale(1) translateY(0px)",
      opacity: 1,
    },
    config: { mass: 1, tension: 200, friction: 20 },
  }));

  AnimatedCards.displayName = "AnimatedCards";
  if (!cards.length) return <EmptyCard />;

  return cards.map((cardItem, indexItem) => (
    <AnimatedCard
      key={`${tableId}-${indexItem}`}
      style={springs[indexItem]}
      rank={cardItem?.rank}
      suit={cardItem?.suit}
      image={cardItem?.image}
      index={indexItem}
      onClick={() => handleSetBitas(cardItem, tableId)}
    />
  ));
});

AnimatedCards.propTypes = {
  tableId: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  active: PropTypes.object,
  over: PropTypes.string,
  handleSetBitas: PropTypes.func.isRequired,
};

// Выносим CardRow как отдельный мемоизированный компонент
const CardRow = memo(({ startIndex, tables, renderCards }) => (
  <div className="cards-block">
    {[0, 1, 2].map((index) => {
      const tableId = `table-${index + startIndex}`;
      return (
        <Droppable
          key={tableId}
          disabled={tables.find((t) => t.id === tableId)?.cards?.length === 2}
          id={tableId}
          style={{ position: "relative" }}
        >
          {renderCards(tableId)}
        </Droppable>
      );
    })}
  </div>
));

CardRow.displayName = "CardRow";

CardRow.propTypes = {
  startIndex: PropTypes.number.isRequired,
  tables: PropTypes.array.isRequired,
  renderCards: PropTypes.func.isRequired,
};

const GameDecksComponent = ({
  over,
  active,
  tables,
  setTables,
  handleSetBitas,
}) => {
  // Оптимизируем useEffect
  useEffect(() => {
    if (!active || !over) return;

    setTables((prev) =>
      prev.map((table) =>
        table.id === over
          ? { ...table, cards: [...table.cards, active] }
          : table
      )
    );
  }, [active, over, setTables]);

  // Мемоизируем функцию renderCards
  const renderCards = useCallback(
    (tableId) => {
      const table = tables.find((t) => t.id === tableId);
      return (
        <AnimatedCards
          tableId={tableId}
          cards={table?.cards || []}
          handleSetBitas={handleSetBitas}
        />
      );
    },
    [tables, handleSetBitas]
  );

  // Мемоизируем функцию handleSetBitas

  return (
    <Deck>
      <div className="row">
        <CardRow startIndex={0} tables={tables} renderCards={renderCards} />
      </div>
      <div className="row">
        <CardRow startIndex={3} tables={tables} renderCards={renderCards} />
      </div>
    </Deck>
  );
};

GameDecksComponent.propTypes = {
  over: PropTypes.string,
  active: PropTypes.object,
  setBitas: PropTypes.func,
  tables: PropTypes.array.isRequired,
  setTables: PropTypes.func.isRequired,
  handleSetBitas: PropTypes.func.isRequired,
};

export default memo(GameDecksComponent);
