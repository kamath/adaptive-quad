// // Functions to render a given shape with a given angle
// const topLeft = (x, y, w, h) => `${x},${y} ${x+w},${y} ${x+w},${y} ${x},${y+h}`
// const topRight = (x, y, w, h) => `${x},${y} ${x-w},${y} ${x-w},${y} ${x},${y+h}`
// const bottomLeft = (x, y, w, h) => `${x},${y} ${x},${y-h} ${x},${y-h} ${x+w},${y}`
// const bottomRight = (x, y, w, h) => `${x},${y} ${x-w},${y} ${x-w},${y} ${x},${y-h}`
// const square = (x, y, w, h) => `${x - w/2},${y-h/2} ${x+w/2},${y-h/2} ${x+w/2},${y+h/2} ${x-w/2},${y+h/2}`
// const yAxis = (x, y, h, strokeWidth) => `${x-strokeWidth/2},${y + h/2} ${x-strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y + h/2}`
// const xAxis = (x, y, w, strokeWidth) => `${x-w/2},${y + strokeWidth/2} ${x-w/2},${y - strokeWidth/2} ${x+w/2},${y - strokeWidth/2} ${x+w/2},${y + strokeWidth/2}`

// const plot = (x, y, w, h, a, b, f, step) => {
//     const steps = Math.ceil((b - a) / step);
//     figStep = h * w / (a - b) // Resize to current width
//     let points = [];
//     for (let i = 0; i < steps; i++) {
//         points.push(`${x + step*i},${y+50}`)
//     }
//     return points.join(' ')
// }

// const dirs = [topLeft, square, topRight, bottomLeft, bottomRight]

// let i = 0;

// // Figure sizes
// figWidth = vizHeight * .7
// figHeight = vizHeight * .7

// const transitionSpeed = 1500

// // Shapes to render
// let slides = [
//     [
//         [yAxis(width / 2 - figWidth / 2, vizHeight / 2, figHeight, 3), "#DAEFB3", width / 2 - figWidth / 2, vizHeight / 2],
//         [xAxis(width / 2, vizHeight / 2, figWidth, 3), "#DAEFB3", width / 2 - figWidth / 2, vizHeight / 2],
//     ],
//     [
//         [yAxis(width / 2 - figWidth / 2, vizHeight / 2, figHeight, 3), "#DAEFB3", width / 2 - figWidth / 2, vizHeight / 2],
//         [xAxis(width / 2, vizHeight / 2, figWidth, 3), "#DAEFB3", width / 2 - figWidth / 2, vizHeight / 2],
//         [plot(width / 2 - figWidth / 2, vizHeight / 2, figWidth, figHeight, )]
//     ],
// ];

// // Texts to render
// const textSpacer = 20
// let texts = [

// ];