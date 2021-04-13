const domID = "#viz"

const baseHeight = window.innerHeight;
const baseWidth = window.innerWidth;
console.log("BASE HEIGHT", baseHeight)
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
    console.log("Loading Motivation")
    document.getElementById("motivation").style.display = "block"
}

const loadSlides = () => {
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
        console.log("DX", dx)
        // const yFin = Math.max(...Array(n).fill(1).map((_, i) => Math.abs(f(a + dx * i))));
        console.log("YFIN", yFin)
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
        console.log("N", n)
        // const yFin = Math.max(...Array(n).fill(1).map((_, i) => Math.abs(f(a + dx * i))))
        console.log("YFIN PATH", yFin)
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
        console.log("N", n)
        // const yFin = Math.max(...Array(n).fill(1).map((_, i) => Math.abs(f(a + dx * i))))
        console.log("YFIN PATH", yFin)
        const yStretch = h / yFin;
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            // const y = 
            // console.log("X", x, y0 - yStretch * f(x))
            return Math.abs(f(x + dx/2)) - Math.abs(f(x)) < 0 ? '' : `M${x0 + pixelStep * i} ${y0 - yStretch * f(x)} L${x0 + pixelStep * i} ${y0 - yStretch * f(x + dx/2)} L${x0 + pixelStep * i + pixelStep / 2} ${y0 - yStretch * f(x + dx/2)}`
        }).join("") + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            // const y = 
            // console.log("X", x, y0 - yStretch * f(x))
            return Math.abs(f(x)) - Math.abs(f(x + dx/2)) < 0 ? '' : `M${x0 + pixelStep / 2 + pixelStep * i} ${y0 - yStretch * f(x + dx / 2)} L${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx / 2)} L${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx)}`
        }).join("")
    }

    const MRAMErrorBelow = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            return Math.abs(f(x + dx/2)) - Math.abs(f(x)) > 0 ? '' : `M${x0 + pixelStep * i} ${y0 - yStretch * f(x)} L${x0 + pixelStep * i} ${y0 - yStretch * f(x + dx/2)} L${x0 + pixelStep * i + pixelStep / 2} ${y0 - yStretch * f(x + dx/2)}`
        }).join("") + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            return Math.abs(f(x)) - Math.abs(f(x + dx/2)) > 0 ? '' : `M${x0 + pixelStep / 2 + pixelStep * i} ${y0 - yStretch * f(x + dx / 2)} L${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx / 2)} L${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx)}`
        }).join("")
    }

    const trapezoidal = (x0, y0, w, h, a, b, f, n, yFin) => {
        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        return `M${x0},${y0}` + Array(n).fill(1).map((_, i) => {
            const x = a + dx * i;
            // const y = 
            // console.log("X", x, y0 - yStretch * f(x))
            return `M${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0} L ${x0 + pixelStep * i} ${y0 - yStretch * f(x)} L ${x0 + pixelStep * (i + 1)} ${y0 - yStretch * f(x + dx)} L ${x0 + pixelStep * (i + 1)} ${y0}`
        }).join("")
    }

    const simpsons = (x0, y0, w, h, a, b, f, n, yFin) => {
        const getParabola = (c1, c2, c3) => {
            const [x1, y1] = c1;
            const [x2, y2] = c2;
            const [x3, y3] = c3;
            denom = (x1 - x2)*(x1 - x3)*(x2 - x3)
            const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2))
            const b = (x3*x3 * (y1 - y2) + x2*x2 * (y3 - y1) + x1*x1 * (y2 - y3))
            const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3)
            return [a, b, c]
        }

        const vertexForm = (a, b, c) => {
            const h = -b/(2*a);
            const k = c - Math.pow(b, 2) / (4*a)
            return [a, h, k]
        }

        const dx = (b - a) / n;
        const pixelStep = w / n;
        const yStretch = h / yFin;
        const xStretch = w / (b - a)
        return Array(n).fill(1).map((_, i) => {
            const x1 = a + dx * i;
            const x2 = a + dx * (i + 1);
            const xc = a + dx * i + dx / 2;
            const y1 = f(x1);
            const y2 = f(x2);
            const yc = f(xc);
            const xBez = 2*xc - x1/2 - x2/2;
            const yBez = 2*yc - y1/2 - y2/2;
            // console.log("X1", x1, x0 + pixelStep * i, x0 + xStretch * x1);
            // console.log("X2", x2, x0 + pixelStep * (i + 1), x0 + xStretch * x2);
            // console.log("XC", xc, x0 + pixelStep * i + pixelStep / 2, x0 + xStretch * xc);
            // console.log("Y1", y1, y0 - yStretch * f(x0 + dx * i), y0 - yStretch * y1);
            // console.log("Y2", y2, y0 - yStretch * f(x0 + dx * (i + 1)), y0 - yStretch * y2);
            // console.log("YC", yc, y0 - yStretch * f(x0 + dx * i + dx / 2), y0 - yStretch * yc);
            // console.log("XBEZ", xBez)
            return `M ${x0 + xStretch * x1} ${y0} L${x0 + xStretch * x1} ${y0 - yStretch * y1} Q ${x0 + xStretch * xBez},${y0 - yStretch * yBez} ${x0 + xStretch * x2},${y0 - yStretch * y2} L ${x0 + xStretch * x2} ${y0}`;
        }).join("")
    }

    let i = 0;

    // Figure sizes
    figWidth = vizHeight * .7;
    figHeight = vizHeight * .7;

    const transitionSpeed = 1500;
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
    }];

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

    const simpsonSVG = (halfX, a, b, n, f, yFin) => {
        n = 5;
        return Array(n).fill(1).map((_, i) => {
            dx = (b - a) / n
            return {
                svgType: "path",
                points: simpsons(width / 2 - figWidth / 2, vizHeight / 2 + (halfX ? 0 : figHeight / 2), figWidth / n, figHeight, a + dx * i, a + dx * (i + 1), f, 1, yFin * (halfX ? 2 : 1)),
                fill: colors.areaColor,
                stroke: colors.rectangleColor,
                strokeWidth: 3,
                alpha: .5,
                strokeAlpha: .4,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
        }})
    };

    // Shapes to render
    let slides = [
        // [
        //     xAxisBottom,
        //     yAxisFig,
        //     lineYEqualsX,
        // ],
        // [
        //     xAxisBottom,
        //     yAxisFig,
        //     lineYEqualsX,
        //     mramSVG(false, 0, 6.28, 8, x=>x, 6.28),
        // ],
        // [
        //     xAxisBottom,
        //     yAxisFig,
        //     lineYEqualsX,
        //     mramSVG(false, 0, 6.28, 8, x=>x, 6.28),
        //     ...mramErr(false, 0, 6.28, 8, x=>x, 6.28)
        // ],
        // [
        //     xAxisFig,
        //     yAxisFig,
        //     sinCurve,
        //     mramSVG(true, 0, 6.28, 8, Math.sin, 1)
        // ],
        // [
        //     xAxisFig,
        //     yAxisFig,
        //     sinCurve,
        //     mramSVG(true, 0, 6.28, 8, Math.sin, 1),
        //     ...mramErr(true, 0, 6.28, 8, Math.sin, 1)
        // ],
        // [
        //     xAxisBottom,
        //     yAxisFig,
        //     parabola,
        //     trapezoidSVG(false, 0, 10, 3, x => Math.pow(x - 5, 2), 25),
        //     yAxisFig
        // ],
        [
            xAxisFig,
            yAxisFig,
            sinCurve,
            ...simpsonSVG(true, 0, 6.28, 2, Math.sin, 1),
            yAxisFig
        ],
        
    ];

    // Texts to render
    const textSpacer = 20
    let texts = [

    ];

    // Render the text and animate if necessary
    const renderText = (text, x, y, size = 20, animate = true) => {
        console.log("GOT TEXT", text)
        var el = MathJax.tex2svg(String.raw `${text}`)
        el = el.querySelector("svg");
        el.setAttribute("height", size);
        el.setAttribute("width", size)
        console.log(MathJax.svgStylesheet())
        const displayText = () => canvas
            .append('g')
            .attr('transform', `translate(${x - size / 2} ${y - size / 2})`)
            .append(() => el)
            .selectAll("path")
            .attr("class", animate ? "animate" : "")
        animate ? setTimeout(
            displayText,
            transitionSpeed / 2) : displayText()
    }

    // Render the slides
    const renderSlides = (i, prevI) => {
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
        // texts[i].forEach((a, ind) => renderText(a[0], a[1], a[2], a[3], a[4]))
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