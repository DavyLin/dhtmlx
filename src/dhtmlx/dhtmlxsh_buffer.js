/*
 (c) DHTMLX Ltd, 2011
 Licensing: You allowed to use this component for free under GPL or you need to obtain Commercial/Enterprise license to use it in non-GPL project
 Contact: sales@dhtmlx.com
 */
 SpreadsheetBuffer = {

	area_id: 'spreadsheet_buffer_area',
	area: null,

	init: function() {
		this.getArea();
		dhtmlxEvent(document.body, "keyup", function(e) {
			if (!SpreadsheetBuffer.callback) return true;
			var code = e.charCode || e.keyCode || 0;
			var ctrl = e.ctrlKey || false;
			// insert functionality
			if (code == 86 && ctrl === true) {
				SpreadsheetBuffer.from_area();
			}
			// clear functionality
			if (code === 46 && ctrl === false) {
				if (SpreadsheetBuffer.callback && SpreadsheetBuffer.callback.grid.editor !== null)
					return true;
				SpreadsheetBuffer.getArea().value = "";
				SpreadsheetBuffer.from_area();
			}
		});
	},

	getArea: function() {
		if (this.area) return this.area;

		var div = document.createElement('div');
		div.className = 'editable';

		var area = document.createElement('textarea');
		area.id = this.area_id;
		area.className = 'spread_buffer_area';
		div.appendChild(area);
		document.body.appendChild(div);
		SpreadsheetBuffer.area = area;
		return this.area;
	},

	to_area: function(callback, coords) {
		if (coords === null) return;
		coords.LeftTopRow = parseInt(coords.LeftTopRow, 10);
		coords.RightBottomRow = parseInt(coords.RightBottomRow, 10);
		if (typeof(callback) != "undefined") {
			SpreadsheetBuffer.callback = callback;
		}
		if (coords === null)
			var text = "";
		else {
			var text = callback.getBlockText(coords);
		}
		SpreadsheetBuffer.area.value = text;
		window.setTimeout(function() {
			SpreadsheetBuffer.area.focus();
			SpreadsheetBuffer.area.select();
		}, 1);
	},

	from_area: function() {
		var text = SpreadsheetBuffer.area.value;
		if (SpreadsheetBuffer.callback.grid.editor) return false;
		SpreadsheetBuffer.callback.setBlockText(text);
	}
};