/* -----------------------------------------------------------------------------
-- use this link to test the ECDSA signing
-- https://kjur.github.io/jsrsasign/sample/sample-ecdsa.html

 -- outstanding bug list
 -- 
 -- 
 -- outstanding features list
 -- user xperience:
 -- make wallet standalone and mobile friendly
 -- make catshipcoin addresses unique (CatShip947roihr084f)
 -- features:
 -- cancel a pending transaction
 -- create seperate clean block and validate block functions
 -- validate catshipchain function discarding invalid blocks and proposing new block height and catshipchain
 -- do the vote on block code (defaults to yes can be set to no)
 -- implement ddos protection for transactions (must get reCAPTCHA token from server ? )
 ** -------------------------------------------------------------------------- */
/* -----------------------------------------------------------------------------
 ** global variables
 ** -------------------------------------------------------------------------- */
// static
var debug = false;
var curveType = 'secp256k1'; // currently only secp256k1 supported by php library being used
var curveDigestHash = 'sha256'; // currently only sha256 supported by php library being used
var messageDigestHash = 'sha384'; //'sha384' or 'sha256';
var catShipPublicKey = '046a8595b2b9bcf39ab9efa0ea249a57750a41e668bc27a3590439cbc760389edb24a5f9406fbcc1741dbfd4314c7565f3f87db90acb308b2992a0e08a8f816c1e'; // tricky bit
var scoreBasePublicKey = '04ce828291cad2e744a27daf8548774ea17f8d789e76f854a338cecf50bb404959c327ffd0ac6fa8c26b8546c2d08f34940e70e9e7312742fe22aa1d6cc72f299f';

// parameterised
var targetBlockTime = 120; // 120 seconds
var sampleBlocks = 10;
var totalSupply = 42000000; // double what bitcoin uses
var rewardReductionBlocks = 420000; // double bitcoin 
var initialCoinReward = 50.000000000;
var minimumDifficulty = 80; // at the start any positive score will mine a block

// variables fed from the peers
var blockChainName = 'catShipBlockChain';
var transactionPoolName = 'catShipTransactionPool';
var transactionPool = [];
var catShipChain = [];
var userWallet = initializeCatShipCoinWallet();
var currentBlockHeight = 0;

// difficulty algorithm so goodly freshness
var currentDifficulty = minimumDifficulty;
var currentAvgBlockTime = 0;
var currentAvgBlockScore = 0;
// currentDifficulty = (currentAvgBlockTime / targetBlockTime) / currentAvgBlockScore

/* -----------------------------------------------------------------------------
 ** initialization code
 ** -------------------------------------------------------------------------- */

/* block chain fetch async*/
getBlockChain(blockChainName);

/* tx pool fetch async*/
getTransactionPool(transactionPoolName);

/* -----------------------------------------------------------------------------
 ** wallet ui code
 ** -------------------------------------------------------------------------- */

