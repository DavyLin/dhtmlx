dhtmlXForm.prototype.items.colorpicker = {
	
	// events not added to body yet
	ev: false,
	
	// last clicked input id to prevent automatical hiding
	inp: null,
	
	// colorpicker instances
	colorpicker: {},
	
	// colorpicker containers
	cz: {},
	
	render: function(item, data) {
		
		var t = this;
		
		item._type = "colorpicker";
		item._enabled = true;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "TEXT", true, true, "dhxlist_txt_textarea");
		
		item._value = (data.value||"");
		item.childNodes[1].childNodes[0].value = item._value;
		
		this.cz[item._idd] = document.createElement("DIV");
		this.cz[item._idd].style.position = "absolute";
		this.cz[item._idd].style.top = "0px";
		this.cz[item._idd].style.zIndex = 249;
		document.body.insertBefore(this.cz[item._idd], document.body.firstChild);
		
		this.colorpicker[item._idd] = new dhtmlXColorPicker(this.cz[item._idd], null, null, true);
		this.colorpicker[item._idd].setImagePath(data.imagePath||"");
		this.colorpicker[item._idd].init();
		
		// block singleclick event
		this.colorpicker[item._idd].elements.cs_Content.onclick = function(e){(e||event).cancelBubble=true;}
		
		// select handler
		this.colorpicker[item._idd].setOnSelectHandler(function(color){
			if (item._value != color) {
				// call some events
				if (item.checkEvent("onBeforeChange")) {
					if (item.callEvent("onBeforeChange",[item._idd, item._value, color]) !== true) {
						// do not allow set new date
						//this.hide();
						return;
					}
				}
				// accepted
				item._value = color;
				t.setValue(item, color);
				item.callEvent("onChange", [item._idd, item._value]);
			}
		});
	
		
		item.childNodes[1].childNodes[0]._idd = item._idd;
		item.childNodes[1].childNodes[0].onclick = function(){
			if (t.colorpicker[this._idd].isVisible()) {
				t.colorpicker[this._idd].hide();
				t.inp = null;
			} else {
				t.colorpicker[this._idd].setPosition(getAbsoluteLeft(this), getAbsoluteTop(this)+this.offsetHeight-1);
				t.colorpicker[this._idd].setColor(item._value);
				t.colorpicker[this._idd].show();
				t.inp = this._idd;
			}
		}
		
		if (!this.ev) {
			if (_isIE) document.body.attachEvent("onclick",this.clickEvent); else window.addEventListener("click",this.clickEvent,false);
			this.ev = true;
		}
		
		return this;
		
	},
	
	clickEvent: function() {
		dhtmlXForm.prototype.items.colorpicker.hideAllColorPickers();
	},
	
	hideAllColorPickers: function() {
		for (var a in this.colorpicker) if (a != this.inp) this.colorpicker[a].hide();
		this.inp = null;
	},
	
	getColorPicker: function(item) {
		return this.colorpicker[item._idd];
	},
	
	destruct: function(item) {
		
		// unload color picker instance
		this.colorpicker[item._idd].elements.cs_Content.onclick = null;
		this.colorpicker[item._idd].unload();
		this.colorpicker[item._idd] = null;
		try {delete this.colorpicker[item._idd];} catch(e){}
		
		this.cz[item._idd].parentNode.removeChild(this.cz[item._idd]);
		this.cz[item._idd] = null;
		try {delete this.cz[item._idd];} catch(e){}
		
		// remove body events if no more colopicker instances left
		var k = 0;
		for (var a in this.colorpicker) k++;
		if (k == 0) {
			if (_isIE) document.body.detachEvent("onclick",this.clickEvent); else window.removeEventListener("click",this.clickEvent,false);
			this.ev = false;
		}
		
		// remove custom events/objects
		item.childNodes[1].childNodes[0]._idd = null;
		
		// unload item
		this.d2(item);
		item = null;
	}
};


(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doUnloadNestedLists:1,setText:1,getText:1,enable:1,disable:1,setWidth:1,setReadonly:1,isReadonly:1,setValue:1,getValue:1,setFocus:1,getInput:1})
		dhtmlXForm.prototype.items.colorpicker[a] = dhtmlXForm.prototype.items.input[a];
})();

dhtmlXForm.prototype.items.colorpicker.d2 = dhtmlXForm.prototype.items.input.destruct;


dhtmlXForm.prototype.getColorPicker = function(name) {
	return this.doWithItem(name, "getColorPicker");
};

