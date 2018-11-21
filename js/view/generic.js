

var GenericView = (function () {
    /*
     holds methods rendering and manipulating html components
     */
    "use strict";

    function _view () {
	
	
    } 
    
    _view.prototype.showBox = function (box, query, visible) {
	
	if ($rmx.utils.hasCls(box, "box-is-hidden")) 
	    $rmx.utils.removeCls(box, "box-is-hidden");
	$rmx.utils.addCls(box, "box-is-visible");
	
    };
    _view.prototype.hideBox = function (box, query, visible) {
	
	if ($rmx.utils.hasCls(box, "box-is-visible"))
	    $rmx.utils.removeCls(box, "box-is-visible");
	$rmx.utils.addCls(box, "box-is-hidden");
	
    };

    _view.box = function (className, contentNode, extraParams) {
	/* 
	 making the box as a div element 
	 this is a static method
	 */
	var _i, 
	    _len, 
	    _prop, 
	    box = document.createElement("div");
	
	if (className) {
	    box.setAttribute("class", className);
	    // if (className instanceof Array) {
	    //     for (var i=0; i<className.length; i++)
	    // 	box.classList.add(className[i]);
	    // }
	    // else 
	    //     box.classList.add(className);
	}
	if (contentNode) {
	    if (contentNode instanceof Array) {
		for (_i=0, _len = contentNode.length; _i<_len; _i++) {
		    box.appendChild(contentNode[_i]);
		}
	    } else box.appendChild(contentNode);
	}
	if (extraParams && extraParams instanceof Object === true) {
	    for (_prop in extraParams) {
		if (extraParams.hasOwnProperty(_prop)) 
		    box.setAttribute(_prop, extraParams[_prop]);
	    }
	}
	return box;
	
    };
    _view.span = function (cls, contentNode, title) {
	/*
	 rendering a default span with textnode as content and eventually a 
	 title attribute. this is a static method
	 */
	var span = document.createElement("span");
	span.appendChild(contentNode);
	span.setAttribute("class", cls);
	if (title)
	    span.setAttribute("title", title);
	return span;
    };
    _view.textnode = function (_t) {
	return document.createTextNode(_t);
    };
    _view.anode = function (_a, _href) {
	/*
	 building up a link node
	 */
	var node = document.createElement('a');
	node.appendChild(this.textnode(_a));
	$rmx.utils.setAttributes(node, {href: _href ? _href : _a, 
					target: '_blank'});
	return node;
    };
    _view.imgnode = function(cls, src, title, attrs) {
	/*
	 creating an img tag
	 */
	var img = document.createElement('img');
	img.setAttribute('src', src);	
	if (title)
	    img.setAttribute("title", title);
	if (attrs) {
	    
	}
	return img;	
    };
    
    return _view;

})();


