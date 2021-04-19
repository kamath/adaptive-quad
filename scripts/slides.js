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
            keep: true,
            text: "How do computers find the area under a curve?", 
            cy: baseHeight / 2 + figHeight / 2,
            size: Math.min(figHeight / 5, 40)
        },
        {
            svgType: "polygon",
            points: xAxis(xc, yBottom - textHeight, figWidth, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom,
        },
        {
            svgType: "polygon",
            points: yAxis(xLeft, yc - textHeight, figHeight, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom,
        },
        {
            svgType: "path",
            points: plot(xLeft, yBottom - textHeight, figWidth, figHeight, a, b, x => x, b),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            // delay: transitionSpeed
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
            text: `We end up with just 10 intervals and an error of ${err}`,
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
    ]
]

// let skipSlides = new Set(Array(slides.length).fill(1).map((x, i) => i))

// let texts = [
//     [
//         ["plaintext", "Click anywhere to Start", width / 2, height / 2 - 36, h1Size],
//         ["plaintext", "Keep clicking to continue", width / 2, height / 2 + 36, h3Size],
//     ],
//     [
//         ["plaintext", "How do we find the area between this line and the x-axis?", width / 2, height / 2 + figHeight / 2],
//     ],
//     [
//         ["plaintext", "It's equivalent to the area of a rectangle with half the height", width / 2, height / 2 + figHeight / 2],
//         ["plaintext", "Basic geometry: area of a triangle = 1/2 * bh", width / 2, height / 2 + figHeight / 2 + 50, h3Size],
//     ],
//     [
//         ["plaintext", "It's equivalent to the area of a rectangle with half the height", width / 2, height / 2 + figHeight / 2, , false],
//         ["plaintext", "Basic geometry: area of a triangle = 1/2 * bh", width / 2, height / 2 + figHeight / 2 + 50, h3Size, false],
//         ["plaintext", "The green surplus balances out the excluded red area", width / 2, height / 2 + figHeight / 2 + 150, h3Size],
//     ],
//     [
//         ["plaintext", "For a line, we can do this with any number of rectangles", width / 2, height / 2 + figHeight / 2],
//     ],
//     [
//         ["plaintext", "For a line, we can do this with any number of rectangles", width / 2, height / 2 + figHeight / 2, , false],
//         ["plaintext", "The areas still balance out", width / 2, height / 2 + figHeight / 2 + 50, h3Size],
//     ],
//     [
//         ["plaintext", "But what about other functions?", width / 2, height / 2, h1Size],
//     ],
//     [
//         ["plaintext", "...it doesn't balance out as well", width / 2, height / 2 + figHeight / 2],
//     ],
//     [
//         ["plaintext", "...it doesn't balance out as well", width / 2, height / 2 + figHeight / 2, , false],
//         ["plaintext", "Imbalance!", width / 2 - figWidth / 2 + 3 * figWidth / 8 + 30, vizHeight / 2 - 5 * figHeight / 12, , , false, true],
//     ],
//     [
//         ["plaintext", "Replace rectangles with trapezoids", width / 2, height / 2 + figHeight / 2],
//     ],
//     [
//         ["plaintext", "Or better yet... parabolas", width / 2, height / 2 + figHeight / 2],
//     ],
//     [
//         ["plaintext", "What about \"wonkier\" curves?", width / 2, height / 2 + figHeight / 2],
//         ["latex", String.raw `\frac{16\pi}{x^2}\sin(\frac{4\pi}{x})`, width / 2, height / 2 - textHeight, 25],
//     ],
//     [
//         ["plaintext", "More intervals, less error", width / 2, height / 2 + figHeight / 2],
//         ["plaintext", "But also more computations", width / 2, height / 2 + figHeight / 2 + 40],
//         ["latex", String.raw `\frac{16\pi}{x^2}\sin(\frac{4\pi}{x})`, width / 2, height / 2 - textHeight, 25, false],
//     ],
//     [
//         ["latex", String.raw `\frac{16\pi}{x^2}\sin(\frac{4\pi}{x})`, width / 2, height / 2 - textHeight, 25, false],
//     ]
// ];
