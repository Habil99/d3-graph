import * as d3 from "d3";

import D3GraphConstants from "./D3GraphConstants";
import D3GraphHelper from "./D3GraphHelper";
import nodes, {relations} from "./nodes";

class D3Graph {
    constructor() {
        this.nodes = nodes;
        this.relations = relations;
        this.svg = d3.select("#parent-svg");

        // for styling
        this.svg.append("style").text(this.getGraphStyles());

        this.parent = this.svg
            .append("g")
            .attr(D3GraphConstants.DEFAULT_DATA_GROUP_WRAPPER, "true");
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
        this.d3GraphHelper.createModal();
        this.render();
        this.handleDragNodes();
        // this.d3GraphHelper.observeAllHeadNodePositionsWhileDragging();
    }

    render() {
        this.nodes.forEach((node) => {
            console.log(node)
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
            const headGroup = d3.select(this);
            const headNodeId = headGroup.attr(
                D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
            );
            // move head node
            const headNode =
                self.nodes.find((node) => node.id === headNodeId) ||
                self.relations.find((relation) => relation.id === headNodeId);

            if (headNode) {
                // and if not overlapping with other head node
                const {x, y, dx, dy} = event;
                // console.log(dx, dy)
                // if (
                //   !self.d3GraphHelper.isOverlappingWithOtherHeadNode(
                //     x,
                //     y,
                //     self.relations
                //   )
                // ) {

                // const pathCoords = this.linker(
                //   headDetail,
                //   node,
                //   relatedDetail,
                //   relatedGroup
                // );

                // headDetail.pathCoords = pathCoords;
                // headNode.details[0].pathCoords = self.linker(headNode.details[0], headNode, self.relations[0].details[0], self.relations[0]);
                // d3.select("[data-relation-id=test]").transition(100).attr(
                //   "d",
                //   headNode.details[0].pathCoords
                // );
                self.d3GraphHelper.updateGroupPosition(
                    headNode,
                    event.x,
                    event.y
                );
                headNode.details[0].pathCoords = self.linker(
                    headNode.details[0],
                    headNode,
                    self.relations[0].details[0],
                    self.relations[0]
                );

                d3.select("[data-relation-id=test]")
                    .attr("d", headNode.details[0].pathCoords)

                headGroup.attr("transform", `translate(${event.x}, ${event.y})`);
                // } else {
                //   // find overlapped head node
                //   const overlappedHead = self.d3GraphHelper.findOverlappedHeadNode(
                //     x,
                //     y,
                //     self.relations
                //   );

                //   const overlappedHeadNode = d3.select(
                //     `[${D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR}="${overlappedHead.id}"]`
                //   );
                //   console.log(overlappedHeadNode);

                //   // transition overlapped head node 20px to empty space
                //   // find nearest empty space
                //   const { gX, gY } = self.d3GraphHelper.findNearestEmptySpace(
                //     overlappedHead,
                //     headNode,
                //     self.relations
                //   );

                //   self.d3GraphHelper.updateGroupPosition(overlappedHeadNode, gX, gY);

                //   self.d3GraphHelper.updateGroupPosition(headGroup, x, y);
                //   // let gX = x + 1,
                //     // gY = y + 1;

                //   overlappedHeadNode
                //     .transition()
                //     .duration(200)
                //     .attr("transform", `translate(${gX}, ${gY})`);

                //     console.log(event)
                // }
                // else {
                //   // if overlapping with other head node, move back to original position
                //   headGroup.attr(
                //     "transform",
                //     `translate(${headNode.gX}, ${headNode.gY})`
                //   );
                // }
            }
        }

        this.svg
            .selectAll(`[${D3GraphConstants.DEFAULT_HEAD_NODE_DATA_ATTR}]`)
            .call(
                d3
                    .drag()
                    .on("drag", onDrag)
                    .on("end", function (event) {
                        const {x, y, dx, dy} = event;

                        const headGroup = d3.select(this);
                        const headNodeId = headGroup.attr(
                            D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR
                        );

                        // move head node
                        const headNode =
                            self.nodes.find((node) => node.id === headNodeId) ||
                            self.relations.find((relation) => relation.id === headNodeId);

                        if (headNode) {
                            // if (
                            //   !self.d3GraphHelper.isOverlappingWithOtherHeadNode(
                            //     x,
                            //     y,
                            //     self.relations
                            //   )
                            // ) {

                            self.d3GraphHelper.updateGroupPosition(
                                headNode,
                                event.x,
                                event.y
                            );
                            headNode.details[0].pathCoords = self.linker(
                                headNode.details[0],
                                headNode,
                                self.relations[0].details[0],
                                self.relations[0]
                            );
                            d3.select("[data-relation-id=test]")
                                .transition(100)
                                .attr("d", headNode.details[0].pathCoords);
                            // } else {
                            //   // find overlapped head node
                            //   const overlappedHead =
                            //     self.d3GraphHelper.findOverlappedHeadNode(
                            //       x,
                            //       y,
                            //       self.relations
                            //     );

                            //   const overlappedHeadNode = d3.select(
                            //     `[${D3GraphConstants.DEFAULT_HEAD_NODE_ID_DATA_ATTR}="${overlappedHead.id}"]`
                            //   );
                            //   console.log(overlappedHeadNode);

                            //   // transition overlapped head node 20px to empty space
                            //   // find nearest empty space
                            //   const { gX, gY } = self.d3GraphHelper.findNearestEmptySpace(
                            //     overlappedHead,
                            //     headNode,
                            //     self.relations
                            //   );

                            //   self.d3GraphHelper.updateGroupPosition(
                            //     overlappedHeadNode,
                            //     gX,
                            //     gY
                            //   );

                            //   self.d3GraphHelper.updateGroupPosition(headGroup, x, y);
                            //   // let gX = x + 1,
                            //   // gY = y + 1;

                            //   overlappedHeadNode
                            //     .transition()
                            //     .duration(200)
                            //     .attr("transform", `translate(${gX}, ${gY})`);

                            //   console.log(event);
                            // }
                        }
                    })
            );
    }

    // create circle with image background
    createHeadNode(node) {

        const {x, y, r, gX, gY, image, clipId, dangerous} = node;

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
            .style("stroke-opacity", 0.8)
            .style("stroke-width", 0.5);

        // create detail nodes around head node
        if (node?.details?.length) {
            this.d3GraphHelper.createDetailNodes(node, this.outerCircleRadius);
        }

        return headGroup;
    }

    connectAllNodes(nodes) {
        // with bezier curves dashed line
        // const line = d3
        //     .line()
        //     .x((d) => d.x)
        //     .y((d) => d.y)
        //     .curve(d3.curveBasis);

        nodes.forEach((node) => {
            node.details.forEach((detail) => {
                // find relation inside relations
                const relatedGroup = this.relations.find(
                    (relation) => relation.id === detail.relationId
                );

                if (relatedGroup) {
                    // find position for related group in screen, find new position if screen is not empty
                    const {gX, gY} = this.d3GraphHelper.findPositionForRelatedGroup(
                        relatedGroup,
                        this.relations,
                        node
                    );

                    // update related group position
                    this.d3GraphHelper.updateGroupPosition(relatedGroup, gX, gY);

                    // create related group
                    const relatedGroupElement = this.createHeadNode(relatedGroup, gX, gY);

                    // this.d3GraphHelper.updateGroupPosition(relatedGroup, gX, gY);

                    //  find detail group of related group
                    const relatedDetail = relatedGroup.details[0];
                    const headDetail = detail;

                    const headDetailNode = d3.select(
                        `[${D3GraphConstants.DEFAULT_HEAD_NODE_CHILD_ID_ATTR}="${headDetail.id}"]`
                    );

                    const pathCoords = this.linker(
                        headDetail,
                        node,
                        relatedDetail,
                        relatedGroup
                    );

                    headDetail.pathCoords = pathCoords;
                    console.log(pathCoords)
                    const curveLine = d3
                        .select(d3.select("#parent-svg").select("g").node())

                    curveLine
                        .append("path")
                        .attr("d", pathCoords)
                        .attr("id", "curve")
                        .attr("data-relation-id", "test")
                        .attr("stroke", "#ACACAC")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")
                        .attr("stroke-dasharray", "5, 5")
                        .attr("stroke-linejoin", "round")
                        .style('cursor', 'pointer')
                    // add text above the curveline
                    // curveLine.append('rect')
                    //     .attr('x', gX)
                    //     .attr('y', gY)
                    //     .attr('width', 20)
                    //     .attr('height', 20)
                    //     .attr('fill', 'red')


                    curveLine
                        .append('a')
                        .attr('fill', 'red')
                        .append("text")
                        .append("textPath")
                        .attr("xlink:href", "#curve")
                        .attr("startOffset", "50%")
                        .style('cursor', 'pointer')
                        .text(relatedGroup.relationName)
                        .on('click', (event) => {
                            this.d3GraphHelper.modalToggle('open');
                        })

                }
            });
        });
    }

    linker(node1, head1, node2, head2) {
        // including head gx and gy
        let {gX: hx0, gY: hy0} = head1;
        let {gX: hx1, gY: hy1} = head2;

        hx0 = hx0 + node1.gX;
        hy0 = hy0 + node1.gY;
        hx1 = hx1 + node2.gX;
        hy1 = hy1 + node2.gY;
        const k = this.outerCircleRadius * 2;

        const path = d3.path();

        // move and line path without crossing head1 and head2 circles
        path.moveTo(hx0, hy0);
        path.bezierCurveTo(hx0, hy0, hx1 / k, hy1, hx1, hy1);
        path.lineTo(hx1, hy1);

        return path.toString();
    }

    findNearestPointOnOuterCircle(node1, node2) {
        // exclude the outer circle radius
        const distance =
            Math.sqrt(
                Math.pow(node1.gX - node2.gX, 2) + Math.pow(node1.gY - node2.gY, 2)
            ) -
            this.outerCircleRadius * 2;
        const angle =
            (Math.atan2(node2.gY - node1.gY, node2.gX - node1.gX) * 180) / Math.PI;

        const x = node1.gX + distance * Math.cos((angle * Math.PI) / 180);
        const y = node1.gY + distance * Math.sin((angle * Math.PI) / 180);

        return {x, y};
    }
}

export default D3Graph;
