import styled from "styled-components";
import PropTypes from "prop-types";
import sizeCalculator from "../hook/useSizeCalculator";
import { memo, forwardRef } from "react";

const CardContainer = styled.div`
  z-index: ${({ $index }) => $index};
  width: ${sizeCalculator(60)};
  height: ${sizeCalculator(90)};
  position: relative;
  cursor: pointer;
  border-radius: ${sizeCalculator(4)};
  overflow: hidden;
  filter: drop-shadow(0 0 ${sizeCalculator(1)} rgba(0, 0, 0, 0.2));
  transform: ${(props) =>
    `translateX(${props.$index * (props.$kuzer ? -2 : props?.$mycart ? 0 : 10)}px) rotate(${
      props.$index * (props.$kuzer ? 0 : props?.$mycart ? 0 : 10)
    }deg) translateY(${
      props.$index * (props.$kuzer ? 0 : props?.$mycart ? 0 : 10)
    }px)`};
`;

const Image = styled.img.attrs({ alt: "card" })`
  width: 100%;
  height: 100%;
  position: absolute;
  aspect-ratio: 240 / 336;
  inset: 0;
  object-fit: contain;
`;

const Card = forwardRef(
  ({ image, index, kuzer, rank, suit, mycart, ...props }, ref) => {
    return (
      <CardContainer
        key={index}
        $kuzer={kuzer}
        $rank={rank}
        $index={index}
        $mycart={mycart}
        $suit={suit}
        className="card"
        ref={ref}
        {...props}
      >
        <Image src={image} />
      </CardContainer>
    );
  }
);

Card.displayName = "Card";

Card.propTypes = {
  image: PropTypes.string.isRequired,
  index: PropTypes.any,
  kuzer: PropTypes.any,
  rank: PropTypes.any,
  suit: PropTypes.any,
  mycart: PropTypes.any,
};

export default memo(Card);
