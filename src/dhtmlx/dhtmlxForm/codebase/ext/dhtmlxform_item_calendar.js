dhtmlXForm.prototype.items.calendar = {
	
	// events not added to body yet
	ev: false,
	
	// last clicked input id to prevent automatical hiding
	inp: null,
	
	// calendar instances
	calendar: {},
	
	// formats
	f: {},
	
	// formats for save-load, if set - use them for saving and loading only
	f0: {},
	
	render: function(item, data) {
		
		var t = this;
		
		item._type = "calendar";
		item._enabled = true;
		
		this.doAddLabel(item, data);
		this.doAddInput(item, data, "INPUT", "TEXT", true, true, "dhxlist_txt_textarea");
		
		this.f[item._idd] = (data.dateFormat||"%d-%m-%Y");
		this.f0[item._idd] = (data.serverDateFormat||this.f[item._idd]);
		
		item._value = (data.value ? (data.value instanceof Date ? data.value : this.strToDate(item, data.value)) : "");
		item.childNodes[1].childNodes[0].value = this.getFValue(item, item._value, this.f[item._idd]);
		
		this.calendar[item._idd] = new dhtmlXCalendarObject(item.childNodes[1].childNodes[0]);
		this.calendar[item._idd].setSkin(data.skin||"dhx_skyblue");
		this.calendar[item._idd].setDateFormat(this.f[item._idd]);
		if (!data.enableTime) this.calendar[item._idd].hideTime();
		if (!isNaN(data.weekStart)) this.calendar[item._idd].setWeekStartDay(data.weekStart);
		if (typeof(data.calendarPosition) != "undefined") this.calendar[item._idd].setPosition(data.calendarPosition);
		
		this.calendar[item._idd]._itemIdd = item._idd;
		this.calendar[item._idd].attachEvent("onBeforeChange", function(d) {
			if (item._value != d) {
				// call some events
				if (item.checkEvent("onBeforeChange")) {
					if (item.callEvent("onBeforeChange",[item._idd, item._value, d]) !== true) {
						return false;
					}
				}
				// accepted
				item._value = d;
				t.setValue(item, d);
				item.callEvent("onChange", [this._itemIdd, item._value]);
			}
			return true;
			
		});
		
		item.childNodes[1].childNodes[0]._idd = item._idd;
		
		return this;
		
	},
	
	getCalendar: function(item) {
		return this.calendar[item._idd];
	},
	
	getFValue: function(item, val, f) {
		
		if (val instanceof Date) {
			
			var z = function(t) {
				return (String(t).length==1?"0"+String(t):t);
			}
			var k = function(t) {
				switch(t) {
					case "%Y": return val.getFullYear();
					case "%m": return z(val.getMonth()+1);
					case "%n": return date.getMonth()+1;
					case "%d": return z(val.getDate());
					case "%j": return val.getDate();
					case "%y": return z(val.getYear()%100);
					case "%D": return ({0:"Su",1:"Mo",2:"Tu",3:"We",4:"Th",5:"Fr",6:"Sa"})[val.getDay()];
					case "%l": return ({0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"})[val.getDay()];
					case "%M": return ({0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"})[val.getMonth()];
					case "%F": return ({0:"January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"})[val.getMonth()];
					case "%H": return z(val.getHours());
					case "%h": return z((val.getHours()+11)%12+1);
					case "%i": return z(val.getMinutes());
					case "%s": return z(val.getSeconds());
					case "%a": return (val.getHours()>11?"pm":"am");
					case "%A": return (val.getHours()>11?"PM":"AM");
					default: return t;
				}
			}
			var t = String(f).replace(/%[a-zA-Z]/g, k);
		}
		return (t||String(val));
	},
	
	strToDate: function(item, value) {
		
		var i = {Y:0, m:0, d:0, H:0, i:0, s:0};
		
		var a = String(value).match(/[0-9]{1,}/g);
		var b = this.f0[item._idd].match(/%[a-zA-Z]/g);
		
		for (var q=0; q<b.length; q++) {
			var r = b[q].replace(/%/g,"");
			if (typeof(i[r]) != "undefined") i[r] = Number(a[q]);
		}
		
		return new Date(i.Y,i.m-1,i.d,i.H,i.i,i.s,0);
	},
	
	setValue: function(item, value) {
		item._value = (value instanceof Date ? value : this.strToDate(item, value));
		item.childNodes[1].childNodes[0].value = this.getFValue(item, item._value, this.f[item._idd]);
	},
	
	getValue: function(item, asString) {
		return (asString===true?this.getFValue(item, item._value, this.f0[item._idd]):item._value);
	},
	
	destruct: function(item) {
		
		// unload calendar instance
		this.calendar[item._idd].unload();
		this.calendar[item._idd] = null;
		try {delete this.calendar[item._idd];} catch(e){}
		
		this.f[item._idd] = null;
		try {delete this.f[item._idd];} catch(e){}
		
		this.cz[item._idd].parentNode.removeChild(this.cz[item._idd]);
		this.cz[item._idd] = null;
		try {delete this.cz[item._idd];} catch(e){}
		
		// remove body events if no more colopicker instances left
		var k = 0;
		for (var a in this.calendar) k++;
		if (k == 0) {
			if (_isIE) document.body.detachEvent("onclick",this.clickEvent); else window.removeEventListener("click",this.clickEvent,false);
			this.ev = false;
		}
		
		// remove custom events/objects
		item.childNodes[1].childNodes[0]._idd = null;
		item.childNodes[1].childNodes[0].onkeypress = null;
		
		// unload item
		this.d2(item);
		item = null;
	}
	
};

(function(){
	for (var a in {doAddLabel:1,doAddInput:1,doUnloadNestedLists:1,setText:1,getText:1,enable:1,disable:1,setWidth:1,setReadonly:1,isReadonly:1,setFocus:1,getInput:1})
		dhtmlXForm.prototype.items.calendar[a] = dhtmlXForm.prototype.items.input[a];
})();

dhtmlXForm.prototype.items.calendar.d2 = dhtmlXForm.prototype.items.input.destruct;

dhtmlXForm.prototype.getCalendar = function(name) {
	return this.doWithItem(name, "getCalendar");
};

