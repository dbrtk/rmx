

var CorpusConrtroller = (function () {

    "use strict";


    var RequestVerbs, IntervalObjects, WSVariables, UseWebSockets, UseWorker;

    
    RequestVerbs = {

        features: 'request_features',

        kmeans: 'kmeans_clustering'
    };
    UseWebSockets = false;

    WSVariables = [];
    
    IntervalObjects = [];

    UseWorker = false;
    
    function _eventhandler (ename, controls) {

        var selector, handler;
        
        document.querySelector('body').addEventListener(ename, function (e) {
            e.stopPropagation();
            if (e.type === 'click') {
                if (e.target.localName !== 'a') {
                    e.preventDefault();
                }
            } else
                e.preventDefault();
            for (selector in controls)
                if (controls.hasOwnProperty(selector)) {
                    if (e.target.matches(selector)) {
                        controls[selector](e);
                    }
                }
        }, true);
    }
    function _ctl () {
        
	var _i, _len, _item, args = [], me = this, _view, clickevents, mouseevents, onchange;
	for (_i=0, _len = arguments.length; _i<_len; _i++) {
	    _item = arguments[_i];
	    args.push(_item);
	} 
        
	_view = args[0];
	if (_view instanceof corpus.view === false)
	    throw(
                "the controller requires a view instance, as first parameter"
            );
	else
	    me.view = _view;
	_view = null;


        // this variable holds controlled views.
        this.views = {};

        this.action_name = '';

        this.corpus_id = getDocId();
        
        // this.socket = this.wsSocket();
        
        _eventhandler('click', {
	    "body > div.features-container > div.toolbar > button[name~=features]": 
	    me.requestFeatures.bind(me),
            
	    "body > div.features-container > div.toolbar > button[name~=force-directed-graph]":
	    me.requestFeatures.bind(me),
            
            "g.node>circle": me.nodeClick.bind(me)
            
        });
        _eventhandler('mouseenter', {
            "g.node>circle": me.nodeMouseenter.bind(me)
        });
        _eventhandler('mouseout', {
            "g.node>circle": me.nodeMouseout.bind(me)
        });
        _eventhandler('change', {
            
            "form[name=features] input[name=features]": me.featsInputCh.bind(me),

            "form[name=features] select[name=existingfeat]": me.featsSelectCh.bind(me),

        });
        _eventhandler('loadfeatonstart', {
	    
	    "select[name=existingfeat]": me.changeFeatures.bind(me)
	    
	});
    	if (this.getStatus()) {
	        this.disable();
	        this.corpusready();
	    }
    };
    _ctl.prototype.getStatus = function () {

        return rmxutils.getUrlparam('status');
    };
    _ctl.prototype.corpusready = function () {
        var iid, url;
        if (UseWorker === true)
            url = window.location.origin + window.location.pathname + 'corpus-crawl-ready-light';
        else
            url = window.location.origin + window.location.pathname + 'corpus-crawl-ready';
        iid = setInterval(function () {

            d3.json(url, function (err, resp) {
                if (err)
                    clearInterval(iid);
                if (resp.ready === true) {

                    clearInterval(iid);
                    window.location = window.location.origin + window.location.pathname;
                }
            });
        }, 5000);
        
    };
    _ctl.prototype.changeFeatures = function (e) {
	/*
	  Loading the graph when the page loads and, at least one graph is compued.
	*/
        const data = getFormData(),
              dataObj = {
		  public: true,
		  words: data.words,
		  features: data.features,
		  docsperfeat: data.docs_per_feat,
		  featsperdoc: data.feats_per_doc,
		  action: RequestVerbs['features']
              };
        this.xhrFeatures(dataObj, 'force-directed-graph');
    };
    _ctl.prototype.watchFeatures = function (_features, _words, _documents) {

        var data, msg, me, iid, intervals; 

        me = this;
        
        intervals = IntervalObjects.filter(function (item) {
            if (item['action'] === RequestVerbs.features
                && item['features'] === _features)
                return item; 
        });
        if (intervals.length >= 1)
            return false;
        
        data = {
            public: false,
            words: parseInt(_words),
            features: parseInt(_features),
            documents: parseInt(_documents),
            action: RequestVerbs['features']
        };
        
        iid = setInterval(function () {
            if (UseWebSockets === true) {
                if (this.socket.readyState == WebSocket.CLOSING ||
                    this.socket.readyState == WebSocket.CLOSED) {
                    this.keepSocketAlive();   
                }
                me.socket.send(JSON.stringify(data));
            }
            else
                var url = '/corpus/' + getDocId() + '/is-ready/' + _features + '/';
                d3.json(url, function (err, data) {
                    if (err) {
                        console.log('err');
                        console.log(err, resp);
                    } else {
                        me.xhrReadyResp(data);     
                    }
                });

        }, 5000);

        IntervalObjects.push({
            id: iid,
            features: data['features'],
            action: data['action']
        });

        return 1;
    };
    _ctl.prototype.watchHttp = function (feats, callback) {
        
    };

    _ctl.prototype.keepSocketAlive = function () {

        this.socket.close();
        this.socket = null;

        this.socket = this.wsSocket();
    };
    
    function getDocId () {

        var urlParts, item, docId;
        
        urlParts = window.location.href.split('/');
        while (true) {
            item = urlParts.pop();
            if (item.trim().length == 0) continue;
            else {
                docId = item;
                break;
            }
        }
        
        return docId;
    }

    function getFormData () {

        var form, _words, _features, _docsperfeat, _featsperdoc;

        form = document.querySelector('div[class~=features-container] form');
        
        _words = parseInt(form.elements.words.value);

        if (form.elements.features.value !== '')
            _features = parseInt(form.elements.features.value);
        else if (form.elements.existingfeat.value !== '')
            _features = parseInt(form.elements.existingfeat.value);
        else
            throw('a feature number is required!');
        _docsperfeat = parseInt(form.elements.docsperfeat.value);
        _featsperdoc = parseInt(form.elements.featsperdoc.value);
        
        return {
            words: _words,
            features: _features,
            docs_per_feat: _docsperfeat,
            feats_per_doc: _featsperdoc
        };
    };    
    _ctl.prototype.getFeatDocs = function (e) {

        var dataObj = {

        };        
    };
    _ctl.prototype.getFeaturesGraph = function (e) {

    };
    _ctl.prototype.getFeaturesDefault = function (e) {
        
    };
    _ctl.prototype.requestFeatures = function (e) {

        var url,
            me = this,
            docid = getDocId(),
            data,
            force = false,
            callback,
            dataObj,
            action_name = e.target.name;


        if (IntervalObjects.length >= 1) 
            return false;

        data = getFormData();
        
        dataObj = {
            // corpusid: docId,
            public: true,
            words: data.words,
            features: data.features,
            docsperfeat: data.docs_per_feat,
            featsperdoc: data.feats_per_doc,
            action: RequestVerbs['features']
        };

        this.xhrFeatures(dataObj, action_name);
    };
    
    _ctl.prototype.xhrFeatures = function (dataObj, action_name) {

        if (this.getStatus())
            return

        var url, callback, me = this, docid = getDocId();
        this.action_name = action_name;

        me.view.hideServerMsg();

        switch (action_name) {
        case 'force-directed-graph':
            url = '/corpus/' + docid + '/force-directed-graph/';
            callback = function (resp) {
                me.loadGraph(docid, resp);
            };
            break;
        case 'features':
            url = '/corpus/' + docid + '/features-html/';
            callback = function (resp) {
                me.loadFeaturesView(docid, resp);
            };
            break;
        };
        
        url = url + '?' + this.view.utils.objToUrlParams(dataObj);        
        d3.json(url, function (err, resp) {
            if (err) {
                console.log('err');
                console.log(err, resp);
            }
            
            if (resp.success === false && resp.available === false && resp.watch === true) {
                
                me.view.showServerMsg({
                    msg: 'The server is processing your request. This may take a while...'
                });

                WSVariables.push({
                    feats:dataObj.features,
                    load: true,
                    action_name: action_name,
                    dataObj: dataObj
                });                
                me.watchFeatures(dataObj.features, dataObj.words);
                
            } else if (resp.success === false && resp.busy === true) {
                
                me.view.showServerMsg({
                    msg: 'The server is currently busy. Try to select a ' +
                        '"computed feature number" from the drop down menu above...'
                });
            } else {
                me.view.hideServerMsg();
                callback(resp);
            }
        });
    };
    _ctl.prototype.loadGraph = function (corpusId, data) {

        var graph;
        // graph = new ForceGraph(data);
        // graph = new NeoForce(data);
        // graph = new ForceDirectedGraph(data);
        graph = new SimpleGraph(data);

        this.views.graph = graph;
        
    };
    
    _ctl.prototype.loadFeaturesView = function (corpusId, data) {

        var featstag, docstag, graph;

        featstag = document.querySelector("body div.features-container > div.features-html");
        // docstag = document.querySelector("body div.features-container > div.documents-html");
        if (this.views.hasOwnProperty('graph')) {
            
            this.views.graph.delete();
            this.views.graph = null;
            delete this.views.graph;
        }
        featstag.innerHTML = '';
        featstag.innerHTML = data.features;
        
    };
    _ctl.prototype.socketOnOpen = function (e) {
        
        this.socket.send("Socket on open has been called.");
    };

    _ctl.prototype.handleWsresp = function (respObj) {


        var feats, words, docs_per_feat, cid, wsobj, item, idx, me = this;

        cid = getDocId();
        
        feats = respObj['features'];
        words = respObj['words'];
        docs_per_feat = respObj['documents'];


        wsobj = WSVariables.find(function (d) {

            // return d.feats === feats && d.words === words && d.docs_per_feat === docs_per_feat;
            return d.feats === feats && d.load === true;
            
        });
        
        if (wsobj instanceof Object) {
            
            this.xhrFeatures(wsobj.dataObj, wsobj.action_name || this.action_name);
            idx = WSVariables.indexOf(wsobj);
            WSVariables.splice(idx, 1);
        }
    };
    _ctl.prototype.xhrReadyResp = function (respObj) {
        var me = this, intervals, i, item, idx;
        if (respObj['available'] === true) {

            intervals = IntervalObjects.filter(function (item) {
                if (item['features'] === respObj['features'])
                    return item; 
            });
            for (i=0; i<intervals.length; i++) {
                item = intervals[i];
                idx = IntervalObjects.indexOf(item);

                clearInterval(item['id']);
                IntervalObjects.splice(idx, 1);                
            }
            
            me.handleWsresp(respObj);
        }
    };
    _ctl.prototype.socketOnMsg = function (e) {
        
        var respObj;
        try {
            respObj = JSON.parse(e.data);
        } catch (SyntaxError) {
            respObj = {};
        }
        this.socketResp(respObj);
    };
    _ctl.prototype.socketResp = function (respObj) {
        var intervals, i, item, idx, me = this;
        if (respObj.hasOwnProperty('action') &&
            respObj['action'] === RequestVerbs['features'] &&
            respObj['available'] === true) {
            
            intervals = IntervalObjects.filter(function (item) {
                if (item['action'] === respObj['action']
                    && item['features'] === respObj['features'])
                    return item; 
            });
            for (i=0; i<intervals.length; i++) {
                item = intervals[i];
                idx = IntervalObjects.indexOf(item);

                clearInterval(item['id']);

                IntervalObjects.splice(idx, 1);                
            }
            me.handleWsresp(respObj);
        }
    };
    _ctl.prototype.wsSocket = function (onOpenHandler, onMsgHandler) {

        var socket, me, url;
        
        if (onOpenHandler === undefined)
            onOpenHandler = this.socketOnOpen;
        if (onMsgHandler === undefined)
            onMsgHandler = this.socketOnMsg;

        me = this;
        url = "ws://" + window.location.host + '/ws' + window.location.pathname;
        
        socket = new WebSocket(url);

        socket.onmessage = onMsgHandler.bind(me);
        socket.onopen = onOpenHandler.bind(me);
        
        return socket;
    };
    _ctl.prototype.kmeansClustering = function () {

        conosle.log('kmeans cluster requested');
    };
    _ctl.prototype.nodeClick = function (e) {

        this.views.graph.nodeClick(e.target.parentElement);
    };

    
    _ctl.prototype.nodeMouseenter = function (e) {

        this.views.graph.nodeMouseenter(e);
    };
    _ctl.prototype.nodeMouseout = function (e) {
        
        this.views.graph.nodeMouseout(e);
    };
    _ctl.prototype.featsInputCh = function (e) {

        var fieldset = e.target.parentNode;
        
        fieldset.querySelector('select[name=existingfeat]').value = '';
    };
    _ctl.prototype.featsSelectCh = function (e) {

        var fieldset = e.target.parentNode; 

        fieldset.querySelector('input[name=features]').value = '';
    };
    _ctl.prototype.disable = function () {

        document.querySelectorAll('button, select, input').forEach(
            function (d) {
                d.disabled = true;
            }
        );
    };
    
    return _ctl;
})();

