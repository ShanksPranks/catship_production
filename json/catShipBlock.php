<?php

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

// end point where user posts the new valid transaction
$catShipBlock       = $_POST["jsonObject"];
$catShipBlockObject = json_decode($catShipBlock, true); // make a json object
// there is no need to validate the new transaction server side as peers will validate

// get the existing transaction pool
$catShipBlockChainFileName = "catShipBlockChain.json";

// do a head fake to create this fiel if it doesent exist because php doesent have a read/write, create if not exists
if (!file_exists($catShipBlockChainFileName)) {
    $file = fopen($catShipBlockChainFileName, "w");
    fclose($file);
}

$catShipBlockChainFile = fopen($catShipBlockChainFileName, "r+") or die("Unable to open file!");

$catShipBlockChainString = file_get_contents($catShipBlockChainFileName);
$catShipBlockChainObject = json_decode($catShipBlockChainString, true); // make a json object

if (empty($catShipBlockChainObject)) {
    error_log("file object was null");
    //error_log($catShipBlockChainObject[0]["senderAddress"]);
    $catShipBlockChainObject = array(
        $catShipBlockObject
    );
} else {
    error_log("file object was not null, pushing");
    //error_log($catShipBlockChainObject[0]["senderAddress"]);
    array_push($catShipBlockChainObject, $catShipBlockObject);
}
;

// turn object back into string
$catShipBlockChainString = json_encode($catShipBlockChainObject);

// write and close the file
fwrite($catShipBlockChainFile, $catShipBlockChainString);
fclose($catShipBlockChainFile);

?>