/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
/*
2011 July 12
*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/assert.js*/
if (!window.dhx) 
	dhx={};

//check some rule, show message as error if rule is not correct
dhx.assert = function(test, message){
	if (!test)	dhx.error(message);
};
//entry point for analitic scripts
dhx.assert_core_ready = function(){
	if (window.dhx_on_core_ready)	
		dhx_on_core_ready();
};

//code below this point need to be reconsidered

dhx.assert_enabled=function(){ return false; };

//register names of event, which can be triggered by the object
dhx.assert_event = function(obj, evs){
	if (!obj._event_check){
		obj._event_check = {};
		obj._event_check_size = {};
	}
		
	for (var a in evs){
		obj._event_check[a.toLowerCase()]=evs[a];
		var count=-1; for (var t in evs[a]) count++;
		obj._event_check_size[a.toLowerCase()]=count;
	}
};
dhx.assert_method_info=function(obj, name, descr, rules){
	var args = [];
	for (var i=0; i < rules.length; i++) {
		args.push(rules[i][0]+" : "+rules[i][1]+"\n   "+rules[i][2].describe()+(rules[i][3]?"; optional":""));
	}
	return obj.name+"."+name+"\n"+descr+"\n Arguments:\n - "+args.join("\n - ");
};
dhx.assert_method = function(obj, config){
	for (var key in config)
		dhx.assert_method_process(obj, key, config[key].descr, config[key].args, (config[key].min||99), config[key].skip);
};
dhx.assert_method_process = function (obj, name, descr, rules, min, skip){
	var old = obj[name];
	if (!skip)
		obj[name] = function(){
			if (arguments.length !=	rules.length && arguments.length < min) 
				dhx.log("warn","Incorrect count of parameters\n"+obj[name].describe()+"\n\nExpecting "+rules.length+" but have only "+arguments.length);
			else
				for (var i=0; i<rules.length; i++)
					if (!rules[i][3] && !rules[i][2](arguments[i]))
						dhx.log("warn","Incorrect method call\n"+obj[name].describe()+"\n\nActual value of "+(i+1)+" parameter: {"+(typeof arguments[i])+"} "+arguments[i]);
			
			return old.apply(this, arguments);
		};
	obj[name].describe = function(){	return dhx.assert_method_info(obj, name, descr, rules);	};
};
dhx.assert_event_call = function(obj, name, args){
	if (obj._event_check){
		if (!obj._event_check[name])
			dhx.log("warn","Not expected event call :"+name);
		else if (dhx.isNotDefined(args))
			dhx.log("warn","Event without parameters :"+name);
		else if (obj._event_check_size[name] != args.length)
			dhx.log("warn","Incorrect event call, expected "+obj._event_check_size[name]+" parameter(s), but have "+args.length +" parameter(s), for "+name+" event");
	}		
};
dhx.assert_event_attach = function(obj, name){
	if (obj._event_check && !obj._event_check[name]) 
			dhx.log("warn","Unknown event name: "+name);
};
//register names of properties, which can be used in object's configuration
dhx.assert_property = function(obj, evs){
	if (!obj._settings_check)
		obj._settings_check={};
	dhx.extend(obj._settings_check, evs);		
};
//check all options in collection, against list of allowed properties
dhx.assert_check = function(data,coll){
	if (typeof data == "object"){
		for (var key in data){
			dhx.assert_settings(key,data[key],coll);
		}
	}
};
//check if type and value of property is the same as in scheme
dhx.assert_settings = function(mode,value,coll){
	coll = coll || this._settings_check;

	//if value is not in collection of defined ones
	if (coll){
		if (!coll[mode])	//not registered property
			return dhx.log("warn","Unknown propery: "+mode);
			
		var descr = "";
		var error = "";
		var check = false;
		for (var i=0; i<coll[mode].length; i++){
			var rule = coll[mode][i];
			if (typeof rule == "string")
				continue;
			if (typeof rule == "function")
				check = check || rule(value);
			else if (typeof rule == "object" && typeof rule[1] == "function"){
				check = check || rule[1](value);
				if (check && rule[2])
					dhx["assert_check"](value, rule[2]); //temporary fix , for sources generator
			}
			if (check) break;
		}
		if (!check )
			dhx.log("warn","Invalid configuration\n"+dhx.assert_info(mode,coll)+"\nActual value: {"+(typeof value)+"} "+value);
	}
};

dhx.assert_info=function(name, set){ 
	var ruleset = set[name];
	var descr = "";
	var expected = [];
	for (var i=0; i<ruleset.length; i++){
		if (typeof ruleset[i] == "string")
			descr = ruleset[i];
		else if (ruleset[i].describe)
			expected.push(ruleset[i].describe());
		else if (ruleset[i][1] && ruleset[i][1].describe)
			expected.push(ruleset[i][1].describe());
	}
	return "Property: "+name+", "+descr+" \nExpected value: \n - "+expected.join("\n - ");
};


if (dhx.assert_enabled()){
	
	dhx.assert_rule_color=function(check){
		if (typeof check != "string") return false;
		if (check.indexOf("#")!==0) return false;
		if (check.substr(1).replace(/[0-9A-F]/gi,"")!=="") return false;
		return true;
	};
	dhx.assert_rule_color.describe = function(){
		return "{String} Value must start from # and contain hexadecimal code of color";
	};
	
	dhx.assert_rule_template=function(check){
		if (typeof check == "function") return true;
		if (typeof check == "string") return true;
		return false;
	};
	dhx.assert_rule_template.describe = function(){
		return "{Function},{String} Value must be a function which accepts data object and return text string, or a sting with optional template markers";
	};
	
	dhx.assert_rule_boolean=function(check){
		if (typeof check == "boolean") return true;
		return false;
	};
	dhx.assert_rule_boolean.describe = function(){
		return "{Boolean} true or false";
	};
	
	dhx.assert_rule_object=function(check, sub){
		if (typeof check == "object") return true;
		return false;
	};
	dhx.assert_rule_object.describe = function(){
		return "{Object} Configuration object";
	};
	
	
	dhx.assert_rule_string=function(check){
		if (typeof check == "string") return true;
		return false;
	};
	dhx.assert_rule_string.describe = function(){
		return "{String} Plain string";
	};
	
	
	dhx.assert_rule_htmlpt=function(check){
		return !!dhx.toNode(check);
	};
	dhx.assert_rule_htmlpt.describe = function(){
		return "{Object},{String} HTML node or ID of HTML Node";
	};
	
	dhx.assert_rule_notdocumented=function(check){
		return false;
	};
	dhx.assert_rule_notdocumented.describe = function(){
		return "This options wasn't documented";
	};
	
	dhx.assert_rule_key=function(obj){
		var t = function (check){
			return obj[check];
		};
		t.describe=function(){
			var opts = [];
			for(var key in obj)
				opts.push(key);
			return  "{String} can take one of next values: "+opts.join(", ");
		};
		return t;
	};
	
	dhx.assert_rule_dimension=function(check){
		if (check*1 == check && !isNaN(check) && check >= 0) return true;
		return false;
	};
	dhx.assert_rule_dimension.describe=function(){
		return "{Integer} value must be a positive number";
	};
	
	dhx.assert_rule_number=function(check){
		if (typeof check == "number") return true;
		return false;
	};
	dhx.assert_rule_number.describe=function(){
		return "{Integer} value must be a number";
	};
	
	dhx.assert_rule_function=function(check){
		if (typeof check == "function") return true;
		return false;
	};
	dhx.assert_rule_function.describe=function(){
		return "{Function} value must be a custom function";
	};
	
	dhx.assert_rule_any=function(check){
		return true;
	};
	dhx.assert_rule_any.describe=function(){
		return "Any value";
	};
	
	dhx.assert_rule_mix=function(a,b){
		var t = function(check){
			if (a(check)||b(check)) return true;
			return false;
		};
		t.describe = function(){
			return a.describe();
		};
		return t;
	};

}

/*
	Common helpers
*/
dhx.version="3.0";
dhx.codebase="./";
dhx.name = "Core";

//coding helpers
dhx.copy = function(source){
	var f = dhx.copy._function;
	f.prototype = source;
	return new f();
};
dhx.copy._function = function(){};

//copies methods and properties from source to the target
dhx.extend = function(target, source, force){
	dhx.assert(target,"Invalid mixing target");
	dhx.assert(source,"Invalid mixing source");
	if (target._dhx_proto_wait)
		target = target._dhx_proto_wait[0];
	
	//copy methods, overwrite existing ones in case of conflict
	for (var method in source)
		if (!target[method] || force)
			target[method] = source[method];
		
	//in case of defaults - preffer top one
	if (source.defaults)
		dhx.extend(target.defaults, source.defaults);
	
	//if source object has init code - call init against target
	if (source.$init)	
		source.$init.call(target);
				
	return target;	
};

//copies methods and properties from source to the target from all levels
dhx.fullCopy = function(source){
	dhx.assert(source,"Invalid mixing target");
	var target =  (source.length?[]:{});
	if(arguments.length>1){
		target = arguments[0];
		source = arguments[1];
	}
	for (var method in source){
		if(source[method] && typeof source[method] == "object"){
			target[method] = (source[method].length?[]:{});
			dhx.fullCopy(target[method],source[method]);
		}else{
			target[method] = source[method];
		}
	}

	return target;	
};


dhx.single = function(source){ 
	var instance = null;
	var t = function(config){
		if (!instance)
			instance = new source({});
			
		if (instance._reinit)
			instance._reinit.apply(instance, arguments);
		return instance;
	};
	return t;
};

dhx.protoUI = function(){
	if (dhx.debug_proto)
		dhx.log("UI registered: "+arguments[0].name);
		
	var origins = arguments;
	var selfname = origins[0].name;
	
	var t = function(data){
		if (origins){
			var params = [origins[0]];
			
			for (var i=1; i < origins.length; i++){
				params[i] = origins[i];
				
				if (params[i]._dhx_proto_wait)
					params[i] = params[i].call(dhx);

				if (params[i].prototype && params[i].prototype.name)
					dhx.ui[params[i].prototype.name] = params[i];
			}
		
			dhx.ui[selfname] = dhx.proto.apply(dhx, params);
			if (t._dhx_type_wait)	
				for (var i=0; i < t._dhx_type_wait.length; i++)
					dhx.Type(dhx.ui[selfname], t._dhx_type_wait[i]);
				
			t = origins = null;	
		}
			
		if (this != dhx)
			return new dhx.ui[selfname](data);
		else 
			return dhx.ui[selfname];
	};
	t._dhx_proto_wait = arguments;
	return dhx.ui[selfname]=t;
};

