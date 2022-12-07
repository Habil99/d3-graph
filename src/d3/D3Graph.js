import * as d3 from "d3";
import * as rxJs from "rxjs";

import D3GraphConstants from "./D3GraphConstants";
import D3GraphHelper from "./D3GraphHelper";
import nodes, { relations } from "./nodes";

class D3Graph {
  constructor() {
    this.nodes = nodes;
    this.relations = relations;

    this.svg = d3.select("#parent-svg");

    this.svg.append("style", "text/css").text(this.getGraphStyles());

    this.parent = this.svg
      .append("g")
      .attr(D3GraphConstants.DEFAULT_DATA_GROUP_WRAPPER, "true");
    this.svg
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    this.outerCircleRadius = 50;

    this.zoom = d3.zoom().on("zoom", (event) => {
      this.parent.attr("transform", event.transform);
    });

    this.svg.call(this.zoom);

    this.d3GraphHelper = new D3GraphHelper(this.parent, this.nodes);
    this.d3GraphHelper.createModal();
    this.render();
    this.handleDragNodes();
  }

  render() {
    this.nodes.forEach((node) => {
      this.createHeadNode(node);
    });

    this.connectAllNodes(this.nodes);
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

    function onDrag(event) {
      const currentNode = d3.select(this);
      const currentNodeId = currentNode.attr(
        D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
      );
      // move head node
      const currentGroup = self.nodes.find((node) => node.id === currentNodeId);

      if (currentGroup) {
        // and if not overlapping with other head node
        self.d3GraphHelper.updateGroupPosition(currentGroup, event.x, event.y);

        currentNode.attr("transform", `translate(${event.x}, ${event.y})`);

        currentGroup.details.forEach((detail) => {
          detail.relatedDetails.forEach((relatedDetail) => {
            relatedDetail.pathCoords = self.linker(
              detail,
              currentGroup,
              self.nodes
                .find((node) => node.id === relatedDetail.parentId)
                .details.find((detail) => detail.id === relatedDetail.id),
              self.nodes.find((node) => node.id === relatedDetail.parentId)
            ).pathCoords;

            console.log(d3.select(`[data-relation-id=${relatedDetail.curveRelationId}]`))

            d3.select(`[data-relation-id=${relatedDetail.curveRelationId}]`).attr(
              "d",
              relatedDetail.pathCoords
            );

            // const groups = self.getTwoConnectedGroupInfo(
            //   detail,
            //   "all",
            //   currentNode
            // );

            // currentNode.attr("transform", `translate(${event.x}, ${event.y})`);

            // currentGroup.details.forEach((detail) => {
            //   const { relatedDetailGroup, relatedGroup } =
            //     self.getTwoConnectedGroupInfo(detail);

            //   detail.pathCoords = self.linker(
            //     detail,
            //     currentGroup,
            //     relatedDetailGroup,
            //     relatedGroup
            //   ).pathCoords;

            //   console.log(detail.relatedDetail);
            //   detail.relatedDetail.bezierCurves.forEach((curve) => {
            //     console.log("hereee");
            //     curve.attr("d", detail.pathCoords);
            //   });
            // });
          });
        });
      }
    }

    this.svg
      .selectAll(`[${D3GraphConstants.DEFAULT_HEAD_NODE_DATA_ATTR}]`)
      .call(
        d3
          .drag()
          .on("drag", onDrag)
          .on("end", function (event) {
            // const { x, y, dx, dy } = event;
            // const headGroup = d3.select(this);
            // const headNodeId = headGroup.attr(
            //   D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
            // );
            // // move head node
            // const headNode =
            //   self.nodes.find((node) => node.id === headNodeId) ||
            //   self.relations.find((relation) => relation.id === headNodeId);
            // if (headNode) {
            //   self.d3GraphHelper.updateGroupPosition(
            //     headNode,
            //     event.x,
            //     event.y
            //   );
            //   headNode.details[0].bezierCurve.attr(
            //     "d",
            //     self.linker(
            //       headNode.details[0],
            //       headNode,
            //       self.relations[0].details[0],
            //       self.relations[0]
            //     ).pathCoords
            //   );
            // }
          })
      );
  }

  // create circle with image background
  createHeadNode(node) {
    const { x, y, r, image, clipId, dangerous } = node;

    const position = this.d3GraphHelper.calcPositionForCurrentNode(
      this.nodes,
      node
    );

    const headGroup = this.d3GraphHelper.createHeadGroup(node, position);

    // update node position
    this.d3GraphHelper.updateGroupPosition(node, position.gx, position.gy);

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

    return headGroup;
  }

