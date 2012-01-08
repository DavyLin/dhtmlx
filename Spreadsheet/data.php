<?php

require("config.php");
require("grid_cell_connector.php");

$res = mysql_connect($db_host, $db_user, $db_pass);
mysql_select_db($db_name, $res);

$conn = new GridCellConnector($res, $db_prefix);
//$conn->enable_log();
$conn->render();

?>