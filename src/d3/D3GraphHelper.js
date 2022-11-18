class D3GraphHelper {
  constructor(parent) {
    this.parent = parent;
  }

  createHeadGroup({ x, y, id }) {
    return this.parent.append("g")
      .attr("data-head-node", true)
      .attr("data-head-node-id", id)
      .attr("cursor", "pointer")
      .attr("transform", `translate(${x}px, ${y}px)`);
  }

  setHeadGroup(node) {
    this.parent = node;
  }

  createCircle(x, y, r, color) {
    this.parent.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .style('fill', color);

    return this;
  }

  createClipPath(x, y, r, clipId) {
    this.parent.append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)

    return this;
  }

  createImage(x, y, r, image, clipId) {
    this.parent.append('image')
      .attr('xlink:href', image)
      .attr('x', x - r)
      .attr('y', y - r)
      .attr('width', r * 2)
      .attr('height', r * 2)
      .attr('clip-path', `url(#${clipId})`)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)

    return this;
  }

  createImageWithCustomSize(x, y, r, w, h, image, clipId) {
    this.parent.append('image')
      .attr('xlink:href', image)
      .attr('x', x - w - r / 3)
      .attr('y', y - w - r / 3)
      .attr('width', w)
      .attr('height', h)
      .attr('clip-path', `url(#${clipId})`)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)

    return this;
  }

  // path sector
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // calculate path of 'd' attribute
  calculateD(x, y, r, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, r, endAngle);
    const end = this.polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
  }

  createDangerousPath(x, y, r, dangerous) {
    let dangerousPercantage = dangerous * 360 / 100;
    // make a path for unsafe sector
    this.parent.append('path')
      .attr('d', this.calculateD(x, y, r, 0, dangerousPercantage))
      .attr('stroke', 'red')
      .attr('stroke-width', 5)
    // make a path for safe sector
    this.parent.append('path')
      .attr('d', this.calculateD(x, y, r, dangerousPercantage, 360))
      .attr('stroke', 'green')
      .attr('stroke-width', 5)
  }

  updateNodePosition(node, x, y, r) {
    node.x = x;
    node.y = y;
    node.r = r;
  }

  createDetailNode(node, x, y, r) {
    this.updateNodePosition(node, x, y, r);
    /**
     * create detail node that has image
     */

    const detailNode = new D3DetailNode(this.parent, node);
  }

  createDetailNodes(node) {
    const { x, y, r, details } = node;
    const detailsLength = details.length;

    // if node has details, then draw them
    if (detailsLength > 0) {
      const angle = 360 / detailsLength;
      const detailsRadius = r / 2;
      const outerCircleRadius = r + 50;

      details.forEach((child, index) => {
        const childX = x + (outerCircleRadius * Math.cos(angle * index * Math.PI / 180));
        const childY = y + (outerCircleRadius * Math.sin(angle * index * Math.PI / 180));
        this.createDetailNode(child, childX, childY, detailsRadius);
      });
    } else {
      return this;
    }
  }
}

class D3DetailNode extends D3GraphHelper {
  constructor(parent, node) {
    super(parent);
    this.node = node;
    this.create();
  }

  create() {
    // create image inside and center of circle
    const { x, y, r, image, clipId } = this.node;

    // create circle with background color and append it rounded image
    this.createCircle(x, y, r, "#BBBEC2")
      .createCircle(x, y, r / 2, "#FFFFFF")
      .createClipPath(x, y, r / 2, clipId)
      .createImageWithCustomSize(x + 20, y + 20, r, 25, 25, image, clipId)
  }
}

export default D3GraphHelper;