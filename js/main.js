//canvas
let canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let ctx;

//character
let characterWidth = 55; // width/height ratio = 408/228 = 17/12
let characterHeight = 55;
let characterImg;
currentCharHappy = "assets/imgs/character_1_happy.png";
currentCharSad = "assets/imgs/character_1_sad.png";

// game over character
let characterGameOverImg;
let characterGameOverWidth = 350;
let characterGameOverHeight = 370;

//starting positions of the character
let characterX = canvasWidth / 8;
let characterY = canvasHeight / 2;

//starting positions of the game over character
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
let pillarArray = [];
let pillarWidth = 120; //width/height ratio = 384/3072 = 1/8
let pillarHeight = 512;
let pillarX = canvasWidth;
let pillarY = 0;

let topPillarImg;
let bottomPillarImg;

//physics
let velocityX = -6; //pillars moving left speed
let velocityY = 0; //character jump speed
let gravity = 0.4; //character falling speed

let gameOver = true;
let score = 0;

window.onload = () => {
  let scoreAudio = document.getElementById("scoreAudio");
  let gameOverAudio = document.getElementById("gameOverAudio");

  canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  ctx = canvas.getContext("2d"); //used for drawing on the canvas

  //load images
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

  topPillarImg = new Image();
  topPillarImg.src = "assets/imgs/topPillar.png";

  bottomPillarImg = new Image();
  bottomPillarImg.src = "assets/imgs/bottomPillar.png";

  requestAnimationFrame(update);
  setInterval(placePillar, 1500); //every 1.5 seconds
  document.addEventListener("keydown", moveCharacter);
};

update = () => {
  // character selection
  const char1 = document.getElementById("char1");
  const char2 = document.getElementById("char2");
  const char3 = document.getElementById("char3");

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
    gameOverAudio.play();
  }

  //pillars
  for (let i = 0; i < pillarArray.length; i++) {
    let pillar = pillarArray[i];
    pillar.x += velocityX;
    ctx.drawImage(pillar.img, pillar.x, pillar.y, pillar.width, pillar.height);

    // audios

    if (!pillar.passed && character.x > pillar.x + pillar.width) {
      score += 0.5; //0.5 because there are 2 pillars! so 0.5*2 = 1, 1 for each set of pillars
      velocityX -= 0.3; //increase speed of pillars
      pillar.passed = true;

      scoreAudio.play();

      setTimeout(() => {
        scoreAudio.load();
      }, 1200);
    }

    if (detectCollision(character, pillar)) {
      characterImg.src = currentCharSad; // when collision change character to something else
      gameOver = true;
      gameOverAudio.play();
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
    ctx.fillStyle = gradient;
    let textString = "GAME OVER";
    let textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString, canvas.width / 2 - textWidth / 2, 100);

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

placePillar = () => {
  if (gameOver) {
    return;
  }

  //
  let randompillarY =
    pillarY - pillarHeight / 4 - Math.random() * (pillarHeight / 2);
  let openingSpace = canvas.height / 4;

  let topPillar = {
    img: topPillarImg,
    x: pillarX,
    y: randompillarY,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };
  pillarArray.push(topPillar);

  let bottomPillar = {
    img: bottomPillarImg,
    x: pillarX,
    y: randompillarY + pillarHeight + openingSpace,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };
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
      gameOverAudio.load();
      characterImg.src = currentCharHappy; // character back to happy
    }
  }
};

detectCollision = (a, b) => {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y //a's bottom left corner passes b's top left corner
  );
};