var app = angular.module('myApp', []);
"use strict";
app.controller('formCtrl', function($scope) {
 $scope.master = {
  PrvKey: userWallet.privateKey,
  PubKey: userWallet.publicKey,
  Balance: userWallet.balance,
  Difficulty: currentDifficulty,
  ScoreBalance: userWallet.scoreBalance,
  ScoreRemaining: userWallet.scoreRemaining
 };
 $scope.updateWallet = function() {
  userWallet.publicKey = $scope.user.PubKey;
  userWallet.privateKey = $scope.user.PrvKey;
  $scope.user.Balance = userWallet.balance;
  $scope.user.Difficulty = currentDifficulty;
  $scope.user.ScoreBalance = userWallet.scoreBalance;
  $scope.user.ScoreRemaining = userWallet.scoreRemaining;
  $scope.names = userWallet.transactionArray;
  $scope.master = angular.copy($scope.user);
 };
 $scope.sendPayment = function() {
  var newTrans = new catShipTransaction(userWallet.publicKey, $scope.user.ReceieverPubKey, $scope.user.Message, $scope.user.Amount, userWallet.privateKey, null, null);
  $scope.user.ReceieverPubKey = '';
  $scope.user.Amount = '';
  $scope.user.Message = '';
  $scope.updateWallet();
 };
 $scope.searchBlock = function() {
  var tempBlockHeight = $scope.user.BlockHeight;
  var tempSearchedBlock = {};
  for (var x in catShipChain) {
   if (x == tempBlockHeight) {
    tempSearchedBlock = catShipChain[x];
   };
  };
  $scope.SearchedBlock = tempSearchedBlock;
 };
 $scope.mineCoins = function() {
  if (userWallet.scoreRemaining > getNum(0)) {
   $scope.user.MiningStatus = 'Insufficient Score To Mine A Block!';
  } else {
   //console.log('mining for a new block...');
   // => launches the video game and returns with reward and signature
   //window.location.href = 'index.html';

   function coinBaseInput() {
    this.minerAddressIn = userWallet.publicKey;
    this.coinRewardIn = 100;
    this.utcTimeStamp = new Date().getTime();
    this.signature;
   }

   var myCoinBase = new coinBaseInput();

   $.ajax({
    type: 'POST',
    url: 'php/catShipCoinBase.php',
    data: {
     jsonObject: JSON.stringify(myCoinBase)
    },
    success: function(data) {
     myCoinBase.signature = data;
     if (debug == 1) {
      console.log('myCoinBase object');
      console.log(myCoinBase);
     }
     // If successful we can successfully mine a block
     var newBlock = new catShipBlock(myCoinBase.minerAddressIn, myCoinBase.coinRewardIn, myCoinBase.utcTimeStamp, myCoinBase.signature);
     // refetch the data fresh from the server each time
    },
    error: function(xhr, status, error) {
     console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
    },
    dataType: 'text'
   });
  }

 };
 $scope.reset = function() {
  $scope.user = angular.copy($scope.master);
 };
 $scope.reset();

});

/* -----------------------------------------------------------------------------
 ** wallet prototype
 ** -------------------------------------------------------------------------- */

function initializeCatShipCoinWallet() {

 var localWalletString = localStorage.getItem('catShipUserWallet');

 if (localWalletString == null) {
  if (debug == true) {
   console.log('did not find a user wallet, initializing a fresh one...');
  }
  var newWallet = new catShipCoinWallet();
  localWalletString = JSON.stringify(newWallet);
  localStorage.setItem('catShipUserWallet', localWalletString);
 }

 var walletObject = JSON.parse(localWalletString);
 var tempWallet = new catShipCoinWallet(walletObject.publicKey, walletObject.privateKey);

 return tempWallet;

}

