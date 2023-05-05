import "./App.css";
import { useEffect } from "react";
import DirectedNetworkGraph from "./neo4j/index";
import { Graph } from "react-d3-graph";
import data from "./neo4j/data.json";

function App() {
  // useEffect(() => {
  //   const graph = new DirectedNetworkGraph();
  //   graph.draw();
  // }, []);

  const downloadLinksAndNodes = (nodes, links) => {
    const json = { nodes, links };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  }

  return (
    // <div
    //   id="parent-svg"
    //   width={window.innerWidth}
    //   height={window.innerHeight}
    // ></div>
    <Graph
      id="asd"
      config={{
        width: window.innerWidth,
        height: window.innerHeight,
        nodeHighlightBehavior: true,
        node: {
          color: "lightgreen",
          size: 120,
          highlightStrokeColor: "blue",
        },
        link: {
          highlightColor: "lightblue",
        },
        d3: {
          alphaTarget: 0.05,
          gravity: -100,
          linkLength: 100,
          linkStrength: 1,
        },
        highlightDegree: 2,
        directed: true,
      }}
      data={{
        nodes: data.nodes,
        links: data.links,
      }}
    />
  );
}

export default App;
