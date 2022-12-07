import D3GraphConstants from "./D3GraphConstants";
import D3GroupNode from "./D3GroupNode";

import * as d3 from "d3";
import * as rxJs from "rxjs";

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

  calcAngle(gx, gy) {
    const x = gx - this.screenCenterX;
    const y = gy - this.screenCenterY;

    return Math.atan2(y, x);
  }

  calcDistance(gx, gy) {
    const x = gx - this.screenCenterX;
    const y = gy - this.screenCenterY;

    return Math.sqrt(x * x + y * y);
  }

  calcRandomPosition() {
    const gx = Math.random() * window.innerWidth;
    const gy = Math.random() * window.innerHeight;

    return { gx, gy };
  }

  checkOverlap(nodes, { gx, gy }) {
    const isOverlap = nodes.some((node) => {
      const { gx: gx1, gy: gy1 } = node;
      const distance = Math.sqrt((gx - gx1) ** 2 + (gy - gy1) ** 2);

      return distance < D3GraphConstants.groupRadius * 2;
    });

    return isOverlap;
  }

  calcPositionForCurrentNode(nodes, node) {
    /**
     * 3. find random position on the screen and check overlap with other nodes
     * 4. if overlap, find another random position
     * 5. if no overlap, return the position
     */

    let isOverlap = true;
    let position = null;
    

    // without node, it will be the head node

    if (node.isMain) {
      // center of the screen
      position = { gx: this.screenCenterX, gy: this.screenCenterY };
      isOverlap = false;
    } else {
      while (isOverlap) {
        const { gx, gy } = this.calcRandomPosition();
  
        position = { gx, gy };
  
        isOverlap = this.checkOverlap(nodes, { gx, gy });
      }
  
      return position;
    }

    return position;
  }

  getRelationId(detail, relatedDetail) {
    return `${detail.id}-${relatedDetail.id}`;
  }

  createHeadGroup({ id }, { gx, gy }) {
    console.log(gx, gy);
    return this.wrapper
      .append("g")
      .attr("data-head-node", true)
      .attr("data-head-node-id", id)
      .attr("cursor", "pointer")
      .attr("transform", `translate(${gx}, ${gy})`);
  }

  setPosition(headGroup, position) {
    headGroup.gx = position.gx;
    headGroup.gy = position.gy;
  }

  // create group inside data-head-node-id
  createGroupInsideHeadNode(headNode, detail, gx, gy) {
    return new D3GroupNode(this.parent, headNode, detail, { gx, gy });
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

  updateGroupPosition(node, gx, gy) {
    console.log(node, gx, gy)
    node.gx = gx;
    node.gy = gy;
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
    headgx,
    headgy,
    outerCircleRadius,
    index,
    length
  ) {
    const angle = (360 / length) * index;
    const gx =
      headgx + outerCircleRadius * 2 * Math.cos((angle * Math.PI) / 180);
    const gy =
      headgy + outerCircleRadius * 2 * Math.sin((angle * Math.PI) / 180);

    return { gx: headgx - gx, gy: headgy - gy };
  }

  createDetailNodes(headNode, outerCircleRadius) {
    const { gx: headgx, gy: headgy, details } = headNode;

    details.forEach((detail, index) => {
      // calculate position of detail node on the outer circle
      const { gx, gy } = this.calculatePositionOnOuterCircle(
        headgx,
        headgy,
        outerCircleRadius,
        index,
        details.length
      );

      const groupInsideHeadNode = this.createGroupInsideHeadNode(
        headNode,
        detail,
        gx,
        gy
      );

      this.createDetailNode(detail, groupInsideHeadNode);
    });
  }

  getRandomPosition(x, y, args) {
    const { min, max } = args;

    const randomX = Math.floor(Math.random() * (max - min + 1) + min);
    const randomY = Math.floor(Math.random() * (max - min + 1) + min);

    return { gx: x + randomX, gy: y + randomY };
  }

  checkOverlapped(x, y, args) {
    const { nodes, radius } = args;
    let isOverlapped = false;

    nodes.forEach((node) => {
      const distance = Math.sqrt(
        Math.pow(x - node.gx, 2) + Math.pow(y - node.gy, 2)
      );
      if (distance < radius * 2) {
        isOverlapped = true;
      }
    });

    return isOverlapped;
  }

  calculatePosition(headgx, headgy, data) {
    // take random position
    let min,
      max,
      radius = 100;

    const transform = d3
      .select(`[${D3GraphConstants.DEFAULT_DATA_GROUP_WRAPPER}]`)
      .attr("transform");

    if (transform) {
      const scaleX = transform.split("scale(")[1].split(")")[0];
      radius = radius * scaleX;

      min = (-window.innerWidth / 4) * scaleX - radius * 2;
      max = (window.innerWidth / 4) * scaleX - radius * 2;
    } else {
      min = -window.innerWidth / 4 - radius * 2;
      max = window.innerWidth / 4 - radius * 2;
    }
    const { gx, gy } = this.getRandomPosition(headgx, headgy, {
      // min is max window size including svg g scale
      min: min,
      max: max,
      // max: 300,
    });

    // check if the position is not overlapped
    const isOverlapped = this.checkOverlapped(gx, gy, {
      nodes: data,
      radius,
    });

    if (isOverlapped) {
      return this.calculatePosition(headgx, headgy, data);
    }

    return { gx, gy };
  }

  findPositionForRelatedGroup(relatedGroup, relations, head) {
    // find position for related group
    const { gx: headgx, gy: headgy } = head;

    // calculate position on screen away from head node
    return this.calculatePosition(headgx, headgy, [
      ...this.nodes,
      ...this.nodes.map((node) => node.details),
      ...relations,
    ]);
  }

  observeAllHeadNodePositionsWhileDragging() {
    const allHeadNodes = d3
      .selectAll(`[${D3GraphConstants.DEFAULT_HEAD_NODE_DATA_ATTR}]`)
      .nodes();

    // allHeadNodes.forEach((headNode) => {
    //   rxJs.fromEvent(headNode, "mousemove").pipe().subscribe((observer) => {
    //     if (observer.target) {
    //       console.log(observer.target.parentElement)
    //       const id = observer.target.parentElement.dataset.headNodeId;

    //       const node = this.nodes.find((node) => node.id === id);
    //       console.log(node, id)

    //       if (node) {
    //         // if this node is overlapping with other nodes, then change the position of this node
    //         const { gx, gy } = this.calculatePosition(node.gx, node.gy, [
    //           ...this.nodes,
    //         ])

    //         console.log(gx, gy)
    //       }
    //     }
    //   })
    // })
  }

  isOverlappingWithOtherHeadNode(x, y, relations) {
    const isOverlapped = this.checkOverlapped(x, y, {
      nodes: [...this.nodes, ...relations],
      radius: 100,
    });

    return isOverlapped;
  }

  findOverlappedHeadNode(x, y, relations) {
    let overlappedHeadNode = null;

    [...this.nodes, ...relations].forEach((node) => {
      const distance = Math.sqrt(
        Math.pow(x - node.gx, 2) + Math.pow(y - node.gy, 2)
      );
      if (distance < 100 * 2) {
        overlappedHeadNode = node;
      }
    });

    return overlappedHeadNode;
  }

  findNearestEmptySpace(overlappedHead, headNode, relations) {
    // find nearest empty space around the two nodes that are overlapping by increasing 5px each time
    const { gx: headgx, gy: headgy } = headNode;
    const { gx: overlappedHeadgx, gy: overlappedHeadgy } = overlappedHead;

    const distance = Math.sqrt(
      Math.pow(headgx - overlappedHeadgx, 2) +
        Math.pow(headgy - overlappedHeadgy, 2)
    );

    const angle = Math.atan2(
      overlappedHeadgy - headgy,
      overlappedHeadgx - headgx
    );

    const gx = headgx + distance * Math.cos(angle);
    const gy = headgy + distance * Math.sin(angle);

    const isOverlapped = this.isOverlappingWithOtherHeadNode(gx, gy, relations);

    if (isOverlapped) {
      return this.findNearestEmptySpace(overlappedHead, headNode, relations);
    }

    return { gx, gy };
  }

  createPath(node, relatedGroup, line, group) {
    const { gx: headgx, gy: headgy } = node;
    const { gx: relatedGroupgx, gy: relatedGroupgy } = relatedGroup;

    const path = line([
      { x: headgx, y: headgy },
      { x: relatedGroupgx, y: relatedGroupgy },
    ]);

    this.wrapper
      .append("path")
      .attr("d", path)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", "none");
  }

  modalToggle(toggle) {
    console.log(toggle);
    d3.select("#modal_div").style(
      "visibility",
      toggle === "close" ? "hidden" : "visible"
    );
  }

  createModal(html) {
    d3.select("#root")
      .append("div")
      .attr("id", "modal_div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("top", window.innerHeight / 2 - 200 + "px")
      .style("left", window.innerWidth / 2 - 100 + "px")
      .style("width", 200)
      .style("height", 200)
      .style("padding", "10px")
      .style("border-radius", "10px")
      .style("background-color", "white")
      .style("box-shadow", "0px 4px 14px rgba(0, 0, 0, 0.15)")
      .html(
        `<div style="margin-top: 10px">
            Burada məlumat xarakterli informasiyalar olacaq
        </div>`
      )
      .append("span")
      .html(
        `<img src="https://static.thenounproject.com/png/1053756-200.png" style="width: 12px" />`
      )
      .style("position", "absolute")
      .style("right", "5px")
      .style("top", "5px")
      .style("cursor", "pointer")
      .on("click", (event) => {
        this.modalToggle("close");
      });
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
    const { x, y, gx, gy, r, image, clipId } = this.detail;

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
