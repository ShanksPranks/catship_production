<?php
$myfile = fopen("myJson.json", "w") or die("Unable to open file!");
$jsonObject = $_POST["jsonObject"];
echo $_POST['jsonObject'];
fwrite($myfile, $jsonObject);
fclose($myfile);
?>