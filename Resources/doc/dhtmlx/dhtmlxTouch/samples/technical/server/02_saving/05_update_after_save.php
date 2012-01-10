<?php 
require_once("./common/config.php");

$data = new JSONDataConnector($db,$dbtype);

function beforeInsertHandler($action){
	$action->set_value("name", "New user");
}
function afterInsertHandler($action){
	global $data;
	$action->set_response_text($data->getRecord($action->get_new_id()));
}
$data->event->attach("beforeinsert", "beforeInsertHandler");
$data->event->attach("afterinsert", "afterInsertHandler");
$data->render_table("users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>