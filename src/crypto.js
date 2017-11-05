/* -----------------------------------------------------------------------------
 ** temp globals remove later when data connectors exist
 -- bug : add 1 transaction, mine catshipcoins and it creates a duplicate
 -- neaten up code 
 -- do the validate block code
 -- do the vote on block code (defaults to yes can be set to no)
 -- implement ddos protection for transactions (must get token from server ? )
 ** -------------------------------------------------------------------------- */
/* -----------------------------------------------------------------------------
 ** global variables
 ** -------------------------------------------------------------------------- */
var debug = true;
var catsShipGameSignature = '3046022100ea98608e0c4c3c22baa66de805fee1a85c10e169edcf45fbd256e72607adb29902210091f498a347796a18ff3a88f23ab2d7e83c4082ade0fb9c57f0ead221cbf6dcc3'; // tricky bit
// global variables fed from the peers
var currentCoinReward = '100.000000000';
var currentDifficulty = '7';
var transactionPool = [];
var catShipChain = [];

/* -----------------------------------------------------------------------------
 ** initialization code
 ** -------------------------------------------------------------------------- */

/* block chain */
if (debug == true) {
    console.log('initializing blockchain...');
}

var myData;
$.ajax({
    type: 'GET',
    url: 'json/catShipBlockChain.json',
    data: myData,
    success: function(myData) {
        catShipChain = myData;
        
        if (debug == true) {
            console.log('block chain fetched from server...');
            console.log(catShipChain);
        }
        
        userWallet.updateBalance();
        var scope = angular.element(document.getElementById('wallet')).scope();
        scope.master.Balance = userWallet.balance;
        scope.names = userWallet.transactionArray;
        scope.$apply();

    },
    error: function(xhr, status, error) {
        if (debug == true) {
            //console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
            console.log('did not find a block chain, creating an empty one...');
        }
        if (typeof catShipChain === 'undefined') {
            catShipChain = []; // [{ Transaction },{}] // array
        }
    },
    dataType: 'json'
});

/* tx pool */
if (debug == true) {
    console.log('initializing transaction pool...');
}
var myData;
$.ajax({
    type: 'GET',
    url: 'json/catShipTransactionPool.json',
    data: myData,
    success: function(myData) {
        transactionPool = myData;

        if (debug == true) {
            console.log('transaction pool fetched from server/peers...');
            console.log(transactionPool);
        }
        userWallet.updateBalance();
        var scope = angular.element(document.getElementById('wallet')).scope();
        scope.master.Balance = userWallet.balance;
        scope.names = userWallet.transactionArray;
        scope.$apply();
    },
    error: function(xhr, status, error) {
        if (debug == true) {
            //console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
            console.log('did not find a transaction pool, creating an empty one...');
        }
        if (typeof transactionPool === 'undefined') {
            transactionPool = []; // [{ Transaction },{}] // array
        }
    },
    dataType: 'json'
});

/* wallet */
if (debug == true) {
    console.log('initializing wallet...');
}
var userWallet = initializeCatShipCoinWallet();
if (debug == true) {
    console.log('wallet fetched from local storage...');
    console.log(userWallet);
}

/* -----------------------------------------------------------------------------
 ** wallet ui code
 ** -------------------------------------------------------------------------- */

