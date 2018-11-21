/*
  NLP APPLICATION.
 */

var Nlp, $nlp, nlp;

nlp = (function () {
    /*
      This is the nlp app. It handles views, controllers, stores.       
     */
    "use strict";

    function _nlp() {	
	var _i, _len, _item, args = [], me = this, __ctl__;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	}
        
	this.view = {
            'circulartree': nlp.CircularTreeView,
	    'clusters': nlp.ClustersView
	};
	this.viewInstances = {
            clusters: new this.view.clusters()
	};
	/*
	  __ctl__ is a very private variable - it should never be accessible from
	  the scope of this object (nlp)
	*/
	__ctl__ = new nlp.controller(this);
	
	this.utils = new rmxutils();

	// this.controller = {
	//     controller: BaseController,
	//     data: DataController
	// };

	/*
	 Making the instance of the nlp app available globally.
	 */
	$nlp = this;
    };

    
    return _nlp;
})();



(function () {
    /*
     RMX APP LOADER-------------------------
     */
    var nlpinstance;
    function loadapp() {
	/*
	 loading the scripts and starting up the application. require takes care of loading the scripts and after this 
	 is done it starts the rmx app. 
	 */
	var staticPath = '/static/js/';
	require.config({
	    // todo(): this line needs to be removed when deployed
	    urlArgs: "bust=" +  (new Date()).getTime(),

	    baseUrl: '/static/js/'
            
            // paths: {
            //     // $: 'libs/jquery.js',
            //     d3: 'libs/d3.v4.min',

                
            // },
            // shim: {
            //     'd3': {
            //         exports: 'd3'
            //     }
            // }
	});
	requirejs([

	    staticPath + 'libs/jquery.js',
            // staticPath + 'libs/d3.v4.min.js',

	    // staticPath + '_.js',
	    // staticPath + 'controller/_.js',

	    staticPath + 'controller/nlp.js',

            staticPath + 'utils.js',
            
            staticPath + 'view/clusters.js'
	], function () {

	    nlpinstance = new nlp();
	    console.log($nlp)
	});

        requirejs(['d3'], function (d3) {

            console.log(d3.version);
            d3.select("body").append("h1").text("Successfully loaded D3 version " + d3.version);
            console.log('d3 loaded', d3);
        });
        
    }
    
    window.onload = function () {
        
        nlpinstance = new nlp()
        // loadapp does not work...
	// loadapp();
    };
})();



