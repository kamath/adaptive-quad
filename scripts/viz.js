const toPathData = function(commands, decimalPlaces) {
    let bbox = { x: 0, y: 0, height: 0, width: 0 };
    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

    function floatToString(v) {
        if (Math.round(v) === v) {
            return '' + Math.round(v);
        } else {
            return v.toFixed(decimalPlaces);
        }
    }

    function packValues() {
        let s = '';
        for (let i = 0; i < arguments.length; i += 1) {
            const v = arguments[i];
            if (v >= 0 && i > 0) {
                s += ' ';
            }

            s += floatToString(v);
        }

        return s;
    }

    let d = '';
    for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands[i];
        if ("x" in cmd && cmd.x < bbox.x) bbox.x = cmd.x
        if ("y" in cmd && cmd.y < bbox.y) bbox.y = cmd.y
        if ("x1" in cmd && cmd.x1 < bbox.x) bbox.x = cmd.x1
        if ("y1" in cmd && cmd.y1 < bbox.x) bbox.y = cmd.y1

        if ("x" in cmd && cmd.x > bbox.x + bbox.width) bbox.width = cmd.x - bbox.x
        if ("y" in cmd && cmd.y > bbox.y + bbox.height) bbox.height = cmd.y - bbox.y
        if ("x1" in cmd && cmd.x1 > bbox.x1 + bbox.width) bbox.width = cmd.x1 - bbox.x
        if ("y1" in cmd && cmd.y1 > bbox.y1 + bbox.height) bbox.height = cmd.y1 - bbox.y

        if (cmd.type === 'M') {
            d += 'M' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            d += 'L' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            d += 'Z';
        }
    }

    return [d, bbox];
};


const domID = "#viz"

const baseHeight = window.innerHeight;
const baseWidth = window.innerWidth;
const heightToWidth = 1920 / 1080;
const widthToHeight = 1080 / 1920;

const colors = {
    rectangleBackground: "29,53,87",
    axisColor: "241,250,238",
    curveColor: "168,218,220",
    transparent: "0,0,0",
    areaColor: "69,123,157",
    rectangleColor: "168,218,220",
}

const textHeight = .2 * baseHeight

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = baseWidth - margin.left - margin.right,
    height = baseHeight - margin.top - margin.bottom
vizHeight = baseHeight - margin.top - margin.bottom - textHeight;

const loadMotivation = () => {
    document.getElementById("motivation").style.display = "block"
}

