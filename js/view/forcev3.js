

var ForceDirectedGraph_v3 = (function () {


    var w = window.innerWidth;
    var h = window.innerHeight;
    
    var keyc = true,
        keys = true,
        keyt = true,
        keyr = true,
        keyx = true,
        keyd = true,
        keyl = true,
        keym = true,
        keyh = true,
        key1 = true,
        key2 = true,
        key3 = true,
        key0 = true;
    
    var focus_node = null,
        highlight_node = null;
    
    var text_center = false;
    var outline = false;
    
    var min_score = 0;
    var max_score = 1;
    
    var color = d3.scale.linear()
        .domain([min_score, (min_score+max_score)/2, max_score])
        .range(["lime", "yellow", "red"]);
    
    var highlight_color = "blue";
    var highlight_trans = 0.1;
    
    var size = d3.scale.pow().exponent(1)
        .domain([1,100])
        .range([8,24]);
    
    var force = d3.layout.force()
        .linkDistance(60)
        .charge(-300)
        .size([w,h]);    

    var default_node_color = "#ccc";
    //var default_node_color = "rgb(3,190,100)";
    var default_link_color = "#888";
    var nominal_base_node_size = 8;
    var nominal_text_size = 10;
    var max_text_size = 24;
    var nominal_stroke = 1.5;
    var max_stroke = 4.5;
    var max_base_node_size = 36;
    var min_zoom = 0.1;
    var max_zoom = 7;
    var svg = d3.select("body").append("svg");
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom]);
    var g = svg.append("g");
    svg.style("cursor","move");
    

    


    

    
    function _view (data) {
        
        
    }


    return _view;
})();
