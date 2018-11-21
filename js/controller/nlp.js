

nlp.controller = (function () {

    "use strict";

    function control (controls, scope) {
	/*
	 Setting up the controls and assigning event listeners to selectors.
	 This is a method that should be inherrited by all controllers. 
	 */
	function addListeners (selector, events) {
	    for (var e in events) {
		if (events.hasOwnProperty(e)) {
		    document.querySelector(selector).addEventListener(
			e, events[e]);
		}
	    }
	};
	for (var selector in controls) {
	    if (controls.hasOwnProperty(selector))
		addListeners(selector, controls[selector]);
	};
    };
    function _ctl () {
	/*
	 _ctl stands for controller
	 Normally a controller is instantiated with an instance of the view it controls.
	 Because there is any view instance for now, all is handled by rmx, hence that is 
	 the instance we pass to the controller.
	 */
	var _i, _len, _item, args = [], me = this, _nlpinst;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	} 
	
	_nlpinst = args[0];
	if (_nlpinst instanceof nlp === false)
	    throw("the controller requires the instance of the view it controls, as first parameter");
	else
	    me.nlpApp = _nlpinst;
	_nlpinst = null;
	// me.keypressMapper = {
	//     "div[class~=query-box] > div.query-form > input[type=text]": me.submitQueryEnter
	// };
	me.clickMapper = {}; // TODO: implement
	control({
	    "div.viz-box > div.btn-container > button[name~=dendogram]": {
		click: me.showDendogram.bind(me)
	    },
            "div.viz-box > div.btn-container > button[name~=radial-dendogram]": {
                click: me.showRadialDendogram.bind(me)
            },
            "div.viz-box > div.btn-container > button[name~=circular-tree]": {
                click: me.showCircularTree.bind(me)
            }
	});
    }
    _ctl.prototype.showDendogram = function (event) {

        this.nlpApp.viewInstances.clusters.loadDendogram();        
    };
    _ctl.prototype.showRadialDendogram = function (event) {

        var me = this, url, stratify, cluster;
        
        // url = '/static/js/data/flare.json'
        url = '/nlptests/request-dendogram/'
        
        // url = '/static/js/data/flare.csv'
        // d3.csv(url, function (error, data) {
        //     if (error) throw error;
        //     me.nlpApp.viewInstances.clusters.radialDendogram(data, 'csv');
        // })
        
        d3.json(url, function (data) {
            console.log('loading data for circular tree');
            console.log(data);
            
            me.nlpApp.viewInstances.clusters.radialDendogram(data.data, 'json');
        })
    };
    _ctl.prototype.showCircularTree = function (event) {

        var type = 'loaddata', inst;
        
        inst = new nlp.CircularTreeView(type)
        this.nlpApp.viewInstances.circulartree = inst;
    };    
    _ctl.prototype.clickTextNode = function (event) {

        console.log('clicked node');
        console.log(event);
    };

    
    return _ctl;
})()
