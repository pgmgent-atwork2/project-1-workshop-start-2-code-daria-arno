# How to make a flappy bird type game

## Folder Structure

Create a folder structure that looks similar to this:

- index.html
- js (folder)
  - main.js
- css (folder)
  - main.css
- assets (folder)
  - imgs

## HTML

Start off by opening the html file and adding a basic start to it:
(you can also do this by just typing "!" and press enter after.)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" , content="width=device-width, initial-scale=1.0" />
    <title>Flappy Frederick</title>
    <link rel="stylesheet" href="css/main.css" />
    <script src="js/main.js"></script>
  </head>
  <body></body>
</html>
```

Now add a canvas, we will need this to do draw graphics on the web page. Put them **inbetween the body** tags

```html
<canvas id="canvas"></canvas>
```

## CSS

```css
/* centers the entire page */
body {
  text-align: center;
}
/* background image for the canvas */
#canvas {
  background-image: url("../assets/imgs/bg.png");
}
```

## JS

### This is the foundation of the javascript, read the comments for more understanding:

```js
//define the canvas size
let canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let ctx;

// define the character size
let characterWidth = 55; // width/height ratio = 408/228 = 17/12
let characterHeight = 55;
let characterImg;
currentCharHappy = "assets/imgs/character_1_happy.png";
currentCharSad = "assets/imgs/character_1_sad.png";

// game over character
let characterGameOverImg;
let characterGameOverWidth = 350;
let characterGameOverHeight = 370;

//starting position of the character (on x- and y-axis )
let characterX = canvasWidth / 8;
let characterY = canvasHeight / 2;

//starting position of the game over image
let characterGameOverX = canvasWidth / 2;
let characterGameOverY = canvasHeight / 2;

// properties of the character
let character = {
  x: characterX,
  y: characterY,
  width: characterWidth,
  height: characterHeight,
  rotation: 0,
};

// properties of the character
let gameOverCharacter = {
  x: characterGameOverX,
  y: characterGameOverY,
  width: characterGameOverWidth,
  height: characterGameOverHeight,
  rotation: 0,
};

//pillars
let pillarArray = []; // in this array all the pillars will come
let pillarWidth = 120; //width/height ratio = 384/3072 = 1/8
let pillarHeight = 512;
let pillarX = canvasWidth;
let pillarY = 0;

let topPillarImg;
let bottomPillarImg;

//physics
let velocityX = -6; //pillars moving to the left speed
let velocityY = 0; //character jump speed
let gravity = 0.4; //character falling speed

// Game state variables
let gameOver = true; // A boolean indicating whether the game is over
let score = 0; // The player's current score

// This function will run when the web page finishes loading
window.onload = () => {
  let scoreAudio = document.getElementById("scoreAudio");
  let gameOverAudio = document.getElementById("gameOverAudio");

  // get a reference to the canvas element and set its dimensions
  canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;

  // get a 2D rendering context from the canvas,
  ctx = canvas.getContext("2d"); //used for drawing on the canvas

  // create a new image for the character and define a function to draw the image when loaded
  characterImg = new Image();
  characterImg.src = currentCharHappy;
  characterImg.onload = () => {
    ctx.drawImage(
      characterImg,
      character.x,
      character.y,
      character.width,
      character.height
    );
  };

  // create new images for the top and bottom pillars
  topPillarImg = new Image();
  topPillarImg.src = "assets/imgs/topPillar.png";
  bottomPillarImg = new Image();
  bottomPillarImg.src = "assets/imgs/bottomPillar.png";

  // rrequest the browser to call the `update` function (this will be added later)
  requestAnimationFrame(update);

  // set an interval to call the `placePillar` function
  setInterval(placePillar, 1500); //every 1.5 seconds

  // an event listener to call the `moveCharacter` function when a key is pressed (this function will be added later)
  document.addEventListener("keydown", moveCharacter);
};
```

---

---

Congratulations if you made it this far, the foundation of the script has been made, now a few more functions.

### This is the update function which is used to constantly update the canvas:

```js

```

### The pillar placing function:

```js

```

Now that pillars can randomly spawn, we can at last add perhaps the most important, but easiest part to make of the game.

### The user input for jumping.

```js

```

### Detect any collisions

```js

```
