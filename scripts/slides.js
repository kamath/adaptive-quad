const f = x => -16 * Math.PI / Math.pow((x + 1), 2) * Math.sin(4 * Math.PI / (x + 1)) //Math.sin(x) / x
const f1 = Math.sin
a = 0
b = 5// * Math.PI
yFin = 80

arr = adaptive(simpsonsRule, f, a, b, .1, true).filter(d => d[d.length - 1] === "FINAL").map(d => d[4])
err = arr.reduce(function (acc, curr) {
    return acc + curr
  }, 0)
console.log("ADAPTIVE", )

let skipSlides = new Set()
let slides = [
    [
        {
            svgType: "plaintext",
            text: "Click Anywhere to Start", 
            cx: baseWidth / 2, 
            cy: baseHeight / 2, 
            size: h1Size
        },
        {
            svgType: "plaintext",
            text: "(looks best on a 15\" screen)", 
            cx: baseWidth / 2, 
            cy: baseHeight / 2 + 60, 
            size: h1Size * .5
        }
    ],
    [
        {
            svgType: "plaintext",
            text: "Adaptive Quadrature", 
            cx: baseWidth / 2, 
            cy: baseHeight / 2, 
            size: h1Size,
        }
    ],
    [
        {autoSkip: transitionSpeed},
        {
            svgType: "plaintext",
            text: "How do computers find the area under a curve?", 
            cx: baseWidth / 2,
            cy: baseHeight / 2 + figHeight / 2,
            size: Math.min(figHeight / 5, 40),
            animate: true
        },
        {
            svgType: "polygon",
            points: xAxis(xc, yBottom - textHeight, figWidth, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom - textHeight,
        },
        {
            svgType: "polygon",
            points: yAxis(xLeft, yc - textHeight, figHeight, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom - textHeight,
        },
        {
            svgType: "path",
            points: plot(xLeft, yBottom - textHeight, figWidth, figHeight, a, b, x => x, b),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            delay: transitionSpeed / 2
        }
    ],
    [
        {keep: true, animate: false},
        {
            keep: true,
            points: xAxis(xc, yc - textHeight, figWidth, 1.5),
        },
        {
            keep: true,
            points: yAxis(xLeft, yc - textHeight, figHeight, 1.5),
        },
        {
            svgType: "path",
            points: plot(xLeft, yc - textHeight, figWidth, figHeight, a, b, f1, 2),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
        }
    ],
    ...Array(3).fill(1).map((d, i) => [
        {autoSkip: transitionSpeed},
        {
            keep: true,
            text: "Simpson's Rule estimates area with parabolas over a fixed interval", 
            animate: i == 0
        },
        {
            "keep": true, // x axis
        },
        {
            "keep": true, // y axis
        },
        {
            "keep": true // plot
        },
        {
            svgType: "path",
            points: simpsonCircles(xLeft, yc - textHeight, figWidth / Math.pow(2, i), figHeight, a, b / Math.pow(2, i), f1, 2),
            alpha: 0.5,
            fill: colors.areaColor,
            stroke: colors.axisColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            delay: 0,
            skipAfter: transitionSpeed
        }
    ]),
    [
        {keep: true},
        {
            "keep": true, // x axis
        },
        {
            "keep": true, // y axis
        },
        {
            "keep": true, // plot
            alpha: 0
        },
        {
            "keep": true, // parabolas
            alpha: 0,
            strokeAlpha: 0
        },
        {
            svgType: "path",
            points: simpsons(xLeft, yc - textHeight, figWidth, figHeight, a, b, f1, 8, 2),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 1,
        }
    ],
    // Wonky
    [
        {
            keep: true,
            text: `But what about really wonky curves?`,
            animate: true
        },
        {
            svgType: "polygon",
            points: xAxis(xc, yc - textHeight, figWidth, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yc,
        },
        {
            svgType: "polygon",
            points: yAxis(xLeft, yc - textHeight, figHeight, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yc,
        },
        {
            svgType: "polygon",
            svgType: "path",
            points: plot(xLeft, yc - textHeight, figWidth, figHeight, a, b, f, yFin),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            // delay: transitionSpeed
        }
    ],
    ...Array(6).fill(1).map((d, i) => [
        {autoSkip: transitionSpeed},
        {keep: true, animate: false},
        {
            "keep": true, // x axis
        },
        {
            "keep": true, // y axis
        },
        {
            "keep": true // plot
        },
        {
            svgType: "path",
            points: simpsonCircles(xLeft, yc - textHeight, figWidth / Math.pow(2, i), figHeight, a, b / Math.pow(2, i), f, yFin),
            alpha: 0.5,
            fill: colors.areaColor,
            stroke: colors.axisColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            delay: 0,
            skipAfter: transitionSpeed
        }
    ]),
    [
        {
            keep: true,
            text: `Do we need ${Math.pow(2, 6)} intervals to get an accurate estimate?`,
            animate: true
        },
        {
            "keep": true, // x axis
        },
        {
            "keep": true, // y axis
        },
        {
            "keep": true, // plot
            alpha: 0
        },
        {
            "keep": true, // parabolas
            alpha: 0,
            strokeAlpha: 0
        },
        {
            svgType: "path",
            points: simpsons(xLeft, yc - textHeight, figWidth, figHeight, a, b, f, Math.pow(2, 5), yFin),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 1,
        }
    ],
    [
        {
            keep: true,
            text: ``,
        },
        {
            "keep": true, // x axis
        },
        {
            "keep": true, // y axis
        },
        {
            "keep": true, // plot
        },
        {
            "keep": true, // parabolas
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "polygon",
            points: `0,0 ${baseWidth},0 ${baseWidth},${baseHeight} 0,${baseHeight}`,
            alpha: .5,
            fill: colors.transparent
        },
        {
            svgType: "plaintext",
            text: `"Adaptive" - recursively divide and conquer to minimize error`, 
            cx: baseWidth / 2, 
            cy: baseHeight / 2 - h1Size * 2, 
            size: h1Size,
            delay: transitionSpeed
        },
        {
            svgType: "plaintext",
            text: `Instead of specifying number of intervals, specify max error`, 
            cx: baseWidth / 2, 
            cy: baseHeight / 2 - h1Size, 
            size: h1Size * .75,
            delay: transitionSpeed * 2
        },
        {
            svgType: "plaintext",
            text: `More intervals where function changes a lot, less where it doesn't`, 
            cx: baseWidth / 2, 
            cy: baseHeight / 2 + h1Size, 
            size: h1Size * .75,
            delay: transitionSpeed * 3
        }
    ],
    ...Array(19).fill(1).map((d, i) => [
        {autoSkip: transitionSpeed},
        {
            keep: true,
            text: `Let's look at how this works`,
            animate: i == 0
        },
        {
            "keep": true,
        },
        {
            "keep": true,
        },
        {
            "keep": true
        },
        {
            svgType: "path",
            points: simpsonCircles(xLeft, yc - textHeight, figWidth, figHeight, a, b, f, yFin, i + 1, .1),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: 0,
            strokeAlpha: 1,
            cx: xRight,
            animateFromPrev: i != 0
        },
        {
            svgType: "path",
            points: adaptiveSimpsons(xLeft, yc - textHeight, figWidth, figHeight, a, b, f, yFin, i, .1),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 1,
            animate: i == 0,
            animateFromPrev: false
        }
    ]),
    [
        {
            keep: true,
            text: `We end up with just 10 intervals`,
            animate: true
        },
        {
            "keep": true,
        },
        {
            "keep": true,
        },
        {
            "keep": true
        },
        {
            "keep": true,
            alpha: 0,
            strokeAlpha: 0
        },
        {
            svgType: "path",
            points: adaptiveSimpsons(xLeft, yc - textHeight, figWidth, figHeight, a, b, f, yFin, 19, .1),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: .5,
            animateFromPrev: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            svgType: "plaintext",
            text: "Mathematical Intuition:", 
            cx: baseWidth / 2, 
            cy: textHeight, 
            size: h1Size,
            animateFromPrev: false,
        },
        {
            svgType: "latex",
            text: "\\text{For interval }[a, b]\\text{ let }h = \\frac{b-a}{2}\\; \\text{(step)},\\quad c=\\frac{b+a}{2} \\; \\text{(midpoint)}", 
            cx: 50, 
            cy: textHeight + h1Size, 
            size: h1Size * .5
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\text{Simpson's Rule: } S_1[a, b] = \\frac{h}{3}[f(a) + 4f(c) + f(b)]", 
            cx: 50, 
            cy: textHeight + h1Size * 3, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\text{Simpson's Rule: } S_1[a, b] = \\frac{h}{3}[f(a) + 4f(c) + f(b)] \\quad \\text{Error: } E_1[a, b] =  \\frac{-1}{90}h^5f^{(4)}(\\xi)\\quad\\xi\\in[a, b]", 
            cx: 50, 
            cy: textHeight + h1Size * 3, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\int_a^b{f\\,dx} = S_1[a, b] + E_1[a, b]", 
            cx: 50, 
            cy: textHeight + h1Size * 5, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\int_a^b{f\\,dx} = S_1[a, b] + E_1[a, b] = \\int_a^c{f\\,dx} + \\int_c^b{f\\,dx} = S_1[a, c] + E_1[a, c] + S_1[c, b] + E_1[c, b] ", 
            cx: 50, 
            cy: textHeight + h1Size * 5, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\text{Let } S_2[a, b] = S_1[a, c] + S_1[c, b]; \\quad E_2[a, b] = E_1[a, c] + E_1[c, b]", 
            cx: 50, 
            cy: textHeight + h1Size * 7, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        // {autoSkip: transitionSpeed},
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "E_2[a, b] = \\frac{-1}{90}(\\frac{h}{2})^5(f^{(4)}(\\xi_1) + f^{(4)}(\\xi_2))", 
            cx: 50, 
            cy: textHeight + h1Size * 8, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            keep: true,
            animate: false
        },
        {
            svgType: "latex",
            text: "\\text{Assuming }f^{(4)} \\text{ doesn't change much, } E_2[a, b] \\approx 2E_1[a, c] = \\frac{-1}{90}(\\frac{h}{2})^5(2f^{(4)}(\\xi_1)) = \\frac{1}{2^4}E_1[a, b]", 
            cx: 50, 
            cy: textHeight + h1Size * 10, 
            size: h1Size * .5,
            leftAlign: true,
            centerAlign: false
        }
    ],
    [
        {
            svgType: "plaintext",
            text: "Putting it together:", 
            cx: baseWidth / 2, 
            cy: textHeight, 
            size: h1Size,
        },
        {
            svgType: "latex",
            text: "\\int_a^b{f\\,dx} = S_1 + E_1 = S_2 + E_2  = S_2 + \\frac{1}{2^4}E_1", 
            cx: 50, 
            cy: textHeight + h1Size, 
            size: h1Size * .5
        }
    ],
    [
        {keep: true, animate: false},
        {keep: true, animate: false},
        {
            svgType: "latex",
            text: "S_2[a, b] - S_1[a, b] = E_1 - E_2 = 2^4E_2 - E_2 = 15E_2", 
            cx: 50, 
            cy: textHeight + h1Size * 3, 
            size: h1Size * .5
        }
    ],
    [
        {keep: true, animate: false},
        {keep: true, animate: false},
        {keep: true, animate: false},
        {
            svgType: "latex",
            text: "\\rightarrow E_2 = \\frac{S_2-S_1}{15} \\leq \\epsilon, \\quad \\epsilon\\text{ being the max error tolerance}", 
            cx: 50, 
            cy: textHeight + h1Size * 4, 
            size: h1Size * .5
        }
    ],
    [
        {keep: true, animate: false},
        {keep: true, animate: false},
        {keep: true, animate: false},
        {keep: true, animate: false},
        {
            svgType: "latex",
            text: "\\int_a^b f dx = S_2 + E_2 = \\fbox{$S_2 + \\frac{S_2-S_1}{15}$}", 
            cx: 50, 
            cy: textHeight + h1Size * 6, 
            size: h1Size * .5
        }
    ],
]
