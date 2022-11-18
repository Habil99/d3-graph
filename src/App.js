import './App.css';
import { useEffect } from "react";
import D3Graph from "./d3/D3Graph";

function App() {

  useEffect(() => {
    const d3Graph = new D3Graph();
  }, [])

  return (
    <svg></svg>
  );
}

export default App;
