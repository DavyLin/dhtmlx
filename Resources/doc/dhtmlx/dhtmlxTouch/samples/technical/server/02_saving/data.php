<?php 
require_once("./common/config.php");

$data = new JSONDataConnector($db,$dbtype);
$data->render_table("users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>