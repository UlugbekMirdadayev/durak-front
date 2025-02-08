import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useState, useRef, useCallback, useEffect } from "react";
import { setLogoutVisible } from "../redux/logoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { setSettingVisible } from "../redux/settingsSlice";
import { request } from "../service/api";
import { setUser } from "../redux/userSlice";

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

  h1 {
    color: #090909;
    font-size: ${sizeCalculator(16)};
    font-weight: 700;
    line-height: ${sizeCalculator(19)};
  }

  p {
    margin-bottom: ${sizeCalculator(10)};
    color: #5e5e5e;
    font-size: ${sizeCalculator(10)};
    font-weight: 400;
    line-height: ${sizeCalculator(14)};
  }

  .row {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(20)};

    button {
      width: 50%;
      padding: ${sizeCalculator(11)};
      border-radius: ${sizeCalculator(10)};
      font-size: ${sizeCalculator(16)};
      font-weight: 500;
      line-height: ${sizeCalculator(24)};
      border: ${sizeCalculator(1)} solid #10a5f7;
      background: #10a5f7;
      color: #fff;
      cursor: pointer;
      transition: 0.3s;

      &:active {
        transform: scale(0.95);
      }

      &:nth-child(2) {
        background: #fff;
        border-color: #e8e8e8;
        color: #10a5f7;
      }
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

const LogoutModal = () => {
  const [{ connector }] = useTonConnectUI();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const visible = useSelector((state) => state?.logout);
  const [height, setHeight] = useState(155); // Initial height in calculated units
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
      dispatch(setLogoutVisible(newHeight > 70));
      dispatch(setSettingVisible(newHeight < 70));
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
      setHeight(155);
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

  const token = useSelector((state) => state?.user?.token);

  const onLogout = (e) => {
    connector.disconnect();
    navigate("/");
    dispatch(setLogoutVisible(false));
    dispatch(setSettingVisible(false));
    dispatch(setUser({}));
    localStorage.clear();
    request
      .get("/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    e.stopPropagation();
  };

  return (
    <Container $visible={visible}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body style={{ height: sizeCalculator(height) }}>
        <h1 className="roboto">Выйти из аккаунта</h1>
        <p className="roboto">Вы точно хотите покинуть свой аккаунт?</p>
        <div
          className="row"
          onClick={() => {
            dispatch(setLogoutVisible(false));
            dispatch(setSettingVisible(true));
          }}
        >
          <button aria-label="Cancel Exit">Нет</button>
          <button aria-label="Confirm Exit" onClick={onLogout}>
            Да
          </button>
        </div>
      </Body>
    </Container>
  );
};

export default LogoutModal;
