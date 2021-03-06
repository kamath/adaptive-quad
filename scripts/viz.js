const textTypes = new Set(["plaintext", "latex"])

const loadSlides = (font) => {
    for(a = 0; a < slides.length; a++) {
        if(slides[a].length > 0 && "autoSkip" in slides[a][0]) {
            skipSlides.add(a);
            slides[a] = slides[a].slice(1);
        }
        else {
            slides[a].push({
                svgType: "plaintext",
                text: "continue ->", 
                cx: baseWidth - 100, 
                cy: baseHeight - 40, 
                size: 25,
                delay: 1500
            })
        }

        if(a > 1) for(x = 0; x < slides[a].length; x++) {
            if("keep" in slides[a][x]) slides[a][x] = {...slides[a-1][x], ...slides[a][x]}
        }
    }

    console.log("SLIDES", slides)

    // Append the svg object to the body of the page
    let svg = d3.select(domID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Background
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", `rgb(${colors.rectangleBackground})`).style("fill", `rgb(${colors.rectangleBackground})`)

    // Canvas to put everything on
    let canvas = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Render the text and animate if necessary
    const renderText = (i, ind, textJson) => {
        const {svgType: textType, 
            text, cx: x, cy: y, 
            size = Math.min(figHeight / 5, 40), 
            animate = true, 
            animateFromPrev = false,
            delay = 0,
            centerAlign = true, leftAlign = false, rightAlign = false} = textJson
        console.log("GOT TEXT", text)
        if (textType === "plaintext") {
            const g = canvas.append("g");
            const path = g.append("path");
            path.attr("class", "textSVG")
            if (i > 0 && ind < slides[i - 1].length && animate && slides[i-1][ind].svgType === textType && animateFromPrev) {
                const {svgType: prevTextType, text: prevText, cx: prevX, cy: prevY, size: prevSize = 72, animate: prevAnimate = false} = slides[i - 1][ind]
                const prevPath = font.getPath(prevText, 0, Math.min(prevSize, size), Math.min(size, prevSize)).commands;
                const [d, bbox] = toPathData(prevPath, 5)

                path//.attr("d", d)
                    .attr("class", "textSVG " + (animate ? "animate" : ""))
                    .attr("id", `path_${i}_${ind}`);

                const curPath = font.getPath(text, 0, size, size).commands;
                const [dNext, bboxNext] = toPathData(curPath, 0, size, size);
                g.attr("transform", `translate(${prevX - bbox.width / 2} ${prevY - bbox.height})`)
                    .transition().delay(delay).duration(transitionSpeed)
                    .attr("transform", `translate(${x - bboxNext.width / 2} ${y - bboxNext.height})`)
                path.attr("d", d).transition().delay(delay).duration(transitionSpeed)
                    .attr("d", dNext)
            } else {
                console.log("REACHING HERE. ANIMATE:", animate)
                const textPath = font.getPath(text, 0, size, size).commands;
                const [d, bbox] = toPathData(textPath, 5)
                g.attr("transform", centerAlign ? `translate(${x - bbox.width / 2} ${y - bbox.height})` : (leftAlign ? `translate(${x} ${y - bbox.height})` : `translate(${x + bbox.width / 2} ${y - bbox.height})`))

                toRender = () => path.attr("d", d.replaceAll("Z", ""))
                    .attr("class", "textSVG " + (animate ? "animate" : ""))
                    .attr("id", `path_${i}_${ind}`)
                    .attr("shape-rendering", "auto")
                delay > 0 ? setTimeout(toRender, delay): toRender()
            }
            return
        }
        var el = MathJax.tex2svg(String.raw `${text}`)
        el = el.querySelector("svg")
        console.log("EL SVG", el)
        // el = el.querySelector("g");
        console.log("EL", el)
            // el.setAttribute("width", "1ex");
            // el.style.verticalAlign = "middle";
            // el.removeAttribute("width")
            // el.setAttribute("width", size)
        // console.log("HEIGHT", parseFloat(el.getAttribute("height").replace("ex", "")) * size)
        // el.removeAttribute("width")
        console.log(MathJax.svgStylesheet())
        displayText = canvas
            .append('g')
        
        const exHeight = parseFloat(el.getAttribute("height").replace("ex", ""))
        const exWidth = parseFloat(el.getAttribute("width").replace("ex", ""))

        displayText.attr('transform', `translate(${x} ${y}) scale(1.5)`)
            .append(() => el)
            .selectAll("*")
            .attr("class", `textSVG latex_${i}_${ind} ` + (animate ? "animate" : ""))
        
        bbox = displayText.node().getBBox()
        console.log("BBOX", bbox)

        // if(centerAlign) displayText.select(`g`).select('g').attr(`transform`, `translate(${x + bbox.width / 2} ${y})`)
        // animate ? setTimeout(
        //     displayText,
        //     transitionSpeed / 2) : displayText()
    }

    // Render the slides
    const renderSlides = (i, prevI) => {
        if(skipSlides.has(i)) setTimeout(updateI, transitionSpeed * 1.2)
        // if (i < texts.length) texts[i].forEach((a, ind) => renderText(i, ind, ...a))
        slides[i].forEach((slide, ind) => {
            if("keep" in slide) slide = ind == 0 ? {...slides[slides.length - 1][ind], ...slide} : {...slides[i - 1][ind], ...slide}
            const { svgType = "skip", 
                    points, 
                    fill, 
                    alpha = 1, 
                    stroke = colors.transparent, 
                    strokeWidth = 0, 
                    strokeAlpha = 0, 
                    cx, cy, 
                    delay = 0,
                    animate = true,
                    animateFromPrev = true,
                } = slide;
            if(svgType === "skip") return
            if(textTypes.has(svgType)) return renderText(i, ind, slide)
            // Match the element with the same element at the previous index and animate the difference
            if (prevI != -1 && ind < slides[prevI].length && animateFromPrev && !textTypes.has(slides[prevI][ind].svgType)) {
                console.log("PREVI", prevI, "IND", ind)
                const { points: prevPoints, fill: prevFill, stroke: prevStroke, cx: prevCx, cy: prevCy, strokeWidth: prevStrokeWidth, alpha: prevAlpha = 1, strokeAlpha: prevStrokeAlpha = 0 } = slides[prevI][ind]
                const toAnimate = canvas.append(svgType).attr(svgType === "polygon" ? "points" : "d", prevPoints).attr("fill", `rgba(${prevFill},${prevAlpha})`).attr("stroke", `rgba(${prevStroke},${prevStrokeAlpha})`).style("stroke-width", prevStrokeWidth)
                    .transition().delay(delay).duration(transitionSpeed).attr("fill", `rgba(${fill},${alpha})`).attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", strokeWidth)
                if (svgType === "polygon") toAnimate.attr("points", points)
                else toAnimate.delay(delay).attrTween("d", d => {
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
                    .attr("fill", `rgba(${colors.transparent},0)`);
                if (svgType === "polygon") {
                    toAnimate.attr(svgType === "polygon" ? "points" : "d", points.split(" ").length <= 4 ? `${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy}` :
                        points.split(" ").map(x => `${x.split(",")[0]},${cy}`).join(" "))
                    toAnimate.transition().delay(delay).duration(transitionSpeed).attr(svgType === "polygon" ? "points" : "d", points).attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", `${strokeWidth}px`).attr("fill", `rgba(${fill},${alpha})`)
                } else {
                    toAnimate.attr("d", "").transition().delay(delay).duration(transitionSpeed)
                        .attr("d", points)
                        .attr("stroke", `rgba(${stroke},${strokeAlpha})`).style("stroke-width", `${strokeWidth}px`).attr("fill", `rgba(${fill},${alpha})`)
                }
                toAnimate.attr("class", animate ? "animatePoly" : "").style("animation-delay", `${delay}ms`)
            }
        });
    }
     
    const updateI = () => {
        let prevI = i
        i++;
        i = i % slides.length
        canvas.selectAll("g > *").remove()
        renderSlides(i, prevI)
    }

    // Next slide on click, go back to beginning if at the end
    svg.on("click", updateI)

    renderSlides(i, -1)
    // if (i < texts.length) texts[i].forEach((a, ind) => renderText(i, ind, ...a))
}