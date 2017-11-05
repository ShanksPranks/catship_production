<?php

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

use BitcoinPHP\BitcoinECDSA\BitcoinECDSA;
require_once("BitcoinECDSA.php");

// 
require_once("src\Object.php");
require_once("src\Number.php");
require_once("src\Math.php");

require_once("src\Secp192k1.php");
require_once("src\Secp256k1.php");
require_once("src\Point.php");

require_once("src\ASN1.php");
require_once("src\Key.php");
require_once("src\BC.php");
require_once("src\Binary.php");
require_once("src\GMP.php");

require_once("src\Signature.php");
require_once("src\Sin.php");
require_once("src\Wallet.php");

use Phactor\Key;

/*
$key = new \Phactor\Key;
$info = $key->GenerateKeypair();

$sig = new \Phactor\Signature;
$signature = $sig->generate('040f0da4f9bc680319671277d3bf311f855fffdfacf5d1fdc8bf750f5cf022c9445503f1e6675ec6abd0e892de702851869eec8144a22ae83e6e8497fc12c63e04040f0da4f9bc680319671277d3bf311f855fffdfacf5d1fdc8bf750f5cf022c9445503f1e6675ec6abd0e892de702851869eec8144a22ae83e6e8497fc12c63e04freshly minted kitty goodness1001509889383706', 'e56d40bb4f1f5e702cb644ef69bda15aa374a8a7284b13a59ba1550e000b091f');

error_log('this shitty libraries signature:');
error_log($signature);
*/

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

$transactionPlainText = $MoreNothingSpecial.$catShipGameObject["minerAddressIn"].'freshly minted kitty goodness'.$catShipGameObject["coinRewardIn"].$catShipGameObject["utcTimeStamp"];
error_log('transactionPlainText:');
error_log($transactionPlainText);

$sig = new \Phactor\Signature;
$signature = $sig->generate($transactionPlainText, $NothingSpecial);

// generate a signature using shitty bitcoin one
/*
$bitcoinECDSA = new BitcoinECDSA();
error_log("set priv key");
$bitcoinECDSA->setPrivateKey($NothingSpecial);
error_log("sign mess");
$signature = $bitcoinECDSA->signMessage($transactionPlainText, true);
error_log("completed");
error_log($signature);
*/
echo $signature;
?>