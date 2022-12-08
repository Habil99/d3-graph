<!-- Docs for D3Graph.js -->

# D3Graph.js

## D3Graph

### constructor

```js
constructor(nodes, outerCircleRadius) {

  /**
   * @type {Number} outerCircleRadius - radius of the outer circle
   */

  /**
    * @typedef {Object} Node
    * @property {String} id - for relations and nodes
    * @property {String} relationName - for relation name between people
    * @property {String} clipId - for clipPath
    * @property {String} name - for info
    * @property {Number} x - for detail node x position
    * @property {Number} y - for detail node y position
    * @property {Number} gx - for group node x position
    * @property {Number} gy - for group node y position
    * @property {Number} r - radius
    * @property {String} color - color
    * @property {Number} dangerous - displays danger level
    * @property {Boolean} isMain - accepts true or false and displays main node
   */

  this.nodes = nodes;

  ...

  /**
   * We have to append a group to the svg element, because we want to be able to move the whole group node
   * and all its children (the detail nodes) at once.
   * @type {Object}
   * @property {String} D3GraphConstants.DEFAULT_DATA_GROUP_WRAPPER - for data attribute
   * @property {String} true - for data attribute
  */

  this.parent = this.svg
      .append("g")
      .attr(D3GraphConstants.DEFAULT_DATA_GROUP_WRAPPER, "true");

  ...

  /**
   * we have to set the width and height of the svg element to the width and height of the window, because the graph should be responsive and cover the whole screen.
  */

  this.svg
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
}
```

# D3Graph

## Constructor

### new D3Graph()

Creates a new D3Graph.

## Methods

### D3Graph#constructor()

A constructor for D3Graph and its properties.

### Constructor parameters

#### nodes

Type: `Array`

An array of nodes.

#### outerCircleRadius

Type: `Number`

The radius of the outer circle.

## Methods
