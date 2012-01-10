<?php

// create sqlite database connection
if (!$db = sqlite_open('db', 0777, $sqliteerror)) {
	die($sqliteerror);
}

// take option from $_GET or set default action "get"
$action = isset($_GET['action']) ? $_GET['action'] : "get";

// select function by action
switch ($action) {
	case 'get':
		echo get($db);
		break;
	case 'insert':
		echo add($db);
		break;
	case 'delete':
		echo delete($db);
		break;
	case 'update':
		echo update($db);
		break;
}

// returns list of users records as json
function get($db) {
	// takes all records from database
	$result = sqlite_query($db, 'SELECT * FROM users');
	$users = Array();
	while ($user = sqlite_fetch_array($result))
		$users[] = $user;
	// generate json
	$json = Array();
	for ($i = 0; $i < count($users); $i++) {
		$rec = "{";
		$rec .= 'id: "'.$users[$i]['id'].'",';
		$rec .= 'name: "'.$users[$i]['name'].'",';
		$rec .= 'age: "'.$users[$i]['age'].'",';
		$rec .= 'group: "'.$users[$i]['group_name'].'",';
		$rec .= 'city: "'.$users[$i]['city'].'",';
		$rec .= 'phone: "'.$users[$i]['phone'].'",';
		$rec .= 'sex: "'.$users[$i]['sex'].'",';
		$rec .= 'driver_license: "'.$users[$i]['driver_license'].'"';
		$rec .= "}";
		$json[] = $rec;
	}
	$json = '['.implode(',', $json).']';
	return $json;
}

// add user to database
function add($db) {
	// takes data from POST array
	$name = $_POST['name'];
	$age = $_POST['age'];
	$group_name = $_POST['group'];
	$city = $_POST['city'];
	$phone = $_POST['phone'];
	$sex = $_POST['sex'];
	$driver_license = $_POST['driver_license'];
	// add to database
	$query = "INSERT INTO 'users' VALUES(null, '{$name}','{$age}','{$group_name}','{$city}','{$phone}','{$sex}','{$driver_license}')";
	$result = sqlite_query($query, $db);
	if ($result) return sqlite_last_insert_rowid($db);
	
	return "false";
}

// delete user record from database
function delete($db) {
	if (isset($_POST['id'])) {
		$result = sqlite_query("DELETE FROM users WHERE id='{$_POST['id']}'", $db);
		if ($result)
			return "true";
	}
	return "false";
}

// update user record in database
function update($db) {
	if (isset($_POST['id'])) {
		// takes data from POST array
		$id = $_POST['id'];
		$name = $_POST['name'];
		$age = $_POST['age'];
		$group_name = $_POST['group'];
		$city = $_POST['city'];
		$phone = $_POST['phone'];
		$sex = $_POST['sex'];
		$driver_license = $_POST['driver_license'];
		// update query
		$query = "UPDATE users SET name='{$name}', age='{$age}', group_name='{$group_name}', city='{$city}', phone='{$phone}', sex='{$sex}', driver_license='{$driver_license}' WHERE id='{$id}'";
		$result = sqlite_query($query, $db);
		return "true";
	}
	return "false";
}


// Database creation queries
//	sqlite_query("DROP TABLE users", $db);
//	sqlite_query("CREATE TABLE users (id INTEGER PRIMARY KEY, name varchar(100), age int, group_name varchar(25), city varchar(50), phone varchar(20), sex varchar(6), driver_license bool)", $db);
//	sqlite_query("INSERT INTO 'users' VALUES(null,'Rodion Snegov',25,'elementary','Moscow','111 11 11','male',1)", $db);
//	sqlite_query("INSERT INTO 'users' VALUES(null,'Izmail Alexandrov',31,'preintermediate','Minsk','222 22 22','male',1)", $db);
//	sqlite_query("INSERT INTO 'users' VALUES(null,'Anna Genova',22,'intermediate','Vancouver','333 33 33','female',0)", $db);
//	sqlite_query("INSERT INTO 'users' VALUES(null,'Mark Norsten',41,'upperintermediate','Mexico','444 44 44','male',0)", $db);

?>