// overload prototype for existing wallet
// this generic interface can use any blockchain and any mem pool in the event of a forked chain
function catShipCoinWallet(publicKeyIn, privateKeyIn) {
 this.transactionArray = [];
 this.balance = getNum(0);
 this.pendingBalance = getNum(0);
 this.scoreBalance = getNum(0);
 this.adjustedScore = getNum(0);
 this.scoreRemaining = this.adjustedScore - currentDifficulty;
 var self = this;
 // we neeed an overload here where only private key is required and pub key gets generated
 // we also need a check here to ensure keys are valid catship keys
 if ((publicKeyIn == null) && (privateKeyIn == null)) {
  var ec = new KJUR.crypto.ECDSA({
   'curve': curveType
  });
  var keypair = ec.generateKeyPairHex();
  this.publicKey = keypair.ecpubhex; // hexadecimal string of EC public key
  this.privateKey = keypair.ecprvhex; // hexadecimal string of EC private key (=d)
 } else {
  this.publicKey = publicKeyIn;
  this.privateKey = privateKeyIn;
 };

 this.overwriteWallet = function() {
   if (confirm("Wallet keys have changed, do you want to overwrite your wallet with the new keys?") == true) {
    return true;
   } else {
    return false;
   }
  }
  // populates the wallet transaction array and also updates the balances
  // will refresh the wallet UI each time called as the last step
 this.fetchTransactions = function(refreshUIFlag) {



   self.transactionArray = [];
   self.balance = getNum(0);
   self.pendingBalance = getNum(0);
   self.scoreBalance = getNum(0);
   self.scoreRemaining = getNum(0);

   // first step check if the wallet information has changed
   var localWalletString = localStorage.getItem('catShipUserWallet');
   var walletObject = JSON.parse(localWalletString);
   if (((walletObject.publicKey != self.publicKey) || (walletObject.privateKey != self.privateKey)) && self.privateKey != 'unknown') {
    console.log(walletObject);
    console.log(self);
    console.log(transactionPool);
    var tempOverwrite = self.overwriteWallet();
    if (tempOverwrite == true) {
     var tempWalletString = JSON.stringify(self);
     localStorage.setItem('catShipUserWallet', tempWalletString);
    }
   };

   var credits = [];
   var debits = [];

   // loop through all the blocks filtering out users address transactions
   for (var x in catShipChain) {
    /* ES6 the world is not ready for this yet */
    //credits = catShipChain[x].transactionArray.filter(trans => trans.receiverAddress == this.publicKey);
    //debits = catShipChain[x].transactionArray.filter(trans => trans.senderAddress == this.publicKey);

    credits = catShipChain[x].transactionArray.filter(function(trans) {
     return trans.receiverAddress == self.publicKey;
    });
    debits = catShipChain[x].transactionArray.filter(function(trans) {
     return trans.senderAddress == self.publicKey;
    });

    // add credits one by one to get balance (change to map reduce)
    for (var k = 0; k < credits.length; k++) {
     if (credits[k].senderAddress != scoreBasePublicKey) {
      self.transactionArray.push(credits[k]);
      self.balance += getNum(credits[k].value);
     }
    }

    // add debits one by one to get balance (change to map reduce)
    for (var k = 0; k < debits.length; k++) {
     if (debits[k].senderAddress != scoreBasePublicKey) {
      self.transactionArray.push(debits[k]);
      self.balance -= getNum(debits[k].value);
     }
    }

   } // for (var x in catShipChain) {

   // also add any pending transactions
   for (var x in transactionPool) {
    if (transactionPool.hasOwnProperty(x)) {
     if (transactionPool[x].senderAddress == self.publicKey) {
      self.transactionArray.push(transactionPool[x]);
      self.balance -= getNum(transactionPool[x].value);
      self.pendingBalance -= getNum(transactionPool[x].value);
     }
     if (transactionPool[x].receiverAddress == self.publicKey) {
      if (transactionPool[x].senderAddress == scoreBasePublicKey) {
       self.scoreBalance += getNum(transactionPool[x].value);
       self.scoreRemaining -= getNum(transactionPool[x].value);
      } else {
       self.transactionArray.push(transactionPool[x]);
       self.balance += getNum(transactionPool[x].value);
       self.pendingBalance += getNum(transactionPool[x].value);
      }
     }
    }
   }
   // end for (var x in transactionPool) 
   if (refreshUIFlag == true) {
    // will get the current difficulty 
    getCurrentAvgBlockStats();
    self.scoreRemaining = parseInt(currentDifficulty - self.scoreBalance);

    //refresh the ui.
    var walletElement = document.getElementById('wallet');
    if (walletElement != null) {
     var scope = angular.element(walletElement).scope();
     scope.user.Balance = getNum(self.balance);
     scope.user.ScoreBalance = getNum(self.scoreBalance);
     scope.user.ScoreRemaining = getNum(self.scoreRemaining);
     scope.user.Difficulty = parseInt(currentDifficulty);
     scope.names = self.transactionArray;
     scope.updateWallet();
     //scope.reset();
     scope.$apply();
    }
   }

  } // end this.fetchTransactions(){


};

/* -----------------------------------------------------------------------------
 ** transaction prototype
 ** -------------------------------------------------------------------------- */

