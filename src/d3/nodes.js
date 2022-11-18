const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
}

const radius = 45;

const nodes = [
  {
    id: 1,
    clipId: generateUniqueId(),
    name: 'Node 1',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    r: radius,
    color: 'red',
    dangerous: 80,
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    details: [
      {
        x: 0,
        y: 0,
        r: 0,
        image: "https://img.icons8.com/ios/2x/facebook-new.png",
        childId: 2,
        clipId: generateUniqueId(),
        name: 'Node 2',
      },
    ],
    children: [
      {
        id: 2,
        clipId: generateUniqueId(),
        name: 'Node 2',
        x: window.innerWidth / 2 + radius,
        y: window.innerHeight / 2 - radius,
        r: radius,
        color: 'green',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        dangerous: 70
      },
      {
        id: 3,
        clipId: generateUniqueId(),
        name: 'Node 3',
        x: window.innerWidth / 2 + 150,
        y: window.innerHeight / 2 + 250,
        r: radius,
        color: 'green',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
      },
    ]
  },
]

export default nodes;