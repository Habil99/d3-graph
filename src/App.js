import "./App.css";
import { useEffect } from "react";
import D3Graph from "./d3/D3Graph";
// import "./d3/ForceDirectedGraph"

function App() {
  useEffect(() => {
    const d3Graph = new D3Graph();

    // d3Graph.handleDragNodes()
  }, []);

  return <svg id="parent-svg"></svg>;
}

export default App;
