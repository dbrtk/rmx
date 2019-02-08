


var corpus, $corpus;

corpus = (function () {


    function _ () {


        this.view = {
            corpus: corpus.view
        };

        this.viewInstances = {
            corpus: new corpus.view()
        };

        $corpus = this;
    }


    return _;
})();

corpus.view = (function () {

    "use strict";

    const loadFeatEvent = new Event('loadfeatonstart');

    function prepView () {
	
	const select = document.querySelector('select[name=existingfeat]'),
	      len = select.options.length;
	var values = [];
	console.log(len, select);
	if (len > 1) {
	    for (var i=1; i<len; i++)
		values.push(select.options[i].value);
	    
	    select.value = values[Math.floor(Math.random() * values.length)];
	    document.querySelector('input[name=features]').value = '';

	    select.dispatchEvent(loadFeatEvent);
	}
    };
    
    function _corpus() {	

	var me = this, __ctl__;
        
	__ctl__ = new CorpusConrtroller(this);
	
	this.utils = new rmxutils();

	prepView();

    };
    _corpus.prototype.showServerMsg = function (data) {

        var msg = data.msg;

        d3.select('div.features-container > div.server-msg')
            .datum(data)
            .append('div')
            .attr('class', 'message-box')
            .append('span')
            .text(function (d) { return d.msg; });
    };
    _corpus.prototype.hideServerMsg = function () {

        d3.select('div.features-container > div.server-msg')
            .html('');
    };
    
    return _corpus;

})();

(function () {
    'use strict';
    /*
      Instantiating a new corpus view when the window loads.
    */
    var corpusInstance;
    function loadapp () {
        
	var staticPath = '/static/js/';

        // TODO: inspect - d3 does not work with require....  
        // require.config({
        //     paths: {
        //         d3: staticPath + 'libs/d3.v4.min.js' // "http://d3js.org/d3.v3.min"
        //     }
        // });
        // require(['d3'], function (d3) {
            
        //     console.log('Loaded d3: ', d3);
        // })
        corpusInstance = new corpus();
        
	// require([
            
	//     staticPath + 'controller/corpus.js',

        //     staticPath + 'view/forcetest.js',
            
        //     staticPath + 'view/sila.js',

        //     staticPath + 'view/neoforce.js',

        //     staticPath + 'utils.js',
            
        //     // staticPath + 'view/clusters.js'
	// ], function () {

        //     corpusInstance = new corpus();

	//     console.log($corpus);
	// });
    };
    window.onload = function () {

        loadapp();

    };
})();
