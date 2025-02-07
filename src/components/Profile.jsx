import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { setProfile, setProfileOpened } from "../redux/profileSlice";
import {
  ArrowIcon,
  ListIcons,
  PenIcon,
  TimeIcon,
  TonIcon2,
} from "../assets/images/svgs";
import { request } from "../service/api";
import { setUser } from "../redux/userSlice";
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

  h1 {
    color: #090909;
    font-size: ${sizeCalculator(16)};
    font-weight: 700;
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

const Operation = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  width: ${({ $visible }) => ($visible ? "100%" : 0)};
  transition: 0.3s;
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
    width: calc(33.33% - ${sizeCalculator(4)});
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

const Transactions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(10)};

  .label {
    color: #5e5e5e;
    font-size: ${sizeCalculator(12)};
    font-style: normal;
    font-weight: 500;
    line-height: ${sizeCalculator(14)};
    letter-spacing: ${sizeCalculator(1)};
    margin-top: ${sizeCalculator(12)};
  }
`;

const Card = styled.div`
  padding: ${sizeCalculator(8)} ${sizeCalculator(10)};
  border-radius: ${sizeCalculator(8)};
  border: ${sizeCalculator(1)} solid #e8e8e8;
  background: #edf0f7;
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(10)};

  .row {
    justify-content: space-between;
    gap: ${sizeCalculator(2)};

    span {
      color: #98b0ba;
      font-size: ${sizeCalculator(10)};
      font-style: normal;
      font-weight: 400;
      line-height: ${sizeCalculator(14)}; /* 140% */
    }

    p {
      color: #616161;
      font-size: ${sizeCalculator(10)};
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    svg {
      width: ${sizeCalculator(14)};
      height: ${sizeCalculator(14)};
      path {
        stroke: #5e5e5e;
      }
      &.toncoin {
        width: ${sizeCalculator(12)};
        height: ${sizeCalculator(12)};
        fill: #fff;
        path {
          stroke: #0098eb;
        }
      }
    }
  }
`;

const Back = styled.button`
  display: flex;
  align-items: center;
  gap: ${sizeCalculator(5)};
  border: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
  svg {
    transition: all 0.3s;
    width: ${sizeCalculator(14)};
    height: ${sizeCalculator(14)};
    rotate: 180deg;
    transform-origin: center;
  }
  &:active {
    svg {
      margin-left: ${sizeCalculator(-15)};
    }
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: ${({ $visible }) => ($visible ? "100%" : 0)};

  .list {
    display: flex;
    padding: ${sizeCalculator(7.5)} 0;
    gap: ${sizeCalculator(15)};
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: 0.3s;
    border-bottom: ${sizeCalculator(1)} solid #efeff4;
    &:first-child {
      border-top: ${sizeCalculator(1)} solid #efeff4;
    }

    .left {
      display: flex;
      align-items: center;
      gap: ${sizeCalculator(15)};
    }
    svg {
      width: ${sizeCalculator(30)};
      height: ${sizeCalculator(30)};
    }
    span {
      color: rgba(60, 60, 67, 0.6);
      font-size: ${sizeCalculator(17)};
      font-weight: 400;
      line-height: ${sizeCalculator(22)};
    }
    &.button {
      &:active {
        background-color: #f2f2f7;
        transform: scale(0.98);
      }
      * {
        color: #10a5f7;
      }
      svg {
        &:nth-child(2) {
          width: ${sizeCalculator(7)};
          height: ${sizeCalculator(12)};
        }
      }
    }
  }
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
  }
`;

const Statistics = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: ${({ $visible }) => ($visible ? "100%" : 0)};
`;

const Hr = styled.div`
  height: ${sizeCalculator(10)};
  width: 100%;
  border-bottom: ${sizeCalculator(1)} solid #efeff4;
`;

const FindFriends = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: ${({ $visible }) => ($visible ? "100%" : 0)};
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(5)};
  label {
    color: #7e7e82;
    font-size: ${sizeCalculator(15)};
    font-weight: 400;
    line-height: normal;
    letter-spacing: ${sizeCalculator(-0.24)};
  }
  select,
  input {
    padding: ${sizeCalculator(10)};
    border-radius: ${sizeCalculator(10)};
    border: ${sizeCalculator(1)} solid #e8e8e8;
    font-size: ${sizeCalculator(15)};
    font-weight: 400;
    line-height: ${sizeCalculator(22)};
    appearance: none;
    color: #090909;
  }
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' style='rotate:90deg' height='24' fill='%23000000' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5H7z' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right center;
    background-size: ${sizeCalculator(20)};
    border: 0;
    border-radius: 0;
    padding: ${sizeCalculator(10)} 0;
    border-bottom: ${sizeCalculator(1)} solid #090909;
  }