const loadSlides = (font) => {
    document.getElementById("motivation").style.display = "none"
        // append the svg object to the body of the page
    let svg = d3.select(domID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    let bg = svg.append("rect").attr("width", width).attr("height", height).attr("fill", `rgb(${colors.rectangleBackground})`).style("fill", `rgb(${colors.rectangleBackground})`)

    let canvas = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Functions to render a given polygon
    const yAxis = (x, y, h, strokeWidth) => `${x-strokeWidth/2},${y + h/2} ${x-strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y - h/2} ${x+strokeWidth/2},${y + h/2}`
    const xAxis = (x, y, w, strokeWidth) => `${x-w/2},${y + strokeWidth/2} ${x-w/2},${y - strokeWidth/2} ${x+w/2},${y - strokeWidth/2} ${x+w/2},${y + strokeWidth/2}`

    const plot = (x0, y0, w, h, a, b, f, n, yFin, closePath = false) => {
        const dx = (b - a) / n;
        const yStretch = h / yFin;
        const pixelStep = w / n;
        return `M ${x0} ${y0}` + Array(n + 1).fill(1).map((_, i) => {
            const x = a + dx * i;
            return `L${x0 + pixelStep * i} ${y0 - yStretch * f(x)}`
        }).join(" ")
    }

    const MRAM = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            // const y = 
            // console.log("X", x, y0 - yStretch * f(x))
            return `M${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0 - yStretch * f(x + dx/2)} L ${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx/2)} L ${x0 + pixelStep * (i + 1)} ${y0}`
        }).join("")
    }

    const MRAMErrorAbove = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        const xStretch = w / (b - a);
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            const x1 = a + dx * i;
            const x2 = a + dx * i + dx / 2;
            const xc = a + dx * i + dx / 4;
            const y1 = f(x1);
            const y2 = f(x2);
            const yc = f(xc);
            const xBez = 2 * xc - x1 / 2 - x2 / 2;
            const yBez = 2 * yc - y1 / 2 - y2 / 2;
            return Math.abs(f(x + dx / 2)) - Math.abs(f(x)) < 0 ? '' : `M${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x1} ${y0 - yStretch * y2}`
        }).join("") + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            const x1 = a + dx * i + dx / 2;
            const x2 = a + dx * i + dx;
            const xc = a + dx * i + dx / 2 + dx / 4;
            const y1 = f(x1);
            const y2 = f(x2);
            const yc = f(xc);
            const xBez = 2 * xc - x1 / 2 - x2 / 2;
            const yBez = 2 * yc - y1 / 2 - y2 / 2;
            return Math.abs(f(x)) - Math.abs(f(x + dx / 2)) < 0 ? '' : `M${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x2} ${y0 - yStretch * y1}`
        }).join("")
    }

    const MRAMErrorBelow = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        const xStretch = w / (b - a);
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            const x1 = a + dx * i;
            const x2 = a + dx * i + dx / 2;
            const xc = a + dx * i + dx / 4;
            const y1 = f(x1);
            const y2 = f(x2);
            const yc = f(xc);
            const xBez = 2 * xc - x1 / 2 - x2 / 2;
            const yBez = 2 * yc - y1 / 2 - y2 / 2;
            return Math.abs(f(x + dx / 2)) - Math.abs(f(x)) > 0 ? '' : `M${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x1} ${y0 - yStretch * y2}`
        }).join("") + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            const x1 = a + dx * i + dx / 2;
            const x2 = a + dx * i + dx;
            const xc = a + dx * i + dx / 2 + dx / 4;
            const y1 = f(x1);
            const y2 = f(x2);
            const yc = f(xc);
            const xBez = 2 * xc - x1 / 2 - x2 / 2;
            const yBez = 2 * yc - y1 / 2 - y2 / 2;
            return Math.abs(f(x)) - Math.abs(f(x + dx / 2)) > 0 ? '' : `M${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x2} ${y0 - yStretch * y1}`
        }).join("")
    }

    const trapezoidal = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            return `M${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0 - yStretch * f(x)} L ${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx)} L ${x0 + pixelStep * (i + 1)} ${y0}`
        }).join("")
    }

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
            return `M ${x0 + xStretch * x1} ${y0} L${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x2} ${y0}`;
        }).join("")
    }

    let i = 0;

    // Figure sizes
    figWidth = vizHeight * .7;
    figHeight = vizHeight * .7;

    const transitionSpeed = 1000;
    let xAxisFig = {
        points: xAxis(width / 2, vizHeight / 2, figWidth, 3),
        fill: colors.axisColor,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    };

    let yAxisFig = {
        points: yAxis(width / 2 - figWidth / 2, vizHeight / 2, figHeight, 3),
        fill: colors.axisColor,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    }

    let xAxisBottom = {
        ...xAxisFig,
        points: xAxis(width / 2, vizHeight / 2 + figHeight / 2, figWidth, 3),
        cy: vizHeight / 2 + figHeight / 2
    }

    const lineYEqualsX = {
        svgType: "path",
        points: plot(width / 2 - figWidth / 2, vizHeight / 2 + figHeight / 2, figWidth, figHeight, 0, 6.28, x => x, 100, 6.28),
        fill: colors.areaColor,
        stroke: colors.curveColor,
        strokeWidth: 3,
        alpha: 0,
        strokeAlpha: 1,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    };

    const parabola = {
        svgType: "path",
        points: plot(width / 2 - figWidth / 2, vizHeight / 2 + figHeight / 2, figWidth, figHeight, 0, 10, x => Math.pow(x - 5, 2), 100, 25),
        fill: colors.areaColor,
        stroke: colors.curveColor,
        strokeWidth: 3,
        alpha: 0,
        strokeAlpha: 1,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    };

    const sinCurve = {
        svgType: "path",
        points: plot(width / 2 - figWidth / 2, vizHeight / 2, figWidth, figHeight, 0, 6.28, Math.sin, 100, 2),
        fill: colors.areaColor,
        stroke: colors.curveColor,
        strokeWidth: 3,
        alpha: 0,
        strokeAlpha: 1,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    };

    const mramSVG = (halfX, a, b, n, f, yFin) => [{
        svgType: "path",
        points: MRAM(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth, figHeight, a, b, f, n, yFin * (halfX ? 2 : 1)),
        fill: colors.areaColor,
        stroke: colors.rectangleColor,
        strokeWidth: 3,
        alpha: .5,
        strokeAlpha: .4,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    }][0]

    const mramErr = (halfX, a, b, n, f, yFin) => [{
            svgType: "path",
            points: MRAMErrorAbove(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth, figHeight, a, b, f, n, yFin * (halfX ? 2 : 1)),
            fill: "0,255,0",
            stroke: "0,255,0",
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 0,
            cx: width / 2 - figWidth / 2,
            cy: vizHeight / 2
        },
        {
            svgType: "path",
            points: MRAMErrorBelow(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth, figHeight, a, b, f, n, yFin * (halfX ? 2 : 1)),
            fill: "255,0,0",
            stroke: "255,0,0",
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 0,
            cx: width / 2 - figWidth / 2,
            cy: vizHeight / 2
        }
    ];

    const trapezoidSVG = (halfX, a, b, n, f, yFin) => [{
        svgType: "path",
        points: trapezoidal(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth, figHeight, a, b, f, n, yFin * (halfX ? 2 : 1)),
        fill: colors.areaColor,
        stroke: colors.rectangleColor,
        strokeWidth: 3,
        alpha: .5,
        strokeAlpha: .4,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    }][0];

    const simpsonSVG = (halfX, a, b, n, f, yFin) => [{
        svgType: "path",
        points: simpsons(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth, figHeight, a, b, f, n, yFin * (halfX ? 2 : 1)),
        fill: colors.areaColor,
        stroke: colors.rectangleColor,
        strokeWidth: 3,
        alpha: .5,
        strokeAlpha: .4,
        cx: width / 2 - figWidth / 2,
        cy: vizHeight / 2
    }][0]

    // Shapes to render
    let slides = [
        [],
        [
            xAxisBottom,
            {...yAxisFig, cy: vizHeight / 2 + figHeight / 2 },
            lineYEqualsX,
        ],
        [
            xAxisBottom,
            yAxisFig,
            lineYEqualsX,
            mramSVG(false, 0, 6.28, 1, x => x, 6.28),
        ],
        [
            xAxisBottom,
            yAxisFig,
            lineYEqualsX,
            mramSVG(false, 0, 6.28, 1, x => x, 6.28),
            ...mramErr(false, 0, 6.28, 1, x => x, 6.28)
        ],
        [
            xAxisBottom,
            yAxisFig,
            lineYEqualsX,
            mramSVG(false, 0, 6.28, 8, x => x, 6.28),
        ],
        [
            xAxisBottom,
            yAxisFig,
            lineYEqualsX,
            mramSVG(false, 0, 6.28, 8, x => x, 6.28),
            ...mramErr(false, 0, 6.28, 8, x => x, 6.28)
        ],
        [
            xAxisBottom,
            yAxisFig,
            lineYEqualsX,
            mramSVG(false, 0, 6.28, 8, x => x, 6.28),
            ...mramErr(false, 0, 6.28, 8, x => x, 6.28)
        ].map(d => { return {...d, alpha: 0.1, strokeAlpha: 0.1 } }), [
            xAxisFig,
            yAxisFig,
            sinCurve,
            mramSVG(true, 0, 6.28, 8, Math.sin, 1),
            ...mramErr(true, 0, 6.28, 8, Math.sin, 1)
        ],
        [
            xAxisFig,
            yAxisFig,
            sinCurve,
            mramSVG(true, 0, 6.28, 8, Math.sin, 1),
            ...mramErr(true, 0, 6.28, 8, Math.sin, 1),
            {
                svgType: "path",
                points: `M ${width / 2 - figWidth / 2 + figWidth / 8 - 10} ${vizHeight / 2 - figHeight / 2 - 10} L ${width / 2 - figWidth / 2 + 3 * figWidth / 8 + 10} ${vizHeight / 2 - figHeight / 2 - 10} L ${width / 2 - figWidth / 2 + 3 * figWidth / 8 + 10} ${vizHeight / 2 - figHeight / 3} L ${width / 2 - figWidth / 2 + figWidth / 8 - 10} ${vizHeight / 2 - figHeight / 3} Z`,
                fill: colors.areaColor,
                stroke: colors.curveColor,
                strokeWidth: 3,
                alpha: 0,
                strokeAlpha: 1,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            }
        ],
        [
            xAxisFig,
            yAxisFig,
            sinCurve,
            // trapezoidSVG(false, 0, 10, 3, x => Math.pow(x - 5, 2), 25),
            trapezoidSVG(true, 0, 6.28, 8, Math.sin, 1),
            ...mramErr(true, 0, 6.28, 8, Math.sin, 1).map(d => { return {...d, alpha: 0, strokeAlpha: 0 } }),
        ],
        [
            xAxisFig,
            yAxisFig,
            sinCurve,
            simpsonSVG(true, 0, 6.28, 8, Math.sin, 1),
            ...mramErr(true, 0, 6.28, 8, Math.sin, 1).map(d => { return {...d, alpha: 0, strokeAlpha: 0 } }),
            {},
            yAxisFig
        ],
    ];

    // Texts to render
    const textSpacer = 20;
    const h1Size = 55;
    const h3Size = 35;
    let texts = [
        [
            ["plaintext", "Click anywhere to Start", width / 2, height / 2 - 36, h1Size],
            ["plaintext", "Keep clicking to continue", width / 2, height / 2 + 36, h3Size],
        ],
        [
            ["plaintext", "How do we find the area between this line and the x-axis?", width / 2, height / 2 + figHeight / 2],
        ],
        [
            ["plaintext", "It's equivalent to the area of a rectangle with half the height", width / 2, height / 2 + figHeight / 2],
            ["plaintext", "Basic geometry: area of a triangle = 1/2 * bh", width / 2, height / 2 + figHeight / 2 + 50, h3Size],
        ],
        [
            ["plaintext", "It's equivalent to the area of a rectangle with half the height", width / 2, height / 2 + figHeight / 2, , false],
            ["plaintext", "Basic geometry: area of a triangle = 1/2 * bh", width / 2, height / 2 + figHeight / 2 + 50, h3Size, false],
            ["plaintext", "The green surplus balances out the excluded red area", width / 2, height / 2 + figHeight / 2 + 150, h3Size],
        ],
        [
            ["plaintext", "For a line, we can do this with any number of rectangles", width / 2, height / 2 + figHeight / 2],
        ],
        [
            ["plaintext", "For a line, we can do this with any number of rectangles", width / 2, height / 2 + figHeight / 2, , false],
            ["plaintext", "The areas still balance out", width / 2, height / 2 + figHeight / 2 + 50, h3Size],
        ],
        [
            ["plaintext", "But what about other functions?", width / 2, height / 2, h1Size],
        ],
        [
            ["plaintext", "...it doesn't balance out as well", width / 2, height / 2 + figHeight / 2],
        ],
        [
            ["plaintext", "...it doesn't balance out as well", width / 2, height / 2 + figHeight / 2, , false],
            ["plaintext", "Imbalance!", width / 2 - figWidth / 2 + 3 * figWidth / 8 + 30, vizHeight / 2 - 5 * figHeight / 12, , , false, true],
        ],
        [
            ["plaintext", "Replace rectangles with trapezoids", width / 2, height / 2 + figHeight / 2],
        ],
        [
            ["plaintext", "Or better yet... parabolas", width / 2, height / 2 + figHeight / 2],
        ]
    ];

    // Render the text and animate if necessary
    const renderText = (i, ind, textType, text, x, y, size = Math.min(figHeight / 5, 40), animate = true, centerAlign = true, leftAlign = false, rightAlign = false) => {
        console.log("GOT TEXT", text)
        if (textType === "plaintext") {
            const g = canvas.append("g");
            const path = g.append("path");
            path.attr("class", "textSVG")
            if (i > 0 && ind < texts[i - 1].length && animate) {
                const [prevTextType, prevText, prevX, prevY, prevSize = 72, prevAnimate = false] = texts[i - 1][ind]
                const prevPath = font.getPath(prevText, 0, Math.min(prevSize, size), Math.min(size, prevSize)).commands;
                const [d, bbox] = toPathData(prevPath, 5)

                path.attr("d", d)
                    .attr("class", "textSVG " + (animate ? "animate" : ""))
                    .attr("id", `path_${i}_${ind}`);

                const curPath = font.getPath(text, 0, size, size).commands;
                const [dNext, bboxNext] = toPathData(curPath, 0, size, size);
                g.attr("transform", `translate(${prevX - bbox.width / 2} ${prevY - bbox.height})`)
                    .transition().duration(transitionSpeed)
                    .attr("transform", `translate(${x - bboxNext.width / 2} ${y - bboxNext.height})`)
                path.attr("d", d).transition().duration(transitionSpeed)
                    .attr("d", dNext)
            } else {
                console.log("REACHING HERE. ANIMATE:", animate)
                const textPath = font.getPath(text, 0, size, size).commands;
                const [d, bbox] = toPathData(textPath, 5)
                g.attr("transform", centerAlign ? `translate(${x - bbox.width / 2} ${y - bbox.height})` : (leftAlign ? `translate(${x} ${y - bbox.height})` : `translate(${x + bbox.width / 2} ${y - bbox.height})`))

                path.attr("d", d.replaceAll("Z", ""))
                    .attr("class", "textSVG " + (animate ? "animate" : ""))
                    .attr("id", `path_${i}_${ind}`)
                    .attr("shape-rendering", "auto")
            }
            return
        }
        var el = MathJax.tex2svg(String.raw `${text}`)
        el = el.querySelector("svg");
        // el.setAttribute("width", "1ex");
        // el.style.verticalAlign = "middle";
        // el.removeAttribute("width")
        // el.setAttribute("width", size)
        console.log(MathJax.svgStylesheet())
        const displayText = () => canvas
            .append('g')
            .attr('transform', `translate(${x} ${y})`)
            .append(() => el)
            .selectAll("path")
            .attr("class", animate ? "animate" : "")
        animate ? setTimeout(
            displayText,
            transitionSpeed / 2) : displayText()
    }

    // Render the slides
    const renderSlides = (i, prevI) => {
        if (i < texts.length) texts[i].forEach((a, ind) => renderText(i, ind, ...a))
        slides[i].forEach((slide, ind) => {
            const { svgType = "polygon", points, fill, stroke = colors.transparent, strokeWidth = 0, cx, cy, alpha = 1, strokeAlpha = 0, animate = true } = slide
            // Match the element with the same element at the previous index and animate the difference
            if (prevI != -1 && ind < slides[prevI].length) {
                const { points: prevPoints, fill: prevFill, stroke: prevStroke, cx: prevCx, cy: prevCy, strokeWidth: prevStrokeWidth, alpha: prevAlpha = 1, strokeAlpha: prevStrokeAlpha = 0 } = slides[prevI][ind]
                const toAnimate = canvas.append(svgType).attr(svgType === "polygon" ? "points" : "d", prevPoints).attr("fill", `rgba(${prevFill},${prevAlpha})`).attr("stroke", `rgba(${prevStroke},${prevStrokeAlpha})`).style("stroke-width", prevStrokeWidth)
                    .transition().duration(transitionSpeed).attr("fill", `rgba(${fill},${alpha})`).attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", strokeWidth)
                if (svgType === "polygon") toAnimate.attr("points", points)
                else toAnimate.attrTween("d", d => {
                    var previous = prevPoints;
                    // var current = line(d);
                    // return d3.interpolatePath(previous, current);
                    let current = points; //'M10,10 L200,200 L30,300';
                    return d3.interpolatePath(previous, current)
                })
            }
            // Otherwise animate from a given center coordinate pair
            else {
                const toAnimate = canvas.append(svgType).attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", `${strokeWidth}px`)
                    .attr("class", animate ? "animatePoly" : "").style("animation-delay", `1s`).attr("fill", `rgba(${colors.transparent},0)`);
                if (svgType === "polygon") {
                    toAnimate.attr(svgType === "polygon" ? "points" : "d", points.split(" ").length <= 4 ? `${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy}` :
                        points.split(" ").map(x => `${x.split(",")[0]},${cy}`).join(" "))
                    toAnimate.transition().duration(transitionSpeed).attr(svgType === "polygon" ? "points" : "d", points).attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", `${strokeWidth}px`).attr("fill", `rgba(${fill},${alpha})`)
                } else {
                    toAnimate.attr("d", "").transition().duration(transitionSpeed)
                        .attr("d", points)
                        .attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", `${strokeWidth}px`).attr("fill", `rgba(${fill},${alpha})`)
                }
            }
        });
    }

    // Next slide on click, go back to beginning if at the end
    svg.on("click", () => {
        let prevI = i
        i++;
        i = i % slides.length
        canvas.selectAll("g > *").remove()
        renderSlides(i, prevI)
    })

    renderSlides(i, -1)
}