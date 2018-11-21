


function NeoForce (graph) {
        
    var svg, g, margin, width, height, simulation, link, node, text;


    margin = {top: 20, right: 90, bottom: 30, left: 90};
    
    console.log(graph);
    
    width = 960;
    height = 600;

    d3.select("div.canvas-container>svg").remove();
    
    svg = d3.select("body div[class~=features-container]")
        .select("div.canvas-container")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // g = svg.append("g")
    //     .attr("transform",
    //           "translate(" + margin.left + "," + margin.top + ")");
     
    
    simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-200))
        .force("link", d3.forceLink().id(
            function (d) {
                return d.id;
            }
        ).distance(40))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .on("tick", ticked);


    
    // TODO: forget about groups - g (tag)
    // link = g.selectAll(".link");
    // node = g.selectAll(".node");
    // text = g.selectAll(".text");

    link = svg.selectAll(".link");
    node = svg.selectAll(".node");
    text = svg.selectAll(".text");
    
    function loadGraph () {

        var nominal_base_node_size = 8,
            nominal_stroke = 1.5,
            size;

        size = d3.scalePow().exponent(1)
            .domain([1,100])
            .range([8,24]);

        
        simulation.nodes(graph.nodes);
        simulation.force("link")
            .links(graph.links);
        
        link = link
            .data(graph.links)
            .enter()
            .append("line")
            .attr('visibility', function (d) {
                
                if (d.weight < 1)
                    return 'hidden';
            })
            .attr("class", "link");
        

      
        
        // node
        //     .attr("class", "node")
        //     .append("path")
        //     .attr("d", d3.symbol()
        //           .size(function (d) {
        //               // return Math.PI*Math.pow(size(d.weight)||nominal_base_node_size,2);
        //               return 300;
        //           })
        //           .type(function (d) {
                      
        //               if (d.type === 'faeture')
        //                   return d3.symbolDiamond;
        //               else if (d.type === 'document')
        //                   return d3.symbolCircle;
        //               else
        //                   return d3.symbolTriangle;
        //           }));
        
	//     // .style(tocolor, function(d) { 
	//     //     if (isNumber(d.score) && d.score>=0) return color(d.score);
	//     //     else return default_node_color; })

	//     // .style("stroke-width", nominal_stroke)
        //     // .style("stroke", "white");


        

        node = node
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", function(d) {
                if (d.type === 'feature')
                    return 'blue';
                else if (d.type === 'document')
                    return 'green';
                else
                    return 'red';
            });

        node

            .append('text')
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.title;
            });
        
    }
    function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }



    
    loadGraph();
};




