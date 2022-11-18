import './App.css';
import D3Graph from "./main.js";
import { useEffect, useState } from "react";


function App() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const d3Graph = new D3Graph();
    const radius = 45;
    const nodes = [
      {
        id: 1,
        clipId: 'clip1',
        name: 'Node 1',
        x: window.innerWidth / 2 - 250,
        y: window.innerHeight / 2 - 350,
        r: radius,
        color: 'red',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'

      },
      {
        id: 2,
        clipId: 'clip2',
        name: 'Node 2',
        x: window.innerWidth / 2 + radius,
        y: window.innerHeight / 2 - radius,
        r: radius,
        color: 'green',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        dangerous : 70
      },
      {
        id: 3,
        clipId: 'clip3',
        name: 'Node 3',
        x: window.innerWidth / 2 + 150,
        y: window.innerHeight / 2 + 250,
        r: radius,
        color: 'green',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
      },
    ]

    nodes.forEach(node => {
      d3Graph.createCircleWithImage(node.x, node.y, node.r, node.image, node.clipId , node.dangerous);
    })

    d3Graph.connectAllNodes(nodes)
    // d3Graph.initZoom();
  }, [])

  return (
    <svg></svg>
  );
}

export default App;