dhtmlXColorPicker.prototype.unload = function() {
	
	// clear dom objects
	
	this.elements.cs_SelectorVer.parentNode.removeChild(this.elements.cs_SelectorVer);
	this.elements.cs_SelectorHor.parentNode.removeChild(this.elements.cs_SelectorHor);
	this.elements.cs_SelectorVer = null;
	this.elements.cs_SelectorHor = null;
	
	this.elements.cs_SelectorDiv.ondblclick = null;
	this.elements.cs_SelectorDiv.onmousedown = null;
	this.elements.cs_SelectorDiv.z = null;
	this.elements.cs_SelectorDiv.parentNode.removeChild(this.elements.cs_SelectorDiv);
	this.elements.cs_SelectorDiv = null;
	
	this.elements.cs_LumSelectArrow.onmousedown = null;
	this.elements.cs_LumSelectArrow.z = null;
	this.elements.cs_LumSelectArrow.parentNode.removeChild(this.elements.cs_LumSelectArrow);
	this.elements.cs_LumSelectArrow = null;
	
	this.elements.cs_LumSelectLine.parentNode.removeChild(this.elements.cs_LumSelectLine);
	this.elements.cs_LumSelectLine = null;
	
	while (this.elements.cs_LumSelect.childNodes.length > 0) this.elements.cs_LumSelect.removeChild(this.elements.cs_LumSelect.childNodes[0]);
	this.elements.cs_LumSelect.ondblclick = null;
	this.elements.cs_LumSelect.onmousedown = null;
	this.elements.cs_LumSelect.z = null;
	this.elements.cs_LumSelect.parentNode.removeChild(this.elements.cs_LumSelect);
	this.elements.cs_LumSelect = null;
	
	this.elements.cs_EndColor.parentNode.removeChild(this.elements.cs_EndColor);
	this.elements.cs_EndColor = null;
	
	this.elements.cs_InputHue.onchange = null;
	this.elements.cs_InputHue.z = null;
	this.elements.cs_InputHue.parentNode.removeChild(this.elements.cs_InputHue);
	this.elements.cs_InputHue = null;
	
	this.elements.cs_InputRed.onchange = null;
	this.elements.cs_InputRed.z = null;
	this.elements.cs_InputRed.parentNode.removeChild(this.elements.cs_InputRed);
	this.elements.cs_InputRed = null;
	
	this.elements.cs_InputSat.onchange = null;
	this.elements.cs_InputSat.z = null;
	this.elements.cs_InputSat.parentNode.removeChild(this.elements.cs_InputSat);
	this.elements.cs_InputSat = null;
	
	this.elements.cs_InputGreen.onchange = null;
	this.elements.cs_InputGreen.z = null;
	this.elements.cs_InputGreen.parentNode.removeChild(this.elements.cs_InputGreen);
	this.elements.cs_InputGreen = null;
	
	this.elements.cs_Hex.onchange = null;
	this.elements.cs_Hex.z = null;
	this.elements.cs_Hex.parentNode.removeChild(this.elements.cs_Hex);
	this.elements.cs_Hex = null;
	
	this.elements.cs_InputLum.onchange = null;
	this.elements.cs_InputLum.z = null;
	this.elements.cs_InputLum.parentNode.removeChild(this.elements.cs_InputLum);
	this.elements.cs_InputLum = null;
	
	this.elements.cs_InputBlue.onchange = null;
	this.elements.cs_InputBlue.z = null;
	this.elements.cs_InputBlue.parentNode.removeChild(this.elements.cs_InputBlue);
	this.elements.cs_InputBlue = null;
	
	
	this.elements.cs_ButtonOk.onclick = null;
	this.elements.cs_ButtonOk.onmouseout = null;
	this.elements.cs_ButtonOk.onmouseover = null;
	this.elements.cs_ButtonOk.z = null;
	this.elements.cs_ButtonOk.parentNode.removeChild(this.elements.cs_ButtonOk);
	this.elements.cs_ButtonOk = null;
	
	this.elements.cs_ButtonCancel.onclick = null;
	this.elements.cs_ButtonCancel.onmouseout = null;
	this.elements.cs_ButtonCancel.onmouseover = null;
	this.elements.cs_ButtonCancel.z = null;
	this.elements.cs_ButtonCancel.parentNode.removeChild(this.elements.cs_ButtonCancel);
	this.elements.cs_ButtonCancel = null;
	
	this.elements.cs_ContentTable.parentNode.removeChild(this.elements.cs_ContentTable);
	this.elements.cs_ContentTable = null;
	
	this.elements.cs_Content.parentNode.removeChild(this.elements.cs_Content);
	this.elements.cs_Content = null;
	
	// clear other properties
	
	this.z = null;
	
	this.detachAllEvents();
	
	this.attachEvent = null;
	this.callEvent = null;
	this.checkEvent = null;
	this.eventCatcher = null;
	this.detachEvent = null;
	this.detachAllEvents = null;
	this.generate = null;
	this.resetHandlers = null;
	this.clickOk = null;
	this.clickCancel = null;
	this.saveColor = null;
	this.restoreColor = null;
	this.addCustomColor = null;
	this.restoreFromRGB = null;
	this.restoreFromHSV = null;
	this.restoreFromHEX = null;
	this.redraw = null;
	this.setCustomColors = null;
	this.setColor = null;
	this.close = null;
	this.setPosition = null;
	this.hide = null;
	this.setOnSelectHandler = null;
	this.setOnCancelHandler = null;
	this.getSelectedColor = null;
	this.linkTo = null;
	this.hideOnSelect = null;
	this.setImagePath = null;
	this.init = null;
	this.loadUserLanguage = null;
	this.setSkin = null;
	this.isVisible = null;
	this.hoverButton = null;
	this.normalButton = null;
	this.show = null;
	this.showA = null;
	this.unload = null;
	
	this._initCsIdElement = null;
	this._initEvents = null;
	this._setCrossPos = null;
	this._getScrollers = null;
	this._setLumPos = null;
	this._startMoveColor = null;
	this._mouseMoveColor = null;
	this._stopMoveColor = null;
	this._startMoveLum = null;
	this._mouseMoveLum = null;
	this._stopMoveLum = null;
	this._getOffset = null;
	this._getOffsetTop = null;
	this._getOffsetLeft = null;
	this._calculateColor = null;
	this._drawValues = null;
	this._hsv2rgb = null;
	this._rgb2hsv = null;
	this._drawLum = null;
	this._colorizeLum = null;
	this._dec2hex = null;
	this._hex2dec = null;
	this._initCustomColors = null;
	this._reinitCustomColors = null;
	this._getColorHEX = null;
	this._selectCustomColor = null;
	this._changeValueHSV = null;
	this._changeValueRGB = null;
	this._changeValueHEX = null;
	
	this.container = null;
	this.elements = null;
	this.language = null;
	this.linkToObjects = null;
	this.customColors = null;
	
};
