/*
 html tag renderer. Implements a different treatment of text nodes and image nodes/ tags.
 */
// TODO implement
var htmlnode = (function() {
    'use strict';
    
    function _node() {
	var _i, _len, _item, args = [];
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	}
	this.record = null;
	
	// this.docid = args[0];
	
	
    };
    _node.prototype.feed = function (record) {	
	this.record = record;
    };
    
    
    
    return _node;
})();
