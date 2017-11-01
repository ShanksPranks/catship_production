var preload = function(game) {}

preload.prototype = {
    preload: function() {
        var loadingBar = this.add.sprite(160, 240, "loading");
        loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loadingBar);

        // @@ Tile Maps
        //this.load.tilemap('myTilemap', 'json/Terrain1.json', null, Phaser.Tilemap.TILED_JSON);
        //this.load.image('Terrain1', 'img/Terrain1.png');

        // @@ Game Images
        this.game.load.spritesheet('nes1', 'img/nes300x300.png', 100, 100);
        this.game.load.image('nes2', 'img/nes2.png');

        this.game.load.image('stage1', 'img/terrainlow1.jpg');
        this.game.load.image('stage2', 'img/terrainlow2.jpg');
        this.game.load.image('eneme1', 'img/eneme1.png');
        this.game.load.image('eneme2', 'img/eneme2.png');
        this.game.load.image('eneme3', 'img/eneme3.png');
        this.game.load.image('eneme4', 'img/eneme4.png');
        this.game.load.image('bossEneme1', 'img/bossEneme1.png');
        this.game.load.image('bossHitArea', 'img/bossHitArea.png');

        this.game.load.image('eneme1bullet', 'img/eneme1bullet.png');
        this.game.load.image('eneme2bullet', 'img/eneme2bullet.png');
        this.game.load.image('eneme3bullet', 'img/eneme3bullet.png');
        this.game.load.spritesheet('eneme4bullet', 'img/eneme4ord.png', 40, 40);
        this.game.load.spritesheet('catship', 'img/catship.png', 55, 42);
        this.game.load.spritesheet('bullet', 'img/explosion_1.png', 60, 70);
        this.game.load.image('photon', 'img/photon.png');
        this.game.load.image('shrapnel', 'img/shrapnel.png');
        this.game.load.image('shrapnelShot', 'img/shrapnelShot.png');
        this.game.load.spritesheet('pyramid', 'img/pyramid336x64.png', 84, 64);

        // @@ Story Images

        this.game.load.image('gameOver', 'img/gameover.png');
        this.game.load.image('splash', 'lrg/splash3.jpg');
        this.game.load.image('bg', 'lrg/bg.jpg');
        this.game.load.image('cs1', 'lrg/CS1.jpg');
        this.game.load.image('cs2', 'lrg/CS2.jpg');
        this.game.load.image('cs3', 'lrg/CS3.jpg');
        this.game.load.image('cs4', 'lrg/CS4.jpg');
        this.game.load.image('cs5', 'lrg/CS5.jpg');
        this.game.load.image('cs6', 'lrg/CS6.jpg');
        this.game.load.image('sb1', 'img/sb1.png');
        this.game.load.image('cp1', 'img/cp1.png');
        this.game.load.image('sb2', 'img/sb2.png');
        this.game.load.image('sb3', 'img/sb3.png');
        this.game.load.image('sb4', 'img/sb4.png');
        this.game.load.image('sb5', 'img/sb5.png');
        this.game.load.image('sb6', 'img/sb6.png');
        this.game.load.image('sb7', 'img/sb7.png');
        this.game.load.image('sb8', 'img/sb8.png');
        this.game.load.image('bonus', 'img/bonus.png');

        // @@ Sound

        this.game.load.spritesheet('dust', 'img/dust.png', 17, 17);

        this.game.load.audio('photonShot', ['snd/photon.mp3']);
        this.game.load.audio('shot', ['snd/shot.mp3']);
        this.game.load.audio('gammaLaser', ['snd/gammaLaser.mp3']);
        this.game.load.audio('track1', ['snd/catship1.mp3']);
        this.game.load.audio('enemyDie', ['snd/enemyDie.mp3']);
        this.game.load.audio('ff', ['snd/ff.mp3']);
        this.game.load.audio('wind1', ['snd/wind1.mp3']);
        this.game.load.audio('wind2', ['snd/wind2.mp3']);
        this.game.load.audio('pyrHit', ['snd/pyrHit.mp3']);

        // @@ Data
        this.game.load.json('catshipLevels', 'json/catshipLevels.json');

        var jsonExists = 1;
        $.get('json/myJson.json')
            .done(function() {}).fail(function() {
                jsonExists = 0;
                //console.log('Did not find the json file at json/myJson.json, will create one at the end of this game');
            })
        if (jsonExists == 1) {
            this.game.load.json('myJson', 'json/myJson.json');
        }

        var jsonExists = 1;
        $.get('json/catShipChain.json')
            .done(function() {
                jsonExists = 1;
            }).fail(function() {
                jsonExists = 0;
                console.log('was unable to retrieve the catshipChain, will create new one...');
            })
        if (jsonExists == 1) {
            this.game.load.json('catShipChain', 'json/catShipChain.json');
        }

    },
    create: function() {
        this.game.state.start("GameTitle");
    }
}