dhx.proto = function(){
	
	if (dhx.debug_proto)
		dhx.log("Proto chain:"+arguments[0].name+"["+arguments.length+"]");
		
	var origins = arguments;
	var compilation = origins[0];
	var has_constructor = !!compilation.$init;
	var construct = [];
	
	dhx.assert(compilation,"Invalid mixing target");
		
	for (var i=origins.length-1; i>0; i--) {
		dhx.assert(origins[i],"Invalid mixing source");
		if (typeof origins[i]== "function")
			origins[i]=origins[i].prototype;
		if (origins[i].$init) 
			construct.push(origins[i].$init);
		if (origins[i].defaults){ 
			var defaults = origins[i].defaults;
			if (!compilation.defaults)
				compilation.defaults = {};
			for (var def in defaults)
				if (dhx.isNotDefined(compilation.defaults[def]))
					compilation.defaults[def] = defaults[def];
		}
		if (origins[i].type && compilation.type){
			for (var def in origins[i].type)
				if (!compilation.type[def])
					compilation.type[def] = origins[i].type[def];
		}
			
		for (var key in origins[i]){
			if (!compilation[key])
				compilation[key] = origins[i][key];
		}
	}
	
	if (has_constructor)
		construct.push(compilation.$init);
	
	
	compilation.$init = function(){
		for (var i=0; i<construct.length; i++)
			construct[i].apply(this, arguments);
	};
	var result = function(config){
		this.$ready=[];
		dhx.assert(this.$init,"object without init method");
		this.$init(config);
		if (this._parseSettings)
			this._parseSettings(config, this.defaults);
		for (var i=0; i < this.$ready.length; i++)
			this.$ready[i].call(this);
	};
	result.prototype = compilation;
	
	compilation = origins = null;
	return result;
};
//creates function with specified "this" pointer
dhx.bind=function(functor, object){ 
	return function(){ return functor.apply(object,arguments); };  
};

//loads module from external js file
dhx.require=function(module){
	if (!dhx._modules[module]){
		dhx.assert(dhx.ajax,"load module is required");
		
		//load and exec the required module
		dhx.exec( dhx.ajax().sync().get(dhx.codebase+module).responseText );
		dhx._modules[module]=true;	
	}
};
dhx._modules = {};	//hash of already loaded modules

//evaluate javascript code in the global scoope
dhx.exec=function(code){
	if (window.execScript)	//special handling for IE
		window.execScript(code);
	else window.eval(code);
};

dhx.wrap = function(code, wrap){
	if (!code) return wrap;
	return function(){
		var result = code.apply(this, arguments);
		wrap.apply(this,arguments);
		return result;
	};
};

/*
	creates method in the target object which will transfer call to the source object
	if event parameter was provided , each call of method will generate onBefore and onAfter events
*/
dhx.methodPush=function(object,method,event){
	return function(){
		var res = false;
		//if (!event || this.callEvent("onBefore"+event,arguments)){ //not used anymore, probably can be removed
			res=object[method].apply(object,arguments);
		//	if (event) this.callEvent("onAfter"+event,arguments);
		//}
		return res;	//result of wrapped method
	};
};
//check === undefined
dhx.isNotDefined=function(a){
	return typeof a == "undefined";
};
//delay call to after-render time
dhx.delay=function(method, obj, params, delay){
	return window.setTimeout(function(){
		var ret = method.apply(obj,(params||[]));
		method = obj = params = null;
		return ret;
	},delay||1);
};

//common helpers

//generates unique ID (unique per window, nog GUID)
dhx.uid = function(){
	if (!this._seed) this._seed=(new Date).valueOf();	//init seed with timestemp
	this._seed++;
	return this._seed;
};
//resolve ID as html object
dhx.toNode = function(node){
	if (typeof node == "string") return document.getElementById(node);
	return node;
};
//adds extra methods for the array
dhx.toArray = function(array){ 
	return dhx.extend((array||[]),dhx.PowerArray, true);
};
//resolve function name
dhx.toFunctor=function(str){ 
	return (typeof(str)=="string") ? eval(str) : str; 
};
/*checks where an object is instance of Array*/
dhx.isArray = function(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
};

//dom helpers

//hash of attached events
dhx._events = {};
//attach event to the DOM element
dhx.event=function(node,event,handler,master){
	node = dhx.toNode(node);
	
	var id = dhx.uid();
	if (master) 
		handler=dhx.bind(handler,master);	
		
	dhx._events[id]=[node,event,handler];	//store event info, for detaching
		
	//use IE's of FF's way of event's attaching
	if (node.addEventListener)
		node.addEventListener(event, handler, false);
	else if (node.attachEvent)
		node.attachEvent("on"+event, handler);

	return id;	//return id of newly created event, can be used in eventRemove
};

//remove previously attached event
dhx.eventRemove=function(id){
	
	if (!id) return;
	dhx.assert(this._events[id],"Removing non-existing event");
		
	var ev = dhx._events[id];
	//browser specific event removing
	if (ev[0].removeEventListener)
		ev[0].removeEventListener(ev[1],ev[2],false);
	else if (ev[0].detachEvent)
		ev[0].detachEvent("on"+ev[1],ev[2]);
		
	delete this._events[id];	//delete all traces
};


//debugger helpers
//anything starting from error or log will be removed during code compression

//add message in the log
dhx.log = function(type,message,details){
	if (arguments.length == 1){
		message = type;
		type = "log";
	}
	/*jsl:ignore*/
	if (window.console && console.log){
		type=type.toLowerCase();
		if (window.console[type])
			window.console[type](message||"unknown error");
		else
			window.console.log(type +": "+message);
		if (details) 
			window.console.log(details);
	}	
	/*jsl:end*/
};
//register rendering time from call point 
dhx.log_full_time = function(name){
	dhx._start_time_log = new Date();
	dhx.log("Info","Timing start ["+name+"]");
	window.setTimeout(function(){
		var time = new Date();
		dhx.log("Info","Timing end ["+name+"]:"+(time.valueOf()-dhx._start_time_log.valueOf())/1000+"s");
	},1);
};
//register execution time from call point
dhx.log_time = function(name){
	var fname = "_start_time_log"+name;
	if (!dhx[fname]){
		dhx[fname] = new Date();
		dhx.log("Info","Timing start ["+name+"]");
	} else {
		var time = new Date();
		dhx.log("Info","Timing end ["+name+"]:"+(time.valueOf()-dhx[fname].valueOf())/1000+"s");
		dhx[fname] = null;
	}
};
//log message with type=error
dhx.error = function(message,details){
	dhx.log("error",message,details);
	if (dhx.debug !== false)
		debugger;
};
//event system
dhx.EventSystem={
	$init:function(){
		this._events = {};		//hash of event handlers, name => handler
		this._handlers = {};	//hash of event handlers, ID => handler
		this._map = {};
	},
	//temporary block event triggering
	blockEvent : function(){
		this._events._block = true;
	},
	//re-enable event triggering
	unblockEvent : function(){
		this._events._block = false;
	},
	mapEvent:function(map){
		dhx.extend(this._map, map, true);
	},
	on_setter:function(config){
		if(config){
			for(var i in config){
				if(typeof config[i] == 'function')
					this.attachEvent(i, config[i]);
			}
		}
	},
	//trigger event
	callEvent:function(type,params){
		if (this._events._block) return true;
		
		type = type.toLowerCase();
		dhx.assert_event_call(this, type, params);
		
		var event_stack =this._events[type.toLowerCase()];	//all events for provided name
		var return_value = true;

		if (dhx.debug)	//can slowdown a lot
			dhx.log("info","["+this.name+"] event:"+type,params);
		
		if (event_stack)
			for(var i=0; i<event_stack.length; i++)
				/*
					Call events one by one
					If any event return false - result of whole event will be false
					Handlers which are not returning anything - counted as positive
				*/
				if (event_stack[i].apply(this,(params||[]))===false) return_value=false;
				
		if (this._map[type] && !this._map[type].callEvent(type,params))
			return_value =	false;
			
		return return_value;
	},
	//assign handler for some named event
	attachEvent:function(type,functor,id){
		type=type.toLowerCase();
		dhx.assert_event_attach(this, type);
		
		id=id||dhx.uid(); //ID can be used for detachEvent
		functor = dhx.toFunctor(functor);	//functor can be a name of method

		var event_stack=this._events[type]||dhx.toArray();
		//save new event handler
		event_stack.push(functor);
		this._events[type]=event_stack;
		this._handlers[id]={ f:functor,t:type };
		
		return id;
	},
	//remove event handler
	detachEvent:function(id){
		if(!this._handlers[id]){
			return;
		}
		var type=this._handlers[id].t;
		var functor=this._handlers[id].f;
		
		//remove from all collections
		var event_stack=this._events[type];
		event_stack.remove(functor);
		delete this._handlers[id];
	},
	hasEvent:function(type){
		type=type.toLowerCase();
		return this._events[type]?true:false;
	}
};

dhx.extend(dhx, dhx.EventSystem);

//array helper
//can be used by dhx.toArray()
dhx.PowerArray={
	//remove element at specified position
	removeAt:function(pos,len){
		if (pos>=0) this.splice(pos,(len||1));
	},
	//find element in collection and remove it 
	remove:function(value){
		this.removeAt(this.find(value));
	},	
	//add element to collection at specific position
	insertAt:function(data,pos){
		if (!pos && pos!==0) 	//add to the end by default
			this.push(data);
		else {	
			var b = this.splice(pos,(this.length-pos));
  			this[pos] = data;
  			this.push.apply(this,b); //reconstruct array without loosing this pointer
  		}
  	},  	
  	//return index of element, -1 if it doesn't exists
  	find:function(data){ 
  		for (var i=0; i<this.length; i++) 
  			if (data==this[i]) return i; 	
  		return -1; 
  	},
  	//execute some method for each element of array
  	each:function(functor,master){
		for (var i=0; i < this.length; i++)
			functor.call((master||this),this[i]);
	},
	//create new array from source, by using results of functor 
	map:function(functor,master){
		for (var i=0; i < this.length; i++)
			this[i]=functor.call((master||this),this[i]);
		return this;
	}
};

dhx.env = {};

