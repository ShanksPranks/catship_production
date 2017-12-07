<?php

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

use BitcoinPHP\BitcoinECDSA\BitcoinECDSA;
require_once("BitcoinECDSA.php");

include "../php/src/Object.php";
include "../php/src/Number.php";
include "../php/src/Math.php";
include "../php/src/Secp192k1.php";
include "../php/src/Secp256k1.php";
include "../php/src/Point.php";
include "../php/src/ASN1.php";
include "../php/src/Key.php";
include "../php/src/BC.php";
include "../php/src/Binary.php";
include "../php/src/GMP.php";
include "../php/src/Signature.php";
include "../php/src/Sin.php";
include "../php/src/Wallet.php";

use Phactor\Key;

/* -----------------------------------------------------------------------------
** This function will sign a catship game turning it into a valid coinbase transaction
   The mission here is to use a mathematical algorithm to generate these signatures and 
   not just a private key on a server.
   having a  private key on a server is no better security than a regular bank.
   A good algorithm could be something obscure using nonce, time drift, eliptic curves etc.
    
   transactionPlainText = 'catShipCoinBase' + receiverAddress + 'freshly minted kitty goodness' + value + utcTimeStamp;

** -------------------------------------------------------------------------- */

$NothingSpecial = '7bb5ed1714ec7dff1175807989a53eb406ac09db2a9d587687774b8ed8b82fbb';
$MoreNothingSpecial = '046a8595b2b9bcf39ab9efa0ea249a57750a41e668bc27a3590439cbc760389edb24a5f9406fbcc1741dbfd4314c7565f3f87db90acb308b2992a0e08a8f816c1e';

// The catship game server side will call this function with a cryptic object and the object gets
// signed and sent to the node and is checked for validity

$catShipGame = $_POST["jsonObject"];
$catShipGameObject = json_decode($catShipGame, true); // make a json object

/*
foreach($catShipGameObject as $key => $value)
{
error_log('looping through keys');
error_log($key);
error_log($value);
}
*/

$transactionPlainText = $MoreNothingSpecial.$catShipGameObject["minerAddressIn"].'freshly minted kitty goodness'.$catShipGameObject["coinRewardIn"].$catShipGameObject["utcTimeStamp"];
//error_log('transactionPlainText:');
//error_log($transactionPlainText);

$sig = new \Phactor\Signature;
$signature = $sig->generate($transactionPlainText, $NothingSpecial);

echo $signature;
?>