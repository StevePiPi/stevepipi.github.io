//Global Variables
let pipi;
let frame = 0;
let ycap = 450;
let width = 960;
let height = 720;
let pipiImg = ['idle', 'walk1', 'walk2', 'walk3', 'walk4', 'walk5', 'walk6', 'walk7', 'walk8', 
    'jump1', 'jump2', 'jump3', 'jump4', 'jump5', 'jump6', 'jump7', 'jump8', 'crouch',
    'crouch2', 'crouch3', 'crouch4', 'crouch5', 'crouch6', 'crouch7', 'crouch8', 'slam', 'hurt', 'back'];
let setFirst = 9;
let setSecond = 8;
let imgMod;

let enemies = [];
let enemId = 0
let enemImg = ['enem1', 'enem2', 'enem3', 'enem4', 'enem5', 'enem6', 'enem7'];

let enemY = [460, 455, 390, 130, 360, 175, 130];
let enemW = [70, 300, 90, 320, 110, 50, 280];
let enemH = [80, 70, 200, 410, 100, 470, 550];

let enemSpeed = 8;
let enemTimer = 0;
let timerCap = 90;

let coins = [];
let coinImg = ['coin1', 'coin2', 'coin3', 'coin4', 'coin5', 'coin6', 'coin7', 'coin8',
    'coin9', 'coin10', 'coin11', 'coin12'];
let coinCollectImg = ['collect1', 'collect2', 'collect3', 'collect4', 'collect5'];
let coinCount = 0;
let coinTimer = 45;
let coinCap = timerCap;

let distance = 0;
let maxDistance = 0;
let maxCount = 0;

let crouch = 0;
let crouchSet = [];
let controlType = [39, 37, 38, 40, 68, 65, 87, 83];

let groundImg = ['beach'];
let backImg = ['beach'];
let back2Img = ['beach'];
let cloudImg = ['beach'];

let bckgImg = ['pause', 'menu', 'beach'];

let state = 'alive';

let sfx = ['jump', 'slam', 'explode', 'coin'];
let music = ['steppinplanet', 'nonchalant', 'runningstart', 'causeway'];
let musicToggle = 1;
let rMusic = 0;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = this.width;
        this.h = this.height;
        this.velocity = 0;
        this.speed = 13;
    }

    move() {
        //Gravity
        this.y += this.velocity;
        //Collision
        if (this.y < ycap) {
            this.velocity += 1;
            } else {
            this.y = ycap
            this.velocity = 0;
            if (this.x > 0) {
              this.x -= 8;
            }
          }
        if (this.x > width) {
            this.x = width;
        }
        //Right
            if (keyIsDown(controlType[0]) && this.x < width) {
            this.x += this.speed;
                if (this.y > (ycap - 1)) {
                this.x += 5;
                }
            }
            if (this.x > width) {
                this.x = width;
            }
        //Left
            if (keyIsDown(controlType[1]) && this.x > 0) {
            this.x -= this.speed;
            }
            if (this.x < 0) {
                this.x = 0;
            }
        //Up
            if (keyIsDown(controlType[2]) && !keyIsDown(controlType[3]) && this.y > (ycap - 1) && crouch == 0) {
            this.velocity = -25;
            sfx[0].play();
            }
        //Down
            if (keyIsDown(controlType[3])) {
                if (this.y < ycap) {
                    if (this.velocity < 35) {
                        sfx[1].play();
                    }
                    this.velocity = 35;
                } else {
                crouch = 1;
                crouchSet = [30, 60, 60];
                }
            } else {
            crouch = 0;
            crouchSet = [0, 40, 112]
            }
    }

    animate() {
        if (state == 'dead') {
            setFirst = 26
            setSecond = 1
        } else {
        if (this.y < ycap) {
            if (this.velocity > 34) {
                //Slam
                setFirst = 25;
                setSecond = 1;
            } else {
                //Jump
                setFirst = 9;
                setSecond = 8;
            }
        } else {
            if (crouch == 1) {
                //Crouch
                setFirst = 17
                if (keyIsDown(controlType[0]) || keyIsDown(controlType[1])) {
                    setSecond = 8;
                } else {
                    setSecond = 1;
                }
            } else {
                if (keyIsDown(controlType[0])) {
                    //Run
                    setFirst = 1;
                    setSecond = 8;
                } else {
                    if (keyIsDown(controlType[1])) {
                        //Back
                        setFirst = 27;
                        setSecond = 1;
                    } else {
                        //Idle
                        setFirst = 0;
                        setSecond = 1;
                    }
                }
            }
        }
        }
    }

    dead() {
        if (this.y > height) {
            frame = 0;
            this.x = width / 2;
            this.y = height / 2;
            this.velocity = 0;
            enemSpeed = 8;
            enemTimer = 0;
            timerCap = 90;
            coinTimer = 45;
            coinCap = timerCap;
            coins = [];
            enemies = [];
            if (distance > maxDistance) {
                maxDistance = Math.floor(distance);
            }
            if (coinCount > maxCount) {
                maxCount = coinCount;
            }
            state = 'pause';
        } else {
            if (deadJump == 0) {
                this.y += this.velocity;
                this.velocity += 1;
            } else {
                this.velocity = -25;
                deadJump = 0;
            }
        }
    }
}

