



_.controller = (function () {
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
    

})()