// dhx.env.transform 
// dhx.env.transition
(function(){
	if (navigator.userAgent.indexOf("Mobile")!=-1) 
		dhx.env.mobile = true;
	if (dhx.env.mobile || navigator.userAgent.indexOf("iPad")!=-1 || navigator.userAgent.indexOf("Android")!=-1)
		dhx.env.touch = true;
	if (navigator.userAgent.indexOf('Opera')!=-1)
		dhx.env.isOpera=true;
	else{
		//very rough detection, but it is enough for current goals
		dhx.env.isIE=!!document.all;
		dhx.env.isFF=!document.all;
		dhx.env.isWebKit=(navigator.userAgent.indexOf("KHTML")!=-1);
		dhx.env.isSafari=dhx.env.isWebKit && (navigator.userAgent.indexOf('Mac')!=-1);
	}
	if(navigator.userAgent.toLowerCase().indexOf("android")!=-1)
		dhx.env.isAndroid = true;
	dhx.env.transform = false;
	dhx.env.transition = false;
	var options = {};
	options.names = ['transform', 'transition'];
	options.transform = ['transform', 'WebkitTransform', 'MozTransform', 'oTransform', 'msTransform'];
	options.transition = ['transition', 'WebkitTransition', 'MozTransition', 'oTransition', 'msTransition'];
	
	var d = document.createElement("DIV");
	for(var i=0; i<options.names.length; i++) {
		var coll = options[options.names[i]];
		
		for (var j=0; j < coll.length; j++) {
			if(typeof d.style[coll[j]] != 'undefined'){
				dhx.env[options.names[i]] = coll[j];
				break;
			}
		}
	}
    d.style[dhx.env.transform] = "translate3d(0,0,0)";
    dhx.env.translate = (d.style[dhx.env.transform])?"translate3d":"translate";

    dhx.env.transformCSSPrefix = (function(){
        var prefix;
        if(dhx.env.isOpera)
            prefix = '-o-';
        else {
            prefix = ''; // default option
            if(dhx.env.isFF)
                prefix = '-Moz-';
            if(dhx.env.isWebKit)
               prefix = '-webkit-';
            if(dhx.env.isIE)
               prefix = '-ms-';
        }
        return prefix;
    })();
    dhx.env.transformPrefix = dhx.env.transformCSSPrefix.replace(/-/gi, "");
    dhx.env.transitionEnd = ((dhx.env.transformCSSPrefix == '-Moz-')?"transitionend":(dhx.env.transformPrefix+"TransitionEnd"));
})();


dhx.env.svg = (function(){
		return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
})();


//html helpers
dhx.html={
	create:function(name,attrs,html){
		attrs = attrs || {};
		var node = document.createElement(name);
		for (var attr_name in attrs)
			node.setAttribute(attr_name, attrs[attr_name]);
		if (attrs.style)
			node.style.cssText = attrs.style;
		if (attrs["class"])
			node.className = attrs["class"];
		if (html)
			node.innerHTML=html;
		return node;
	},
	//return node value, different logic for different html elements
	getValue:function(node){
		node = dhx.toNode(node);
		if (!node) return "";
		return dhx.isNotDefined(node.value)?node.innerHTML:node.value;
	},
	//remove html node, can process an array of nodes at once
	remove:function(node){
		if (node instanceof Array)
			for (var i=0; i < node.length; i++)
				this.remove(node[i]);
		else
			if (node && node.parentNode)
				node.parentNode.removeChild(node);
	},
	//insert new node before sibling, or at the end if sibling doesn't exist
	insertBefore: function(node,before,rescue){
		if (!node) return;
		if (before && before.parentNode)
			before.parentNode.insertBefore(node, before);
		else
			rescue.appendChild(node);
	},
	//return custom ID from html element 
	//will check all parents starting from event's target
	locate:function(e,id){
		if (e.tagName)
			var trg = e;
		else {
			e=e||event;
			var trg=e.target||e.srcElement;
		}
		
		while (trg){
			if (trg.getAttribute){	//text nodes has not getAttribute
				var test = trg.getAttribute(id);
				if (test) return test;
			}
			trg=trg.parentNode;
		}	
		return null;
	},
	//returns position of html element on the page
	offset:function(elem) {
		if (elem.getBoundingClientRect) { //HTML5 method
			var box = elem.getBoundingClientRect();
			var body = document.body;
			var docElem = document.documentElement;
			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
			var clientTop = docElem.clientTop || body.clientTop || 0;
			var clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top  = box.top +  scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;
			return { y: Math.round(top), x: Math.round(left) };
		} else { //fallback to naive approach
			var top=0, left=0;
			while(elem) {
				top = top + parseInt(elem.offsetTop,10);
				left = left + parseInt(elem.offsetLeft,10);
				elem = elem.offsetParent;
			}
			return {y: top, x: left};
		}
	},
	//returns position of event
	pos:function(ev){
		ev = ev || event;
        if(ev.pageX || ev.pageY)	//FF, KHTML
            return {x:ev.pageX, y:ev.pageY};
        //IE
        var d  =  ((dhx.env.isIE)&&(document.compatMode != "BackCompat"))?document.documentElement:document.body;
        return {
                x:ev.clientX + d.scrollLeft - d.clientLeft,
                y:ev.clientY + d.scrollTop  - d.clientTop
        };
	},
	//prevent event action
	preventEvent:function(e){
		if (e && e.preventDefault) e.preventDefault();
		return dhx.html.stopEvent(e);
	},
	//stop event bubbling
	stopEvent:function(e){
		(e||event).cancelBubble=true;
		return false;
	},
	//add css class to the node
	addCss:function(node,name){
        node.className+=" "+name;
    },
    //remove css class from the node
    removeCss:function(node,name){
        node.className=node.className.replace(RegExp(" "+name,"g"),"");
    }
};

dhx.ready = function(code){
	if (this._ready) code.call();
	else this._ready_code.push(code);
};
dhx._ready_code = [];

//autodetect codebase folder
(function(){
	var temp = document.getElementsByTagName("SCRIPT");	//current script, most probably
	dhx.assert(temp.length,"Can't locate codebase");
	if (temp.length){
		//full path to script
		temp = (temp[temp.length-1].getAttribute("src")||"").split("/");
		//get folder name
		temp.splice(temp.length-1, 1);
		dhx.codebase = temp.slice(0, temp.length).join("/")+"/";
	}
	dhx.event(window, "load", function(){
		dhx.callEvent("onReady",[]);
		dhx.delay(function(){
			dhx._ready = true;
			for (var i=0; i < dhx._ready_code.length; i++)
				dhx._ready_code[i].call();
			dhx._ready_code=[];
		});
	});
	
})();

dhx.ui={};
dhx.ui.zIndex = function(){
	return dhx.ui._zIndex++;
};
dhx.ui._zIndex = 1;

dhx.assert_core_ready();


dhx.ready(function(){
	dhx.event(document.body,"click", function(e){
		dhx.callEvent("onClick",[e||event]);
	});
});


/*DHX:Depend core/bind.js*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/config.js*/
/*
	Behavior:Settings
	
	@export
		customize
		config
*/

/*DHX:Depend core/render/template.js*/
/*
	Template - handles html templates
*/

/*DHX:Depend core/dhx.js*/

(function(){

var _cache = {};
dhx.Template = function(str){
	if (typeof str == "function") return str;
	if (_cache[str])
		return _cache[str];
		
	str=(str||"").toString();			
	if (str.indexOf("->")!=-1){
		str = str.split("->");
		switch(str[0]){
			case "html": 	//load from some container on the page
				str = dhx.html.getValue(str[1]);
				break;
			case "http": 	//load from external file
				str = new dhx.ajax().sync().get(str[1],{uid:dhx.uid()}).responseText;
				break;
			default:
				//do nothing, will use template as is
				break;
		}
	}
		
	//supported idioms
	// {obj} => value
	// {obj.attr} => named attribute or value of sub-tag in case of xml
	// {obj.attr?some:other} conditional output
	// {-obj => sub-template
	str=(str||"").toString();		
	str=str.replace(/(\r\n|\n)/g,"\\n");
	str=str.replace(/(\")/g,"\\\"");
	str=str.replace(/\{obj\.([^}?]+)\?([^:]*):([^}]*)\}/g,"\"+(obj.$1?\"$2\":\"$3\")+\"");
	str=str.replace(/\{common\.([^}\(]*)\}/g,"\"+(common.$1||'')+\"");
	str=str.replace(/\{common\.([^\}\(]*)\(\)\}/g,"\"+(common.$1?common.$1(obj,common):\"\")+\"");
	str=str.replace(/\{obj\.([^}]*)\}/g,"\"+(obj.$1||'')+\"");
	str=str.replace(/#([$a-z0-9_\[\]]+)#/gi,"\"+(obj.$1||'')+\"");
	str=str.replace(/\{obj\}/g,"\"+obj+\"");
	str=str.replace(/\{-obj/g,"{obj");
	str=str.replace(/\{-common/g,"{common");
	str="return \""+str+"\";";
	try {
		Function("obj","common",str);
	} catch(e){
		dhx.error("Invalid template:"+str);
	}
	return _cache[str]= Function("obj","common",str);
};


dhx.Template.empty=function(){	return "";	};
dhx.Template.bind =function(value){	return dhx.bind(dhx.Template(value),this); };


	/*
		adds new template-type
		obj - object to which template will be added
		data - properties of template
	*/
dhx.Type=function(obj, data){ 
	if (obj._dhx_proto_wait){
		if (!obj._dhx_type_wait)
			obj._dhx_type_wait = [];
				obj._dhx_type_wait.push(data);
		return;
	}
		
	//auto switch to prototype, if name of class was provided
	if (typeof obj == "function")
		obj = obj.prototype;
	if (!obj.types){
		obj.types = { "default" : obj.type };
		obj.type.name = "default";
	}
	
	var name = data.name;
	var type = obj.type;
	if (name)
		type = obj.types[name] = dhx.copy(obj.type);
	
	for(var key in data){
		if (key.indexOf("template")===0)
			type[key] = dhx.Template(data[key]);
		else
			type[key]=data[key];
	}

	return name;
};

})();
/*DHX:Depend core/dhx.js*/

dhx.Settings={
	$init:function(){
		/* 
			property can be accessed as this.config.some
			in same time for inner call it have sense to use _settings
			because it will be minified in final version
		*/
		this._settings = this.config= {}; 
	},
	define:function(property, value){
		if (typeof property == "object")
			return this._parseSeetingColl(property);
		return this._define(property, value);
	},
	_define:function(property,value){
		dhx.assert_settings.call(this,property,value);
		
		//method with name {prop}_setter will be used as property setter
		//setter is optional
		var setter = this[property+"_setter"];
		return this._settings[property]=setter?setter.call(this,value,property):value;
	},
	//process configuration object
	_parseSeetingColl:function(coll){
		if (coll){
			for (var a in coll)				//for each setting
				this._define(a,coll[a]);		//set value through config
		}
	},
	//helper for object initialization
	_parseSettings:function(obj,initial){
		//initial - set of default values
		var settings = {}; 
		if (initial)
			settings = dhx.extend(settings,initial);
					
		//code below will copy all properties over default one
		if (typeof obj == "object" && !obj.tagName)
			dhx.extend(settings,obj, true);	
		//call config for each setting
		this._parseSeetingColl(settings);
	},
	_mergeSettings:function(config, defaults){
		for (var key in defaults)
			switch(typeof config[key]){
				case "object": 
					config[key] = this._mergeSettings((config[key]||{}), defaults[key]);
					break;
				case "undefined":
					config[key] = defaults[key];
					break;
				default:	//do nothing
					break;
			}
		return config;
	}
};
/*DHX:Depend core/datastore.js*/
/*DHX:Depend core/load.js*/
/* 
	ajax operations 
	
	can be used for direct loading as
		dhx.ajax(ulr, callback)
	or
		dhx.ajax().item(url)
		dhx.ajax().post(url)

*/

/*DHX:Depend core/dhx.js*/

dhx.ajax = function(url,call,master){
	//if parameters was provided - made fast call
	if (arguments.length!==0){
		var http_request = new dhx.ajax();
		if (master) http_request.master=master;
		http_request.get(url,null,call);
	}
	if (!this.getXHR) return new dhx.ajax(); //allow to create new instance without direct new declaration
	
	return this;
};
dhx.ajax.prototype={
	//creates xmlHTTP object
	getXHR:function(){
		if (dhx.env.isIE)
		 return new ActiveXObject("Microsoft.xmlHTTP");
		else 
		 return new XMLHttpRequest();
	},
	/*
		send data to the server
		params - hash of properties which will be added to the url
		call - callback, can be an array of functions
	*/
	send:function(url,params,call){
		var x=this.getXHR();
		if (typeof call == "function")
		 call = [call];
		//add extra params to the url
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));// utf-8 escaping
		 	}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}
		
		x.open(this.post?"POST":"GET",url,!this._sync);
		if (this.post)
		 x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		 
		//async mode, define loading callback
		//if (!this._sync){
		 var self=this;
		 x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				dhx.log_full_time("data_loading");	//log rendering time
				if (call && self) 
					for (var i=0; i < call.length; i++)	//there can be multiple callbacks
					 if (call[i])
						call[i].call((self.master||self),x.responseText,x.responseXML,x);
				self.master=null;
				call=self=null;	//anti-leak
			}
		 };
		//}
		
		x.send(params||null);
		return x; //return XHR, which can be used in case of sync. mode
	},
	//GET request
	get:function(url,params,call){
		this.post=false;
		return this.send(url,params,call);
	},
	//POST request
	post:function(url,params,call){
		this.post=true;
		return this.send(url,params,call);
	}, 
	sync:function(){
		this._sync = true;
		return this;
	}
};


