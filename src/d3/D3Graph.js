import * as d3 from "d3";
import D3GraphConstants from "./D3GraphConstants";
import D3GraphHelper from "./D3GraphHelper";
import nodes, { relations } from "./nodes";

class D3Graph {
  constructor() {
    this.nodes = nodes;
    this.relations = relations;

    this.svg = d3.select("#parent-svg");

    // for styling
    this.svg.append("style", "text/css").text(this.getGraphStyles());

    this.parent = this.svg.append("g");
    this.svg
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    this.outerCircleRadius = 50;

    //outerCircleRadius will be dynamic in the future

    this.zoom = d3.zoom().on("zoom", (event) => {
      this.parent.attr("transform", event.transform);
    });

    this.svg.call(this.zoom);

    // scale extent
    // this.zoom.scaleExtent([0.5, 2]).translateExtent([
    //   [0, 0],
    //   [window.innerWidth / 2, window.innerHeight / 2],
    // ]);

    this.d3GraphHelper = new D3GraphHelper(this.parent, this.nodes);

    this.render();
    this.handleDragNodes();
  }

  render() {
    console.log(this.relations[0].id, "RELATION RENDERING");
    this.nodes.forEach((node) => {
      this.createHeadNode(node);
    });

    console.log(this.relations[0].id, "BEFORE CONNECT ALL NODES");

    this.connectAllNodes(this.nodes);

    console.log(this.relations[0].id, "AFTER CONNECT ALL NODES");
  }

  getGraphStyles() {
    return `
      .head-node {
        cursor: pointer;
      }
    `;
  }

  handleDragNodes() {
    const self = this;

    this.svg
      .selectAll(`[${D3GraphConstants.DEFAULT_HEAD_NODE_DATA_ATTR}]`)
      .call(
        d3
          .drag()
          .on("drag", function (event) {
            const headGroup = d3.select(this);
            const headNodeId = headGroup.attr(
              D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
            );
            // move head node
            const headNode =
              self.nodes.find((node) => node.id === headNodeId) ||
              self.relations.find((relation) => relation.id === headNodeId);

            if (headNode) {
              headGroup.attr("transform", `translate(${event.x}, ${event.y})`);
            }
          })
          .on("end", function (event) {
            const headGroup = d3.select(this);
            const headNodeId = headGroup.attr(
              D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
            );

            // move head node
            const headNode =
              self.nodes.find((node) => node.id === headNodeId) ||
              self.relations.find((relation) => relation.id === headNodeId);

            if (headNode) {
              self.d3GraphHelper.updateGroupPosition(
                headNode,
                event.x,
                event.y
              );
            }
          })
      );
  }

  // create circle with image background
  createHeadNode(node, gX, gY) {
    const { x, y, r, image, clipId, dangerous } = node;

    const headGroup = this.d3GraphHelper.createHeadGroup(node, gX, gY);

    this.d3GraphHelper.setHeadGroup(headGroup);

    // with clip path
    this.d3GraphHelper.createClipPath(x, y, r, clipId);

    // make progress circle with 90%  red and 10% green
    if (dangerous) {
      this.d3GraphHelper.createDangerousPath(x, y, r, dangerous);
    }

    this.d3GraphHelper.createImage(x, y, r, image, clipId);

    // append circle outside of image

    /** Outer Circle */
    headGroup
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", r + this.outerCircleRadius)
      .style("fill", "none")
      .style("stroke", "rgba(42, 49, 59, 1)")
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.5);

    // create detail nodes around head node
    if (node?.details?.length) {
      this.d3GraphHelper.createDetailNodes(node, this.outerCircleRadius);
    }
  }

  connectAllNodes(nodes) {
    // with bezier curves dashed line
    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasis);

    nodes.forEach((node) => {
      node.details.forEach((detail) => {
        // find relation inside relations
        const relatedGroup = this.relations.find(
          (relation) => (relation.id === detail.relationId)
        );

        if (relatedGroup) {
          // find position for related group in screen, find new position if screen is not empty
          const { gX, gY } = this.d3GraphHelper.findPositionForRelatedGroup(
            relatedGroup,
            this.relations,
            node
          );

          // create related group
          const relatedGroupElement = this.createHeadNode(relatedGroup, gX, gY);
          // create related group nodes
          console.log(relatedGroup.id, "AFTER HEAD NODE CREATION");
        }
      });
    });
  }

  findNearestPointOnOuterCircle(node1, node2) {
    // exclude the outer circle radius
    const distance =
      Math.sqrt(
        Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
      ) -
      this.outerCircleRadius * 2;
    const angle =
      (Math.atan2(node2.y - node1.y, node2.x - node1.x) * 180) / Math.PI;

    const x = node1.x + distance * Math.cos((angle * Math.PI) / 180);
    const y = node1.y + distance * Math.sin((angle * Math.PI) / 180);

    return { x, y };
  }
}

export default D3Graph;
