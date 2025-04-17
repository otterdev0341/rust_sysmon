import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RamProvider } from "./context/ram_context";
import { CpuInfoProvider } from "./context/cpu_info_context";
import { CpuUsedProvider } from "./context/cpu_used_context";
import { ProcessProvider } from "./context/process_context";
import { ProcessFilterProvider } from "./context/process_filter_context";
import { PortListProvider } from "./context/port_context";
import { InterfaceTrafficProvider } from "./context/network_traffic_context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RamProvider>
        <CpuInfoProvider>
          <CpuUsedProvider>
            <ProcessProvider>
              <ProcessFilterProvider>
                <PortListProvider>
                  <InterfaceTrafficProvider>
                  <App />
                </InterfaceTrafficProvider>
              </PortListProvider>
            </ProcessFilterProvider>
          </ProcessProvider>
        </CpuUsedProvider>
        </CpuInfoProvider>
      </RamProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
