/**
* Gets path "d" attribute from OpenType text path commands
* @param {Array[JSON]} commands 
* @param {number} decimalPlaces 
*/
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

const simpsonsRule = (f, a, b) => ((b-a) / 6) * (f(a) + 4*f((a+b)/2) + f(b))

const adaptive = (quad, f, a, b, tol=.05, verbose=false) => {
    const abs = Math.abs
    const c = (a + b) / 2
    const s1 = quad(f, a, b)
    const s2 = quad(f, a, c) + quad(f, c, b)
    const e2 = (1/15) * (s2 - s1)
    if(verbose) console.log("CHECKING:", a, "to", b, "is", abs(e2))


    if (abs(e2) <= tol) {
        if(verbose) console.log("RETURNING")
        return [[a, c, b, s2 + e2, abs(e2)], [a, (a+c) / 2, c, s2 + e2, abs(e2), "FINAL"], [c, (c+b)/2, b, s2 + e2, abs(e2), "FINAL"]]
    }
    
    if(verbose) console.log("NOT ENOUGH.")
    let ans = [[a, c, b, s2 + e2, e2 * 2]]
    if(verbose) console.log("QUEUEING UP", a, c, "AND", c, b)
    if(verbose) console.log("NOW GOING TO", a, c)
    oldC = c
    ans = ans.concat(adaptive(quad, f, a, c, tol / 2, verbose))
    if(verbose) console.log("SAME C?", oldC, c)
    if(verbose) console.log("NOW GOING TO", c, b)
    ans = ans.concat(adaptive(quad, f, c, b, tol / 2, verbose))
    if(verbose) console.log("ANS", ans.filter(d => d[d.length - 1] === "FINAL"))
    return ans
}