var theGame = function(game){
}

theGame.prototype = {
    create: function () {

        // Checkpoints: 


        if (startFromCheckpoint == 2) {
            // Checkpoint 2 (Pyramid Boomslangs)
            checkpointTotal = 224;
            checkpointEnemyCount = 17;
            checkpointSb = 6;
            checkpointPyramidCount = 70;
            checkpointPyramidTimer = 155;
            checkpointPyramidsOffset = 6452;
            checkpointStage1Y = -8004;
           // checkpointStage2Y = -3604;
            checkpointPyramidsY = 6452;
            checkpointCheckpoint = 1;
            checkpointShipFP = 1;
            checkpointStagespeed = 1;
        }

        if (startFromCheckpoint == 3) {
            // checkpoint 3 (Bossman)
            checkpointTotal = 332
            checkpointEnemyCount = 21
            checkpointSb = 12
            checkpointPyramidCount = 14
            checkpointPyramidTimer = 279
            checkpointPyramidsOffset = 8142
            checkpointStage1Y = -3702
           // checkpointStage2Y = -8102
            checkpointPyramidsY = 8142
            checkpointCheckpoint = 2
            checkpointShipFP = 2
            checkpointStagespeed = 1
        }

        // Reset all the critical variables (beginning of fresh new game Alt+F5)
        if (debug == 1) {
            console.log('catshipID : in theGame: ' + catshipID);
        }


        health = 12;
        alienHealth = 12;
        total = 0;
        sb = 0;
        enemyCount = 0;
        row = 0;

        //track = this.game.add.audio('track1', trackVolume, true);
        //track.play('', 0, trackVolume, true);

//        var params = parse_params();
//        play_song(params.file, parseInt(params.subtune));
//        play_song('nsf/catship2.nsf'); 

        wind = this.game.add.audio('wind1', windVolume, true);
        wind.play('', 0, windVolume, true);


        shot = this.game.add.audio('shot', shotVolume, false);
        photonShot = this.game.add.audio('photonShot', photonShotVolume, false);
        gammaLaser = this.game.add.audio('gammaLaser', gammaLaserVolume, false);
        //        photon = this.game.add.audio('gammaLaser', 0.5, false);
        ff = this.game.add.audio('ff', ffVolume, false);
        pyrHit = this.game.add.audio('pyrHit', pyrHitVolume, false);
        enemyDie = this.game.add.audio('enemyDie', enemyDieVolume, false);



        // If the user still has lives and has reached a checkpoint, continue from there, else give her some lives.
        if (lives > 0) {
            total = checkpointTotal;
            enemyCount = checkpointEnemyCount;
            sb = checkpointSb;
            pyramidCount = checkpointPyramidCount;
            pyramidTimer = checkpointPyramidTimer;
            pyramidsOffset = checkpointPyramidsOffset;
            checkpoint = checkpointCheckpoint;
            shipFP = checkpointShipFP;
            stagespeed = checkpointStagespeed;
        }
        // If the user lost all of their lives, continue from the highest level achieved.
        else {
            lives = 3;
            score = 0;
            total = levelTotal;
            enemyCount = levelEnemyCount;
            sb = levelSb;
            pyramidCount = levelPyramidCount;
            pyramidTimer = levelPyramidTimer;
            pyramidsOffset = levelPyramidsOffset;
            checkpoint = levelCheckpoint;
            shipFP = levelShipFP;
            stagespeed = checkpointStagespeed;

            checkpointTotal = levelTotal;
            checkpointEnemyCount = levelEnemyCount;
            checkpointSb = levelSb;
            checkpointPyramidCount = levelPyramidCount;
            checkpointPyramidTimer = levelPyramidTimer;
            checkpointPyramidsOffset = levelPyramidsOffset;
            checkpointCheckpoint = levelCheckpoint;
            checkpointShipFP = levelShipFP;
            checkpointStagespeed = levelStagespeed;
        }

        // Using Tilemap as background
  /*
        var map;
var layer;


    map = this.game.add.tilemap('myTilemap');

   map.addTilesetImage('Terrain1', 'Terrain1');
    
    stage1 = map.createLayer('Terrain1');

    stage1.resizeWorld();

    stage1.wrap = true;
    */
        // First ensure background is loaded 
this.game.time.advancedTiming = true;

        stage1 = this.game.add.tileSprite(0, 0, 800,4400, 'stage1');
        stage1.y = -bgh + this.game.world.height;
        stage1.x = (this.game.world.width - bgw) / 2;
        stage1.autoScroll(0,60);
        //stage2 = this.game.add.image(0, 0, 'stage2');
        //stage2.y = stage1.y - bgh;
        //stage2.x = (this.game.world.width - bgw) / 2;

        if (checkpointStage1Y > 0) {
            stage1.y = checkpointStage1Y;
            //stage2.y = checkpointStage2Y;
        }
        //stage1.y = levelStageY;

        pyramids = this.game.add.group();
        pyramids.enableBody = true;
        pyramids.physicsBodyType = Phaser.Physics.ARCADE;
        pyramids.createMultiple(80, 'pyramid');
        pyramids.setAll('anchor.x', 0.5);
        pyramids.setAll('anchor.y', 0.5);
        //        pyramids.setAll('outOfBoundsKill', true);
        //        pyramids.setAll('checkWorldBounds', true);

        if (checkpointPyramidsY > 0) {
            pyramids.y = checkpointPyramidsY;
        }
        //pyramids.y = levelPyramidsY;

        timer = this.game.time.create(false);
        timer.start();
        timer.loop(levelSpeed, this.updateCounter, this);

        // this is where we access the online level data 
        catshipLevels = this.game.cache.getJSON('catshipLevels');
        //        console.log('Pyramids Array: ' + catshipLevels.Pyramids.length);
        //        console.log('Pyramids2 Array: ' + catshipLevels.Pyramids2.length);

        // This is the dust blowing accross the screen
        var emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
        emitter.width = this.game.world.width;
        // emitter.angle = 30; // uncomment to set an angle for the rain.
        emitter.makeParticles('dust');
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.2;
        emitter.setYSpeed(100, 500);
        emitter.setXSpeed(20, 200);
        emitter.minRotation = 45;
        emitter.maxRotation = 90;
        emitter.start(false, 1600, 5, 0);


        //  Create our ship sprite

        ship = this.game.add.sprite(55, 42, 'catship');
        ship.y = this.game.world.height - this.game.world.height / 3;  // stage1.height - stage1.height / 3;
        ship.x = this.game.world.width - this.game.world.width / 2;
        ship.anchor.set(0.5);

        //  Six animations in total 

        // Here we can lay out all the animations of the ship
        // name, frmae sequence, default frame speed, debug
        ship.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], frameSpeed, false);
        ship.animations.add('leftReturn', [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], frameSpeed, false);
        ship.animations.add('boost', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], frameSpeed, false);
        ship.animations.add('right', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], frameSpeed, false);
        ship.animations.add('rightReturn', [29, 28, 27, 26, 25, 24, 23, 22, 21, 20], frameSpeed, false);

        // I use this last dummy animation as an anchor to get the manager to run a couple frames and tell us when we are at axis 0. 
        ship.animations.add('fly', [0, 1, 0], frameSpeed, false);

        //  and its physics settings
        this.game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.maxVelocity.set(shipMaxVelocity);
        ship.body.collideWorldBounds = true;

        // camera that stays with the ship, required ??
       this.game.camera.follow(ship);

        // Catship Bullets

        // photonShot

        bullets = this.game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // shrapnelShot

        shrapnels = this.game.add.group();
        shrapnels.enableBody = true;
        shrapnels.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        shrapnels.createMultiple(40, 'shrapnelShot');
        shrapnels.setAll('anchor.x', 0.5);
        shrapnels.setAll('anchor.y', 0.5);
        shrapnels.setAll('outOfBoundsKill', true);
        shrapnels.setAll('checkWorldBounds', true);


        // bullet explosions
        explosionGroup = this.game.add.group();

        //  An explosion pool
        explosions = this.game.add.group();
        explosions.createMultiple(50, 'bullet');
        explosions.forEach(this.setup09Ordinance, this);

        //  The baddies!
        aliens1 = this.game.add.group();
        aliens1.enableBody = true;
        aliens1.physicsBodyType = Phaser.Physics.ARCADE;
        //  All 40 of them
        aliens1.createMultiple(20, 'eneme1');
        aliens1.setAll('anchor.x', 0.5);
        aliens1.setAll('anchor.y', 0.5);

        aliens2 = this.game.add.group();
        aliens2.enableBody = true;
        aliens2.physicsBodyType = Phaser.Physics.ARCADE;
        //  All 40 of them
        aliens2.createMultiple(20, 'eneme2');
        aliens2.setAll('anchor.x', 0.5);
        aliens2.setAll('anchor.y', 0.5);

        aliens3 = this.game.add.group();
        aliens3.enableBody = true;
        aliens3.physicsBodyType = Phaser.Physics.ARCADE;
        //  All 40 of them
        aliens3.createMultiple(20, 'eneme3');
        aliens3.setAll('anchor.x', 0.5);
        aliens3.setAll('anchor.y', 0.5);

        aliens4 = this.game.add.group();
        aliens4.enableBody = true;
        aliens4.physicsBodyType = Phaser.Physics.ARCADE;
        //  All 40 of them
        aliens4.createMultiple(20, 'eneme4');
        aliens4.setAll('anchor.x', 0.5);
        aliens4.setAll('anchor.y', 0.5);

        aliens5 = this.game.add.group();
        aliens5.enableBody = true;
        aliens5.physicsBodyType = Phaser.Physics.ARCADE;
        aliens5.createMultiple(1, 'bossEneme1');
        aliens5.setAll('anchor.x', 0.5);
        aliens5.setAll('anchor.y', 0.5);
        //        s.body.setSize(100, 70, 50, 50);

        aliens6 = this.game.add.group();
        aliens6.enableBody = true;
        aliens6.physicsBodyType = Phaser.Physics.ARCADE;
        aliens6.createMultiple(1, 'bossHitArea');
        aliens6.setAll('anchor.x', 0.5);
        aliens6.setAll('anchor.y', 0.5);
        //        s.body.setSize(100, 70, 50, 50);

        // The enemy's bullets
        enemy1Bullets = this.game.add.group();
        enemy1Bullets.enableBody = true;
        enemy1Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy1Bullets.createMultiple(40, 'eneme1bullet');
        enemy1Bullets.setAll('anchor.x', 0.5);
        enemy1Bullets.setAll('anchor.y', 1);
        enemy1Bullets.setAll('outOfBoundsKill', true);
        enemy1Bullets.setAll('checkWorldBounds', true);

        enemy2Bullets = this.game.add.group();
        enemy2Bullets.enableBody = true;
        enemy2Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy2Bullets.createMultiple(40, 'eneme2bullet');
        enemy2Bullets.setAll('anchor.x', 0.5);
        enemy2Bullets.setAll('anchor.y', 1);
        enemy2Bullets.setAll('outOfBoundsKill', true);
        enemy2Bullets.setAll('checkWorldBounds', true);

        enemy3Bullets = this.game.add.group();
        enemy3Bullets.enableBody = true;
        enemy3Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy3Bullets.createMultiple(40, 'eneme3bullet');
        enemy3Bullets.setAll('anchor.x', 0.5);
        enemy3Bullets.setAll('anchor.y', 1);
        enemy3Bullets.setAll('outOfBoundsKill', true);
        enemy3Bullets.setAll('checkWorldBounds', true);

        enemy4Bullets = this.game.add.group();
        enemy4Bullets.enableBody = true;
        enemy4Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy4Bullets.createMultiple(40, 'eneme4bullet');
        enemy4Bullets.setAll('anchor.x', 0.5);
        enemy4Bullets.setAll('anchor.y', 1);
        enemy4Bullets.setAll('outOfBoundsKill', true);
        enemy4Bullets.setAll('checkWorldBounds', true);

        //  A boomslangs guts go boom
        enemy4ExpGroup = this.game.add.group();
        enemy4ExpGroup.createMultiple(50, 'eneme4bullet');
        enemy4ExpGroup.forEach(this.setup716Ordinance, this);

        //  The score
        scoreString = 'Score : ';
        scoreText = this.game.add.text(16, 16, scoreString + score, { font: '12px Arial', fill: '#ef1227' });
        stateText.visible = true;
        //  Lives

        this.game.add.text(this.game.world.width - 100, 10, 'Lives : ' + lives, { font: '12px Arial', fill: '#ef1227' });

        // The forcefield
        FFBar = this.game.add.graphics(0, 0);
        FFBar.beginFill(0x3232b1);
        FFBar.lineStyle(10, 0x3232b1, 1);
        FFBar.drawRect(0, 0, 134, 24);
        FFBar.alpha = 0.50;

        FFBar.x = this.game.camera.x + this.game.world.width - 150;
        FFBar.y = this.game.camera.y + 50;

        // The Aiens forcefield
        AFFBar = this.game.add.graphics(0, 0);
        AFFBar.beginFill(0x8B0000);
        AFFBar.lineStyle(10, 0xDC143C, 1);
        AFFBar.drawRect(0, 0, 134, 24);
        AFFBar.alpha = 0.50;

        AFFBar.x = this.game.camera.x + 16;
        AFFBar.y = this.game.camera.y + 50;

        for (var i = 0; i <= health; i++) {
            FFCells[i] = this.game.add.graphics(0, 0);
            FFCells[i].beginFill(0x04aff6).drawRect(0, 0, 8, 20).endFill();
            FFCells[i].alpha = 1;
            FFCells[i].x = (FFBar.x + 2) + (i * 8) + (i * 2);
            FFCells[i].y = FFBar.y + 2;
        }

        // Force Field Cells
        for (var i = 0; i <= alienHealth; i++) {
            AFFCells[i] = this.game.add.graphics(0, 0);
            AFFCells[i].beginFill(0xCD5C5C).drawRect(0, 0, 8, 20).endFill();
            AFFCells[i].alpha = 1;
            AFFCells[i].x = (AFFBar.x + 2) + (i * 8) + (i * 2);
            AFFCells[i].y = AFFBar.y + 2;
        }


        if (this.game.device.iOS) {


            nes = this.game.add.group();
            nes.enableBody = true;
            nes.physicsBodyType = Phaser.Physics.ARCADE;
            nes.createMultiple(9, 'nes1');
            nes.setAll('anchor.x', 0.5);
            nes.setAll('anchor.y', 0.5);
            nes.alpha = 0.3;


            //nes.forEach(this.setupCont, this);


            nes1 = nes.getFirstExists(false);
            nes1.animations.add('LU', [0], frameSpeed, false);
            nes1.reset(this.game.world.width / 10, this.game.world.height - this.game.world.height / 3);
            nes1.play('LU', false);
            nes1.inputEnabled = true;
            nes1.events.onInputDown.add(this.LUclicked, this);
            nes1.events.onInputOver.add(this.LUclicked, this);
            nes1.events.onInputOut.add(this.LUup, this);
            nes1.events.onInputUp.add(this.LUup, this);

            nes2 = nes.getFirstExists(false);
            nes2.animations.add('U', [1], frameSpeed, false);
            nes2.reset(nes1.x + nes1.width, nes1.y);
            nes2.play('U', false);
            nes2.inputEnabled = true;
            nes2.events.onInputDown.add(this.Uclicked, this);
            nes2.events.onInputOver.add(this.Uclicked, this);
            nes2.events.onInputOut.add(this.Uup, this);
            nes2.events.onInputUp.add(this.Uup, this);

            nes3 = nes.getFirstExists(false);
            nes3.animations.add('UR', [2], frameSpeed, false);
            nes3.reset(nes2.x + nes2.width, nes1.y);
            nes3.play('UR', false);
            nes3.inputEnabled = true;
            nes3.events.onInputDown.add(this.URclicked, this);
            nes3.events.onInputOver.add(this.URclicked, this);
            nes3.events.onInputOut.add(this.URup, this);
            nes3.events.onInputUp.add(this.URup, this);

            nes4 = nes.getFirstExists(false);
            nes4.animations.add('L', [3], frameSpeed, false);
            nes4.reset(nes1.x, nes1.y + nes1.height);
            nes4.play('L', false);
            nes4.inputEnabled = true;
            nes4.events.onInputDown.add(this.Lclicked, this);
            nes4.events.onInputOver.add(this.Lclicked, this);
            nes4.events.onInputOut.add(this.Lup, this);
            nes4.events.onInputUp.add(this.Lup, this);

            nes5 = nes.getFirstExists(false);
            nes5.animations.add('M', [4], frameSpeed, false);
            nes5.reset(nes1.x + nes1.width, nes1.y + nes1.height);
            nes5.play('M', false);
            //      this is just a frame

            nes6 = nes.getFirstExists(false);
            nes6.animations.add('R', [5], frameSpeed, false);
            nes6.reset(nes5.x + nes5.width, nes1.y + nes1.height);
            nes6.play('R', false);
            nes6.inputEnabled = true;
            nes6.events.onInputDown.add(this.Rclicked, this);
            nes6.events.onInputOver.add(this.Rclicked, this);
            nes6.events.onInputOut.add(this.Rup, this);
            nes6.events.onInputUp.add(this.Rup, this);

            nes7 = nes.getFirstExists(false);
            nes7.animations.add('DL', [6], frameSpeed, false);
            nes7.reset(nes4.x, nes4.y + nes4.height);
            nes7.play('DL', false);
            nes7.inputEnabled = true;
            nes7.events.onInputDown.add(this.DLclicked, this);
            nes7.events.onInputOver.add(this.DLclicked, this);
            nes7.events.onInputOut.add(this.DLup, this);
            nes7.events.onInputUp.add(this.DLup, this);

            nes8 = nes.getFirstExists(false);
            nes8.animations.add('D', [7], frameSpeed, false);
            nes8.reset(nes7.x + nes7.width, nes7.y);
            nes8.play('D', false);
            nes8.inputEnabled = true;
            nes8.events.onInputDown.add(this.Dclicked, this);
            nes8.events.onInputOver.add(this.Dclicked, this);
            nes8.events.onInputOut.add(this.Dup, this);
            nes8.events.onInputUp.add(this.Dup, this);

            nes9 = nes.getFirstExists(false);
            nes9.animations.add('DR', [8], frameSpeed, false);
            nes9.reset(nes8.x + nes8.width, nes8.y);
            nes9.play('DR', false);
            nes9.inputEnabled = true;
            nes9.events.onInputDown.add(this.DRclicked, this);
            nes9.events.onInputOver.add(this.DRclicked, this);
            nes9.events.onInputOut.add(this.DRup, this);
            nes9.events.onInputUp.add(this.DRup, this);

            var nes10 = this.game.add.sprite(80, 80, 'nes2')
            nes10.anchor.set(0.5, 0.5)
            nes10.alpha = 0.3;
            nes10.reset(this.game.world.width - this.game.world.width / 7, this.game.world.height - this.game.world.height / 3 + nes10.height / 2);
            this.game.physics.enable(nes10, Phaser.Physics.ARCADE);
            nes10.inputEnabled = true;
            nes10.events.onInputDown.add(this.fire, this);

        }

        fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cursors = this.game.input.keyboard.createCursorKeys();

        this.game.input.addPointer();

        var s1 = pyramids.getFirstExists(false);
        s1.reset(200, 200);
        s1.isDestructable = 1;
        s1.damage = 0;

    },
    LUclicked: function () {
        cursors.left.isDown = true;
        cursors.up.isDown = true;
        cursors.left.isUp = false;
        cursors.up.isUp = false;
    },
    LUup: function () {
        cursors.left.isUp = true;
        cursors.up.isUp = true;
        cursors.left.isDown = false;
        cursors.up.isDown = false;
    },
    Uclicked: function () {
        cursors.up.isDown = true;
        cursors.up.isUp = false;
    },
    Uup: function () {
        cursors.up.isUp = true;
        cursors.up.isDown = false;
    },
    URclicked: function () {
        cursors.up.isDown = true;
        cursors.right.isDown = true;
        cursors.up.isUp = false;
        cursors.right.isUp = false;
    },
    URup: function () {
        cursors.up.isDown = false;
        cursors.right.isDown = false;
        cursors.up.isUp = true;
        cursors.right.isUp = true;
    },
    Lclicked: function () {
        cursors.left.isDown = true;
        cursors.left.isUp = false;
    },
    Lup: function () {
        cursors.left.isDown = false;
        cursors.left.isUp = true;
    },
    Rclicked: function () {
        cursors.right.isDown = true;
        cursors.right.isUp = false;
    },
    Rup: function () {
        cursors.right.isDown = false;
        cursors.right.isUp = true;
    },
    DLclicked: function () {
        cursors.left.isDown = true;
        cursors.down.isDown = true;
        cursors.left.isUp = false;
        cursors.down.isUp = false;
    },
    DLup: function () {
        cursors.left.isDown = false;
        cursors.down.isDown = false;
        cursors.left.isUp = true;
        cursors.down.isUp = true;
    },
    Dclicked: function () {
        cursors.down.isDown = true;
        cursors.down.isUp = false;
    },
    Dup: function () {
        cursors.down.isDown = false;
        cursors.down.isUp = true;
    },
    DRclicked: function () {
        cursors.right.isDown = true;
        cursors.down.isDown = true;
        cursors.right.isUp = false;
        cursors.down.isUp = false;
    },
    DRup: function () {
        cursors.right.isDown = false;
        cursors.down.isDown = false;
        cursors.right.isUp = true;
        cursors.down.isUp = true;
    },


    update: function () {


        if (this.game.device.iOS) {
            if (this.game.input.currentPointers == 0 && !this.game.input.activePointer.isMouse) {
                cursors.up.isDown = false;
                cursors.right.isDown = false;
                cursors.left.isDown = false;
                cursors.down.isDown = false;
                cursors.up.isUp = true;
                cursors.right.isUp = true;
                cursors.left.isUp = true;
                cursors.down.isUp = true;
            }
        }


        ship.body.velocity.x = 0;
        ship.body.velocity.y = 0;


        if (livingEnemies1) {
            livingEnemies1.length = 0;

            aliens1.forEachAlive(function (alien) {

                // put every living enemy in an array
                livingEnemies1.push(alien);
            });

            enemy1Count = livingEnemies1.length;
        }
        //++++++++++++++
        if (livingEnemies2) {
            livingEnemies2.length = 0;

            aliens2.forEachAlive(function (alien) {

                // put every living enemy in an array
                livingEnemies2.push(alien);
            });

            enemy2Count = livingEnemies2.length;
        }
        //++++++++++++++
        if (livingEnemies3) {
            livingEnemies3.length = 0;

            aliens3.forEachAlive(function (alien) {

                // put every living enemy in an array
                livingEnemies3.push(alien);
            });

            enemy3Count = livingEnemies3.length;
        }
        //++++++++++++++

        if (livingEnemies4) {
            livingEnemies4.length = 0;

            aliens4.forEachAlive(function (alien) {

                // put every living enemy in an array
                livingEnemies4.push(alien);
            });

            enemy4Count = livingEnemies4.length;

        }

        if (livingEnemies5) {
            livingEnemies5.length = 0;

            aliens5.forEachAlive(function (alien) {

                // put every living enemy in an array
                livingEnemies5.push(alien);
            });

            enemy5Count = livingEnemies5.length;

        }

        if (enemy1canFire == 1) {
            for (var i = 0; i < livingEnemies1.length; i++) {
                var shooter = livingEnemies1[i];
                if (shooter.body.x < ship.body.x + 2 && shooter.body.x > ship.body.x - 2) {
                    this.enemy1Fires(i);
                }
            }
        }

        if (enemy2canFire == 1) {
            for (var i = 0; i < livingEnemies2.length; i++) {
                var shooter = livingEnemies2[i];
                if (shooter.body.x < ship.body.x + 2 && shooter.body.x > ship.body.x - 2) {
                    this.enemy2Fires(i);
                }
            }
        }

        if (enemy3canFire == 1) {
            for (var i = 0; i < livingEnemies3.length; i++) {
                var shooter = livingEnemies3[i];
                if (shooter.body.x < ship.body.x + 2 && shooter.body.x > ship.body.x - 2 && shooter.body.y < ship.body.y) {
                    this.enemy3Fires(i);
                }
            }
        }
        if (enemy4canFire == 1) {
            for (var i = 0; i < livingEnemies4.length; i++) {
                var shooter = livingEnemies4[i];
                if (shooter.body.x < ship.body.x + 100 && shooter.body.x > ship.body.x - 100) {
                    this.enemy4Fires(i);
                }
            }
        }
        if (enemy5canFire == 1) {
            for (var i = 0; i < livingEnemies5.length; i++) {
                var shooter = livingEnemies5[i];
                if (shooter.body.x < ship.body.x + 100 && shooter.body.x > ship.body.x - 100) {
                    this.enemy5Fires(i);
                }
            }
        }
        if (checkpoint == 1) {
            //this.game.tweens.removeAll();
            aliens1.x += 5;
            aliens1.y += 5;
        }

        if (health == -1) {
            ship.kill();
        }


        if (this.game.time.now > dieTime) {
            ship.tint = 0xffffff;
        }
        else
            if ((this.game.time.now < dieTime) && (ship.tint == 0x91e2ff)) {
                ship.tint = 0xff9fac;
            }
            else if ((this.game.time.now < dieTime) && (ship.tint == 0xff9fac) && (Math.random() > 0.5)) {
                ship.tint = 0x91e2ff;
            }


      //  stage1.y += stagespeed;
      if (this.game.time.fps != 0)
      {
        stage1.autoScroll(0,this.game.time.fps * stagespeed);
      }
//console.log( 'current fps: ' + this.game.time.fps );

        /*
        stage2.y += stagespeed;

        if (stage1.y - this.game.world.height > 0) {
            stage1.y = stage2.y - bgh;
        }
        if (stage2.y - this.game.world.height > 0) {
            stage2.y = stage1.y - bgh;
        }
*/
        pyramids.y += stagespeed;
        pyramidsOffset += stagespeed;

        if (photon) {
            photon.angle += 20;
            photon.y += stagespeed;
        }
        if (shrapnel) {
            shrapnel.angle += 20;
            shrapnel.y += stagespeed;
        }

        // Always reset the velocity to zero for top down shooters, rather use the ground to create the forward momentum

        // In phaser 2.1 you need to chekc if the animation manager is running first before you attempt to return the current frame
        if (ship.animations.currentFrame) {
            currentFrame = ship.animations.currentFrame.index;
        }

        // Here we give the ship the ability to move using velocity in 8 directions
        // We use logic to determine where in the ships animation it is and then play the relevant follow on animation
        // For instance if the ship is currently rotated all the way right and the user lets go of the button we want the ship to rotate back to center.

        if ((cursors.left.isDown) && (cursors.up.isUp) && (cursors.down.isUp)) {

            ship.body.velocity.x = -shipvelocity;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('left', frameSpeed, false);
            }
            if (currentFrame == 29) {
                ship.animations.play('rightReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
        }
        else if ((cursors.left.isDown) && (cursors.up.isDown)) {

            ship.body.velocity.x = -shipvelocity;
            ship.body.velocity.y = -shipvelocity / 2;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('left', frameSpeed, false);
            }
            if (currentFrame == 29) {
                ship.animations.play('rightReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
        }
        else if ((cursors.left.isDown) && (cursors.down.isDown)) {

            ship.body.velocity.x = -shipvelocity;
            ship.body.velocity.y = +shipvelocity / 2;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('left', frameSpeed, false);
            }
            if (currentFrame == 29) {
                ship.animations.play('rightReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
        }
        else if ((cursors.right.isDown) && (cursors.up.isUp) && (cursors.down.isUp)) {

            ship.body.velocity.x = shipvelocity;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('right', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
            if (currentFrame == 9) {
                ship.animations.play('leftReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }

        }
        else if ((cursors.right.isDown) && (cursors.up.isDown)) {

            ship.body.velocity.x = shipvelocity;
            ship.body.velocity.y = -shipvelocity / 2;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('right', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
            if (currentFrame == 9) {
                ship.animations.play('leftReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }

        }
        else if ((cursors.right.isDown) && (cursors.down.isDown)) {

            ship.body.velocity.x = shipvelocity;
            ship.body.velocity.y = shipvelocity / 2;

            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('right', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
            if (currentFrame == 9) {
                ship.animations.play('leftReturn', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }

        }
        else if ((cursors.up.isDown) && (cursors.left.isUp) && (cursors.right.isUp)) {
            // Hit the boosters!!
            ship.body.velocity.y = -shipvelocity / 2;
            if (currentFrame == 0 || currentFrame == 20 || currentFrame == 10) {
                ship.animations.play('boost', frameSpeed, false);
                if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
            }
        }
        else if (cursors.down.isDown) {

            ship.body.velocity.y = shipvelocity / 2;

            if (currentFrame == 0 || currentFrame == 10 || currentFrame == 20 || currentFrame == 19)
                ship.animations.play('fly');
            if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
        }
        else if (currentFrame == 29) {
            ship.animations.play('rightReturn', frameSpeed, false);
            if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
        }
        else if (currentFrame == 19) {
            ship.animations.play('fly', frameSpeed, false);
            if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
        }
        else if (currentFrame == 9) {
            ship.animations.play('leftReturn', frameSpeed, false);
            if (ship.animations.currentFrame) { currentFrame = ship.animations.currentFrame.index; }
        }


        // Here is the fire function

        if (fireButton.isDown) {

            this.fire();
        }

        //  Run collision
        this.game.physics.arcade.overlap(bullets, aliens1, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(bullets, aliens2, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(bullets, aliens3, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(bullets, aliens4, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(bullets, aliens6, this.collisionHandler, null, this);

        this.game.physics.arcade.overlap(shrapnels, aliens1, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(shrapnels, aliens2, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(shrapnels, aliens3, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(shrapnels, aliens4, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(shrapnels, aliens6, this.collisionHandler, null, this);

        //  Run this.collision between aliens

        this.game.physics.arcade.overlap(enemy1Bullets, aliens2, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy1Bullets, aliens3, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy1Bullets, aliens4, this.collisionHandler, null, this);

        this.game.physics.arcade.overlap(enemy2Bullets, aliens1, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy2Bullets, aliens3, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy2Bullets, aliens4, this.collisionHandler, null, this);

        this.game.physics.arcade.overlap(enemy3Bullets, aliens1, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy3Bullets, aliens2, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy3Bullets, aliens4, this.collisionHandler, null, this);

        this.game.physics.arcade.overlap(enemy4Bullets, aliens1, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy4Bullets, aliens2, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(enemy4Bullets, aliens3, this.collisionHandler, null, this);

        // other collisions
        this.game.physics.arcade.overlap(bullets, pyramids, this.bulletHitsPyramid, null, this);
        this.game.physics.arcade.overlap(shrapnels, pyramids, this.bulletHitsPyramid, null, this);

        this.game.physics.arcade.overlap(aliens1, ship, this.enemyHitsPlayer, null, this);
        this.game.physics.arcade.overlap(aliens2, ship, this.enemyHitsPlayer, null, this);
        this.game.physics.arcade.overlap(aliens3, ship, this.enemyHitsPlayer, null, this);
        this.game.physics.arcade.overlap(aliens4, ship, this.enemyHitsPlayer, null, this);
        this.game.physics.arcade.overlap(aliens5, ship, this.enemyHitsPlayer, null, this);

        this.game.physics.arcade.overlap(pyramids, ship, this.playerHitsPyramid, null, this);
        this.game.physics.arcade.overlap(ship, photon, this.playerHitsPhoton, null, this);
        this.game.physics.arcade.overlap(ship, shrapnel, this.playerHitsShrapnel, null, this);

        this.game.physics.arcade.overlap(ship, enemy1Bullets, this.enemyBulletHitsPlayer, null, this);
        this.game.physics.arcade.overlap(ship, enemy2Bullets, this.enemyBulletHitsPlayer, null, this);
        this.game.physics.arcade.overlap(ship, enemy3Bullets, this.enemyBulletHitsPlayer, null, this);
        this.game.physics.arcade.overlap(ship, enemy4Bullets, this.enemyBulletHitsPlayer, null, this);
        //        this.game.physics.arcade.overlap(ship, enemy5Bullets, this.enemyBulletHitsPlayer, null, this);

    },

    fire: function () {

        if (shipFP > 0) {
            if (health >= 0) {
                //  To avoid them being allowed to fire too fast we set a time limit
                if (this.game.time.now > bulletTime) {
                    //  Grab the first bullet we can from the pool depending on the firepower 

                    if (shipFP == 1) {
                        bullet = bullets.getFirstExists(false);
                        if (bullet) {
                            //  And fire it
                            bullet.reset(ship.x - 5, ship.y - ship.body.height / 2);
                            bullet.body.setSize(10, 10, 10, -10);
                            bullet.anchor.set(0.5, 0.5);
                            bullet.body.velocity.y = bulletVelocity;
                            bullet.bounces = 0;

                            bulletTime = this.game.time.now + 200;
                            photonShot.play('', 0, photonShotVolume, false);
                        }
                    }
                    else if (shipFP == 2) {
                        bullet = shrapnels.getFirstExists(false);
                        if (bullet) {
                            //  And fire it
                            bullet.reset(ship.x - 5, ship.y - ship.body.height / 2);
                            bullet.body.setSize(10, 10, 10, -10);
                            bullet.anchor.set(0.5, 0.5);
                            bullet.body.velocity.y = shrapnelVelocity;
                            bullet.bounces = 0;

                            bulletTime = this.game.time.now + 200;
                            photonShot.play('', 0, photonShotVolume, false);
                        }
                    }
                }
            }
        }
    },

    fireShrapnel: function (x, y) {

        //        console.log(shrapnelTime);
        //        if (this.game.time.now > shrapnelTime) {
        if (shipFP == 2) {
            var bullet = shrapnels.getFirstExists(false);
            if (bullet) {
                //  And fire it
                bullet.reset(x, y);
                bullet.body.setSize(10, 10, 10, -10);
                bullet.anchor.set(0.5, 0.5);
                bullet.body.velocity.x = shrapnelVelocity;
                bullet.bounces = 1;
                photonShot.play('', 0, photonShotVolume, false);

            }
            var bullet2 = shrapnels.getFirstExists(false);
            if (bullet2) {
                //  And fire it
                bullet2.reset(x, y);
                bullet2.body.setSize(10, 10, 10, -10);
                bullet2.anchor.set(0.5, 0.5);
                bullet2.body.velocity.x = -shrapnelVelocity;
                bullet.bounces = 1;
                photonShot.play('', 0, photonShotVolume, false);

            }
            shrapnelTime = this.game.time.now + 200;
        }

        //        }

    },

    createAliensDynamic: function (level, tweens, alienGroup, enemySpeed) {

        var alien = alienGroup.getFirstExists(false);
        alien.reset(catshipLevels.Aliens[level].startx, catshipLevels.Aliens[level].starty);
        alien.anchor.setTo(0.5, 0.5);
        alien.body.moves = false;

        tweenObj[tweenCount] = this.game.add.tween(alien)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens].x, y: catshipLevels.Aliens[level].Tweens[tweens].y }, catshipLevels.Aliens[level].Tweens[tweens].t, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 1].x, y: catshipLevels.Aliens[level].Tweens[tweens + 1].y }, catshipLevels.Aliens[level].Tweens[tweens + 1].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 2].x, y: catshipLevels.Aliens[level].Tweens[tweens + 2].y }, catshipLevels.Aliens[level].Tweens[tweens + 2].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 3].x, y: catshipLevels.Aliens[level].Tweens[tweens + 3].y }, catshipLevels.Aliens[level].Tweens[tweens + 3].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 4].x, y: catshipLevels.Aliens[level].Tweens[tweens + 4].y }, catshipLevels.Aliens[level].Tweens[tweens + 4].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 5].x, y: catshipLevels.Aliens[level].Tweens[tweens + 5].y }, catshipLevels.Aliens[level].Tweens[tweens + 5].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 6].x, y: catshipLevels.Aliens[level].Tweens[tweens + 6].y }, catshipLevels.Aliens[level].Tweens[tweens + 6].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 7].x, y: catshipLevels.Aliens[level].Tweens[tweens + 7].y }, catshipLevels.Aliens[level].Tweens[tweens + 7].t / enemySpeed, Phaser.Easing.Linear.None)
                .loop()
    .start();
        enemyCount += 1;
        tweenCount += 1;
        if (debug == 1) {
            console.log('This is the ref:' + tweenObj[tweenCount]);
        }

        if (alien.key == 'bossEneme1') {
            var alien = aliens6.getFirstExists(false);
            alien.reset(catshipLevels.Aliens[level].startx, catshipLevels.Aliens[level].starty);
            alien.anchor.setTo(0.5, 0.5);
            alien.body.moves = false;

            tweenObj[tweenCount] = this.game.add.tween(alien)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens].x, y: catshipLevels.Aliens[level].Tweens[tweens].y }, catshipLevels.Aliens[level].Tweens[tweens].t, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 1].x, y: catshipLevels.Aliens[level].Tweens[tweens + 1].y }, catshipLevels.Aliens[level].Tweens[tweens + 1].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 2].x, y: catshipLevels.Aliens[level].Tweens[tweens + 2].y }, catshipLevels.Aliens[level].Tweens[tweens + 2].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 3].x, y: catshipLevels.Aliens[level].Tweens[tweens + 3].y }, catshipLevels.Aliens[level].Tweens[tweens + 3].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 4].x, y: catshipLevels.Aliens[level].Tweens[tweens + 4].y }, catshipLevels.Aliens[level].Tweens[tweens + 4].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 5].x, y: catshipLevels.Aliens[level].Tweens[tweens + 5].y }, catshipLevels.Aliens[level].Tweens[tweens + 5].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 6].x, y: catshipLevels.Aliens[level].Tweens[tweens + 6].y }, catshipLevels.Aliens[level].Tweens[tweens + 6].t / enemySpeed, Phaser.Easing.Linear.None)
                 .to({ x: catshipLevels.Aliens[level].Tweens[tweens + 7].x, y: catshipLevels.Aliens[level].Tweens[tweens + 7].y }, catshipLevels.Aliens[level].Tweens[tweens + 7].t / enemySpeed, Phaser.Easing.Linear.None)
                .loop()
    .start();
            enemyCount += 1;
            tweenCount += 1;
        }


    },

    spawnAliensDynamic: function (level, tweens, alienGroup, enemySpeed, x, y) {

        var alien = alienGroup.getFirstExists(false);
        alien.reset(x, y);
        alien.anchor.setTo(0.5, 0.5);
        alien.body.moves = false;

        tweenObj[tweenCount] = this.game.add.tween(alien)
                 .to({ x: (x + 250), y: y }, 1000, Phaser.Easing.Linear.None)
                 .to({ x: 0, y: 100 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x + 30, y: 100 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x - 20, y: ship.y - 20 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x + 10, y: ship.y + 10 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x - 10, y: ship.y - 10 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x + 10, y: ship.y + 10 }, 3000, Phaser.Easing.Linear.None)
                 .to({ x: ship.x, y: ship.y }, 1000, Phaser.Easing.Linear.None)
                 .loop()
    .start();
        enemyCount += 1;
        tweenCount += 1;
    },


    createPyramids: function (row) {

        if (row < catshipLevels.Pyramids.length) {
            for (var i = 0; i < catshipLevels.Pyramids[row].pos.length; i++) {
                var s = pyramids.getFirstExists(false);
                if (s) {
                    s.reset(catshipLevels.Pyramids[row].pos[i].x, catshipLevels.Pyramids[row].pos[i].y - pyramidsOffset);
                    s.body.moves = false;
                    s.isDestructable = 1;
                    s.damage = 0;
                }
                pyramidCount += 1;
                //console.log('Running Pyr 1 for row: ' + row);
            }
        }

    },

    createPyramids2: function (row) {

        if (row < catshipLevels.Pyramids2.length) {
            for (var i = 0; i < catshipLevels.Pyramids2[row].pos.length; i++) {
                var s = pyramids.getFirstExists(false);
                if (s) {
                    s.reset(catshipLevels.Pyramids2[row].pos[i].x, catshipLevels.Pyramids2[row].pos[i].y - pyramidsOffset);
                    s.body.moves = false;
                    s.isDestructable = catshipLevels.Pyramids2[row].pos[i].d;
                    s.damage = 0;
                    s.visible = true;
                }
                //                s.animations.add('destruct', [s.damage], 20, true);
                //                s.animations.play('destruct', frameSpeed, true);
                pyramidCount += 1;
                //console.log('Running Pyr 2 for row: ' + row + '    pyr statistics: X:' + s.x + ' , Y:' + s.y + ' ... sprite' + s.body);
            }
        }

    },


    enemy1Fires: function (enemy1Index) {

        if (enemy1canFire == 1) {
            enemy1Bullet = enemy1Bullets.getFirstExists(false);
            livingEnemies1.length = 0;
            aliens1.forEachAlive(function (alien) {
                livingEnemies1.push(alien);
            });
            if (enemy1Bullet && livingEnemies1.length > 0) {
                var shooter = livingEnemies1[enemy1Index];
                enemy1Bullet.reset(shooter.body.x, shooter.body.y);
                enemy1Bullet.anchor.set(0.5);
                enemy1Bullet.body.velocity.y = bulletVelocity / 2;
                firingTimer1 = this.game.time.now + 2000;
                shot.play('', 0, shotVolume, false);
                enemyBulletsFired += 1;
            }
        }
    },

    enemy2Fires: function (enemy2Index) {

        if (enemy2canFire == 1) {
            enemy2Bullet = enemy2Bullets.getFirstExists(false);
            livingEnemies2.length = 0;
            aliens2.forEachAlive(function (alien) {
                livingEnemies2.push(alien);
            });

            if (enemy2Bullet && livingEnemies2.length > 0) {
                var random = this.game.rnd.integerInRange(0, livingEnemies2.length - 1);
                var shooter = livingEnemies2[random];
                enemy2Bullet.reset(shooter.body.x, shooter.body.y);
                enemy2Bullet.anchor.set(0.5);
                this.game.physics.arcade.moveToObject(enemy2Bullet, ship, -bulletVelocity / 2);
                firingTimer2 = this.game.time.now + 2000;
                shot.play('', 0, shotVolume, false);
                enemyBulletsFired += 1;
            }
        }
    },

    enemy3Fires: function (enemy3Index) {

        if (enemy3canFire == 1) {
            enemy3Bullet = enemy3Bullets.getFirstExists(false);
            livingEnemies3.length = 0;
            aliens3.forEachAlive(function (alien) {
                livingEnemies3.push(alien);
            });
            if (enemy3Bullet && livingEnemies3.length > 0) {
                var shooter = livingEnemies3[enemy3Index];
                enemy3Bullet.reset(shooter.body.x, shooter.body.y + 50);
                enemy3Bullet.anchor.set(0.5);
                this.game.physics.arcade.moveToObject(enemy3Bullet, ship, -bulletVelocity / 2);
                firingTimer3 = this.game.time.now + 2000;
                shot.play('', 0, shotVolume, false);
                enemyBulletsFired += 1;
            }
        }

    },

    enemy4Fires: function (enemy4Index) {

        if (enemy4canFire == 1 && this.game.time.now > firingTimer4) {
            enemy4Ord = enemy4Bullets.getFirstExists(false);
            this.game.physics.enable(enemy4Ord, Phaser.Physics.ARCADE);
            livingEnemies4.length = 0;
            aliens4.forEachAlive(function (alien) {
                livingEnemies4.push(alien);
            });
            if (enemy4Ord && livingEnemies4.length > 0) {
                var shooter = livingEnemies4[enemy4Index];
                enemy4Ord.animations.add('wriggle', [0, 1, 2, 3, 4, 5, 6], 20, true);
                enemy4Ord.reset(shooter.body.x, shooter.body.y + 50);
                enemy4Ord.animations.play('wriggle', frameSpeed, true);
                enemy4Ord.anchor.set(0.5);
                this.game.physics.arcade.moveToObject(enemy4Ord, ship, -boomslangVelocity);
                firingTimer4 = this.game.time.now + 200;
                gammaLaser.play('', 0, gammaLaserVolume, false);
                enemyBulletsFired += 1;
            }
        }
    },

    enemy5Fires: function (enemy5Index) {

        if (enemy5canFire == 1 && this.game.time.now > firingTimer5) {

            enemy1Bullet = enemy1Bullets.getFirstExists(false);
            if (enemy1Bullet) {
                if (debug == 1) {
                    console.log('fired 1 !!!');
                }
                var shooter = livingEnemies5[enemy5Index];
                enemy1Bullet.reset(shooter.body.x + 50, shooter.body.y + 210);
                enemy1Bullet.anchor.set(0.5);
                this.game.physics.arcade.moveToObject(enemy1Bullet, ship, -boomslangVelocity);
                //enemy1Bullet.body.velocity.y = bulletVelocity / 2;
                firingTimer5 = this.game.time.now + 1000;
                shot.play('', 0, shotVolume, false);
                enemyBulletsFired += 1;
            }
            enemy1Bullet = enemy1Bullets.getFirstExists(false);
            if (enemy1Bullet) {
                if (debug == 1) {
                    console.log('fired 1 !!!');
                }
                var shooter = livingEnemies5[enemy5Index];
                enemy1Bullet.reset(shooter.body.x + 194, shooter.body.y + 217);
                enemy1Bullet.anchor.set(0.5);
                this.game.physics.arcade.moveToObject(enemy1Bullet, ship, -boomslangVelocity);
                //enemy1Bullet.body.velocity.y = bulletVelocity / 2;
                firingTimer5 = this.game.time.now + 1000;
                shot.play('', 0, shotVolume, false);
                enemyBulletsFired += 1;
            }
            var fourNum = Math.floor(Math.random() * 4) + 1;
            if (debug == 1) {
                console.log('Rand bullet: ' + fourNum);
            }
            if (fourNum == 1) {
                this.spawnAliensDynamic(0, tweens, aliens1, 1, shooter.body.x + 120, shooter.body.y + 10)
            }
            else if (fourNum == 2) {
                this.spawnAliensDynamic(1, tweens, aliens2, 1, shooter.body.x + 120, shooter.body.y + 10)
            }
            else if (fourNum == 3) {
                this.spawnAliensDynamic(2, tweens, aliens3, 1, shooter.body.x + 120, shooter.body.y + 10)
            }
            else if (fourNum == 4) {
                this.spawnAliensDynamic(3, tweens, aliens4, 1, shooter.body.x + 120, shooter.body.y + 10)
            }
        }
    },

    setup09Ordinance: function (ordinance) {

        ordinance.anchor.x = 0.5;
        ordinance.anchor.y = 0.5;
        ordinance.animations.add('kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, false);

    },

    setup06Ordinance: function (ordinance) {

        ordinance.anchor.x = 0.5;
        ordinance.anchor.y = 0.5;
        ordinance.animations.add('wriggle', [0, 1, 2, 3, 4, 5, 6], 20, false);

    },

    setup716Ordinance: function (ordinance) {

        ordinance.anchor.x = 0.5;
        ordinance.anchor.y = 0.5;
        ordinance.animations.add('splooge', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 20, false);

    },

    collisionHandler: function (bullet, alien) {
        if (debug == 1) {
            console.log('eneme key: ' + alien.key + 'enemy5Vulnerable: ' + enemy5vulnerable);
        }
        //  When a bullet hits an alien we kill them both

        if (alien.key == 'eneme1' && enemy1vulnerable == 0) {

        }
        else if (alien.key == 'eneme2' && enemy2vulnerable == 0) {

        }
        else if (alien.key == 'eneme3' && enemy3vulnerable == 0) {

        }
        else if (alien.key == 'eneme4' && enemy4vulnerable == 0) {

        }
        else if (alien.key == 'bossHitArea' && enemy5vulnerable == 1) {
            bullet.kill();
            score += 20;
            scoreText.text = scoreString + score;
            var explosion = explosions.getFirstExists(false);
            explosion.reset(bullet.body.x, bullet.body.y);
            explosion.play('kaboom', 30, false, true);
            ff.play('', 0, 0.1, false);
            if (alienHealth >= 0) {
                if (alienHealth % 1 == 0) {
                    AFFCells[alienHealth].destroy();
                }
                alienHealth -= 0.5;
            }
            else {
                alien.kill();
                sb += 1;
            }
        }
        else {

            bullet.kill();

            //  Increase the score
            score += 20;
            scoreText.text = scoreString + score;

            //  And create an explosion :)
            var explosion = explosions.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);

            // When the alien dies from impact
            alien.kill();
            enemyDie.play('', 0, enemyDieVolume, false);
        }

    },

    playerHitsPyramid: function (player, pyramids) {

        if ((health >= 0) && (this.game.time.now > dieTime)) {
            //  Decrease the score
            score -= 20;
            scoreText.text = scoreString + score;

            for (var i = 0; i < 6; i++) {
                if (health >= 0) {
                    FFCells[health].destroy();
                    health -= 1;
                }
            }
            dieTime = this.game.time.now + dieDelay;
            ship.tint = 0x91e2ff;

            //  And create an explosion :)
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('kaboom', 30, false, true);
            ff.play('', 0, ffVolume, false);
            // When the player dies from impact
            if (health < 0) {
                wind.stop();
                //track.stop();
                this.game.state.start("GameOver", true, false, score);
            }
        }

    },
    playerHitsPhoton: function (player, photon) {

        photon.kill();
        score += 200;
        scoreText.text = scoreString + score;
        ship.tint = 0x42b56c;
        shipFP = 1;
        photon.play('', 0, 0.1, false);

    },
    playerHitsShrapnel: function (player, shrapnel) {

        shrapnel.kill();
        score += 200;
        scoreText.text = scoreString + score;
        ship.tint = 0x42b56c;
        shipFP = 2;
        //photon.play('', 0, 0.5, false);

    },

    enemyHitsPlayer: function (player, alien) {


        if ((health >= 0) && (this.game.time.now > dieTime)) {
            alien.kill();
            for (var i = 0; i < 13; i++) {
                if (health >= 0) {
                    FFCells[health].destroy();
                    health -= 1;
                }
            }
            dieTime = this.game.time.now + dieDelay;
            ship.tint = 0x91e2ff;
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('kaboom', 30, false, true);
            enemyDie.play('', 0, enemyDieVolume, false);
        }
        // When the player dies from impact
        if (health < 0) {
            for (var i = 0; i <= health; i++) {
                FFCells[i].destroy();
            }
            enemyDie.play('', 0, enemyDieVolume, false);
            wind.stop();
            ////track.stop();
            this.game.state.start("GameOver", true, false, score);
        }
        // When the alien dies from impact
        if (alienHealth < 0) {
            //enemy1Bullets.callAll('kill');
            stateText.text = "Success!";
            stateText.visible = true;
        }

    },

    bulletHitsPyramid: function (bullet, pyramid) {

        if (bullet.key == 'bullet') {
            bullet.kill();
            var explosion = explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('kaboom', 30, false, true);
            }
            if (pyramid.isDestructable > 0) {
                pyramid.damage += 1;
                if (pyramid.damage < 4) {
                    pyramid.animations.add('destruct', [pyramid.damage], 20, true);
                    pyramid.animations.play('destruct', frameSpeed, true);
                    pyrHit.play('', 0, pyrHitVolume, false);
                }
                else {
                    pyramid.kill();
                    if (pyramid.isDestructable == 2) {
                        shrapnel = this.game.add.sprite(bullet.x, bullet.y, 'shrapnel');
                        shrapnel.anchor.setTo(0.5, 0.5);
                        this.game.physics.enable(shrapnel, Phaser.Physics.ARCADE);
                    }
                }
            }
        }
        else if (bullet.key == 'shrapnelShot' && bullet.bounces == 0) {

            this.fireShrapnel(bullet.body.x, bullet.body.y);
            bullet.kill();
            var explosion = explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play('kaboom', 30, false, true);
            }
            if (pyramid.isDestructable > 0) {
                pyramid.damage += 1;
                if (pyramid.damage < 4) {
                    pyramid.animations.add('destruct', [pyramid.damage], 20, true);
                    pyramid.animations.play('destruct', frameSpeed, true);
                    pyrHit.play('', 0, pyrHitVolume, false);
                }
                else {
                    pyramid.kill();
                    if (pyramid.isDestructable == 2) {
                        shrapnel = this.game.add.sprite(bullet.x, bullet.y, 'shrapnel');
                        shrapnel.anchor.setTo(0.5, 0.5);
                        this.game.physics.enable(shrapnel, Phaser.Physics.ARCADE);
                    }
                }
            }
        }
    },


    enemyBulletHitsPlayer: function (player, bullet) {

        if ((health >= 0) && (this.game.time.now > dieTime)) {

            for (var i = 0; i < 2; i++) {
                if (health >= 0) {
                    FFCells[health].destroy();
                    health -= 1;
                }
            }


            dieTime = this.game.time.now + dieDelay;
            ship.tint = 0x91e2ff;
            var explosion = enemy4ExpGroup.getFirstExists(false);
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.reset(bullet.body.x, bullet.body.y);
            bullet.kill();
            explosion.play('splooge', 30, false, true);
            ff.play('', 0, ffVolume, false);
        }
        else if ((health >= 0) && (this.game.time.now <= dieTime)) {
            bullet.kill();
            var explosion = enemy4ExpGroup.getFirstExists(false);
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.reset(player.body.x, player.body.y);
            explosion.play('splooge', 30, false, true);
            ff.play('', 0, ffVolume, false);
        }
        // When the player dies from impact
        if (health < 0) {
            for (var i = 0; i <= health; i++) {
                FFCells[i].destroy();
            }
            wind.stop();
            ////track.stop();
            this.game.state.start("GameOver", true, false, score);
        }

    },
    updateCounter: function () {
        //Here is where we run the game storyboard
        if (storyboard == 5) {
            total++;
        }

        //console.log('e1: ' + enemy1Count + '      e2: ' + enemy2Count + '     e3: ' + enemy3Count + '      e4: ' + enemy4Count)
        if (total > 8 && total < 12 && sb == 0) {
            sb1 = this.game.add.sprite(ship.x - 20, ship.y + 20, 'sb1');
            sb += 1;
        }
        if (total == 16 && sb == 1) {
            sb1.kill();
        }


        //@@@@@@ blue enemies arrive pacing the bottom of the screen
        if (total > 16 && total < 20 && level == 0 && enemyCount < 2) {
            this.createAliensDynamic(0, tweens, aliens1, 1);
        }
        if (total > 28 && total < 32 && level == 0 && enemyCount < 4) {
            this.createAliensDynamic(0, tweens, aliens1, 1);
        }
        //@@@@@@enemies circling the catship
        if (total > 36 && total < 40 && level == 0 && enemyCount < 6) {
            this.createAliensDynamic(1, tweens, aliens2, 1);
            //            this.removeTweens(aliens1, true);
        }
        if (total > 48 && total < 52 && level == 0 && enemyCount < 8) {
            this.createAliensDynamic(1, tweens, aliens2, 1);
        }
        //@@@@@@Red more hectic aliens circling the catship and dropping slow bombs
        if (total > 76 && total < 80 && level == 0 && enemyCount < 10) {
            //enemy3Speed = 1.25;
            this.createAliensDynamic(2, tweens, aliens3, 1);
        }
        if (total > 88 && total < 92 && level == 0 && enemyCount < 12) {
            this.createAliensDynamic(2, tweens, aliens3, 1);
        }

        //@@@@@@First Checkpoint

        if (enemyCount > 11 && (enemy2Count + enemy3Count) == 0 && health >= 0 && sb == 1) {
            sb1 = this.game.add.sprite(0, 0, 'cp1');
            sb1.reset(this.game.world.width / 2, this.game.world.height / 2);

            // we are about to reach the checkpoint, lets save the stats
            checkpointTotal = total;
            checkpointEnemyCount = enemyCount;
            checkpointSb = sb;
            checkpointPyramidCount = pyramidCount;
            checkpointPyramidTimer = pyramidTimer;
            checkpointPyramidsOffset = pyramidsOffset;
            checkpointStage1Y = stage1.y;
            //checkpointStage2Y = stage2.y;
            checkpointPyramidsY = pyramids.y;
            checkpointCheckpoint = checkpoint;
            checkpointShipFP = shipFP;
            checkpointStagespeed = stagespeed;

            sb += 1;
            eventTime = total;
            checkpoint = 1;

            //console.log('Trophy Recieved: ' + trophyReceived + ' sb: ' + sb);

            if (sb == 2 && trophyReceived == 0) {
                //                this.calculateBonus(checkpoint);
                trophyReceived = 1;
                eventTime = total;
            }

        }

        //console.log('Trophy Recieved: ' + trophyReceived + ' sb: ' + sb);

        if (sb == 2 && trophyReceived == 1 && eventTime + 4 < total) {
            if (b1) {
                b1.kill();
                bonusText.visible = false;
                bonus = 0;
            }
            trophyReceived = 2;
            
        }

        if (eventTime + 4 < total && sb == 2) {
            sb1.kill();
            eventTime = total;
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb2');
            sb += 1;
        };
        if (eventTime + 4 < total && sb == 3) {
            sb1.kill();
            sb += 1;
            stagespeed = 4;
 //           groundspeed = 240;
        };

        //@@@@@@Pyramid Maze

        if (pyramidCount < 10 && sb == 4 && pyramidTimer + 8 < total) {
            this.createPyramids(row);
            pyramidTimer = total;
            row += 1;
        }

        if (pyramidTimer + 2 < total && row > 0 && row < 13 && sb < 8) {
            this.createPyramids(row);
            pyramidTimer = total;
            eventTime = total;
            row += 1;
        }

        if (row == 13 && sb == 4 && eventTime + 8 < total) {
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb3');
            photon = this.game.add.sprite(250, 0, 'photon');
            this.game.physics.enable(photon, Phaser.Physics.ARCADE);
            photon.anchor.set(0.5, 0.5);
            sb += 1;
            stagespeed = 1;
       //     groundspeed = 70;
            eventTime = total;
        }
        if (eventTime + 4 < total && sb == 5) {
            sb1.kill();
            sb += 1;
            enemy4Speed = 1.4;
            eventTime = total;
        }

        //@@@@@@Bring on the BoomSLang!

        if (enemyCount < 15 && sb == 6) {
            this.createAliensDynamic(3, tweens, aliens4, 1);
            eventTime = total;
        }
        if (enemyCount < 17 && enemyCount > 14 && sb == 6) {
            this.createAliensDynamic(3, tweens, aliens4, 1);
            eventTime = total;
        }

        //@@@@@@Second Checkpoint
        if (enemyCount > 16 && enemy4Count == 0 && health >= 0 && sb == 6) {
            sb1 = this.game.add.sprite(0, 0, 'cp1');
            sb1.reset(this.game.world.width / 2, this.game.world.height / 2);

            // we are about to reach the checkpoint, lets save the stats
            checkpointTotal = total;
            checkpointEnemyCount = enemyCount;
            checkpointSb = sb;
            checkpointPyramidCount = pyramidCount;
            checkpointPyramidTimer = pyramidTimer;
            checkpointPyramidsOffset = pyramidsOffset;
            checkpointStage1Y = stage1.y;
            //checkpointStage2Y = stage2.y;
            checkpointPyramidsY = pyramids.y;
            checkpointCheckpoint = checkpoint;
            checkpointShipFP = shipFP;
            checkpointStagespeed = stagespeed;
            if (tweenObj[12]) {
                tweenObj[12].pause();
                tweenObj[13].pause();
                tweenObj[14].pause();
                tweenObj[15].pause();
            }

            if (debug == 1) {
                console.log(
            'checkpointTotal             = ' + checkpointTotal
            + 'checkpointEnemyCount        = ' + checkpointEnemyCount
            + 'checkpointSb                = ' + checkpointSb
            + 'checkpointPyramidCount      = ' + checkpointPyramidCount
            + 'checkpointPyramidTimer      = ' + checkpointPyramidTimer
            + 'checkpointPyramidsOffset    = ' + checkpointPyramidsOffset
            + 'checkpointStage1Y           = ' + checkpointStage1Y
           // + 'checkpointStage2Y           = ' + checkpointStage2Y
            + 'checkpointPyramidsY         = ' + checkpointPyramidsY
            + 'checkpointCheckpoint        = ' + checkpointCheckpoint
            + 'checkpointShipFP            = ' + checkpointShipFP
            + 'checkpointStagespeed        = ' + checkpointStagespeed
            );
            }
            sb += 1;
            eventTime = total;
            checkpoint = 2;

        }
        if (eventTime + 4 < total && sb == 7) {
            sb1.kill();
            eventTime = total;
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb2');
            sb += 1;
            pyramidCount = 0;
            row = 0;
            if (pyramids) {
                pyramids.callAll('kill');
            }
        };

        //@@@@@@ There is a structure of pyramids with a row of gaurds behind blocking us

        if (row == 0 && sb == 8) {
            this.createPyramids2(row);
            pyramidTimer = total;
            row += 1;
            if (sb1) {
                sb1.kill();
            }
        }

        //@@@@@@ Pyramid fortress 
        if (pyramidTimer + 6 < total && sb == 8 && row <= 3) {
            this.createPyramids2(row);
            pyramidTimer = total;
            row += 1;
            if (debug == 1) {
                console.log('tweenObj: ' + tweenObj[12] + ' tweenObj: ' + tweenObj[13] + '  tweenObj: ' + tweenObj[20] + '  tweenObj: ' + tweenObj[3]);
            }
        }

        //@@@@@ Hyper Boomslang Aliens
        if (row == 4 && pyramidTimer + 10 < total && sb == 8 && enemyCount < 21) {
            stagespeed = 0;
        //    groundspeed = 0;
            this.createAliensDynamic(4, tweens, aliens4, 1);
        }

        //@@@@@@ Time to move on to the bossman
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 8) {
            stagespeed = 1;
          //  groundspeed = 70;
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb4');
            sb += 1;
            eventTime = total;
        }
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 9 && eventTime + 8 < total) {
            sb1.kill();
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb5');
            sb += 1;
            eventTime = total;
        }
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 10 && eventTime + 8 < total) {
            sb1.kill();
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb6');
            sb += 1;
            eventTime = total;
        }
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 11 && eventTime + 8 < total) {
            sb1.kill();
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb7');
            sb += 1;
            eventTime = total;
        }
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 12 && eventTime + 8 < total) {
            if (sb1) {
                sb1.kill();
            }
            sb1 = this.game.add.sprite(ship.x - 200, ship.y - 114, 'sb8');
            sb += 1;
            eventTime = total;
        }

        //@@@@@@Third Checkpoint
        if (enemyCount > 20 && enemy4Count == 0 && health >= 0 && sb == 12) {
            if (sb1) {
                sb1.kill();
            }
            sb1 = this.game.add.sprite(0, 0, 'cp1');
            sb1.reset(this.game.world.width / 2, this.game.world.height / 2);

            // we are about to reach the checkpoint, lets save the stats
            checkpointTotal = total;
            checkpointEnemyCount = enemyCount;
            checkpointSb = sb;
            checkpointPyramidCount = pyramidCount;
            checkpointPyramidTimer = pyramidTimer;
            checkpointPyramidsOffset = pyramidsOffset;
            checkpointStage1Y = stage1.y;
           // checkpointStage2Y = stage2.y;
            checkpointPyramidsY = pyramids.y;
            checkpointCheckpoint = checkpoint;
            checkpointShipFP = shipFP;
            checkpointStagespeed = stagespeed;

            if (debug == 1) {
                console.log(
            'checkpointTotal             = ' + checkpointTotal
            + 'checkpointEnemyCount        = ' + checkpointEnemyCount
            + 'checkpointSb                = ' + checkpointSb
            + 'checkpointPyramidCount      = ' + checkpointPyramidCount
            + 'checkpointPyramidTimer      = ' + checkpointPyramidTimer
            + 'checkpointPyramidsOffset    = ' + checkpointPyramidsOffset
            + 'checkpointStage1Y           = ' + checkpointStage1Y
           // + 'checkpointStage2Y           = ' + checkpointStage2Y
            + 'checkpointPyramidsY         = ' + checkpointPyramidsY
            + 'checkpointCheckpoint        = ' + checkpointCheckpoint
            + 'checkpointShipFP            = ' + checkpointShipFP
            + 'checkpointStagespeed        = ' + checkpointStagespeed
            );
            }
            sb += 1;
            eventTime = total;
            checkpoint = 3;

        }
        //console.log('row: ' + row + 'pyrtimer:' + pyramidTimer + 'total:' + total + 'enemyCount:' + enemyCount)
        //@@@@@ BossMan 
        if (pyramidTimer + 10 < total && sb == 13 && enemyCount < 22) {

            if (sb1) {
                sb1.kill();
            }

            tweenObj = [];
            this.createAliensDynamic(5, tweens, aliens5, 1);

            // It's on like Doney Kong!
            enemy1vulnerable = 1; // are the enemies vulnerable
            enemy2vulnerable = 1;
            enemy3vulnerable = 1;
            enemy4vulnerable = 1;
            enemy5vulnerable = 1;

            enemy1canFire = 1; // are the enemies able to fire
            enemy2canFire = 1;
            enemy3canFire = 1;
            enemy4canFire = 1;
            enemy5canFire = 1;
        }
        // the user has completed the first level
        if (sb == 14) {
            aliens1.callAll('kill');
            aliens2.callAll('kill');
            aliens3.callAll('kill');
            aliens4.callAll('kill');
            aliens5.callAll('kill');
            aliens6.callAll('kill');
            stagespeed = 3;
          //  groundspeed = 210;
            this.calculateBonus(checkpoint);
            trophyReceived = 3;
            sb += 1;
            eventTime = total;
        }
        // we don't have a level 2 so lets go to the game over sequence
        if (sb == 15 && eventTime + 8 < total) {
            health = -1;
            lives = 1;
            wind.stop();
            //track.stop();
            this.game.state.start("GameOver", true, false, score);
        }
    },

    render: function () {

        if (debug == 1) {

            this.game.debug.pointer(this.game.input.mousePointer);

            this.game.debug.body(ship);

            //console.log('Stage1 Y: ' + stage1.y + ',   Stage2 Y: ' + stage2.y)
            aliens1.forEachAlive(this.renderGroup, this);
            aliens2.forEachAlive(this.renderGroup, this);
            aliens3.forEachAlive(this.renderGroup, this);
            aliens4.forEachAlive(this.renderGroup, this);
            enemy1Bullets.forEachAlive(this.renderGroup, this);
            enemy2Bullets.forEachAlive(this.renderGroup, this);
            enemy3Bullets.forEachAlive(this.renderGroup, this);
            enemy4Bullets.forEachAlive(this.renderGroup, this);
            pyramids.forEachAlive(this.renderGroup, this);
            bullets.forEachAlive(this.renderGroup, this);
            this.game.debug.text('Timer: ' + total, 32, 100);
            //       this.game.debug.quadTree(this.game.physics.arcade.quadTree);
        }
    },
    renderGroup: function (member) {
        this.game.debug.body(member);
    },
    calculateBonus: function (checkpoint) {

        //@@ Bonus stuff
        // Dodge so well that enemy fires < x 
        // x < 150 : Score 50 (1 tp)
        // x < 100 : Score 100 (2 tp)
        // x < 50 : Score 500 (3 tp)
        // x < 25 : Score 1000 (4 tp)
        if (enemyBulletsFired < 1500) {
            if (enemyBulletsFired < 1000) {
                if (enemyBulletsFired < 500) {
                    if (enemyBulletsFired < 100) {
                        bonus += 1000;
                        CPTrophy += 4;
                    }
                    else {
                        bonus += 500;
                        CPTrophy += 3;
                    }
                }
                else {
                    bonus += 100;
                    CPTrophy += 2;
                }
            }
            else {
                bonus += 50;
                CPTrophy += 1;
            }
        }

        // Avoid any FF damage
        // 0 touches : 1000 (5 tp)
        // 1 touch : 500 (4 tp)
        // 2 touches : 250 (3 tp)
        // 3 touches : 100 (2 tp)
        // 4 touches : 50 (1 tp)

        if (lives == 3) {
            if (health == 12) {
                bonus += 1000;
                CPTrophy += 5;
            }
            if (health == 11) {
                bonus += 500;
                CPTrophy += 4;
            }
            if (health == 10) {
                bonus += 250;
                CPTrophy += 3;
            }
            if (health == 9) {
                bonus += 100;
                CPTrophy += 2;
            }
            if (health == 8) {
                bonus += 50;
                CPTrophy += 1;
            }
        }

        // Complete the checkpoint in primo time < x additional passes
        // x < 4 : 300 (1 tp)
        // x < 2 : 500 (2 tp)
        // x = 0 : 1000 (3 tp)

        if (total < 1000) {
            if (total < 750) {
                if (total <= 500) {
                    bonus += 1000;
                    CPTrophy += 3;
                } else {
                    bonus += 500;
                    CPTrophy += 2;
                }
            } else {
                bonus += 300;
                CPTrophy += 1;
            }
        }

        // 1:Brass 2:Copper 3:Bronze 4:Tin 5:Alluminium 6:Steel 7:Gold 8:Titanium
        // 9:Lithium 10:Uranium 11:Plutonium 12:Unobtanium

        switch (CPTrophy) {
            case 1:
                trophyType = 'Brass';
                break;
            case 2:
                trophyType = 'Copper';
                break;
            case 3:
                trophyType = 'Bronze';
                break;
            case 4:
                trophyType = 'Tin';
                break;
            case 5:
                trophyType = 'Alluminium';
                break;
            case 6:
                trophyType = 'Steel';
                break;
            case 7:
                trophyType = 'Gold';
                break;
            case 8:
                trophyType = 'Titanium';
                break;
            case 9:
                trophyType = 'Lithium';
                break;
            case 10:
                trophyType = 'Uranium';
                break;
            case 11:
                trophyType = 'Plutonium';
                break;
            case 12:
                trophyType = 'Unobtanium';
                break;
        }

        //console.log('BONUS ' + bonus + ' POINTS, CPTrophy: ' + CPTrophy + ' Troph Type: ' + trophyType + ' TROPHY!');

        if (bonus > 0) {
            b1 = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 6, 'bonus');
            b1.tint = 0xa37fdc;
            b1.anchor.setTo(0.5);
            bonusText = this.game.add.text(this.game.world.width / 2, this.game.world.height / 6, 'BONUS ' + bonus + ' POINTS, \n' + trophyType + ' TROPHY!', { fontSize: 10, fill: '#e6e031' });
            bonusText.anchor.setTo(0.5, 0.9);
            bonusText.fontSize = 20;
            score += bonus;
            scoreText.text = scoreString + score;
        }
    }

}


    
