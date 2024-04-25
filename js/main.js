//define the canvas size
let canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let ctx; // this will be the context of the canvas (2D)

// define the character size
let characterWidth = 55;
let characterHeight = 55;
let characterImg; // this will be the image of the character, but defined later
currentCharHappy = "assets/imgs/character_1_happy.png"; //this is the default character (happy)
currentCharSad = "assets/imgs/character_1_sad.png"; //this is the default character (sad)

// game over image
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
  // x and y position of the character
  x: characterX,
  y: characterY,
  // size of the character
  width: characterWidth,
  height: characterHeight,
  // rotation is used for the character to look like it's flying
  rotation: 0,
};

// properties of the game over image
let gameOverCharacter = {
  x: characterGameOverX,
  y: characterGameOverY,
  width: characterGameOverWidth,
  height: characterGameOverHeight,
  rotation: 0,
};

//pillars
let pillarArray = []; // in this array all the pillars will come
// size of the pillars
let pillarWidth = 120;
let pillarHeight = 512;

let pillarX = canvasWidth; // right of the canvas
let pillarY = 0; // top of the canvas

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
  characterImg.src = currentCharHappy; // set the source of the image
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

  // request the browser to call the `update` function (this will be added later)
  requestAnimationFrame(update);

  // set an interval to call the `placePillar` function
  setInterval(placePillar, 1500); //every 1.5 seconds

  // an event listener to call the `moveCharacter` function when a key is pressed (this function will be added later)
  document.addEventListener("keydown", moveCharacter);
};

update = () => {
  // character selection
  const char1 = document.getElementById("char1");
  const char2 = document.getElementById("char2");
  const char3 = document.getElementById("char3");

  // add event listeners to the character selection, this will change the character image on click
  char1.addEventListener("click", () => {
    currentCharHappy = "assets/imgs/character_1_happy.png";
    currentCharSad = "assets/imgs/character_1_sad.png";
  });

  char2.addEventListener("click", () => {
    currentCharHappy = "assets/imgs/character_2_happy.png";
    currentCharSad = "assets/imgs/character_2_sad.png";
  });

  char3.addEventListener("click", () => {
    currentCharHappy = "assets/imgs/character_3_happy.png";
    currentCharSad = "assets/imgs/character_3_sad.png";
  });

  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //character
  velocityY += gravity; // give the Y velocity gravity so character does not just float upwards when jumping
  character.y = Math.max(character.y + velocityY); //apply gravity to current character.y,

  if (velocityY >= 0) {
    // if the character is falling
    character.rotation += 0.01; // increase the rotation
  }

  ctx.save(); // save the current state of the context
  ctx.translate(
    character.x + character.width / 2,
    character.y + character.height / 2
  ); // move the origin of the context to the center of the character
  ctx.rotate(character.rotation); // rotate the context
  ctx.drawImage(
    characterImg,
    -character.width / 2,
    -character.height / 2,
    character.width,
    character.height
  ); // draw the character centered on the new origin
  ctx.restore(); // restore the context to its previous state

  if (character.y > canvas.height) {
    gameOver = true;
    gameOverAudio.play(); // start playing game over audio when going out of bounds
  }

  //pillars
  for (let i = 0; i < pillarArray.length; i++) {
    let pillar = pillarArray[i];
    pillar.x += velocityX;
    ctx.drawImage(pillar.img, pillar.x, pillar.y, pillar.width, pillar.height);

    if (!pillar.passed && character.x > pillar.x + pillar.width) {
      score += 0.5; //0.5 because there are 2 pillars! so 0.5*2 = 1, 1 for each set of pillars
      velocityX -= 0.3; //increase speed of pillars
      pillar.passed = true;

      scoreAudio.play(); // play score audio when going through pillar

      // stop playing score audio after 1.2s
      setTimeout(() => {
        scoreAudio.load();
      }, 1200);
    }

    if (detectCollision(character, pillar)) {
      characterImg.src = currentCharSad; // when collision change character to something else
      gameOver = true;
      gameOverAudio.play(); // start playing game over sound when hitting pillar
    }
  }

  //clear pillars
  while (pillarArray.length > 0 && pillarArray[0].x < -pillarWidth) {
    pillarArray.shift(); //removes first element from the array
  }

  //score
  ctx.fillStyle = "white";
  ctx.font = "45px sans-serif";
  ctx.fillText(score, 5, 45);

  if (gameOver) {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    // Fill with gradient
    ctx.fillStyle = gradient; // add gradient to game over text
    let textString = "GAME OVER";
    let textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, 100);

    // add game over image to center of the screen
    characterGameOverImg = new Image();
    characterGameOverImg.src = currentCharSad;
    characterGameOverImg.onload = () => {
      ctx.drawImage(
        characterGameOverImg,
        250,
        150,
        gameOverCharacter.width,
        gameOverCharacter.height
      );
    };
  }
};

// function to spawn the pillars in game
placePillar = () => {
  // if the game is over, stop placing them
  if (gameOver) {
    return;
  }

  // calculate a random Y position for the top pillar
  let randompillarY =
    pillarY - pillarHeight / 4 - Math.random() * (pillarHeight / 2);

  // the space between top and bottom pillar
  let openingSpace = canvas.height / 4;

  // define all the top pillar properties
  let topPillar = {
    img: topPillarImg,
    x: pillarX,
    y: randompillarY,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };
  // add the top pillar to the array of pillars
  pillarArray.push(topPillar);

  // define all the bottom pillar properties
  let bottomPillar = {
    img: bottomPillarImg,
    x: pillarX,
    y: randompillarY + pillarHeight + openingSpace,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };

  // add pillar to array
  pillarArray.push(bottomPillar);
};

moveCharacter = (e) => {
  // keys used for jumping
  if (e.code == "Space" || e.code == "ArrowUp") {
    //jump
    velocityY = -6;
    character.rotation = 0; // reset the rotation

    //reset game
    if (gameOver) {
      character.y = characterY; // character back to starting position
      pillarArray = []; // empty array of pillars
      score = 0; // reset score
      velocityX = -6; // reset speed of pillars
      gameOver = false; // put gameOver to false
      gameOverAudio.load(); // reset game over audio
      characterImg.src = currentCharHappy; // character back to happy
    }
  }
};

detectCollision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width && //obj1's top left corner doesn't reach obj2's top right corner
    obj1.x + obj1.width > obj2.x && //obj1's top right corner passes obj2's top left corner
    obj1.y < obj2.y + obj2.height && //obj1's top left corner doesn't reach obj2's bottom left corner
    obj1.y + obj1.height > obj2.y //obj1's bottom left corner passes obj2's top left corner
  );
};
