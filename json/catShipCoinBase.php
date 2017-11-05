<?php

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

//use BitcoinPHP\BitcoinECDSA\BitcoinECDSA;
include 'BitcoinECDSA.php';
//require_once("BitcoinECDSA.php");

/* -----------------------------------------------------------------------------
** This function will sign a catship game turning it into a valid coinbase transaction
   The mission here is to use a mathematical algorithm to generate these signatures and 
   not just a private key on a server.
   having a  private key on a server is no better security than a regular bank.
   A good algorithm could be something obscure using nonce, time drift, eliptic curves etc.
    
   transactionPlainText = 'catShipCoinBase' + receiverAddress + 'freshly minted kitty goodness' + value + utcTimeStamp;

** -------------------------------------------------------------------------- */

$NothingSpecial = 'e56d40bb4f1f5e702cb644ef69bda15aa374a8a7284b13a59ba1550e000b091f';
$MoreNothingSpecial = '040f0da4f9bc680319671277d3bf311f855fffdfacf5d1fdc8bf750f5cf022c9445503f1e6675ec6abd0e892de702851869eec8144a22ae83e6e8497fc12c63e04';

// The catship game server side will call this function with a cryptic object and the object gets
// signed and sent to the node and is checked for validity

$catShipGame = $_POST["jsonObject"];
$catShipGameObject = json_decode($catShipGame, true); // make a json object
// minerAddressIn : 
// coinRewardIn : 
// 4 :

foreach($catShipGameObject as $key => $value)
{
error_log('looping through keys');
error_log($key);
error_log($value);
}

$transactionPlainText = 'catShipCoinBase'.$catShipGameObject["minerAddressIn"].'freshly minted kitty goodness'.$catShipGameObject["coinRewardIn"].$catShipGameObject["utcTimeStamp"];
error_log($transactionPlainText);

// generate a signature
$bitcoinECDSA = new BitcoinECDSA();
$bitcoinECDSA->setPrivateKey($NothingSpecial);
$signature = $bitcoinECDSA->signMessage($transactionPlainText);
error_log($signature);

return $signature;
?>