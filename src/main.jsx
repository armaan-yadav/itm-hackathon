import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import { LoadingProvider } from "./context/loadingContext";
import { ProductsProvider } from "./context/productsContext";
import { OrdersProvider } from "./context/orderContext.jsx";
import { LandContextProvider } from "./context/landContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <UserProvider>
          <ProductsProvider>
            <OrdersProvider>
              <LandContextProvider>
                <App />
              </LandContextProvider>
            </OrdersProvider>
          </ProductsProvider>
        </UserProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
