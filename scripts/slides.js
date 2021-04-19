const f = x => 16 * Math.PI / Math.pow((x + 1), 2) * Math.sin(4 * Math.PI / (x + 1)) //Math.sin(x) / x
a = 0
b = 5// * Math.PI
yFin = 80

console.log("ADAPTIVE", adaptive(simpsonsRule, f, a, b, .1, true))//.filter(x => x[x.length - 1] === "FINAL"))

let slides = [
    [
        {
            points: xAxis(xc, yBottom, figWidth, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom,
        },
        {
            points: yAxis(xLeft, yc, figHeight, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yBottom,
        },
        {
            svgType: "path",
            points: plot(xLeft, yBottom, figWidth, figHeight, a, b, x => x, b),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            delay: transitionSpeed
        }
    ],
    [
        {
            points: xAxis(xc, yc, figWidth, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yc,
        },
        {
            points: yAxis(xLeft, yc, figHeight, 1.5),
            fill: colors.axisColor,
            cx: xLeft,
            cy: yc,
        },
        {
            svgType: "path",
            points: plot(xLeft, yc, figWidth, figHeight, a, b, f, yFin),
            alpha: 0,
            fill: colors.transparent,
            stroke: colors.curveColor,
            strokeWidth: 3,
            strokeAlpha: 1,
            // delay: transitionSpeed
        }
    ],
    ...Array(6).fill(1).map((d, i) => [
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
            points: simpsonCircles(xLeft, yc, figWidth / Math.pow(2, i), figHeight, a, b / Math.pow(2, i), f, yFin),
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
            points: simpsons(xLeft, yc, figWidth, figHeight, a, b, f, Math.pow(2, 5), yFin),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: 1,
        }
    ],
    ...Array(19).fill(1).map((d, i) => [
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
            points: simpsonCircles(xLeft, yc, figWidth, figHeight, a, b, f, yFin, i + 1, .1),
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
            points: adaptiveSimpsons(xLeft, yc, figWidth, figHeight, a, b, f, yFin, i, .1),
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
            points: adaptiveSimpsons(xLeft, yc, figWidth, figHeight, a, b, f, yFin, 19, .1),
            fill: colors.areaColor,
            stroke: colors.white,
            strokeWidth: 3,
            alpha: .5,
            strokeAlpha: .5,
            animateFromPrev: false
        },
        // {
        //     svgType: "path",
        //     points: simpsons(xLeft, yc, figWidth, figHeight, a, b, f, 7, yFin),
        //     fill: colors.area,
        //     stroke: colors.red,
        //     strokeWidth: 3,
        //     alpha: .5,
        //     strokeAlpha: .5,
        // }
    ]
]

// let skipSlides = new Set([...Array(6).fill(1).map((d, i) => i + 2), ...Array(19).fill(1).map((d, i) => i + 9)])
let skipSlides = new Set(Array(slides.length).fill(1).map((x, i) => i))