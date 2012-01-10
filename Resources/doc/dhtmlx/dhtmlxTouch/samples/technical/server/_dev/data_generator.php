<?php

function generate_user() {

	$cities = Array("Tokyo-Yokohama", "New York", "Sao Paulo", "Seoul-Incheon", "Mexico City", "Osaka-Kobe-Kyoto", "Manila", "Mumbai",
				"Jakarta", "Lagos", "Kolkata", "Delhi","Cairo","Los Angeles","Buenos Aires","Rio de Janeiro", "Moscow", "Shanghai,",
				"Karachi", "Paris", "Nagoya", "Istanbul");
	$names = Array(
		"Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia", "Alexander", "Sophia", "William", "Ava", "Joshua", "Emily",
		"Daniel", "Madison", "Jayden", "Abigail", "Noah", "Chloe", "Anthony", "Mia");

	$user = Array();
	$user['name'] = $names[rand(0, count($names) - 1)];
	$user['age'] = rand(18, 65);
	$user['group_name'] = rand(0, 4);
	switch ($user['group_name']) {
		case 0:
			$user['group_name'] = 'elementary';
			break;
		case 1:
			$user['group_name'] = 'preintermediate';
			break;
		case 2:
			$user['group_name'] = 'intermediate';
			break;
		case 3:
			$user['group_name'] = 'upperintermediate';
			break;
		case 4:
			$user['group_name'] = 'advanced';
			break;
	}
	$user['city'] = $cities[rand(0, count($cities) - 1)];
	$user['phone'] = rand(0,9).rand(0,9).rand(0,9).'-'.rand(0,9).rand(0,9).'-'.rand(0,9).rand(0,9);
	$user['sex'] = rand(0, 1);
	$user['sex'] = ($user['sex'] == 0) ? 'female' : 'male';
	$user['driver_license'] = rand(0, 1);
	return $user;
}

if (!$db = sqlite_open('db', 0777, $sqliteerror)) {
	die($sqliteerror);
}
sqlite_query("DROP TABLE users", $db);
sqlite_query("CREATE TABLE users (id INTEGER PRIMARY KEY, name varchar(100), age int, group_name varchar(25), city varchar(50), phone varchar(20), sex varchar(6), driver_license bool)", $db);

echo "<pre>";
for ($i = 0; $i < 20; $i++) {
	$user = generate_user();
	$query = "INSERT INTO 'users' VALUES(null, '{$user['name']}','{$user['age']}','{$user['group_name']}','{$user['city']}','{$user['phone']}','{$user['sex']}','{$user['driver_license']}')";
	$sql = "INSERT INTO touch_users(id, name, age, group_name, city, phone, sex, driver_license) VALUES(0, '{$user['name']}','{$user['age']}','{$user['group_name']}','{$user['city']}','{$user['phone']}','{$user['sex']}','{$user['driver_license']}')";
	echo $sql.";\n";
	sqlite_query($query, $db);
}

?>