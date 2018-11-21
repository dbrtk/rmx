
var DataController = (function () {
    'use strict';

    var control; 
    control = BaseController.control;

    function ctl () {
	/*
	 _ctl stands for controller
	 Normally a controller is instantiated with an instance of the view it controls.
	 Because there is any view instance for now, all is handled by rmx, so that is 
	 the instance we pass to the controller.
	 */
	var _i, _len, _item, args = [], me = this, _viewinst;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	} 

	_viewinst = args[0];
	if (_viewinst instanceof rmx === false)
	    throw("the controller requires the instance of the view it controls, as first parameter");
	else
	    me.rmxInstance = _viewinst;
	_viewinst = null;

	control({
	    "body>div.add-page-form>input[type=button][name=submit]": {
		click: function (e) { me.addPage(e); } 
	    }
	}); 
    }
    
    ctl.prototype.addPage = function (e) {
	console.log('dasd', e, this)
	var value, 
	    bttn = e.target,
	    div = $rmx.utils.getParentByClass(bttn, 'add-page-form'),
	    textfield = $rmx.getChildByClass(div, 'add-page-input');
	value = textfield.value;	
	console.log(value);
	
    };
    return ctl;
})();





