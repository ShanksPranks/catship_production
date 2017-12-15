# catship_production
CatShipCoin is the first coin that uses POI (Proof Of Intelligence) as the mining algorithm.
In order to mint coins the miner must play a somewhat buggy, difficult and random video game, the bugginess and randomness are the vital qualities that make it difficult for traditional search based / machine learning AI's to score effectively in the video game.

By making the mining algorithm very resistant to all brute force methodologies and requiring intelligence we ensure that the ability to generate the currency is equally easy for everyday people providing they have access to a web browser and the internet. 

It is particularly hard to play the game on a smart phone although not impossible, it works better when using a cocoon wrap (https://cocoon.io/) so I have to do one for Android and IOS soon.

The coin has an additional property that every 1000th block is a "rebase block" where all existing balances in the system are generated as coinbase rewards to those addresses. This ensures that the blockchain stays to a small(ish) size and can fit in local storage on a smart phone. 

Coinbase rewards are adjusted to maintain a cadence of 100 coins per 10 minutes depending on the number of users currently mining and are apportioned based on the scores that each miner is able to accumulate in the 10 minutes. Similarly to bitcoin the reward halves every 2048 blocks.

Not sure what my DDOS startegy is yet, maybe some simple kind of proof of intelligence for each transaction like the new background reCAPTCHA or something.

The catship chain is a cryptic and powerful ancient technology that is mystical and mythical in all its facilities.
                                                
A block is confirmed as soon as >50% of the netwrok starts mining on top of it and all wallet users have the ability to "blame" a suspect block and IP address / public key.

Your total score is reset when you mine a block but others scores are maintained in the mem pool.

# Installation
Copy the entire repository onto your web server IIS/APACHE/Whatever
add gmp math extension to your php.ini as follows:
extension=php_gmp.dll
browse to index.html
