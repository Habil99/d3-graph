import * as d3 from "d3"

class D3Graph {
  constructor() {
    this.svg = d3.select('svg')
    this.parent = this.svg.append("g")
    this.svg.attr('width', window.innerWidth).attr('height', window.innerHeight);
    this.outerCircleRadius = 50;

    this.zoom = d3.zoom().on("zoom", (event) => {
      // this.parent.attr("transform", event.transform);
      this.parent.attr("transform", event.transform);
    })

    // d3.zoom().translateExtent([[0, 0], [window.innerWidth, window.innerHeight]]);

    this.svg.call(this.zoom);
  }

  createCircle(x, y, r, color) {
    this.parent.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .style('fill', color);
  }

  // create circle with image background
  createCircleWithImage(x, y, r, image, clipId) {
    // with clip path
    this.parent.append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r);

    // make progress circle with 90%  red and 10% green
    this.parent.append('circle')

    this.parent.append('image')
      .attr('xlink:href', image)
      .attr('x', x - r)
      .attr('y', y - r)
      .attr('width', r * 2)
      .attr('height', r * 2)
      .attr('clip-path', `url(#${clipId})`);

    // append circle outside of image

    const outerCircle = this.parent.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r + this.outerCircleRadius)
      .style('fill', 'none')
      .style('stroke', 'rgba(42, 49, 59, 1)')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', 0.5);

    // append circles to the outer circle
    this.parent.append("circle")
      .attr("cx", x - (r + this.outerCircleRadius - 30))
      .attr("cy", y - (r + this.outerCircleRadius - 30))
      .attr("r", 25)
      .style("fill", "none")
      .style("stroke", "rgba(42, 49, 59, 1)")
      .style("stroke-width", 0.5);
  }

  connectAllNodes(nodes) {
    // with bezier curves dashed line
    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    nodes.forEach(node => {
      // find next node and connect them
      const nextNode = nodes.find(n => n.id === node.id + 1);

      if (nextNode) {
        // line from the nearest point on the outer circle to the nearest point on the outer circle
        // find the nearest point on the outer circle
        const nearestPointOnOuterCircle = this.findNearestPointOnOuterCircle(node, nextNode);
        const nearestPointOnOuterCircle2 = this.findNearestPointOnOuterCircle(nextNode, node);

        const path = this.parent.append('path')
          .attr('d', line([nearestPointOnOuterCircle, nearestPointOnOuterCircle2]))
          .attr('stroke', 'rgba(42, 49, 59, 1)')
          .attr('stroke-width', 0.5)
          .attr('fill', 'none')
          .attr('stroke-dasharray', '5, 5');

      }
    })
  }

  findNearestPointOnOuterCircle(node1, node2) {
    // exclude the outer circle radius
    const distance = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) - this.outerCircleRadius * 2;
    const angle = Math.atan2(node2.y - node1.y, node2.x - node1.x) * 180 / Math.PI;

    const x = node1.x + distance * Math.cos(angle * Math.PI / 180);
    const y = node1.y + distance * Math.sin(angle * Math.PI / 180);

    return { x, y };
  }
}

export default D3Graph;