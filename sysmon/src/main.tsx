import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RamProvider } from "./context/ram_context";
import { CpuInfoProvider } from "./context/cpu_info_context";
import { CpuUsedProvider } from "./context/cpu_used_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RamProvider>
        <CpuInfoProvider>
          <CpuUsedProvider>
          <App />
        </CpuUsedProvider>
        </CpuInfoProvider>
      </RamProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
