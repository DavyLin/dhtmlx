<?php
	if (isset($_GET["count"]))
		$count = $_GET["count"];
	else
		$count = 20;

	if (isset($_GET["start"]))
		$start = $_GET["start"];
	else
		$start = 0;


	$output = array();
	for ($i=$start; $i < $start+$count; $i++) { 
		$output[]="{ id:'x$i', title:'Book $i', author:'Author'}";
	}


	echo "{ pos:".$start.", \ndata:[\n";
	echo implode(",\n", $output);
	echo "]}";
?>