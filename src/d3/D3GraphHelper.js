import D3GraphConstants from "./D3GraphConstants";
import D3GroupNode from "./D3GroupNode";

import * as d3 from "d3";

// import D3DetailNode from "./D3DetailNode";

class D3GraphHelper {
  constructor(parent, nodes) {
    this.parent = parent;
    this.nodes = nodes;
    this.wrapper = d3.select("#parent-svg").selectChild("g");

    this.screenCenterY = this.getScreenCenterY();
    this.screenCenterX = this.getScreenCenterX();
  }

  getScreenCenterY() {
    // include zoom in calculation after
    return window.innerHeight / 2;
  }

  getScreenCenterX() {
    // include zoom in calculation after
    return window.innerWidth / 2;
  }

  createHeadGroup(node, gX, gY) {
    return this.wrapper
      .append("g")
      .attr("data-head-node", true)
      .attr("data-head-node-id", node.id)
      .attr("cursor", "pointer")
      .attr("transform", `translate(${node.gX || gX}, ${node.gY || gY})`);
  }

  // create group inside data-head-node-id
  createGroupInsideHeadNode(headNode, detail, gX, gY) {
    return new D3GroupNode(this.parent, headNode, detail, { gX, gY });
  }

  setHeadGroup(node) {
    this.parent = node;
  }

  createCircle(x, y, r, color, node = this.parent) {
    node
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", r)
      .style("fill", color);

    return this;
  }

  createClipPath(x, y, r, clipId, node = this.parent) {
    node
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", r);

    return this;
  }

  createImage(x, y, r, image, clipId) {
    this.parent
      .append("image")
      .attr("xlink:href", image)
      .attr("x", x - r)
      .attr("y", y - r)
      .attr("width", r * 2)
      .attr("height", r * 2)
      .attr("clip-path", `url(#${clipId})`)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    return this;
  }

  createImageWithCustomSize(x, y, r, w, h, image, clipId, node = this.parent) {
    node
      .append("image")
      .attr("xlink:href", image)
      .attr("x", x - w - r / 3)
      .attr("y", y - w - r / 3)
      .attr("width", w)
      .attr("height", h)
      .attr("clip-path", `url(#${clipId})`)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    return this;
  }

  // path sector
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // calculate path of 'd' attribute
  calculateD(x, y, r, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, r, endAngle);
    const end = this.polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M",
      start.x,
      start.y,
      "A",
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");

    return d;
  }

  createDangerousPath(x, y, r, dangerous) {
    let dangerousPercentage = (dangerous * 360) / 100;
    // make a path for unsafe sector
    this.parent
      .append("path")
      .attr("d", this.calculateD(x, y, r, 0, dangerousPercentage))
      .attr("stroke", "red")
      .attr("stroke-width", 5);
    // make a path for safe sector
    this.parent
      .append("path")
      .attr("d", this.calculateD(x, y, r, dangerousPercentage, 360))
      .attr("stroke", "green")
      .attr("stroke-width", 5);
  }

  updateGroupPosition(node, gX, gY) {
    node.gX = gX;
    node.gY = gY;
  }

  updateNodePosition(node, x, y) {
    node.x = x;
    node.y = y;
  }

  createDetailNode(detail, groupInsideHeadNode) {
    this.updateNodePosition(detail, detail.x, detail.y);
    /**
     * create detail node that has image
     */

    const detailNode = new D3DetailNode(
      this.parent,
      detail,
      groupInsideHeadNode
    );
  }

  calculatePositionOnOuterCircle(
    headGx,
    headGY,
    outerCircleRadius,
    index,
    length
  ) {
    const angle = (360 / length) * index;
    const gX =
      headGx + outerCircleRadius * 2 * Math.cos((angle * Math.PI) / 180);
    const gY =
      headGY + outerCircleRadius * 2 * Math.sin((angle * Math.PI) / 180);

    return { gX: headGx - gX, gY: headGY - gY };
  }

  createDetailNodes(headNode, outerCircleRadius) {
    const { gX: headGx, gY: headGY, details } = headNode;

    details.forEach((detail, index) => {
      // calculate position of detail node on the outer circle
      const { gX, gY } = this.calculatePositionOnOuterCircle(
        headGx,
        headGY,
        outerCircleRadius,
        index,
        details.length
      );

      const groupInsideHeadNode = this.createGroupInsideHeadNode(
        headNode,
        detail,
        gX,
        gY
      );

      this.createDetailNode(detail, groupInsideHeadNode);
    });
  }

  getRandomPosition(x, y, args) {
    const { min, max } = args;
    const randomX = Math.floor(Math.random() * (max - min + 1) + min);
    const randomY = Math.floor(Math.random() * (max - min + 1) + min);

    return { gX: x + randomX, gY: y + randomY };
  }

  checkOverlapped(x, y, args) {
    const { nodes, radius } = args;
    let isOverlapped = false;

    nodes.forEach((node) => {
      const distance = Math.sqrt(
        Math.pow(x - node.gX, 2) + Math.pow(y - node.gY, 2)
      );
      if (distance < radius * 2) {
        isOverlapped = true;
      }
    });

    return isOverlapped;
  }

  calculatePosition(headGx, headGy, data) {
    // take random position
    const { gX, gY } = this.getRandomPosition(headGx, headGy, {
      min: 0,
      max: 300,
    });

    // check if the position is not overlapped
    const isOverlapped = this.checkOverlapped(gX, gY, {
      nodes: data,
      radius: 100,
    });

    if (isOverlapped) {
      return this.calculatePosition(headGx, headGy, data);
      // return { gX, gY };
    }

    return { gX, gY };
  }

  findPositionForRelatedGroup(relatedGroup, relations, head) {
    // find position for related group
    const { gX: headGx, gY: headGY } = head;

    // calculate position on screen away from head node
    return this.calculatePosition(headGx, headGY, [
      ...this.nodes,
      ...this.nodes.map((node) => node.details),
      ...relations,
    ]);
  }
}

class D3DetailNode extends D3GraphHelper {
  constructor(parent, detail, groupInsideHeadNode) {
    super(parent);

    this.detail = detail;
    this.groupInsideHeadNode = groupInsideHeadNode;
    this.create();
  }

  create() {
    // create image inside and center of circle
    const { x, y, gX, gY, r, image, clipId } = this.detail;

    const groupInsideHeadNode = this.parent.select(
      `[${D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ID_ATTR}=${this.detail.id}]`
    );
    this.createCircle(x, y, r, "#BBBEC2", groupInsideHeadNode)
      .createCircle(x, y, r / 2, "#FFFFFF", groupInsideHeadNode)
      .createClipPath(x, y, r / 2, clipId, groupInsideHeadNode)
      .createImageWithCustomSize(
        x + 20,
        y + 20,
        r,
        25,
        25,
        image,
        clipId,
        groupInsideHeadNode
      );
  }
}

export default D3GraphHelper;
