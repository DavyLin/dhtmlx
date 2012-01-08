<?php
    $id = uniqid('id');
    session_name($id);
    session_start();
    $_SESSION['dhxvlt_state'] = 0;
    echo $id;
?>
