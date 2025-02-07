import styled from "styled-components";
// Images
import hand from "../assets/images/hand-with-poker.png";
import sizeCalculator from "../hook/useSizeCalculator";
import WalletConnect from "../components/WalletConnect";
import { useCallback, useEffect } from "react";
import { request } from "../service/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100dvw;
`;

const HandImage = styled.img.attrs(() => ({
  loading: "lazy",
}))`
  width: calc(100% - ${sizeCalculator(64)});
  max-width: ${sizeCalculator(400)};
  height: auto;
  object-fit: contain;
  pointer-events: none;
`;

const Title = styled.h1`
  font-size: ${sizeCalculator(64)};
  font-weight: 400;
  line-height: ${sizeCalculator(64)};
  text-align: center;
  color: #0098eb;
  text-transform: uppercase;
  margin-top: ${sizeCalculator(20)};
`;
const telegram = window.Telegram?.WebApp?.initDataUnsafe?.user || {};
const user = {
  // chat_id: 1115496160,
  // first_name: "Улугбек",
  // last_name: "",
  // username: "Ulugbek_Mirdadaev",
  // allows_write_to_pm: telegram?.allows_write_to_pm,
  // photo_url:
  //   "https://t.me/i/userpic/320/FYPIxBLeDoZB7moBU55r8_qu6qo0bWcI8yNW1k8LpnA.svg",

  // chat_id: 1115496160,
  // first_name: "Улугбек",
  // last_name: "Мирдадаев",
  // username: "Ulugbek_Mirdadaev",
  chat_id: telegram?.id,
  first_name: telegram?.first_name,
  last_name: telegram?.last_name,
  username: telegram?.username,
  allows_write_to_pm: telegram?.allows_write_to_pm,
  // photo_url: telegram?.photo_url,
  photo_url: telegram?.photo_url,

  // chat_id: 7793268248,
  // first_name: "Ulugbek Mirdadaev",
  // last_name: "Ulugbek_Mirdadaev",
  // username: "Ulugbek_Mirdadaev",
  // photo_url:
  //   "https://t.me/i/userpic/320/QHoCusARyrzQQlHv0lEO-XbkPKgfJBrcPde4i0vHnpnojaGuxQOfU5g8Ejv3CDRP.svg",
};
// Functional component
const Start = () => {
  const dispatch = useDispatch();

  const handleLogin = useCallback(async () => {
    // if (!token) return;

    const payload = {
      ...user,
      "cf-turnstile-response": "token",
    };

    try {
      const response = await request.post("/api/auth/telegram", payload);
      dispatch(
        setUser({
          ...response.data?.data?.user,
          token: response.data?.data.token,
        })
      );
    } catch (error) {
      console.error("Captcha validation error:", error);
      alert(
        "Please try again. telegram" + JSON.stringify(error?.response?.data)
      );
      localStorage.clear();
    }
  }, [dispatch]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <Container>
      <HandImage src={hand} alt="hand" />
      <Title className="russo">Дурак</Title> <WalletConnect />
    </Container>
  );
};

export default Start;
