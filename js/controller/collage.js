/*
 controller for the collage view
 */
var RmxCollageCtl = (function () {
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
			e, events[e], false);
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
	var _i, _len, _item, args = [], me = this, _view;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	}
	_view = args[0];
	me.viewInstance = _view;
	_view = null;
	
	this.displayingText = false;
	
	control({
	    "div[class~=data-container]>div[class~=data-box][data-id]": {
		getdata: function (e) { me.getData(e); }
	    },
	    "div[class~=data-box][class~=header] button[name=show-text]": {
		click: function (e) { me.showText(e); }
	    },
	    "div[class~=data-box][class~=header] button[name=filter-text]": {
		click: function (e) { me.filterText(e); }
	    },
	    "div.data-box[class~=header] select[class~=dataclouds]": {
		change: function (e) { me.selectDataCloud(e); }
	    }
	}); 
 
    }
    _ctl.prototype.getData = function (event) {
	/*
	 Loading data from the server and displaying these in boxes.
	 */
	// todo(): finish implementing
	event.preventDefault();
	event.stopPropagation();
	var _box = event.target, 
	    _id = _box.getAttribute("data-id");	
	return _id;
    };
    _ctl.prototype.showText = function (event) {
	var btn = event.target, 
	    status = btn.getAttribute("data-status");
	if (status === "1") {
	    btn.innerHTML = "show text";
	    this.viewInstance.hideTextAll();
	    btn.setAttribute("data-status", "0");
	} 
	if (status === "0") {
	    btn.innerHTML = "hide text";
	    this.viewInstance.showTextAll();
	    btn.setAttribute("data-status", "1");
	}
	this.displayingText = !this.displayingText;	
    };
    _ctl.prototype.filterText = function (e) {
	var me = this,
	    btn = e.target;
	if (this.displayingText === true) {
	    this.viewInstance.filterText();
	}
    };
    _ctl.prototype.selectDataCloud = function (e) {
	/*
	 */
	var i, len, ids, me = this, 
	    select = e.target,
	    val = select.value,
	    url;

	ids = me.viewInstance.getids();
	if (ids.length != 2) {
	    alert("You need a collage with at least 2 urls to see the intersection or the difference.");
	} else {
	    url = val === "intersection" ? "/datacloud/intersection" : 
		val === "difference" ? "/datacloud/difference" : null;
	    url += "?" + $.param({docids: ids}, true);
	    if (select.value === "intersection") {
	    	window.location.replace(url);
	    } else {
	    	alert("Only the intersect funtion works.");
	    }
	}
    };
    
    return _ctl;
})();
