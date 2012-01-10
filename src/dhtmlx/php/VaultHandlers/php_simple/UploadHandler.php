<?php
    $id  = $_GET['sessionId'];
    $id = trim($id);

    session_name($id);
    session_start();
    $inputName = $_GET['userfile'];
    $fileName  = $_FILES[$inputName]['name'];
    $tempLoc   = $_FILES[$inputName]['tmp_name'];
    echo $_FILES[$inputName]['error'];
    $target_path = 'c:\\upload\\';
    $target_path = $target_path . basename($fileName);
    if(move_uploaded_file($tempLoc,$target_path))
    {        $_SESSION['value'] = -1;    }
?>
