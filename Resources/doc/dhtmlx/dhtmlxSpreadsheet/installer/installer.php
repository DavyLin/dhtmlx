<?php

class SpreadsheetInstaller {
	
	private $dump = './installer/spreadsheet.sql';

	public function checkPHPVersion($min_version) {
		if (is_string($min_version)) {
			$min_version = (double) $min_version;
		}
		$version = (double) phpversion();
		if ($version < $min_version) {
			return false;
		} else {
			return true;
		}
	}

	public function checkWritePermissions($path, $create = false) {
		if (file_exists($path)) {
			return is_writable($path);
		} else {
			if ($create == true) {
				return mkdir($path, 0777);
			} else {
				return false;
			}
		}
	}

	public function checkDBConnection($db_host, $db_port, $db_user, $db_pass, $db_name, $db_type = 'MySQL') {
		if ($db_port !== '') {
			$db_server = $db_host.":".$db_port;
		} else {
			$db_server = $db_host;
		}
		$result = false;
		switch (strtolower($db_type)) {
			case 'mysqli':
				require_once("./codebase/connector/db_mysqli.php");
				if (function_exists("mysqli_close")) {
					@$res = new mysqli($db_server, $db_user, $db_pass, $db_name);
					if (!mysqli_connect_errno()) {
						mysqli_close($res);
						$result = true;
					}
				}
				break;
			case 'postgre':
				require_once("./codebase/connector/db_postgre.php");
				if (function_exists("pg_connect")) {
					@$res = pg_connect("host=".$db_host." port=".$db_port." dbname=".$db_name." user=".$db_user." password=".$db_pass);
					if ($res != false) {
						pg_close($res);
						$result = true;
					}
				}
				break;
			case 'oracle':
				require_once('./codebase/connector/db_oracle.php');
				if (function_exists("oci_connect")) {
					$res = oci_connect($db_user, $db_pass, $db_name);
					if ($res != false) {
						oci_close($res);
						$result = true;
					}
				}
				break;
			case 'mssql':
				require_once('./codebase/connector/db_mssql.php');
				if (function_exists("mssql_connect")) {
					@$res = mssql_connect($db_server, $db_user, $db_pass);
					if ($res != false) {
						if (mssql_select_db($db_name, $res) != false) {
							mssql_close($res);
							$result = true;
						}
					}
				}
				break;
			case 'mysql':
			default:
				@$res=mysql_connect($db_server, $db_user, $db_pass);
				if (($res)&&(mysql_select_db($db_name) != false)) {
					mysql_close($res);
					$result = true;
				}
				break;
		}
		return $result;
	}

	
	/*! creates default database structure
	 */
	public function loadDump($db_host, $db_port, $db_user, $db_pass, $db_name, $db_prefix) {
		if ($db_port !== '') {
			$db_server = $db_host.":".$db_port;
		} else {
			$db_server = $db_host;
		}
		$res = mysql_connect($db_server, $db_user, $db_pass);
		mysql_select_db($db_name, $res);

		$dump = file_get_contents($this->dump);
		$dump = str_replace("#__", $db_prefix, $dump);
		$queries = $this->dumpToQueries($dump);

		for ($i = 0; $i < count($queries); $i++) {
			$query = $queries[$i];
			$result = mysql_query($query, $res);
		}
	}


	/*! take dump content and convert it to single queries list
	 *	@param dump
	 *		dump text
	 *	@return
	 *		Array of queries
	 */
	private function dumpToQueries($dump) {
		$dump = preg_replace("/^\-\-.*$/im", "", $dump);
		$dump = preg_replace("/\/\*.*\*\//ims", "", $dump);
		$dump = preg_replace("/(\r?\n){1,}/", "$1", $dump);
		$dump = preg_split("/;\r?\n/", $dump);
		$queries = Array();
		for ($i = 0; $i < count($dump); $i++) {
			$q = trim($dump[$i]);
			if ($q != "")
				$queries[$i] = $q;
		}
		return $queries;
	}


	public function createConfigFile($filename, $db_host, $db_port, $db_user, $db_pass, $db_name, $db_prefix) {
		if ($db_port !== '') {
			$db_server = $db_host.":".$db_port;
		} else {
			$db_server = $db_host;
		}
		$config = "<?php\n\n";
		$config .= "\$db_host = '{$db_host}';\n";
		$config .= "\$db_user = '{$db_user}';\n";
		$config .= "\$db_pass = '{$db_pass}';\n";
		$config .= "\$db_name = '{$db_name}';\n";
		$config .= "\$db_prefix = '{$db_prefix}';\n";

		
		$config .= "?>";
		file_put_contents($filename, $config);
	}

	public function removeInstallFiles() {
		$this->removeDir("installer");
	}

	protected function removeDir($directory) {
		if (!file_exists($directory)) {
			return false;
		}
		$dir = opendir($directory);
		while(($file = readdir($dir))) {
			if (is_file ($directory."/".$file)) {
				unlink ($directory."/".$file);
			} elseif ((is_dir($directory."/".$file))&&($file != ".")&&($file != "..")) {
				$this->removeDir ($directory."/".$file);
			}
		}
		closedir ($dir);
		if (rmdir($directory)) {
			return true;
		} else {
			return false;
		}
	}

	public function redirectTo($url) {
		header('Location: '.$url);
	}

}

?>