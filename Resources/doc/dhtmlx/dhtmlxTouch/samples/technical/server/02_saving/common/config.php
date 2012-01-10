<?php 
require_once("./../connector/data_connector.php");
	
/*

if you want to use a different db type
	- include correct db_{some}.php
	- store opened connection in $db
	- set valid $dbtype name 
Check the next page for more details
	http://docs.dhtmlx.com/doku.php?id=dhtmlxconnector:server_side_others
	
*/
require_once("./../connector/db_sqlite.php");

if (!$db = sqlite_open('common/db', 0777, $sqliteerror)) {
	die($sqliteerror);
}
$dbtype = "SQLite";


?>