// this is a prototype of a catship transaction, users will send stuff to each other by playing games and interacting
function catShipTransaction(senderAddressIn, receiverAddressIn, messageIn, valueIn, prvhexIn, signatureIn, utcTimeStampIn) {
 this.senderAddress = senderAddressIn; // sender public key
 this.receiverAddress = receiverAddressIn; // receiver public key
 this.message = messageIn; // any message they want to write to the blockchain up to 128 chars
 this.value = valueIn; // amount being transfered
 this.isValid = false;

 if (utcTimeStampIn == null) {
  this.utcTimeStamp = new Date().getTime();
 } else {
  this.utcTimeStamp = utcTimeStampIn;
 }

 this.isPending = true;
 this.blockHeight;
 this.transactionPlainText = this.senderAddress + this.receiverAddress + this.message + this.value + this.utcTimeStamp;

 // if this is a coin base transaction the signature will be pre-provided 
 if (signatureIn != null) {
  this.signature = signatureIn;
 } else {
  // sign the plain text of the entire transaction 
  this.signature = signPlainText(this.transactionPlainText, prvhexIn)
 }
 // now we hash the transaction including the signature to create the transaction ID
 var transactionPlainTextPlusSig = this.transactionPlainText + this.signature;
 this.transactionID = digestMessage(transactionPlainTextPlusSig);
 validateTransaction(this);

 // add the transaction to the local mem pool
 if (this.isValid == true && this.senderAddress != catShipPublicKey) {
  transactionPool.push(this); // will not replace a transaction if one already exists
 }

 if (debug == true) {
  console.log('broadcasting transaction isValid, senderAddress ...');
  console.log(this.isValid);
  console.log(this.senderAddress);
 }

 // broadcast the transaction to the network
 if (this.isValid == true && this.senderAddress != 'catShipCoinBase') {

  $.ajax({
   type: 'POST',
   url: 'php/catShipTransaction.php',
   data: {
    jsonObject: JSON.stringify(this)
   },
   success: function(data) {
    if (debug == true) {
     console.log('successfull post of transaction:');
     console.log(data);
    }
    getTransactionPool(transactionPoolName);
   },
   error: function(xhr, status, error) {
    console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
   },
   dataType: 'text'
  });
 }

}

function validateTransaction(catShipTransactionIn) {
 if (debug == true) {
  console.log('validating transaction...');
  console.log(catShipTransactionIn);
 }
 // check balance of sender is sufficient
 var validationCount = 0;
 var senderBal = getUserBalance(catShipTransactionIn.senderAddress);
 if (debug == true) {
  console.log('sender bal: ' + senderBal);
  console.log('catShipTransactionIn.value: ' + catShipTransactionIn.value);
  console.log('catShipPublicKey ' + catShipPublicKey);
  console.log('catShipTransactionIn.senderAddress: ' + catShipTransactionIn.senderAddress);
 }
 if ((senderBal >= catShipTransactionIn.value) || (catShipTransactionIn.senderAddress == catShipPublicKey) || (catShipTransactionIn.senderAddress == scoreBasePublicKey)) {
  validationCount += 1;
 };
 // check that the transaction amount is > 0
 if (getNum(catShipTransactionIn.value) > getNum(0)) {
  validationCount += 2;
 }

 // check that the user is not sending it to themselves                        
 if (String(catShipTransactionIn.senderAddress) != String(catShipTransactionIn.receiverAddress)) {
  validationCount += 4;
 }

 // check the destination address is valid
 // not sure how to do this in the library yet???
 validationCount += 8;

 // check the signature validates against the public key (sender address)
 var result = validateSignature(catShipTransactionIn.transactionPlainText, catShipTransactionIn.signature, catShipTransactionIn.senderAddress);

 if (result == true) {
  validationCount += 16;
 };

 if (validationCount == 31) {
  catShipTransactionIn.isValid = true;
  var scope = angular.element(document.getElementById('send')).scope();
  scope.user.TransactionStatus = 'Success!';

 } else {
  var scope = angular.element(document.getElementById('send')).scope();
  scope.user.TransactionStatus = 'Failed! Error Code: ' + validationCount;
  if (debug == true) {
   console.log('the error code receieved from the system was: ' + validationCount);
  }
 };

}

/* -----------------------------------------------------------------------------
 ** block prototype
 ** -------------------------------------------------------------------------- */

