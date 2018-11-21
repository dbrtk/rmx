

nlp.ClustersView = (function() {


    'use strict';

    function _clusters () {
        /*
          instantiating the clusters view
        */

	var _i, _len, _item, _args = [];
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    _args.push(_item);
	}

        this.dataTree = null;

        this.view = new GenericView();
        // this.loadData();

        // this.loadDendogram();
        // this.dendogram_v3()
        
    }
    _clusters.prototype.loadDendogram = function () {

        var me = this, data, depth;
        
        d3.json('/static/js/data/dendogram.json', function (response) {
            data = response.data;
            depth = response.depth;
            
            me.drawDendogram(data, depth);

        });
        
        // d3.json('/nlptests/request-dendogram/', function (response) {
        //     data = response.data;
        //     depth = response.depth;
            
        //     me.drawDendogram(data, depth);
        // });
        
        // d3.json('/static/js/data/flare.json', function (response) {

        //     me.dataTree = response;
        //     me.drawDendogram();
        // })
        
    };

    
    _clusters.prototype.drawDendogram = function (data, depth) {

        var me, svg, width, theWidth, height, theHeight, g, tree, root, link,
            node, leavesLength, rootDepth;
        
        me = this;
        
        svg = d3.select("svg");
        depth = Math.round(depth);
        
        width = +svg.attr("width");
        height = +svg.attr("height");

        theWidth = depth*150;

        if (width < theWidth) {
            width = theWidth;
            svg.attr('width', theWidth);
        }

        root = d3.hierarchy(data)
            .sum(function(d) { return d.responseCount; });        

        leavesLength = root.leaves().length;
        theHeight = leavesLength * 45;
        if (height < theHeight) {
            height = theHeight;
            svg.attr('height', theHeight);
        }

        tree = d3.cluster()
            .size([height, width - 550]);
        root = tree(root.sort())
        
        g = svg.append("g")
            .attr("transform", "translate(40,0)");

        link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                return "node" + (d.children ? " node--internal" : " node--leaf");
            })
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            })

        node.append("circle")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", 3)
            .attr("x", function(d) {
                return d.children ? -8 : 8;
            })
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start";
            })
            .text(function(d) {
                // return d.id.substring(d.id.lastIndexOf(".") + 1);
                return d.data.name || '';
            });

    };

    function processJsonTree (data) {

        // TODO: implement
    }
    
    _clusters.prototype.radialDendogram = function (data, dataType) {

        var me, svg, width, height, g, stratify, cluster, tree, root, link, node;

        me = this;

        svg = d3.select("svg.radial-dendogram");
        width = +svg.attr("width");
        height = +svg.attr("height");
        g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 20) + ")");

        if (dataType === 'csv') {  // with data coming form a csv
            stratify = d3.stratify()
                .parentId(function(d) {
                    return d.id.substring(0, d.id.lastIndexOf("."));
                });
            cluster = d3.cluster()
                .size([360, width / 2 - 120]);
            
            root = stratify(data)
                .sort(function(a, b) { return a.height - b.height || a.id.localeCompare(b.id); });
            cluster(root);
        }
        
        else if (dataType === 'json') {
            tree = d3.cluster()
                .size([360, width / 2 - 120]);
            root = d3.hierarchy(data)
                .sum(function(d) { return d.responseCount; });        
            root = tree(root)
        }
        else
            throw("You need to provide a dataType argument. 'json' or 'csv' are  the options.");


        link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + project(d.x, d.y)
                    + "C" + project(d.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, d.parent.y);
            });

        node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                return "node" + (d.children ? " node--internal" : " node--leaf");
            })
            .attr("transform", function(d) {
                return "translate(" + project(d.x, d.y) + ")";
            });
        
        node.append("circle")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
            .style("text-anchor", function(d) {
                return d.x < 180 === !d.children ? "start" : "end";
            })
            .attr("transform", function(d) {
                return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
            })
            .text(function(d) {
                if (!d.hasOwnProperty('children')) {
                    console.log(d)
                    console.log(d.data.name || d.name)
                }
                if (dataType === 'json')
                    return d.data.name || d.name;
                else
                    return d.id.substring(d.id.lastIndexOf(".") + 1);
            });        
    };
    
    function project(x, y) {
        var angle = (x - 90) / 180 * Math.PI, radius = y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
    };
        
    _clusters.prototype.loadData = function () {
        /*
          loading the data to the dendogram.
         */
	var container, box, me = this;
	// this.clearContainer();
	// container = getContainer();
        alert('dendoPferdle');
        
    }
    
    
    function getContainer () {
	/*
	 retrieve the container
	 */
	return document.querySelector('body>div[class~=simple-dendogram][class~=container]');
    }

    _clusters.prototype.clearContainer = function() {
	/*
	 remove all from container
	 */
	getContainer().innerHTML = '';	
    };


    _clusters.prototype.drawPhylogram = function (root) {

        
        d3.phylogram.build("div.phylogram", root);
    }
    
    return _clusters;
})();
