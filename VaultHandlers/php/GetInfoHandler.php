<?php
    $id = $_POST['sessionId'];
    $id = trim($id);
    session_name($id);
    session_start();

    if($_SESSION['dhxvlt_state']==-1)
    {
	// -1 is set in UploadHandler.php after a successful upload
	// send 100% back and mark state for invalidation
    	echo 100;
	$_SESSION['dhxvlt_state'] = -2;

    } else if($_SESSION['dhxvlt_state']==-2)
    {
	// -2 is set above to invalidate current upload session
    	echo -1;
        session_destroy();

    } else if($_SESSION['dhxvlt_state']==-3)
    {
	// -3 is set in UploadHandler.php in case of some error (like filename encoding, "post_max_size" oversized).
	$maxPost = ini_get('post_max_size');
    	echo "error:-3:$maxPost:";
        session_destroy();

    } else {

	$info = uploadprogress_get_info($id);
	$bt = $info['bytes_total'];
	
	if ($bt < 1) {
		$percent = 0;
	} else {
		if (!$_SESSION['dhxvlt_max']) {
			// check the upload_max_filesize config value
			$_SESSION['dhxvlt_max'] = true;
			$maxSizeM = ini_get('upload_max_filesize');
			$maxSize = return_bytes($maxSizeM);
			if ($maxSize<$bt) {
				$_SESSION['dhxvlt_state'] = -2;
				echo "error:-2:$bt:$maxSizeM:";
				exit;
			}
		}
		$percent = round($info['bytes_uploaded'] / $bt * 100, 0);
	}
	echo $percent;
    }	

function return_bytes($val) {
    $val = trim($val);
    $last = strtolower($val[strlen($val)-1]);
    switch($last) {
        case 'g':
            $val *= 1024;
        case 'm':
            $val *= 1024;
        case 'k':
            $val *= 1024;
    }

    return $val;
}
?>

