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

const detailId = generateUniqueId();

const nodes = [
  {
    id: generateUniqueId(),
    clipId: generateUniqueId(),
    name: "Node 1",
    x: 0,
    y: 0,
    gX: window.innerWidth / 2,
    gY: window.innerHeight / 2,
    r: radius,
    color: "red",
    dangerous: 80,
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    details: [
      {
        id: generateUniqueId(),
        x: 0,
        y: 0,
        gX: 0,
        gY: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        relationId: detailId,
        clipId: generateUniqueId(),
        name: "Node 2",
        pathCoords: ""
      },
      {
        id: generateUniqueId(),
        x: 0,
        y: 0,
        gX: 0,
        gY: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        childId: 2,
        clipId: generateUniqueId(),
        name: "Node 2",
      },
      {
        id: generateUniqueId(),
        x: 0,
        y: 0,
        gX: 0,
        gY: 0,
        r: 20,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        childId: 2,
        clipId: generateUniqueId(),
        name: "Node 2",
      },
    ],
    children: [
      {
        id: generateUniqueId(),
        clipId: generateUniqueId(),
        name: "Node 2",
        x: 0,
        y: 0,
        gX: window.innerWidth / 2 + radius,
        gY: window.innerWidth / 2 - radius,
        r: radius,
        color: "green",
        image:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        dangerous: 70,
      },
      {
        id: generateUniqueId(),
        clipId: generateUniqueId(),
        name: "Node 3",
        x: 0,
        y: 0,
        gX: window.innerWidth / 2 + radius,
        gY: window.innerWidth / 2 - radius,
        r: radius,
        color: "green",
        image:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      },
    ],
  },
];

export const relations = [
  {
    id: detailId,
    relationName : "Facebook",
    clipId: generateUniqueId(),
    name: "Node 4",
    x: 0,
    y: 0,
    gX: 0,
    gY: 0,
    r: radius,
    color: "red",
    dangerous: 25,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60",
    details: [
      {
        id: generateUniqueId(),
        x: 0,
        y: 0,
        gX: 0,
        gY: 0,
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
