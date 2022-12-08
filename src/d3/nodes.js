const generateUniqueId = () => {
  // always start with a letter (for DOM friendlyness)
  let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicode = Math.floor(Math.random() * 42 + 48);
    if (ascicode < 58 || ascicode > 64) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 32);

  return idstr;
};

const radius = 45;

const detailId = "b";

const nodes = [
  {
    id: "a",
    clipId: generateUniqueId(),
    x: 0,
    y: 0,
    gx: 0,
    gy: 0,
    r: radius,
    dangerous: 80,
    isMain: true,
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    details: [
      {
        id: "aa",
        relatedDetails: [
          {
            parentId: "b",
            id: "ba",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            title: "Facebook",
            description: "Facebook is a social media platform",
            tooltip: null
          },
          {
            parentId: "c",
            id: "ca",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            title: "Facebook",
            description: "Facebook is a social media platform",
            tooltip: null
          },

        ],
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: detailId,
        clipId: generateUniqueId(),
        bezierCurve: null,
      },
      {
        id: "ab",
        relatedDetails: [
          {
            parentId: "c",
            id: "cb",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            title: "Facebook",
            description: "Facebook is a social media platform",
            tooltip: null
          },
        ],
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: detailId,
        clipId: generateUniqueId(),
        bezierCurve: null,
      },
    ],
  },
  {
    id: detailId,
    relationName: "Facebook",
    clipId: generateUniqueId(),
    x: 0,
    y: 0,
    gx: 0,
    gy: 0,
    r: radius,
    dangerous: 25,
    isMain: false,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60",
    details: [
      {
        id: "ba",
        relatedDetails: [
          {
            parentId: "a",
            id: "aa",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            title: "Facebook",
            description: "Facebook is a social media platform",
            tooltip: null,
          }
        ],
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: null,
        clipId: generateUniqueId(),
        bezierCurve: null,
      },
    ],
  },
  {
    id: "c",
    relationName: "Facebook",
    clipId: generateUniqueId(),
    x: 0,
    y: 0,
    gx: 0,
    gy: 0,
    r: radius,
    dangerous: 25,
    isMain: false,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    details: [
      {
        id: "ca",
        relatedDetails: [
          {
            parentId: "a",
            id: "aa",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            title: "Facebook",
            description: "Facebook is a social media platform",
            tooltip: null
          }
        ],
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: null,
        clipId: generateUniqueId(),
        bezierCurve: null,
      },
      {
        id: "cb",
        relatedDetails: [
          {
            parentId: "a",
            id: "ab",
            connected: false,
            bezierCurves: [],
            curveRelationId: null,
            tooltip: null
          }
        ],
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: null,
        clipId: generateUniqueId(),
        bezierCurve: null,
      },
    ],
  },
];

export const relations = [
  {
    id: detailId,
    relationName: "Facebook",
    clipId: generateUniqueId(),
    name: "Node 4",
    x: 0,
    y: 0,
    gx: 0,
    gy: 0,
    r: radius,
    color: "red",
    dangerous: 25,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60",
    details: [
      {
        id: "ba",
        relatedDetail: {
          parentId: "a",
          id: "aa",
        },
        x: 0,
        y: 0,
        gx: 0,
        gy: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: null,
        clipId: generateUniqueId(),
        name: "Node 2",
      },
    ],
  },
];

export default nodes;
