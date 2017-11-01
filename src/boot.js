var boot = function(game) {
    console.log("%cStarting catship", "color:white; background:green");
};

boot.prototype = {
    preload: function() {
        this.game.load.image("loading", "img/loading.png");
    },
    create: function() {

        //Here we check for the catshipID of the user for saving scores to the server
        catshipID = localStorage.getItem('catshipID');

        //console.log('CatshipID retrieved from localStorage: ' + catshipID);

        var uuid = 'casthipID-' + this.getUUID()

        if (!catshipID) {
            //It can only store strings
            localStorage.setItem('catshipID', uuid);
        }
        //You can store entire objects by doing this:
        //localStorage.setItem('myObject', JSON.stringify(myObject));

        userWallet = initializeCatShipCoinWallet();

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.minWidth = 480;
        this.scale.minHeight = 260;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        this.scale.forceLandscape = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.setScreenSize(true);
        this.game.state.start("Preload");
    },
    getUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}