// the prototype for the transaction block
function catShipBlock(minerAddressIn, coinRewardIn, utcTimeStampIn, signatureIn) {

 this.isValid = false;
 this.utcTimeStamp = utcTimeStampIn;
 this.elapsedTimeSincePreviousBlock = 0;
 this.scoreToMineBlock = 0;
 // lets send the miner reward trans 
 //function catShipTransaction(senderAddressIn, receiverAddressIn, messageIn, valueIn, prvhexIn, signatureIn, utcTimeStampIn)
 var coinbaseTransaction = new catShipTransaction(catShipPublicKey, minerAddressIn, 'freshly minted kitty goodness', coinRewardIn, null, signatureIn, utcTimeStampIn);

 this.transactionArray = [];

 // the gameScoreArray contains the best scores each miner achieved for this block
 // here we really test the honesty of miners and can block miners who arent accepting scores

 currentBlockHeight = getCurrentBlockHeight();


 if (currentBlockHeight == null) {
  this.blockHeight = parseInt(0);
 } else {
  this.blockHeight = parseInt(currentBlockHeight) + 1;
 }


 // add coinbase height and committed
 coinbaseTransaction.blockHeight = this.blockHeight;
 coinbaseTransaction.isPending = false;
 // now add the coin base reward
 this.transactionArray.push(coinbaseTransaction);

 // previous block hash makes the merkle tree
 if (!(catShipChain[currentBlockHeight] == null)) {
  this.previousBlockID = catShipChain[currentBlockHeight].blockID;
  // get time elapsed since last block
  this.elapsedTimeSincePreviousBlock = this.utcTimeStamp / 1000 - catShipChain[currentBlockHeight].utcTimeStamp / 1000;
 }

 // add all the transactions currently in the pool
 for (var x in transactionPool) {
  if (transactionPool.hasOwnProperty(x)) {
   // needs to be atomic!!! get lock,  add, delete from mempool, release lock
   transactionPool[x].blockHeight = this.blockHeight;
   transactionPool[x].isPending = false;

   if (transactionPool[x].isValid == true) {
    // don't include other peoples scores in the block, leave them in the mem pool
    if ((transactionPool[x].senderAddress != scoreBasePublicKey) || (transactionPool[x].receiverAddress == minerAddressIn)) {
     this.transactionArray.push(transactionPool[x]);
     // the miners scores must all be added to the block
     if (transactionPool[x].senderAddress == scoreBasePublicKey) {
      this.scoreToMineBlock += transactionPool[x].value;
     }
     delete transactionPool[x];
    }
   }
  }
 }

 // the block game hash is an sha384 hash of block height and previous block id so should be the same for all miners, this allows miners to be on an even footing when solving the puzzle
 // miners will use a nonce + blockGameHash to mine. 

 // once the block has been solved the entire thing gets hashed and added to the blockchain to make it immutable
 this.calculateBlockID = function() {

  var transactionArrayString = JSON.stringify(this.transactionArray);
  var gameScoreArrayString = JSON.stringify(this.gameScoreArray);
  var blockPlainText = transactionArrayString + gameScoreArrayString + this.blockGameHash;
  // hash the solved block
  this.blockID = digestMessage(blockPlainText);

 }

 this.calculateBlockID();

 // validate all the transactions in this block
 validateCatShipBlock(this);

 // now that we have a valid blcok lets transmit it to the network
 if (this.isValid == true) {

  $.ajax({
   type: 'POST',
   url: 'php/catShipBlock.php',
   data: {
    jsonObject: JSON.stringify(this)
   },
   success: function(data) {
    getBlockChain(blockChainName);
    getTransactionPool(transactionPoolName);
    var scope = angular.element(document.getElementById('mine')).scope();
    var newHeight = parseInt(currentBlockHeight) + parseInt(1);
    scope.user.MiningStatus = 'Congrats! You successfully mined block: ' + newHeight;
    if (debug == true) {
     console.log('successfull post of catship block:');
     console.log(data);
    }
   },
   error: function(xhr, status, error) {
    console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
   },
   dataType: 'text'
  });

 }

}

/* -----------------------------------------------------------------------------
 ** block util
 ** -------------------------------------------------------------------------- */
