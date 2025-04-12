
import { Route, Routes } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { System } from "./ui/page/system";
import { Process } from "./ui/page/process";
import { Network } from "./ui/page/network";
import { Navbar } from "./ui/component/Navbar";

function App() {



  return (
    <div className="container mx-auto bg-gray-700">
      <Navbar />
      <Routes>
        <Route path="/" element={<System />}></Route>
        <Route path="process" element={<Process />}></Route>
        <Route path="network" element={<Network />}></Route>
      </Routes>
    </div>
  );
}

export default App;
