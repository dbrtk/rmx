

var rmxutils, makeSubArray;


rmxutils = (function () {
    "use strict";
    function utils () {
	var me = this;
    };
    utils.prototype.addCls = function (element, clsname) {
	var classes = element.getAttribute("class"),
	    clslist = classes.split(" ");
	if (clslist.indexOf(clsname) < 0)
	    clslist.push(clsname);
	element.setAttribute("class", clslist.join(" "));
    };
    
    utils.prototype.removeCls = function (element, clsname) {
	var classes = element.getAttribute("class"),
	    clslist = classes.split(" "),
	    idx;
	
	while (clslist.indexOf(clsname) >= 0) {
	    idx = clslist.indexOf(clsname);
	    clslist.splice(idx, 1);
	}
	element.setAttribute("class", clslist.join(" "));
    };

    utils.prototype.hasCls = function (element, clsname) {
	
	var classes = element.getAttribute("class"),
	    clslist = classes.split(" ");
	return (clslist.indexOf(clsname) >= 0);
    };

    utils.xhr = function (href, callback) {
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                callback(xhttp.responseText);
                // // Typical action to be performed when the document is ready:
                // document.getElementById("demo").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", href, true);
        xhttp.send();
    };

    
    utils.prototype.getParentByClass = function (element, cls) {
	/*
	 walks up the dom tree for parent node with class name
	 */
	var parent, itemcls, clslist;
	function walkup (item) {
	    if (item && item.nodeType === Node.ELEMENT_NODE && item.hasAttribute('class')) {
		itemcls = item.getAttribute("class");
		clslist = itemcls.split(" ");
		if (clslist.indexOf(cls)>=0) {
		    parent = item;
		    return false;
		}
	    } 
	    walkup(item.parentNode);
	    return true;
	}
	
	walkup(element);
	return parent || false;
    };
    
    utils.prototype.getChildByClass = function (element, cls) {
	/* 
	 walks down the dome tree in search of a child node with the class name 
	 provided in the cls parameter. it looks for the first child element.
	 */
	var child;
	function walkDown (items) {
	    var _i, 
		_len,
		_item, 
		itemcls, 
		clslist;
	    for (_i=0, _len=items.length; _i<_len; _i++) {
		_item = items[_i];
		if (_item && _item.nodeType === Node.ELEMENT_NODE) {
		    if (_item.hasAttribute("class")) {
			itemcls = _item.getAttribute("class"),
			clslist = itemcls.split(" ");
			if (clslist.indexOf(cls)>=0) {
			    child = _item;
			    return false;
			}
		    }
		    if (_item.childNodes)
			walkDown(_item.childNodes);
		}
		continue;
	    }
	};
	walkDown([element]);
	return child || false;
    }; 
    utils.prototype.mergeNodeLists = function () {
	/*
	 merging instances of several NodeList(s) into one Array
	 */
	var slice = Array.prototype.slice,
	    _i, _list, outlist = [];
	for (_i=0; _i<arguments.length; _i++) {
	    _list = arguments[_i];
	    if (_list instanceof NodeList) { 
		outlist = outlist.concat(slice.call(_list));
	    }
	    else 
		throw "Expecting instances of NodeList.";
	}
	return outlist;
    };
    utils.prototype.setAttributes = function(element, attrs) {
	/*
	 setting multiple attributes on an element
	 */
	var key;
	if (! attrs instanceof Object)
	    throw('The second parameter (attrs) ened to be the instance of an Object.');
	for (key in attrs) {
	    if (attrs.hasOwnProperty(key))
		element.setAttribute(key, attrs[key]);
	}
    };
    utils.prototype.extend = function (childClass, parentClass) {
        /*
          Implementign simple extension mechanism. An object can inherrit a parent object and all
          of its methods.
        */
        childClass.prototype = new parentClass();
	childClass.prototype.constructor = childClass;
    };

    utils.prototype.objToUrlParams = function (obj) {

        var key, str = "";
        
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
            if (str != "") {
                str += "&";
            }
                str += key + "=" + encodeURIComponent(obj[key]);
            }
        }
        return str;        
    };

    utils.getUrlparam = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    
    return utils;
})();


makeSubArray = (function() {
    /*
     Method for subclassing Array objects. Source: 
     http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
     
     */
    var MAX_SIGNED_INT_VALUE = Math.pow(2, 32) - 1,
	hasOwnProperty = Object.prototype.hasOwnProperty;

    function ToUint32(value) {
	return value >>> 0;
    }

    function getMaxIndexProperty(object) {
	var maxIndex = -1, isValidProperty;

	for (var prop in object) {

	    isValidProperty = (
		String(ToUint32(prop)) === prop &&
		    ToUint32(prop) !== MAX_SIGNED_INT_VALUE &&
		    hasOwnProperty.call(object, prop));

	    if (isValidProperty && prop > maxIndex) {
		maxIndex = prop;
	    }
	}
	return maxIndex;
    }

    return function(methods) {
	var length = 0;
	methods = methods || { };

	methods.length = {
	    get: function() {
		var maxIndexProperty = +getMaxIndexProperty(this);
		return Math.max(length, maxIndexProperty + 1);
	    },
	    set: function(value) {
		var constrainedValue = ToUint32(value);
		if (constrainedValue !== +value) {
		    throw new RangeError();
		}
		for (var i = constrainedValue, len = this.length; i < len; i++) {
		    delete this[i];
		}
		length = constrainedValue;
	    }
	};
	methods.toString = {
	    value: Array.prototype.join
	};
	return Object.create(Array.prototype, methods);
    };
})();




