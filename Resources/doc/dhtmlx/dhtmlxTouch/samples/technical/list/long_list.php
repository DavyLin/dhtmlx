<?php
	$data = array();
	for ($i=0; $i < 100; $i++) { 
		array_push($data, array(
			"title" => md5($i)
		));
	}
	echo json_encode($data);
?>

