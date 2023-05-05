// neo4j with d3 js v6
import * as d3 from "d3";

import neo4jData from "./data.json";

// graph visualization like neo4j browser

const nodes = [
  {
    id: "0",
    label: "Person",
    properties: {
      person_birthday: "1950-01-01T",
      person_fin: "OISXKGE",
      person_name: "Familə",
      person_surname: "Məmmədova",
    },
  },
  {
    id: "500000",
    label: "Vehicle",
    properties: {
      vehicle_registration_plate: "60-TA-579",

      vehicle_model: "Maruti 800 AC",
      vehicle_owner: "OISXKGE",
    },
  },
  {
    id: "500001",
    label: "Vehicle",
    properties: {
      vehicle_registration_plate: "60-TA-580",

      vehicle_model: "Maruti 800 AC",
      vehicle_owner: "OISXKGE",
    },
  },
];

const links = [
  {
    source: {
      id: "0",
      label: "Person",
      properties: {
        person_birthday: "1950-01-01T",
        person_fin: "OISXKGE",
        person_name: "Familə",
        person_surname: "Məmmədova",
      },
    },
    target: {
      id: "500000",
      label: "Vehicle",
      properties: {
        vehicle_registration_plate: "60-TA-579",

        vehicle_model: "Maruti 800 AC",
        vehicle_owner: "OISXKGE",
      },
    },
    link: {
      source: "0",
      target: "500000",
      label: "OWNS",
      vehicle_registration_plate: "60-TA-579",
      vehicle_model: "Maruti 800 AC",
      vehicle_owner: "OISXKGE",
    },
  },
];

