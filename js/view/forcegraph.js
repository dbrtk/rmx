


var ForceGraph = (function () {

    'use strict';

    var Graph, Simulation, Context, Width, Height;
    

    function _createCanvas () {

        d3.select("body div[class~=features-container]")
            .select("div.canvas-container")
            .append('canvas')
            .attr('width', '960')
            .attr('height', '600');
    }
    

    Simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(Width / 2, Height / 2));

    
    function _forcegraph (data) {
        
        var canvas, checker, me;

        me = this;
        
        Graph = data;
        // _createCanvas();

        this.canvas = document.querySelector("canvas");

        // checker = setInterval(function () {

        //     if (document.querySelector("canvas").length) {
        //         console.log('created canvas');
        //         clearInterval(checker);
        //     }
            
        // }, 100);
        
        Context = this.canvas.getContext("2d"),
        Width = this.canvas.width,
        Height = this.canvas.height;

        console.log(data);
        
        this.loadGraph();
    };

    
    function dragstarted() {
        if (!d3.event.active) Simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }
    
    function dragged() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }
    
    function dragended() {
        if (!d3.event.active) Simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
    
    function drawLink(d) {

        Context.moveTo(d.source.x, d.source.y);
        Context.lineTo(d.target.x, d.target.y);
    }
    
    function drawNode(d) {
        
        Context.moveTo(d.x + 3, d.y);
        Context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }
    

    _forcegraph.prototype.loadGraph = function () {

        Simulation
            .nodes(Graph.nodes)
            .on("tick", ticked);
        
        Simulation.force("link")
            .links(Graph.links);
        

        d3.select(this.canvas)
            .call(d3.drag()
                  .container(this.canvas)
                  .subject(dragsubject)
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));
        
        
    };

    function ticked() {
        
        Context.clearRect(0, 0, Width, Height);
        Context.beginPath();
        
        Graph.links.forEach(drawLink);
        Context.strokeStyle = "#aaa";
        Context.stroke();
        
        Context.beginPath();
        
        Graph.nodes.forEach(drawNode);
        Context.fill();
        Context.strokeStyle = "#fff";
        Context.stroke();
    };
    
    function dragsubject() {
        return Simulation.find(d3.event.x, d3.event.y);
    }

    
    
    return _forcegraph;
})();