dhx.AtomDataLoader={
	$init:function(config){
		//prepare data store
		this.data = {}; 
		if (config){
			this._settings.datatype = config.datatype||"json";
			this.$ready.push(this._load_when_ready);
		}
	},
	_load_when_ready:function(){
		this._ready_for_data = true;
		
		if (this._settings.url)
			this.url_setter(this._settings.url);
		if (this._settings.data)
			this.data_setter(this._settings.data);
	},
	url_setter:function(value){
		if (!this._ready_for_data) return value;
		this.load(value, this._settings.datatype);	
		return value;
	},
	data_setter:function(value){
		if (!this._ready_for_data) return value;
		this.parse(value, this._settings.datatype);
		return true;
	},
	//loads data from external URL
	load:function(url,call){
		this.callEvent("onXLS",[]);
		if (typeof call == "string"){	//second parameter can be a loading type or callback
			this.data.driver = dhx.DataDriver[call];
			call = arguments[2];
		}
		else
			this.data.driver = dhx.DataDriver["json"];
		//load data by async ajax call
		dhx.ajax(url,[this._onLoad,call],this);
	},
	//loads data from object
	parse:function(data,type){
		this.callEvent("onXLS",[]);
		this.data.driver = dhx.DataDriver[type||"json"];
		this._onLoad(data,null);
	},
	//default after loading callback
	_onLoad:function(text,xml,loader){
		var driver = this.data.driver;
		var top = driver.getRecords(driver.toObject(text,xml))[0];
		this.data=(driver?driver.getDetails(top):text);
		this.callEvent("onXLE",[]);
	},
	_check_data_feed:function(data){
		if (!this._settings.dataFeed || this._ignore_feed || !data) return true;
		var url = this._settings.dataFeed;
		url = url+(url.indexOf("?")==-1?"?":"&")+"action=get&id="+encodeURIComponent(data.id||data);
		this.callEvent("onXLS",[]);
		dhx.ajax(url, function(text,xml){
			this._ignore_feed=true;
			this.setValues(dhx.DataDriver.json.toObject(text)[0]);
			this._ignore_feed=false;
			this.callEvent("onXLE",[]);
		}, this);
		return false;
	}
};

/*
	Abstraction layer for different data types
*/

dhx.DataDriver={};
dhx.DataDriver.json={
	//convert json string to json object if necessary
	toObject:function(data){
		if (!data) data="[]";
		if (typeof data == "string"){
			eval ("dhx.temp="+data);
			data = dhx.temp;
		}
		if (data.data){
			var t = data.data;
			t.pos = data.pos;
			t.total_count = data.total_count;
			data = t;
		}

			
		return data;
	},
	//get array of records
	getRecords:function(data){
		if (data && !dhx.isArray(data))
		 return [data];
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		return data;
	},
	//get count of data and position at which new data need to be inserted
	getInfo:function(data){
		return { 
		 _size:(data.total_count||0),
		 _from:(data.pos||0)
		};
	}
};

dhx.DataDriver.json_ext={
	//convert json string to json object if necessary
	toObject:function(data){
		if (!data) data="[]";
		if (typeof data == "string"){
			var temp;
			eval ("temp="+data);
			dhx.temp = [];
			var header  = temp.header;
			for (var i = 0; i < temp.data.length; i++) {
				var item = {};
				for (var j = 0; j < header.length; j++) {
					if (typeof(temp.data[i][j]) != "undefined")
						item[header[j]] = temp.data[i][j];
				}
				dhx.temp.push(item);
			}
			return dhx.temp;
		}
		return data;
	},
	//get array of records
	getRecords:function(data){
		if (data && !dhx.isArray(data))
		 return [data];
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		return data;
	},
	//get count of data and position at which new data need to be inserted
	getInfo:function(data){
		return {
		 _size:(data.total_count||0),
		 _from:(data.pos||0)
		};
	}
};

dhx.DataDriver.html={
	/*
		incoming data can be
		 - collection of nodes
		 - ID of parent container
		 - HTML text
	*/
	toObject:function(data){
		if (typeof data == "string"){
		 var t=null;
		 if (data.indexOf("<")==-1)	//if no tags inside - probably its an ID
			t = dhx.toNode(data);
		 if (!t){
			t=document.createElement("DIV");
			t.innerHTML = data;
		 }
		 
		 return t.getElementsByTagName(this.tag);
		}
		return data;
	},
	//get array of records
	getRecords:function(data){
		if (data.tagName)
		 return data.childNodes;
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		return dhx.DataDriver.xml.tagToObject(data);
	},
	//dyn loading is not supported by HTML data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	},
	tag: "LI"
};

dhx.DataDriver.jsarray={
	//eval jsarray string to jsarray object if necessary
	toObject:function(data){
		if (typeof data == "string"){
		 eval ("dhx.temp="+data);
		 return dhx.temp;
		}
		return data;
	},
	//get array of records
	getRecords:function(data){
		return data;
	},
	//get hash of properties for single record, in case of array they will have names as "data{index}"
	getDetails:function(data){
		var result = {};
		for (var i=0; i < data.length; i++) 
		 result["data"+i]=data[i];
		 
		return result;
	},
	//dyn loading is not supported by js-array data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	}
};

