<?php 
require_once("../../connector/data_connector.php");
require_once("../../connector/db_sqlite.php");

if (!$db = sqlite_open('db', 0777, $sqliteerror)) {
	die($sqliteerror);
}

$data = new JSONDataConnector($db,"SQLite");
$data->render_table("users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>