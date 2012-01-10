<?php 
require_once("./common/config.php");

$data = new JSONDataConnector($db,$dbtype);
function check_values($action){
	$name = $action->get_value("name");
	$age =	$action->get_value("age");
	
	$error = array();
	if (!$name)
		$error[]="Invalid name";
	if (!$age || !is_numeric($age))
		$error[]="Invalid age";
		
	if (sizeof($error)){
		$action->set_response_text(implode("<br>",$error));
		$action->invalid();
	}
};

$data->event->attach("beforeProcessing","check_values");
$data->render_table("users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>