dhx.DataDriver.csv={
	//incoming data always a string
	toObject:function(data){
		return data;
	},
	//get array of records
	getRecords:function(data){
		return data.split(this.row);
	},
	//get hash of properties for single record, data named as "data{index}"
	getDetails:function(data){
		data = this.stringToArray(data);
		var result = {};
		for (var i=0; i < data.length; i++) 
		 result["data"+i]=data[i];
		 
		return result;
	},
	//dyn loading is not supported by csv data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	},
	//split string in array, takes string surrounding quotes in account
	stringToArray:function(data){
		data = data.split(this.cell);
		for (var i=0; i < data.length; i++)
		 data[i] = data[i].replace(/^[ \t\n\r]*(\"|)/g,"").replace(/(\"|)[ \t\n\r]*$/g,"");
		return data;
	},
	row:"\n",	//default row separator
	cell:","	//default cell separator
};

dhx.DataDriver.xml={
	//convert xml string to xml object if necessary
	toObject:function(text,xml){
		if (xml && (xml=this.checkResponse(text,xml)))	//checkResponse - fix incorrect content type and extra whitespaces errors
		 return xml;
		if (typeof text == "string"){
		 return this.fromString(text);
		}
		return text;
	},
	//get array of records
	getRecords:function(data){
		return this.xpath(data,this.records);
	},
	records:"/*/item",
	//get hash of properties for single record
	getDetails:function(data){
		return this.tagToObject(data,{});
	},
	//get count of data and position at which new data_loading need to be inserted
	getInfo:function(data){
		return { 
		 _size:(data.documentElement.getAttribute("total_count")||0),
		 _from:(data.documentElement.getAttribute("pos")||0)
		};
	},
	//xpath helper
	xpath:function(xml,path){
		if (window.XPathResult){	//FF, KHTML, Opera
		 var node=xml;
		 if(xml.nodeName.indexOf("document")==-1)
		 xml=xml.ownerDocument;
		 var res = [];
		 var col = xml.evaluate(path, node, null, XPathResult.ANY_TYPE, null);
		 var temp = col.iterateNext();
		 while (temp){ 
			res.push(temp);
			temp = col.iterateNext();
		}
		return res;
		}	
		else {
			var test = true;
			try {
				if (typeof(xml.selectNodes)=="undefined")
					test = false;
			} catch(e){ /*IE7 and below can't operate with xml object*/ }
			//IE
			if (test)
				return xml.selectNodes(path);
			else {
				//Google hate us, there is no interface to do XPath
				//use naive approach
				var name = path.split("/").pop();
				return xml.getElementsByTagName(name);
			}
		}
	},
	//convert xml tag to js object, all subtags and attributes are mapped to the properties of result object
	tagToObject:function(tag,z){
		z=z||{};
		var flag=false;
		
		//map attributes
		var a=tag.attributes;
		if(a && a.length){
			for (var i=0; i<a.length; i++)
		 		z[a[i].name]=a[i].value;
		 	flag = true;
	 	}
		//map subtags
		
		var b=tag.childNodes;
		var state = {};
		for (var i=0; i<b.length; i++){
			if (b[i].nodeType==1){
				var name = b[i].tagName;
				if (typeof z[name] != "undefined"){
					if (!dhx.isArray(z[name]))
						z[name]=[z[name]];
					z[name].push(this.tagToObject(b[i],{}));
				}
				else
					z[b[i].tagName]=this.tagToObject(b[i],{});	//sub-object for complex subtags
				flag=true;
			}
		}
		
		if (!flag)
			return this.nodeValue(tag);
		//each object will have its text content as "value" property
		z.value = this.nodeValue(tag);
		return z;
	},
	//get value of xml node 
	nodeValue:function(node){
		if (node.firstChild)
		 return node.firstChild.data;	//FIXME - long text nodes in FF not supported for now
		return "";
	},
	//convert XML string to XML object
	fromString:function(xmlString){
		if (window.DOMParser)		// FF, KHTML, Opera
		 return (new DOMParser()).parseFromString(xmlString,"text/xml");
		if (window.ActiveXObject){	// IE, utf-8 only 
		 var temp=new ActiveXObject("Microsoft.xmlDOM");
		 temp.loadXML(xmlString);
		 return temp;
		}
		dhx.error("Load from xml string is not supported");
	},
	//check is XML correct and try to reparse it if its invalid
	checkResponse:function(text,xml){ 
		if (xml && ( xml.firstChild && xml.firstChild.tagName != "parsererror") )
			return xml;
		//parsing as string resolves incorrect content type
		//regexp removes whitespaces before xml declaration, which is vital for FF
		var a=this.fromString(text.replace(/^[\s]+/,""));
		if (a) return a;
		
		dhx.error("xml can't be parsed",text);
	}
};


/*DHX:Depend core/dhx.js*/

/*
	Behavior:DataLoader - load data in the component
	
	@export
		load
		parse
*/
dhx.DataLoader=dhx.proto({
	$init:function(config){
		//prepare data store
		config = config || "";
		name = "DataStore";
		this.data = (config.datastore)||(new dhx.DataStore());
		this._readyHandler = this.data.attachEvent("onStoreLoad",dhx.bind(this._call_onready,this));
	},
	//loads data from external URL
	load:function(url,call){
		dhx.AtomDataLoader.load.apply(this, arguments);
		//prepare data feed for dyn. loading
		if (!this.data.feed){
			this.data.url = url;
			this.data.feed = function(from,count){
				//allow only single request at same time
				if (this._load_count)
					return this._load_count=[from,count];	//save last ignored request
				else
					this._load_count=true;
					
				this.load(url+((url.indexOf("?")==-1)?"?":"&")+"start="+from+"&count="+count,function(){
					//after loading check if we have some ignored requests
					var temp = this._load_count;
					this._load_count = false;
					if (typeof temp =="object")
						this.data.feed.apply(this, temp);	//load last ignored request
					else if (this.showItem && this.dataCount()>(from+1))
						this.showItem(this.idByIndex(from+1));
				});
			};
		}
	},
	//load next set of data rows
	loadNext:function(count, start){
		if (this.data.feed)
			this.data.feed.call(this, (start||this.dataCount()), count);
	},
	//default after loading callback
	_onLoad:function(text,xml,loader){
		this.data._parse(this.data.driver.toObject(text,xml));
		this.callEvent("onXLE",[]);
		if(this._readyHandler){
			this.data.detachEvent(this._readyHandler);
			this._readyHandler = null;
		}
	},
	scheme_setter:function(value){
		this.data.scheme(value);
	},	
	dataFeed_setter:function(value){
		this.data.attachEvent("onBeforeFilter", dhx.bind(function(text, value){
			if (this._settings.dataFeed){
				
				var filter = {};
				if (!text && !filter) return;
				if (typeof text == "function"){
					if (!value) return;
					text(value, filter);
				} else 
					filter = { text:value };

				this.clearAll();
				var url = this._settings.dataFeed;
				var urldata = [];
				for (var key in filter)
					urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));
				this.load(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"), this._settings.datatype);
				return false;
			}
		},this));
		return value;
	},
	_call_onready:function(){
		if (this._settings.ready){
			var code = dhx.toFunctor(this._settings.ready);
			if (code && code.call) code.apply(this, arguments);
		}
	}
},dhx.AtomDataLoader).prototype;


/*
	DataStore is not a behavior, it standalone object, which represents collection of data.
	Call provideAPI to map data API

	@export
		exists
		idByIndex
		indexById
		get
		set
		refresh
		dataCount
		sort
		filter
		next
		previous
		clearAll
		first
		last
*/
dhx.DataStore = function(){
	this.name = "DataStore";
	
	dhx.extend(this, dhx.EventSystem);
	
	this.setDriver("xml");	//default data source is an XML
	this.pull = {};						//hash of IDs
	this.order = dhx.toArray();		//order of IDs
};

dhx.DataStore.prototype={
	//defines type of used data driver
	//data driver is an abstraction other different data formats - xml, json, csv, etc.
	setDriver:function(type){
		dhx.assert(dhx.DataDriver[type],"incorrect DataDriver");
		this.driver = dhx.DataDriver[type];
	},
	//process incoming raw data
	_parse:function(data){
		this.callEvent("onParse", [this.driver, data]);
		if (this._filter_order)
			this.filter();
			
		//get size and position of data
		var info = this.driver.getInfo(data);
		//get array of records

		var recs = this.driver.getRecords(data);
		var from = (info._from||0)*1;
		
		if (from === 0 && this.order[0]) //update mode
			from = this.order.length;
		
		var j=0;
		for (var i=0; i<recs.length; i++){
			//get has of details for each record
			var temp = this.driver.getDetails(recs[i]);
			var id = this.id(temp); 	//generate ID for the record
			if (!this.pull[id]){		//if such ID already exists - update instead of insert
				this.order[j+from]=id;	
				j++;
			}
			this.pull[id]=temp;
			//if (this._format)	this._format(temp);
			
			if (this.extraParser)
				this.extraParser(temp);
			if (this._scheme){ 
				if (this._scheme_init)
					this._scheme_init(temp);
				else if (this._scheme_update)
					this._scheme_update(temp);
			}				
		}

		//for all not loaded data
		/*
		for (var i=0; i < info._size; i++)
			if (!this.order[i]){
				var id = dhx.uid();
				var temp = null; //{id:id, $template:"loading"};	//create fake records
				//this.pull[id]=temp;
				//this.order[i]=id;
			}*/
		if (!this.order[info._size-1])
			this.order[info._size-1] = dhx.undefined;

		this.callEvent("onStoreLoad",[this.driver, data]);
		//repaint self after data loading
		this.refresh();
	},
	//generate id for data object
	id:function(data){
		return data.id||(data.id=dhx.uid());
	},
	changeId:function(old, newid){
		dhx.assert(this.pull[old],"Can't change id, for non existing item: "+old);
		this.pull[newid] = this.pull[old];
		this.pull[newid].id = newid;
		this.order[this.order.find(old)]=newid;
		if (this._filter_order)
			this._filter_order[this._filter_order.find(old)]=newid;

		this.callEvent("onIdChange", [old, newid]);
		if (this._render_change_id)
			this._render_change_id(old, newid);
		delete this.pull[old];
	},
	//get data from hash by id
	item:function(id){
		return this.pull[id];
	},
	//assigns data by id
	update:function(id,data){
		if (this._scheme_update)
			this._scheme_update(data);
		if (this.callEvent("onBeforeUpdate", [id, data]) === false) return false;
		this.pull[id]=data;
		this.refresh(id);
	},
	//sends repainting signal
	refresh:function(id){
		if (this._skip_refresh) return; 
		
		if (id)
			this.callEvent("onStoreUpdated",[id, this.pull[id], "update"]);
		else
			this.callEvent("onStoreUpdated",[null,null,null]);
	},
	silent:function(code, master){
		this._skip_refresh = true;
		code.call(master||this);
		this._skip_refresh = false;
	},
	//converts range IDs to array of all IDs between them
	getRange:function(from,to){		
		//if some point is not defined - use first or last id
		//BEWARE - do not use empty or null ID
		if (from)
			from = this.indexById(from);
		else 
			from = this.startOffset||0;
		if (to)
			to = this.indexById(to);
		else {
			to = Math.min((this.endOffset||Infinity),(this.dataCount()-1));
			if (to<0) to = 0; //we have not data in the store
		}

		if (from>to){ //can be in case of backward shift-selection
			var a=to; to=from; from=a;
		}
				
		return this.getIndexRange(from,to);
	},
	//converts range of indexes to array of all IDs between them
	getIndexRange:function(from,to){
		to=Math.min((to||Infinity),this.dataCount()-1);
		
		var ret=dhx.toArray(); //result of method is rich-array
		for (var i=(from||0); i <= to; i++)
			ret.push(this.item(this.order[i]));
		return ret;
	},
	//returns total count of elements
	dataCount:function(){
		return this.order.length;
	},
	//returns truy if item with such ID exists
	exists:function(id){
		return !!(this.pull[id]);
	},
	//nextmethod is not visible on component level, check DataMove.move
	//moves item from source index to the target index
	move:function(sindex,tindex){
		if (sindex<0 || tindex<0){
			dhx.error("DataStore::move","Incorrect indexes");
			return;
		}
		
		var id = this.idByIndex(sindex);
		var obj = this.item(id);
		
		this.order.removeAt(sindex);	//remove at old position
		//if (sindex<tindex) tindex--;	//correct shift, caused by element removing
		this.order.insertAt(id,Math.min(this.order.length, tindex));	//insert at new position
		
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"move"]);
	},
	scheme:function(config){
		/*
			some.scheme({
				order:1,
				name:"dummy",
				title:""
			})
		*/
		this._scheme = config;
		this._scheme_init = config.$init;
		this._scheme_update = config.$update;
		this._scheme_serialize = config.$serialize;
		delete config.$init;
		delete config.$update;
		delete config.$serialize;
	},
	sync:function(source, filter, silent){
		if (typeof filter != "function"){
			silent = filter;
			filter = null;
		}
		
		if (dhx.debug_bind){
			this.debug_sync_master = source; 
			dhx.log("[sync] "+this.debug_bind_master.name+"@"+this.debug_bind_master._settings.id+" <= "+this.debug_sync_master.name+"@"+this.debug_sync_master._settings.id);
		}

		if (source.name != "DataStore")
			source = source.data;

		var sync_logic = dhx.bind(function(){
			this.order = dhx.toArray([].concat(source.order));
			this._filter_order = null;
			this.pull = source.pull;
			
			if (filter)
				this.silent(filter);
			
			if (this._on_sync)
				this._on_sync();
			if (dhx.debug_bind)
				dhx.log("[sync:request] "+this.debug_sync_master.name+"@"+this.debug_sync_master._settings.id + " <= "+this.debug_bind_master.name+"@"+this.debug_bind_master._settings.id);
			if (!silent) 
				this.refresh();
			else
				silent = false;
		}, this);
		
		source.attachEvent("onStoreUpdated", sync_logic);
		sync_logic();
	},
	//adds item to the store
	add:function(obj,index){
		
		if (this._scheme){
			obj = obj||{};
			for (var key in this._scheme)
				obj[key] = obj[key]||this._scheme[key];
			if (this._scheme_init)
				this._scheme_init(obj);
			else if (this._scheme_update)
				this._scheme_update(obj);
		}
		
		//generate id for the item
		var id = this.id(obj);
		
		//by default item is added to the end of the list
		var data_size = this.dataCount();
		
		if (dhx.isNotDefined(index) || index < 0)
			index = data_size; 
		//check to prevent too big indexes			
		if (index > data_size){
			dhx.log("Warning","DataStore:add","Index of out of bounds");
			index = Math.min(this.order.length,index);
		}
		if (this.callEvent("onBeforeAdd", [id, obj, index]) === false) return false;

		if (this.exists(id)) return dhx.error("Not unique ID");
		
		this.pull[id]=obj;
		this.order.insertAt(id,index);
		if (this._filter_order){	//adding during filtering
			//we can't know the location of new item in full dataset, making suggestion
			//put at end by default
			var original_index = this._filter_order.length;
			//put at start only if adding to the start and some data exists
			if (!index && this.order.length)
				original_index = 0;
			
			this._filter_order.insertAt(id,original_index);
		}
		this.callEvent("onafterAdd",[id,index]);
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"add"]);
		return id;
	},
	
	//removes element from datastore
	remove:function(id){
		//id can be an array of IDs - result of getSelect, for example
		if (dhx.isArray(id)){
			for (var i=0; i < id.length; i++)
				this.remove(id[i]);
			return;
		}
		if (this.callEvent("onBeforeDelete",[id]) === false) return false;
		if (!this.exists(id)) return dhx.error("Not existing ID",id);
		var obj = this.item(id);	//save for later event
		//clear from collections
		this.order.remove(id);
		if (this._filter_order) 
			this._filter_order.remove(id);
			
		delete this.pull[id];
		this.callEvent("onafterdelete",[id]);
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"delete"]);
	},
	//deletes all records in datastore
	clearAll:function(){
		//instead of deleting one by one - just reset inner collections
		this.pull = {};
		this.order = dhx.toArray();
		//this.feed = null;
		this._filter_order = null;
		this.callEvent("onClearAll",[]);
		this.refresh();
	},
	//converts id to index
	idByIndex:function(index){
		if (index>=this.order.length || index<0)
			dhx.log("Warning","DataStore::idByIndex Incorrect index");
			
		return this.order[index];
	},
	//converts index to id
	indexById:function(id){
		var res = this.order.find(id);	//slower than idByIndex
		
		if (!this.pull[id])
			dhx.log("Warning","DataStore::indexById Non-existing ID: "+ id);
			
		return res;
	},
	//returns ID of next element
	next:function(id,step){
		return this.order[this.indexById(id)+(step||1)];
	},
	//returns ID of first element
	first:function(){
		return this.order[0];
	},
	//returns ID of last element
	last:function(){
		return this.order[this.order.length-1];
	},
	//returns ID of previous element
	previous:function(id,step){
		return this.order[this.indexById(id)-(step||1)];
	},
	/*
		sort data in collection
			by - settings of sorting
		
		or
		
			by - sorting function
			dir - "asc" or "desc"
			
		or
		
			by - property
			dir - "asc" or "desc"
			as - type of sortings
		
		Sorting function will accept 2 parameters and must return 1,0,-1, based on desired order
	*/
	sort:function(by, dir, as){
		var sort = by;	
		if (typeof by == "function")
			sort = {as:by, dir:dir};
		else if (typeof by == "string")
			sort = {by:by, dir:dir, as:as};		
		
		
		var parameters = [sort.by, sort.dir, sort.as];
		if (!this.callEvent("onbeforesort",parameters)) return;	
		
		if (this.order.length){
			var sorter = dhx.sort.create(sort);
			//get array of IDs
			var neworder = this.getRange(this.first(), this.last());
			neworder.sort(sorter);
			this.order = neworder.map(function(obj){ return this.id(obj); },this);
		}
		
		//repaint self
		this.refresh();
		
		this.callEvent("onaftersort",parameters);
	},
	/*
		Filter datasource
		
		text - property, by which filter
		value - filter mask
		
		or
		
		text  - filter method
		
		Filter method will receive data object and must return true or false
	*/
	filter:function(text,value,preserve){
		if (!this.callEvent("onBeforeFilter", [text, value])) return;
		
		//remove previous filtering , if any
		if (this._filter_order && !preserve){
			this.order = this._filter_order;
			delete this._filter_order;
		}
		
		if (!this.order.length) return;
		
		//if text not define -just unfilter previous state and exit
		if (text){
			var filter = text;
			value = value||"";
			if (typeof text == "string"){
				text = dhx.Template(text);
				value = value.toString().toLowerCase();
				filter = function(obj,value){	//default filter - string start from, case in-sensitive
					return text(obj).toLowerCase().indexOf(value)!=-1;
				};
			}
			
					
			var neworder = dhx.toArray();
			for (var i=0; i < this.order.length; i++){
				var id = this.order[i];
				if (filter(this.item(id),value))
					neworder.push(id);
			}
			//set new order of items, store original
			if (!preserve)
				this._filter_order = this.order;
			this.order = neworder;
		}
		//repaint self
		this.refresh();
		
		this.callEvent("onAfterFilter", []);
	},
	/*
		Iterate through collection
	*/
	each:function(method,master){
		for (var i=0; i<this.order.length; i++)
			method.call((master||this), this.item(this.order[i]));
	},
	/*
		map inner methods to some distant object
	*/
	provideApi:function(target,eventable){
		this.debug_bind_master = target;
			
		if (eventable){
			this.mapEvent({
				onbeforesort:	target,
				onaftersort:	target,
				onbeforeadd:	target,
				onafteradd:		target,
				onbeforedelete:	target,
				onafterdelete:	target,
				onbeforeupdate: target/*,
				onafterfilter:	target,
				onbeforefilter:	target*/
			});
		}
			
		var list = ["sort","add","remove","exists","idByIndex","indexById","item","update","refresh","dataCount","filter","next","previous","clearAll","first","last","serialize","sync"];
		for (var i=0; i < list.length; i++)
			target[list[i]]=dhx.methodPush(this,list[i]);
			
		if (dhx.assert_enabled())		
			this.assert_event(target);
	},
	/*
		serializes data to a json object
	*/
	serialize: function(){
		var ids = this.order;
		var result = [];
		for(var i=0; i< ids.length;i++) {
			var el = this.pull[ids[i]];
			if (this._scheme_serialize){
				el = this._scheme_serialize(el);
				if (el===false) continue;
			}
			result.push(el);
		}
		return result;
	}
};

