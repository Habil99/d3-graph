import * as d3 from "d3";
import D3GraphHelper from "./D3GraphHelper";
import nodes from "./nodes";

class D3Graph {
  constructor() {
    this.nodes = nodes;

    this.svg = d3.select("#parent-svg");

    // for styling
    this.svg.append("style", "text/css").text(this.getGraphStyles())

    this.parent = this.svg.append("g")
    this.svg.attr('width', window.innerWidth).attr('height', window.innerHeight)
      .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    this.outerCircleRadius = 50;

    //outerCircleRadius will be dynamic in the future

    // this.zoom = d3.zoom().on("zoom", (event) => {
    //   this.parent.attr("transform", event.transform);
    // })
    //
    // this.svg.call(this.zoom);

    this.d3GraphHelper = new D3GraphHelper(this.parent);

    this.render();
    this.handleDragNodes()
  }

  render() {
    this.nodes.forEach(node => {
      this.createHeadNode(node);
    })

    this.connectAllNodes(this.nodes);
  }

  getGraphStyles() {
    return `
      .head-node {
        cursor: pointer;
      }
    `
  }

  handleDragNodes() {
    const self = this;

    this.svg.selectAll("[data-head-node]").call(d3.drag().on("drag", function (event) {
      // this is head node that`s tag is g and has data-head-node attribute and has data-head-node-id attribute with id, move group
      const headGroup = d3.select(this);
      const headNodeId = headGroup.attr("data-head-node-id");

      // move head node
      const headNode = self.nodes.find(node => node.id === +headNodeId);

      if (headNode) {

        const findDiff = (a, b) => {
          return a - b;
        }

        const diffX = findDiff(headNode.x, event.x)
        const diffY = findDiff(headNode.y, event.y)

        headGroup.attr("transform", `translate(${-diffX}, ${-diffY})`);
      }
    }).on("end", function (event) {
      // this is head node that`s tag is g and has data-head-node attribute and has data-head-node-id attribute with id, move group
      const headGroup = d3.select(this);
      const headNodeId = headGroup.attr("data-head-node-id");

      const findDiff = (a, b) => {
        return a - b;
      }

      // move head node
      const headNode = self.nodes.find(node => node.id === +headNodeId);

      if (headNode) {
        const diffX = findDiff(headNode.x, event.x)
        const diffY = findDiff(headNode.y, event.y)
        console.log(event.x, event.y)

        self.d3GraphHelper.updateNodePosition(headNode, diffX, diffY);
      }
    }))
  }

  // create circle with image background
  createHeadNode(node) {
    const { x, y, r, image, clipId, dangerous } = node;

    const headGroup = this.d3GraphHelper.createHeadGroup(node);

    this.d3GraphHelper.setHeadGroup(headGroup)

    // with clip path
    this.d3GraphHelper.createClipPath(x, y, r, clipId);

    // make progress circle with 90%  red and 10% green
    if (dangerous) {
      this.d3GraphHelper.createDangerousPath(x, y, r, dangerous)
    }

    this.d3GraphHelper.createImage(x, y, r, image, clipId);

    // append circle outside of image

    /** Outer Circle */
    headGroup.append("circle")
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r + this.outerCircleRadius)
      .style('fill', 'none')
      .style('stroke', 'rgba(42, 49, 59, 1)')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', 0.5);

    // create detail nodes around head node
    this.d3GraphHelper.createDetailNodes(node, this.outerCircleRadius);
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