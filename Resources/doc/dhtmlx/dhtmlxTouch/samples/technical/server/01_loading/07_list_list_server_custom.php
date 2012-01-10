<?php 
require_once("./common/config.php");

//change filtering logic, default is "like %s%", but we need "like s%"

function custom_filter($filter){
	$index = $filter->index("name");
	if ($index !== false){
		$value = $filter->rules[$index]["value"];
		$filter->rules[$index] = " name LIKE '".$value."%'";
	}		
};

$data = new JSONDataConnector($db,$dbtype);
$data->event->attach("beforeFilter", "custom_filter");
$data->render_table("users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>