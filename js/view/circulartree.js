

nlp.CircularTreeView = (function() {

    'use strict';

    var outerRadius, innerRadius, color, timeout, linkExtension, link;
    

    function _circulartree () {
        /*
          instantiating the circular tree view
        */

	var _i, _len, _item, _args = [], _type;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    _args.push(_item);
	}

        this.view = new GenericView();
        _type = _args[0];

        this.instantiate(_type)
    }

    _circulartree.prototype.instantiate = function (type) {

        if (type === 'example')
            this.exampleTreeOfLife();
        
        else if (type === 'loaddata')
            this.loadData();
    };

    function parseNewick(a) {
        /**/
        for(var e=[],r={},s=a.split(/\s*(;|\(|\)|,|:)\s*/),t=0;t<s.length;t++){
            var n=s[t];
            switch(n){
            case"(":
                var c={};
                r.branchset=[c],e.push(r),r=c;
                break;
            case",":
                var c={};e[e.length-1].branchset.push(c),r=c;
                break;
            case")":
                r=e.pop();
                break;
            case":":
                break;
            default:
                var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(
                    r.length=parseFloat(n)
                )
            }
        }
        return r
    }
    _circulartree.prototype.exampleTreeOfLife = function (type) {
        
        var root, me;
        
        me = this;
        d3.text("/static/js/data/life.txt", function(error, life) {
            
            if (error)
                throw error;
            me.drawCircularTree(
                
                d3.hierarchy(parseNewick(life), function(d) {
                    
                    return d.branchset;
                }).sum(function(d) {
                    
                    return d.branchset ? 0 : 1;
                }).sort(function(a, b) {
                    
                    return (a.value - b.value) || d3.ascending(a.data.length, b.data.length);
                })
            )
        });

    }
    _circulartree.prototype.loadData = function (type) {
        /*
          Loading the data form the server.
         */
        var root, me;
        me = this;
        d3.json('/nlptests/request-dendogram/', function (response) {
            root = response.data;
        // d3.json('/static/js/data/flare.json', function (response) {
        //     root = response;
  
            me.drawCircularTree(
                d3.hierarchy(root).sum(function(d) {
                    return d.responseCount;
                })
            );
            
        })
    }
            
    _circulartree.prototype.drawCircularTree = function (root, withLegend = false) {
        /*
          this function expexts a processed root
        */
        var me, svg, legend, chart, input, cluster, descLen; 

        if (typeof(withLegend) === 'undefined') withLegend = false;

        descLen = root.descendants().length
        
        outerRadius = 1000 / 2;
        innerRadius = outerRadius - 250;

        // outerRadius = 1800 / 2;
        // innerRadius = outerRadius - 250;
        
        color = d3.scaleOrdinal()
            .domain(["Bacteria", "Eukaryota", "Archaea"])
            .range(d3.schemeCategory10);
        
        cluster = d3.cluster()
            .size([360, innerRadius])
            .separation(function(a, b) { return 1; });

        svg = d3.select("body").append("svg")
            .attr("width", outerRadius * 2)
            .attr("height", outerRadius * 2);

        if (withLegend) {
            legend = svg.append("g")
                .attr("class", "legend")
                .selectAll("g")
                .data(color.domain())
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(" + (outerRadius * 2 - 10) + "," + (i * 20 + 10) + ")";
                });
            
            legend.append("rect")
                .attr("x", -18)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", color);
            
            legend.append("text")
                .attr("x", -24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d; });
        }
        chart = svg.append("g")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
        
        cluster(root);
        
        input = d3.select("#show-length input").on("change", changed),
        timeout = setTimeout(function() {
            input.property("checked", true).each(changed);
        }, 2000);
        
        setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
        setColor(root);

        linkExtension = chart.append("g")
            .attr("class", "link-extensions")
            .selectAll("path")
            .data(root.links().filter(function(d) {
                return !d.target.children;
            }))
            .enter().append("path")
            .each(function(d) {
                d.target.linkExtensionNode = this;
            }).attr("d", linkExtensionConstant);
        
        link = chart.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(root.links())
            .enter().append("path")
            .each(function(d) { d.target.linkNode = this; })
                .attr("d", linkConstant)
            .attr("stroke", function(d) { return d.target.color; });
        
        chart.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(root.leaves())
            .enter().append("text")
            .attr("dy", ".31em")
            .attr("font-size", "18")
            .attr("transform", function(d) {
                return "rotate(" + (d.x - 90) + ")translate(" + (
                    innerRadius + 4) + ",0)" + (d.x < 180 ? "" : "rotate(180)");
            })
            .attr("text-anchor", function(d) {
                return d.x < 180 ? "start" : "end";
            })
            .text(function(d) {
                return d.data.name.replace(/_/g, " ");
            })
            .on("mouseover", mouseovered(true))
            .on("mouseout", mouseovered(false));
    }
           

    function changed() {
        clearTimeout(timeout);
        var t = d3.transition().duration(750);
        linkExtension.transition(t)
            .attr("d", this.checked ? linkExtensionVariable : linkExtensionConstant);
        link.transition(t).attr("d", this.checked ? linkVariable : linkConstant);
    }
    function mouseovered(active) {
        return function(d) {
            d3.select(this).classed("label--active", active);
            d3.select(d.linkExtensionNode)
                .classed("link-extension--active", active).each(moveToFront);
            do d3.select(d.linkNode).classed("link--active", active)
                .each(moveToFront); while (d = d.parent);
        };
    }
    function moveToFront() {
        this.parentNode.appendChild(this);
    }



    // Compute the maximum cumulative length of any node in the tree.
    function maxLength(d) {
        return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
    }
    
    // Set the radius of each node by recursively summing and scaling the distance from the root.
    function setRadius(d, y0, k) {
        d.radius = (y0 += d.data.length) * k;
        if (d.children) d.children.forEach(function(d) { setRadius(d, y0, k); });
    }
    
    // Set the color of each node by recursively inheriting.
    function setColor(d) {
        var name = d.data.name;
        d.color = color.domain().indexOf(name) >= 0 ? color(name) : d.parent ? d.parent.color : null;
        if (d.children) d.children.forEach(setColor);
    }
    
    function linkVariable(d) {
        return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
    }
    
    function linkConstant(d) {
        return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
    }
    
    function linkExtensionVariable(d) {
        return linkStep(d.target.x, d.target.radius, d.target.x, innerRadius);
    }
    
    function linkExtensionConstant(d) {
        return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
    }
    
    // Like d3.svg.diagonal.radial, but with square corners.
    function linkStep(startAngle, startRadius, endAngle, endRadius) {

        var c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI),
            s0 = Math.sin(startAngle),
            c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI),
            s1 = Math.sin(endAngle);
        
        return "M" + startRadius * c0 + "," + startRadius * s0
            + (endAngle === startAngle ? "" : "A" +
               startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) +
               " " + startRadius * c1 + "," + startRadius * s1)
            + "L" + endRadius * c1 + "," + endRadius * s1;
    }

    
    return _circulartree;    
})();



