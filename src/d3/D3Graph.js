import * as d3 from "d3";

import D3GraphConstants from "./D3GraphConstants";
import D3GraphHelper from "./D3GraphHelper";
import D3Tooltip, { tooltipStyles } from "./D3Tooltip";
import nodes from "./nodes";

class D3Graph {
  constructor() {
    /**
     * Represents a D3Graph.
     * @constructor D3Graph
     * @param {array} nodes
     * @param {number} outerCircleRadius
     *
     * jsdoc -c src/d3/docs/d3-graph-config.js -d src/d3/docs/d3-graph-docs
     *
     *
     */

    // for jsdoc

    /**
     * @type {array}
     * @property {object} nodes - Main data structure of the graph
     * @property {string} nodes.id - Unique id of the node
     * @property {string} nodes.clipId - Unique id of the clip
     * @property {string} nodes.name - Name of the node
     * @property {number} nodes.x - X coordinate of the node for detail position
     * @property {number} nodes.y - Y coordinate of the node for detail position
     * @property {number} nodes.gx - X coordinate of the node for group position
     * @property {number} nodes.gy - Y coordinate of the node for group position
     * @property {number} nodes.r - Radius of the node
     * @property {string} nodes.color - Color of the node
     * @property {number} nodes.dangerous - Dangerous level of the node
     * @property {boolean} nodes.isMain - Is the node main or related
     * @property {string} nodes.image - Image of the node
     * @property {array} nodes.details - Array of related nodes
     * @property {string} nodes.details.id - Unique id of the node
     * @property {string} nodes.details.relatedDetails  - Array of related nodes
     * @property {string} nodes.details.relatedDetails.parentId - Unique id of the parent node which has detail and that detail has relation with this detail node
     * @property {string} nodes.details.relatedDetails.id - Unique id of the deetail node which has relation with this detail node
     * @property {boolean} nodes.details.relatedDetails.connected - Is the detail node connected with this detail node
     * @property {array} nodes.details.relatedDetails.bezierCurves - Array of bezier curves
     * @property {string} nodes.details.relatedDetails.curveRelationId - Unique id of the bezier curve
     * @property {number} nodes.details.x - X coordinate of the node for detail position
     * @property {number} nodes.details.y - Y coordinate of the node for detail position
     * @property {number} nodes.details.gx - X coordinate of the node for group detail position
     * @property {number} nodes.details.gy - Y coordinate of the node for group detail position
     * @property {number} nodes.details.r - Radius of the node
     * @property {string} nodes.details.image - Image of the node
     * @property {string} nodes.details.relationId - Unique id of the relation
     * @property {string} nodes.details.clipId - Unique id of the clip
     * @property {string} nodes.details.name - Name of the node
     * @property {string} nodes.details.bezierCurve - Bezier curve of the node
     *
     */

    this.nodes = nodes;

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

      .close-btn {
        cursor: pointer;
        background-color: #ffa500;

        border: none;
        border-radius: 4px;
        width: 20px;
        height: 20px;
        color: white;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .close-btn-span {
        margin: 0 0 4px 2px;
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
            const oppositeRelatedDetail = self.nodes
              .find((node) => node.id === relatedDetail.parentId)
              .details.find((detail) => detail.id === relatedDetail.id);

            const oppositeRelatedGroup = self.nodes.find(
              (node) => node.id === relatedDetail.parentId
            );

            relatedDetail.pathCoords = self.linker(
              detail,
              currentGroup,
              oppositeRelatedDetail,
              oppositeRelatedGroup
            ).pathCoords;

            function findId() {
              let id;
              for (const element of oppositeRelatedDetail.relatedDetails) {
                for (const el of currentGroup.details) {
                  if (element.id === el.id) {
                    id = element.curveRelationId;
                  }
                }
              }

              return id;
            }

            const id = relatedDetail.curveRelationId
              ? relatedDetail.curveRelationId
              : findId();

            // self.tooltip.updatePosition(relatedDetail)
            // console.log(relatedDetail)

            // if (relatedDetail.tooltip) {
            //   console.log(
            //     relatedDetail.relationTarget,
            //     d3.select(relatedDetail.relationTarget)
            //   );
            //   // relatedDetail.tooltip.updatePosition(relatedDetail.relationTarget, 300);
            // }

            d3.select(`[data-relation-id=${id}]`).attr(
              "d",
              relatedDetail.pathCoords
            );
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
          .on("end", function (event) {})
      );
  }

  // create circle with image background
  createHeadNode(node) {
    const { x, y, r, image, clipId, dangerous } = node;

    const position = this.d3GraphHelper.calculatePositionOnScreen(
      this.outerCircleRadius,
      this.nodes.indexOf(node),
      this.nodes.length
    );

    /**
     * calcPositionForCurrentNode(
      this.nodes,
      node
    );
     */

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
              .attr("stroke-width", 2)
              .attr("fill", "none")
              .attr("stroke-dasharray", "5, 5")
              .attr("stroke-linecap", "round")
              .attr("stroke-linejoin", "round")
              .on("mousemove", (event) => {
                // increase stroke width
                d3.select(event.target)
                  .attr("stroke-width", 3)
                  .attr("stroke", "#3F51B5");
              })
              .on("mouseout", (event) => {
                // decrease stroke width
                d3.select(event.target)
                  .attr("stroke-width", 2)
                  .attr("stroke", "#ACACAC");
              });

            //  create a shape so that the shape is on the line and at the same angle to it
            detail.bezierCurve = bezierCurve;
            relatedDetail.curveRelationId = relationId;

            curveLine
              .append("a")
              .attr("fill", "red")
              .append("text")
              .attr("x", 50)
              .attr("y", 20)
              .append("textPath")
              .attr("xlink:href", "#curve")
              .attr("startOffset", "50%")
              .style("cursor", "pointer")
              .text(relatedGroup.relationName)
              .on("click", (event) => {
                const tooltip = new D3Tooltip(this.parent);

                tooltip.createTooltip(event.x, event.y);
                tooltip.showTooltip(
                  `
                  <div style="${tooltipStyles.wrapper}">
                    <p style="${tooltipStyles.title}">
                    VAZ 2107 markalı, 54-BA-279
                    nömrəli avtomobil Əliyev Adil
                    Vasif oğlu tərəfindən Əliyev
                    Nəriman Adil oğluna etibar edilmişdir
                    </p>
                    <p style="${tooltipStyles.date}">Tarix: 21.05.2022</p>
                  </div>`,
                  event.clientX,
                  event.clientY
                );

                relatedDetail.tooltip = tooltip;
                relatedDetail.relationTarget = event.target;
                // detail.tooltip = tooltip;
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
