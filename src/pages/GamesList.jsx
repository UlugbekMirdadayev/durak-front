import { useCallback, useEffect, useState } from "react"; // Components
import styled from "styled-components"; // Images
import sizeCalculator from "../hook/useSizeCalculator";
import { useNavigate } from "react-router-dom";
import { CartIcon, TimeIcon, TonIcon2, UserIcon } from "../assets/images/svgs";
import usePusherGamesListener from "../hook/usePusherGamesListener";
import { request } from "../service/api";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setGame } from "../redux/exitSlice";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100dvw;
  margin-top: ${sizeCalculator(40)};
  overflow: scroll;
  max-height: 80%;
`;

const Description = styled.h4`
  margin-top: ${sizeCalculator(60)};
  margin-bottom: ${sizeCalculator(5)};
  font-size: ${sizeCalculator(12)};
  color: #5e5e5e;
  font-family: Roboto;
  font-weight: 500;
  line-height: ${sizeCalculator(14)};
  letter-spacing: ${sizeCalculator(1)};
  text-align: left;
  width: calc(100% - ${sizeCalculator(30)});
`;

const FilterRow = styled.div`
  margin-bottom: ${sizeCalculator(8)};
  width: calc(100% - ${sizeCalculator(30)});
  border-radius: ${sizeCalculator(16)};
  padding: ${sizeCalculator(18)} ${sizeCalculator(10)};
  background: #fff;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${sizeCalculator(5)};

  button {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(2)};
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: 300ms ease-in-out;
    &:active {
      transform: scale(0.95);
    }

    span {
      color: #999;
      font-size: ${sizeCalculator(10)};
      font-style: normal;
      font-weight: 400;
    }
    svg {
      width: ${sizeCalculator(14)};
      height: ${sizeCalculator(14)};
    }
  }
`;

const Card = styled.div`
  width: calc(100% - ${sizeCalculator(30)});
  border-radius: ${sizeCalculator(10)};
  background: #10a5f7;
  padding: ${sizeCalculator(16)} ${sizeCalculator(24)};
  margin-bottom: ${sizeCalculator(14)};
  cursor: pointer;
  transition: 300ms ease-in-out;
  &:active {
    transform: scale(0.95);
  }

  button {
    gap: ${sizeCalculator(5)};
    &:active {
      transform: none;
    }
    span {
      color: #fff;
      font-size: ${sizeCalculator(16)};
      line-height: ${sizeCalculator(24)};
      font-weight: 500;
    }
    svg {
      width: ${sizeCalculator(18)};
      height: ${sizeCalculator(18)};
      path {
        stroke: #fff;
      }
    }
    &:nth-child(3) {
      path {
        fill: #fff;
      }
    }
  }
  p {
    margin-top: ${sizeCalculator(21)};
    color: rgba(255, 255, 255, 0.8);
    font-size: ${sizeCalculator(12)};
    font-weight: 500;
    line-height: ${sizeCalculator(14)};
    letter-spacing: ${sizeCalculator(1)};
  }
`;

const CardTitle = styled.h4`
  width: calc(100% - ${sizeCalculator(30)});
  color: #090909;
  font-size: ${sizeCalculator(16)};
  font-style: normal;
  font-weight: 700;
  line-height: ${sizeCalculator(19)};
  margin-bottom: ${sizeCalculator(5)};
  margin-top: ${sizeCalculator(24)};
`;

const NotFound = styled.div`
  width: calc(100% - ${sizeCalculator(30)});
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizeCalculator(24)};
  flex-direction: column;
`;

const Button = styled.button`
  color: #fff;
  font-size: ${sizeCalculator(16)};
  font-style: normal;
  font-weight: 500;
  line-height: ${sizeCalculator(24)};
  border-radius: ${sizeCalculator(10)};
  background: #10a5f7;
  padding: ${sizeCalculator(10)} ${sizeCalculator(24)};
  border: 0;
  cursor: pointer;
