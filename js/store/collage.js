/*
 module holding data stores
*/
var CollageData = (function () {
    "use strict";

    function store() {
	// getting datasets
	var _i, _item, _len, args, _doc;
	args = [];

	for (_i=0, _len=arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    if (!isnull(_item))
		args.push(_item);
	}
	_doc = args[0];	
	if (isnull(_doc))
	    throw("a data object is required");
	if (!_doc instanceof Object)
	    throw("data must be instance of an Object");
	this.metadata = {
	    docid: _doc.docid,
	    created: new Date(_doc.created),
	    url: _doc.url,
	    wordcount: _doc.wordcount	    
	};
	isarray(_doc.data);
	this.data = _doc.data;
	_doc = null;
    }
    function isarray (_obj) {
	if (!_obj instanceof Array)
	    throw("the provided object is not an array");
	else 
	    return true;
    }
    function isnull (_v) {
	return _v === null || _v === undefined;
    }
    
    store.foreach  = function (fn, scope) {
	/*
	 Looping through Array and executing a callback function for each item. 
	 words, urls, sentences are extended with this method.
	 */
	var _i, _len, _item, me;
	me = this;
	for (_i=0, _len=me.length; _i<_len; _i++) {
	    _item = me[_i];
	    if (fn.call(scope || _item, _item, _i, me)) 
		return _i;
	}
	return true;
    };
    store.prototype.ajaxRequest = function (_url, _params, _callback) {
	// requesting the data from the server	
	// TODO stop using jquery
	$.get(_url, _params).done(_callback);
    };
    
    store.prototype.listUrls = function () {
	var _results = [];
	this.urls.foreach(function (item, idx, all) {
	    _results.push(item.url);
	});
	return _results;
    };
    
    store.prototype.iterdata = function (callback) {


	this.data.foreach(callback);
    }; 
    
    store.prototype.getUrl = function (_uid) {
	/* get the url for id */
	var me = this;
	return (function () {
	    var _i, _len, _url;
	    for (_i=0, _len=me.urls.length; _i<_len; _i++) {
		_url = me.urls[_i];
		if (_url._id === parseInt(_uid)) {
		    return _url;
		} else 
		    continue;
	    } 
	})();	
    };  
    store.prototype.getWord = function (_wid) {
	/* get word by id (_id field) */
	var me = this;
	return (function () {
	    var _i, _len, _word;
	    for (_i=0, _len=me.words.length; _i<_len; _i++) {
		_word = me.words[_i];
		if (_word._id === parseInt(_wid)) {
		    return _word;
		} else 
		    continue;
	    } 
	})();
    };
        
    return store;
})();












