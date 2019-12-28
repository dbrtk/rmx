
var SimpleGraph = (function () {
    "use strict";
    
    var graph, color, width, height, simulation, link, node,

        tooldiv,
        
        // highlight variables
        default_link_color,
        highlight_color,
        node_highlight_color,
        focus_node = null,
        highlight_node = null,

        highlight_trans = 0.1,

        feat_node_color = 'red',
        doc_node_color = 'black',
        toggle_highlight = 0,
        linked_by_id = {},
        
        // svg variables
        svg,
        group,
        svgBehaviour;
    
    node_highlight_color = 'blue';
    highlight_color = "blue";
    default_link_color = "#888";
    
    width = window.innerWidth - 200;
    height = 800;

    color = d3.scaleOrdinal(d3.schemeCategory20);
    
    function sim () {
        simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-200))
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(40))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2))
            .on("tick", ticked);
    }
    
    function loaddata () {
        var i, item;


        group = svg.append('g');
        
        // link = svg.selectAll(".link"),
        // node = svg.selectAll(".node");
        
        link = group.selectAll(".link"),
        node = group.selectAll(".node");
        
        graph.links = graph.links.filter(function (d) {
            return parseFloat(Math.sqrt(d.weight).toFixed(1)) > 0.1;
        });

        for (i=0; i<graph.links.length; i++) {
            item = graph.links[i];
            linked_by_id[item.source + "," + item.target] = true;
        }
        
        simulation.nodes(graph.nodes);
        simulation.force("link").links(graph.links);
        
        link = link
            .data(graph.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                
                return Math.sqrt(d.weight);
            });
        
        node = node
            .data(graph.nodes)
            .enter()        
            .append('g')
            .attr("class", "node");

        
        node.append("circle")
            .attr("r", 7)
            .style("fill", function(d) {
                if (d.type === 'feature') return feat_node_color;
                return doc_node_color;
            });

    }
    function getFeatText (d) {

        var i, str = [];

        if (d.type === 'feature')  {

            for (i=0; i<d.features.length; i++)
                str.push(d.features[i].word);

            return str.join('   ') + '   (feature words)';
            
        } else if (d.type === 'document')

            return d.title;
        
        else
            return d.id;
        
    }
    function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        
        // node.attr("cx", function(d) { return d.x; })
        //     .attr("cy", function(d) { return d.y; });
    }    
    function makesvg () {

        var svgBehaviour;
        
        d3.select("div.canvas-container>svg").remove();
        svg = d3.select("body div[class~=features-container]")
            .select("div.canvas-container")
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        svgBehaviour = new SvgBehaviour(svg, group);
        svgBehaviour.zoom();
        
        return svg;
    }

    // highlight code
    function isConnected(a, b) {

        var _source, _target, _link;
        if (a.type === b.type)
            return false;

        return linked_by_id[b.id + ',' + a.id] || linked_by_id[a.id + ',' + b.id];
        
    };    
    function set_highlight(d) {
	// svg.style("cursor","pointer");
        
	if (focus_node!==null)
            d = focus_node;

        highlight_node = d;

	if (highlight_color!="white") {
            
	    node.select('circle')
                .style('stroke', function(o) {
                    return isConnected(d, o) ? node_highlight_color : "white";
                })
	        .style('fill', function (o) {
                    if (o.type === 'document')
                        return isConnected(d, o) ? node_highlight_color : doc_node_color;
                    else
                        return feat_node_color;
                });
            link.style("stroke", function(o) {
		return o.source.index == d.index ||
                    o.target.index == d.index ? highlight_color :
                    ((isNumber(o.score) && o.score>=0) ?
                     color(o.score) : default_link_color);x                
            });
	}
    };
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    function exit_highlight() {

	highlight_node = null;
        
        if (focus_node === null) {
	    // svg.style("cursor","move");
	    if (highlight_color!="white") {
  	        node.select('circle')
                    .style('stroke', "white")
                    .style('fill', function (d) {
                        if (d.type === 'feature')
                            return feat_node_color;
                        else
                            return doc_node_color;
                    });
	        link.style("stroke", function (o) {
                    return (isNumber(o.score) && o.score>=0) ? color(o.score)
                        : default_link_color;
                });
            }   
	}        
    }
    function highlight_selected (d) {
        
        var _txt, _connected = 0;
        if (toggle_highlight == 0) {
            
            node
                .style("opacity", function (o) {
                    _connected = isConnected(d, o) | isConnected(o, d);
                    if (o === d) return 1;
                    return _connected ? 1 : 0.1;
                })
                // .append('text')
                // .attr('class', 'nodetxt')
                // .style("font-size", "14px")            
                // .attr("dx", -12)
                // .attr("dy", ".35em")
                // .attr("text-anchor", "end")
                // .attr("transform", null)
                // .text(function (o) {
                //     if (isConnected(d, o) | isConnected(o, d)) 
                //         if (o.type === 'feature')
                //             return getFeatText(o);
                //         else return '';
                //     else
                //         return '';
                // })            
                // .filter(function(o) {
                    
                //     return d.x < o.x;
                // })
                // .attr("text-anchor", "start")
                // .attr("dx", 12)
            ;
            link.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            toggle_highlight = 1;
            if (d.type === 'feature')
                load_feat_docs(d);
            else if (d.type === 'document')
                load_doc_feats(d);
        } else {

            node.style("opacity", 1);
            link.style("opacity", 1);


            _txt = node.selectAll('text');

            _txt.remove();
            
            toggle_highlight = 0;
            cleanFeatcontainer();
        }
        
    }
    
    // end of highlight code

    function tooltipSetup () {

        tooldiv = d3.select("body > div.features-container > div.canvas-container")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    };
    
    function _self (data) {


        cleanFeatcontainer();
        graph = data;

        makesvg();
        
        sim();

        loaddata();
        
        tooltipSetup();        
        
        this.utils = new rmxutils();
    }
    function cleanFeatcontainer (container) {

        if (container === undefined)
            container = "div[class~=features-container]>div.features-html";

        d3.select(container)
            .selectAll('*')
            .remove();
    }


    function load_doc_feats (datum) {
        var i, link, obj, feat, doc,
            container = "div[class~=features-container]>div.features-html";
        if (toggle_highlight === null)
            return false;
        cleanFeatcontainer(container);
        obj = {
            documents: []
        };
        doc = {
            title: datum.title,
            url: datum.url,
            dataid: datum.dataid,
            corpusid: datum.corpusid,
	    fileid: datum.fileid,
            feats: []
        };        
        for (i=0; i<graph.nodes.length; i++) {
            feat = graph.nodes[i];
            if (feat.type === 'document' || !isConnected(feat, datum)) continue;
            link = graph.links.find(function (o) {
                return o.source.id === datum.id && o.target.id === feat.id;
            });
            doc.feats.push({
                weight: link && 'weight' in link ? link.weight : 0, // .toFixed(3),
                features: feat.features
            });
        }
        
        doc.feats.sort(function (a,b) {
            return b.weight - a.weight;
        });
        obj.documents.push(doc);        
        rmxutils.xhr('/static/js/tpl/corpus/doc-feats.html', function (response) {
            d3.select(container).html(Mustache.render(response, obj));

            // TODO: implement
            weight_to_circle(doc.feats);            
        });

        return 0;
    };


    function weight_to_circle (data) {

        var i, svg_divs, circle, r, datum, svg, gradient, w, h, txt;

        w = 150;
        h = 150;
        
        r = Math.min(w, h) / 2;
        
        for(i=0; i<data.length; i++) {
            datum = data[i];
            //dataset.push(Math.round(Math.random()*100));
        }
        
        svg_divs = d3.selectAll('div.feat-weight')
            .data(data);

        svg = svg_divs
            .append('svg')
            .style('margin-right', '20px')
            .attr('width', w)
            .attr('height', h)
            .append('g');
        
        gradient = svg
            .append('defs')
            .append("radialGradient")
            .attr("id", "radial-gradient");


        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "black");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#fff");


        // circle = svg.append("circle")
        //     .attr("cx", w / 2)
        //     .attr("cy", h / 2)
        //     .attr("r", r)
        //     .style("fill", "url(#radial-gradient)");        
        //     // .style("stroke", "black")
        //     // .style("fill", "white");
                

        txt = svg
            .append('text')
            .attr('class', 'txt-weight')
            .style('font-size', '25px')
            // .style('fill', 'white')
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr("dx", w / 2)
            .attr("dy", h / 2)
            .text(function (d) {

                return d.weight.toFixed(4);
            });

        // circle
        //     .append('title')
        //     .text(function(d) {
        //         return d.weight + " - feature's weight for this document / web-page.";
        //     });
        
        
    };


    function contextTpl (sentences) {

	return Mustache.to_html(
	    `<ul>
                 {{#sentences}}
                     <li><span>{{{.}}}</span></li>
                 {{/sentences}}
             </ul>`, {sentences: sentences})
    };
    
    
    function load_feat_docs (datum) {

        var i, link, item, obj, feat, doc, lemma, containerEl, el, 
            container = "div[class~=features-container]>div.features-html";

        if (toggle_highlight === null)
            return false;
	
        cleanFeatcontainer(container);
        containerEl = d3.select(container);
	
        obj = {
            features: []
        };
        feat = {
            features: datum.features,
            docs: []
        };
        for (i=0; i<graph.nodes.length; i++) {

            item = graph.nodes[i];
            if (item.type === 'feature' || !isConnected(item, datum)) continue;

            link = graph.links.find(function (o) {
                return o.source.id === item.id && o.target.id === datum.id;
            });
            
            feat.docs.push({
                title: item.title,
                url: item.url,
		fileid: item.fileid,
                dataid: item.dataid,
                corpusid: graph.corpusid,
                weight: link && 'weight' in link ? link.weight : 0
            });

        }
        feat.docs.sort(function (a, b) {
            // sort descending
            return b.weight - a.weight;
        });
        obj.features.push(feat);
        obj.toFixed =  function() {
            return function(num, render) {
                return parseFloat(render(num)).toFixed(3);
            }
        }
	lemma = []
	for (var i = 0; i < datum.features.length; i++)
	    lemma.push(encodeURIComponent(datum.features[i]['word']));

	rmxutils.xhr('/static/js/tpl/corpus/feat-docs.html',
		     function (response) {
			 containerEl.html(
			     Mustache.render(response, obj));
			 loadContext(graph.corpusid, lemma, container);
		     });

	document.body.querySelector(container).scrollIntoView({
	    behavior: 'smooth',
	    block: 'center'
	});
	
        return 0;
    };
    function loadContext (corpusid, lemma) {

	var container = "div[class~=features-container]>div.features-html";
	rmxutils.xhr(
	    '/container/' + corpusid + '/context/?lemma=' + lemma.join(),
	    
	    function (jsonResp) {
		jsonResp = JSON.parse(jsonResp);
		for (var key in jsonResp.data) {
		    if (jsonResp.data.hasOwnProperty(key)) {

			d3.select(
			    container + ' div.context-box[data-fileid="' + key + '"]'
			).html(contextTpl(jsonResp.data[key]));
		    }
		}
	    }
	);
    };

    _self.prototype.nodeClick = function (g) {

        var node, datum;
        node = d3.select(g);
        datum = node.datum();
        
        highlight_selected(datum);

        // implement data loading message

        
    };
    
    _self.prototype.delete = function (datum) {

        d3.select("div.canvas-container>svg").remove();
    };

    _self.prototype.nodeMouseenter = function (e) {

        var node, datum, g;

        g = e.target.parentElement;

        node = d3.select(g);
        datum = node.datum();
        
        set_highlight(datum);

        this.showTooldiv(datum, e);
    };
    _self.prototype.nodeMouseout = function (e) {

        exit_highlight();

        this.hideTooldiv();
    };

    function tooltxt (d) {

        var i, fstr, txt, title;

        if (d.type === 'document') {
            txt = '<p>' + getFeatText(d);
            txt += '<br>' + '<a target="_blank" href="d.url">' + d.url + '</a>';
            txt += '</p>';
            
        }
        else if (d.type === 'feature') {
            fstr = [];
            txt = '<p><span class="info">Feature words:</span><br>';

            for (i=0; i<d.features.length; i++)
                fstr.push(d.features[i].word);
            
            txt += '<span class="featword">' + fstr.join(', ') + '</span>';
            txt += '</p>';
            
        } else
            throw(d.type);
        

        return txt;
    };
    
    _self.prototype.showTooldiv = function (d, event) {

        var txt = tooltxt(d);
        
        tooldiv
            .transition()
            .duration(200)
            .style("opacity", 1);
        tooldiv
            .html(txt)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");

        // tooldiv.node().parentNode.insertBefore(tooldiv.node(), svg.node());
    };
        
    _self.prototype.hideTooldiv = function (event) {

        
        // tooldiv.node().parentNode.insertBefore(svg.node(), tooldiv.node());
        
        tooldiv
            .transition()
            .duration(500)
            .style("opacity", 0)
            .style('z-index', 0);
        
        tooldiv.html('');
        
    };
    
    return _self;
})();
