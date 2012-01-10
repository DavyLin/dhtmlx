<?php

require_once('config.php');
$xml = simplexml_load_file($source_file);
$result = '<tree id="0">';
for ($i = 0; $i < count($xml->item); $i++) {
	$result .= process_node($xml->item[0]);
}
$result .= '</tree>';
header('Content-type: text/xml');
echo $result;

function process_node($node) {
	$id = $node->attributes()->id;
	$open = isset($node->attributes()->open) ? $node->attributes()->open : false;
	$text = $node->itemtext;

	$dsc_nodes = $node->xpath("userdata[@name='details']");
	if (count($dsc_nodes) > 0)
		$dsc = (string) $dsc_nodes[0];
	else
		$dsc = false;
	$path = isset($node->attributes()->path) ? $node->attributes()->path : false;
	$chunk = isset($node->attributes()->chunk) ? $node->attributes()->chunk : false;
	$depends = isset($node->attributes()->depends) ? $node->attributes()->depends : false;
	$top_offset = isset($node->attributes()->topoffset) ? $node->attributes()->topoffset : false;
	$result = '<item id="'.$id.'"'.($open ? ' open ="1"' : '').($top_offset ? ' topoffset="'.$top_offset.'"' : '').'>';
	$result .= '<itemtext><![CDATA['.$text.']]></itemtext>';
	if ($path !== false)
		$result .= '<userdata name="path"><![CDATA['.$path.']]></userdata>';
	if ($chunk !== false)
		$result .= '<userdata name="chunk"><![CDATA['.$chunk.']]></userdata>';
	if ($depends !== false)
		$result .= '<userdata name="depends"><![CDATA['.$depends.']]></userdata>';
	if ($top_offset !== false)
		$result .= '<userdata name="topoffset"><![CDATA['.$top_offset.']]></userdata>';
	if ($dsc !== false)
		$result .= '<userdata name="details"><![CDATA['.$dsc.']]></userdata>';

	for ($i = 0; $i < count($node->item); $i++) {
		$result .= process_node($node->item[$i]);
	}
	$result .= '</item>';
	return $result;
}

?>
