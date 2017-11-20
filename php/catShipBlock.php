<?php
ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");
/* -----------------------------------------------------------------------------
** add block to block chain
** -------------------------------------------------------------------------- */

// end point where user posts the new valid transaction

$catShipBlock = $_POST["jsonObject"];
$catShipBlockObject = json_decode($catShipBlock, true); // make a json object

// there is no need to validate the new transaction server side as peers will validate
// get the existing transaction pool

$catShipBlockChainFileName = "../json/catShipBlockChain.json";

// do a head fake to create this fiel if it doesent exist because php doesent have a read/write, create if not exists

if (!file_exists($catShipBlockChainFileName))
    {
    $file = fopen($catShipBlockChainFileName, "w");
    fclose($file);
    }

$catShipBlockChainFile = fopen($catShipBlockChainFileName, "r+") or die("Unable to open file!");
$catShipBlockChainString = file_get_contents($catShipBlockChainFileName);
$catShipBlockChainObject = json_decode($catShipBlockChainString, true); // make a json object

if (empty($catShipBlockChainObject))
    {

    // error_log("file object catShipBlockChainObject was null");

    $catShipBlockChainObject = array(
        $catShipBlockObject
    );
    }
  else
    {

    // error_log("file object catShipBlockChainObject was not null, pushing");

    array_push($catShipBlockChainObject, $catShipBlockObject);
    };

// turn object back into string

$catShipBlockChainString = json_encode($catShipBlockChainObject);

// write and close the file

fwrite($catShipBlockChainFile, $catShipBlockChainString);
fclose($catShipBlockChainFile);
/* -----------------------------------------------------------------------------
** clean up the mem pool
** -------------------------------------------------------------------------- */

// get the existing transaction pool

$catShipTransactionPoolFileName = "../json/catShipTransactionPool.json";

// do a head fake to create this fiel if it doesent exist because php doesent have a read/write, create if not exists

if (!file_exists($catShipTransactionPoolFileName))
    {
    $file = fopen($catShipTransactionPoolFileName, "w");
    fclose($file);
    }

$catShipTransactionPoolFile = fopen($catShipTransactionPoolFileName, "r+") or die("Unable to open file!");
$catShipTransactionPoolString = file_get_contents($catShipTransactionPoolFileName);
$catShipTransactionPoolObject = json_decode($catShipTransactionPoolString, true); // make a json object
fclose($catShipTransactionPoolFile);
$removeTransactions = [];
$transactionArray = $catShipBlockObject["transactionArray"];



// error_log('this is the transaction array: $transactionArray');

foreach($transactionArray as $g => $q)
{
//error_log('looping through $g => $q');
//error_log($g);
//error_log($q);
foreach($q as $x => $y)
{
//error_log('looping through $x => $y');
//error_log($x);
//error_log($y);
if ($x == "transactionID")
{
array_push($removeTransactions,$y);
}
}
}


// start loop through pool

foreach($catShipTransactionPoolObject as $K => $V)
    {

    // error_log("iterating through $catShipTransactionPoolObject $K => $V");

    foreach($V as $key => $value)
        {

        // error_log("iterating through V $key => $value");
        //

        foreach($removeTransactions as $t)
            {

             //error_log("iterating through removeTransactions as $t");
             //error_log($t);
             //error_log("testing t against value");
             //error_log($value);
            if ($key == 'transactionID' && $value == $t)
                {

                // delete this particular object from the $array
                //error_log("removing item from catShipTransactionPoolObject[elementKey]");

                unset($catShipTransactionPoolObject[$K]);
                }
            }
        }
    }

// end loop through pool

$catShipTransactionPoolFile = fopen($catShipTransactionPoolFileName, "w") or die("Unable to open file!");


// turn object back into string
$catShipTransactionPoolObjectStripped = array_values($catShipTransactionPoolObject);
$catShipTransactionPoolString = json_encode($catShipTransactionPoolObjectStripped);

//$catShipTransactionPoolString = json_encode($catShipTransactionPoolObject);

// write the file

fwrite($catShipTransactionPoolFile, $catShipTransactionPoolString);

// close the file

fclose($catShipTransactionPoolFile);
?>