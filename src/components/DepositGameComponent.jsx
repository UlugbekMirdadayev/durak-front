import { memo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import sizeCalculator from "../hook/useSizeCalculator";
import dollar from "../assets/images/dollar.png";

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

const DepositRow = styled.div`
  position: absolute;
  top: calc(50% + ${sizeCalculator(60)});
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  border-radius: 0 ${sizeCalculator(20)} ${sizeCalculator(20)} 0;
  opacity: 0.8;
  background: rgba(217, 217, 217, 0.3);
  box-shadow: 0 ${sizeCalculator(2)} ${sizeCalculator(10)} 0 rgba(0, 0, 0, 0.3);
  padding: ${sizeCalculator([5, 11])};
  gap: ${sizeCalculator(5)};
  z-index: 2;

  img {
    width: ${sizeCalculator(19)};
    height: ${sizeCalculator(19)};
  }

  span {
    position: relative;
    line-height: 1;
    top: ${sizeCalculator(-2)};
  }
`;

const DepositGameComponent = () => {
  const { game } = useSelector(({ exitgame }) => exitgame);
  return (
    <DepositRow>
      <img src={dollar} alt="deposits" />
      <PribambasText>{game?.bid_amount}</PribambasText>
    </DepositRow>
  );
};

export default memo(DepositGameComponent);
