module.exports = {
  plugins: ["plugins/markdown", "plugins/summarize"],
  recurseDepth: 10,
  source: {
    include: [
      "../D3Graph.js",
      "../D3GraphNode.js",
    ],
    exclude: [
      /* array of paths to exclude */
    ],
    includePattern: ".+\\.js(doc|x)?$",
    excludePattern: "(^|\\/|\\\\)_",
  },
  // source: {
  //   includePattern: ".+\\.js(doc|x)?$",
  //   excludePattern: "(^|\\/|\\\\)_",
  // },
  sourceType: "module",
  tags: {
    allowUnknownTags: true,
    dictionaries: ["jsdoc", "closure"],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },
};
