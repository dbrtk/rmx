/*
 making text nodes/boxes/divs to display textual content
 */
var TextNode = (function () {
    "use strict";
    var TextTags;

    TextTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'span', 'div', 'caption'];
    
    function _tnode () {
	var _i, _len, _item, args = [];
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	}
	this.docid = args[0];
	this.record = null;
    }
    _tnode.prototype.feed = function (record) {
	/*
	 setting up a given record as current record 
	 */
	this.record = record;
    };
    
    _tnode.prototype.nodeTag = function () {
	
	var node, txt, tag;
	
	tag = this.record.tag;
	txt = GenericView.textnode(this.record.text);

	if (TextTags.indexOf(tag) != -1) {
	    node = document.createElement(tag);
	    node.appendChild(txt);
	} else 
	    node = GenericView.span("sentence-span", txt);
	return node;
    };

    _tnode.prototype.contentBox = function () {
	/*	 
	 */
	var me = this, 
	    record = this.record, _box;
	_box = GenericView.box("txt display-box", false, {"data-id": me.docid, "data-tag": this.record.tag});
	// list comprehension, kinda-sorta.
	[
	    GenericView.box("text-box content",  
			    GenericView.span("sentence-span", GenericView.textnode(this.record.text))),
	    GenericView.box("sentence-details", GenericView.textnode("<" + this.record.tag + ">"))
	    
	].foreach(function (item) {
	    _box.appendChild(item);
	});
	return _box;
    };
    _tnode.prototype.searchBox = function (imgRec) {
	/*
	 abstract box constructor
	 */
	var me = this, 
	    record = this.record, 
	    _box,
	    isImage = this.record.tag === 'img';
	_box = GenericView.box("display-box box search", false, {"data-id": this.record._id});
	[
	    isImage ? GenericView.box(
		'text-box content', GenericView.imgnode('', imgRec.url)) : GenericView.box(
		    "text-box content", GenericView.span(
			"sentence-span", GenericView.textnode(this.record.data))),
	    GenericView.box("sentence-details", GenericView.anode(this.record.url)),
	    isImage ? null : GenericView.box("sentence-details", GenericView.textnode("<" + this.record.tag + ">"))
	].foreach(function (item) {
	    if (item !== null) 
		_box.appendChild(item);
	});
	return _box;
    };
    
    return _tnode;
})();








