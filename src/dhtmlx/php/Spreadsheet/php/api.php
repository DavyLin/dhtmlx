<?php

require_once('mysql.php');
require_once('log_master.php');

class SpreadSheet {

	protected $connection;
	protected $wrapper;
	protected $sheetid = "";
	protected $prefix;

	/*! contructor
	 *	@param connection
	 *		mysql connection
	 *	@param sheetid
	 *		id of sheet
	 */
	public function __construct($connection, $sheetid, $prefix) {
		$this->connection = $connection;
		$this->wrapper = new mysql($connection);
		$this->sheetid = $sheetid;
		$this->prefix = $prefix;
	}

	/*! sets text by coord
	 *	@param coord
	 *		cell coordinate (string or array)
	 *	@param text
	 *		cell text
	 *	@return
	 *		true if successful or false otherwise
	 */
	public function setText($coord, $text) {
		$cell = $this->getCell($coord);
		return $cell->setText($text);
	}

	/*! get text by coord
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		text if cell exists or false
	 */
	public function getText($coord) {
		$cell = $this->getCell($coord);
		return $cell->getText();
	}

	/*! sets style by coord
	 *	@param coord
	 *		cell coordinate (string or array)
	 *	@param style
	 *		cell associative array or serialized string
	 *	@return
	 *		true if successful or false otherwise
	 */
	public function setStyle($coord, $style) {
		$cell = $this->getCell($coord);
		return $cell->setStyle($style);
	}

	/*! get style by coord
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		style as associative array if cell exists or false
	 */
	public function getStyle($coord) {
		$cell = $this->getCell($coord);
		return $cell->getStyle();
	}

	/*! get cell object by coordinate
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		cell object
	 */
	public function getCell($coord) {
		$cell = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix);
		return $cell;
	}

	/*! check if it's correct coordinate
	 *	@param coord
	 *		cell coord
	 *	@return
	 *		cell object or false
	 */
	public function isCell($coord) {
		$cell = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix);
		if ($cell->isIncorrect())
			return false;
		return $cell;
	}

	/*! set id of sheet
	 *	@param sheetid
	 *		id of sheet
	 */
	public function setSheetId($sheetid) {
		$this->sheetid = $sheetid;
	}

	/*! get all sheet cells
	 *	@return
	 *		array of cell objects
	 */
	public function getCells() {
		$cells = Array();
		$query = "SELECT `rowid`, `columnid` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}'";
		$res = $this->wrapper->query($query);
		while ($coord = $this->wrapper->next($res)) {
			$cells[] = new SpreadSheetCell($this->connection, $this->sheetid, $coord, $this->prefix);
		}
		return $cells;
	}

}

class SpreadSheetCell {

	protected $sheetid;
	protected $col;
	protected $colLetter;
	protected $row;
	protected $wrapper;
	protected $incorrect = false;
	protected $prefix;

	/*! constructor
	 *	@param connection
	 *		mysql connection
	 *	@param sheetid
	 *		id of sheet
	 *	@param coord
	 *		cell coordinate
	 */
	public function __construct($connection, $sheetid, $coord, $prefix = '') {
		$this->wrapper = new mysql($connection);
		$this->sheetid = $sheetid;
		$this->prefix = $prefix;
		$coords = $this->parse_coord($coord);
		if ($coords === false) {
			$this->incorrect = true;
			return false;
		}
		$this->col = $coords['col'];
		$this->colLetter = $coords['colLetter'];
		$this->row = $coords['row'];
	}

	/*! parse cell coordinate
	 *	@param coord
	 *		cell coordinate as string or array
	 *	@return
	 *		array ('col' => $col, 'row' => $row, 'colLetter' => colLetter)
	 */
	public function parse_coord($coord) {

		if (is_array($coord)) {
			if (isset($coord[0])) $row = $coord[0];
			if (isset($coord[1])) $col = $coord[1];
			if (isset($coord['r'])) $row = $coord['r'];
			if (isset($coord['row'])) $row = $coord['row'];
			if (isset($coord['rowid'])) $row = $coord['rowid'];
			if (isset($coord['c'])) $col = $coord['c'];
			if (isset($coord['col'])) $col = $coord['col'];
			if (isset($coord['column'])) $col = $coord['column'];
			if (isset($coord['columnid'])) $col = $coord['columnid'];

			if (isset($coord['cLetter'])) $colLetter = $coord['cLetter'];
			else if (isset($coord['colLetter'])) $colLetter = $coord['colLetter'];
			else if (isset($coord['columnLetter'])) $colLetter = $coord['columnLetter'];

			if (!isset($col) && !isset($colLetter))
				return false;
			if (!isset($col))
				$col = SpreadSheetCell::getColIndex($colLetter);
			if (!isset($colLetter))
				$colLetter = SpreadSheetCell::getColName($col);

			else SpreadSheetCell::getColName($col);
			return Array('col' => $col, 'row' => $row, 'colLetter' => $colLetter);
		}

		preg_match("/^([a-z]+)([0-9]+)$/i", $coord, $coords);
		if (count($coords) != 3)
			return false;
		$colLetter = $coords[1];
		$row = $coords[2];
		$col = SpreadSheetCell::getColIndex($colLetter);
		return Array('col' => $col, 'row' => $row, 'colLetter' => $colLetter);
	}

