import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useState, useRef, useCallback, useEffect } from "react";
import { setSettingParams, setSettingVisible } from "../redux/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { TelegramIcon2, YoutubeIcon } from "../assets/images/svgs";
import { setLogoutVisible } from "../redux/logoutSlice";

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

const Body = styled.div`
  border-radius: ${sizeCalculator(10)} ${sizeCalculator(10)} 0 0;
  background: #fff;
  width: 100%;
  display: flex;
  padding: ${sizeCalculator(22)} ${sizeCalculator(15)};
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  overflow: scroll;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      color: #090909;
      font-size: ${sizeCalculator(16)};
      font-weight: 700;
      line-height: ${sizeCalculator(19)};
    }

    p {
      color: #5e5e5e;
      font-size: ${sizeCalculator(12)};
      font-weight: 500;
      line-height: ${sizeCalculator(14)};
      text-decoration-line: underline;
    }
  }
  .row {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(10)};

    svg {
      cursor: pointer;
      width: ${sizeCalculator(24)};
      height: ${sizeCalculator(24)};
      transition: 0.3s;
      &:active {
        transform: scale(0.9);
      }
    }
  }
  .bottom-row {
    width: calc(100% + ${sizeCalculator(20)});
    margin: ${sizeCalculator(20)} 0;
    position: relative;
    left: ${sizeCalculator(-10)};
    .calculator {
      position: absolute;
      bottom: calc(100% + ${(10 / 390) * 100}vw);
      padding: ${(5 / 390) * 100}vw;
      border-radius: ${(40 / 390) * 100}vw;
      background-color: #0098ea;
      color: rgb(255, 255, 255);
      font-size: ${(10 / 390) * 100}vw;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: 1000ms cubic-bezier(0.165, 0.84, 0.44, 1) opacity;
      width: max-content;
    }
    input {
      width: 100%;
      height: ${(8 / 390) * 100}vw;
      background: rgba(255, 255, 255, 0.1);
      border-radius: ${(2 / 390) * 100}vw;
      outline: none;
      transition: 300ms ease;
      color: #090909;
      &::-webkit-slider-thumb {
        appearance: none;
        width: ${(32 / 390) * 100}vw;
        height: ${(32 / 390) * 100}vw;
        border-radius: 50%;
        background: rgb(0, 152, 234);
        cursor: pointer;
      }
    }
  }
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${sizeCalculator(7)};
  border: ${sizeCalculator(1)} solid #e8e8e8;
  background: #fff;
  padding: ${sizeCalculator(2)};
  position: relative;
  gap: ${sizeCalculator(2)};

  .shape {
    width: calc(50% - ${sizeCalculator(4)});
    height: calc(100% - ${sizeCalculator(4)});
    background: linear-gradient(88deg, #0198ea 0%, #14bcfa 100%);
    border-radius: ${sizeCalculator(7)};
    transition: 0.3s;
    position: absolute;
    top: ${sizeCalculator(2)};
    left: ${sizeCalculator(2)};
    pointer-events: none;
  }

  button {
    display: flex;
    padding: ${sizeCalculator(8)} ${sizeCalculator(20)};
    justify-content: center;
    align-items: center;
    font-weight: 500;
    flex: 1;
    color: #32484d;
    font-size: ${sizeCalculator(16)};
    border-radius: ${sizeCalculator(5)};
    line-height: ${sizeCalculator(24)};
    border: 0;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
    &:active {
      transform: scale(0.95);
    }
    &.active {
      color: #fff;
      background: none;
      z-index: 1;
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

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: transparent;
  z-index: -1;
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
  .inner {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgb(0, 152, 234) 100%,
      rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 100% 100%;
    background-position: 100% 0;
    border-radius: ${(2 / 390) * 100}vw;
    z-index: 1;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      right: -${(12 / 390) * 100}vw;
      transform: translateY(-50%);
      width: ${(24 / 390) * 100}vw;
      height: ${(24 / 390) * 100}vw;
      background: #0098ea;
      border-radius: 50%;
      z-index: 3;
    }
  }
`;

const SettingsModal = () => {
  const { visible, params } = useSelector((state) => state?.settings);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [height, setHeight] = useState(window.innerHeight - 200); // Initial height in calculated units
  const startHeightRef = useRef(height); // Reference to track initial height
  const startYRef = useRef(0); // Reference to track initial Y position

  const onMouseMove = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault(); // Faqat cancelable bo'lsa defaultni bloklash

      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const diff = startYRef.current - clientY;
      const newHeight = Math.max(
        0,
        Math.min(window.innerHeight, startHeightRef.current + diff)
      );
      dispatch(setSettingVisible(newHeight > 70));
      setHeight(
        window.innerHeight - newHeight >
          (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
          ? newHeight
          : newHeight -
              (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (visible) {
      setHeight(window.innerHeight - 200);
    }
  }, [visible]);

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

  return (
    <Container $visible={visible}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body style={{ height: sizeCalculator(height) }}>
        <header>
          <h1 className="roboto">Настройки</h1>
          <p
            className="underline"
            onClick={() => {
              dispatch(setSettingVisible(false));
              dispatch(setLogoutVisible(true));
            }}
          >
            Выйти из аккаунта
          </p>
        </header>
        <div className="row">
          <TelegramIcon2
            onClick={() => window.open("https://t.me/", "_blank")}
          />
          <YoutubeIcon
            onClick={() => window.open("https://www.youtube.com/", "_blank")}
          />
        </div>
        <p>Музыка</p>
        <div className="bottom-row">
          <div
            className="calculator"
            style={{
              left: `calc(${params.musics}%)`,
              transform: `translateX(-${params.musics}%)`,
            }}
          >
            {params.musics}
          </div>

          <Range>
            <div className="inner" style={{ width: `${params.musics}%` }} />
          </Range>

          <input
            type="range"
            min={0}
            step={1}
            max={100}
            value={params.musics}
            onChange={(e) =>
              dispatch(
                setSettingParams({
                  musics: e.target.value,
                  effects: params.effects,
                })
              )
            }
            style={{ opacity: 0, cursor: "pointer" }}
          />
        </div>
        <p>Звуковые эффекты</p>
        <div className="bottom-row">
          <div
            className="calculator"
            style={{
              left: `calc(${params.effects}%)`,
              transform: `translateX(-${params.effects}%)`,
            }}
          >
            {params.effects}
          </div>

          <Range>
            <div className="inner" style={{ width: `${params.effects}%` }} />
          </Range>

          <input
            type="range"
            min={0}
            step={1}
            max={100}
            value={params.effects}
            onChange={(e) =>
              dispatch(
                setSettingParams({
                  musics: params.musics,
                  effects: e.target.value,
                })
              )
            }
            style={{ opacity: 0, cursor: "pointer" }}
          />
        </div>
        <Tab>
          {["RU", "EN"].map((label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : undefined}
              onClick={() => setTab(index)}
            >
              {label}
            </button>
          ))}
          <div
            className={"shape"}
            style={{
              left: `calc(${50 * tab}% + ${sizeCalculator(tab ? 2 : 0)})`,
            }}
          />
        </Tab>
      </Body>
    </Container>
  );
};

export default SettingsModal;
