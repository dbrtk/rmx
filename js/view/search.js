/*
 Making  aclass that holds the view that displays search results.
 */

rmx.SearchView = (function () {
    'use strict';
    var Groups, ImageModel, DataModel, DataFields;

    ImageModel = {
	_id: 'string',
	url: 'string'
    };
    
    DataModel = {
	_id: 'string',
	data: 'string',
	tag: 'string',
	url: 'string'
    };
    
    DataFields = [
	{field: '_id', type: 'data-var', name: 'data-pageid'},
	// {field: 'url', type: 'content', class: ''},
	{field: 'data', type: 'content', class: 'text-box, content'},
	{field: 'tag', type: 'content', class: 'sentence-details'}
    ];
    
    Groups = {};
    
    function _search() {
	/*
	 instantiating the search view
	 */
	var _i, _len, _item, _args = [];
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    _args.push(_item);
	}
	this.dataStore = _args[0];
	this.imageStore = _args[1];

	this.view = new GenericView();
	this.loadData();
    }


    // TODO: delete and move to an another file - REDESIGN NEEDED!
    function positionbox (box, xpos, ypos) { // redundant code - relocate it to a different module
	box.style.left = xpos + "px";
	box.style.top = ypos + "px";
    } 
    function layoutbox (box) { // redundant code - relocate it to a different module
	/*
	 posiitoning the boxrelatively to other boxes
	 */
	var id, xpos, ypos, _height;
	id = box.getAttribute("data-id");
	
	xpos = Groups[id].lastx;
	ypos = Groups[id].lasty;
	_height = box.offsetHeight;
	positionbox(box, xpos, ypos);
	Groups[id]["lasty"] = ypos + _height + 20;	
    }

    _search.prototype.load = function(store) {
	/*
	 reloading a data store
	 */
	if (store === 'data') 
	    this.dataStore.load();
	if (store === 'images')
	    this.imageStore.load();
    };
    _search.prototype.loadData = function() {
	/*
	 loading the data from the stores. 
	 */	
	var container, box, me, node;
	this.clearContainer();
	me = this;
	node = new TextNode();
	container = getContainer();
	this.dataStore.data.foreach(function(doc, idx) {
	    node.feed(doc);
	    if (doc.tag === 'img') 
		box = node.searchBox(me.imageStore.findOne('_id', doc.data));
	    else
		box = node.searchBox();
	    container.appendChild(box);	    
	});
    };
    function getContainer () {
	/*
	 retrieve the container
	 */
	return document.querySelector('body>div[class~=search-results][class~=container]');
    }
    _search.prototype.clearContainer = function() {
	/*
	 remove all from container
	 */
	getContainer().innerHTML = '';	
    };
    return _search;
})();


