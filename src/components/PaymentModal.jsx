import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useState, useRef, useCallback, useEffect } from "react";
import { setPaymentModal } from "../redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import qrcode from "../assets/images/qr-code.png";
import dollar from "../assets/images/dollar.png";
import { AlertIcon, CopyIcon, TonIcon2 } from "../assets/images/svgs";
import { request } from "../service/api";
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
    color: #5e5e5e;
    font-size: ${sizeCalculator(12)};
    font-style: normal;
    font-weight: 500;
    line-height: ${sizeCalculator(14)}; /* 116.667% */
    letter-spacing: ${sizeCalculator(1)};

    span {
      color: #000;
    }
  }
  p {
    color: #5e5e5e;
    font-size: ${sizeCalculator(10)};
    font-style: normal;
    font-weight: 500;
    line-height: ${sizeCalculator(14)}; /* 116.667% */
    letter-spacing: ${sizeCalculator(1)};
  }
  .row-text {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(10)};
    .ton-coin {
      width: ${sizeCalculator(24)};
      height: ${sizeCalculator(24)};
      path {
        &:first-child {
          fill: #0098ea;
          stroke: #fff;
        }
        &:last-child {
          fill: #fff;
        }
      }
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${sizeCalculator(20)};
    margin-bottom: ${sizeCalculator(5)};
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

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizeCalculator(10)};
  border: ${sizeCalculator(1)} solid #e5e5e5;
  border-radius: ${sizeCalculator(5)};
  padding: ${sizeCalculator(5)};
  input {
    border: none;
    background: transparent;
    font-size: ${sizeCalculator(16)};
    font-style: normal;
    font-weight: 500;
    line-height: ${sizeCalculator(19)}; /* 116.667% */
    letter-spacing: ${sizeCalculator(1)};
    width: 100%;
    color: #090909;
  }
  svg {
    cursor: pointer;
    width: ${sizeCalculator(24)};
    height: ${sizeCalculator(24)};
  }
`;

const QrCode = styled.img.attrs({ src: qrcode, alt: "QR Code" })`
  width: ${sizeCalculator(133)};
  height: ${sizeCalculator(133)};
  margin: ${sizeCalculator(20)} auto;
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
  margin: ${sizeCalculator(20)} 0;

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

const DollarImage = styled.img.attrs({ src: dollar, alt: "Dollar" })`
  width: ${sizeCalculator(19)};
  height: ${sizeCalculator(19)};
  object-fit: contain;
  filter: invert(1);
`;

const RowPercents = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${sizeCalculator(7)};
  border: ${sizeCalculator(1)} solid #e8e8e8;
  padding: ${sizeCalculator(2)};
  button {
    border: 0;
    background: none;
    color: #32484d;
    font-size: ${sizeCalculator(12)};
    font-style: normal;
    font-weight: 500;
    line-height: ${sizeCalculator(24)};
    background: transparent;
    border-radius: ${sizeCalculator(5)};
    padding: 0 ${sizeCalculator(5)};
    cursor: pointer;
    transition: 0.3s;
    &:active {
      transform: scale(0.95);
    }
    &.active {
      background: #0198ea;
      color: #fff;
    }
  }
`;

const PaymentModal = () => {
  const dispatch = useDispatch();
  const { paymentModal: visible } = useSelector((state) => state?.profile);
  const [height, setHeight] = useState(490); // Initial height in calculated units
  const [tab, setTab] = useState(0);

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
      dispatch(setPaymentModal(newHeight > 70));
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
      setHeight(490);
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

  const handleWithdraw = (amount) => {
    const toastId = toast.loading("Пожалуйста, подождите...");
    request
      .get(`/api/transaction/make?amount=${amount}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then(({ data }) => {
        toast.update(toastId, {
          render: data?.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        console.log(data);
      })
      .catch((err) => {
        toast.update(toastId, {
          render: err?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      });
  };

  const user = useSelector((state) => state?.user);
  const [amount, setAmount] = useState(1000);

  return (
    <Container $visible={visible}>
      <Overlay onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Handler onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
      <Body style={{ height: sizeCalculator(height) }}>
        {tab ? (
          <>
            <h1 className="roboto">Вывод средств с помощью блокчейна</h1>
            <p className="roboto">
              Прямой вывод средств с помощью блокчейна может занять до 10 минут.
              Пожалуйста, наберитесь терпения!
            </p>
            <h1 style={{ marginTop: sizeCalculator(20) }}>
              Адрес для вывода средств
            </h1>
            <InputRow
              style={{
                border: 0,
                borderBottom: `${sizeCalculator(1)} solid #090909`,
                borderRadius: 0,
              }}
            >
              <input
                type="text"
                style={{
                  fontWeight: 500,
                }}
                placeholder={"Введите свой адрес"}
                defaultValue={user?.wallet_address}
              />
            </InputRow>
            <div className="row">
              <h1>Сумма вывода</h1>
              <h1>Сумма: 2 TON</h1>
            </div>
            <InputRow
              style={{
                border: 0,
                borderBottom: `${sizeCalculator(1)} solid #090909`,
                borderRadius: 0,
              }}
            >
              <DollarImage />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <RowPercents>
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <button
                    key={percent}
                    className={percent === "100%" ? "active" : undefined}
                  >
                    {percent}
                  </button>
                ))}
              </RowPercents>
            </InputRow>
          </>
        ) : (
          <>
            <h1 className="roboto">Вывод средств с помощью блокчейна</h1>
            <p className="roboto">
              Прямой вывод средств с помощью блокчейна может занять до 10 минут.
              Пожалуйста, наберитесь терпения!
            </p>
            <QrCode />
            <h1 className="roboto">Ваш личный адрес для внесения депозита</h1>
            <InputRow>
              <input type="text" defaultValue={"12345678901234567890"} />
              <CopyIcon
                onClick={() => {
                  navigator.clipboard
                    .writeText("12345678901234567890")
                    .then(() => {
                      alert("Copied to clipboard");
                    })
                    .catch((err) => {
                      alert("Failed to copy: " + err?.message);
                    });
                }}
              />
            </InputRow>
          </>
        )}
        <div className="row-text">
          <h1 className="roboto">
            <span>500</span> Игровой валюты равен:
          </h1>
          <TonIcon2 className="ton-coin" />
          <h1 className="roboto">
            <span>1TON</span>
          </h1>
        </div>
        <Tab
          style={{
            margin: "0",
          }}
        >
          {["Депозит", "Вывод"].map((label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : undefined}
              onClick={() => {
                setTab(index);
                setHeight(index ? 430 : 490);
              }}
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
        {tab ? (
          <Tab
            style={{
              border: "none",
              margin: "0",
            }}
          >
            <div
              className="shape"
              style={{
                width: "100%",
              }}
            />
            <button className="active" onClick={() => handleWithdraw(amount)}>
              Вывести
            </button>
          </Tab>
        ) : (
          <div
            className="row-text"
            style={{
              padding: sizeCalculator([8, 16, 8, 8]),
              borderRadius: sizeCalculator(4),
              background: "#FFF8E0",
            }}
          >
            <AlertIcon />
            <p>
              Пожалуйста, внимательно проверьте адрес кошелька для пополнения
              счета!
            </p>
          </div>
        )}
      </Body>
    </Container>
  );
};

export default PaymentModal;
