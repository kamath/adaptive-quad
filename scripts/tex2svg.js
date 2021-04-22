// MathJax configuration (converts LaTeX to SVG)

window.MathJax = {
    loader: {load: ['[tex]/ams']},
    tex: {packages: {'[+]': ['ams']}},
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ]
    },
    startup: {
        ready: () => {
            console.log('MathJax is loaded, but not yet initialized');
            MathJax.startup.defaultReady();
            // loadMotivation();
            opentype.load('fonts/cmunrm.ttf', function(err, font) {
                if (err) {
                    alert('Font could not be loaded: ' + err);
                } else {
                    loadSlides(font)
                }
            });
            console.log('MathJax is initialized, and the initial typeset is queued');
        }
    },
    svg: {
        scale: 50, // global scaling factor for all expressions
        fontCache: 'none',
        exFactor: 1
    }
};

(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);
})();