`;

const GamesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games } = usePusherGamesListener();
  const token = useSelector((state) => state?.user?.token);
  const [gamesList, setGamesList] = useState([]);
  useEffect(() => {
    setGamesList(games);
  }, [games]);

  useEffect(() => {
    request
      .get("api/game/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setGamesList(data?.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const handleJoinGame = useCallback(
    (id) => {
      const toastId = toast.loading("Присоединение к игре...");
      request
        .post(
          "api/game/player/join",
          {
            game_id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          toast.update(toastId, {
            render: data?.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });

          dispatch(setGame(data?.data));

          navigate("/game");
        })
        .catch((err) => {
          console.log(err);
          toast.update(toastId, {
            render: err?.response?.data?.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    },
    [navigate, token, dispatch]
  );

  return (
    <Container>
      <Description>Фильтр игр</Description>
      <FilterRow>
        <Row>
          <Row>
            <button>
              <TonIcon2 />
              <span>10</span>
            </button>
            <button>
              <UserIcon />
              <span>2</span>
            </button>
            <button>
              <CartIcon />
              <span>24</span>
            </button>
            <button>
              <TimeIcon />
              <span>Обычная</span>
            </button>
          </Row>
          <Row>
            <button>
              <span>Перекидной</span>
            </button>
            <button>
              <span>Соседи</span>
            </button>
            <button>
              <span>С шулерами</span>
            </button>
          </Row>
        </Row>
      </FilterRow>
      {gamesList?.length === 0 ? (
        <NotFound>
          <CardTitle>
            Такой игры в данный момент нету вы можете создать ее сами
          </CardTitle>
          <Button onClick={() => navigate("/new-game-params")}>
            <span>Создать игру</span>
          </Button>
        </NotFound>
      ) : (
        <>
          <CardTitle>Игры ваших друзей</CardTitle>
          {gamesList?.filter((item) => item.is_creator_friend)?.length === 0 ? (
            <NotFound>
              <CardTitle>
                Такой игры в данный момент нету вы можете создать ее сами
              </CardTitle>
              <Button onClick={() => navigate("/new-game-params")}>
                <span>Создать игру</span>
              </Button>
            </NotFound>
          ) : (
            gamesList
              ?.filter((item) => item.is_creator_friend)
              .map((item, index) => (
                <Card
                  key={item?.id + index}
                  onClick={() => handleJoinGame(item?.id || index + 1)}
                >
                  <Row>
                    <Row>
                      <button>
                        <TonIcon2 />
                        <span>10</span>
                      </button>
                      <button>
                        <UserIcon />
                        <span>2</span>
                      </button>
                      <button>
                        <CartIcon />
                        <span>24</span>
                      </button>
                    </Row>
                    <Row>
                      <button>
                        <TimeIcon />
                        <span>Быстрая</span>
                      </button>
                    </Row>
                  </Row>
                  <p>Режим игры</p>
                  <Row>
                    <button>
                      <span style={{ fontWeight: "400" }}>
                        Перекидной, Соседи, С шулерами
                      </span>
                    </button>
                  </Row>
                </Card>
              ))
          )}

          <CardTitle>Глобальный поиск</CardTitle>
          {gamesList?.map((item, index) => (
            <Card
              key={item?.id + index}
              onClick={() => handleJoinGame(item?.id || index + 1)}
            >
              <Row>
                <Row>
                  <button>
                    <TonIcon2 />
                    <span>{item?.bid_amount}</span>
                  </button>
                  <button>
                    <UserIcon />
                    <span>{item?.players_count}</span>
                  </button>
                  <button>
                    <CartIcon />
                    <span>{item?.cards_count}</span>
                  </button>
                </Row>

                <Row>
                  <button>
                    <TimeIcon />
                    <span>
                      {
                        [
                          { title: "Обычная", name: "normal" },
                          {
                            title: "Быстрая",
                            name: "fast",
                          },
                        ].find((i) => i.name === item?.speed)?.title
                      }
                    </span>
                  </button>
                </Row>
              </Row>
              <p>Режим игры</p>
              <Row>
                <button>
                  <span style={{ fontWeight: "400" }}>
                    {
                      [
                        { title: "Подкидной", name: "podkidnoy" },
                        { title: "Переводной", name: "perevodnoy" },
                      ].find((i) => i.name === item?.mode)?.title
                    }
                    ,{" "}
                    {
                      [
                        { title: "С шулерами", name: "cheat" },
                        { title: "Честная игра", name: "honest" },
                      ].find((i) => i.name === item?.walker_with)?.title
                    }
                    ,{" "}
                    {
                      [
                        { title: "Соседи", name: "neighbors" },
                        { title: "Все", name: "everyone" },
                      ].find((i) => i.name === item?.walker)?.title
                    }
                  </span>
                </button>
              </Row>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default GamesList;
