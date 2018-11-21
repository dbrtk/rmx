/*
 This is the controller that is bound to the object/function  that generates 
 the view that is being displayed. 
 */
var rmxctl = (function () {
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
			e, events[e]);
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
	var _i, _len, _item, args = [], me = this, _rmxinst;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	} 
	
	_rmxinst = args[0];
	if (_rmxinst instanceof rmx === false)
	    throw("the controller requires the instance of the view it controls, as first parameter");
	else
	    me.rmxInstance = _rmxinst;
	_rmxinst = null;
	// me.keypressMapper = {
	//     "div[class~=query-box] > div.query-form > input[type=text]": me.submitQueryEnter
	// };
	me.clickMapper = {}; // TODO: implement
	control({
	    // "div[class ~= rmx-create-form] > form": {
	    // 	submit: me.submitForm
	    // }, 

	    // "div[class~=query-box] > form.query-form > input[type=submit]": {
	    // 	click: function(e) { me.submitQuery(e); }
	    // },
	    // "div[class~=query-box] > form.query-color > input[type=color]": {
	    // 	change: function(e) { me.changeColor(e); }
	    // },
	    // "div[class~=query-box] > form.query-color > input[type=submit]": {
	    // 	click: function(e) { me.submitColorQuery(e); }
	    // },
	    "div[class~=query-box] > div.query-form > input[type=button]": {
		click: me.submitQueryDiv.bind(me)
	    },
	    "div[class~=query-box] > div.query-color > input[type=button]": {
		click: me.submitColorDiv.bind(me)
	    },
	    "div[class~=query-box]": {
		keypress: me.keypressForm.bind(me)
	    }
	}); 
    };
    // _ctl.prototype.keyMapper = (function () {
    // 	var me = this;
    // 	return {
    // 	    "div[class~=query-box] > div.query-form > input[type=text]": me.submitQueryEnter
    // 	};
    // })();
    _ctl.prototype.keypressForm = function (e) {
	var me = this, 
	    element = e.target;
	if (element.matches("div[class~=query-box] > div.query-form > input[type=text]")) {
	    me.submitQueryEnter(e);
	}
	    
    };
    _ctl.prototype.submitForm = function (event) { // TODO: delete
	event.stopPropagation();
	event.preventDefault();
	var url, _item, _i, _len, _resp,
	    method, data = {},
	    form = event.target;

	url = form.getAttribute("action");
	method = form.getAttribute("method");

	for (_i=0, _len=form.elements.length; _i<_len; _i++) {
	    _item = form.elements[_i];
	    if (_item.hasAttribute("name")) 
		data[_item.name] = _item.value;
	}
	$.ajax({
	    url: url,
	    type: method,
	    data: data,
	    success: function (response) {
		_resp = JSON.parse(response);
		if (_resp.success && _resp.redirect)
		    window.location.href = _resp.redirect;
	    } 
	});	
    };
    _ctl.prototype.submitQuery__Old = function (event) { // TODO: delete
	event.stopPropagation();
	event.preventDefault();
	var resp, 
	    me = this,
	    form = event.target.form;
	$.ajax({
	    url: form.getAttribute('data-url'),
	    mehtod: form.getAttribute('method'),
	    data: {query: form.query.value, imgs: true},
	    success: function (response) {
		resp = JSON.parse(response);
		me.rmxInstance.searchLoadData(resp.root.data, resp.root.imgs);
	    }
	});
	return false;
    };
    _ctl.prototype.submitQueryDiv = function (event) {
	/**/
	var resp, button, parentDiv, urlfield, value,
	    me = this;
	button = event.target;
	parentDiv = $rmx.utils.getParentByClass(button, 'query-form');
	urlfield = $rmx.utils.getChildByClass(parentDiv, 'query-field');
	value = urlfield.value;

	if (value) 
	    me.submitQuery(parentDiv, value);
	return false;
    };
    _ctl.prototype.submitQueryEnter = function (event) {
	var me = this, urlfield, value, parentDiv;
	if (event.keyCode !== 13)
	    return false;
	urlfield = event.target;
	value = urlfield.value;
	parentDiv = $rmx.utils.getParentByClass(urlfield, 'query-form');
	if (value)
	    me.submitQuery(parentDiv, value);
	return false;
    };
    _ctl.prototype.submitQuery = function (parentDiv, value) {
	var me = this, resp;
	$.ajax({
	    url: parentDiv.getAttribute('data-url'),
	    mehtod: parentDiv.getAttribute('data-method'),
	    data: {query: value, imgs: true},
	    success: function (response) {
		resp = JSON.parse(response);
		me.rmxInstance.searchLoadData(resp.root.data, resp.root.imgs);
	    }
	});
    };
    _ctl.prototype.changeColor = function (e) { // TODO: delete
	
    };
    _ctl.prototype.submitColorQuery = function (e) { // TODO: delete
	e.stopPropagation();
	e.preventDefault();
	var me = this, 
	    resp, 
	    form = e.target.form,
	    colors = form.color,
	    value = colors.value;	
	$.ajax({
	    url: form.getAttribute('data-url'),
	    mehtod: form.getAttribute('method'),
	    data: {hexcolor: value},
	    success: function (response) {
		resp = JSON.parse(response);
		console.log(resp);
		me.rmxInstance.searchLoadData(resp.root.data, resp.root.imgs);
	    }
	});
	return false;
    };
    _ctl.prototype.submitColorDiv = function (e) {
	var me = this, 
	    resp, 
	    button = e.target, 
	    parentDiv = $rmx.utils.getParentByClass(button, 'query-color'),
	    colors = $rmx.utils.getChildByClass(parentDiv, 'color-field'),
	    value = colors.value;
	if (value) {
	    $.ajax({
		url: parentDiv.getAttribute('data-url'),
		mehtod: parentDiv.getAttribute('data-method'),
		data: {hexcolor: value},
		success: function (response) {
		    resp = JSON.parse(response);
		    console.log(resp);
		    me.rmxInstance.searchLoadData(resp.root.data, resp.root.imgs);
		}
	    });
	}
	return false;
    };
    return _ctl;
})();









