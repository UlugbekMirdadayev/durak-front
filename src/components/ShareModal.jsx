import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useState, useRef, useCallback, useEffect } from "react";
import { setShareModal } from "../redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";

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
  gap: ${sizeCalculator(10)};
  overflow: scroll;
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

const Paragraph = styled.p`
  color: #5e5e5e;
  font-size: ${sizeCalculator(12)};
  font-weight: 500;
  line-height: ${sizeCalculator(14)};
  letter-spacing: ${sizeCalculator(1)};
`;

const UserInformation = styled.div`
  display: flex;
  gap: ${sizeCalculator(15)};
  align-items: center;
  padding: ${sizeCalculator(10)} 0;
  border-top: ${sizeCalculator(1)} solid #efeff4;
  border-bottom: ${sizeCalculator(1)} solid #efeff4;
  img {
    width: ${sizeCalculator(66)};
    height: ${sizeCalculator(66)};
    border-radius: ${sizeCalculator(10)};
  }
  .info {
    display: flex;
    flex-direction: column;
    h1 {
      display: flex;
      align-items: center;
      gap: ${sizeCalculator(5)};
      color: #000;
      font-size: ${sizeCalculator(19)};
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: ${sizeCalculator(-0.5)};
      cursor: pointer;
      transition: 0.3s;
      &:not(&.disabled):active {
        transform: scale(0.95);
      }

      svg {
        width: ${sizeCalculator(24)};
        height: ${sizeCalculator(24)};
        path {
          fill: #10a5f7;
        }
      }
    }
    p {
      color: #7e7e82;
      font-size: ${sizeCalculator(15)};
      font-weight: 400;
      line-height: normal;
      letter-spacing: ${sizeCalculator(-0.24)};
    }
  }
  .primary-btn-outline {
    border: 0;
    background: none;
    color: #10a5f7;
    cursor: pointer;
    color: #10a5f7;
    font-size: ${sizeCalculator(14)};
    font-weight: 400;
    line-height: ${sizeCalculator(22)};
    margin-left: auto;
    transition: 0.3s;
    &:active {
      transform: scale(0.95);
    }
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

const ShareModal = () => {
  const dispatch = useDispatch();
  const { shareModal: visible } = useSelector((state) => state?.profile);
  const [height, setHeight] = useState(window.innerHeight - 100); // Initial height in calculated units
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
      dispatch(setShareModal(newHeight > 90));
      setHeight(
        window.innerHeight - newHeight >
          (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
          ? newHeight
          : newHeight - (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 50)
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (visible) {
      setHeight(window.innerHeight - 100);
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
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
      });
    }
  }, [visible]);

  return (
    <Container $visible={visible}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body style={{ height: sizeCalculator(height) }} ref={bodyRef}>
        <Paragraph>Пригласить друзей в игру</Paragraph>
        {Array.from({ length: 10 }).map((_, i) => (
          <UserInformation key={i}>
            <img
              src={`https://avatars.githubusercontent.com/u/${
                Math.floor(Math.random() * 10000) + i
              }`}
              alt="Avatar"
              loading="lazy"
            />
            <div className="info">
              <h1 className="disabled">
                <span>TONKA</span>
              </h1>
              <p>ID: 1234567890</p>
            </div>
            <button className="primary-btn-outline">Пригласить</button>
          </UserInformation>
        ))}
        <Button onClick={() => dispatch(setShareModal(false))}>
          Вернуться назад
        </Button>
      </Body>
    </Container>
  );
};

export default ShareModal;
