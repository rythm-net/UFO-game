//canvas drawing
const canvas = document.getElementById('ufoCanvas');
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

//canvas automatic resizing
function resize() {
  //full height of screen regardless of the resolution
  const height = window.innerHeight - 20;

  //calculate the proper scaled width
  const ratio = canvas.width / canvas.height;
  const width = height * ratio;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}
window.addEventListener('load', resize, false);

//game Basics
function GameBasics(canvas) {

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;

  //active playing field
  this.playBoundaries = {
    top: 150,
    bottom: 650,
    left: 100,
    right: 800
  };

  //initial values
  this.level = 1;
  this.score = 0;
  this.shields = 2;

  //game settings
  this.setting = {
    updateSeconds: (1 / 60),  //FPS: 60 - 1 new frame in every 0,01666667 seconds
    spaceshipSpeed: 200,      //spaceship speed

    bulletSpeed: 130,         //bullets speed of spaceship
    bulletMaxFrequency: 500,  //how fast our spaceship can shoot

    ufoLines: 4,              //number of UFO lines                                            	
    ufoColumns: 8,            //number of UFO columns	                                       	 
    ufoSpeed: 35,             //speed of UFO  
    ufoSinkingValue: 30,      //how much the UFO sinks, value of sinking

    bombSpeed: 75,            //bomb falling speed
    bombFrequency: 0.05,      //bomb dropping frequency

    pointsPerUFO: 25,         //points per UFO value 
  };

  //collect the different positions, states of the game 
  this.positionContainer = [];

  //pressed keys storing
  this.pressedKeys = {};
}

//return to current game position, always returns the top element of positionContainer
GameBasics.prototype.presentPosition = function () {
  return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
};

//move to the desired position
GameBasics.prototype.goToPosition = function (position) {
  //if already in a position clear positionContainer.
  if (this.presentPosition()) {
    this.positionContainer.length = 0;
  }
  //if finds an 'entry' in a given position, we call it. 
  if (position.entry) {
    position.entry(play);
  }
  //setting the current game position in positionContainer
  this.positionContainer.push(position);
};

//push our new position into positionContainer 
GameBasics.prototype.pushPosition = function (position) {
  this.positionContainer.push(position);
};

//pop the position from positionContainer
GameBasics.prototype.popPosition = function () {
  this.positionContainer.pop();
};

//GameBasics start - Starting the loop
GameBasics.prototype.start = function () {
  //Specify the interval in milliseconds 
  setInterval(function () { gameLoop(play); }, this.setting.updateSeconds * 1000); //0,01666667 sec * 1000 = 16,67 ms
  this.goToPosition(new OpeningPosition());
}

//notifies the game when a key is pressed
GameBasics.prototype.keyDown = function (keyboardCode) {
  //store the pressed key in 'pressedKeys'
  this.pressedKeys[keyboardCode] = true;
  if (this.presentPosition() && this.presentPosition().keyDown) {
    this.presentPosition().keyDown(this, keyboardCode);
  }
};

//notifies the game when a key is released
GameBasics.prototype.keyUp = function (keyboardCode) {
  //delete the released key from 'pressedKeys'
  delete this.pressedKeys[keyboardCode];
};

//game Loop
function gameLoop(play) {
  let presentPosition = play.presentPosition();

  if (presentPosition) {
    //update
    if (presentPosition.update) {
      presentPosition.update(play);
    }
    //draw
    if (presentPosition.draw) {
      presentPosition.draw(play);
    }
  }
}

//keyboard events listening
window.addEventListener("keydown", function (e) {
  const keyboardCode = e.which || event.keyCode;
  if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) { e.preventDefault(); } //space/left/right (32/37/29)
  play.keyDown(keyboardCode);
});

window.addEventListener("keyup", function (e) {
  const keyboardCode = e.which || event.keyCode;
  play.keyUp(keyboardCode);
});

//create a GameBasics object
const play = new GameBasics(canvas);

play.sounds = new Sounds();
play.sounds.init();
play.start();