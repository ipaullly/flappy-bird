// game variables
let game;
let bird;
let cursors;
let bottom_pipe = [];
let top_pipe = [];
let gameOver = false;
let endGame;
let distance;
initialYAxisOffset = [];

window.onload = () => {
  let config = {
    type: Phaser.AUTO,
    autoStart: true,
    width: 600,
    height: 400,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        debug: false
      }
    },
    scene: [playGame],
  };
  
  game = new Phaser.Game(config);  
}

class playGame extends Phaser.Scene {
  constructor(){
    super('PlayGame');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }
  create() {
     // add sky
    this.add.image(400, 300, 'sky');
    // add flappy bird
    bird = this.physics.add.sprite(20, 40, 'bird');
    // add collision detection
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    bird.body.setGravityY(300);

    // for-loop to create three pipes
    this.xPos = 0;
    this.firstRandomNumber;
    for (let i=0;i<3;i++) {
      this.firstRandomNumber = (Math.floor(Math.random() * 10)) + 1;
      if (this.firstRandomNumber < 6) {
        // add random positive number to pipe's new y position
        initialYAxisOffset[i] = (Math.floor(Math.random() * 10)) * 10;
      } else {
        // add random negative number to pipe's new y position
        initialYAxisOffset[i] = (Math.floor(Math.random() * 10)) * (-10);
      }
    }
    this.offset;
    // Create Top pipes
    for (let j=0;j<3;j++) {
      this.offset = initialYAxisOffset[j];
      top_pipe[j] = this.physics.add.sprite(550 + this.xPos, -50 + this.offset, 'pipe' );
      top_pipe[j].body.setAllowGravity(false);
      top_pipe[j].body.setVelocityX(-150);
      top_pipe[j].inableBody = true;
      top_pipe[j].immovable = true;
      top_pipe[j].flipY = true

      this.xPos += 400;
    }
    // Create bottom pipes
    this.xPos = 0; // reset xPos to default value
    for(let i=0;i<3;i++) {
      this.offset = initialYAxisOffset[i];
      bottom_pipe[i] = this.physics.add.sprite(550 + this.xPos, 450 + this.offset, 'pipe' );
      bottom_pipe[i].body.setAllowGravity(false);
      bottom_pipe[i].body.setVelocityX(-150);
      bottom_pipe[i].inableBody = true;
      bottom_pipe[i].immovable = true;

      this.xPos += 400;
    }
    this.onScreenText = this.add.text(212, 185, '', { fontSize: '32px', fill: '#00000' });
    cursors = this.input.keyboard.createCursorKeys();
    // add collection detection between bird and pipe(s)
  }
  xPos = 0;
  update() {
    if (this.physics.overlap(bird, top_pipe) || 
      this.physics.overlap(bird, bottom_pipe)) {
      this.collisionCallback();
    }
    if (gameOver) {
      this.input.on('pointerdown', () => this.scene.start('PlayGame'));
    }
    if (gameOver) {
      bird.body.setGravity(0);
      for (let i=0;i<3;i++) {
        bottom_pipe[i].body.setAllowGravity(false);
        bottom_pipe[i].body.setVelocityX(0);
        top_pipe[i].body.setGravity(false);
        top_pipe[i].body.setVelocityX(0);
      }
      return;
    } else {
      if (cursors.space.isDown) {
        bird.setVelocityY(-250);
        console.log("Spacebar pressed, I rock"); 
      }
      for (let i=0;i<3;i++) {
        this.firstRandomNumber = (Math.floor(Math.random() * 10)) + 1;
        if (this.firstRandomNumber < 6) {
          // add random positive number to pipe's new y position
          this.yAxisOffset = (Math.floor(Math.random() * 10)) + 1;
        } else {
          // add random negative number to pipe's new y position
          this.yAxisOffset = (Math.floor(Math.random() * 10)) * (-10);
        }
        if (bottom_pipe[i].body.x < -400) {
          bottom_pipe[i].x = 850;
          bottom_pipe[i].y = 450 + this.yAxisOffset;
        }
        if (top_pipe[i].body.x < -400) {
          top_pipe[i].x = 850;
          top_pipe[i].y = -50 + this.yAxisOffset;
        }
      }
    }
  }
  collisionCallback(){
    gameOver = true;
    bird.body.enable = false;
    top_pipe[0].body.enable = false;
    top_pipe[1].body.enable = false;
    top_pipe[2].body.enable = false;
    bottom_pipe[0].body.enable = false;
    bottom_pipe[1].body.enable = false;
    bottom_pipe[2].body.enable = false;
    this.onScreenText.setText('GAME OVER');
    this.fallAndDie();
  }
  fallAndDie() {
    this.tweens.add({
      targets: [bird],
      y: game.config.height + bird.displayHeight * 2,
      duration: 500,
      ease: 'Cubic.easeIn',
      callbackScope: this,
      onComplete: () => {
        this.cameras.main.shake(800, 0.01);
      }
    })
  }
}