import styled from "styled-components";
import { setProfile, setProfileOpened } from "../redux/profileSlice";
import sizeCalculator from "../hook/useSizeCalculator";
import { useDispatch } from "react-redux";
import { memo } from "react";
import PropTypes from "prop-types";

const StatusDone = styled.div`
  color: #fff;
  text-align: center;
  font-size: ${sizeCalculator(10)};
  font-weight: 600;
  line-height: 100%;
  padding: ${sizeCalculator(3)} ${sizeCalculator(13)};
`;

const Player = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: relative;
  gap: ${sizeCalculator(6)};
  span {
    color: #fff;
    font-size: ${sizeCalculator(14)};
    font-weight: 600;
    max-width: ${sizeCalculator(60)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:first-child,
  &:last-child {
    top: ${sizeCalculator(20)};
  }
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${sizeCalculator(1)} solid #87a2b4;
    background: #5d8199;
    width: ${sizeCalculator(21)};
    height: ${sizeCalculator(21)};
    color: #fff;
    font-family: Rubik;
    font-size: ${sizeCalculator(10)};
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    transform: translate(50%, -50%);
  }
`;

const PlayersRow = styled.div`
  position: absolute;
  top: ${sizeCalculator(70)};
  width: calc(100% - ${sizeCalculator(20)});
  margin: 0 ${sizeCalculator(10)};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${sizeCalculator(10)};
  ${({ $usersCount }) => {
    if ([1, 2].includes($usersCount)) {
      return `justify-content: center;
        ${Player}{
           &:first-child,
           &:last-child {
            top: 0;
           }
        }
      `;
    }
  }}
`;

const Avatar = styled.img.attrs({
  alt: "Avatar",
  loading: "lazy",
})`
  width: ${sizeCalculator(62.035)};
  height: ${sizeCalculator(49.267)};
  border-radius: ${sizeCalculator(13)};
  object-fit: cover;
`;

const Button = styled.button`
  cursor: pointer;
  border-radius: ${sizeCalculator(5)};
  border: ${sizeCalculator(0.5)} solid #cdeaff;
  background: linear-gradient(180deg, #5d8fcf, #3a6aa5);
  box-shadow: ${sizeCalculator([5, 5, 8])} 0 rgba(0, 0, 0, 0.1),
    ${sizeCalculator([-2, -2, 5])} 0 rgba(255, 255, 255, 0.28),
    ${sizeCalculator([1, 3, 3])} 0 rgba(0, 0, 0, 0.25) inset;
  color: #fff;
`;

const EmptyUser = styled(Button)`
  width: ${sizeCalculator(62.035)};
  height: ${sizeCalculator(49.267)};
  border-radius: ${sizeCalculator(13)};
  color: #fff;
  font-size: ${sizeCalculator(10)};
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayersGame = ({ usersDone }) => {
  const dispatch = useDispatch();
  const users = [...Array(Math.floor(Math.random() * 5) + 1).keys()];
  return (
    <PlayersRow $usersCount={users.length}>
      {users.map((i) => (
        <Player key={i}>
          {!usersDone && i === 0 ? (
            <EmptyUser>Пусто</EmptyUser>
          ) : (
            <>
              <div className="badge">{Math.floor(Math.random() * 1000)}</div>
              <Avatar
                src={`https://avatars.githubusercontent.com/u/${Math.floor(
                  Math.random() * 10000
                )}`}
                onClick={() => {
                  dispatch(setProfileOpened(true));
                  dispatch(setProfile({ name: "Ekaterina" }));
                }}
              />

              <span>Ekaterin...</span>
              <Button>
                <StatusDone>Готов</StatusDone>
              </Button>
            </>
          )}
        </Player>
      ))}
    </PlayersRow>
  );
};

PlayersGame.propTypes = {
  usersDone: PropTypes.bool.isRequired,
};

export default memo(PlayersGame);
