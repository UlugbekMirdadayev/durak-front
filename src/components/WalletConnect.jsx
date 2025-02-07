import { useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import { TelegramIcon, TonIcon } from "../assets/images/svgs";
import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { request } from "../service/api";

const ButtonInner = styled.span`
  color: #fff;
  text-align: center;
  font-size: ${sizeCalculator(16)};
  font-weight: 500;
  line-height: ${sizeCalculator(24)};
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${sizeCalculator(10)};
  background: #10a5f7;
  padding: ${sizeCalculator(9)};
  width: calc(100% - ${sizeCalculator(64)});
  border: none;
  margin-top: ${sizeCalculator(20)};
  gap: ${sizeCalculator(9)};
  cursor: pointer;
  transition: 0.3s;
  &:active {
    scale: 0.95;
    background: #0098eb;
  }
`;

const WalletConnect = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { open } = useTonConnectModal();
  const [{ account, connector }] = useTonConnectUI();

  const setWallet = useCallback(() => {
    setLoading(true);
    request
      .post(
        "api/user/set/wallet",
        {
          wallet_address: account?.address,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then(({ data }) => {
        dispatch(setUser({ ...data?.data, token: user?.token }));
      })
      .catch((error) => {
        alert(error?.response?.data?.message || "Ошибка сервера");
      })
      .finally(() => setLoading(false));
  }, [account?.address, dispatch, user?.token]);

  useEffect(() => {
    if (account?.address && !user?.wallet_address) {
      setWallet();
    }
  }, [account?.address, setWallet, user?.wallet_address]);

  const handleClick = () => {
    if (connector.connected && user?.wallet_address) {
      //   connector.disconnect();
      navigate("/create-game");
    } else {
      connector.disconnect();
      open();
      console.error("Error during wallet operation:");
    }
  };

  return (
    <Button onClick={handleClick}>
      <TelegramIcon />
      <ButtonInner className="roboto">
        {loading
          ? "Загрузка..."
          : account?.address
          ? "Подключено"
          : "Авторизоваться"}
      </ButtonInner>
      <TonIcon />
    </Button>
  );
};

export default WalletConnect;
