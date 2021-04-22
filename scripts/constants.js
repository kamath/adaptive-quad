const domID = "#viz"

// Window height/width
const baseHeight = window.innerHeight;
const baseWidth = window.innerWidth;
const heightToWidth = 1920 / 1080;
const widthToHeight = 1080 / 1920;

const colors = {
    white: "255,255,255",
    rectangleBackground: "29,53,87",
    axisColor: "241,250,238",
    curveColor: "168,218,220",
    transparent: "0,0,0",
    areaColor: "69,123,157",
    rectangleColor: "168,218,220",
    red: "255,0,0"
}

// Room to leave for text
const textHeight = .2 * baseHeight;
const textWidth = 0

const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = baseWidth - margin.left - margin.right,
    height = baseHeight - margin.top - margin.bottom

// Height of the actual visualization
const vizHeight = baseHeight - margin.top - margin.bottom;

// Speed of animations
const transitionSpeed = 1000;

let i = 0 // 45;

// Figure sizes
const figWidth = vizHeight * .6;
const figHeight = vizHeight * .5;

// Texts to render
const textSpacer = 20;
const h1Size = 55;
const h3Size = 35;

// Center x and y
const xc = baseWidth / 2;
const xLeft = xc - figWidth / 2;
const xRight = xc + figWidth / 2

const yc = baseHeight / 2;
const yTop = yc - figHeight / 2
const yBottom = yc + figHeight / 2;