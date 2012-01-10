/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 /*! class for cells style control
 **/
function SpreadSheetCss() {
	this.rules = {
		bold: "false",
		italic: "false",
		color: "000000",
		bgcolor: "ffffff",
		align: "left"
	};
}

SpreadSheetCss.prototype = {

	/*! set rule
	 *	@param name
	 *		rule name
	 *	@param value
	 *		rule value
	 **/
	set: function(name, value) {
		this.rules[name] = value;
	},

	/*! returns rule by name
	 *	@param name
	 *		rule name
	 *	@return
	 *		value if exists or false otherwise
	 **/
	get: function(name) {
		if (this.rules[name])
			return this.rules[name];
		else
			return false;
	},

	/*! returns rules as object
	 **/
	get_json: function() {
		return this.rules;
	},


	set_json: function(rules) {
		this.rules = rules;
	},

	get_css: function() {
		var css = '';
		for (var i in this.rules)
			css += this[i + "_to_css"](this.rules[i]);

		return css;
	},

	bold_to_css: function(value) {
		if (value == "true")
			return "font-weight: bold;";
		else
			return "font-weight: normal;";
	},

	italic_to_css: function(value) {
		if (value == "true")
			return "font-style: italic;";
		else
			return "font-style: normal;";
	},

	bgcolor_to_css: function(value) {
		return "background-color: #" + value + ";";
	},
	align_to_css: function(value) {
		return "text-align: " + value + ";";
	},
	color_to_css: function(value){
		return "color:#"+value+";";
	},

	serialize: function() {
		var style = [];
		for (var i in this.rules)
			style.push(i + ":" + this.rules[i]);
		return style.join(";");
	},
	unserialize: function(style) {
		style = style.split(';');
		for (var i = 0; i < style.length; i++) {
			var rule = style[i].split(':');
			this.rules[rule[0]] = rule[1];
		}
	}
};