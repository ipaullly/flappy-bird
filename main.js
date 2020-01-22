class mainState extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  preload() {
    // load the bird sprite
    this.load.image('bird', 'assets/bird.png');
  }
  create() {
    // display the bird at an initial postion
    this.bird = this.add.sprite(100, 245, 'bird');
    // add physics to the bird
    // required for movements, gravity, collisions, etc.
    this.physics.world.enable(this.bird);
    // add gravity to the bird to make it fall
    this.bird.body.gravity.y = 500;
    // call the 'jump' function when the spacekey is hit
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);    
  }
  update() { 
    if (this.spacebar.isDown) {
      this.jump();
    }
    // if the bird is too high or too low
    if (this.bird.y < 0 || this.bird.y > 490) {
      this.restartGame();
    }
  }
  // Make the bird jump
  jump() {
    // add vertical velocity to the bird
    this.bird.body.velocity.y = -350;
  }
  restartGame() {
    // start the 'main' state, which restarts the game
    this.scene.start('MainScene');
  }
};

// initialise phaser
new Phaser.Game({
  width: 400,
  height: 490,
  backgroundColor: '#71c5cf',
  scene: mainState,
  physics: { default: 'arcade' },
});
