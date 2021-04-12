const domID = "#viz"

const baseHeight = window.innerHeight;
const baseWidth = window.innerWidth;
console.log("BASE HEIGHT", baseHeight)
const heightToWidth = 1920 / 1080;
const widthToHeight = 1080 / 1920;

const colors = {
    rectangleBackground: "11,57,84",
    axisColor: "255,200,42",
    curveColor: "255,90,95",
    transparent: "0,0,0",
    areaColor: "191,215,234",
    rectangleColor: "200,29,37",
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

    const plot = (x, y, w, h, a, b, f, step, closePath = false) => {
        const steps = Math.ceil((b - a) / step);
        figStep = step * w / (b - a) // Resize to current width
        let ys = [];
        let xs = [];
        // points.push(`${x},${y}`)
        for (let i = 0; i <= steps; i++) {
            ys.push(f(a + step * i));
            xs.push(figStep * i)
        }
        maxY = Math.max(...ys.map(x => Math.abs(x)));
        dy = h / maxY / 2;
        ys = ys.map(d => y - d * dy);
        points = ys.map((d, i) => `${x + figStep * i},${d}`)
        console.log("POINTS", points.join(' '))
        return `M${x},${y} L` + points.join(' L') + (closePath ? `M${w},${y} M${x},${y}` : "")
    }

    const LRAM = (x, y, w, h, a, b, f, step) => {
        const steps = Math.ceil((b - a) / step);
        figStep = step * w / (b - a) // Resize to current width
        let ys = [];
        let xs = [];
        // points.push(`${x},${y}`)
        for (let i = 0; i < steps - 1; i++) {
            ys.push(f(a + step * i));
            xs.push(figStep * i)
        }
        maxY = Math.max(...ys.map(x => Math.abs(x)));
        dy = h / maxY / 2;
        ys = ys.map(d => y - d * dy);
        points = ys.map((d, i) => `${x + figStep * i},${d}`)
        console.log("POINTS", points.join(' '))
            // return `M${x},${y} L` + points.join(' L');

        return `M${x},${y}` + ys.map((yPoint, i) => {
            return `L${x + figStep * i},${y} L${x+figStep*i},${yPoint} L${x+figStep*(i+1)},${yPoint} L${x+figStep*(i+1)},${y}`
        }).join(" ")
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

    // Shapes to render
    let slides = [
        [
            xAxisFig,
            yAxisFig,
            {
                svgType: "path",
                points: plot(width / 2 - figWidth / 2, vizHeight / 2, figWidth, figHeight, 0, 6.28, Math.sin, .01),
                fill: colors.transparent,
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
            {
                svgType: "path",
                points: plot(width / 2 - figWidth / 2, vizHeight / 2, figWidth, figHeight, 0, 6.28, Math.sin, .01),
                fill: colors.areaColor,
                stroke: colors.curveColor,
                strokeWidth: 3,
                alpha: 0,
                strokeAlpha: 1,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            },
            {
                svgType: "path",
                points: LRAM(width / 2 - figWidth / 2, vizHeight / 2, figWidth, figHeight, 0, 6.28, Math.sin, .5),
                fill: colors.areaColor,
                stroke: colors.rectangleColor,
                strokeWidth: 3,
                alpha: .5,
                strokeAlpha: 0,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            },
        ],
        [{
                points: xAxis(width / 2, vizHeight / 2 + figHeight / 2, figWidth, 3),
                fill: colors.axisColor,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            },
            yAxisFig,
            {
                svgType: "path",
                points: plot(width / 2 - figWidth / 2, vizHeight / 2 + figHeight / 2, figWidth, figHeight, 0, 6.28, x => x, .01),
                fill: colors.transparent,
                stroke: colors.curveColor,
                strokeWidth: 3,
                alpha: 0,
                strokeAlpha: 1,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            },
            {
                svgType: "path",
                points: LRAM(width / 2 - figWidth / 2, vizHeight / 2 + figHeight / 2, figWidth, figHeight, 0, 6.28, x => x, .5),
                fill: colors.areaColor,
                stroke: colors.rectangleColor,
                strokeWidth: 3,
                alpha: .5,
                strokeAlpha: 0,
                cx: width / 2 - figWidth / 2,
                cy: vizHeight / 2
            },
        ]
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
                    toAnimate.attr("d", points).transition().duration(transitionSpeed)
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