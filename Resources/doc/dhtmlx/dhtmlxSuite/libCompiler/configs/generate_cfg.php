<?php

class SkinConfig {

	protected $pathToMain;

	public function __construct($pathToMain) {
		$this->current_path = getcwd();
		chdir('..');
		$this->pathToMain = $pathToMain;
		$skins = Array(
			'dhx_black' => Array(),
			'dhx_blue' => Array(),
			'dhx_skyblue' => Array(),
			'dhx_web' => Array()
		);
		$components = $this->getComponents($pathToMain);

		foreach ($skins as $skin => $files) {
			for ($i = 0; $i < count($components); $i++) {
				$images = $this->getComponentSkinConfig($pathToMain.'/'.$components[$i].'/codebase/imgs', $skin);
				$skins[$skin][$components[$i]] = $images;
			}
		}
		for ($i = 0; $i < count($components); $i++) {
			$images = $this->getMainFiles($pathToMain.'/'.$components[$i].'/codebase/imgs');
			$skins['main'][$components[$i]] = $images;
		}


		foreach ($skins as $skin_name => $skin) {
			$list = "";
			foreach ($skin as $component => $files) {
				$list .= $component.":\n";
				for ($i = 0; $i < count($files); $i++) {
					$list .= $files[$i]."\n";
				}
				$list .= "\n";
			}
			file_put_contents($this->current_path.'/'.$skin_name.".txt", $list);
			echo "<b>Skin:</b>".$this->current_path.'/'.$skin_name.".txt<br>";
		}

		$this->getIconsets($pathToMain."/dhtmlxTree/codebase/imgs");
	}

	public function getComponents($main_dir) {
		$components = Array();
		$dir = opendir($main_dir);
		while ($file = readdir($dir)) {
			if (($file == '.')||($file == '..')||($file == '.svn')) {
				continue;
			}
			if (is_dir($main_dir.'/'.$file.'/codebase/imgs')) {
				$components[] = $file;
			}
		}
		return $components;
	}

	public function getComponentSkinConfig($directory, $skin) {
		$images = Array();
		$dir = opendir($directory);
		while ($file = readdir($dir)) {
			if (($file == '.')||($file == '..')||($file == '.svn')) {
				continue;
			}
			if ((is_dir($directory.'/'.$file))&&(strpos(strtolower($file), strtolower($skin)) !== false)) {
				$images = $this->getFilesList($directory.'/'.$file);
			}
		}
		return $images;
	}

	public function getFilesList($directory) {
		$files = Array();
		$dir = opendir($directory);
		while ($file = readdir($dir)) {
			if (($file == '.')||($file == '..')||($file == '.svn')) {
				continue;
			}
			if (is_dir($directory.'/'.$file)) {
				$sub = $this->getFilesList($directory.'/'.$file);
				for ($i = 0; $i < count($sub); $i++) {
					$files[] = $sub[$i];
				}
			} else {
				$files[] = $directory.'/'.$file;
			}
		}
		return $files;
	}

	public function getMainFiles($directory) {
		$files = Array();
		$dir = opendir($directory);
		while ($file = readdir($dir)) {
			if (($file == '.')||($file == '..')||($file == '.svn')) {
				continue;
			}
			if (is_file($directory.'/'.$file)) {
				$files[] = $directory.'/'.$file;
			}
		}
		return $files;
	}


	public function getIconsets($directory, $name = 'default') {
		$files = Array();
		$dir = opendir($directory);
		while ($file = readdir($dir)) {
			if (($file == '.')||($file == '..')||($file == '.svn')) {
				continue;
			}
			if (is_file($directory.'/'.$file)) {
				$files[] = $directory.'/'.$file;
			} else {
				$this->getIconsets($directory."/".$file, $file);
			}
		}
		$text = implode("\n", $files);
		file_put_contents($this->current_path.'/'.$name.".txt", $text);
		echo "<b>Iconset:</b>".$this->current_path.'/'.$name.".txt<br>";
		return $files;
	}

}

$cfg = new SkinConfig("..");

?>