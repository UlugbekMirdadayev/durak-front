import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useNavigate } from "react-router-dom";
import { request } from "../service/api";
import FindingOpponent from "./FindingOpponent";
import bg from "../assets/images/bg-welcome.png";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../redux/exitSlice";
import { toast } from "react-toastify";

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: translateY(${({ $visible }) => ($visible ? 0 : 100)}%);
  transition: 0.3s;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: transparent;
  z-index: -1;
`;
const Body = styled.div`
  border-radius: ${sizeCalculator(10)} ${sizeCalculator(10)} 0 0;
  background: #fff;
  width: 100%;
  display: flex;
  padding: ${sizeCalculator(22)} ${sizeCalculator(15)};
  flex-direction: column;
  gap: ${sizeCalculator(10)};
  overflow: scroll;
  .bottom-row {
    width: calc(100% + ${sizeCalculator(10)});
    position: relative;
    height: ${sizeCalculator(20)};
    left: ${sizeCalculator(-10)};

    .calculator {
      position: absolute;
      bottom: calc(100% + ${(10 / 390) * 100}vw);
      padding: ${(5 / 390) * 100}vw;
      border-radius: ${(40 / 390) * 100}vw;
      background-color: #0098ea;
      color: rgb(255, 255, 255);
      font-size: ${(10 / 390) * 100}vw;
      width: ${(24 / 390) * 100}vw;
      height: ${(24 / 390) * 100}vw;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: 1000ms cubic-bezier(0.165, 0.84, 0.44, 1) opacity;
    }
  }
`;
const Handler = styled.div`
  width: ${sizeCalculator(134)};
  height: ${sizeCalculator(5)};
  cursor: pointer;
  border-radius: ${sizeCalculator(100)};
  background: #fff;
  margin: ${sizeCalculator(8)} auto;
`;

const Bet = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: calc(100% - ${({ $visible }) => sizeCalculator($visible ? 0 : 30)});

  .row {
    display: flex;
    gap: ${sizeCalculator(10)};
    flex-wrap: wrap;
  }
`;

const Range = styled.div`
  width: calc(100% - ${(24 / 390) * 100}vw);
  margin: 0 ${(12 / 390) * 100}vw 0 ${(12 / 390) * 100}vw;
  height: ${(8 / 390) * 100}vw;
  background: #0099eb3d;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-radius: ${(2 / 390) * 100}vw;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgb(0, 152, 234) 100%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 100% 100%;
  background-position: 100% 0;
  .range1,
  .range2 {
    position: absolute;
    top: 50%;
    /* right: -${(12 / 390) * 100}vw; */
    transform: translateY(-50%);
    width: ${(24 / 390) * 100}vw;
    height: ${(24 / 390) * 100}vw;
    background: #0098ea;
    border-radius: 50%;
    z-index: 3;
  }
`;

const Button = styled.button`
  border-radius: ${sizeCalculator(10)};
  background: #10a5f7;
  color: #fff;
  font-size: ${sizeCalculator(16)};
  font-style: normal;
  font-weight: 500;
  line-height: ${sizeCalculator(24)};
  width: 100%;
  padding: ${sizeCalculator(11)};
  cursor: pointer;
  transition: 0.3s;
  border: ${sizeCalculator(1)} solid #10a5f7;
  &:active {
    transform: scale(0.95);
  }
  &.outline {
    background: transparent;
    border-color: #e8e8e8;
    color: #32484d;
  }
`;