dhx.sort = {
	create:function(config){
		return dhx.sort.dir(config.dir, dhx.sort.by(config.by, config.as));
	},
	as:{
		"int":function(a,b){
			a = a*1; b=b*1;
			return a>b?1:(a<b?-1:0);
		},
		"string_strict":function(a,b){
			a = a.toString(); b=b.toString();
			return a>b?1:(a<b?-1:0);
		},
		"string":function(a,b){
			a = a.toString().toLowerCase(); b=b.toString().toLowerCase();
			return a>b?1:(a<b?-1:0);
		}
	},
	by:function(prop, method){
		if (!prop)
			return method;
		if (typeof method != "function")
			method = dhx.sort.as[method||"string"];
		prop = dhx.Template(prop);
		return function(a,b){
			return method(prop(a),prop(b));
		};
	},
	dir:function(prop, method){
		if (prop == "asc")
			return method;
		return function(a,b){
			return method(a,b)*-1;
		};
	}
};






//UI interface
dhx.BaseBind = {
	bind:function(target, rule, format){
		if (typeof target == 'string')
			target = dhx.ui.get(target);
			
		if (target._initBindSource) target._initBindSource();
		if (this._initBindSource) this._initBindSource();

		
			
		if (!target.getBindData)
			dhx.extend(target, dhx.BindSource);
		if (!this._bind_ready){
			var old_render = this.render;
			if (this.filter){
				var key = this._settings.id;
				this.data._on_sync = function(){
					target._bind_updated[key] = false;
				};
			}
			this.render = function(){
				if (this._in_bind_processing) return;
				
				this._in_bind_processing = true;
				this.callEvent("onBindRequest");
				this._in_bind_processing = false;
				
				return old_render.call(this);
			};
			if (this.getValue||this.getValues)
				this.save = function(){
					if (this.validate && !this.validate()) return;
					target.setBindData((this.getValue?this.getValue:this.getValues()),this._settings.id);
				};
			this._bind_ready = true;
		}
		target.addBind(this._settings.id, rule, format);
		
		if (dhx.debug_bind)
			dhx.log("[bind] "+this.name+"@"+this._settings.id+" <= "+target.name+"@"+target._settings.id);
		//FIXME - check for touchable is not the best solution, to detect necessary event
		this.attachEvent(this.touchable?"onAfterRender":"onBindRequest", function(){
			target.getBindData(this._settings.id);
		});
		if (this.isVisible(this._settings.id))
			this.refresh();
	}
};