// will prune the blockchain down to a single genesis with all balances as outputs
function rebaseBlockChain(blockchainNameIn) {
 var userArray = [];
 // populate a coinbase transaction for each users balance.
 //foreach(catShipChain)
}

function validateCatShipBlock(CatShipBlockIn) {
 var tempHash = CatShipBlockIn.blockID;

 if (debug == true) {
  console.log('validating the block...');
  console.log(CatShipBlockIn);
  console.log('old block of hash...');
  console.log(tempHash);
  console.log('from the horses mouth...');
  console.log(CatShipBlockIn.blockID);
 }
 // step 1 audit all the transactions in the block to make sure all of them are valid
 for (var i = 0; i < CatShipBlockIn.transactionArray.length; i++) {
  validateTransaction(CatShipBlockIn.transactionArray[i]);
 }
 // now remove all invalid transactions
 /* ES6 
 CatShipBlockIn.transactionArray = CatShipBlockIn.transactionArray.filter((trans) => trans.isValid == true);
 */
 CatShipBlockIn.transactionArray = CatShipBlockIn.transactionArray.filter(function(trans) {
  return trans.isValid == true;
 });

 // step 2 validate the block hash, will fail if anything is differs from original block
 // what happens when your block you tried to mine fails, you have to click the mine button again
 // re-calc the block id to make sure all trans are still valid
 CatShipBlockIn.calculateBlockID();

 if (debug == true) {
  console.log('new block of hash...');
  console.log(CatShipBlockIn.blockID);
  console.log('block after validation...');
  console.log(CatShipBlockIn);
 }

 if (tempHash == CatShipBlockIn.blockID) {
  CatShipBlockIn.isValid = true;
 }
}

/* -----------------------------------------------------------------------------
 ** blockchain util
 ** -------------------------------------------------------------------------- */

function getBlockChain(blockchainNameIn) {

 // empty the memory
 var urlToFetch = 'json/' + blockchainNameIn + '.json';
 var tempChain = [];

 var myData;
 $.ajax({
  type: 'GET',
  url: urlToFetch,
  cache: false,
  data: myData,
  success: function(myData) {

   catShipChain = myData;
   //console.log('blockChain fetched from server/peers...');
   //console.log(catShipChain);
   /* update the wallet */
   userWallet.fetchTransactions(true);

  },
  error: function(xhr, status, error) {
   if (debug == true) {
    //console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
    console.log('did not find a block chain, creating an empty one...');
   }
   if (typeof myData === 'undefined') {
    catShipChain = [];
   }
  },
  dataType: 'json'
 });

}

/* -----------------------------------------------------------------------------
 ** mem pool util
 ** -------------------------------------------------------------------------- */

function getTransactionPool(transactionPoolNameIn) {

 var urlToFetch = 'json/' + transactionPoolNameIn + '.json';

 if (debug == true) {
  console.log('initializing transaction pool...');
 }
 var myData;
 $.ajax({
  type: 'GET',
  url: urlToFetch,
  cache: false,
  data: myData,
  success: function(myData) {
   transactionPool = myData;
   userWallet.fetchTransactions(true);
  },
  error: function(xhr, status, error) {
   if (debug == true) {
    //console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
    console.log('did not find a transaction pool, creating an empty one...');
   }
   if (typeof myData === 'undefined') {
    transactionPool = []; // [{ Transaction },{}] // array
   }
  },
  dataType: 'json'
 });
}


/* -----------------------------------------------------------------------------
 ** crypto util
 ** -------------------------------------------------------------------------- */

function getNum(val) {
 if (isNaN(val)) {
  return parseFloat(0);
 }
 return parseFloat(val);
}

function signPlainText(plainTextIn, privateKeyIn) {
 // create an elliptic curve object
 var ec = new KJUR.crypto.ECDSA({
  'curve': curveType
 });
 // create a message digest object
 var md = new KJUR.crypto.MessageDigest({
  alg: curveDigestHash,
  "prov": "cryptojs"
 });
 // set the digest string
 md.updateString(plainTextIn);
 // hash the digest string
 var plainTextHash = md.digest();
 // sign the transaction plain text
 var signature = ec.signHex(plainTextHash, privateKeyIn);;

 // return the signature
 return signature;
}

