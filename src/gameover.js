var gameOver = function(game){}

gameOver.prototype = {
    init: function (score) {

        lives -= 1;

        if (lives == 0) {

            myJson = this.game.cache.getJSON('myJson');

            if (!myJson) {
                myJson = jsonObject;
            }
            else {
                for (var i = 0; i < myJson.players.length; i++) {
                    console.log('this was retrieved from the server: \n Name'
            + myJson.players[i].name
            + '\n Games Played: '
            + myJson.players[i].gamesPlayed
            + '\n High Score: '
            + myJson.players[i].highScore
            + '\n Last Played Date: '
            + myJson.players[i].lastPlayedDate
            + '\n catshipID: '
            + myJson.players[i].catshipID
            );
                }


                storyboard = 5;

                var currentdate = new Date();
                var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();


                logo = this.game.add.sprite(0, 0, 'splash');
                var gameOver = this.game.add.sprite(this.game.world.height / 2, this.game.world.width / 2, 'gameOver');
                gameOver.anchor.set(0.5, 0.5);
                var stateText = this.game.add.text(this.game.world.height / 2, this.game.world.width / 2 + 30, score, { fontSize: '50px', fill: '#ef1227' });
                stateText.visible = true;

                // create a json object 
                jsonObject.players[0].catshipID = catshipID;
                jsonObject.players[0].highScore = score;
                jsonObject.players[0].level = level;
                jsonObject.players[0].lastPlayedDate = datetime;

                // search through the server jason to find if our record catshipID exists
                var entryFound = 0;
                gamesPlayed = 0;

                for (var i = 0; i < myJson.players.length; i++) {
                    gamesPlayed += myJson.players[i].gamesPlayed;
                    if (myJson.players[i].catshipID == jsonObject.players[0].catshipID) {
                        myJson.players[i].gamesPlayed += 1;
                        gamesPlayed += 1;
                        myJson.players[i].lastPlayedDate = datetime;

                        if (myJson.players[i].name == "nada") {
                                var person = prompt("Please enter your name", "");
                                if (person != null) {
                                    myJson.players[i].name = person;
                            }
                            }
                            if (jsonObject.players[0].highScore > myJson.players[i].highScore)
                            {
                            myJson.players[i].highScore = jsonObject.players[0].highScore;
                            myJson.players[i].level = jsonObject.players[0].level;
                            }
                        entryFound = 1;
                    }
                }
                if (entryFound == 0) {
                            var person2 = prompt("Please enter your name", "");
                                if (person2 != null) {
                                    jsonObject.players[0].name = person2;
                            }
                    jsonObject.players[0].gamesPlayed = 1;
                    myJson.players.push(jsonObject.players[0])
                    console.log('I am creating a new record of your catship Quest: ' + catshipID);
                }

                this.sortResults('highScore', true);

                $.ajax({
                    type: 'POST',
                    url: 'json/JsonWriterAJAX.php',
                    data: { jsonObject: JSON.stringify(myJson) },
                    success: function (data) {
                        //console.log('successfull post:' + data);
                    },
                    error: function (xhr, status, error) {
                        //console.log('xhr thingy: ' + xhr + ', status: ' + status + ', error : ' + error);
                    },
                    dataType: 'text'
                });

            }

        }
        else {
            this.game.state.start("TheGame");
        }
    },
    create: function () {
        if (lives == 0) {
            this.game.input.onDown.add(this.playTheGame, this);
        }
        else {
            this.playTheGame();
        }
    },
    playTheGame: function () {
        console.log('storyboard' + storyboard);
        if (lives == 0 && storyboard == 5) {

            // Lets draw a high scores box and fill it with trophies
            bg = this.game.add.sprite(0, 0, 'bg');
            bg.tint = 0x221804;
            var titleText = this.game.add.text((this.game.world.width / 2) - 130, 40, 'BEST ' + myJson.players.length + ' PLAYERS', { fontSize: '30px', fill: '#efed30' });
            var gamesText = this.game.add.text((this.game.world.width / 2), this.game.world.height - 40, 'GLOBAL CATSHIP FLIGHTS ' + gamesPlayed, { fontSize: 10, fill: '#efed30' });
            gamesText.anchor.setTo(0.5);
            gamesText.fontSize = 20;
            gamesPlayed += 1;
            var offSet = (myJson.players.length - 1); // this is the offset for the highest score
            for (var i = myJson.players.length - 1; i >= 0; i--) {
                var newText = this.game.add.text(60, 80 + (offSet - i + 1) * 40, (offSet - i + 1) + '   ', { fontSize: '30px', fill: '#f1e6e3' });
                var nextText = this.game.add.text(100, 80 + (offSet - i + 1) * 40, myJson.players[i].highScore + '   ', { fontSize: '30px', fill: '#56d7cf' });
                var finalText = this.game.add.text(200, 80 + (offSet - i + 1) * 40, myJson.players[i].name, { fontSize: '30px', fill: '#e00a0a' });
                newText.visible = true;
            }
            storyboard += 1;
        }
        else {
            storyboard = 5;
            this.game.state.start("TheGame");
        }
    },
    sortResults: function (prop, asc) {
        myJson.players = myJson.players.sort(function (a, b) {
            if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
        for (var i = 0; i < myJson.players.length; i++) {
            //console.log('Another test through the array his is the record for :' + myJson.players[i].name + ' for the array: ' + myJson.players[i].highScore);
        }
    }
}