const exportNodesAndLinks = () => {
  const data = JSON.stringify({ nodes, links }, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = "graph.json";
  a.href = url;
  a.click();
}

// exportNodesAndLinks();

const init = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const parent = d3
    .select("#parent-svg")
    .attr("width", width)
    .attr("height", height);

  const svg = parent
    .append("g")
    .attr("transform", "translate(0,0)")
    .attr("width", width)
    .attr("height", height);

  const zoom = d3.zoom().on("zoom", (event) => {
    svg.attr("transform", event.transform);
  });

  parent.call(zoom);

  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().distanceMin(100).distanceMax(500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(120))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    // space between nodes
    // .force("collision", d3.forceCollide().radius(100));

  // .alphaDecay(0.01)
  // .velocityDecay(0.2);

  const graph = {
    nodes: [],
    links: [],
  };

  function destroy() {
    
  }

  // const nodes = new Map();
  // const links = new Map();

  // const addNode = (node) => {
  //   if (!nodes.has(node.id)) {
  //     nodes.set(node.id, node);
  //     graph.nodes.push(node);
  //   }
  // };

  // const addLink = (link) => {
  //   const key = `${link.source.id}-${link.target.id}`;
  //   if (!links.has(key)) {
  //     links.set(key, link);
  //     graph.links.push(link);
  //   }

  const nodes = [];
  const links = [];

  const addNode = (node) => {
    if (!nodes.includes(node.id)) {
      nodes.push(node);
      graph.nodes.push(node);
    }
  };

  const addLink = (link) => {
    const key = `${link.source.id}-${link.target.id}`;
    if (!links.includes(key)) {
      links.push(key);
      graph.links.push(link);
    }
  };

  const addData = (data) => {
    data.slice(0, 10).forEach(({ p: d }) => {
      /**
       * "p": {
      "start": {
        "identity": 0,
        "labels": [
          "Person"
        ],
        "properties": {
          "person_birthday": "1950-01-01T00:00:00Z",
          "person_fin": "OISXKGE",
          "person_name": "Familə",
          "person_surname": "Məmmədova"
        },
        "elementId": "0"
      },
      "end": {
        "identity": 500000,
        "labels": [
          "Vehicle"
        ],
        "properties": {
          "vehicle_registration_plate": "60-TA-579",
          "vehicle_model": "Maruti 800 AC",
          "vehicle_owner": "OISXKGE"
        },
        "elementId": "500000"
      },
      "segments": [
        {
          "start": {
            "identity": 0,
            "labels": [
              "Person"
            ],
            "properties": {
              "person_birthday": "1950-01-01T00:00:00Z",
              "person_fin": "OISXKGE",
              "person_name": "Familə",
              "person_surname": "Məmmədova"
            },
            "elementId": "0"
          },
          "relationship": {
            "identity": 0,
            "start": 0,
            "end": 500000,
            "type": "has_car",
            "properties": {
              "vehicle_registration_plate": "60-TA-579",
              "vehicle_model": "Maruti 800 AC",
              "vehicle_owner": "OISXKGE"
            },
            "elementId": "0",
            "startNodeElementId": "0",
            "endNodeElementId": "500000"
          },
          "end": {
            "identity": 500000,
            "labels": [
              "Vehicle"
            ],
            "properties": {
              "vehicle_registration_plate": "60-TA-579",
              "vehicle_model": "Maruti 800 AC",
              "vehicle_owner": "OISXKGE"
            },
            "elementId": "500000"
          }
        }
      ],
      "length": 1.0
    }
       */
      const source = {
        id: d.start.identity,
        label: d.start.labels[0],
        ...d.start.properties,
      };

      const target = {
        id: d.end.identity,
        label: d.end.labels[0],
        ...d.end.properties,
      };

      const link = {
        source: source.id,
        target: target.id,
        label: d.segments[0].relationship.type,
        ...d.segments[0].relationship.properties,
      };

      addNode(source);
      addNode(target);
      addLink({
        source,
        target,
        link,
      });
    });
  };

  addData(neo4jData);

  // add arrowhead marker
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 13)
    .attr("markerHeight", 13)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .style("stroke", "none");

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("g")
    .data(graph.links)
    .join("g");

  link
    .append("text")
    .text((d) => d.link.label)
    .attr("x", 55)
    .attr("y", 0)
    .attr("text-anchor", "middle");

  link
    // .attr("stroke-width", 5)
    // arrowhead marker
    .attr("marker-end", "url(#arrowhead)");
  //

  const group = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
    .attr("class", "node")
    .attr("touch-action", "none")
    .attr("cursor", "pointer")
    .call(drag(simulation));

    const view = [width / 2, height / 2, 1];

    function zoomTo(v) {
      const k = width / v[2];
      view = v;
      group.attr(
        "transform",
        `translate(${width / 2},${height / 2})scale(${k})translate(${-v[0]},${-v[1]})`
      );
    }

    d3.select().transition().duration(750).ease(d3.easeLinear).tween("zoom", function () {
      var i = d3.interpolateZoom(view, [width / 2, height / 2, 1]);
      return function (t) {
        zoomTo(i(t));
      };
    });

    d3.select().transition().duration(750).attr("style", "stroke-width: 1.5px;")

  const node = group
    .append("circle")
    .attr("r", 25)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", (d) => d3.interpolateRainbow(Math.random()));

  // add text to node
  group
    .append("text")
    .attr("x", 0)
    .attr("y", 5)
    // .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text((d) => d.label)
    .attr("fill", "white")
    .attr("font-size", "8px")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "thin")
    .attr("pointer-events", "none");

  // add title to node

  node.append("title").text((d) => d.label);

  // add shadow when hover
  node
    .on("mouseover", function (d) {
      // find parent group
      // const group = d3.select(this).node().parentNode;
      // const circle = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "circle"
      // );
      // circle.setAttribute("r", 25);
      // circle.setAttribute("fill", "none");
      // circle.setAttribute("stroke", "rgb(106, 198, 255)");
      // circle.setAttribute("stroke-width", 5);
      // circle.setAttribute("cx", 0);
      // circle.setAttribute("cy", 0);
      // group.append(circle);
    })
    .on("mouseout", function (d) {
      // d3.select(this).attr("filter", "");
    });

  node.append("title").text((d) => d.id);

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    // link
    //   .attr("x1", (d) => d.source.x)
    //   .attr("y1", (d) => d.source.y)
    //   .attr("x2", (d) => d.target.x)
    //   .attr("y2", (d) => d.target.y);

    link.attr("transform", (d) => {
      const angle = Math.atan2(
        d.target.y - d.source.y,
        d.target.x - d.source.x
      );
      const x = d.source.x + 25 * Math.cos(angle);
      const y = d.source.y + 25 * Math.sin(angle);
      return `translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`;
    });

    // node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // with transition
    group.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // freezing problem -> fix by using transform
  }

  link
    .append("path")
    // .attr("x1", (d) => d.source.x)
    // .attr("y1", (d) => d.source.y)
    // .attr("x2", (d) => d.target.x)
    // .attr("y2", (d) => d.target.y)
    //  d3 link horizontal
    .attr("d", (d) => {
      // path from one group to another
      // const dr = Math.sqrt(
      //   (d.target.x - d.source.x) ** 2 + (d.target.y - d.source.y) ** 2
      // );
      // // return `M 0 0 L ${x2},0`;
      // return `M 0 0 L ${dr < 150 ? 150 : dr}, 0`;
      // path from one circle to another
      // const angle = Math.atan2(
      //   d.target.y - d.source.y,
      //   d.target.x - d.source.x
      // );

      // const x1 = 25 * Math.cos(angle);
      // const y1 = 25 * Math.sin(angle);
      // const x2 = d.target.x - d.source.x - 25 * Math.cos(angle);
      // const y2 = d.target.y - d.source.y - 25 * Math.sin(angle);

      return `M 0 0 L 150, 0`;
      // return `M ${0} ${y1} L ${x2 * 10} ${y2}`;
    })
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6)
    .attr("marker-end", "url(#arrowhead)")
    .attr("class", "link")
    .attr("id", (d) => d.link.id)
    .attr("touch-action", "none")
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "rgb(106, 198, 255)");
    });

    console.log(graph.links)

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  return svg.node();
};

export const neo4jD3 = {
  init,
};