//bind interface
dhx.BindSource = {
	$init:function(){
		this._bind_hash = {};		//rules per target
		this._bind_updated = {};	//update flags
		this._ignore_binds = {};
		
		//apply specific bind extension
		this._bind_specific_rules(this);
	},
	setBindData:function(data, key){
		if (key)
			this._ignore_binds[key] = true;
		
		if (dhx.debug_bind)
				dhx.log("[bind:save] "+this.name+"@"+this._settings.id+" <= "+"@"+key);
		if (this.setValue)
			this.setValue(data);
		else if (this.setValues)
			this.setValues(data);
		else {
			var id = this.getCursor();
			if (id){
				data = dhx.extend(this.item(id), data, true);
				this.update(id, data);
			}
		}
		this.callEvent("onBindUpdate", [data, key]);		
		if (this.save)
			this.save();
		
		if (key)
			this._ignore_binds[key] = false;
	},
	//fill target with data
	getBindData:function(key, update){
		//fire only if we have data updates from the last time
		if (this._bind_updated[key]) return;
		var target = dhx.ui.get(key);
		//fill target only when it visible
		if (target.isVisible(target._settings.id)){
			this._bind_updated[key] = true;
			if (dhx.debug_bind)
				dhx.log("[bind:request] "+this.name+"@"+this._settings.id+" => "+target.name+"@"+target._settings.id);
			this._bind_update(target, this._bind_hash[key][0], this._bind_hash[key][1]); //trigger component specific updating logic
			if (update && target.filter)
				target.refresh();
			
		}
	},
	//add one more bind target
	addBind:function(source, rule, format){
		this._bind_hash[source] = [rule, format];
	},
	//returns true if object belong to "collection" type
	_bind_specific_rules:function(obj){
		if (obj.filter)
			dhx.extend(this, dhx.CollectionBind);
		else if (obj.setValue)
			dhx.extend(this, dhx.ValueBind);
		else
			dhx.extend(this, dhx.RecordBind);
	},
	//inform all binded objects, that source data was updated
	_update_binds:function(){
		for (var key in this._bind_hash){
			if (this._ignore_binds[key]) continue;
			this._bind_updated[key] = false;
			this.getBindData(key, true);
		}
	},
	//copy data from source to the target
	_bind_update_common:function(target, rule, data){
		if (target.setValue)
			target.setValue(data?data[rule]:data);
		else if (!target.filter){
			if (!data && target.clear)
				target.clear();
			else {
				if (target._check_data_feed(data))
					target.setValues(dhx.copy(data));
			}
		} else {
			target.data.silent(function(){
				this.filter(rule,data);
			});
		}
	}
};


//pure data objects
dhx.DataValue = dhx.proto({
	name:"DataValue",
	isVisible:function(){ return true; },
	$init:function(config){ 
		this.data = ""||config; 
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings = { id:id };
		dhx.ui.views[id] = this;
	},
	setValue:function(value){
		this.data = value;
		this.callEvent("onChange", [value]);
	},
	getValue:function(){
		return this.data;
	},
	refresh:function(){ this.callEvent("onBindRequest"); }
}, dhx.EventSystem, dhx.BaseBind);

dhx.DataRecord = dhx.proto({
	name:"DataRecord",
	isVisible:function(){ return true; },
	$init:function(config){
		this.data = config||{}; 
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings = { id:id };
		dhx.ui.views[id] = this;
	},
	getValues:function(){
		return this.data;
	},
	setValues:function(data){
		this.data = data;
		this.callEvent("onChange", [data]);
	},
	refresh:function(){ this.callEvent("onBindRequest"); }
}, dhx.EventSystem, dhx.BaseBind);


dhx.DataCollection = dhx.proto({
	name:"DataCollection",
	isVisible:function(){ 
		if (!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed) return false;
		return true; 
	},
	$init:function(config){
		this.data.provideApi(this, true);
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings.id =id;
		dhx.ui.views[id] = this;
		this.data.attachEvent("onStoreLoad", dhx.bind(function(){
			this.callEvent("onBindRequest",[]);
		}, this));
	},
	refresh:function(){ this.callEvent("onBindRequest",[]); }
}, dhx.EventSystem, dhx.DataLoader, dhx.BaseBind, dhx.Settings);




dhx.ValueBind={
	$init:function(){
		this.attachEvent("onChange", this._update_binds);
	},
	_bind_update:function(target, rule, format){
		var data = this.getValue()||"";
		if (format) data = format(data);
		
		if (target.setValue)
			target.setValue(data);
		else if (!target.filter){
			var pod = {}; pod[rule] = data;
			if (target._check_data_feed(data))
				target.setValues(pod);
		} else{
			target.data.silent(function(){
				this.filter(rule,data);
			});
		}
	}
};

dhx.RecordBind={
	$init:function(){
		this.attachEvent("onChange", this._update_binds);		
	},
	_bind_update:function(target, rule){
		var data = this.getValues()||null;
		this._bind_update_common(target, rule, data);
	}
};

dhx.CollectionBind={
	$init:function(){
		this._cursor = null;
		this.attachEvent("onSelectChange", function(data){
			this.setCursor(this.getSelected());
		});
		this.attachEvent("onAfterCursorChange", this._update_binds);		
		this.data.attachEvent("onStoreUpdated", dhx.bind(function(id){
			if (id && id == this.getCursor())
				this._update_binds();
		},this));
		this.data.attachEvent("onClearAll", dhx.bind(function(){
			this._cursor = null;
		},this));
		this.data.attachEvent("onIdChange", dhx.bind(function(oldid, newid){
			if (this._cursor == oldid)
				this._cursor = newid;
		},this));
	},
	setCursor:function(id){
		if (id == this._cursor || !this.item(id)) return;

		this.callEvent("onBeforeCursorChange", [this._cursor]);
		this._cursor = id;
		this.callEvent("onAfterCursorChange",[id]);
	},
	getCursor:function(){
		return this._cursor;
	},
	_bind_update:function(target, rule){ 
		var data = this.item(this.getCursor())||null;
		this._bind_update_common(target, rule, data);
	}
};	
/*DHX:Depend core/datastore.js*/
/*DHX:Depend libs/legacy_bind.js*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/bind.js*/

/*jsl:ignore*/

if (!dhx.ui.views){
	dhx.ui.views = {};
	dhx.ui.get = function(id){
		if (id._settings) return id;
		return dhx.ui.views[id];
	};
}

dhtmlXDataStore = function(config){
	var obj = new dhx.DataCollection(config);
	var name = "_dp_init";
	obj[name]=function(dp){
		//map methods
		var varname = "_methods";
		dp[varname]=["dummy","dummy","changeId","dummy"];
		
		this.data._old_names = {
			"add":"inserted",
			"update":"updated",
			"delete":"deleted"
		};
		this.data.attachEvent("onStoreUpdated",function(id,data,mode){
			if (id && !dp._silent)
				dp.setUpdated(id,true,this._old_names[mode]);
		});
		
		
		varname = "_getRowData";
		//serialize item's data in URL
		dp[varname]=function(id,pref){
			var ev=this.obj.data.item(id);
			var data = { id:id, "!nativeeditor_status":this.obj.getUserData(id)};
			if (ev)
				for (var a in ev){
					if (a.indexOf("_")===0) continue;
						data[a]=ev[a];
				}
			
			return data;
		};

		this.changeId = function(oldid, newid){ 
			this.data.changeId(oldid, newid);	
			dp._silent = true;
			this.data.callEvent("onStoreUpdated", [newid, this.item(newid), "update"]);
			dp._silent = false;
		};	

		varname = "_clearUpdateFlag";
		dp[varname]=function(){};
		this._userdata = {};

	};
	obj.dummy = function(){};
	obj.setUserData=function(id,name,value){
		this._userdata[id]=value;
	};
	obj.getUserData=function(id,name){
		return this._userdata[id];
	};

	return obj;
};

if (window.dhtmlXDataView)
	dhtmlXDataView.prototype._initBindSource=function(){
		this.isVisible = function(){
			if (!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed) return false;
			return true;
		};
		if (!this._settings.id)
			this._settings.id = dhx.uid();
		dhx.ui.views[this._settings.id] = this;
	};

if (window.dhtmlXChart)
	dhtmlXChart.prototype._initBindSource=function(){
		this.isVisible = function(){
			if (!this.data.order.length && !this.data._filtered_state && !this._settings.dataFeed) return false;
			return true;
		};
		if (!this._settings.id)
			this._settings.id = dhx.uid();
		dhx.ui.views[this._settings.id] = this;
	};
	
dhx.BaseBind.legacyBind = function(){
	return dhx.BaseBind.bind.apply(this, arguments);
};
dhx.BaseBind.legacySync = function(source, rule){
	if (this._initBindSource) this._initBindSource();
	if (source._initBindSource) source._initBindSource();

	this.attachEvent("onAfterEditStop", function(id){
		this.save(id);
		return true;
	});
	this.save = function(id){
		if (!id) id = this.getCursor();
		var sobj = this.item(id);
		var tobj = source.item(id);
		for (var key in sobj)
			if (key.indexOf("$")!==0)
				tobj[key] = sobj[key];
		source.refresh(id);
	};
	return this.data.sync.apply(this.data, arguments);
};

if (window.dhtmlXForm){
	
	dhtmlXForm.prototype.bind = function(){
		dhx.BaseBind.bind.apply(this, arguments);
	};

	dhtmlXForm.prototype._initBindSource = function(){
		if (dhx.isNotDefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;
		}
	};
	dhtmlXForm.prototype._check_data_feed = function(data){
		if (!this._settings.dataFeed || this._ignore_feed || !data) return true;
		var url = this._settings.dataFeed;
		url = url+(url.indexOf("?")==-1?"?":"&")+"action=get&id="+encodeURIComponent(data.id||data);
		this.load(url);
		return false;
	};
	dhtmlXForm.prototype.setValues = dhtmlXForm.prototype.setFormData;
	dhtmlXForm.prototype.getValues = function(){
		return this.getFormData(false, true);
	};

	dhtmlXForm.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXForm.prototype.refresh = dhtmlXForm.prototype.isVisible = function(value){
		return true;
	};
}
 
