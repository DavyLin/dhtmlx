/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 function dhtmlxSpreadSheet(obj) {
	this.settings = {
		version: '1.0',
		init_instantly: false,
		sheet: obj.sheet || null,
		cols: 26,
		rows: 50,
		show_row_numbers: true,
		show_export_buttons: true,
		fullscreen: false,
//		method: 'jsonp', // ajax
		method: 'ajax',
		// addition parameter for toolbar settings
		// always should be true
		ever: true,
		column_width: 64,
		left_width: 40,
		skin: obj.skin||"dhx_skyblue",
		load_url: obj.load,
		save_url: obj.save,
		icons_path: obj.icons_path || "./codebase/imgs/icons",
		image_path: obj.image_path || "./codebase/imgs/",
		math: (typeof(obj.math) !== 'undefined') ? obj.math : false,
		key: null,
		styles: [],
		timeout: 500,
		export_pdf_url: 'http://dhtmlxgrid.appspot.com/export/pdf',
		export_excel_url: 'http://dhtmlxgrid.appspot.com/export/excel',
		defaults: {
			rows: 50,
			cols: 26,
			show_row_numbers: true,
			show_export_buttons: true
		}
	};

	/*! parameter 'show' shows which of items
	 *	can be shown in toolbar
	 *	show='opt1,!opt2,opt3' means condition:
	 *	show='ever' - show independece of parameters
	 *	(this.settings.opt1 == true) && (this.settings.opt2 != true) && (this.settings.opt3 == true)
	 **/
	this.settings.defaults.toolbar_items = [
		{type: "buttonTwoState", id: "bold", text: "Bold", img: "bold.png", pressed: false, tooltip: "Bold text", show: '!read_only'},
		{type: "buttonTwoState", id: "italic", text: "Italic", img: "italic.png", pressed: false, tooltip: "Italic text", show: '!read_only'},
		{type: "buttonSelect", id: "topcolor", text: "Color", img: "colors/color_000000.png", tooltip: "Text color", show: '!read_only', options: [
			{id: "color__000000", type: "obj", text: "Black", img: 'colors/color_000000.png'},
			{id: "color__ffffff", type: "obj", text: "White", img: 'colors/color_ffffff.png'},
			{id: "color__ff0000", type: "obj", text: "Red", img: 'colors/color_ff0000.png'},
			{id: "color__ffc000", type: "obj", text: "Orange", img: 'colors/color_ffc000.png'},
			{id: "color__ffff00", type: "obj", text: "Yellow", img: 'colors/color_ffff00.png'},
			{id: "color__92d050", type: "obj", text: "LightGreen", img: 'colors/color_92d050.png'},
			{id: "color__00b050", type: "obj", text: "Green", img: 'colors/color_00b050.png'},
			{id: "color__00b0f0", type: "obj", text: "LightBlue", img: 'colors/color_00b0f0.png'},
			{id: "color__0070c0", type: "obj", text: "Blue", img: 'colors/color_0070c0.png'}
		]},
		{type: "buttonSelect", id: "topbgcolor", text: "Background", img: "colors/color_ffffff.png", tooltip: "Background color", show: '!read_only', options: [
			{id: "bgcolor__000000", type: "obj", text: "Black", img: 'colors/color_000000.png'},
			{id: "bgcolor__ffffff", type: "obj", text: "White", img: 'colors/color_ffffff.png'},
			{id: "bgcolor__ff0000", type: "obj", text: "Red", img: 'colors/color_ff0000.png'},
			{id: "bgcolor__ffc000", type: "obj", text: "Orange", img: 'colors/color_ffc000.png'},
			{id: "bgcolor__ffff00", type: "obj", text: "Yellow", img: 'colors/color_ffff00.png'},
			{id: "bgcolor__92d050", type: "obj", text: "LightGreen", img: 'colors/color_92d050.png'},
			{id: "bgcolor__00b050", type: "obj", text: "Green", img: 'colors/color_00b050.png'},
			{id: "bgcolor__00b0f0", type: "obj", text: "LightBlue", img: 'colors/color_00b0f0.png'},
			{id: "bgcolor__0070c0", type: "obj", text: "Blue", img: 'colors/color_0070c0.png'}
		]},
		{type: "buttonSelect", id: "topalign", text: "Align", img: "align_left.png", tooltip: "Text align in cell", show: '!read_only', options: [
			{id: "align__left", type: "obj", text: "Left", img: 'align_left.png'},
			{id: "align__center", type: "obj", text: "Center", img: 'align_center.png'},
			{id: "align__right", type: "obj", text: "Right", img: 'align_right.png'},
			{id: "align__justify", type: "obj", text: "Justify", img: 'align_justify.png'}
		]},
		{type: "button", id: "edit", text: "Edit", img: "iconedit.gif", tooltip: "Edit selected cell", show: '!read_only'},

		{ type: "button", id: "export_pdf", text: "PDF", img: "export_pdf.png", show: 'show_export_buttons', pos: 'right'},
		{ type: "button", id: "export_excel", text: "Excel", img: "export_excel.png", show: 'show_export_buttons', pos: 'right'},
		{ type: "button", id: "settings", text: "Settings", img: "settings.png", show: '!read_only', pos: 'right'}
	];

	this.settings.defaults.math_items = [
		{ id: "math", type: "buttonInput", width: 300 },
		{ id: "save", type: "button", text: "Save" },
		{ id: "cancel", type: "button", text: "Cancel" },
		{ id: "function", type: "button", text: "F(x)", show: 'math' }
	];
	this.tool_heights = {
		'dhx_skyblue': 26,
		'dhx_web': 32
	};
	this.tool_borders = {
		'dhx_skyblue': 0,
		'dhx_web': 2
	};
	this.tool_height = this.tool_heights[this.settings.skin];
	this.stack = [];
	this.dont_lose_focus = false;
	if (!obj.parent) {
		this.settings.parent = this.getFullscreenCont();
		this.settings.fullscreen = true;
	} else if (typeof(obj.parent) == "string")
		this.settings.parent = document.getElementById(obj.parent);
	else
		this.settings.parent = obj.parent;
	this.settings.autoheight = (this.settings.fullscreen) ? false : (typeof(obj.autoheight) !== 'undefined' ? obj.autoheight : true);
	this.settings.autowidth = (this.settings.fullscreen) ? false : (typeof(obj.autowidth) !== 'undefined' ? obj.autowidth : true);
	this.settings.parent = this.processParentCont(this.settings.parent);
	this.setSizes();
	if (this.settings.init_instantly === true)
		this.init();
}