function digestMessage(plainTextIn) {
 var md = new KJUR.crypto.MessageDigest({
  alg: messageDigestHash,
  "prov": "cryptojs"
 });
 md.updateString(plainTextIn);
 return md.digest();
}

function validateSignature(plainTextIn, signatureIn, publicKeyIn) {
 // create an elliptic curve object
 var ec = new KJUR.crypto.ECDSA({
  'curve': curveType
 });
 // create a message digest object
 var md = new KJUR.crypto.MessageDigest({
  alg: curveDigestHash,
  "prov": "cryptojs"
 });
 // set the digest string
 md.updateString(plainTextIn);
 // hash the digest string
 var plainTextHash = md.digest();
 // verify the singature
 var result = ec.verifyHex(plainTextHash, signatureIn, publicKeyIn);

 if (debug == true) {
  console.log('plain text:');
  console.log(plainTextIn);
  console.log('hashed text:');
  console.log(plainTextHash);
  console.log('signature public key:');
  console.log(publicKeyIn);
  console.log('verify result:');
  console.log(result);
 }
 return result;

}

/* -----------------------------------------------------------------------------
 ** address util
 ** -------------------------------------------------------------------------- */

// will return a users balance used for other users, not the current user
// for the current user just call catShipCoinWalet.fetchTransactions()
function getUserBalance(userAddressIn) {
 var tempWallet = new catShipCoinWallet(userAddressIn, 'unknown');
 tempWallet.fetchTransactions();

 return tempWallet.balance;
}

/* -----------------------------------------------------------------------------
 ** blockchain util
 ** -------------------------------------------------------------------------- */

// get current block height
function getCurrentBlockHeight() {
 var maxValue = -1;
 for (var i = 0; i < catShipChain.length; i++) {
  if (catShipChain[i]['blockHeight'] >= maxValue) {
   maxValue = catShipChain[i]['blockHeight'];
  }
 }

 currentBlockHeight = parseInt(maxValue);
 return parseInt(maxValue);
}

// get current block height
function getCurrentAvgBlockStats() {

 getCurrentBlockHeight();

 var totalTime = getNum(0);
 var totalScore = getNum(0);
 var totalBlocks = getNum(0);

 var tempSampleBlocks = getNum(currentBlockHeight - sampleBlocks);
 if (tempSampleBlocks < 0) {
  tempSampleBlocks = getNum(0);
 }

 for (var i = tempSampleBlocks; i <= currentBlockHeight; i++) {
  totalTime += getNum(catShipChain[i]['elapsedTimeSincePreviousBlock']);
  totalScore += getNum(catShipChain[i]['scoreToMineBlock']);
  totalBlocks += getNum(1);
 }

 // avg score for the last x blocks
 currentAvgBlockScore = totalScore / totalBlocks;

 // here we add on one more sample which is the last block to the current time
 // helps when system has been idle
 if (catShipChain[currentBlockHeight] != null) {
  var tempTime = new Date().getTime();
  var currentElapsedTime = tempTime / 1000 - catShipChain[currentBlockHeight].utcTimeStamp / 1000;
  totalTime += currentElapsedTime;
  totalBlocks += 1;
 }

 currentAvgBlockTime = totalTime / totalBlocks;

 currentDifficulty = (currentAvgBlockTime / targetBlockTime) / currentAvgBlockScore;
 if (currentDifficulty < minimumDifficulty) {
  currentDifficulty = minimumDifficulty;
 }

 if (debug == true) {
  console.log(currentAvgBlockTime);
  console.log(targetBlockTime);
  console.log(currentAvgBlockScore);
  console.log(currentDifficulty);
 }
}

// every 3 seconds these guys will fire 
window.setInterval(function() {
 //userWallet.fetchTransactions(true);
 /* block chain fetch async*/
 getBlockChain(blockChainName);
 /* tx pool fetch async*/
 getTransactionPool(transactionPoolName);

 //console.log('firing refresh');
}, 3000);