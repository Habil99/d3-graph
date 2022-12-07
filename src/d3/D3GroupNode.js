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
    const { gx, gy } = this.position;

    this.detail.gx = gx;
    this.detail.gy = gy;

    return this.parent
      .append("g")
      .attr(D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ID_ATTR, this.detail.id)
      .attr(D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ATTR, true)
      .attr("transform", `translate(${this.detail.gx}, ${this.detail.gy})`);
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