dhtmlxSpreadSheet.prototype = {

	init: function() {
		this.toolbarInit();
		this.mathInit();
		this.setSizes();
		if (!this.grid)
			this.grid = new dhtmlXGridObject(this.settings.parent.grid);
		this.grid.ssheet = this;
		var self = this;
		this.grid._key_events.k13_0_0_old = this.grid._key_events.k13_0_0;
		this.grid._key_events.k13_0_0 = function() {
			self.k13_0_0.call(self.grid);
		};
		this.grid.setSkin(this.settings.skin);
		this.grid.setImagePath(this.settings.image_path);
		this.fillHeader();

		var cell_type = this.settings.read_only ? 'rotxt' : 'edsh';
		var resize_type = 'true';
		var widths = [this.settings.left_width];
		var types = ['ro'];
		var sorts = ['na'];
		var aligns = ['right'];
		var resize = [resize_type];
		for (var i = 0; i < this.settings.cols; i++) {
			widths.push(this.settings.column_width);
			types.push(cell_type);
			sorts.push('na');
			aligns.push('left');
			resize.push(resize_type);
		}
		this.grid.setInitWidths(widths.join(','));
		this.grid.setColTypes(types.join(','));
		this.grid.setColSorting(sorts.join(','));
		this.grid.setColAlign(aligns.join(','));
		this.grid.enableResizing(resize.join(','));
		this.grid.enableBlockSelection(true);
		if (this.settings.autoheight === true)
			this.grid.enableAutoHeight(true);
		if (this.settings.autowidth === true)
			this.grid.enableAutoWidth(true);
		this.grid.attachEvent("onBeforeBlockSelected", function(id, index){
			if (index === 0) return false;
			self.mathCancel();
			return true;
		});
		this.grid.setColumnHidden(0, !this.settings.show_row_numbers);
		this.grid.init();
		this.fillEmpty();
		this.attachDblClickToHeader();
		if (!this.settings.read_only)
			this.grid.attachEvent("onResizeEnd", function(e) {
				if (!e.resized) return;
				var index = e.resized._cellIndex;
				if (index === 0) return;
				self.saveHeadCell(index);
				self.setSizes();
			});
		this.grid.attachEvent("onResize", function(cInd,cWidth,obj){
			if (cInd === 0) return false;
			return true;
		});

		// load cell styles in toolbar
		this.grid.attachEvent("onRowSelect", function(id, cInd) {
			if (cInd === 0) return false;
			if (self.dont_lose_focus !== true)
				SpreadsheetBuffer.to_area(self, self.grid.getSelectedBlock("id"));
			else
				self.dont_lose_focus = false;
			self.loadCellStyle(id, cInd);
		});
		this.grid.attachEvent("onBlockSelected", function() {
			SpreadsheetBuffer.to_area(self, self.grid.getSelectedBlock("id"));
			self.loadCellStyle();
		});
		this.grid.attachEvent("onBeforeBlockSelection", function() {
			self.grid.clearSelection();
		});
		// event for applying styles after cell edition
		this.grid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue) {
			if (stage == 1)
				self.dont_lose_focus = true;
			if (stage == 2) {
				if (!self.grid.cells(rId, cInd).getRealChanged(true)) return false;
				this.clearBorderSelection();
				self.to_stack(rId, cInd);
				window.setTimeout(function() {
					self.applyStyles();
				}, 100);
			}
			return true;
		});
		this.grid.attachEvent("onBorderSelected", function(rId1, cInd1, rId2, cInd2){
			if ((rId1 === rId2)&&(cInd1 === cInd2)) {
				var range = self.getColName(cInd1) + rId1;
			} else {
				var range = self.getColName(cInd1) + rId1 + ':' + self.getColName(cInd2) + rId2;
			}
			SpreadSheetMathHint.setRange(range);
			return true;
		});
		this.grid.attachEvent("onBorderSelectionStart", function(rId, cInd){
			if (cInd === 0) return false;
		});
		this.grid.attachEvent("onBorderSelectionMove", function(rId1, cInd1, rId2, cInd2){
			if (cInd2 === 0) return false;
		});
		this.grid.attachEvent("onTab", function(mode){
			if (mode === true) return true;
			var block = this.getSelectedBlock("id");
			if (block === null) return;
			if (block.LeftTopCol === 1) return false;
			return true;
		});
		this.grid._key_events.k46_0_0 = function() {
			if (self.grid.editor) return false;
			SpreadsheetBuffer.getArea().value = "";
			SpreadsheetBuffer.from_area();
		};
		this.grid._key_events.k9_0_0 = function() {
			this.editStop();
			if (!this.callEvent("onTab",[true])) return true;
			if (this.cell && (this.cell._cellIndex+1)>=this._cCount) return;
			var z=this._getNextCell(null,1);
			if (z && this.row==z.parentNode){
				this.selectCell(z.parentNode,z._cellIndex,true,true);
				this._still_active=true;
			}
		};
		this.grid._key_events.k_other = function(ev) {
			if (this.editor) return false;
			if (!ev.ctrlKey && ev.keyCode>=40 && (ev.keyCode < 91 || (ev.keyCode >95 && ev.keyCode <111) || ev.keyCode >= 187))
				if (this.cell) {
					var c=this.cells4(this.cell);
           			if (c.isDisabled()) return false;
           			var t=c.getValue();
           			this.editCell();
           			if (this.editor) {
           				this.editor.val=t;
           				if (this.editor.obj && this.editor.obj.select)
           					this.editor.obj.select();
       				}
           			else c.setValue(t);
           		}
          };

		this.grid.editStop=function(mode){
			if (_isOpera)
				if (this._Opera_stop){
					if ((this._Opera_stop*1+50) > (new Date).valueOf())
						return;

					this._Opera_stop=null;
				}

			if (this.editor&&this.editor !== null){
				this.editor.cell.className=this.editor.cell.className.replace("editable", "");

				if (mode){
					var t = this.editor.val;
					this.editor.detach(false);
					this.editor.setValue(t);
					this.editor=null;

					this.callEvent("onEditCancel", [
						this.row.idd,
						this.cell._cellIndex,
						t
					]);
					return;
				}

				if (this.editor.detach())
					this.cell.wasChanged=true;

				var g = this.editor;
				this.editor=null;
				var z = this.callEvent("onEditCell", [
					2,
					this.row.idd,
					this.cell._cellIndex,
					g.getValue(),
					g.val
				]);

				if (( typeof (z) == "string")||( typeof (z) == "number"))
					g[g.setImage ? "setLabel" : "setValue"](z);

				else if (!z)
					g[g.setImage ? "setLabel" : "setValue"](g.val);

				if (this._ahgr && this.multiLine) this.setSizes();
			}
		};

		// prevent loose focus event calling
		this.grid.entBox.onbeforedeactivate = null;

		this.settings.parent.grid.className += ' spreadsheet';
		this.editor = SpreadSheetHeaderEditor.init();
		this.config = SpreadSheetConfig.init(this.settings.parent.parent);
		this.buffer = SpreadsheetBuffer.init();
	},

	k13_0_0: function(){
		if (this.ssheet.settings.math === true && this.editor && SpreadSheetMathHint.used(false)) return false;
		this.editStop();
		this.callEvent("onEnter", [
			(this.row ? this.row.idd : null),
			(this.cell ? this.cell._cellIndex : null)
		]);
		this._key_events.k13_0_0_old.call(this);
		this._still_active=true;
	},

	toolbarInit: function() {
		var items = this.get_toolbar_config(this.settings.defaults.toolbar_items);
		if (items.length === 0) {
			this.settings.hide_toolbar = true;
			this.setSizes();
			return;
		} else {
			this.settings.hide_toolbar = false;
		}
		this.toolbar = new dhtmlXToolbarObject({
			parent: this.settings.parent.toolbar,
			icon_path: this.settings.icons_path,
			items: items,
			skin: this.settings.skin
		});

		// sets toolbar items position
		var poss = { left: false, right: false };
		for (var i = 0; i < items.length; i++) {
			if (items[i].pos == 'right')
				poss.right = i;
			else
				poss.left = i;
		}
		if (poss.left === false)
			this.toolbar.setAlign('right');
		if (poss.right === false)
			this.toolbar.setAlign('left');
		if ((poss.left !== false) && (poss.right !== false))
			this.toolbar.addSpacer(items[poss.left].id);

		var self = this;
		this.toolbar.attachEvent("onClick", function(id) {
			switch (id) {
				case 'settings':
					if (self.settings.read_only) return;
					self.config.set({
						cols: self.settings.cols,
						rows: self.settings.rows,
						show_row_numbers: self.settings.show_row_numbers,
						show_export_buttons: self.settings.show_export_buttons
					});
					var pos = self.get_settings_pos();
					self.config.show(self, pos.x, pos.y);
					break;
				case 'export_pdf':
					self.export_to('pdf');
					break;
				case 'export_excel':
					// hide first column with row numbers before printing
					self.grid.setColumnHidden(0, true);
					self.export_to('excel');
					self.grid.setColumnHidden(0, false);
					break;
				case 'edit':
					var block = self.grid.getSelectedBlock("id");
					if (block === null) break;
					var value = self.grid.cells(block.LeftTopRow, block.LeftTopCol).getRealValue();
					self.hideToolbar();
					self.mathBegin(value);
					break;
				default:
					self.setCellStyle(id);
					break;
			}
		});
		this.toolbar.attachEvent("onStateChange", function(id, state) {
			self.setCellStyle(id, state);
		});
	},

	/*! check default configuration and return hash of values
	 *	which can be shown according the rule 'show' in its config
	 *	show='opt1,!opt2,opt3' means condition:
	 *	(this.settings.opt1 == true) && (this.settings.opt2 != true) && (this.settings.opt3 == true)
	 **/
	get_toolbar_config: function(all_items) {
		var enabled_items = [];
		for (var i = 0; i < all_items.length; i++) {
			var item = all_items[i];
			var show = (item.show || 'ever').split(',');
			var show_res = true;
			for (var j = 0; j < show.length; j++) {
				var rule = show[j];
				var invert = false;
				if (rule.substr(0, 1) == '!') {
					rule = rule.substr(1);
					invert = true;
				}
				if (typeof(this.settings[rule]) != 'undefined') {
					var rule_result = (invert === true) ? !this.settings[rule] : this.settings[rule];
				} else {
					var rule_result = false;
				}
				show_res = (show_res && rule_result);
			}

			if (show_res === true)
				enabled_items.push(all_items[i]);
		}
		return enabled_items;
	},

	get_settings_pos: function() {
		var item_name = 'settings';
		var prefix = this.toolbar.idPrefix;
		var obj = null;
		for (var i in this.toolbar.objPull) {
			if (i == prefix + item_name) {
				obj = this.toolbar.objPull[i].obj;
			}
		}
		if (obj === null) return { x: 0, y: 0 };
		var pos = SpreadSheetConfig.get_pos(obj);
		return { x: pos.x - 240, y: pos.y + 30 };
	},

	fillHeader: function() {
		var cols = [""];
		for (var i = 0; i < this.settings.cols; i++)
			cols.push(this.getColName(i + 1));
		this.grid.setHeader(cols.join(","));
	},

	fillEmpty: function() {
		var data = { rows: [] };
		for (var i = 0; i < this.settings.rows; i++) {
			var row = [i + 1];
			for (var j = 1; j <= this.settings.cols; j++)
				row[j] = "";
			data.rows.push({ id: i + 1, data: row });
		}
		this.grid.parse(data, "json");
	},

	getColName: function(index) {
		var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		var name = '';
		var ind = index;
		var ready = false;
		var ch = "";
		var length = letters.length;
		while (!ready) {
			var rest = Math.floor(index/length);
			var c = index - rest*length;
			index = Math.floor(index/length);
			c--;
			if (c == -1) {
				c = length - 1;
				index--;
			}
			ch = (c) + ch;
			name = letters[c] + name;
			if (index <= 0)
				ready = true;
		}
		return name;
	},

	getColIndex: function(col) {
		var value = 0;
		col = col.toLowerCase();
		for (var i = 0; i < col.length; i++) {
			var ord = col.charCodeAt(i) - 96;
			if (ord < 0 || ord > 26) continue;
			value += ord*Math.pow(26, col.length - i - 1);
		}
		return value;
	},

	load: function(sheet, key, save_settings) {
		var self = this;
		this.settings.sheet = sheet = sheet || this.settings.sheet || null;
		this.settings.key = key || null;
		if (this.settings.sheet === null) return;
		var url = this.addParamToUrl(this.settings.load_url, 'sheet', sheet);
		if (this.settings.key)
			url = this.addParamToUrl(url, 'key', this.settings.key);
		if (this.settings.math)
			url = this.addParamToUrl(url, 'dhx_math', 'true');

		var post = {};
		if (save_settings === true) {
			var cfg = this.serialize_settings();
			post.sh_cfg = cfg;
		}
		SpreadsheetLoader.request(url, post, function(response) {
			var cfg = (typeof(response.config) != 'undefined') ? self.unserialize_settings(response.config) : self.settings.defaults;
			for (var i in cfg) self.settings[i] = cfg[i];
			cfg.read_only = response.readonly;

			self.refresh(cfg, true);
			var cells = response.cells;
			for (var i = 0; i < cells.length; i++) {
				var col = cells[i].col;
				var row = cells[i].row;
				var value = cells[i].text;
				var calc = cells[i].calc;
				self.setValue(row, col, value, calc);
				var style = cells[i].style;
				if (style) {
					self.getCellStyle(row, col).unserialize(style);
				}
			}
			var cells = response.head;
			var els = self.grid.hdr.getElementsByTagName('div');
			for (var i = 0; i < cells.length; i++) {
				var col = parseInt(cells[i].col, 10);
				var width = cells[i].width;
				var value = cells[i].label;
				if (col !== 0) {
					value  = value.replace(/</g, '&lt;');
					value  = value.replace(/>/g, '&gt;');
					if (typeof(els[col])!= "undefined") els[col].innerHTML = value;
				}
				self.grid.setColWidth(col, width);
			}
			self.grid.setSizes();
			self.applyStyles();
			self.setSizes();
		}, this, this.settings.method);
	},

	addParamToUrl: function(url, param_name, param_value) {
		url += (url.indexOf("?")==-1)? "?" : "&";
		url += param_name + '=' + this.escape(param_value);
		return url;
	},

	setValue: function(row, col, formatted, real) {
		row = parseInt(row, 10);
		col = parseInt(col, 10);
		if ((row > this.settings.rows)||(col > this.settings.cols)) return;
		real = (typeof(real) !== 'undefined') ? real : formatted;
		this.grid.cells(row, col).setCValue(real, formatted);
	},

	clearAll: function() {
		this.grid.clearAll();
		this.fillEmpty();
		for (var i = 1; i < this.settings.cols; i++)
			this.grid.setColWidth(i, this.settings.column_width);
	},

	attachDblClickToHeader: function() {
		if (this.settings.read_only) return;
		var els = this.grid.hdr.getElementsByTagName('div');
		for (var i = 1; i < els.length; i++) {
			this.processHeaderCell(els[i], i);
		}
		var self = this;
	},

	processHeaderCell: function(el, pos) {
		var self = this;
		dhtmlxEvent(el, "dblclick", function(e) {
			var target = e.target || e.srcElement;
			var text = target.innerHTML;
			self.editor.editStart(target, text, [self,pos,el]);
		});
	},

	saveHeadCell: function(pos, name) {
		var col = this.getCol(pos);
		name = name || col.name;
		var el = col.width;
		var width = col.width;

		var self = this;
		var sheet = this.settings.sheet;
		if (this.settings.sheet === null) return;
		var url = this.addParamToUrl(this.settings.save_url, "sheet", sheet);
		if (this.settings.key)
			url = this.addParamToUrl(url, "key", this.settings.key);
		url = this.addParamToUrl(url, "edit", "header");
		var post = {
			col: this.escape(pos),
			name: this.escape(name),
			width: this.escape(width)
		};
		SpreadsheetLoader.request(url, post, function(actions) {
			var col = parseInt(actions.col, 10);
			var status = actions.type;
			if (status == "deleted") el.innerHTML = self.getColName(col);
			self.grid.setSizes();
		}, this, this.settings.method);
	},

	getCol: function(index) {
		var col = {};
		col.col = index;
		var els = this.grid.hdr.getElementsByTagName('div');
		col.el = els[index];
		col.name = this.grid.getColLabel(index);
		col.width = this.grid.getColWidth(index);
		return col;
	},

	refresh: function(config, dont_load) {
		this.settings.cols = (config.cols > 0) ? config.cols : this.settings.cols;
		this.settings.rows = (config.rows > 0) ? config.rows : this.settings.rows;
		this.settings.show_row_numbers = (typeof(config.show_row_numbers) !== 'undefined') ? config.show_row_numbers : true;
		this.settings.show_export_buttons = (typeof(config.show_export_buttons) !== 'undefined') ? config.show_export_buttons : true;
		this.settings.read_only = config.read_only || false;
		if (this.grid)
			this.unload();
		this.init();
		this.settings.show_export_buttons = (typeof(config.show_export_buttons) !== 'undefined') ? config.show_export_buttons : true;
		if ((this.settings.sheet !== null)&&(dont_load !== true))
			this.load(this.settings.sheet, this.settings.key, true);
	},

	unload: function() {
		if (this.settings.hide_toolbar === false)
			this.toolbar.unload();
		this.grid.clearAll(true);
		this.grid = null;
		this.settings.styles = [];
	},

	getFullscreenCont: function() {
		document.body.parentNode.style.height = "100%";
		document.body.parentNode.style.width = "100%";
		document.body.style.height = "100%";
		document.body.style.width = "100%";
		document.body.style.margin = "0px";
		document.body.style.padding = "0px";
		document.body.style.overflow = "hidden";
		var parent = document.createElement("div");
		parent.style.height = "100%";
		parent.style.width = "100%";
		parent.style.position = "absolute";
		parent.style.top = "0px";
		parent.style.left = "0px";
		document.body.appendChild(parent);
		this.settings.fullscreen = true;
		return parent;
	},

	/*! creates two inner containers for toolbar and grid
	 **/
	processParentCont: function(parent) {
//		parent.style.position = 'relative';
		var toolbar_cont = document.createElement("div");
		toolbar_cont.style.height = this.tool_height + "px";
		parent.appendChild(toolbar_cont);
		var math_cont = document.createElement("div");
		math_cont.style.height = this.tool_height + "px";
		math_cont.style.display = "none";
		parent.appendChild(math_cont);
		var grid_cont = document.createElement("div");
		var self = this;
		if (this.settings.fullscreen)
			dhtmlxEvent(window, "resize", function() {
				window.setTimeout(function() {
					self.setSizes();
				}, 100);
			});
		parent.appendChild(grid_cont);
		return { grid: grid_cont, toolbar: toolbar_cont, math: math_cont, parent: parent };
	},

	setSizes: function(hide_toolbar) {
		var scroll_width = 0;
		var parent = (this.settings.parent.parent || this.settings.parent);
		var toolbar_height = (this.settings.hide_toolbar === true) ? 0 : this.tool_height;
		if (this.settings.fullscreen === true)
			var size = this.getSize(parent);
		else {
			var size = this.getSize(this.settings.parent.grid);
			if (size.height === 0) size.height = this.tool_height;
			if (this.settings.autowidth)
				parent.style.width = size.width + "px";
			else
				size.width = parent.offsetWidth;
			if (this.settings.autoheight)
				parent.style.height = (size.height) + "px";
			else
				size.height = parent.offsetHeight;
		}
		this.settings.parent.toolbar.style.height = toolbar_height + "px";
		this.settings.parent.toolbar.style.width = (size.width - 10 - scroll_width - this.tool_borders[this.settings.skin]) + "px";
		this.settings.parent.grid.style.height = (size.height - toolbar_height) + "px";
		this.settings.parent.grid.style.width = (size.width - 2 - scroll_width) + "px";
		if (this.grid) this.grid.setSizes();
	},

	showToolbar: function() {
		this.settings.parent.toolbar.style.display = 'block';
	},

	hideToolbar: function() {
		this.settings.parent.toolbar.style.display = 'none';
	},

	/*! callback for style buttons click
	 *	@param id
	 *		id of clicked button
	 *	@param state
	 *		on/off state for TwoStateButton
	 **/
	setCellStyle: function(id, state) {
		if (this.settings.read_only) return;
		var block = this.grid.getSelectedBlock("id");
		if (block === null) return false;
		block.LeftTopRow = parseInt(block.LeftTopRow, 10);
		block.RightBottomRow = parseInt(block.RightBottomRow, 10);
		if (block === null) return;
		for (var r = block.LeftTopRow; r <= block.RightBottomRow; r++) {
			for (var c = block.LeftTopCol; c <= block.RightBottomCol; c++) {
				var row = r;
				var col = c;
				if ((row === null)||(col <= 0)) continue;
				if ((row > this.settings.rows)||(col > this.settings.cols)) continue;
				if (col === 0) continue;
				var ids_dont_process = ["topcolor", "topbgcolor", "topalign"];
				for (var i = 0; i < ids_dont_process.length; i++)
					if (ids_dont_process[i] == id) return;

				var name = id;
				var value = state ? 'true' : 'false';

				var name_parse = name.split("__");
				if (name_parse.length == 2) {
					name = name_parse[0];
					value = name_parse[1];
				}

				var style = this.getCellStyle(row, col);
				style.set(name, value);
				this.to_stack(row, col);
				this.applyStyles(row, col);
				this.loadCellStyle();
			}
		}
	},

	/*! returns style object or creates new by row/col
	 **/
	getCellStyle: function(row, col) {
		var id = row + "___" + col;
		if (this.settings.styles[id])
			return this.settings.styles[id];
		else {
			this.settings.styles[id] = new SpreadSheetCss();
			return this.settings.styles[id];
		}
	},

	/*! applies all saved styles to cells
	 **/
	applyStyles: function(row, col) {
		if (typeof(col) == "undefined") {
			for (var i in this.settings.styles) {
				var coords = i.split('___');
				row = coords[0];
				col = coords[1];
				this.applyCellStyle(row, col);
			}
		} else
			this.applyCellStyle(row, col);
	},

	applyCellStyle: function(row, col) {
		if (row < (this.grid.rowsBuffer.length + 1) && col < this.grid._cCount){
			var cell = this.grid.cells(row, col);
			cell.cell.style.cssText = this.settings.styles[row + '___' + col].get_css();
		}
	},

	/*! load in toolbar styles for selected cell
	 **/
	loadCellStyle: function(row, col) {
		if (this.settings.read_only) return;
		if (col === 0) return;
		if (this.settings.hide_toolbar === true) return;
		var block = this.grid.getSelectedBlock("id");
		if (block !== null) {
			block.LeftTopRow = parseInt(block.LeftTopRow, 10);
			block.RightBottomRow = parseInt(block.RightBottomRow, 10);
		}
		if (block === null) return;
		row = (typeof(row) != "undefined") ? row : block.LeftTopRow;
		col = (typeof(col) != "undefined") ? col : block.LeftTopCol;
		if ((typeof(row) == 'undefined') || (typeof(col) == 'undefined')) return;
		var style = this.getCellStyle(row, col);
		var json = style.get_json();

		if (json.bold == "true")
			this.toolbar.setItemState('bold', true);
		else
			this.toolbar.setItemState('bold', false);

		if (json.italic == "true")
			this.toolbar.setItemState('italic', true);
		else
			this.toolbar.setItemState('italic', false);

		this.toolbar.setItemImage('topcolor', 'colors/color_' + json.color + '.png');
		this.toolbar.setItemImage('topbgcolor', 'colors/color_' + json.bgcolor + '.png');
		this.toolbar.setItemImage('topalign', 'align_' + json.align + '.png');
	},

	getSize: function(el) {
		var size = {
			width: el.offsetWidth,
			height: el.offsetHeight
		};
		return size;
	},

	escape: function(value) {
		return encodeURIComponent(value);
	},

	// get serialized text of some coords block
	getBlockText: function(coords) {
		var cells_del = "\t";
		var rows_del = "\n";
		var text = [];
		coords.LeftTopRow = parseInt(coords.LeftTopRow, 10);
		coords.LeftTopCol = parseInt(coords.LeftTopCol, 10);
		coords.RightBottomRow = parseInt(coords.RightBottomRow, 10);
		coords.RightBottomCol = parseInt(coords.RightBottomCol, 10);
		for (var i = coords.LeftTopRow; i <= coords.RightBottomRow; i++) {
			var line = [];
			for (var j = coords.LeftTopCol; j <= coords.RightBottomCol; j++)
				line.push(this.grid.cells(i, j).getRealValue());
			text.push(line.join(cells_del));
		}
		return text.join(rows_del);
	},

	// set serialized text to selected block or cell
	setBlockText: function(text) {
		if (this.settings.read_only === true) return;
		var coords = this.grid.getSelectedBlock("id");
		if (coords === null) return;
		var top = parseInt(coords.LeftTopRow, 10);
		var left = parseInt(coords.LeftTopCol, 10);
		text = text.split("\n");
		for (var i = 0; i < text.length; i++)
			text[i] = text[i].split("\t");

		// when inserting from MS Excel it adds last empty row which shouldn't be inserted
		// so check if it exists - then don't process last row
		var inc = ((text.length > 1)&&(text[text.length - 1].length === 1)&&(text[text.length - 1][0] === "")) ? -1 : 0;

		if ((text.length == 1)&&(text[0].length == 1)) {
			var fill_value = text[0][0];
			for (var i = coords.LeftTopRow; i <= coords.RightBottomRow; i++)
				for (var j = coords.LeftTopCol; j <= coords.RightBottomCol; j++) {
					this.setValue(i, j, text[0][0]);
					this.grid.editStop();
					this.to_stack(i, j);
				}
		} else {
			for (var i = 0; i < text.length + inc; i++) {
				for (var j = 0; j < text[i].length; j++) {
					if ((top + i > this.settings.rows)||(left + j > this.settings.cols))
						continue;
					var value = text[i][j];
					this.setValue(top + i, left + j, value);
					this.to_stack(top + i, left + j);
				}
			}
		}
	},

	// add cell to save stack
	to_stack: function(row, col, value) {
		var cell = {
			row: row,
			col: col
		};
		if (typeof(value) != "undefined")
			cell.value = value;

		// check: if this cell already in stack - replace it
		for (var i = 0; i < this.stack.length; i++)
			if (this.stack[i].row == cell.row && this.stack[i].col == cell.col) {
				this.stack[i] = cell;
				this.send();
				return true;
			}
		// else add as new cell
		this.stack.push(cell);
		this.send();
		return true;
	},

	// start timer after which request will be sent
	send: function() {
		var self = this;
		if (this.stack.length == 1)
			window.setTimeout(function() {
				self.send_save_query();
			}, this.settings.timeout);
	},

	// send all data from stack
	send_save_query: function() {
		var url = this.addParamToUrl(this.settings.save_url, 'sheet', this.settings.sheet);
		if (this.settings.math) url = this.addParamToUrl(url, 'dhx_math', 'true');
		if (this.settings.key)
			url = this.addParamToUrl(url, 'key', this.settings.key);
		url = this.addParamToUrl(url, 'edit', 'true');
		var post = {
			rows: [],
			cols: [],
			values: [],
			styles: []
		};
		if (this.stack.length == 0) return;
		var i = 0;
		while (this.stack.length > 0) {
			var cell = this.stack.pop();
			post.rows[i] = cell.row;
			post.cols[i] = cell.col;
			var value = cell.value || this.grid.cells(cell.row, cell.col).getRealValue();
			var style = this.getCellStyle(cell.row, cell.col);
			style = style.serialize();
			post.values[i] = value;
			post.styles[i] = style;
			i++;
		}
	var self = this;
		SpreadsheetLoader.request(url, post, function(response) {
			for (var i = 0; i < response.length; i++)
				if (response[i].type == 'updated')
					self.setValue(response[i].row, response[i].col, response[i].text, response[i].calc);
		}, this, "ajax");
	},

	export_to: function(type) {
		this.grid.editStop();
		var url = (type == 'excel') ? this.settings.export_excel_url : this.settings.export_pdf_url;
		url  = this.addParamToUrl(url, 'spreadsheet', this.settings.version);
		this.grid.toPDF(url, 'full_color');
	},

	serialize_settings: function(dont_join) {
		var options = {
			'cols': this.settings.cols,
			'rows': this.settings.rows,
			'show_row_numbers': this.settings.show_row_numbers,
			'show_export_buttons': this.settings.show_export_buttons
		};
		var ser = (dont_join === true) ? {} : [];
		for (var i in options)
			if (dont_join)
				ser[i] = options[i];
			else
				ser.push(i + ':' + options[i]);
		if (!dont_join) ser = ser.join(';');
		return ser;
	},

	unserialize_settings: function(settings) {
		settings = settings.split(';');
		var config = {};
		for (var i = 0; i < settings.length; i++) {
			var option = settings[i].split(':');
			if (option.length == 2)
				config[option[0]] = this.process_value(option[1]);
		}
		return config;
	},

	process_value: function(value) {
		if (value == 'true') return true;
		if (value == 'false') return false;
		return value;
	},

	mathInit: function() {
		var items = this.get_toolbar_config(this.settings.defaults.math_items);
		this.math = new dhtmlXToolbarObject({
			parent: this.settings.parent.math,
			icon_path: this.settings.icons_path,
			items: items,
			skin: this.settings.skin
		});
		var input = this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		if (this.settings.math) SpreadSheetMathHint.init(input);
		var self = this;
		this.math.attachEvent("onClick", function(id) {
			switch (id) {
				case 'save':
					self.mathSave();
					break;
				case 'cancel':
					self.mathCancel();
					break;
				case 'function':
					if (self.settings.math)
						SpreadSheetMathHint.all(self.settings.parent.parent, {
							insert: function(f) {
								var input = self.math.objPull[self.math.idPrefix + 'math'].obj.childNodes[0];
								if (input.value.substr(0, 1) !== '=') input.value = '=' + input.value;
								var cursor = SpreadSheetMathHint.getCursorPos(input);
								var text = input.value.substr(0, cursor) + f.regexp + input.value.substr(cursor + 1);
								input.value = text;
								input.focus();
								SpreadSheetMathHint.mathKeyDown({ keyCode: -1 });
							},
							cancel: function() {
								input.focus();
							}
						});
					break;
				default:
					break;
			}
		});
	},

	mathBegin: function(value) {
		this.showMath();
		var input = this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		input.value = value || "";

		if (!this.settings.math) {
			input.focus();
			var self = this;
			input.onkeydown = function(e) {
				e = e||window.event;
				var code = e.keyCode||e.which;
				if (code === 13)
					self.mathSave();
			};
			return false;
		}
		SpreadSheetMathHint.input = input;
		SpreadSheetMathHint.cursor = input.value.length;
		input.ssheet = this;
		SpreadSheetMathHint.attachEvent(input, this);
		SpreadSheetMathHint.showBorders(input);
		if (input.value.substring(0, 1) === '=')
			this.grid.enableBorderSelection(true);
		SpreadSheetMathHint.setCursorPos(input, input.value.length);
	},

	mathSave: function(input) {
		input = input || this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0];
		var value = input.value;
		value = SpreadSheetMathHint.function_ending(value);
		this.hideMath();
		this.showToolbar();
		this.grid.clearBorderSelection();
		this.grid.enableBorderSelection(false);
		var coords = this.grid.getSelectedBlock("id");
		for (var i = coords.LeftTopRow; i <= coords.RightBottomRow; i++)
			for (var j = coords.LeftTopCol; j <= coords.RightBottomCol; j++) {
				this.grid.editStop(false);
				this.setValue(i, j, value);
				this.to_stack(i, j);
			}
	},

	mathCancel: function() {
		this.grid.clearBorderSelection();
		this.grid.enableBorderSelection(false);
		this.grid.editStop(true);
		this.hideMath();
		this.showToolbar();
	},

	hideMath: function() {
		SpreadSheetMathHint.hide();
		this.settings.parent.math.style.display = 'none';
		this.math.objPull[this.math.idPrefix + 'math'].obj.childNodes[0].blur();
		this.grid.entBox.focus();
	},

	showMath: function() {
		this.settings.parent.math.style.display = 'block';
	}
};


var SpreadSheetHeaderEditor;
var SpreadSheetConfig;
var SpreadSheetMathHint;
var SpreadSheetCss;