var app = angular.module('myApp', []);
app.controller('formCtrl', function($scope) {
    $scope.master = {
        PrvKey: userWallet.privateKey,
        PubKey: userWallet.publicKey,
        Balance: userWallet.balance
    };
    $scope.updateWallet = function() {
        userWallet.publicKey = $scope.user.PubKey;
        userWallet.privateKey = $scope.user.PrvKey;
        userWallet.transactionArray = [];
        userWallet.updateBalance();
        $scope.user.Balance = userWallet.balance;
        $scope.master = angular.copy($scope.user);
        $scope.names = userWallet.transactionArray;
    };
    $scope.sendPayment = function() {
        var newTrans = new catShipTransaction(userWallet.publicKey, $scope.user.ReceieverPubKey, $scope.user.Message, $scope.user.Amount, userWallet.privateKey, null);
        $scope.user.ReceieverPubKey = '';
        $scope.user.Amount = '';
        $scope.user.Message = '';
        $scope.updateWallet();
    };
    $scope.mineCoins = function() {
        console.log('mining for a new block...');
        // => launches the video game and returns with reward and signature
        //window.location.href = 'index.html';
        
    function coinBaseInput(){
        this.minerAddressIn = userWallet.publicKey;
        this.coinRewardIn = 100;
        this.utcTimeStamp = new Date().getTime();
        this.singature;
        } 
    
    var myCoinBase = new coinBaseInput();

    $.ajax({
        type: 'POST',
        url: 'json/catShipCoinBase.php',
        data: {
            jsonObject: JSON.stringify(myCoinBase)
        },
        success: function(data) {
            console.log('successfull post of catship block:');
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
        },
        dataType: 'text'
    });
    
        // now we can successfully mine a block
        var newBlock = new catShipBlock(userWallet.publicKey, currentCoinReward, catsShipGameSignature);
        $scope.updateWallet();
    };
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
    //$scope.updateWallet();

});


/* -----------------------------------------------------------------------------
 ** test scripts
 ** -------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
 ** temporary functions
 ** -------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
 ** blockchain functions
 ** -------------------------------------------------------------------------- */

// block chain methods 
function getCurrentBlockHeight() {
    var maxValue = -1;
      for (var i = 0; i < catShipChain.length; i++) {
        if (catShipChain[i]['blockHeight'] >= maxValue) {
            maxValue = catShipChain[i]['blockHeight'];
        }

    }
    
    return parseInt(maxValue);
}

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
    var userWallet = new catShipCoinWallet(walletObject.publicKey, walletObject.privateKey);

    return userWallet;

}

// overload prototype for existing wallet
function catShipCoinWallet(publicKeyIn, privateKeyIn) {
    this.transactionArray = [];
    this.balance = getNum(0);

    this.updateBalance = function() {
    this.transactionArray = [];
        this.balance = getUserBalance(this.publicKey, this.transactionArray);
    }
    // we neeed an overload here where only private key is required and pub key gets generated
    // we also need a check here to ensure keys are valid catship keys
    if ((publicKeyIn == null) && (privateKeyIn == null)) {
        var ec = new KJUR.crypto.ECDSA({
            'curve': 'secp256r1'
        });
        var keypair = ec.generateKeyPairHex();
        this.publicKey = keypair.ecpubhex; // hexadecimal string of EC public key
        this.privateKey = keypair.ecprvhex; // hexadecimal string of EC private key (=d)
    } else {
        this.publicKey = publicKeyIn;
        this.privateKey = privateKeyIn;
        this.updateBalance();
    }

}


