import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import store from "./redux/store.js";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TonConnectUIProvider
      manifestUrl="https://api-container.frensgo.org/manifest.json"
      uiPreferences={{ theme: "LIGHT" }}
    >
      <Provider store={store}>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 10000 }}
        />
        <App />
      </Provider>
    </TonConnectUIProvider>
  </BrowserRouter>
);