if (window.dhtmlXCombo){
	dhtmlXCombo.prototype.bind = function(){
		dhx.BaseBind.bind.apply(this, arguments);
	};

	dhtmlXCombo.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXCombo.prototype.sync = function(source, rule){
		if (this._initBindSource) this._initBindSource();
		if (source._initBindSource) source._initBindSource();


		var combo = this;

		var insync = function(ignore){
			combo.clearAll();
			combo.addOption(this.serialize());
		};

		//source.data.attachEvent("onStoreLoad", insync);
		source.data.attachEvent("onStoreUpdated", function(id, data, mode){ 
			insync.call(this);
		});
		source.data.attachEvent("onIdChange", function(oldid, newid){
			combo.changeOptionId(oldid, newid);
		});


		insync.call(source);
	};

	dhtmlXCombo.prototype._initBindSource = function() { 
		if (dhx.isNotDefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhtmlxEventable(this.data);

			this.attachEvent("onChange", function() {
				this.callEvent("onSelectChange", [this.getSelectedValue()]);
			});
			this.attachEvent("onXLE", function(){
				this.callEvent("onBindRequest",[]);
			});
		}
	};

	dhtmlXCombo.prototype.item = function(id) {
		return this._selOption;
	};

	dhtmlXCombo.prototype.getSelected = function() {
		return this.getSelectedValue();
	};
	dhtmlXCombo.prototype.isVisible = function() {
		if (!this.optionsArr.length && !this._settings.dataFeed) return false;
		return true;
	};
	dhtmlXCombo.prototype.refresh = function() {
		this.render(true);
	};

	dhtmlXCombo.prototype.filter = function(callback, master){
		alert("not implemented");
	};
}

if (window.dhtmlXGridObject){
	dhtmlXGridObject.prototype.bind = function(source, rule, format) {
		dhx.BaseBind.bind.apply(this, arguments);
	};

	
	dhtmlXGridObject.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXGridObject.prototype.sync = function(source, rule){
		if (this._initBindSource) this._initBindSource();
		if (source._initBindSource) source._initBindSource();


		var grid = this;
		var parsing = "_parsing";
		var parser = "_parser";
		var locator = "_locator";
		var parser_func = "_process_store_row";
		var locator_func = "_get_store_data";

		this.save = function(id){
			if (!id) id = this.getCursor();
			dhx.extend(source.item(id),this.item(id), true);
			source.refresh(id);
		};
		var insync = function(ignore){
			var from = 0; 
			if (grid._legacy_ignore_next){
				from  = grid._legacy_ignore_next;
				grid._legacy_ignore_next = false;
			} else {
				grid.clearAll();
			}

			if (ignore === -1) return;

			var count = this.dataCount();
			if (count){
				grid[parsing]=true;
				for (var i = from; i < count; i++){
					var id = this.order[i];
					if (!id) continue;
					if (from && grid.rowsBuffer[i]) continue;
					grid.rowsBuffer[i]={
						idd: id,
						data: this.pull[id]
					};
					grid.rowsBuffer[i][parser] = grid[parser_func];
					grid.rowsBuffer[i][locator] = grid[locator_func];
					grid.rowsAr[id]=this.pull[id];
				}
				if (!grid.rowsBuffer[count-1]){
					grid.rowsBuffer[count-1] = dhtmlx.undefined;
					grid.xmlFileUrl = grid.xmlFileUrl||true;
				}

				if (grid.pagingOn)
					grid.changePage();
				else {
					if (grid._srnd && grid._fillers)
						grid._update_srnd_view();
					else{
						grid.render_dataset();
						grid.callEvent("onXLE",[]);
					}
				}
				grid[parsing]=false;
			}
		};

		//source.data.attachEvent("onStoreLoad", insync);
		source.data.attachEvent("onStoreUpdated", function(id, data, mode){ 
			if (mode == "delete"){
				grid.deleteRow(id);
				grid.data.callEvent("onStoreUpdated",[id, data, mode]);
			} else if (mode == "update"){
				grid.callEvent("onSyncUpdate", [data, mode]);
				grid.update(id, data);
				grid.data.callEvent("onStoreUpdated",[id, data, mode]);
			} else if (mode == "add"){
				grid.callEvent("onSyncUpdate", [data, mode]);
				grid.add(id, data);
				grid.data.callEvent("onStoreUpdated",[id,data,mode]);
			} else insync.call(this);

		});

		source.data.attachEvent("onStoreLoad", function(driver, data){
			grid.xmlFileUrl = source.data.url;
			grid._legacy_ignore_next = driver.getInfo(data)._from;
		});

		source.data.attachEvent("onIdChange", function(oldid, newid){
			grid.changeRowId(oldid, newid);
		});
		
		insync(-1);
		grid.attachEvent("onEditCell", function(stage, id, ind, value, oldvalue){
			if (stage==2)
				this.save(id);
			return true;
		});
		grid.attachEvent("onDynXLS", function(start, count){
			for (var i=start; i<start+count; i++)
				if (!source.data.order[i]){
					source.loadNext(count, start);
					return false;
				}
			grid._legacy_ignore_next = start;
			insync();
		});
		grid.attachEvent("onClearAll",function(){
			var name = "_f_rowsBuffer";
	    	this[name]=null; 
	    });
	
		if (rule && rule.sort)	
			grid.attachEvent("onBeforeSorting", function(ind, type, dir){
				if (type == "connector") return false;
				var id = this.getColumnId(ind);
				source.sort("#"+id+"#", (dir=="asc"?"asc":"desc"), (type=="int"?type:"string"));
				grid.setSortImgState(true, ind, dir);
				return false;
			});

		if (rule && rule.filter)
			grid.attachEvent("onFilterStart", function(cols, values){
				var name = "_con_f_used";
				if (grid[name] && grid[name].length)
					return false;

				source.data.silent(function(){
					source.filter();
					for (var i=0; i<cols.length; i++){
						if (values[i] == "") continue;
						var id = grid.getColumnId(cols[i]);
						source.filter("#"+id+"#", values[i], i!=0);
					}
				});

				source.refresh();
				return false;
			});

		grid.clearAndLoad = function(url){
			source.clearAll();
			source.load(url);
		};
		

				    
	};

	dhtmlXGridObject.prototype._initBindSource = function() { 
		if (dhx.isNotDefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhtmlxEventable(this.data);
			var name = "_cCount";
			for (var i=0; i<this[name]; i++)
				if (!this.columnIds[i])
					this.columnIds[i] = "cell"+i;

			this.attachEvent("onSelectStateChanged", function(id) {
				this.callEvent("onSelectChange", [id]);
			});
			this.attachEvent("onSelectionCleared", function() {
				this.callEvent("onSelectChange", [null]);
			});
			this.attachEvent("onEditCell", function(stage,rId) {
				if (stage === 2 && this.getCursor) {
					if (rId && rId == this.getCursor())
						this._update_binds();
				}
				return true;
			});
			this.attachEvent("onXLE", function(){
				this.callEvent("onBindRequest",[]);
			});
		}
	};

	dhtmlXGridObject.prototype.item = function(id) {
		if (id === null) return null;
		var source = this.getRowById(id);
		if (!source) return null;
		
		var name = "_attrs";
		var data = dhx.fullCopy(source[name]);
			data.id = id;
		var length = this.getColumnsNum();
		for (var i = 0; i < length; i++) {
			data[this.columnIds[i]] = this.cells(id, i).getValue();
		}
		return data;
	};

	dhtmlXGridObject.prototype.update = function(id,data){
		for (var i=0; i<this.columnIds.length; i++){
			var key = this.columnIds[i];
			if (!dhx.isNotDefined(data[key]))
				this.cells(id, i).setValue(data[key]);
		}
		var name = "_attrs";
		var attrs = this.getRowById(id)[name];
		for (var key in data)
			attrs[key] = data[key];
	};

	dhtmlXGridObject.prototype.add = function(id,data){ 
		var ar_data = [];
		for (var i=0; i<this.columnIds.length; i++){
			var key = this.columnIds[i];
			ar_data[i] = dhx.isNotDefined(data[key])?"":data[key];
		}
		this.addRow(id, ar_data,0);
		var name = "_attrs";
		this.getRowById(id)[name] = dhx.fullCopy(data);
	};

	dhtmlXGridObject.prototype.getSelected = function() {
		return this.getSelectedRowId();
	};
	dhtmlXGridObject.prototype.isVisible = function() {
		var name = "_f_rowsBuffer";
		if (!this.rowsBuffer.length && !this[name] && !this._settings.dataFeed) return false;
		return true;
	};
	dhtmlXGridObject.prototype.refresh = function() {
		this.render_dataset();
	};

	dhtmlXGridObject.prototype.filter = function(callback, master){
		//if (!this.rowsBuffer.length && !this._f_rowsBuffer) return;
		if (this._settings.dataFeed){
			var filter = {};
			if (!callback && !master) return;
			if (typeof callback == "function"){
				if (!master) return;
				callback(master, filter);
			} else  if (dhx.isNotDefined(callback))
				filter = master;
			else
				filter[callback] = master;

			this.clearAll(); 
			var url = this._settings.dataFeed;
			var urldata = [];
			for (var key in filter)
				urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));

			this.load(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"));
			return false;
		}

		if (master === null) {
			return this.filterBy(0, function(){ return false; });
		}

		this.filterBy(0, function(value, id){
			return callback.call(this, id, master);
		});
	};
}


if (window.dhtmlXTreeObject){
	dhtmlXTreeObject.prototype.bind = function() {
		dhx.BaseBind.bind.apply(this, arguments);
	};

	dhtmlXTreeObject.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXTreeObject.prototype._initBindSource = function() {
		if (dhx.isNotDefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhtmlxEventable(this.data);

			this.attachEvent("onSelect", function(id) {
				this.callEvent("onSelectChange", [id]);
			});
			this.attachEvent("onEdit", function(stage,rId) {
				if (stage === 2) {
					if (rId && rId == this.getCursor())
						this._update_binds();
				}
				return true;
			});
		}
	};

	dhtmlXTreeObject.prototype.item = function(id) {
		if (id === null) return null;
		return { id: id, text:this.getItemText(id)};
	};

	dhtmlXTreeObject.prototype.getSelected = function() {
		return this.getSelectedItemId();
	};
	dhtmlXTreeObject.prototype.isVisible = function() {
		return true;
	};
	dhtmlXTreeObject.prototype.refresh = function() {
		//dummy placeholder
	};

	dhtmlXTreeObject.prototype.filter = function(callback, master){
		//dummy placeholder, because tree doesn't support filtering
		if (this._settings.dataFeed){
			var filter = {};
			if (!callback && !master) return;
			if (typeof callback == "function"){
				if (!master) return;
				callback(master, filter);
			} else  if (dhx.isNotDefined(callback))
				filter = master;
			else
				filter[callback] = master;

			this.deleteChildItems(0); 
			var url = this._settings.dataFeed;
			var urldata = [];
			for (var key in filter)
				urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));

			this.loadXML(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"));
			return false;
		}
	};

	dhtmlXTreeObject.prototype.update = function(id,data){
		if (!dhx.isNotDefined(data.text))
			this.setItemText(id, data.text);
	};
}

/*jsl:end*/