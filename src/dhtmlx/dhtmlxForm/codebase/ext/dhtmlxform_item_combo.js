dhtmlXForm.prototype.items.combo = {
	
	render: function(item, data) {
		
		item._type = "combo";
		item._enabled = true;
		item._value = null;
		item._newValue = null;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "SELECT", null, true, true, "dhxlist_txt_select");
		this.doAttachEvents(item);
		this.doLoadOpts(item, data);
		
		item.childNodes[1].childNodes[0].opt_type = data.comboType||"";
		
		item._combo = new dhtmlXComboFromSelect(item.childNodes[1].childNodes[0]);
		item._combo._currentComboValue = item._combo.getSelectedValue();
		item._combo.DOMelem_input.id = data.uid;
		
		if (data.connector) item._combo.loadXML(data.connector);
		if (data.filtering) item._combo.enableFilteringMode(true);
		
		if (data.readonly == true) this.setReadonly(item, true);
		
		if (data.style) item._combo.DOMelem_input.style.cssText += data.style;
		
		return this;
	},
	
	destruct: function(item) {
		
		// unload combo
		item._combo._currentComboValue = null;
		item._combo.destructor();
		item._combo = null;
		
		// unload item
		item._apiChange = null;
		this.d2(item);
		item = null;
		
	},
	
	doOnChange: function(combo) {
		var item = combo.DOMParent.parentNode.parentNode;
		if (item._apiChange) return;
		combo._newComboValue = combo.getSelectedValue();
		if (combo._newComboValue != combo._currentComboValue) {
			if (item.checkEvent("onBeforeChange")) {
				if (item.callEvent("onBeforeChange", [item._idd, combo._currentComboValue, combo._newComboValue]) !== true) {
					// restore last value
					// not the best solution, should be improved
					window.setTimeout(function(){combo.setComboValue(combo._currentComboValue);},1);
					return false;
				}
			}
			combo._currentComboValue = combo._newComboValue;
			item.callEvent("onChange", [item._idd, combo._currentComboValue]);
		}
		item._autoCheck();
	},
	
	enable: function(item) {
		if (String(item.className).search("disabled") >= 0) item.className = String(item.className).replace(/disabled/gi,"");
		item._enabled = true;
		item._combo.disable(false);
	},
	
	disable: function(item) {
		if (String(item.className).search("disabled") < 0) item.className += " disabled";
		item._enabled = false;
		item._combo.disable(true);
	},
	
	getCombo: function(item) {
		return item._combo;
	},
	
	setValue: function(item, val) {
		item._apiChange = true;
		item._combo.setComboValue(val);
		item._combo._currentComboValue = item._combo.getSelectedValue();
		item._apiChange = false;
	},
	
	getValue: function(item) {
		return item._combo.getSelectedValue();
	},
	
	setWidth: function(item, width) {
		item.childNodes[1].childNodes[0].style.width = width+"px";
	},
	
	setReadonly: function(item, state) {
		if (!item._combo) return;
		item._combo_ro = state;
		item._combo.readonly(item._combo_ro);
	},

	isReadonly: function(item, state) {
		return item._combo_ro||false;
	}
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doAttachEvents:1,doLoadOpts:1,doUnloadNestedLists:1,setText:1,getText:1})
		dhtmlXForm.prototype.items.combo[a] = dhtmlXForm.prototype.items.select[a];
})();

dhtmlXForm.prototype.items.combo.d2 = dhtmlXForm.prototype.items.select.destruct;

dhtmlXForm.prototype.getCombo = function(name) {
	return this.doWithItem(name, "getCombo");
};

