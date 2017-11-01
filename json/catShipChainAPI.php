<?php
$myfile = fopen("catShipChain.json", "w") or die("Unable to open file!");
$jsonObject = $_POST["catShipChain"];
$currentCatShipChain
// validate entire catshipchain here to make sure
echo $_POST['catShipChain'];
fwrite($myfile, $jsonObject);
fclose($myfile);
?>