`;

const ProfilName = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: ${({ $visible }) => ($visible ? "100%" : 0)};
`;

const Complain = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(20)};
  position: ${({ $visible }) => ($visible ? "relative" : "absolute")};
  left: ${({ $visible }) => ($visible ? 0 : "-100%")};
  transition: 0.3s;
  width: ${({ $visible }) => ($visible ? "100%" : 0)};
`;

const ProfileModal = () => {
  const user = useSelector((state) => state?.user);
  const list = [
    {
      label: "Максимальный выигрыш",
      value: "" + user?.max_win_amount,
    },

    {
      label: "Последний выигрыш",
      value: "" + user?.last_win_amount,
    },
    {
      label: "Всего игр",
      value: user?.all_games_count,
    },

    {
      label: "Всего побед",
      value: user?.all_games_win_count,
    },
    {
      label: "Найти друга",
      value: null,
      page: "find-friend",
    },

    {
      label: "Операции",
      value: null,
      page: "transactions",
    },
    {
      label: "Статистика игр",
      value: null,
      page: "statistics",
    },
  ];
  const dispatch = useDispatch();
  const { opened, profile } = useSelector(({ profile }) => profile);
  const [height, setHeight] = useState(
    window.innerHeight * 0.9 -
      (window?.Telegram?.WebApp?.contentSafeAreaInset?.top || 60)
  ); // Initial height in calculated units
  const startHeightRef = useRef(height); // Reference to track initial height
  const startYRef = useRef(0); // Reference to track initial Y position
  const bodyRef = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault(); // Faqat cancelable bo'lsa defaultni bloklash

      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const diff = startYRef.current - clientY;
      const newHeight = Math.max(
        0,
        Math.min(window.innerHeight, startHeightRef.current + diff)
      );
      dispatch(setProfileOpened(newHeight > 70));
      if (!(newHeight > 70)) {
        dispatch(setProfile({}));
      }
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
    if (opened) {
      setHeight(window.innerHeight * 0.9 - 60);
    }
  }, [opened]);

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

  const [tab, setTab] = useState(0);
  const [activeProfile, setActiveProfile] = useState("all");
  const [block, setBlock] = useState(false);
  const token = useSelector((state) => state?.user?.token);
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
      });
    }
  }, [opened, activeProfile]);
  return (
    <Container $visible={opened}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body ref={bodyRef} style={{ height: sizeCalculator(height) }}>
        <Profile $visible={activeProfile === "all"}>
          <UserInformation>
            <img src={user?.user_photo} alt="Avatar" loading="lazy" />

            <div className="info">
              <h1
                onClick={() => {
                  if (profile?.name) return;
                  setActiveProfile("profil-name");
                  setHeight(220);
                }}
                className={profile?.name ? "disabled" : undefined}
              >
                <span>{user?.first_name}</span>
                {profile?.name ? null : <PenIcon />}
              </h1>
              {/* {profile?.name ? null : <p>{user?.all_games_count} / 1000 000</p>} */}
              <p>ID: {user?.id}</p>
            </div>

            {profile?.name ? (
              <button className="primary-btn-outline">Добавить в друзья</button>
            ) : null}
          </UserInformation>
          <ul>
            {list
              ?.filter(({ value }) => value)
              .map(({ label, value }, index) => (
                <div className="list" key={label}>
                  <div className="left">
                    {ListIcons[index]}
                    <p>{label}</p>
                  </div>
                  <span>{value}</span>
                </div>
              ))}
            <Hr />
            {profile?.name ? (
              <>
                <div
                  className="list button"
                  onClick={() => setActiveProfile("complain")}
                >
                  <div className="left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="30"
                      viewBox="0 0 29 30"
                      fill="none"
                    >
                      <rect
                        y="0.5"
                        width="29"
                        height="29"
                        rx="6"
                        fill="#0A84FF"
                      />
                      <mask
                        id="mask0_1_5412"
                        maskUnits="userSpaceOnUse"
                        x="3"
                        y="3"
                        width="24"
                        height="25"
                      >
                        <rect
                          x="3"
                          y="3.5"
                          width="24"
                          height="24"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_1_5412)">
                        <path
                          d="M18.3123 14.1155C18.6233 14.1155 18.8862 14.0066 19.101 13.7887C19.3157 13.5709 19.423 13.3065 19.423 12.9955C19.423 12.6843 19.3142 12.4214 19.0965 12.2068C18.8787 11.9919 18.6143 11.8845 18.3033 11.8845C17.9921 11.8845 17.7292 11.9934 17.5145 12.2113C17.2997 12.4291 17.1923 12.6935 17.1923 13.0045C17.1923 13.3157 17.3012 13.5786 17.519 13.7932C17.7367 14.0081 18.0011 14.1155 18.3123 14.1155ZM11.6968 14.1155C12.0079 14.1155 12.2708 14.0066 12.4855 13.7887C12.7003 13.5709 12.8078 13.3065 12.8078 12.9955C12.8078 12.6843 12.6988 12.4214 12.481 12.2068C12.2633 11.9919 11.9989 11.8845 11.6878 11.8845C11.3768 11.8845 11.1138 11.9934 10.899 12.2113C10.6843 12.4291 10.577 12.6935 10.577 13.0045C10.577 13.3157 10.6858 13.5786 10.9035 13.7932C11.1213 14.0081 11.3858 14.1155 11.6968 14.1155ZM15 17C14.0462 17 13.1677 17.2632 12.3645 17.7895C11.5612 18.3157 10.9576 19.014 10.5538 19.8845H19.4462C19.0424 19.014 18.4388 18.3157 17.6355 17.7895C16.8323 17.2632 15.9538 17 15 17ZM15.0033 24.5C13.7587 24.5 12.5887 24.2638 11.493 23.7915C10.3975 23.3192 9.4445 22.6782 8.634 21.8685C7.8235 21.0588 7.18192 20.1067 6.70925 19.012C6.23642 17.9175 6 16.7479 6 15.5033C6 14.2587 6.23617 13.0887 6.7085 11.993C7.18083 10.8975 7.82183 9.9445 8.6315 9.134C9.44117 8.3235 10.3933 7.68192 11.488 7.20925C12.5825 6.73642 13.7521 6.5 14.9967 6.5C16.2413 6.5 17.4113 6.73617 18.507 7.2085C19.6025 7.68083 20.5555 8.32183 21.366 9.1315C22.1765 9.94117 22.8181 10.8933 23.2908 11.988C23.7636 13.0825 24 14.2521 24 15.4967C24 16.7413 23.7638 17.9113 23.2915 19.007C22.8192 20.1025 22.1782 21.0555 21.3685 21.866C20.5588 22.6765 19.6067 23.3181 18.512 23.7908C17.4175 24.2636 16.2479 24.5 15.0033 24.5ZM15 23.5C17.2333 23.5 19.125 22.725 20.675 21.175C22.225 19.625 23 17.7333 23 15.5C23 13.2667 22.225 11.375 20.675 9.825C19.125 8.275 17.2333 7.5 15 7.5C12.7667 7.5 10.875 8.275 9.325 9.825C7.775 11.375 7 13.2667 7 15.5C7 17.7333 7.775 19.625 9.325 21.175C10.875 22.725 12.7667 23.5 15 23.5Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    <p>Пожаловаться</p>
                  </div>
                  <ArrowIcon />
                </div>
                <div className="list button" onClick={() => setBlock(!block)}>
                  <div className="left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="30"
                      viewBox="0 0 29 30"
                      fill="none"
                    >
                      <rect
                        y="0.5"
                        width="29"
                        height="29"
                        rx="6"
                        fill={block ? "#FF0000" : "#0A84FF"}
                      />
                      <mask
                        id="mask0_1_5420"
                        maskUnits="userSpaceOnUse"
                        x="3"
                        y="3"
                        width="24"
                        height="25"
                      >
                        <rect
                          x="3"
                          y="3.5"
                          width="24"
                          height="24"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_1_5420)">
                        <path
                          d="M13.916 24.9999C13.5003 24.9999 13.1124 24.9066 12.7522 24.7201C12.3921 24.5336 12.0896 24.264 11.8447 23.9114L5.71973 14.9326L5.93498 14.7229C6.14914 14.5089 6.40239 14.3929 6.69473 14.3749C6.98706 14.3569 7.25689 14.4345 7.50423 14.6076L11.0005 17.0364V8.55762C11.0005 8.41595 11.0485 8.2972 11.1445 8.20137C11.2405 8.10553 11.3594 8.05762 11.5012 8.05762C11.6431 8.05762 11.7617 8.10553 11.8572 8.20137C11.9527 8.2972 12.0005 8.41595 12.0005 8.55762V18.9634L7.58898 15.8826L12.6677 23.3384C12.8024 23.5485 12.98 23.7114 13.2005 23.8269C13.421 23.9422 13.6595 23.9999 13.916 23.9999H19.5005C20.2043 23.9999 20.797 23.7592 21.2785 23.2779C21.7598 22.7964 22.0005 22.2037 22.0005 21.4999V8.99987C22.0005 8.8582 22.0485 8.73945 22.1445 8.64362C22.2405 8.54778 22.3594 8.49987 22.5012 8.49987C22.6431 8.49987 22.7617 8.54778 22.8572 8.64362C22.9527 8.73945 23.0005 8.8582 23.0005 8.99987V21.4999C23.0005 22.4717 22.6601 23.298 21.9792 23.9786C21.2986 24.6595 20.4723 24.9999 19.5005 24.9999H13.916ZM14.6735 14.9999V6.55762C14.6735 6.41595 14.7215 6.2972 14.8175 6.20137C14.9135 6.10553 15.0324 6.05762 15.1742 6.05762C15.3161 6.05762 15.4347 6.10553 15.5302 6.20137C15.6257 6.2972 15.6735 6.41595 15.6735 6.55762V14.9999H14.6735ZM18.3467 14.9999V7.55762C18.3467 7.41595 18.3946 7.2972 18.4905 7.20137C18.5865 7.10553 18.7054 7.05762 18.8472 7.05762C18.9891 7.05762 19.1078 7.10553 19.2035 7.20137C19.299 7.2972 19.3467 7.41595 19.3467 7.55762V14.9999H18.3467Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    <p style={{ color: block ? "#FF0000" : "#0A84FF" }}>
                      {block ? "Разблокировать" : "Заблокировать"}
                    </p>
                  </div>
                  <ArrowIcon color={block ? "#FF0000" : "#0A84FF"} />
                </div>
              </>
            ) : (
              list
                ?.filter(({ value }) => !value)
                .map(({ label, page }, index) => (
                  <div
                    className="list button"
                    key={label}
                    onClick={() => {
                      if (page) setActiveProfile(page);
                      if (page === "find-friend") {
                        setHeight(250);
                      }
                    }}
                  >
                    <div className="left">
                      {
                        ListIcons[
                          list?.filter(({ value }) => value)?.length + index
                        ]
                      }
                      <p>{label}</p>
                    </div>
                    <ArrowIcon />
                  </div>
                ))
            )}
          </ul>
        </Profile>
        <Operation $visible={activeProfile === "transactions"}>
          <Back
            onClick={() => {
              setActiveProfile("all");
              setHeight(window.innerHeight * 0.9 - 60);
            }}
          >
            <ArrowIcon /> <h1 className="roboto">Операции</h1>
          </Back>
          <Tab>
            {["Всё", "Депозиты", "Выводы"].map((label, index) => (
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
              style={{ left: `calc(${33.33 * tab}% + ${sizeCalculator(2)})` }}
            />
          </Tab>
          <Transactions>
            {["Ожидает", "Успешно", "Отменено"].map((label) => (
              <React.Fragment key={label}>
                <div className="label">{label}</div>
                {[1, 2, 3].map((_, index) => (
                  <Card key={index}>
                    <div className="row">
                      <p>Номер коешлька</p>
                      <span>29.05.2024 / 19:45</span>
                    </div>
                    <div className="row">
                      <span>
                        <b>440•••••023</b>
                      </span>
                      <div className="row">
                        <p
                          style={{
                            color:
                              label === "Успешно"
                                ? "#5BA412"
                                : label === "Отменено"
                                ? "#FF5382"
                                : "#5E5E5E",
                          }}
                        >
                          3 500,00
                        </p>
                        {label === "Ожидает" ? <TimeIcon /> : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </React.Fragment>
            ))}
          </Transactions>
        </Operation>
        <Statistics $visible={activeProfile === "statistics"}>
          <Back
            onClick={() => {
              setActiveProfile("all");
              setHeight(window.innerHeight * 0.9 - 60);
            }}
          >
            <ArrowIcon /> <h1 className="roboto">Статистика игр</h1>
          </Back>
          {[1, 2, 3].map((_, index) => (
            <Card key={index}>
              <div className="row">
                <span>Дурак</span>
                <div>
                  <span>
                    <b>29.05.2024 / 19:45</b>
                  </span>
                  <div
                    className="row"
                    style={{
                      marginTop: sizeCalculator(4),
                      justifyContent: "flex-end",
                      gap: sizeCalculator(2),
                    }}
                  >
                    <p
                      style={{
                        textAlign: "right",
                        color: index !== 0 ? "#5BA412" : "#FF5382",
                      }}
                    >
                      {index !== 0 ? "+" : "-"}3 500,00
                    </p>
                    <TonIcon2 className="toncoin" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Statistics>
        <FindFriends $visible={activeProfile === "find-friend"}>
          <Back
            onClick={() => {
              setActiveProfile("all");
              setHeight(window.innerHeight * 0.9 - 60);
            }}
          >
            <ArrowIcon /> <h1 className="roboto">Найти друга</h1>
          </Back>

          <InputBox>
            <label htmlFor="find-user">Введите имя или ID</label>
            <input type="text" id="find-user" />
          </InputBox>
          <UserInformation>
            <img
              src={"https://avatars.githubusercontent.com/u/98649872?v=4"}
              alt="Avatar"
              loading="lazy"
            />
            <div className="info">
              <h1 className="disabled">
                <span>TONKA</span>
              </h1>
              <p>ID: 1234567890</p>
            </div>
            <button className="primary-btn-outline">Добавить в друзья</button>
          </UserInformation>
        </FindFriends>
        <ProfilName
          $visible={activeProfile === "profil-name"}
          onSubmit={(e) => {
            e.preventDefault();
            const firstName = e.target.name.value;
            const payload = {
              ...user,
              photo_url: user?.user_photo,
              "cf-turnstile-response": "token",
              first_name: firstName,
            };
            const toastId = toast.loading("Идет обновление имени...");

            request
              .post("/api/auth/telegram", payload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              .then(({ data }) => {
                toast.update(toastId, {
                  render: "Имя успешно обновлено",
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                });
                dispatch(
                  setUser({
                    ...data?.data?.user,

                    token: data?.data.token,
                  })
                );
              })

              .catch((err) => {
                toast.update(toastId, {
                  render: err?.response?.data?.message,
                  type: "error",
                  isLoading: false,
                  autoClose: 2000,
                });
                console.log(err);
              });
          }}
        >
          <Back
            type="button"
            onClick={() => {
              setActiveProfile("all");
              setHeight(window.innerHeight * 0.9 - 60);
            }}
          >
            <ArrowIcon /> <h1 className="roboto">Изменить имя</h1>
          </Back>
          <InputBox>
            <label htmlFor="new-name">Введите новое имя</label>
            <input
              type="text"
              id="new-name"
              defaultValue={user?.first_name}
              required
              name="name"
            />
          </InputBox>
          <div className="row">
            <button style={{ width: "100%" }} type="submit">
              Сохранить
            </button>
          </div>
        </ProfilName>

        <Complain $visible={activeProfile === "complain"}>
          <Back
            onClick={() => {
              setActiveProfile("all");
              setHeight(window.innerHeight * 0.9 - 60);
            }}
          >
            <ArrowIcon /> <h1 className="roboto">Причина жалобы</h1>
          </Back>
          <InputBox>
            <select>
              <option>Использование сторонних программ</option>
              <option>Спам</option>
              <option>Оскорбление</option>
              <option>Мошенничество</option>
              <option>Другое</option>
            </select>
          </InputBox>
          <InputBox>
            <label htmlFor="new-name">Ваше сообщение</label>
            <input type="text" placeholder="Текст сообщения" />
          </InputBox>
          <div className="row">
            <button
              style={{ width: "100%" }}
              onClick={() => {
                alert("Жалоба отправлена");
                confirm("Вы хотите заблокировать пользователя?") &&
                  setBlock(true);
                setActiveProfile("all");
              }}
            >
              Отправить
            </button>
          </div>
        </Complain>
      </Body>
    </Container>
  );
};

export default ProfileModal;
