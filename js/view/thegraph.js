

var ForceDirectedGraph = (function() {


    "use strict";
    
    var graph, svg, color, simulation, width, height, graphRec, link, node;

    width = window.innerWidth - 200;
    height = 600;

    function makesvg () {
        d3.select("div.canvas-container>svg").remove();
        
        svg = d3.select("body div[class~=features-container]")
            .select("div.canvas-container")
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        return svg;
    }

    
    color = d3.scaleOrdinal(d3.schemeCategory20);

    function simulate () { 
        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 3, height / 2));
        return simulation;
    }

    
    function loadData () {

        link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


        node = svg.selectAll("node")
            .data(graph.nodes)
            .enter()
            .append('g')
            .attr("class", "node")
            .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));

        node.append("circle")
            .attr("x", -8)
            .attr("y", -8)  
            .attr("r", 10)
            .attr("fill", function(d) {

                return color(d.group);
            });
            
        
        node.append("text")
            .attr("class", "nodetxt")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) {

                if (d.type === 'feature') 
                    return getFeatText(d);
                else
                    return '';
            })
            .style("font-size", "12px");
            // .style("stroke", "black");
        
        
        node.append("title")
            .text(function(d) {
                return getFeatText(d);
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);
        
        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            
            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }        
    }
    
    function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    function getFeatText (d) {

        var i, str = [];

        if (d.type === 'feature')  {

            for (i=0; i<d.features.length; i++)
                str.push(d.features[i].word);

            return 'Feature words: ' + str.join(', ');
            
        } else if (d.type === 'document')

            return d.title;
        
        else
            return d.id;
        
    }
    function dragstarted(d) {

        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    //adjust threshold
    function threshold(thresh) {
        graph.links.splice(0, graph.links.length);
	for (var i = 0; i < graphRec.links.length; i++) {
	    if (graphRec.links[i].value > thresh) {graph.links.push(graphRec.links[i]);}
	}
        cleanupNodes();
        loadData();
    }
    function cleanupNodes () {
        makesvg();
        // d3.selectAll('g.nodes').remove();
        // d3.selectAll('g.links').remove();

        
    };
    //Restart the visualisation after any node and link changes
    function restart() {
	link = link.data(graph.links);
	link.exit().remove();
	link.enter().insert("line", ".node").attr("class", "link");
	node = node.data(graph.nodes);
	node.enter()
            .insert("circle", ".cursor")
            .attr("class", "node")
            .attr("r", 5)
            .call(simulation.drag);
	simulation.start();
    }
    
    function _view (data) {

        graph = data;
        
        console.log('instantiating');
        console.log(graph);

        makesvg();
        simulate();
        
        graphRec = JSON.parse(JSON.stringify(graph));

        loadData();        
    }


    _view.prototype.thresholdChange = function (value) {

        threshold(value);
    };
    
    return _view;
})();
