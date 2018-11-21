
/*
  this module should be loading the apps.
*/


var _;

_ = (function () {

    _underscore = function () {
        // instantiating
	var _i, _item, _len, args;
	args = [];
	for (_i=0, _len=arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    if (!isnull(_item))
		args.push(_item);
	}


    }



    return _underscore;
})();
