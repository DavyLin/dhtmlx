<?php 
require_once("./common/config.php");

$data = new JSONDataConnector($db,$dbtype);
function output_error_details($action, $e){
	$action->set_response_text($e->getMessage());
}
$data->event->attach("onDBError", "output_error_details");
$data->render_table("not_existing_table_users", "id", "name,age,group_name,city,phone,sex,driver_license");

?>