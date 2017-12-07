 //Local Storage Stuff
 var catshipID; // The users unique catship ID! (used for high scores)

 var text = '{ "players" : [{ "catshipID":"nada" , "name":"nada" , "highScore":0 , "level":0, "gamesPlayed":0, "lastPlayedDate":0 },{ "catshipID":"othernada" , "name":"othernada" , "highScore":0  , "level":0, "gamesPlayed":0, "lastPlayedDate":0  }]}';
 var jsonObject = JSON.parse(text);

 var gamesPlayed = 0;

 //@@ Sound & Audio Stuff

 var fx;
 var photonShotVolume = 0.2;
 var trackVolume = 1;
 var windVolume = 0.1;
 var shotVolume = 0.2;
 var photonShotVolume = 0.2;
 var gammaLaserVolume = 0.05;
 var ffVolume = 0.2;
 var pyrHitVolume = 0.5;
 var enemyDieVolume = 0.2;

 //@@ Debug Stuff

 var debug = 0;
 var startFromCheckpoint = 0;

 //@@ Control Stuff

 var nes;
 var nes1;
 var nes2;
 var nes3;
 var nes4;
 var nes5;
 var nes6;
 var nes7;
 var nes8;
 var nes9;

 var left = false;
 var right = false;
 var down = false;
 var fire = false;
 var up = false;

 //@@ Score Stuff

 var score = 0;
 var scoreText;
 var bonus = 0;
 var trophyType;
 var b1; // bonus text sprite
 var bonusText;
 var trophyReceived = 0;

 // Dodge so well that enemy fires < x 
 // x < 150 : Score 50 (1 tp)
 // x < 100 : Score 100 (2 tp)
 // x < 50 : Score 500 (3 tp)
 // x < 25 : Score 1000 (4 tp)
 var enemyBulletsFired = 0;

 // Avoid any FF damage
 // 0 touches : 500 (1 tp)

 // Complete the checkpoint in primo time < x additional passes
 // x < 4 : 300 (1 tp)
 // x < 2 : 500 (2 tp)
 // x = 0 : 1000 (3 tp)

 var CPTrophy = 0; // 1:Brass 2:Copper 3:Bronze 4:Tin 5:Alluminium 6:Steel 7:Gold 8:Titanium

 //@@ Game Level Stuff

 var row = 0;

 var pyramidsOffset = 0;

 var storyboard = 0;
 var logo;
 var bg;
 var eventTime = 0;
 var checkpoint = 0;

 var sb1; // speech bubble sprite
 var sb2;

 var sb = 0; // index for which speech bubble has been loaded

 var enemyCount = 0; // how many total enemies have been created since the start
 var enemy1Count = 0;
 var enemy2Count = 0;
 var enemy3Count = 0;
 var enemy4Count = 0;
 var enemy5Count = 0;

 var enemy1Speed = 1;
 var enemy2Speed = 1;
 var enemy3Speed = 1;
 var enemy4Speed = 1;
 var enemy5Speed = 1;

 var shipFP = 0; // Fire Power = 0 (no cannons), 1 (photon cannon), 2 (shrapnel cannon)
 var photon;
 var shrapnel;

 var enemy1vulnerable = 0; // are the enemies vulnerable
 var enemy2vulnerable = 1;
 var enemy3vulnerable = 1;
 var enemy4vulnerable = 1;
 var enemy5vulnerable = 1;

 var enemy1canFire = 1; // are the enemies able to fire
 var enemy2canFire = 0;
 var enemy3canFire = 0;
 var enemy4canFire = 1;
 var enemy5canFire = 1;

 var firingTimer1 = 0;
 var firingTimer2 = 0;
 var firingTimer3 = 0;
 var firingTimer4 = 0;
 var firingTimer5 = 0;

 var tweens = 0;
 var myJSON;

 var levelSpeed = 300;
 var enemyDir;
 var shipDrag = 1000;

 var dieTime = 0;
 var dieDelay = 1000;

 var stagespeed = 1;
 var alien;

 var shipvelocity = 500;
 var shipMaxVelocity = 500;
 var ship;
 var stage1;
 var stage2;
 var cursors;
 var touch;

 // The players level and checkpoint information
 var level = 0;
 var total = 0;
 var checkpoint = 0;
 var pyramidCount = 0;
 var pyramidTimer = 0;
 var pyramidCountTotal = 0; // Used??

 // level data 
 var levelTotal = 0;
 var levelEnemyCount = 0;
 var levelSb = 0;
 var levelPyramidCount = 0;
 var levelPyramidTimer = 0;
 var levelPyramidsOffset = 0;
 var levelStage1Y;
 var levelStage2Y;
 var levelPyramidsY;
 var levelCheckpoint = 0;
 var levelShipFP = 0;
 var levelStagespeed = 1;

 // checkpoint data
 var checkpointTotal = 0;
 var checkpointEnemyCount = 0;
 var checkpointSb = 0;
 var checkpointPyramidCount = 0;
 var checkpointPyramidTimer = 0;
 var checkpointPyramidsOffset = 0;
 var checkpointStage1Y = 0;
 var checkpointStage2Y = 0;
 var checkpointPyramidsY = 0;
 var checkpointCheckpoint = 0;
 var checkpointShipFP = 0;
 var checkpointStagespeed = 1;

 var explosionGroup;

 var boomslangVelocity = -500;
 var bulletVelocity = -800;
 var shrapnelVelocity = -600;

 var FFBar;
 var AFFBar;
 var health = 1;
 var alienHealth = 12;

 var groundspeed = 50;
 var shipw;
 var shiph;
 var bgh = 4400;
 var bgw = 800;

 var FFCells = new Array();
 var AFFCells = new Array();
 var bullets = new Array();
 var obstacles = new Array();
 var pyramids = new Array();
 var tweenObj = new Array();

 var tweenCount = 0;

 var currentFrame = 0;
 var frameSpeed = 50;
 var LBP = 'F';

 var numObs = 9;

 var bulletw;
 var bulleth;

 var bullets;
 var fireRate = 100;
 var nextFire = 300;

 var aliens1;
 var aliens2;
 var aliens3;
 var aliens4;

 var bulletTime = 0;
 var shrapnelTime = 0;
 var cursors;
 var fireButton;

 var explosions;

 var enemy1OrdGroup;
 var enemy2OrdGroup;
 var enemy3OrdGroup;
 var enemy4OrdGroup;

 var enemy1ExpGroup;
 var enemy2ExpGroup;
 var enemy3ExpGroup;
 var enemy4ExpGroup;

 var scoreString = '';

 var lives = 1;

 var enemy1Bullet;
 var enemy2Bullet;
 var enemy3Bullet;
 var enemy4Bullet;

 var stateText;
 var livingEnemies1 = [];
 var livingEnemies2 = [];
 var livingEnemies3 = [];
 var livingEnemies4 = [];
 var livingEnemies5 = [];