  getTwoConnectedGroupInfo(detail, type, currentNode) {
    if (type === "all") {
      const groups = [];

      this.nodes.forEach((node) => {
        if (node.id !== currentNode.id) {
          node.details.forEach((detail) => {
            groups.push({
              relatedGroup: node,
              relatedDetailGroup: detail,
            });
          });
        }
      });

      return groups;
    }

    const relatedGroup = this.nodes.find(
      (n) => n.id === detail.relatedDetail.parentId
    );
    const relatedDetailGroup = relatedGroup.details.find(
      (d) => d.id === detail.relatedDetail.id
    );

    return {
      relatedGroup,
      relatedDetailGroup,
    };
  }

  connectAllNodes(nodes) {
    const self = this;

    const mainGroup = nodes.find((n) => n.isMain);

    nodes.forEach((node) => {
      node.details.forEach((detail) => {
        detail.relatedDetails.forEach((relatedDetail) => {
          const { id, parentId } = relatedDetail;

          if (parentId !== mainGroup.id) {
            const relatedGroup = nodes.find((n) => n.id === parentId);
            const relatedDetailGroup = relatedGroup.details.find(
              (d) => d.id === id
            );

            const pathCoords = this.linker(
              detail,
              node,
              relatedDetailGroup,
              relatedGroup
            ).pathCoords;

            const relationId = this.d3GraphHelper.getRelationId(
              detail,
              relatedDetailGroup
            );

            const curveLine = d3.select(
              d3.select("#parent-svg").select("g").node()
            );

            const bezierCurve = curveLine
              .append("path")
              .attr("id", "curve")
              .attr("d", pathCoords)
              .attr("data-relation-id", relationId)
              .attr("stroke", "#ACACAC")
              .attr("stroke-width", 1)
              .attr("fill", "none")
              .attr("stroke-dasharray", "5, 5")
              .attr("stroke-linecap", "round")
              .attr("stroke-linejoin", "round");

            //  create a shape so that the shape is on the line and at the same angle to it
            detail.bezierCurve = bezierCurve;
            relatedDetail.curveRelationId = relationId;

            curveLine
              .append("a")
              .attr("fill", "red")
              .append("text")
              .append("textPath")
              .attr("xlink:href", "#curve")
              .attr("startOffset", "50%")
              .style("cursor", "pointer")
              .text(relatedGroup.relationName)
              .on("click", (event) => {
                this.d3GraphHelper.modalToggle("open");
              });
          }
        });
      });
    });
  }

  arcPath(node1, head1, node2, head2) {
    let { gx: hx0, gy: hy0 } = head1;
    let { gx: hx1, gy: hy1 } = head2;

    hx0 = hx0 + node1.gx - 20;
    hy0 = hy0 + node1.gy;
    hx1 = hx1 + node2.gx - 20;
    hy1 = hy1 + node2.gy;

    const dx = hx1 - hx0,
      dy = hy1 - hy0,
      dr = Math.sqrt(dx * dx + dy * dy);

    // return arc coordinates
    return d3
      .arc()
      .innerRadius(40)
      .outerRadius(20)
      .startAngle(Math.PI)
      .endAngle(Math.PI * 2);
  }

  linker(node1, head1, node2, head2) {
    // including head gx and gy
    let { gx: hx0, gy: hy0 } = head1;
    let { gx: hx1, gy: hy1 } = head2;

    hx0 = hx0 + node1.gx - 20;
    hy0 = hy0 + node1.gy;
    hx1 = hx1 + node2.gx - 20;
    hy1 = hy1 + node2.gy;
    const k = this.outerCircleRadius * 7;

    const path = d3.path();

    // move and line path without crossing head1 and head2 circles
    path.moveTo(hx0, hy0);

    // if line is crossing head1 and head2 circles, then draw arc otherwise draw line

    path.bezierCurveTo(hx0, hy0 + k, hx1 / k, hy1 + k, hx1, hy1);

    path.lineTo(hx1, hy1);

    return {
      coords: {
        x0: hx0,
        y0: hy0,
        x1: hx1,
        y1: hy1,
        k: k,
      },
      pathCoords: path.toString(),
    };
  }

  findNearestPointOnOuterCircle(node1, node2) {
    // exclude the outer circle radius
    const distance =
      Math.sqrt(
        Math.pow(node1.gx - node2.gx, 2) + Math.pow(node1.gy - node2.gy, 2)
      ) -
      this.outerCircleRadius * 2;
    const angle =
      (Math.atan2(node2.gy - node1.gy, node2.gx - node1.gx) * 180) / Math.PI;

    const x = node1.gx + distance * Math.cos((angle * Math.PI) / 180);
    const y = node1.gy + distance * Math.sin((angle * Math.PI) / 180);

    return { x, y };
  }
}

export default D3Graph;
