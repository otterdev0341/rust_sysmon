import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RamProvider } from "./context/ram_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RamProvider>
        <App />
      </RamProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
