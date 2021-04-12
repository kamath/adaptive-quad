// MathJax configuration (converts LaTeX to SVG)

window.MathJax = {
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ]
    },
    svg: {
        fontCache: 'global'
    },
    startup: {
        ready: () => {
            console.log('MathJax is loaded, but not yet initialized');
            MathJax.startup.defaultReady();
            // loadMotivation();
            loadSlides();
            console.log('MathJax is initialized, and the initial typeset is queued');
        }
    },
    svg: {
        scale: 5, // global scaling factor for all expressions
        minScale: 5, // smallest scaling factor to use
        mtextInheritFont: false, // true to make mtext elements use surrounding font
        merrorInheritFont: true, // true to make merror text use surrounding font
        mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
        skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
        exFactor: .5, // default size of ex in em units
        displayAlign: 'center', // default for indentalign when set to 'auto'
        displayIndent: '0', // default for indentshift when set to 'auto'
        fontCache: 'local', // or 'global' or 'none'
        localID: null, // ID to use for local font cache (for single equation processing)
        internalSpeechTitles: true, // insert <title> tags with speech content
        titleID: 0 // initial id number to use for aria-labeledby titles
    }
};

(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);
})();