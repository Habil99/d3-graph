import D3GraphConstants from "./D3GraphConstants";

class D3GroupNode {
  constructor(parent, headNode, detail, position) {
    this.parent = parent;
    this.headNode = headNode; 
    this.detail = detail; 
    this.position = position;

    this.createGroup();
  }

  createGroup() {
    const { gX, gY } = this.position;

    this.detail.gX = gX;
    this.detail.gY = gY;

    return this.parent
      .append("g")
      .attr(D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ID_ATTR, this.detail.id)
      .attr(D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ATTR, true)
      .attr("transform", `translate(${this.detail.gX}, ${this.detail.gY})`);
  }

  getGroup() {
    return this.group;
  }

  getNode() {
    return this.headNode;
  }

  getId() {
    return this.id;
  }
}

export default D3GroupNode;
