export const tooltipStyles = {
  wrapper: `
    background: #FFFFFF;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.15);
    border-radius: 0px 15px 15px 15px;
    padding: 16px 32px 16px 13px;
    max-width: 340px;
  `,
  title: `
    font-family: Poppins;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: #000000;
  `,
  date: `
    margin-top: 10px;
    color: #242424;
    opacity: 0.4;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  `,
};

class D3Tooltip {
  constructor(
    container,
    tooltipClass = "d3-tooltip",
    tooltipId = "d3-tooltip",
    tooltipStyle = "position: absolute; opacity: 0; visibility: hidden; transform: translate(20px, -20px); z-index: 10;"
  ) {
    this.container = container;
    this.tooltipClass = tooltipClass;
    this.tooltipId = tooltipId;
    this.tooltipStyle = tooltipStyle;
    this.tooltip = null;
    this.foreignObject = null;
  }

  createTooltip(x, y) {
    this.foreignObject = this.container
      // append foreignObject
      .append("foreignObject")
      .attr("width", 550)
      .attr("height", 200)
      .attr("x", x)
      .attr("y", y);

    this.tooltip = this.foreignObject
      // append body
      .append("xhtml:body")
      .attr("xmlns", "http://www.w3.org/1999/xhtml")
      // append div
      .append("xhtml:div")
      // set tooltip class
      .attr("class", this.tooltipClass)
      // set tooltip id
      .attr("id", this.tooltipId)
      // set tooltip style
      .attr("style", this.tooltipStyle)
      // append x button
      
  }

  showTooltip(html, x, y) {
    this.tooltip
      .attr("width", "100%")
      .attr("height", "100%")
      // .attr("x", x)
      // .attr("y", y)
      .style("opacity", 1)
      .style("visibility", "visible")
      // .style("left", x + "px")
      // .style("top", y + "px")
      .html(html)
      .append("xhtml:button")
      .style("position", "absolute")
      .style("top", "24px")
      .style("right", "12px")
      .on("click", () => {
        this.hideTooltip();

        // remove foreignObject and destroy tooltip
        this.foreignObject.remove();
        this.foreignObject = null;
        this.tooltip = null;

      })
      .attr("class", "close-btn")
      .attr("type", "button")
      .attr("aria-label", "Close")
      .append("xhtml:span")
      .attr("class", "close-btn-span")
      .attr("aria-hidden", "true")
      .html("&times;")
  }

  hideTooltip() {
    this.tooltip.style("opacity", 0).style("visibility", "hidden");
  }

  updatePosition(x, y) {
    this.foreignObject.attr("x", x).attr("y", y);
  }
}

export default D3Tooltip;
