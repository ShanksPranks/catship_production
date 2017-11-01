<?php

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

// end point where user posts the new valid transaction
$catShipTransaction = $_POST["jsonObject"];
$catShipTransactionObject = json_decode($catShipTransaction, true); // make a json object
// validate the new transaction server side 

// get the existing transaction pool
$catShipTransactionPoolFileName = "catShipTransactionPool.json";
$catShipTransactionPoolFile = fopen($catShipTransactionPoolFileName, "r+") or die("Unable to open file!");
$catShipTransactionPoolString = file_get_contents($catShipTransactionPoolFileName);
$catShipTransactionPoolObject = json_decode($catShipTransactionPoolString, true); // make a json object


if (empty($catShipTransactionPoolObject)) 
{
error_log("file object was null");
error_log($catShipTransactionPoolObject[0]["senderAddress"]);
$catShipTransactionPoolObject = array($catShipTransactionObject);
}
else {
error_log("file object was not null, pushing");
error_log($catShipTransactionPoolObject[0]["senderAddress"]);
array_push($catShipTransactionPoolObject, $catShipTransactionObject);
};

// turn object back into string
$catShipTransactionPoolString = json_encode($catShipTransactionPoolObject);

// write and close the file
fwrite($catShipTransactionPoolFile, $catShipTransactionPoolString);
fclose($catShipTransactionPoolFile);

?>