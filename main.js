let config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update,
  }
};

let game = new Phaser.Game(config);
// game variables

let bird;
let cursors;
let bottom_pipe = [];
let top_pipe = [];
let gameOver = false;
let endGame;
let distance;
initialYAxisOffset = [];

const preload = () => {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

const create = () => {
  // add sky
  this.add.image(400, 300, 'sky');
  // add flappy bird
  bird = this.physics.add.sprite(20, 40, 'bird');
  // add collision detection
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);
  bird.body.setGravityY(300);

  // for-loop to create three pipes
  let xPos = 0;
  let firstRandomNumber;
  for (let i=0;i<3;i++) {
    firstRandomNumber = (Math.floor(Math.random() * 10)) + 1;
    if (firstRandomNumber < 6) {
      // add random positive number to pipe's new y position
      initialYAxisOffset[i] = (Math.floor(Math.random() * 10)) * 10;
    } else {
      // add random negative number to pipe's new y position
      initialYAxisOffset[i] = (Math.floor(Math.random() * 10)) * (-10);
    }
  }
  let offset;
  // Create Top pipes
  for (let j=0;j<3;j++) {
    offset = initialYAxisOffset[j];
    top_pipe[j] = this.physics.add.sprite(550 + xPos, -50 + offset, 'pipe' );
    top_pipe[j].body.setAllowGravity(false);
    top_pipe[j].body.setVelocityX(-150);
    top_pipe[j].inableBody = true;
    top_pipe[j].immovable = true;
    top_pipe[j].flipY = true

    xPos += 400;
  }
  // Create bottom pipes
  xPos = 0; // reset xPos to default value
  for(let i=0;i<3;i++) {
    offset = initialYAxisOffset[i];
    bottom_pipe[i] = this.physics.add.sprite(550 + xPos, 450 + offset, 'pipe' );
    bottom_pipe[i].body.setAllowGravity(false);
    bottom_pipe[i].body.setVelocityX(-150);
    bottom_pipe[i].inableBody = true;
    bottom_pipe[i].immovable = true;

    xPos += 400;
  }
  onScreenText = this.add.text(212, 185, '', { fontSize: '32px', fill: '#00000' });
  cursors = this.input.keyboard.createCursorKeys();
  // add collection detection between bird and pipe(s)
  this.physics.add.collider(bird, bottom_pipe, collisionCallback);
  this.physics.add.collider(bird, top_pipe, collisionCallback);
}