const Paragraph = styled.p`
  color: #5e5e5e;
  font-size: ${sizeCalculator(12)};
  font-weight: 500;
  line-height: ${sizeCalculator(14)};
  letter-spacing: ${sizeCalculator(1)};
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  inset: 0;
  z-index: 9999;
  background: #efeff4;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const NewGameParams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.user?.token);
  const [height, setHeight] = useState(200);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false); // Initial height in calculated units
  const startHeightRef = useRef(height); // Reference to track initial height
  const startYRef = useRef(0); // Reference to track initial Y position
  const bodyRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (e.cancelable) e.preventDefault(); // Faqat cancelable bo'lsa defaultni bloklash

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = startYRef.current - clientY;
    const newHeight = Math.max(
      0,
      Math.min(window.innerHeight, startHeightRef.current + diff)
    );

    setHeight(
      window.innerHeight - newHeight >
        (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
        ? newHeight
        : newHeight -
            (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
    );
  }, []);

  const onMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onMouseUp);
  }, [onMouseMove]);

  const onMouseDown = (e) => {
    e.preventDefault(); // Bu yerda bloklanadi

    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeightRef.current = height;

    const moveListener = e.touches ? "touchmove" : "mousemove";
    const upListener = e.touches ? "touchend" : "mouseup";

    // Passiv bo‘lmagan hodisani qo‘shish
    window.addEventListener(moveListener, onMouseMove, { passive: false });
    window.addEventListener(upListener, onMouseUp, { passive: false });
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
      });
    }
  }, [step]);

  const [formData, setFormData] = useState({
    bid_amount: 30,
    players_count: 2,
    cards_count: 36,
    speed: "normal",
    mode: "podkidnoy",
    walker: "neighbors",
    walker_with: "cheat",
    is_for_friends: 0,
  });
  const handleCreateGame = () => {
    navigate("/game");
    const toastId = toast.loading("Пожалуйста, подождите...");
    request
      .post(
        "api/game/create",
        {
          ...formData,
          bid_amount: formData.bid_amount * 10,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        toast.update(toastId, {
          render: data?.message || "Успешно создано",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        dispatch(setGame(data?.data));
      })

      .catch((err) => {
        toast.update(toastId, {
          render: err?.response?.data?.message || "Ошибка",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(err);
        navigate(-1);
      })

      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container $visible>
      {loading && (
        <Loader>
          <FindingOpponent />
        </Loader>
      )}
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body ref={bodyRef} style={{ height: height }}>
        <Bet $visible={step === 0}>
          <Paragraph>Ставка</Paragraph>
          <div className="bottom-row">
            <Range>
              <div
                className="calculator"
                style={{
                  left: `calc(${formData.bid_amount}%)`,
                  transform: `translateX(-${formData.bid_amount}%)`,
                }}
              >
                {formData.bid_amount * 10}
              </div>
              <div
                className="range1"
                style={{
                  left: `calc(${formData.bid_amount}%)`,
                  transform: `translateX(-${formData.bid_amount}%) translateY(-50%)`,
                }}
              />
            </Range>

            <input
              type="range"
              min={10}
              step={1}
              max={100}
              value={formData.bid_amount}
              onChange={(e) => {
                setFormData({ ...formData, bid_amount: +e.target.value });
              }}
              style={{
                opacity: 0,
                cursor: "pointer",
                pointerEvents: "auto",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div className="row">
            <Button
              onClick={() => {
                setStep(1);
                setHeight(window.innerHeight * 0.9);
              }}
            >
              Далее
            </Button>
          </div>
        </Bet>
        <Bet $visible={step === 1}>
          <Paragraph>Игроки</Paragraph>
          <div className="row">
            {[2, 3, 4, 5].map((i) => (
              <Button
                style={{
                  width: "auto",
                  flex: 1,
                }}
                onClick={() => {
                  if (i >= 3) {
                    setFormData({
                      ...formData,
                      players_count: i,
                      walker: "neighbors",
                    });
                  } else {
                    setFormData({ ...formData, players_count: i });
                  }
                }}
                className={formData.players_count !== i ? "outline" : ""}
                key={i}
              >
                {i}
              </Button>
            ))}
            <Button
              onClick={() => setFormData({ ...formData, players_count: 6 })}
              className={formData.players_count !== 6 ? "outline" : ""}
            >
              6
            </Button>
          </div>
          <Paragraph>Колода</Paragraph>
          <div className="row">
            {[24, 36, 52].map((i) => (
              <Button
                style={{
                  width: "auto",
                  flex: 1,
                }}
                onClick={() => setFormData({ ...formData, cards_count: i })}
                className={formData.cards_count !== i ? "outline" : ""}
                key={i}
              >
                {i}
              </Button>
            ))}
          </div>
          <Paragraph>Скорость</Paragraph>
          <div className="row">
            {[
              { title: "Обычная", name: "normal" },
              {
                title: "Быстрая",
                name: "fast",
              },
            ].map((i) => (
              <Button
                style={{
                  width: "auto",
                  flex: 1,
                }}
                onClick={() => setFormData({ ...formData, speed: i.name })}
                className={formData.speed !== i.name ? "outline" : ""}
                key={i.name}
              >
                {i.title}
              </Button>
            ))}
          </div>
          <Paragraph>Режим игры</Paragraph>
          {[
            {
              inputs: [
                { title: "Подкидной", name: "podkidnoy" },
                { title: "Переводной", name: "perevodnoy" },
              ],
              name: "mode",
            },
            {
              inputs: [
                { title: "Соседи", name: "neighbors" },
                { title: "Все", name: "everyone" },
              ],
              name: "walker",
            },
            {
              inputs: [
                { title: "С шулерами", name: "cheat" },
                { title: "Честная игра", name: "honest" },
              ],
              name: "walker_with",
            },
          ].map((i) => (
            <div className="row" key={i.name}>
              {i.inputs.map((input) => (
                <Button
                  style={{
                    width: "auto",
                    flex: 1,
                  }}
                  data-name={i.name}
                  onClick={() => {
                    if (i.name === "walker" && formData.players_count <= 3) {
                      setFormData({ ...formData, [i.name]: "neighbors" });
                    } else {
                      setFormData({ ...formData, [i.name]: input.name });
                    }
                  }}
                  key={input.name + i.name}
                  className={formData[i.name] !== input.name ? "outline" : ""}
                >
                  {input.title}
                </Button>
              ))}
            </div>
          ))}

          <Paragraph>Игра для друзей</Paragraph>
          <div className="row">
            {[
              { title: "Да", name: 1 },
              { title: "Нет", name: 0 },
            ].map((i) => (
              <Button
                style={{
                  width: `calc(50% - ${sizeCalculator(10)})`,
                }}
                onClick={() =>
                  setFormData({ ...formData, is_for_friends: i.name })
                }
                className={formData.is_for_friends !== i.name ? "outline" : ""}
                key={i.name}
              >
                {i.title}
              </Button>
            ))}
          </div>
          <div className="row">
            <Button
              onClick={() => {
                setStep(0);
                setHeight(200);
              }}
              className="outline"
              style={{
                width: `auto`,
              }}
            >
              Назад
            </Button>
            <Button
              style={{
                flex: 1,
              }}
              onClick={handleCreateGame}
            >
              Создать игру
            </Button>
          </div>
        </Bet>
      </Body>
    </Container>
  );
};

export default NewGameParams;
