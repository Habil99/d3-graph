import * as d3 from "d3";

const neo4jData = [
  {
    keys: ["p", "d", "m"],
    length: 3,
    _fields: [
      {
        identity: {
          low: 108,
          high: 0,
        },
        labels: ["Person"],
        properties: {
          born: {
            low: 1965,
            high: 0,
          },
          name: "Tom Tykwer",
        },
      },
      {
        identity: {
          low: 141,
          high: 0,
        },
        start: {
          low: 108,
          high: 0,
        },
        end: {
          low: 105,
          high: 0,
        },
        type: "DIRECTED",
        properties: {},
      },
      {
        identity: {
          low: 105,
          high: 0,
        },
        labels: ["Movie"],
        properties: {
          tagline: "Everything is connected",
          title: "Cloud Atlas",
          released: {
            low: 2012,
            high: 0,
          },
        },
      },
    ],
    _fieldLookup: {
      p: 0,
      d: 1,
      m: 2,
    },
  },
  {
    keys: ["p", "d", "m"],
    length: 3,
    _fields: [
      {
        identity: {
          low: 6,
          high: 0,
        },
        labels: ["Person"],
        properties: {
          born: {
            low: 1965,
            high: 0,
          },
          name: "Lana Wachowski",
        },
      },
      {
        identity: {
          low: 143,
          high: 0,
        },
        start: {
          low: 6,
          high: 0,
        },
        end: {
          low: 105,
          high: 0,
        },
        type: "DIRECTED",
        properties: {},
      },
      {
        identity: {
          low: 105,
          high: 0,
        },
        labels: ["Movie"],
        properties: {
          tagline: "Everything is connected",
          title: "Cloud Atlas",
          released: {
            low: 2012,
            high: 0,
          },
        },
      },
    ],
    _fieldLookup: {
      p: 0,
      d: 1,
      m: 2,
    },
  },
  {
    keys: ["p", "d", "m"],
    length: 3,
    _fields: [
      {
        identity: {
          low: 5,
          high: 0,
        },
        labels: ["Person"],
        properties: {
          born: {
            low: 1967,
            high: 0,
          },
          name: "Lilly Wachowski",
        },
      },
      {
        identity: {
          low: 142,
          high: 0,
        },
        start: {
          low: 5,
          high: 0,
        },
        end: {
          low: 105,
          high: 0,
        },
        type: "DIRECTED",
        properties: {},
      },
      {
        identity: {
          low: 105,
          high: 0,
        },
        labels: ["Movie"],
        properties: {
          tagline: "Everything is connected",
          title: "Cloud Atlas",
          released: {
            low: 2012,
            high: 0,
          },
        },
      },
    ],
    _fieldLookup: {
      p: 0,
      d: 1,
      m: 2,
    },
  },
  {
    keys: ["p", "d", "m"],
    length: 3,
    _fields: [
      {
        identity: {
          low: 108,
          high: 0,
        },
        labels: ["Person"],
        properties: {
          born: {
            low: 1965,
            high: 0,
          },
          name: "Tom Tykwer",
        },
      },
      {
        identity: {
          low: 144,
          high: 0,
        },
        start: {
          low: 108,
          high: 0,
        },
        end: {
          low: 105,
          high: 0,
        },
        type: "PRODUCED",
        properties: {},
      },
      {
        identity: {
          low: 105,
          high: 0,
        },
        labels: ["Movie"],
        properties: {
          tagline: "Everything is connected",
          title: "Cloud Atlas",
          released: {
            low: 2012,
            high: 0,
          },
        },
      },
    ],
    _fieldLookup: {
      p: 0,
      d: 1,
      m: 2,
    },
  },
];

// d3 js

/**
 * each node has a unique id and a label
 * each relationship has a unique id, a type, a startNode and an endNode
 * each node has text and a color inside it
 *
 * each link has a source and a target
 * each link has text on it
 * each link is arrowed
 *
 */

function init() {
  const nodes = [];
  const links = [];

  const nodeMap = new Map();
  const linkMap = new Map();

  const nodeColor = d3.scaleOrdinal(d3.schemeCategory10);

  const nodeRadius = 20;

  const linkDistance = 100;

  const linkStrength = 1;

  const chargeStrength = -300;

  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    // .force("charge", d3.forceManyBody().strength(chargeStrength))
    // .force(
    //   "center",
    //   d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
    // );

  const svg = d3.select("svg");

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 2);

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g");

  const circles = node
    .append("circle")
    .attr("r", nodeRadius)
    .attr("fill", (d) => nodeColor(d.label));

  const lables = node
    .append("text")
    .text((d) => d.id)
    .attr("x", 6)
    .attr("y", 3);

  const ticked = () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  };

  const dragstarted = (d) => {
    if (!d.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (d) => {
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragended = (d) => {
    if (!d.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  const drag = d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  const addNode = (id, label) => {
    const node = { id, label };
    nodes.push(node);
    nodeMap.set(id, node);
  };

  const addLink = (source, target, type) => {
    const link = { source, target, type };
    links.push(link);
    linkMap.set(`${source.id}-${target.id}`, link);
  };

  const addData = (data) => {
    data.forEach((record) => {
      const source = record._fields[0];
      const relationship = record._fields[1];
      const target = record._fields[2];

      addNode(source.identity.low, source.labels[0]);
      addNode(target.identity.low, target.labels[0]);
      addLink(
        nodeMap.get(source.identity.low),
        nodeMap.get(target.identity.low),
        relationship.type
      );
    });
  };

  addData(neo4jData);

  simulation.alpha(1).restart();

  node.call(drag);

  const zoom_handler = d3.zoom().on("zoom", (event) => {
    svg.attr("transform", event.transform);
  });

  svg.call(zoom_handler);

  console.log(nodes, links);
}

export const sampleNeo4jD3 = { init };
