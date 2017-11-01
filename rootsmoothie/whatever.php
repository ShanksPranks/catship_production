<?php

//$json = file_get_contents('php://input');
//$action = json_decode($webhook, true);

$webhookContent = "";

$webhook = fopen('php://input' , 'rb');
while (!feof($webhook)) {
    $webhookContent .= fread($webhook, 4096);
}
fclose($webhook);

$headers = array();

		foreach($_SERVER as $key => $value)
		{
			if(substr($key, 0, 5) <> 'HTTP_') { continue; }
			$header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
			$headers[$header] = $value;
		}


$results = print_r($headers, true); // $results now contains output from print_r

file_put_contents('filename.txt', print_r($results, true));

//$json = file_get_contents('php://input');
//$action = json_decode($json, true);

$acoount_id = $_POST['payload']['subscription']['customer']['reference'];

//$content = "some text here".$webhookContent; $fp = fopen($_SERVER['DOCUMENT_ROOT'] . "/myText.txt","wb"); fwrite($fp,$content); fclose($fp);
//error_log($webhookContent);

$myfile = fopen("smoothie.json", "w") or die("Unable to open file smoothie!");
//$jsonObject = $_POST["jsonObject"];
//echo $_POST['jsonObject'];
fwrite($myfile, $webhookContent);
fclose($myfile);

$myfile2 = fopen("smoothie2.json", "w") or die("Unable to open file smoothie2!");
//$jsonObject = $_POST["jsonObject"];
//echo $_POST['jsonObject'];
fwrite($myfile2, $acoount_id);
fclose($myfile2);

?>