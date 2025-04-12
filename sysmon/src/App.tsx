

import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {

  async function test_clg() {
      await invoke("test_clg")
  }

  return (
    <div className="container mx-auto bg-gray-400">
      <p>test</p>
    </div>
  );
}

export default App;
