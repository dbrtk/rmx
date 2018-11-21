var SvgBehaviour = (function () {
    "use strict";

    function zoomed() {
        var circle, line, transform;
        
        d3.selectAll('svg>g').attr("transform", d3.event.transform);
    }
    
    function self (svg, group) {

        this.svg = svg;
                
    };
    
    self.prototype.zoom = function () {

        var width, height;

        width = +this.svg.attr("width");
        height = +this.svg.attr("height");
        
        this.svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(d3.zoom()
                  .scaleExtent([1 / 2, 4])
                  .on("zoom", zoomed));        
    };
    return self;
})();