class Enemy {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
      }

    move() {
        this.x -= enemSpeed;
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.i = 0;
        this.d = 0;
      }

    move() {
        this.x -= enemSpeed;
    }
}

class Ground {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x -= enemSpeed;
        if (this.x <= -480) {
            this.x += width * 2;
        }
    }
}

class Back {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x -= enemSpeed / 2;
        if (this.x <= -480) {
            this.x += width * 2;
        }
    }
}

class Back2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x -= enemSpeed / 4;
        if (this.x <= -480) {
            this.x += width * 2;
        }
    }
}

class Clouds {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x -= enemSpeed / 8;
        if (this.x <= -480) {
            this.x += width * 2;
        }
    }
}

function preload() {
    pipiImg[0] = loadImage('pipiasset/pipiidle.png');

    pipiImg[1] = loadImage('pipiasset/pipiwalk.png');
    pipiImg[2] = loadImage('pipiasset/pipiwalk2.png');
    pipiImg[3] = loadImage('pipiasset/pipiwalk3.png');
    pipiImg[4] = loadImage('pipiasset/pipiwalk4.png');
    pipiImg[5] = loadImage('pipiasset/pipiwalk5.png');
    pipiImg[6] = loadImage('pipiasset/pipiwalk6.png');
    pipiImg[7] = loadImage('pipiasset/pipiwalk7.png');
    pipiImg[8] = loadImage('pipiasset/pipiwalk8.png');

    pipiImg[9] = loadImage('pipiasset/pipijump.png');
    pipiImg[10] = loadImage('pipiasset/pipijump2.png');
    pipiImg[11] = loadImage('pipiasset/pipijump3.png');
    pipiImg[12] = loadImage('pipiasset/pipijump4.png');
    pipiImg[13] = loadImage('pipiasset/pipijump5.png');
    pipiImg[14] = loadImage('pipiasset/pipijump6.png');
    pipiImg[15] = loadImage('pipiasset/pipijump7.png');
    pipiImg[16] = loadImage('pipiasset/pipijump8.png');

    pipiImg[17] = loadImage('pipiasset/pipicrouch.png');
    pipiImg[18] = loadImage('pipiasset/pipicrouch2.png');
    pipiImg[19] = loadImage('pipiasset/pipicrouch3.png');
    pipiImg[20] = loadImage('pipiasset/pipicrouch4.png');
    pipiImg[21] = loadImage('pipiasset/pipicrouch5.png');
    pipiImg[22] = loadImage('pipiasset/pipicrouch6.png');
    pipiImg[23] = loadImage('pipiasset/pipicrouch7.png');
    pipiImg[24] = loadImage('pipiasset/pipicrouch8.png');

    pipiImg[25] = loadImage('pipiasset/pipislam.png');
    pipiImg[26] = loadImage('pipiasset/pipihurt.png');
    pipiImg[27] = loadImage('pipiasset/pipiback.png');

    enemImg[0] = loadImage('enemasset/oid.png');
    enemImg[1] = loadImage('enemasset/lotuspatch.png');
    enemImg[2] = loadImage('enemasset/honeysuckle.png');
    enemImg[3] = loadImage('enemasset/slammer.png');
    enemImg[4] = loadImage('enemasset/chatty.png');
    enemImg[5] = loadImage('enemasset/stake.png');
    enemImg[6] = loadImage('enemasset/stake2.png');

    coinImg[0] = loadImage('coinasset/coin.png');
    coinImg[1] = loadImage('coinasset/coin2.png');
    coinImg[2] = loadImage('coinasset/coin3.png');
    coinImg[3] = loadImage('coinasset/coin4.png');
    coinImg[4] = loadImage('coinasset/coin5.png');
    coinImg[5] = loadImage('coinasset/coin6.png');
    coinImg[6] = loadImage('coinasset/coin7.png');
    coinImg[7] = loadImage('coinasset/coin8.png');
    coinImg[8] = loadImage('coinasset/coin9.png');
    coinImg[9] = loadImage('coinasset/coin10.png');
    coinImg[10] = loadImage('coinasset/coin11.png');
    coinImg[11] = loadImage('coinasset/coin12.png');

    coinCollectImg[0] = loadImage('coinasset/coincollect.png');
    coinCollectImg[1] = loadImage('coinasset/coincollect2.png');
    coinCollectImg[2] = loadImage('coinasset/coincollect3.png');
    coinCollectImg[3] = loadImage('coinasset/coincollect4.png');
    coinCollectImg[4] = loadImage('coinasset/coincollect5.png');

    groundImg[0] = loadImage('bckgasset/beach.png');

    backImg[0] = loadImage('bckgasset/dunes.png');

    back2Img[0] = loadImage('bckgasset/sand.png');

    cloudImg[0] = loadImage('bckgasset/clouds.png');

    bckgImg[0] = loadImage('bckgasset/pause.png');
    bckgImg[1] = loadImage('bckgasset/menu.png');
    bckgImg[2] = loadImage('bckgasset/back.png');

    hudImg = loadImage('bckgasset/hud.png');

    sfx[0] = loadSound('sfxasset/Jump.wav');
    sfx[1] = loadSound('sfxasset/Slam.wav');
    sfx[2] = loadSound('sfxasset/Explode.wav');
    sfx[3] = loadSound('sfxasset/Coin.wav');

    music[0] = loadSound('musicasset/bgm1.mp3');
    music[1] = loadSound('musicasset/bgm2.mp3');
    music[2] = loadSound('musicasset/bgm3.mp3');
    music[3] = loadSound('musicasset/bgm4.mp3');
}

