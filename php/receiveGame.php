<?php
ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");
use BitcoinPHP\BitcoinECDSA\BitcoinECDSA;
require_once ("BitcoinECDSA.php");

//

require_once ("src\Object.php");

require_once ("src\Number.php");

require_once ("src\Math.php");

require_once ("src\Secp192k1.php");

require_once ("src\Secp256k1.php");

require_once ("src\Point.php");

require_once ("src\ASN1.php");

require_once ("src\Key.php");

require_once ("src\BC.php");

require_once ("src\Binary.php");

require_once ("src\GMP.php");

require_once ("src\Signature.php");

require_once ("src\Sin.php");

require_once ("src\Wallet.php");

use Phactor\Key;

/* -----------------------------------------------------------------------------
** This function will sign a catship game turning it into a valid coinbase transaction
The mission here is to use a mathematical algorithm to generate these signatures and
not just a private key on a server.
having a  private key on a server is no better security than a regular bank.
A good algorithm could be something obscure using nonce, time drift, eliptic curves etc.

transactionPlainText = 'catShipCoinBase' + receiverAddress + 'freshly minted kitty goodness' + value + utcTimeStamp;

** -------------------------------------------------------------------------- */
$NothingSpecial = '7bcb894d9e88a6c10d800537976a0aabe3b2c2f429551164ef37f2bcaf31d736';
$MoreNothingSpecial = '04ce828291cad2e744a27daf8548774ea17f8d789e76f854a338cecf50bb404959c327ffd0ac6fa8c26b8546c2d08f34940e70e9e7312742fe22aa1d6cc72f299f';

// The catship game server side will call this function with a cryptic object and the object gets
// signed and sent to the node and is checked for validity

$ip = getenv('HTTP_CLIENT_IP')?:
getenv('HTTP_X_FORWARDED_FOR')?:
getenv('HTTP_X_FORWARDED')?:
getenv('HTTP_FORWARDED_FOR')?:
getenv('HTTP_FORWARDED')?:
getenv('REMOTE_ADDR');

error_log('players ip address');
error_log($ip);

$catShipGame = $_POST["jsonObject"];
$catShipGameObject = json_decode($catShipGame, true); // make a json object


foreach($catShipGameObject as $key => $value)
	{
			error_log('looping through keys');
			error_log($key);
			error_log($value);
	};


$transactionPlainText = $MoreNothingSpecial.$catShipGameObject["minerAddressIn"].'cats in space'.$catShipGameObject["score"].$catShipGameObject["utcTimeStamp"];
error_log('transactionPlainText:');
error_log($transactionPlainText);

$sig = new \Phactor\Signature;
$signature = $sig->generate($transactionPlainText, $NothingSpecial);

echo $signature;

?>
