import { Routes, Route, useLocation } from "react-router-dom";
import routes from "./pages/routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ExitModal from "./components/ExitModal";
import ProfileModal from "./components/Profile";
import SettingsModal from "./components/SettingsModal";
import LogoutModal from "./components/LogoutModal";
import AvatarModal from "./components/AvatarModal";
import ShareModal from "./components/ShareModal";
import GiveUpModal from "./components/GiveUpModal";
import PaymentModal from "./components/PaymentModal";
import { useCallback, useEffect } from "react";
import { request } from "./service/api";
import { setUser } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import { setMyProducts, setProducts } from "./redux/productsSlice";
import { useSelector } from "react-redux";

function App() {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isHeaderVisible = !["/", "/game", "/finding-opponent"].includes(
    pathname
  );

  const tele = window?.Telegram?.WebApp;

  // Telegram Web App Initialization
  useEffect(() => {
    if (tele?.initDataUnsafe?.user) {
      tele?.ready();
      tele?.expand();
      tele?.BackButton.show();
      tele?.SettingsButton.hide();
      tele?.setHeaderColor("#0B0914");
      tele?.setBackgroundColor("#0B0914");
      tele?.enableClosingConfirmation();
      tele?.disableVerticalSwipes();
      tele?.enableVerticalSwipes();
      tele?.MainButton.hide();
      tele.BackButton.onClick(() => {
        tele.close();
      });

      tele?.lockOrientation();
    }
  }, [tele]);

  useEffect(() => {
    const getUser = () => {
      if (token) {
        request
          .get("/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data }) => {
            dispatch(setUser({ ...data.data, token }));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const interval = setInterval(() => {
      getUser();
    }, 100 * 60 * 5); // 5 seconds
    return () => clearInterval(interval);
  }, [dispatch, token]);

  const getProducts = useCallback(() => {
    request
      .get("api/product/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(setProducts(data?.data));
      })
      .catch((err) => {
        console.error(err);
      });

    request
      .get("api/product/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(setMyProducts(data?.data));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch, token]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <PaymentModal />
      <GiveUpModal />
      <ShareModal />
      <AvatarModal />
      <LogoutModal />
      <SettingsModal />
      <ExitModal />
      <ProfileModal />
      {isHeaderVisible ? <Header /> : null}
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
      {isHeaderVisible ? <Footer /> : null}
    </>
  );
}

export default App;