// this is a prototype of a catship transaction, users will send stuff to each other by playing games and interacting
function catShipTransaction(senderAddressIn, receiverAddressIn, messageIn, valueIn, prvhexIn, signatureIn) {
    this.senderAddress = senderAddressIn; // sender public key
    this.receiverAddress = receiverAddressIn; // receiver public key
    this.message = messageIn; // any message they want to write to the blockchain up to 128 chars
    this.value = valueIn; // amount being transfered
    this.isValid = false;
    this.utcTimeStamp = new Date().getTime();
    this.isPending = true;
    this.blockHeight;
    /* when we create a transaction we sign the transaction before we get the message digest to ensure the transaction is immutable */
    var ec = new KJUR.crypto.ECDSA({
        'curve': 'secp256r1'
    });
    this.transactionPlainText = this.senderAddress + this.receiverAddress + this.message + this.value + this.utcTimeStamp;

    // if this is a coin base transaction the signature will be pre-provided 
    if (signatureIn != null) {
        this.signature = signatureIn;
    } else {
        // sign the plain text of the entire transaction 
        this.signature = ec.signHex(this.transactionPlainText, prvhexIn);
    }
    // now we hash the transaction including the signature to create the transaction ID
    var transactionPlainTextPlusSig = this.transactionPlainText + this.signature;
    var md = new KJUR.crypto.MessageDigest({
        alg: "sha384",
        "prov": "cryptojs"
    });
    md.updateString(transactionPlainTextPlusSig);
    this.transactionID = md.digest();

    validateTransaction(this);
     
    // add the transaction to the local mem pool
    if (this.isValid == true && this.senderAddress != 'catShipCoinBase') {
        transactionPool.push(this); // will not replace a transaction if one already exists
    }
    
    if (debug == true)
    {
    console.log('broadcasting transaction isValid, senderAddress ...');
    console.log(this.isValid);
    console.log(this.senderAddress);
    }

    // broadcast the transaction to the network
    if (this.isValid == true && this.senderAddress != 'catShipCoinBase') {
    if (debug == true)
    {
    console.log('broadcasting transaction isValid, senderAddress ...');
    console.log(this.isValid);
    console.log(this.senderAddress);
    }
    
    console.log('transaction about to be posted:');
    var myObj = JSON.stringify(this);
    console.log(myObj);

    $.ajax({
        type: 'POST',
        url: 'json/catShipTransaction.php',
        data: {
            jsonObject: JSON.stringify(this)
        },
        success: function(data) {
            console.log('successfull post of tranaction:');
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
        },
        dataType: 'text'
    });
}

}

function validateTransaction(catShipTransactionIn) {
    if (debug == true)
        {
            console.log('validating transaction...');
            console.log(catShipTransactionIn);
        }
    // check balance of sender is sufficient
    var validationCount = 0;
    var senderBal = getUserBalance(catShipTransactionIn.senderAddress, null);
    if (senderBal >= catShipTransactionIn.value) {
        validationCount += 1;
    };
    // check that the transaction amount is > 0
    if (getNum(catShipTransactionIn.value) > getNum(0)) {
        validationCount += 2;
    }
    // check that the user is not sending it to themselves 
    if (catShipTransactionIn.senderAddress != catShipTransactionIn.receieverAddress) {
        validationCount += 4;
    }
    // check the destination address is valid
    // not sure how to do this in the library yet???
    validationCount += 8;
    // check the signature validates against the public key (sender address)
    var ec = new KJUR.crypto.ECDSA({
        'curve': 'secp256r1'
    });
    var result = ec.verifyHex(catShipTransactionIn.transactionPlainText, catShipTransactionIn.signature, catShipTransactionIn.senderAddress);
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
    };

}

