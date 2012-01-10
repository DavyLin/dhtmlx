  /*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
window.dhx || (dhx = {});
dhx.version = "3.0";
dhx.codebase = "./";
dhx.name = "Core";
dhx.copy = function(source) {
  var f = dhx.copy._function;
  f.prototype = source;
  return new f
};
dhx.copy._function = function() {
};
dhx.extend = function(target, source, force) {
  target._dhx_proto_wait && (target = target._dhx_proto_wait[0]);
  for(var method in source) {
    if(!target[method] || force) {
      target[method] = source[method]
    }
  }
  source.defaults && dhx.extend(target.defaults, source.defaults);
  source.$init && source.$init.call(target);
  return target
};
dhx.fullCopy = function(source) {
  var target = source.length ? [] : {};
  arguments.length > 1 && (target = arguments[0], source = arguments[1]);
  for(var method in source) {
    ( source[method] && typeof source[method] == "object" ) ? (target[method] = source[method].length ? [] : {}, dhx.fullCopy(target[method], source[method])) : target[method] = source[method]
  }
  return target
};
dhx.single = function(source) {
  var instance = null, t = function(config) {
    instance || (instance = new source({}));
    instance._reinit && instance._reinit.apply(instance, arguments);
    return instance
  };
  return t
};
dhx.protoUI = function() {
  var origins = arguments, selfname = origins[0].name, t = function(data) {
    if(origins) {
      for(var params = [origins[0]], i = 1;i < origins.length;i++) {
        params[i] = origins[i], params[i]._dhx_proto_wait && (params[i] = params[i].call(dhx)), params[i].prototype && params[i].prototype.name && (dhx.ui[params[i].prototype.name] = params[i])
      }
      dhx.ui[selfname] = dhx.proto.apply(dhx, params);
      if(t._dhx_type_wait) {
        for(i = 0;i < t._dhx_type_wait.length;i++) {
          dhx.Type(dhx.ui[selfname], t._dhx_type_wait[i])
        }
      }
      t = origins = null
    }
    return this != dhx ? new dhx.ui[selfname](data) : dhx.ui[selfname]
  };
  t._dhx_proto_wait = arguments;
  return dhx.ui[selfname] = t
};
dhx.proto = function() {
  for(var origins = arguments, compilation = origins[0], has_constructor = !!compilation.$init, construct = [], i$$0 = origins.length - 1;i$$0 > 0;i$$0--) {
    if(typeof origins[i$$0] == "function") {
      origins[i$$0] = origins[i$$0].prototype
    }
    origins[i$$0].$init && construct.push(origins[i$$0].$init);
    if(origins[i$$0].defaults) {
      var defaults = origins[i$$0].defaults;
      if(!compilation.defaults) {
        compilation.defaults = {}
      }
      for(var def in defaults) {
        dhx.isNotDefined(compilation.defaults[def]) && (compilation.defaults[def] = defaults[def])
      }
    }
    if(origins[i$$0].type && compilation.type) {
      for(def in origins[i$$0].type) {
        compilation.type[def] || (compilation.type[def] = origins[i$$0].type[def])
      }
    }
    for(var key in origins[i$$0]) {
      compilation[key] || (compilation[key] = origins[i$$0][key])
    }
  }
  has_constructor && construct.push(compilation.$init);
  compilation.$init = function() {
    for(var i = 0;i < construct.length;i++) {
      construct[i].apply(this, arguments)
    }
  };
  var result = function(config) {
    this.$ready = [];
    this.$init(config);
    this._parseSettings && this._parseSettings(config, this.defaults);
    for(var i = 0;i < this.$ready.length;i++) {
      this.$ready[i].call(this)
    }
  };
  result.prototype = compilation;
  compilation = origins = null;
  return result
};
dhx.bind = function(functor, object) {
  return function() {
    return functor.apply(object, arguments)
  }
};
dhx.require = function(module) {
  dhx._modules[module] || (dhx.exec(dhx.ajax().sync().get(dhx.codebase + module).responseText), dhx._modules[module] = !0)
};
dhx._modules = {};
dhx.exec = function(code) {
  window.execScript ? window.execScript(code) : window.eval(code)
};
dhx.wrap = function(code, wrap) {
  return!code ? wrap : function() {
    var result = code.apply(this, arguments);
    wrap.apply(this, arguments);
    return result
  }
};
dhx.methodPush = function(object, method) {
  return function() {
    var res = !1;
    return res = object[method].apply(object, arguments)
  }
};
dhx.isNotDefined = function(a) {
  return typeof a == "undefined"
};
dhx.delay = function(method, obj, params, delay) {
  return window.setTimeout(function() {
    var ret = method.apply(obj, params || []);
    method = obj = params = null;
    return ret
  }, delay || 1)
};
dhx.uid = function() {
  if(!this._seed) {
    this._seed = (new Date).valueOf()
  }
  this._seed++;
  return this._seed
};
dhx.toNode = function(node) {
  return typeof node == "string" ? document.getElementById(node) : node
};
dhx.toArray = function(array) {
  return dhx.extend(array || [], dhx.PowerArray, !0)
};
dhx.toFunctor = function(str) {
  return typeof str == "string" ? eval(str) : str
};
dhx.isArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]"
};
dhx._events = {};
dhx.event = function(node, event, handler, master) {
  var node = dhx.toNode(node), id = dhx.uid();
  master && (handler = dhx.bind(handler, master));
  dhx._events[id] = [node, event, handler];
  node.addEventListener ? node.addEventListener(event, handler, !1) : node.attachEvent && node.attachEvent("on" + event, handler);
  return id
};
dhx.eventRemove = function(id) {
  if(id) {
    var ev = dhx._events[id];
    ev[0].removeEventListener ? ev[0].removeEventListener(ev[1], ev[2], !1) : ev[0].detachEvent && ev[0].detachEvent("on" + ev[1], ev[2]);
    delete this._events[id]
  }
};
dhx.EventSystem = {$init:function() {
  this._events = {};
  this._handlers = {};
  this._map = {}
}, blockEvent:function() {
  this._events._block = !0
}, unblockEvent:function() {
  this._events._block = !1
}, mapEvent:function(map) {
  dhx.extend(this._map, map, !0)
}, callEvent:function(type, params) {
  if(this._events._block) {
    return!0
  }
  var type = type.toLowerCase(), event_stack = this._events[type.toLowerCase()], return_value = !0;
  if(event_stack) {
    for(var i = 0;i < event_stack.length;i++) {
      if(event_stack[i].apply(this, params || []) === !1) {
        return_value = !1
      }
    }
  }
  this._map[type] && !this._map[type].callEvent(type, params) && (return_value = !1);
  return return_value
}, attachEvent:function(type, functor, id) {
  var type = type.toLowerCase(), id = id || dhx.uid(), functor = dhx.toFunctor(functor), event_stack = this._events[type] || dhx.toArray();
  event_stack.push(functor);
  this._events[type] = event_stack;
  this._handlers[id] = {f:functor, t:type};
  return id
}, detachEvent:function(id) {
  if(this._handlers[id]) {
    var type = this._handlers[id].t, functor = this._handlers[id].f, event_stack = this._events[type];
    event_stack.remove(functor);
    delete this._handlers[id]
  }
}, hasEvent:function(type) {
  type = type.toLowerCase();
  return this._events[type] ? !0 : !1
}};
dhx.extend(dhx, dhx.EventSystem);
dhx.PowerArray = {removeAt:function(pos, len) {
  pos >= 0 && this.splice(pos, len || 1)
}, remove:function(value) {
  this.removeAt(this.find(value))
}, insertAt:function(data, pos) {
  if(!pos && pos !== 0) {
    this.push(data)
  }else {
    var b = this.splice(pos, this.length - pos);
    this[pos] = data;
    this.push.apply(this, b)
  }
}, find:function(data) {
  for(var i = 0;i < this.length;i++) {
    if(data == this[i]) {
      return i
    }
  }
  return-1
}, each:function(functor, master) {
  for(var i = 0;i < this.length;i++) {
    functor.call(master || this, this[i])
  }
}, map:function(functor, master) {
  for(var i = 0;i < this.length;i++) {
    this[i] = functor.call(master || this, this[i])
  }
  return this
}};
dhx.env = {};
(function() {
  if(navigator.userAgent.indexOf("Mobile") != -1) {
    dhx.env.mobile = !0
  }
  if(dhx.env.mobile || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1) {
    dhx.env.touch = !0
  }
  navigator.userAgent.indexOf("Opera") != -1 ? dhx.env.isOpera = !0 : (dhx.env.isIE = !!document.all, dhx.env.isFF = !document.all, dhx.env.isWebKit = navigator.userAgent.indexOf("KHTML") != -1, dhx.env.isSafari = dhx.env.isWebKit && navigator.userAgent.indexOf("Mac") != -1);
  if(navigator.userAgent.toLowerCase().indexOf("android") != -1) {
    dhx.env.isAndroid = !0
  }
  dhx.env.transform = !1;
  dhx.env.transition = !1;
  for(var options = {names:["transform", "transition"], transform:["transform", "WebkitTransform", "MozTransform", "oTransform", "msTransform"], transition:["transition", "WebkitTransition", "MozTransition", "oTransition", "msTransition"]}, d = document.createElement("DIV"), i = 0;i < options.names.length;i++) {
    for(var coll = options[options.names[i]], j = 0;j < coll.length;j++) {
      if(typeof d.style[coll[j]] != "undefined") {
        dhx.env[options.names[i]] = coll[j];
        break
      }
    }
  }
  d.style[dhx.env.transform] = "translate3d(0,0,0)";
  dhx.env.translate = d.style[dhx.env.transform] ? "translate3d" : "translate";
  dhx.env.transformCSSPrefix = function() {
    var prefix;
    dhx.env.isOpera ? prefix = "-o-" : (prefix = "", dhx.env.isFF && (prefix = "-Moz-"), dhx.env.isWebKit && (prefix = "-webkit-"), dhx.env.isIE && (prefix = "-ms-"));
    return prefix
  }();
  dhx.env.transformPrefix = dhx.env.transformCSSPrefix.replace(/-/gi, "");
  dhx.env.transitionEnd = dhx.env.transformCSSPrefix == "-Moz-" ? "transitionend" : dhx.env.transformPrefix + "TransitionEnd"
})();
dhx.env.svg = function() {
  return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
}();
dhx.html = {create:function(name, attrs, html) {
  var attrs = attrs || {}, node = document.createElement(name), attr_name;
  for(attr_name in attrs) {
    node.setAttribute(attr_name, attrs[attr_name])
  }
  if(attrs.style) {
    node.style.cssText = attrs.style
  }
  if(attrs["class"]) {
    node.className = attrs["class"]
  }
  if(html) {
    node.innerHTML = html
  }
  return node
}, getValue:function(node) {
  node = dhx.toNode(node);
  return!node ? "" : dhx.isNotDefined(node.value) ? node.innerHTML : node.value
}, remove:function(node) {
  if(node instanceof Array) {
    for(var i = 0;i < node.length;i++) {
      this.remove(node[i])
    }
  }else {
    node && node.parentNode && node.parentNode.removeChild(node)
  }
}, insertBefore:function(node, before, rescue) {
  node && (before && before.parentNode ? before.parentNode.insertBefore(node, before) : rescue.appendChild(node))
}, locate:function(e, id) {
  if(e.tagName) {
    var trg = e
  }else {
    e = e || event, trg = e.target || e.srcElement
  }
  for(;trg;) {
    if(trg.getAttribute) {
      var test = trg.getAttribute(id);
      if(test) {
        return test
      }
    }
    trg = trg.parentNode
  }
  return null
}, offset:function(elem) {
  if(elem.getBoundingClientRect) {
    var box = elem.getBoundingClientRect(), body = document.body, docElem = document.documentElement, scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop, scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft, clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
    return{y:Math.round(top), x:Math.round(left)}
  }else {
    for(left = top = 0;elem;) {
      top += parseInt(elem.offsetTop, 10), left += parseInt(elem.offsetLeft, 10), elem = elem.offsetParent
    }
    return{y:top, x:left}
  }
}, pos:function(ev) {
  ev = ev || event;
  if(ev.pageX || ev.pageY) {
    return{x:ev.pageX, y:ev.pageY}
  }
  var d = dhx.env.isIE && document.compatMode != "BackCompat" ? document.documentElement : document.body;
  return{x:ev.clientX + d.scrollLeft - d.clientLeft, y:ev.clientY + d.scrollTop - d.clientTop}
}, preventEvent:function(e) {
  e && e.preventDefault && e.preventDefault();
  return dhx.html.stopEvent(e)
}, stopEvent:function(e) {
  (e || event).cancelBubble = !0;
  return!1
}, addCss:function(node, name) {
  node.className += " " + name
}, removeCss:function(node, name) {
  node.className = node.className.replace(RegExp(" " + name, "g"), "")
}};
dhx.ready = function(code) {
  this._ready ? code.call() : this._ready_code.push(code)
};
dhx._ready_code = [];
(function() {
  var temp = document.getElementsByTagName("SCRIPT");
  if(temp.length) {
    temp = (temp[temp.length - 1].getAttribute("src") || "").split("/"), temp.splice(temp.length - 1, 1), dhx.codebase = temp.slice(0, temp.length).join("/") + "/"
  }
  dhx.event(window, "load", function() {
    dhx.callEvent("onReady", []);
    dhx.delay(function() {
      dhx._ready = !0;
      for(var i = 0;i < dhx._ready_code.length;i++) {
        dhx._ready_code[i].call()
      }
      dhx._ready_code = []
    })
  })
})();
dhx.ui = {};
dhx.ui.zIndex = function() {
  return dhx.ui._zIndex++
};
dhx.ui._zIndex = 1;
dhx.ready(function() {
  dhx.event(document.body, "click", function(e) {
    dhx.callEvent("onClick", [e || event])
  })
});
(function() {
  var _cache = {};
  dhx.Template = function(str) {
    if(typeof str == "function") {
      return str
    }
    if(_cache[str]) {
      return _cache[str]
    }
    str = (str || "").toString();
    if(str.indexOf("->") != -1) {
      switch(str = str.split("->"), str[0]) {
        case "html":
          str = dhx.html.getValue(str[1]);
          break;
        case "http":
          str = (new dhx.ajax).sync().get(str[1], {uid:dhx.uid()}).responseText
      }
    }
    str = (str || "").toString();
    str = str.replace(/(\r\n|\n)/g, "\\n");
    str = str.replace(/(\")/g, '\\"');
    str = str.replace(/\{obj\.([^}?]+)\?([^:]*):([^}]*)\}/g, '"+(obj.$1?"$2":"$3")+"');
    str = str.replace(/\{common\.([^}\(]*)\}/g, "\"+(common.$1||'')+\"");
    str = str.replace(/\{common\.([^\}\(]*)\(\)\}/g, '"+(common.$1?common.$1(obj,common):"")+"');
    str = str.replace(/\{obj\.([^}]*)\}/g, "\"+(obj.$1||'')+\"");
    str = str.replace(/#([$a-z0-9_\[\]]+)#/gi, "\"+(obj.$1||'')+\"");
    str = str.replace(/\{obj\}/g, '"+obj+"');
    str = str.replace(/\{-obj/g, "{obj");
    str = str.replace(/\{-common/g, "{common");
    str = 'return "' + str + '";';
    try {
      Function("obj", "common", str)
    }catch(e) {
    }
    return _cache[str] = Function("obj", "common", str)
  };
  dhx.Template.empty = function() {
    return""
  };
  dhx.Template.bind = function(value) {
    return dhx.bind(dhx.Template(value), this)
  };
  dhx.Type = function(obj, data) {
    if(obj._dhx_proto_wait) {
      if(!obj._dhx_type_wait) {
        obj._dhx_type_wait = []
      }
      obj._dhx_type_wait.push(data)
    }else {
      if(typeof obj == "function") {
        obj = obj.prototype
      }
      if(!obj.types) {
        obj.types = {"default":obj.type}, obj.type.name = "default"
      }
      var name = data.name, type = obj.type;
      name && (type = obj.types[name] = dhx.copy(obj.type));
      for(var key in data) {
        type[key] = key.indexOf("template") === 0 ? dhx.Template(data[key]) : data[key]
      }
      return name
    }
  }
})();
dhx.Settings = {$init:function() {
  this._settings = this.config = {}
}, define:function(property, value) {
  return typeof property == "object" ? this._parseSeetingColl(property) : this._define(property, value)
}, _define:function(property, value) {
  var setter = this[property + "_setter"];
  return this._settings[property] = setter ? setter.call(this, value, property) : value
}, _parseSeetingColl:function(coll) {
  if(coll) {
    for(var a in coll) {
      this._define(a, coll[a])
    }
  }
}, _parseSettings:function(obj, initial) {
  var settings = {};
  initial && (settings = dhx.extend(settings, initial));
  typeof obj == "object" && !obj.tagName && dhx.extend(settings, obj, !0);
  this._parseSeetingColl(settings)
}, _mergeSettings:function(config, defaults) {
  for(var key in defaults) {
    switch(typeof config[key]) {
      case "object":
        config[key] = this._mergeSettings(config[key] || {}, defaults[key]);
        break;
      case "undefined":
        config[key] = defaults[key]
    }
  }
  return config
}};
dhx.ajax = function(url, call, master) {
  if(arguments.length !== 0) {
    var http_request = new dhx.ajax;
    if(master) {
      http_request.master = master
    }
    http_request.get(url, null, call)
  }
  return!this.getXHR ? new dhx.ajax : this
};
dhx.ajax.prototype = {getXHR:function() {
  return dhx.env.isIE ? new ActiveXObject("Microsoft.xmlHTTP") : new XMLHttpRequest
}, send:function(url, params, call) {
  var x = this.getXHR();
  typeof call == "function" && (call = [call]);
  if(typeof params == "object") {
    var t = [], a;
    for(a in params) {
      var value = params[a];
      if(value === null || value === dhx.undefined) {
        value = ""
      }
      t.push(a + "=" + encodeURIComponent(value))
    }
    params = t.join("&")
  }
  params && !this.post && (url = url + (url.indexOf("?") != -1 ? "&" : "?") + params, params = null);
  x.open(this.post ? "POST" : "GET", url, !this._sync);
  this.post && x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var self = this;
  x.onreadystatechange = function() {
    if(!x.readyState || x.readyState == 4) {
      if(call && self) {
        for(var i = 0;i < call.length;i++) {
          call[i] && call[i].call(self.master || self, x.responseText, x.responseXML, x)
        }
      }
      call = self = self.master = null
    }
  };
  x.send(params || null);
  return x
}, get:function(url, params, call) {
  this.post = !1;
  return this.send(url, params, call)
}, post:function(url, params, call) {
  this.post = !0;
  return this.send(url, params, call)
}, sync:function() {
  this._sync = !0;
  return this
}};
dhx.AtomDataLoader = {$init:function(config) {
  this.data = {};
  if(config) {
    this._settings.datatype = config.datatype || "json", this.$ready.push(this._load_when_ready)
  }
}, _load_when_ready:function() {
  this._ready_for_data = !0;
  this._settings.url && this.url_setter(this._settings.url);
  this._settings.data && this.data_setter(this._settings.data)
}, url_setter:function(value) {
  if(!this._ready_for_data) {
    return value
  }
  this.load(value, this._settings.datatype);
  return value
}, data_setter:function(value) {
  if(!this._ready_for_data) {
    return value
  }
  this.parse(value, this._settings.datatype);
  return!0
}, load:function(url, call, JSCompiler_OptimizeArgumentsArray_p0) {
  this.callEvent("onXLS", []);
  typeof call == "string" ? (this.data.driver = dhx.DataDriver[call], call = JSCompiler_OptimizeArgumentsArray_p0) : this.data.driver = dhx.DataDriver.json;
  dhx.ajax(url, [this._onLoad, call], this)
}, parse:function(data, type) {
  this.callEvent("onXLS", []);
  this.data.driver = dhx.DataDriver[type || "json"];
  this._onLoad(data, null)
}, _onLoad:function(text, xml) {
  var driver = this.data.driver, top = driver.getRecords(driver.toObject(text, xml))[0];
  this.data = driver ? driver.getDetails(top) : text;
  this.callEvent("onXLE", [])
}, _check_data_feed:function(data) {
  if(!this._settings.dataFeed || this._ignore_feed || !data) {
    return!0
  }
  var url = this._settings.dataFeed, url = url + (url.indexOf("?") == -1 ? "?" : "&") + "action=get&id=" + encodeURIComponent(data.id || data);
  this.callEvent("onXLS", []);
  dhx.ajax(url, function(text) {
    this._ignore_feed = !0;
    this.setValues(dhx.DataDriver.json.toObject(text)[0]);
    this._ignore_feed = !1;
    this.callEvent("onXLE", [])
  }, this);
  return!1
}};
dhx.DataDriver = {};
dhx.DataDriver.json = {toObject:function(data) {
  data || (data = "[]");
  if(typeof data == "string") {
    eval("dhx.temp=" + data), data = dhx.temp
  }
  if(data.data) {
    var t = data.data;
    t.pos = data.pos;
    t.total_count = data.total_count;
    data = t
  }
  return data
}, getRecords:function(data) {
  return data && !dhx.isArray(data) ? [data] : data
}, getDetails:function(data) {
  return data
}, getInfo:function(data) {
  return{_size:data.total_count || 0, _from:data.pos || 0}
}};
dhx.DataDriver.json_ext = {toObject:function(data) {
  data || (data = "[]");
  if(typeof data == "string") {
    var temp;
    eval("temp=" + data);
    dhx.temp = [];
    for(var header = temp.header, i = 0;i < temp.data.length;i++) {
      for(var item = {}, j = 0;j < header.length;j++) {
        typeof temp.data[i][j] != "undefined" && (item[header[j]] = temp.data[i][j])
      }
      dhx.temp.push(item)
    }
    return dhx.temp
  }
  return data
}, getRecords:function(data) {
  return data && !dhx.isArray(data) ? [data] : data
}, getDetails:function(data) {
  return data
}, getInfo:function(data) {
  return{_size:data.total_count || 0, _from:data.pos || 0}
}};
dhx.DataDriver.html = {toObject:function(data) {
  if(typeof data == "string") {
    var t = null;
    data.indexOf("<") == -1 && (t = dhx.toNode(data));
    if(!t) {
      t = document.createElement("DIV"), t.innerHTML = data
    }
    return t.getElementsByTagName(this.tag)
  }
  return data
}, getRecords:function(data) {
  return data.tagName ? data.childNodes : data
}, getDetails:function(data) {
  return dhx.DataDriver.xml.tagToObject(data)
}, getInfo:function() {
  return{_size:0, _from:0}
}, tag:"LI"};
dhx.DataDriver.jsarray = {toObject:function(data) {
  return typeof data == "string" ? (eval("dhx.temp=" + data), dhx.temp) : data
}, getRecords:function(data) {
  return data
}, getDetails:function(data) {
  for(var result = {}, i = 0;i < data.length;i++) {
    result["data" + i] = data[i]
  }
  return result
}, getInfo:function() {
  return{_size:0, _from:0}
}};
dhx.DataDriver.csv = {toObject:function(data) {
  return data
}, getRecords:function(data) {
  return data.split(this.row)
}, getDetails:function(data) {
  for(var data = this.stringToArray(data), result = {}, i = 0;i < data.length;i++) {
    result["data" + i] = data[i]
  }
  return result
}, getInfo:function() {
  return{_size:0, _from:0}
}, stringToArray:function(data) {
  for(var data = data.split(this.cell), i = 0;i < data.length;i++) {
    data[i] = data[i].replace(/^[ \t\n\r]*(\"|)/g, "").replace(/(\"|)[ \t\n\r]*$/g, "")
  }
  return data
}, row:"\n", cell:","};
dhx.DataDriver.xml = {toObject:function(text, xml) {
  return xml && (xml = this.checkResponse(text, xml)) ? xml : typeof text == "string" ? this.fromString(text) : text
}, getRecords:function(data) {
  return this.xpath(data, this.records)
}, records:"/*/item", getDetails:function(data) {
  return this.tagToObject(data, {})
}, getInfo:function(data) {
  return{_size:data.documentElement.getAttribute("total_count") || 0, _from:data.documentElement.getAttribute("pos") || 0}
}, xpath:function(xml, path) {
  if(window.XPathResult) {
    var node = xml;
    if(xml.nodeName.indexOf("document") == -1) {
      xml = xml.ownerDocument
    }
    for(var res = [], col = xml.evaluate(path, node, null, XPathResult.ANY_TYPE, null), temp = col.iterateNext();temp;) {
      res.push(temp), temp = col.iterateNext()
    }
    return res
  }else {
    var test = !0;
    try {
      typeof xml.selectNodes == "undefined" && (test = !1)
    }catch(e) {
    }
    if(test) {
      return xml.selectNodes(path)
    }else {
      var name = path.split("/").pop();
      return xml.getElementsByTagName(name)
    }
  }
}, tagToObject:function(tag, z) {
  var z = z || {}, flag = !1, a = tag.attributes;
  if(a && a.length) {
    for(var i = 0;i < a.length;i++) {
      z[a[i].name] = a[i].value
    }
    flag = !0
  }
  for(var b = tag.childNodes, state = {}, i = 0;i < b.length;i++) {
    if(b[i].nodeType == 1) {
      var name = b[i].tagName;
      typeof z[name] != "undefined" ? (dhx.isArray(z[name]) || (z[name] = [z[name]]), z[name].push(this.tagToObject(b[i], {}))) : z[b[i].tagName] = this.tagToObject(b[i], {});
      flag = !0
    }
  }
  if(!flag) {
    return this.nodeValue(tag)
  }
  z.value = this.nodeValue(tag);
  return z
}, nodeValue:function(node) {
  return node.firstChild ? node.firstChild.data : ""
}, fromString:function(xmlString) {
  if(window.DOMParser) {
    return(new DOMParser).parseFromString(xmlString, "text/xml")
  }
  if(window.ActiveXObject) {
    var temp = new ActiveXObject("Microsoft.xmlDOM");
    temp.loadXML(xmlString);
    return temp
  }
}, checkResponse:function(text, xml) {
  if(xml && xml.firstChild && xml.firstChild.tagName != "parsererror") {
    return xml
  }
  var a = this.fromString(text.replace(/^[\s]+/, ""));
  if(a) {
    return a
  }
}};
dhx.DataLoader = dhx.proto({$init:function(config) {
  config = config || "";
  name = "DataStore";
  this.data = config.datastore || new dhx.DataStore;
  this._readyHandler = this.data.attachEvent("onStoreLoad", dhx.bind(this._call_onready, this))
}, load:function(url, call) {
  dhx.AtomDataLoader.load.apply(this, arguments);
  if(!this.data.feed) {
    this.data.url = url, this.data.feed = function(from, count) {
      if(this._load_count) {
        return this._load_count = [from, count]
      }else {
        this._load_count = !0
      }
      this.load(url + (url.indexOf("?") == -1 ? "?" : "&") + "start=" + from + "&count=" + count, function() {
        var temp = this._load_count;
        this._load_count = !1;
        typeof temp == "object" ? this.data.feed.apply(this, temp) : this.showItem && this.dataCount() > from + 1 && this.showItem(this.idByIndex(from + 1))
      })
    }
  }
}, loadNext:function(count, start) {
  this.data.feed && this.data.feed.call(this, start || this.dataCount(), count)
}, _onLoad:function(text, xml) {
  this.data._parse(this.data.driver.toObject(text, xml));
  this.callEvent("onXLE", []);
  if(this._readyHandler) {
    this.data.detachEvent(this._readyHandler), this._readyHandler = null
  }
}, scheme_setter:function(value) {
  this.data.scheme(value)
}, dataFeed_setter:function(value$$0) {
  this.data.attachEvent("onBeforeFilter", dhx.bind(function(text, value) {
    if(this._settings.dataFeed) {
      var filter = {};
      if(text || filter) {
        if(typeof text == "function") {
          if(!value) {
            return
          }
          text(value, filter)
        }else {
          filter = {text:value}
        }
        this.clearAll();
        var url = this._settings.dataFeed, urldata = [], key;
        for(key in filter) {
          urldata.push("dhx_filter[" + key + "]=" + encodeURIComponent(filter[key]))
        }
        this.load(url + (url.indexOf("?") < 0 ? "?" : "&") + urldata.join("&"), this._settings.datatype);
        return!1
      }
    }
  }, this));
  return value$$0
}, _call_onready:function() {
  if(this._settings.ready) {
    var code = dhx.toFunctor(this._settings.ready);
    code && code.call && code.apply(this, arguments)
  }
}}, dhx.AtomDataLoader).prototype;
dhx.DataStore = function() {
  this.name = "DataStore";
  dhx.extend(this, dhx.EventSystem);
  this.setDriver("xml");
  this.pull = {};
  this.order = dhx.toArray()
};
dhx.DataStore.prototype = {setDriver:function(type) {
  this.driver = dhx.DataDriver[type]
}, _parse:function(data) {
  this.callEvent("onParse", [this.driver, data]);
  this._filter_order && this.filter();
  var info = this.driver.getInfo(data), recs = this.driver.getRecords(data), from = (info._from || 0) * 1;
  if(from === 0 && this.order[0]) {
    from = this.order.length
  }
  for(var j = 0, i = 0;i < recs.length;i++) {
    var temp = this.driver.getDetails(recs[i]), id = this.id(temp);
    this.pull[id] || (this.order[j + from] = id, j++);
    this.pull[id] = temp;
    this.extraParser && this.extraParser(temp);
    this._scheme && (this._scheme.$init ? this._scheme.$init(temp) : this._scheme.$update && this._scheme.$update(temp))
  }
  if(!this.order[info._size - 1]) {
    this.order[info._size - 1] = dhx.undefined
  }
  this.callEvent("onStoreLoad", [this.driver, data]);
  this.refresh()
}, id:function(data) {
  return data.id || (data.id = dhx.uid())
}, changeId:function(old, newid) {
  this.pull[newid] = this.pull[old];
  this.pull[newid].id = newid;
  this.order[this.order.find(old)] = newid;
  this._filter_order && (this._filter_order[this._filter_order.find(old)] = newid);
  this.callEvent("onIdChange", [old, newid]);
  this._render_change_id && this._render_change_id(old, newid);
  delete this.pull[old]
}, item:function(id) {
  return this.pull[id]
}, update:function(id, data) {
  this._scheme && this._scheme.$update && this._scheme.$update(data);
  if(this.callEvent("onBeforeUpdate", [id, data]) === !1) {
    return!1
  }
  this.pull[id] = data;
  this.refresh(id)
}, refresh:function(id) {
  this._skip_refresh || (id ? this.callEvent("onStoreUpdated", [id, this.pull[id], "update"]) : this.callEvent("onStoreUpdated", [null, null, null]))
}, silent:function(code, master) {
  this._skip_refresh = !0;
  code.call(master || this);
  this._skip_refresh = !1
}, getRange:function(from, to) {
  from = from ? this.indexById(from) : this.startOffset || 0;
  to ? to = this.indexById(to) : (to = Math.min(this.endOffset || Infinity, this.dataCount() - 1), to < 0 && (to = 0));
  if(from > to) {
    var a = to, to = from, from = a
  }
  return this.getIndexRange(from, to)
}, getIndexRange:function(from, to) {
  for(var to = Math.min(to || Infinity, this.dataCount() - 1), ret = dhx.toArray(), i = from || 0;i <= to;i++) {
    ret.push(this.item(this.order[i]))
  }
  return ret
}, dataCount:function() {
  return this.order.length
}, exists:function(id) {
  return!!this.pull[id]
}, move:function(sindex, tindex) {
  if(!(sindex < 0 || tindex < 0)) {
    var id = this.idByIndex(sindex), obj = this.item(id);
    this.order.removeAt(sindex);
    this.order.insertAt(id, Math.min(this.order.length, tindex));
    this.callEvent("onStoreUpdated", [id, obj, "move"])
  }
}, scheme:function(config) {
  this._scheme = config
}, sync:function(source, filter, silent) {
  typeof filter != "function" && (silent = filter, filter = null);
  if(dhx.debug_bind) {
    this.debug_sync_master = source
  }
  if(source.name != "DataStore") {
    source = source.data
  }
  var sync_logic = dhx.bind(function() {
    this.order = dhx.toArray([].concat(source.order));
    this._filter_order = null;
    this.pull = source.pull;
    filter && this.silent(filter);
    this._on_sync && this._on_sync();
    silent ? silent = !1 : this.refresh()
  }, this);
  source.attachEvent("onStoreUpdated", sync_logic);
  sync_logic()
}, add:function(obj, index) {
  if(this._scheme) {
    var obj = obj || {}, key;
    for(key in this._scheme) {
      obj[key] = obj[key] || this._scheme[key]
    }
    this._scheme.$init ? this._scheme.$init(obj) : this._scheme.$update && this._scheme.$update(obj)
  }
  var id = this.id(obj), data_size = this.dataCount();
  if(dhx.isNotDefined(index) || index < 0) {
    index = data_size
  }
  index > data_size && (index = Math.min(this.order.length, index));
  if(this.callEvent("onBeforeAdd", [id, obj, index]) === !1) {
    return!1
  }
  if(this.exists(id)) {
    return null
  }
  this.pull[id] = obj;
  this.order.insertAt(id, index);
  if(this._filter_order) {
    var original_index = this._filter_order.length;
    !index && this.order.length && (original_index = 0);
    this._filter_order.insertAt(id, original_index)
  }
  this.callEvent("onafterAdd", [id, index]);
  this.callEvent("onStoreUpdated", [id, obj, "add"]);
  return id
}, remove:function(id) {
  if(dhx.isArray(id)) {
    for(var i = 0;i < id.length;i++) {
      this.remove(id[i])
    }
  }else {
    if(this.callEvent("onBeforeDelete", [id]) === !1) {
      return!1
    }
    if(!this.exists(id)) {
      return null
    }
    var obj = this.item(id);
    this.order.remove(id);
    this._filter_order && this._filter_order.remove(id);
    delete this.pull[id];
    this.callEvent("onafterdelete", [id]);
    this.callEvent("onStoreUpdated", [id, obj, "delete"])
  }
}, clearAll:function() {
  this.pull = {};
  this.order = dhx.toArray();
  this._filter_order = null;
  this.callEvent("onClearAll", []);
  this.refresh()
}, idByIndex:function(index) {
  return this.order[index]
}, indexById:function(id) {
  var res = this.order.find(id);
  return res
}, next:function(id, step) {
  return this.order[this.indexById(id) + (step || 1)]
}, first:function() {
  return this.order[0]
}, last:function() {
  return this.order[this.order.length - 1]
}, previous:function(id, step) {
  return this.order[this.indexById(id) - (step || 1)]
}, sort:function(by, dir, as) {
  var sort = by;
  typeof by == "function" ? sort = {as:by, dir:dir} : typeof by == "string" && (sort = {by:by, dir:dir, as:as});
  var parameters = [sort.by, sort.dir, sort.as];
  if(this.callEvent("onbeforesort", parameters)) {
    if(this.order.length) {
      var sorter = dhx.sort.create(sort), neworder = this.getRange(this.first(), this.last());
      neworder.sort(sorter);
      this.order = neworder.map(function(obj) {
        return this.id(obj)
      }, this)
    }
    this.refresh();
    this.callEvent("onaftersort", parameters)
  }
}, filter:function(text, value$$0, preserve) {
  if(this.callEvent("onBeforeFilter", [text, value$$0])) {
    if(this._filter_order && !preserve) {
      this.order = this._filter_order, delete this._filter_order
    }
    if(this.order.length) {
      if(text) {
        var filter = text, value$$0 = value$$0 || "";
        typeof text == "string" && (text = dhx.Template(text), value$$0 = value$$0.toString().toLowerCase(), filter = function(obj, value) {
          return text(obj).toLowerCase().indexOf(value) != -1
        });
        for(var neworder = dhx.toArray(), i = 0;i < this.order.length;i++) {
          var id = this.order[i];
          filter(this.item(id), value$$0) && neworder.push(id)
        }
        if(!preserve) {
          this._filter_order = this.order
        }
        this.order = neworder
      }
      this.refresh();
      this.callEvent("onAfterFilter", [])
    }
  }
}, each:function(method, master) {
  for(var i = 0;i < this.order.length;i++) {
    method.call(master || this, this.item(this.order[i]))
  }
}, provideApi:function(target, eventable) {
  this.debug_bind_master = target;
  eventable && this.mapEvent({onbeforesort:target, onaftersort:target, onbeforeadd:target, onafteradd:target, onbeforedelete:target, onafterdelete:target, onbeforeupdate:target});
  for(var list = "sort,add,remove,exists,idByIndex,indexById,item,update,refresh,dataCount,filter,next,previous,clearAll,first,last,serialize,sync".split(","), i = 0;i < list.length;i++) {
    target[list[i]] = dhx.methodPush(this, list[i])
  }
}, serialize:function() {
  for(var ids = this.order, result = [], i = 0;i < ids.length;i++) {
    result.push(this.pull[ids[i]])
  }
  return result
}};
dhx.sort = {create:function(config) {
  return dhx.sort.dir(config.dir, dhx.sort.by(config.by, config.as))
}, as:{"int":function(a, b) {
  a *= 1;
  b *= 1;
  return a > b ? 1 : a < b ? -1 : 0
}, string_strict:function(a, b) {
  a = a.toString();
  b = b.toString();
  return a > b ? 1 : a < b ? -1 : 0
}, string:function(a, b) {
  a = a.toString().toLowerCase();
  b = b.toString().toLowerCase();
  return a > b ? 1 : a < b ? -1 : 0
}}, by:function(prop, method) {
  if(!prop) {
    return method
  }
  typeof method != "function" && (method = dhx.sort.as[method || "string"]);
  prop = dhx.Template(prop);
  return function(a, b) {
    return method(prop(a), prop(b))
  }
}, dir:function(prop, method) {
  return prop == "asc" ? method : function(a, b) {
    return method(a, b) * -1
  }
}};
dhx.BaseBind = {bind:function(target, rule, format) {
  typeof target == "string" && (target = dhx.ui.get(target));
  target._initBindSource && target._initBindSource();
  this._initBindSource && this._initBindSource();
  target.getBindData || dhx.extend(target, dhx.BindSource);
  if(!this._bind_ready) {
    var old_render = this.render;
    if(this.filter) {
      var key = this._settings.id;
      this.data._on_sync = function() {
        target._bind_updated[key] = !1
      }
    }
    this.render = function() {
      if(!this._in_bind_processing) {
        return this._in_bind_processing = !0, this.callEvent("onBindRequest"), this._in_bind_processing = !1, old_render.call(this)
      }
    };
    if(this.getValue || this.getValues) {
      this.save = function() {
        if(!this.validate || this.validate()) {
          target.setBindData(this.getValue ? this.getValue : this.getValues(), this._settings.id)
        }
      }
    }
    this._bind_ready = !0
  }
  target.addBind(this._settings.id, rule, format);
  this.attachEvent(this.touchable ? "onAfterRender" : "onBindRequest", function() {
    target.getBindData(this._settings.id)
  });
  this.isVisible(this._settings.id) && this.refresh()
}};
dhx.BindSource = {$init:function() {
  this._bind_hash = {};
  this._bind_updated = {};
  this._ignore_binds = {};
  this._bind_specific_rules(this)
}, setBindData:function(data, key) {
  key && (this._ignore_binds[key] = !0);
  if(this.setValue) {
    this.setValue(data)
  }else {
    if(this.setValues) {
      this.setValues(data)
    }else {
      var id = this.getCursor();
      id && (data = dhx.extend(this.item(id), data, !0), this.update(id, data))
    }
  }
  this.callEvent("onBindUpdate", [data, key]);
  this.save && this.save();
  key && (this._ignore_binds[key] = !1)
}, getBindData:function(key, update) {
  if(!this._bind_updated[key]) {
    var target = dhx.ui.get(key);
    target.isVisible(target._settings.id) && (this._bind_updated[key] = !0, this._bind_update(target, this._bind_hash[key][0], this._bind_hash[key][1]), update && target.filter && target.refresh())
  }
}, addBind:function(source, rule, format) {
  this._bind_hash[source] = [rule, format]
}, _bind_specific_rules:function(obj) {
  obj.filter ? dhx.extend(this, dhx.CollectionBind) : obj.setValue ? dhx.extend(this, dhx.ValueBind) : dhx.extend(this, dhx.RecordBind)
}, _update_binds:function() {
  for(var key in this._bind_hash) {
    this._ignore_binds[key] || (this._bind_updated[key] = !1, this.getBindData(key, !0))
  }
}, _bind_update_common:function(target, rule, data) {
  target.setValue ? target.setValue(data ? data[rule] : data) : target.filter ? target.data.silent(function() {
    this.filter(rule, data)
  }) : !data && target.clear ? target.clear() : target._check_data_feed(data) && target.setValues(dhx.copy(data))
}};
dhx.DataValue = dhx.proto({name:"DataValue", isVisible:function() {
  return!0
}, $init:function(config) {
  var id = (this.data = config) && config.id ? config.id : dhx.uid();
  this._settings = {id:id};
  dhx.ui.views[id] = this
}, setValue:function(value) {
  this.data = value;
  this.callEvent("onChange", [value])
}, getValue:function() {
  return this.data
}, refresh:function() {
  this.callEvent("onBindRequest")
}}, dhx.EventSystem, dhx.BaseBind);
dhx.DataRecord = dhx.proto({name:"DataRecord", isVisible:function() {
  return!0
}, $init:function(config) {
  this.data = config || {};
  var id = config && config.id ? config.id : dhx.uid();
  this._settings = {id:id};
  dhx.ui.views[id] = this
}, getValues:function() {
  return this.data
}, setValues:function(data) {
  this.data = data;
  this.callEvent("onChange", [data])
}, refresh:function() {
  this.callEvent("onBindRequest")
}}, dhx.EventSystem, dhx.BaseBind);
dhx.DataCollection = dhx.proto({name:"DataCollection", isVisible:function() {
  return!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed ? !1 : !0
}, $init:function(config) {
  this.data.provideApi(this, !0);
  var id = config && config.id ? config.id : dhx.uid();
  this._settings.id = id;
  dhx.ui.views[id] = this;
  this.data.attachEvent("onStoreLoad", dhx.bind(function() {
    this.callEvent("onBindRequest", [])
  }, this))
}, refresh:function() {
  this.callEvent("onBindRequest", [])
}}, dhx.EventSystem, dhx.DataLoader, dhx.BaseBind, dhx.Settings);
dhx.ValueBind = {$init:function() {
  this.attachEvent("onChange", this._update_binds)
}, _bind_update:function(target, rule, format) {
  var data = this.getValue() || "";
  format && (data = format(data));
  if(target.setValue) {
    target.setValue(data)
  }else {
    if(target.filter) {
      target.data.silent(function() {
        this.filter(rule, data)
      })
    }else {
      var pod = {};
      pod[rule] = data;
      target._check_data_feed(data) && target.setValues(pod)
    }
  }
}};
dhx.RecordBind = {$init:function() {
  this.attachEvent("onChange", this._update_binds)
}, _bind_update:function(target, rule) {
  var data = this.getValues() || null;
  this._bind_update_common(target, rule, data)
}};
dhx.CollectionBind = {$init:function() {
  this._cursor = null;
  this.attachEvent("onSelectChange", function() {
    this.setCursor(this.getSelected())
  });
  this.attachEvent("onAfterCursorChange", this._update_binds);
  this.data.attachEvent("onStoreUpdated", dhx.bind(function(id) {
    id && id == this.getCursor() && this._update_binds()
  }, this));
  this.data.attachEvent("onClearAll", dhx.bind(function() {
    this._cursor = null
  }, this));
  this.data.attachEvent("onIdChange", dhx.bind(function(oldid, newid) {
    if(this._cursor == oldid) {
      this._cursor = newid
    }
  }, this))
}, setCursor:function(id) {
  if(id != this._cursor && this.item(id)) {
    this.callEvent("onBeforeCursorChange", [this._cursor]), this._cursor = id, this.callEvent("onAfterCursorChange", [id])
  }
}, getCursor:function() {
  return this._cursor
}, _bind_update:function(target, rule) {
  var data = this.item(this.getCursor()) || null;
  this._bind_update_common(target, rule, data)
}};
if(!dhx.ui.views) {
  dhx.ui.views = {}, dhx.ui.get = function(id) {
    return id._settings ? id : dhx.ui.views[id]
  }
}
dhtmlXDataStore = function(config) {
  var obj = new dhx.DataCollection(config), name$$0 = "_dp_init";
  obj[name$$0] = function(dp) {
    var varname = "_methods";
    dp[varname] = ["dummy", "dummy", "changeId", "dummy"];
    this.data._old_names = {add:"inserted", update:"updated", "delete":"deleted"};
    this.data.attachEvent("onStoreUpdated", function(id, data, mode) {
      id && !dp._silent && dp.setUpdated(id, !0, this._old_names[mode])
    });
    varname = "_getRowData";
    dp[varname] = function(id) {
      var ev = this.obj.data.item(id), data = {id:id, "!nativeeditor_status":this.obj.getUserData(id)};
      if(ev) {
        for(var a in ev) {
          a.indexOf("_") !== 0 && (data[a] = ev[a])
        }
      }
      return data
    };
    this.changeId = function(oldid, newid) {
      this.data.changeId(oldid, newid);
      dp._silent = !0;
      this.data.callEvent("onStoreUpdated", [newid, this.item(newid), "update"]);
      dp._silent = !1
    };
    varname = "_clearUpdateFlag";
    dp[varname] = function() {
    };
    this._userdata = {}
  };
  obj.dummy = function() {
  };
  obj.setUserData = function(id, name, value) {
    this._userdata[id] = value
  };
  obj.getUserData = function(id) {
    return this._userdata[id]
  };
  return obj
};
if(window.dhtmlXDataView) {
  dhtmlXDataView.prototype._initBindSource = function() {
    this.isVisible = function() {
      return!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed ? !1 : !0
    };
    if(!this._settings.id) {
      this._settings.id = dhx.uid()
    }
    dhx.ui.views[this._settings.id] = this
  }
}
if(window.dhtmlXChart) {
  dhtmlXChart.prototype._initBindSource = function() {
    this.isVisible = function() {
      return!this.data.order.length && !this.data._filtered_state && !this._settings.dataFeed ? !1 : !0
    };
    if(!this._settings.id) {
      this._settings.id = dhx.uid()
    }
    dhx.ui.views[this._settings.id] = this
  }
}
dhx.BaseBind.legacyBind = function() {
  return dhx.BaseBind.bind.apply(this, arguments)
};
dhx.BaseBind.legacySync = function(source, rule) {
  this._initBindSource && this._initBindSource();
  source._initBindSource && source._initBindSource();
  this.attachEvent("onAfterEditStop", function(id) {
    this.save(id);
    return!0
  });
  this.save = function(id) {
    id || (id = this.getCursor());
    var sobj = this.item(id), tobj = source.item(id), key;
    for(key in sobj) {
      key.indexOf("$") !== 0 && (tobj[key] = sobj[key])
    }
    source.refresh(id)
  };
  return this.data.sync.apply(this.data, arguments)
};
if(window.dhtmlXForm) {
  dhtmlXForm.prototype.bind = function() {
    dhx.BaseBind.bind.apply(this, arguments)
  }, dhtmlXForm.prototype._initBindSource = function() {
    if(dhx.isNotDefined(this._settings)) {
      this._settings = {id:dhx.uid(), dataFeed:this._server_feed}, dhx.ui.views[this._settings.id] = this
    }
  }, dhtmlXForm.prototype._check_data_feed = function(data) {
    if(!this._settings.dataFeed || this._ignore_feed || !data) {
      return!0
    }
    var url = this._settings.dataFeed, url = url + (url.indexOf("?") == -1 ? "?" : "&") + "action=get&id=" + encodeURIComponent(data.id || data);
    this.load(url);
    return!1
  }, dhtmlXForm.prototype.setValues = dhtmlXForm.prototype.setFormData, dhtmlXForm.prototype.getValues = function() {
    return this.getFormData(!1, !0)
  }, dhtmlXForm.prototype.dataFeed = function(value) {
    this._settings ? this._settings.dataFeed = value : this._server_feed = value
  }, dhtmlXForm.prototype.refresh = dhtmlXForm.prototype.isVisible = function() {
    return!0
  }
}
if(window.dhtmlXCombo) {
  dhtmlXCombo.prototype.bind = function() {
    dhx.BaseBind.bind.apply(this, arguments)
  }, dhtmlXCombo.prototype.dataFeed = function(value) {
    this._settings ? this._settings.dataFeed = value : this._server_feed = value
  }, dhtmlXCombo.prototype.sync = function(source) {
    this._initBindSource && this._initBindSource();
    source._initBindSource && source._initBindSource();
    var combo = this, insync = function() {
      combo.clearAll();
      combo.addOption(this.serialize())
    };
    source.data.attachEvent("onStoreUpdated", function() {
      insync.call(this)
    });
    source.data.attachEvent("onIdChange", function(oldid, newid) {
      combo.changeOptionId(oldid, newid)
    });
    insync.call(source)
  }, dhtmlXCombo.prototype._initBindSource = function() {
    if(dhx.isNotDefined(this._settings)) {
      this._settings = {id:dhx.uid(), dataFeed:this._server_feed}, dhx.ui.views[this._settings.id] = this, this.data = {silent:dhx.bind(function(code) {
        code.call(this)
      }, this)}, dhtmlxEventable(this.data), this.attachEvent("onChange", function() {
        this.callEvent("onSelectChange", [this.getSelectedValue()])
      }), this.attachEvent("onXLE", function() {
        this.callEvent("onBindRequest", [])
      })
    }
  }, dhtmlXCombo.prototype.item = function() {
    return this._selOption
  }, dhtmlXCombo.prototype.getSelected = function() {
    return this.getSelectedValue()
  }, dhtmlXCombo.prototype.isVisible = function() {
    return!this.optionsArr.length && !this._settings.dataFeed ? !1 : !0
  }, dhtmlXCombo.prototype.refresh = function() {
    this.render(!0)
  }, dhtmlXCombo.prototype.filter = function() {
    alert("not implemented")
  }
}
if(window.dhtmlXGridObject) {
  dhtmlXGridObject.prototype.bind = function(source, rule, format) {
    dhx.BaseBind.bind.apply(this, arguments)
  }, dhtmlXGridObject.prototype.dataFeed = function(value) {
    this._settings ? this._settings.dataFeed = value : this._server_feed = value
  }, dhtmlXGridObject.prototype.sync = function(source, rule) {
    this._initBindSource && this._initBindSource();
    source._initBindSource && source._initBindSource();
    var grid = this, parsing = "_parsing", parser = "_parser", locator = "_locator", parser_func = "_process_store_row", locator_func = "_get_store_data";
    this.save = function(id) {
      id || (id = this.getCursor());
      dhx.extend(source.item(id), this.item(id), !0);
      source.refresh(id)
    };
    var insync = function(ignore) {
      var from = 0;
      grid._legacy_ignore_next ? (from = grid._legacy_ignore_next, grid._legacy_ignore_next = !1) : grid.clearAll();
      if(ignore !== -1) {
        var count = this.dataCount();
        if(count) {
          grid[parsing] = !0;
          for(var i = from;i < count;i++) {
            var id = this.order[i];
            if(id && (!from || !grid.rowsBuffer[i])) {
              grid.rowsBuffer[i] = {idd:id, data:this.pull[id]}, grid.rowsBuffer[i][parser] = grid[parser_func], grid.rowsBuffer[i][locator] = grid[locator_func], grid.rowsAr[id] = this.pull[id]
            }
          }
          if(!grid.rowsBuffer[count - 1]) {
            grid.rowsBuffer[count - 1] = dhtmlx.undefined, grid.xmlFileUrl = grid.xmlFileUrl || !0
          }
          grid.pagingOn ? grid.changePage() : grid._srnd && grid._fillers ? grid._update_srnd_view() : (grid.render_dataset(), grid.callEvent("onXLE", []));
          grid[parsing] = !1
        }
      }
    };
    source.data.attachEvent("onStoreUpdated", function(id, data, mode) {
      mode == "delete" ? (grid.deleteRow(id), grid.data.callEvent("onStoreUpdated", [id, data, mode])) : mode == "update" ? (grid.callEvent("onSyncUpdate", [data, mode]), grid.update(id, data), grid.data.callEvent("onStoreUpdated", [id, data, mode])) : mode == "add" ? (grid.callEvent("onSyncUpdate", [data, mode]), grid.add(id, data), grid.data.callEvent("onStoreUpdated", [id, data, mode])) : insync.call(this)
    });
    source.data.attachEvent("onStoreLoad", function(driver, data) {
      grid.xmlFileUrl = source.data.url;
      grid._legacy_ignore_next = driver.getInfo(data)._from
    });
    source.data.attachEvent("onIdChange", function(oldid, newid) {
      grid.changeRowId(oldid, newid)
    });
    insync(-1);
    grid.attachEvent("onEditCell", function(stage, id) {
      stage == 2 && this.save(id);
      return!0
    });
    grid.attachEvent("onDynXLS", function(start, count) {
      for(var i = start;i < start + count;i++) {
        if(!source.data.order[i]) {
          return source.loadNext(count, start), !1
        }
      }
      grid._legacy_ignore_next = start;
      insync()
    });
    grid.attachEvent("onClearAll", function() {
      var name = "_f_rowsBuffer";
      this[name] = null
    });
    rule && rule.sort && grid.attachEvent("onBeforeSorting", function(ind, type, dir) {
      if(type == "connector") {
        return!1
      }
      var id = this.getColumnId(ind);
      source.sort("#" + id + "#", dir == "asc" ? "asc" : "desc", type == "int" ? type : "string");
      grid.setSortImgState(!0, ind, dir);
      return!1
    });
    rule && rule.filter && grid.attachEvent("onFilterStart", function(cols, values) {
      var name = "_con_f_used";
      if(grid[name] && grid[name].length) {
        return!1
      }
      source.data.silent(function() {
        source.filter();
        for(var i = 0;i < cols.length;i++) {
          if(values[i] != "") {
            var id = grid.getColumnId(cols[i]);
            source.filter("#" + id + "#", values[i], i != 0)
          }
        }
      });
      source.refresh();
      return!1
    });
    grid.clearAndLoad = function(url) {
      source.clearAll();
      source.load(url)
    }
  }, dhtmlXGridObject.prototype._initBindSource = function() {
    if(dhx.isNotDefined(this._settings)) {
      this._settings = {id:dhx.uid(), dataFeed:this._server_feed};
      dhx.ui.views[this._settings.id] = this;
      this.data = {silent:dhx.bind(function(code) {
        code.call(this)
      }, this)};
      dhtmlxEventable(this.data);
      for(var name = "_cCount", i = 0;i < this[name];i++) {
        this.columnIds[i] || (this.columnIds[i] = "cell" + i)
      }
      this.attachEvent("onSelectStateChanged", function(id) {
        this.callEvent("onSelectChange", [id])
      });
      this.attachEvent("onSelectionCleared", function() {
        this.callEvent("onSelectChange", [null])
      });
      this.attachEvent("onEditCell", function(stage, rId) {
        stage === 2 && this.getCursor && rId && rId == this.getCursor() && this._update_binds();
        return!0
      });
      this.attachEvent("onXLE", function() {
        this.callEvent("onBindRequest", [])
      })
    }
  }, dhtmlXGridObject.prototype.item = function(id) {
    if(id === null) {
      return null
    }
    var source = this.getRowById(id);
    if(!source) {
      return null
    }
    var name = "_attrs", data = dhx.fullCopy(source[name]);
    data.id = id;
    for(var length = this.getColumnsNum(), i = 0;i < length;i++) {
      data[this.columnIds[i]] = this.cells(id, i).getValue()
    }
    return data
  }, dhtmlXGridObject.prototype.update = function(id, data) {
    for(var i = 0;i < this.columnIds.length;i++) {
      var key = this.columnIds[i];
      dhx.isNotDefined(data[key]) || this.cells(id, i).setValue(data[key])
    }
    var name = "_attrs", attrs = this.getRowById(id)[name];
    for(key in data) {
      attrs[key] = data[key]
    }
  }, dhtmlXGridObject.prototype.add = function(id, data) {
    for(var ar_data = [], i = 0;i < this.columnIds.length;i++) {
      var key = this.columnIds[i];
      ar_data[i] = dhx.isNotDefined(data[key]) ? "" : data[key]
    }
    this.addRow(id, ar_data, 0);
    var name = "_attrs";
    this.getRowById(id)[name] = dhx.fullCopy(data)
  }, dhtmlXGridObject.prototype.getSelected = function() {
    return this.getSelectedRowId()
  }, dhtmlXGridObject.prototype.isVisible = function() {
    var name = "_f_rowsBuffer";
    return!this.rowsBuffer.length && !this[name] && !this._settings.dataFeed ? !1 : !0
  }, dhtmlXGridObject.prototype.refresh = function() {
    this.render_dataset()
  }, dhtmlXGridObject.prototype.filter = function(callback, master) {
    if(this._settings.dataFeed) {
      var filter = {};
      if(!callback && !master) {
        return
      }
      if(typeof callback == "function") {
        if(!master) {
          return
        }
        callback(master, filter)
      }else {
        dhx.isNotDefined(callback) ? filter = master : filter[callback] = master
      }
      this.clearAll();
      var url = this._settings.dataFeed, urldata = [], key;
      for(key in filter) {
        urldata.push("dhx_filter[" + key + "]=" + encodeURIComponent(filter[key]))
      }
      this.load(url + (url.indexOf("?") < 0 ? "?" : "&") + urldata.join("&"));
      return!1
    }
    if(master === null) {
      return this.filterBy(0, function() {
        return!1
      })
    }
    this.filterBy(0, function(value, id) {
      return callback.call(this, id, master)
    })
  }
}
if(window.dhtmlXTreeObject) {
  dhtmlXTreeObject.prototype.bind = function() {
    dhx.BaseBind.bind.apply(this, arguments)
  }, dhtmlXTreeObject.prototype.dataFeed = function(value) {
    this._settings ? this._settings.dataFeed = value : this._server_feed = value
  }, dhtmlXTreeObject.prototype._initBindSource = function() {
    if(dhx.isNotDefined(this._settings)) {
      this._settings = {id:dhx.uid(), dataFeed:this._server_feed}, dhx.ui.views[this._settings.id] = this, this.data = {silent:dhx.bind(function(code) {
        code.call(this)
      }, this)}, dhtmlxEventable(this.data), this.attachEvent("onSelect", function(id) {
        this.callEvent("onSelectChange", [id])
      }), this.attachEvent("onEdit", function(stage, rId) {
        stage === 2 && rId && rId == this.getCursor() && this._update_binds();
        return!0
      })
    }
  }, dhtmlXTreeObject.prototype.item = function(id) {
    return id === null ? null : {id:id, text:this.getItemText(id)}
  }, dhtmlXTreeObject.prototype.getSelected = function() {
    return this.getSelectedItemId()
  }, dhtmlXTreeObject.prototype.isVisible = function() {
    return!0
  }, dhtmlXTreeObject.prototype.refresh = function() {
  }, dhtmlXTreeObject.prototype.filter = function(callback, master) {
    if(this._settings.dataFeed) {
      var filter = {};
      if(callback || master) {
        if(typeof callback == "function") {
          if(!master) {
            return
          }
          callback(master, filter)
        }else {
          dhx.isNotDefined(callback) ? filter = master : filter[callback] = master
        }
        this.deleteChildItems(0);
        var url = this._settings.dataFeed, urldata = [], key;
        for(key in filter) {
          urldata.push("dhx_filter[" + key + "]=" + encodeURIComponent(filter[key]))
        }
        this.loadXML(url + (url.indexOf("?") < 0 ? "?" : "&") + urldata.join("&"));
        return!1
      }
    }
  }, dhtmlXTreeObject.prototype.update = function(id, data) {
    dhx.isNotDefined(data.text) || this.setItemText(id, data.text)
  }
}
;