	/*! gets column index by name
	 *	@param col
	 *		column name like A, B, C,...
	 *	@return
	 *		column index
	 */
	public static function getColIndex($col) {
		$value = 0;
		for ($i = 0; $i < strlen($col); $i++) {
			$ch = strtolower($col[$i]);
			$ord = ord($ch) - 96;
			if ($ord < 0 || $ord > 26) continue;
			$value += $ord*pow(26, strlen($col) - $i - 1);
		}
		return $value;
	}

	/*! check if cell exists
	 *	@param dont_create
	 *		create ot don't cell if it doesn't exist
	 *	@return
	 *		true if cell exists false otherwise (even if cell was created return false)
	 */
	public function exists($dont_create = false) {
		$query = "SELECT `data` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		if ($this->wrapper->next($result))
			return true;
		else {
			if (!$dont_create) {
				$query = "INSERT INTO `{$this->prefix}data` (`sheetid`, `rowid`, `columnid`) VALUES ('{$this->sheetid}', '{$this->row}', '{$this->col}')";
				$this->wrapper->query($query);
			}
			// echo create new cell
			return false;
		}
	}

	/*! gets column name by index
	 *	@param index
	 *		column index
	 *	@return
	 *		column name - A, B, C,...
	 */
	public static function getColName($index) {
		$letters = Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		$name = '';
		$ind = $index;
		$ready = false;
		$ch = "";
		$length = count($letters);
		while (!$ready) {
			$rest = floor($index/$length);
			$c = $index - $rest*$length;
			$index = floor($index/$length);
			$c--;
			if ($c == -1) {
				$c = $length - 1;
				$index--;
			}
			$ch = $c + $ch;
			$name = $letters[$c].$name;
			if ($index <= 0)
				$ready = true;
		}
		return $name;
	}

	/*! gets cell text
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getValue() {
		$query = "SELECT `data` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->next($result);
		return $cell['data'];
	}

	/*! sets cell text
	 *	@param text
	 *		cell text
	 *	@return
	 *		true or false
	 */
	public function setValue($text) {
		$this->exists();
		$query = "UPDATE data SET `data`='{$text}' WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		return $result;
	}

	/*! gets calculated cell value (formula result)
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getCalculatedValue() {
		$query = "SELECT `calc` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->next($result);
		if ($cell['calc'] === '')
			return '0';
		return $cell['calc'];
	}

	/*! gets parsed cell formula
	 *	@return
	 *		cell text or false if not exists
	 */
	public function getParsedValue() {
		$query = "SELECT `parsed` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->next($result);
		return $cell['parsed'];
	}

	/*! gets cell style
	 *	@return
	 *		cell style as array
	 */
	public function getStyle() {
		$query = "SELECT `style` FROM {$this->prefix}data WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		if (!$result) return false;
		$cell = $this->wrapper->next($result);
		return $this->parseStyle($cell['style']);
	}

	/*! sets cell style
	 *	@param style
	 *		associative array or serialized string
	 *	@return
	 *		result of operation - true or false
	 */
	public function setStyle($style) {
		$this->exists();
		if (is_array($style))
			$style = $this->serializeStyle($style);
		$query = "UPDATE {$this->prefix}data SET `style`='{$style}' WHERE `sheetid`='{$this->sheetid}' AND `rowid`='{$this->row}' AND `columnid`='{$this->col}'";
		$result = $this->wrapper->query($query);
		return $result;
	}

	/*! unserialize style string
	 *	@param style
	 *		style as string
	 *	@return
	 *		associative array of style
	 */
	public function parseStyle($style) {
		$style = explode(";", $style);
		$rules = Array();
		for ($i = 0; $i < count($style); $i++) {
			$rule = explode(":", $style[$i]);
			$rules[trim($rule[0])] = trim($rule[1]);
		}
		return $rules;
	}

	/*! serialize style array
	 *	@param style
	 *		style as array
	 *	@return
	 *		serialized style
	 */
	public function serializeStyle($style) {
		$rules = Array();
		foreach ($style as $k => $v)
			$rules[] = $k.':'.$v;
		return implode(';', $rules);
	}

	/*! get cell coordinate
	 *	@param mode
	 *		output type:
	 *			array,
	 *			array_lit (letter instead column index)
	 *			string,
	 *			array_assoc_lit,
	 *			array_assoc
	 *	@return
	 *		cell coordinate
	 */
	public function getCoords($mode = 'array_assoc') {
		switch ($mode) {
			case 'array':
			case 'arr':
				return Array($this->row, $this->col);
				break;
			case 'array_lit':
			case 'arr_lit':
				return Array($this->row, $this->colLetter);
				break;
			case 'string':
			case 'str':
				return $this->colLetter.$this->row;
				break;
			case 'array_assoc_lit':
			case 'arr_assoc_lit':
				return Array('row' => $this->row, 'column' => $this->colLetter);
				break;
			case 'array assoc':
			case 'arr_assoc':
			default:
				return Array('row' => $this->row, 'column' => $this->col);
				break;
		}
	}

	public function isIncorrect() {
		return $this->incorrect;
	}

}


?>