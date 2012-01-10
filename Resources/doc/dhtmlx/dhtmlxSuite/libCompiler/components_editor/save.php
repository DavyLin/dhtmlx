<?php

require_once('config.php');

if (isset($_POST['xml'])) {
	$xml = $_POST['xml'];
	if (get_magic_quotes_gpc()) {
		$xml = stripslashes($xml);
	}
	file_put_contents($source_file, $xml);
}

?>