// the prototype for the transaction block
function catShipBlock(minerAddressIn, coinRewardIn, signatureIn) {

    this.utcTimeStamp = new Date().getTime();

    // lets send the miner reward trans 
    var coinbaseTransaction = new catShipTransaction('catShipCoinBase', minerAddressIn, 'freshly minted kitty goodness', coinRewardIn, '', signatureIn);

    this.transactionArray = [];

    // the gameScoreArray contains the best scores each miner achieved for this block
    // here we really test the honesty of miners and can block miners who arent accepting scores
    this.gameScoreArray = []; // {publicKey - nonce} 
    var currentBlockHeight = getCurrentBlockHeight();
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
    }

    // add all the transactions currently in the pool
    for (var x in transactionPool) {
        if (transactionPool.hasOwnProperty(x)) {
            // needs to be atomic!!! get lock,  add, delete from mempool, release lock
            transactionPool[x].blockHeight = this.blockHeight;
            transactionPool[x].isPending = false;
            this.transactionArray.push(transactionPool[x]);
            delete transactionPool[x];
        }
    }

    // the block game hash is an sha384 hash of block height and previous block id so should be the same for all miners, this allows miners to be on an even footing when solving the puzzle
    // miners will use a nonce + blockGameHash to mine. 
    this.calculateBlockGameHash = function() {
        var blockPlainText = this.blockHeight + this.previousBlockID;
        var md = new KJUR.crypto.MessageDigest({
            alg: "sha384",
            "prov": "cryptojs"
        });
        md.updateString(blockPlainText);
        this.blockGameHash = md.digest();
    }

    // this is the hash used by the puzzle
    this.calculateBlockGameHash(); // not sure if I need this

    // once the block has been solved the entire thing gets hashed and added to the blockchain to make it immutable
    this.calculateBlockID = function() {

        var transactionArrayString = JSON.stringify(this.transactionArray);
        var gameScoreArrayString = JSON.stringify(this.gameScoreArray);
        var blockPlainText = transactionArrayString + gameScoreArrayString + this.blockGameHash;
        // hash the solved block
        var md = new KJUR.crypto.MessageDigest({
            alg: "sha384",
            "prov": "cryptojs"
        });
        md.updateString(blockPlainText);
        this.blockID = md.digest();
    }

    this.closeBlock = function() {

        this.calculateBlockID();
        catShipChain.push(this);
    }

    // once mining is successfull close the block
    this.closeBlock();

    $.ajax({
        type: 'POST',
        url: 'json/catShipBlock.php',
        data: {
            jsonObject: JSON.stringify(this)
        },
        success: function(data) {
            console.log('successfull post of catship block:');
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
        },
        dataType: 'text'
    });

}

function validateCatShipBlock(CatShipBlockIn) {
    var tempTransactionArray = CatShipBlockIn.transactionArray;
}

function getUserBalance(userAddressIn, transactionArrayIn) {

    if (debug == true) {
        console.log('getting user balance with parameters userAddressIn, transactionArrayIn...');
        console.log(userAddressIn);
        console.log(transactionArrayIn);
        console.log('current catshipchain:');
        console.log(catShipChain);
    }
     
    var userBalance = 0;
    //transactionArrayIn = [];

    // loop through all the blocks filtering out users address transactions
    for (var x in catShipChain) {
        //console.log('getting user balance, exploring block height:' + blockHeight);
        var credits = catShipChain[x].transactionArray.filter((trans) => trans.receiverAddress == userAddressIn);

        var debits = catShipChain[x].transactionArray.filter((trans) => trans.senderAddress == userAddressIn);

        if (transactionArrayIn != null) {
            for (var k = 0; k < credits.length; k++) {
                transactionArrayIn.push(credits[k]);
            }
            for (var k = 0; k < debits.length; k++) {
                transactionArrayIn.push(debits[k]);
            }
        };

        var sum = parseFloat(0);
        for (var i = 0; i < credits.length; i++) {
            sum += getNum(credits[i].value);
        };

        userBalance += getNum(sum);

        var sum = parseFloat(0);
        for (var i = 0; i < debits.length; i++) {
            sum += getNum(debits[i].value);
        };

        userBalance -= getNum(sum);

    }

    if (transactionArrayIn != null) { // only do this if we are in the update block array mode

        if (debug == true) {
            console.log('traversing tx pool for users previous transactions...');
        }
        // also add any pending transactions
        for (var x in transactionPool) {

            if (transactionPool.hasOwnProperty(x)) {
                if (transactionPool[x].senderAddress == userWallet.publicKey) {
                    transactionArrayIn.push(transactionPool[x]);
                    userBalance -= getNum(transactionPool[x].value);
                }
                if (transactionPool[x].receieverAddress == userWallet.publicKey) {
                    transactionArrayIn.push(transactionPool[x]);
                    userBalance += getNum(transactionPool[x].value);
                }
            }
        }
    }

    return userBalance;
}

/* -----------------------------------------------------------------------------
 ** generic functions
 ** -------------------------------------------------------------------------- */

function getNum(val) {
    if (isNaN(val)) {
        return parseFloat(0);
    }
    return parseFloat(val);
}