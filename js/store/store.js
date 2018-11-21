/*
 Module holding the data store - it holds a lot of methods that are typical to Array objects.
 */
rmx.store = (function () {
    "use strict";
    var Data; 
    
    function store() {
	// getting datasets
	var _i, _item, _len, args, _doc, _data;
	args = [];

	for (_i=0, _len=arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    if (!isnull(_item))
		args.push(_item);
	}
	_data = args[0];
	if (isnull(_data))
	    throw("a data object is required");
	if (!_data instanceof Array)
	    throw("data must be instance of an Array");
	isarray(_data);
	this.data = _data;
	_data = null;
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
    store.prototype.iterdata = function (callback) {
	/*
	 iterating the data
	 */
	this.data.foreach(callback);
    }; 
    store.prototype.getFieldValue = function (idx, field) {
	/*
	 given the doc index and the field name, returns the value
	 */
	return this.data[idx][field];
    };
    store.prototype.search = function (field, searchTxt) {
	/*
	 text search implemented on the given field
	 */
	var me = this, _i, _len, _doc, docs = [];
	for (_i=0, _len=me.data.length; _i<_len; _i++) {
	    _doc = me.data[_i];
	    if (_doc[field].indexOf(searchTxt) > -1) {
		docs.push(_doc);
	    } else 
		continue;
	}
	return docs;
    };
    store.prototype.findOne = function(field, value) {
	/*
	 Given a field value pair, returns the first record that matches.
	 */
	var me = this,_i, _len, _doc, docs = [];
	if (isnull(field) || isnull(value))
	    throw('This function requires 2 parameters: a field name and the expected value.');
	for (_i=0, _len=me.data.length; _i<_len; _i++) {
	    _doc = me.data[_i];
	    if (_doc[field].indexOf(value) > -1) 
		return _doc;
	}
	return null;
    };
    store.prototype.group = function (field) {
	/*
	 given a field name, groups the store by the retrieved value
	 */
	// todo(): implement
	var i, len, cur, out, value;
	out = {};
	for (i=0, len=this.data.length; i<len; i++) {
	    cur = this.data[i];
	    value = cur[field];
	    if (out.hasOwnProperty(value))
		out[value].push(cur);
	    else 
		out[value] = [cur];
	}
	return out;
    };
    store.prototype.getUrl = function (_uid) { //todo(): delete - unused
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
    store.prototype.getWord = function (_wid) { //todo(): delete
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












