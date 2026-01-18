import { useState } from "react";
import reactLogo from "@/shared/assets/images/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import { Button } from "@/shared/ui/button/button";
import { PlusIcon } from "@/shared/ui/icons";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit
          <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Button variant="secondary" size="large" iconPosition="left" icon={<PlusIcon />}>
        포트폴리오 추가
      </Button>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
