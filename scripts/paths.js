/**
* Gets an SVG path for a circle given cx, cy, and r
* @param {number} cx center x
* @param {number} cy center y
* @param {number} r circle radius
*/
const circle = (cx, cy, r) => `
M ${cx - r}, ${cy}
a ${r},${r} 0 1,0 ${r*2},0
a ${r},${r} 0 1,0 ${-r*2},0
`

/**
 * Renders x and y axes
 * @param {number} x 
 * @param {number} y 
 * @param {number} h 
 * @param {number} strokeWidth 
 */
const yAxis = (x, y, h, strokeWidth) => `${x-strokeWidth/2},${y + h/2} ${x-strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y + h/2}`
const xAxis = (x, y, w, strokeWidth) => `${x-w/2},${y + strokeWidth/2} ${x-w/2},${y - strokeWidth/2} ${x+w/2},${y - strokeWidth/2} ${x+w/2},${y + strokeWidth/2}`

/**
 * Plots a function
 * @param {number} x0 - starting x point
 * @param {*} y0 - starting y point 
 * @param {*} w - width
 * @param {*} h - height
 * @param {*} a - starting x (on coordinate plane)
 * @param {*} b - ending x (on coordinate plane)
 * @param {*} f - function of x
 * @param {*} n - number of points to use (default 30)
 * @param {*} yFin - highest y value to use
 * @param {*} closePath 
 */
const plot = (x0, y0, w, h, a, b, f, yFin, n=30) => {
    const dx = (b - a) / n;
    const yStretch = h / yFin;
    const xStretch = w / (b - a)
    return `M ${x0} ${y0 - (yStretch * f(a))}` + Array(n).fill(1).map((_, i) => {
        const x1 = a + dx * i;
        const x2 = a + dx * (i + 1);
        const xc = a + dx * i + dx / 2;
        const y1 = f(x1);
        const y2 = f(x2);
        const yc = f(xc);
        const xBez = 2 * xc - x1 / 2 - x2 / 2;
        const yBez = 2 * yc - y1 / 2 - y2 / 2;
        return `Q ${x0 + xStretch * xBez - xStretch * a},${y0 - yStretch * yBez} ${x0 + xStretch * x2 - xStretch * a},${y0 - yStretch * y2}`;
    }).join("")
}

const simpsonCircles = (x0, y0, w, h, a, b, f, yFin, adaptiveI=null, tol=.01) => {
    const yStretch = h / yFin;
    const xStretch = w / (b - a)
    const arr = adaptiveI == null ? [] : adaptive(simpsonsRule, f, a, b, tol)
    adaptiveI = adaptiveI == null ? null : Math.min(arr.length - 1, adaptiveI)
    const x1 = adaptiveI == null ? a : arr[adaptiveI][0];
    const x2 = adaptiveI == null ? b : arr[adaptiveI][2];
    w = adaptiveI == null ? w : (x2 / b) * figWidth
    const xMid = adaptiveI == null ? (a + b) / 2 : arr[adaptiveI][1];
    const y1 = f(x1);
    const y2 = f(x2);
    const yMid = f(xMid);
    const xBez = 2 * xMid - x1 / 2 - x2 / 2;
    const yBez = 2 * yMid - y1 / 2 - y2 / 2;
    return circle(x0 + xStretch * x1, y0 - (yStretch * f(x1)), 7.5) + ' ' + 
        circle(x0 + xStretch * (x2 + x1) / 2, y0 - (yStretch * f((x2 + x1) / 2)), 7.5) +  ' ' + 
        circle(x0 + xStretch * x2, y0 - (yStretch * f(x2)), 7.5) + 
        `M ${x0 + xStretch * x1} ${y0} L ${x0 + xStretch * x1} ${y0 - (yStretch * f(x1))} Q ${x0 + xStretch * xBez - xStretch * a},${y0 - yStretch * yBez} ${x0 + xStretch * x2 - xStretch * a},${y0 - yStretch * y2}` +
        `L ${x0 + xStretch * x2} ${y0} L ${x0 + xStretch * x1} ${y0}`
}

/**
 * Plots Simpson's rule for a given function
 * @param {} x0 
 * @param {*} y0 
 * @param {*} w 
 * @param {*} h 
 * @param {*} a 
 * @param {*} b 
 * @param {*} f 
 * @param {*} n 
 * @param {*} yFin 
 */
const simpsons = (x0, y0, w, h, a, b, f, n, yFin) => {
    const dx = (b - a) / n;
    const yStretch = h / yFin;
    const xStretch = w / (b - a)
    return Array(n).fill(1).map((_, i) => {
        const x1 = a + dx * i;
        const x2 = a + dx * (i + 1);
        const xc = a + dx * i + dx / 2;
        const y1 = f(x1);
        const y2 = f(x2);
        const yc = f(xc);
        const xBez = 2 * xc - x1 / 2 - x2 / 2;
        const yBez = 2 * yc - y1 / 2 - y2 / 2;
        return `M ${x0 + xStretch * x1 - xStretch * a} ${y0} L${x0 + xStretch * x1 - xStretch * a} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez - xStretch * a},${y0 - yStretch * yBez} ${x0 + xStretch * x2 - xStretch * a},${y0 - yStretch * y2} L ${x0 + xStretch * x2 - xStretch * a} ${y0}`;
    }).join("")
}

const adaptiveSimpsons = (x0, y0, w, h, a, b, f, yFin, adaptiveI, tol=.01) => {
    const yStretch = h / yFin;
    const xStretch = w / (b - a)
    arr = adaptive(simpsonsRule, f, a, b, tol).slice(0, adaptiveI).filter(d => d[d.length - 1] === "FINAL")
    return arr.map((d, i) => {
        const x1 = d[0];
        const x2 = d[2];
        w = (x2 / b) * figWidth
        const xMid = d[1];
        const y1 = f(x1);
        const y2 = f(x2);
        const yMid = f(xMid);
        const xBez = 2 * xMid - x1 / 2 - x2 / 2;
        const yBez = 2 * yMid - y1 / 2 - y2 / 2;
        return `M ${x0 + xStretch * x1} ${y0} L ${x0 + xStretch * x1} ${y0 - (yStretch * f(x1))} Q ${x0 + xStretch * xBez - xStretch * a},${y0 - yStretch * yBez} ${x0 + xStretch * x2 - xStretch * a},${y0 - yStretch * y2}` +
            `L ${x0 + xStretch * x2} ${y0} L ${x0 + xStretch * x1} ${y0}`
    }).join(" ")
}