const loadSlides = (font) => {
    for(a = 1; a < slides.length; a++) {
        for(x = 0; x < slides[a].length; x++) {
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

    // Render the slides
    const renderSlides = (i, prevI) => {
        if(skipSlides.has(i)) setTimeout(updateI, transitionSpeed * 1.2)
        // if (i < texts.length) texts[i].forEach((a, ind) => renderText(i, ind, ...a))
        slides[i].forEach((slide, ind) => {
            if("keep" in slide) slide = ind == 0 ? {...slides[slides.length - 1][ind], ...slide} : {...slides[i - 1][ind], ...slide}
            const { svgType = "polygon", 
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
            // Match the element with the same element at the previous index and animate the difference
            if (prevI != -1 && ind < slides[prevI].length && animateFromPrev) {
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
}