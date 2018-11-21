/*
 view for the collage page
*/

(function () {
    /*
     this is the app for the collage view. it instantiates the view, its controller and the stores.
     */
    "use strict";
    var _i, _len, _item, args = [], _viewModule, __ctl__, view;
    for (_i=0, _len = arguments.length; _i<_len; _i++) {
	_item = arguments[_i];
	args.push(_item);
    }
    _viewModule = args[0];
    
    window.onload = function () {
	
	Array.prototype.foreach = CollageData.foreach;
	
	view = new _viewModule();
	_viewModule = null;
	__ctl__ = new RmxCollageCtl(view);
	view.init();
    };

})(
(function () {
    "use strict";
    var me = this, TextTags, DataBoxes, DataIds = [], Groups;
    
    Groups = {}; 
    TextTags = ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'span', 'caption'];   

    function getDataBoxes () {
	// getting the divs with 
	return document.querySelectorAll(
	    "div[class~=data-container] div[class~=data-info-box][data-id]");
    }
    
    function callGetData (databox) {
	/*
	 using a custom event to get the data
	 */
	var event;
	if (Event) {
	    event = new Event("getdata");	    
	} else {
	    event = document.createEvent("Event");
	    event.initEvent("getdata");
	}
	databox.dispatchEvent(event);
    }
    function updateInfoBox (box, url) {
	var htag, atag;
	atag = document.createElement('a');
	htag = document.createElement('h1');
	atag.setAttribute('href', url);
	atag.innerHTML = url;
	
	htag.appendChild(atag);
	box.appendChild(htag);
	
    }
    function _loadData(box, instance) {
	/*
	 loading the data with ajax
	 */
	// todo(): move to the store
	var store, resp, doc, images, _id = box.getAttribute("data-id");
	function _success (resp) {
	    doc = resp.root ;
	    Groups[_id].url = doc.url;
	    updateInfoBox(box, doc.url);
	    instance.loadImages(doc.imageurls, box);
	    Groups[_id]["data"] = new CollageData(doc);
	}
	$.ajax({
	    type: "GET",
	    url: "/data/",
	    success: _success,
	    data: {docid: _id}
	});
    }
    function positionbox (box, xpos, ypos) { 
	box.style.left = xpos + "px";
	box.style.top = ypos + "px";
    } 
    function layoutbox (box) {
	/*
	 posiitoning the boxrelatively to other boxes
	 */
	var id, xpos, ypos, _height;
	id = box.getAttribute("data-id");
	xpos = Groups[id].lastx;
	ypos = Groups[id].lasty;
	_height = box.offsetHeight;	
	positionbox(box, xpos, ypos);
	Groups[id]["lasty"] = ypos + _height + 20;	
    }
    function _collage () {
	/*
	 loading the boxes, styling these and maing the layout
	 this method should never be called from within the object
	 */
	this.view = new GenericView();
	DataBoxes = getDataBoxes();
	if (DataBoxes.length > 2)
	    throw("Only 2 urls can be manipulated in the collage");
	
    };
    _collage.prototype.init = function () {
	/*
	 Initializing the page; loading data, displaying the elements, etc....	 
	 */
	var _box, _id, _i, _len, me = this, xpos, ypos;
	
	xpos = 50;
	ypos = 100;
	for (_i=0, _len=DataBoxes.length; _i<_len; _i++) {
	    // callGetData(dataBoxes[_i]);
	    _box = DataBoxes[_i];
	    _id = _box.getAttribute("data-id");
	    DataIds.push(_id);
	    _loadData(_box, me);
	    
	    Groups[_id] = {
		xpos: xpos,
		ypos: ypos,
		lastx: xpos,
		lasty: ypos + 150
	    };
	    xpos += 550;
	    positionbox(_box, Groups[_id].xpos, Groups[_id].ypos);
	}	
    };
    _collage.prototype.loadImages = function (imageurls, box) {
	/*
	 load images to the page - temporary method
	 */
	var _i, _len, _item, img, div, me = this, template, container, _id;
	_id = box.getAttribute("data-id");
	container = document.querySelector("div[class~=data-box][class~=images]");
	
	for (_i=0, _len=imageurls.length; _i<_len; _i++) {
	    _item = imageurls[_i];
	    div = document.createElement("div");
	    
	    div.setAttribute("data-id", _id);
	    div.setAttribute("class", "img-box");
	    
	    img = document.createElement("img");
	    img.setAttribute("src", _item);
	    
	    // todo() review
	    img.addEventListener("load", me.loadimg);
	    
	    div.appendChild(img);
	    container.appendChild(div);
	}
    };
    _collage.prototype.loadimg = function (e) {
	/* 
	 called when the content of the image is loaded 
	 */
	var _height, img, box, id, xpos, ypos;
	img = e.target;
	img.removeEventListener("load", this.loadimg);
	box = img.parentNode;
	// positioning the box - the simple way
	layoutbox(box);
    };
    _collage.prototype.layoutImages = function(_id) {
	/*
	 this is the default layout 
	 can be kept for othe layouts - circle...
	 */
	var _i, _len, _item, _height, groups, imgItems, xpos, ypos;

	xpos = Groups[_id].xpos;
	ypos = Groups[_id].ypos + 100;

	imgItems = document.querySelectorAll("div[class~=img-box][data-id='" + _id + "']");
    };
    
    _collage.prototype.showTextAll = function (_id) {
	var me=this, i, len, item;
	for (i=0, len=DataIds.length; i<len; i++) 
	    me.showText(DataIds[i]);
    };
    _collage.prototype.hideTextAll = function () {
	var i, len, item, container, boxes; 
	container = document.querySelector("div[class~=data-box][class~=txt]");
	boxes = document.querySelectorAll(
	    "div[class~=data-box][class~=txt] div.txt[class~=display-box]");
	for (i=0, len=boxes.length; i<len; i++) 
	    container.removeChild(boxes[i]);
    };
    function resetLasts (_id, x, y) {
	Groups[_id].lasty = y;
	Groups[_id].lastx = x;
	
    }
    _collage.prototype.showText = function (_id) {
	/*
	 laying out text
	 */
	var dataStore = Groups[_id].data,
	    me = this,
	    box, container,
	    textnode = new TextNode(_id);
	resetLasts(_id, Groups[_id].lastx += 25, 300);
	
	container = document.querySelector("div[class~=data-box][class~=txt]");
	
	dataStore.data.foreach(function (item, idx) {
	    textnode.feed(item);
	    box = textnode.contentBox();
	    container.appendChild(box);	    
	    layoutbox(box);
	});	
    };
    _collage.prototype.filterText = function () {
	var tag, boxes, _id, i, len, item, container, goodboxes;
	container = document.querySelector("div[class~=data-box][class~=txt]");
	
	function getboxes () {
	    return document.querySelectorAll("div.txt[class~=display-box]");
	}
	boxes = getboxes();
	goodboxes = [];
	for (i=0, len=DataIds.length; i<len; i++) {
	    _id = DataIds[i];
	    resetLasts(_id, Groups[_id].lastx, 300);
	}
	for (i=0, len=boxes.length; i<len; i++) {
	    item = boxes[i];
	    tag = item.getAttribute("data-tag");
	    if (TextTags.indexOf(tag)  === -1)
		container.removeChild(item);
	    else
		goodboxes.push(item);
	} 
	goodboxes.foreach(function (item) { 
	    layoutbox(item); 
	});
	
    };
    _collage.prototype.getids = function () {
	/*
	 getting the data ids.
	 */
	return DataIds;
    };
    return _collage;
})()

);