function setup() {
    //Modes
    imageMode(CENTER);
    rectMode(CENTER);

    //Canvas
    createCanvas(width, height);
    frameRate(60);
    
    //Objects
    pipi = new Player(width / 2, height / 2);

    g1 = new Ground(480, 615);
    g2 = new Ground(1440, 615);

    b1 = new Back(480, 470);
    b2 = new Back(1440, 470);

    bb1 = new Back2(480, 470);
    bb2 = new Back2(1440, 470);

    cloud1 = new Clouds(480, 60);
    cloud2 = new Clouds(1440, 60);
}

function draw() {
    background(200);

    //BGM
    if (musicToggle == 1) {
        if (!music[Math.floor(rMusic)].isPlaying()) {
            music[Math.floor(rMusic)].play();
        }
    } else {
        music[0].stop();
        music[1].stop();
        music[2].stop();
        music[3].stop();
    }

    //Collision
    function checkCollision(ax, ay, aw, ah, bx, by, bw, bh) {
        if (ax - aw/2 < bx + bw/2 && //check left boundary
            ax + aw/2 > bx - bw/2 && //check right boundary
            ay - ah/2 < by + bh/2 && //check top boundary
            ay + ah/2 > by - bh/2) { //check bottom boundary
          return true;
        } else {
          return false;
        }
    }
    
    //Pause
    if (state == 'pause') {
    
    image(bckgImg[0], width / 2, height / 2, width, height);
    image(bckgImg[1], width / 2, height / 2, bckgImg[1].width / 2.5, bckgImg[1].height / 2.5);

    textSize(70);
    fill(255);
    text(Math.floor(distance), 127, 305);
    text(coinCount, 127, 480);
    text(maxDistance, 545, 305);
    text(maxCount, 545, 480);
    
    } else {
    
    //Background
    image(bckgImg[2], width / 2, height / 2 - 50, width + 20, height);

    //Frame
    frame += 0.5;
    if (frame > 499.5) {
        frame = 0;
    }

    //Clouds
    image(cloudImg[0], cloud1.x, cloud1.y, width + 10, 100);
    image(cloudImg[0], cloud2.x, cloud2.y, width + 10, 100);
    cloud1.move();
    cloud2.move();

    //Back2
    image(back2Img[0], bb1.x, bb1.y, width + 10, 320);
    image(back2Img[0], bb2.x, bb2.y, width + 10, 320);
    bb1.move();
    bb2.move();

    //Back
    image(backImg[0], b1.x, b1.y, width + 20, 350);
    image(backImg[0], b2.x, b2.y, width + 20, 350);
    b1.move();
    b2.move();

    //Coin
    for (const c of coins) {
        c.move();
    }

    tempCoins = []
    for (const c of coins) {
        if (c.x > -200) {
            tempCoins.push(c);
        }
    }
    coins = tempCoins;

    coinMod = Number(0 + Math.floor(frame) % 12);
    myCoin = coinImg[coinMod];

    //Coin Collision
    for (const c of coins) {
        if (checkCollision(pipi.x, pipi.y + crouchSet[0], crouchSet[1], crouchSet[2], c.x, c.y, 70, 70) == true || c.d == 1) {
            if (c.i > 4.5) {
                c.x = -100;
                c.d = 0;
            } else {
                if (c.i == 0) {
                    coinCount++;
                    sfx[3].play();
                }
                c.d = 1;
                image(coinCollectImg[Math.floor(c.i)], c.x, c.y, coinCollectImg[Math.floor(c.i)].width / 5, coinCollectImg[Math.floor(c.i)].height / 5);
                c.i += 0.5;
            }
        } else {
            image(myCoin, c.x, c.y, myCoin.width / 5, myCoin.height / 5);
        }
    }

    //Enemy
    for (const e of enemies) {
        e.move();
    }

    tempEnemies = []
    for (const e of enemies) {
        if (e.x > -200) {
            tempEnemies.push(e);
        }
    }
    enemies = tempEnemies;

    for (const e of enemies) {
        idSelect = enemImg[e.id];
        //rect(e.x, e.y, enemW[e.id], enemH[e.id]);
        image(idSelect, e.x, e.y, idSelect.width / 5, idSelect.height / 5);
    }

    //Enemy Collision
    for (const e of enemies) {
        if (checkCollision(pipi.x, pipi.y + crouchSet[0], crouchSet[1], crouchSet[2], e.x, e.y, enemW[e.id], enemH[e.id]) == true) {
            if (state == 'alive') {
            deadJump = 1;
            sfx[2].play();
            state = 'dead';
            }
        }
    }

    //Ground
    image(groundImg[0], g1.x, g1.y, width + 40, 220);
    image(groundImg[0], g2.x, g2.y, width + 40, 220);
    g1.move();
    g2.move();

    //Player
    imgMod = Number(setFirst + Math.floor(frame) % setSecond);
    myImg = pipiImg[imgMod];

    //rect(pipi.x, pipi.y + crouchSet[0], crouchSet[1], crouchSet[2]);
    image(myImg, pipi.x, pipi.y, myImg.width / 5, myImg.height / 5);
    
    if (state == 'alive') {
        pipi.move();
        distance += 0.05;
    } else {
        pipi.dead();
    }
    pipi.animate();

    //Timers
    if (enemTimer > timerCap) {
        enemId = Math.floor(Math.random() * 7);
        enemies.push(new Enemy(1150, enemY[enemId], enemId));
        if (timerCap > 45) {
        enemSpeed += 0.05
        timerCap -= 0.3
        }
        enemTimer = 0
    } else {
        enemTimer++
    }

    if (coinTimer > coinCap) {
        coinY = random(130, 450);
        coins.push(new Coin(1150, coinY));
        coinCap = random(timerCap / 2, timerCap + 10)
        coinTimer = 0;
    } else {
        coinTimer++
    }

    //Hud
    image(hudImg, 60, 44, hudImg.width / 3, hudImg.height / 3);

    textSize(30);
    fill(0);
    text(Math.floor(distance), 50, 33);
    text(coinCount, 50, 76);
    }
}

function keyPressed() {
    if (keyCode == 32) {
        musicToggle++;
        if (musicToggle > 1) {
            musicToggle = 0;
        }
        rMusic += 0.5;
        if (rMusic > 3.5) {
            rMusic = 0;
        }
    }
}

function mouseClicked() {
    if (state == 'pause') {
        coinCount = 0;
        distance = 0;
        state = 'alive';
    }
}