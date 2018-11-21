/*
 Main module holding the rmx app.
 */

var Rmx, $rmx, rmx;
// todo(): restructure - think of a better architecture
rmx = (function () {
    "use strict";    
    var controller = {
	controller: null, 
	data: null, 
	collage: null
    };
    function _rmx() {	
	var _i, _len, _item, args = [], me = this, __ctl__;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	}
	this.store = rmx.store;
	/*
	 Extending Array with a custom foreach method.
	 */
	Array.prototype.foreach = this.store.foreach;
	
	this.view = {
	    search: rmx.SearchView
	};
	this.viewInstances = {
	    search: null
	};
	/*
	 __ctl__ is a very private variable - it should never be accessible from
	 the scope of this object (rmx)
	 
	 The one being played by the instance of a controller doesn't need know
	 much about its master. rmx is the babe that is being played. 
	 */
	__ctl__ = new rmxctl(this);
	
	this.utils = new rmxutils();

	// this.controller = {
	//     controller: BaseController,
	//     data: DataController
	// };

	/*
	 Making the instance of the rmx app available globally.
	 */
	$rmx = this;
    };    
    _rmx.prototype.searchLoadData = function(data, images) {
	/*
	 called after a successful text search
	 */
	this.viewInstances['search'] = new this.view.search(new this.store(data), new this.store(images));
    };
    return _rmx;
})();

(function () {
    /*
     RMX APP LOADER-------------------------
     */
    var remix;
    function loadapp() {
	/*
	 loading the scripts and starting up the application. require takes care of loading the scripts and after this 
	 is done it starts the rmx app. 
	 */
	var staticPath = '/static/';
	require.config({
	    baseUrl: '/static/'
	});
	require([
	    staticPath + 'js/libs/jquery.js',
	    staticPath + 'js/utils.js',

	    staticPath + 'js/store/store.js',
	    
	    staticPath + 'js/controller/controller.js',
	    staticPath + 'js/controller/main.js',
	    staticPath + 'js/controller/search.js',
	    
	    staticPath + 'js/view/textnode.js',
	    staticPath + 'js/view/search.js',
	    staticPath + 'js/view/generic.js'
	], function() {
	    remix = new rmx();
	    console.log($rmx)
	});
    }
    
    window.onload = function () {
	loadapp();
    };
})();



