<?php

include "lib/ChargifyWebhookHelper.php";

$shared_key = "MJvPsXCPS7d29BP1kGdKpgCIyAktB1jpXqcOB8McwYc"; //http://docs.chargify.com/webhooks#finding-your-site-shared-key
$post_array = $_POST;
$raw_post = file_get_contents("php://input");
$server_array = $_SERVER;

$headers = array();

		foreach($_SERVER as $key => $value)
		{
			if(substr($key, 0, 5) <> 'HTTP_') { continue; }
			$header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
			$headers[$header] = $value;
		}


$results = print_r($headers, true); // $results now contains output from print_r

file_put_contents('raw_header.txt', print_r($results, true));


//returns array('event' => string, 'payload' => array)
$request = ChargifyWebhookHelper::grabHook($shared_key, $post_array, $raw_post, $server_array);

switch($request['event'])
{
    case 'renewal_failure':
      //Handle account renewal failure, set flag on user account that should redirect them to form
      $acoount_id = $_POST['payload']['subscription']['customer']['reference'];
      break;
      
    case 'renewal_success:':
      
            $myfile = fopen("renewal.json", "w") or die("Unable to open file!");
//$jsonObject = $_POST["jsonObject"];
//echo $_POST['jsonObject'];
fwrite($myfile, $acoount_id);
fclose($myfile);
break;

}

file_put_contents('raw_post.txt', $raw_post );


?>

