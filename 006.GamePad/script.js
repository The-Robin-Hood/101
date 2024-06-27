const tooltip = document.getElementById("tooltip");
const hitbox = document.getElementById("character-hitbox");
const character = document.getElementById("character");
const dialog = document.querySelector(".character-dialog");

const gamepads = {};
const deadZone = 0.05;
const controller = document.getElementById("controller");
const backBtn = document.getElementById("BACK");
const startBtn = document.getElementById("START");
const leftBtn = document.getElementById("LEFT");
const rightBtn = document.getElementById("RIGHT");
const upBtn = document.getElementById("UP");
const downBtn = document.getElementById("DOWN");

const btnX = document.getElementById("xbox-x");
const btnY = document.getElementById("xbox-y");
const btnA = document.getElementById("xbox-a");
const btnB = document.getElementById("xbox-b");

const btnL1 = document.getElementById("xbox-L1");
const btnR1 = document.getElementById("xbox-R1");

const btnL2 = document.getElementById("xbox-L2");
const btnR2 = document.getElementById("xbox-R2");
const btnL2Path = document.getElementById("xbox-L2-Path");
const btnR2Path = document.getElementById("xbox-R2-Path");

const leftAnalog = document.getElementById("xbox-LAnalog");
const rightAnalog = document.getElementById("xbox-RAnalog");
const leftAnalogPath = document.getElementById("xbox-LAnalog-Path");
const rightAnalogPath = document.getElementById("xbox-RAnalog-Path");

const dialogs = [
  "I'm not a photographer,<br/> but I can picture us together.",
  "Do you have a name, or can I call you mine?",
  "If you were a vegetable,<br/>  you'd be a cute-cumber.",
  "Do you have a map?<br/>  I keep getting lost in your eyes.",
  "Are you a magician?<br/> Whenever I look at you, everyone else disappears.",
  "If you were a fruit,<br/>  you'd be a fineapple.",
  "Do you like Star Wars?<br/>  Because Yoda one for me!",
  "If you were a cat,<br/>  you'd purr-fect.",
  "Are you a bank loan?<br/>  Because you have my interest.",
  "Do you have a sunburn,<br/>  or are you always this hot?",
  "Do you like raisins?<br/>  How do you feel about a date?",
  "If you were a triangle,<br/>  you'd be acute one.",
  "Are you a campfire?<br/>  Because you're hot and I want s'more.",
  "Do you like science?<br/>  Because I've got my ion you.",
  "Are you a beaver?<br/>  Because daaaaaam.",
  "Are you a parking ticket?<br/>  Because you've got FINE written all over you.", 
]

function removeGamepad(gamepad) {
  delete gamepads[gamepad.index];
}

function addGamepad(gamepad) {
  gamepads[gamepad.index] = gamepad;
  requestAnimationFrame(updateStatus);
  if (Object.keys(gamepads).length > 1) {
    tooltip.innerHTML = "Multiple gamepads connected! Please use only one.";
    controller.style.opacity = 0.25;
    return;
  }
  controller.style.opacity = 0.85;
  tooltip.innerHTML = gamepad.id;
  hitbox.style.visibility = "visible";
  dialog.style.visibility = "visible";
  dialog.innerHTML = "Hello Gorgeous! ";
}

function pressuredButton(btn, path, state) {
  btn.style.opacity = state;
  btn.style.transform = `translate(0,${state * 7}px)`
  path.style.transform = `translate(0,${state * 7}px)`
}

function activateButton(btn, state) {
  if (state) {
    btn.style.fill = "var(--lightGold)";
  } else {
    btn.style.fill = "black";
  }
}
function analogButton(btn, path, x, y,isAnalogLeftStick) {
  if (Math.abs(x) < deadZone) x = 0;
  if (Math.abs(y) < deadZone) y = 0;

  btn.style.transform = `translate(${x * 10}px,${y * 10}px)`
  path.style.transform = `translate(${x * 10}px,${y * 10}px)`

  if(!isAnalogLeftStick){
    return
  }

  // move the character around the screen and dont let it go out of screen
  let characterX = hitbox.getBoundingClientRect().x;
  let characterY = hitbox.getBoundingClientRect().y;
  let characterWidth = hitbox.getBoundingClientRect().width;
  let characterHeight = hitbox.getBoundingClientRect().height;
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let characterNewX = characterX + x * 1.5;
  let characterNewY = characterY + y * 1.5;


  let characterDirection = "";  
  character.classList.toggle("face-up", false);
  character.classList.toggle("face-down", false);
  character.classList.toggle("face-left", false);
  character.classList.toggle("face-right", false);

  if(x === 0 && y === 0){
    return;
  }
  if (x > 0) {
    characterDirection = "right";
    character.classList.toggle("face-right", true);
  } else if (x < 0) {
    character.classList.toggle("face-left", true);
    characterDirection = "left";
  } else if (y > 0) {
    character.classList.toggle("face-down", true);
    characterDirection = "down";
  } else if (y < 0) {
    character.classList.toggle("face-up", true);
    characterDirection = "up";
  }

  // if (characterNewX < 0) {
  //   hitbox.style.left = 0;
  // } else if (characterNewX + characterWidth > windowWidth) {
  //   hitbox.style.left = windowWidth - characterWidth + "px";
  // } else {
  //   hitbox.style.left = characterNewX + "px";
  // }

  // if (characterNewY < 0) {
  //   hitbox.style.top = 0;
  // }
  // else if (characterNewY + characterHeight > windowHeight) {
  //   hitbox.style.top = windowHeight - characterHeight + "px";
  // } else {
  //   hitbox.style.top = characterNewY + "px";
  // }
}

function updateStatus() {
  if (Object.keys(gamepads).length > 1) return;
  let gamepad = navigator.getGamepads()[0];
  if (gamepad) {
    const {
      buttons,
      axes
    } = gamepad;

    const [
      A_key,
      B_key,
      X_key,
      Y_key,
      L1_key,
      R1_key,
      L2_key,
      R2_key,
      bk_key,
      strt_key,
      LStick_key,
      RStick_key,
      dPad_up,
      dPad_down,
      dPad_left,
      dPad_right
    ] = buttons.map(button => button.value);

    const [
      leftAnalogX,
      leftAnalogY,
      rightAnalogX,
      rightAnalogY
    ] = axes;

    activateButton(upBtn, dPad_up);
    activateButton(downBtn, dPad_down);
    activateButton(leftBtn, dPad_left);
    activateButton(rightBtn, dPad_right);
    activateButton(backBtn, bk_key);
    activateButton(startBtn, strt_key);
    activateButton(btnX, X_key);
    activateButton(btnY, Y_key);
    activateButton(btnA, A_key);
    activateButton(btnB, B_key);
    activateButton(btnL1, L1_key);
    activateButton(btnR1, R1_key);
    activateButton(btnL2, L2_key);
    activateButton(btnR2, R2_key);
    activateButton(leftAnalog, LStick_key);
    activateButton(rightAnalog, RStick_key);

    pressuredButton(btnL2, btnL2Path, L2_key);
    pressuredButton(btnR2, btnR2Path, R2_key);

    analogButton(leftAnalog, leftAnalogPath, leftAnalogX, leftAnalogY,true);
    analogButton(rightAnalog, rightAnalogPath, rightAnalogX, rightAnalogY,false);
  }
  requestAnimationFrame(updateStatus);
}

window.addEventListener("gamepadconnected", (e) => addGamepad(e.gamepad));
window.addEventListener("gamepaddisconnected", (e) => removeGamepad(e.gamepad));
tooltip.innerHTML = "Connect a gamepad and press any button!";
















// document.addEventListener("DOMContentLoaded", function () {
//   const character = document.getElementById("character");
//   const char = document.getElementById("char");

//   let posX = window.innerWidth / 2;
//   let posY = window.innerHeight / 2;
//   const speed = 2;
//   const keysPressed = {};

//   function moveCharacter() {
//     let moved = false;

//     if (keysPressed["w"]) {
//       posY -= speed;
//       moved = true;
//       char.classList.toggle("face-up", true);
//     } else {
//       char.classList.toggle("face-up", false);
//     }

//     if (keysPressed["a"]) {
//       posX -= speed;
//       moved = true;
//       char.classList.toggle("face-left", true);
//     } else {
//       char.classList.toggle("face-left", false);
//     }

//     if (keysPressed["s"]) {
//       posY += speed;
//       moved = true;
//       char.classList.toggle("face-down", true);
//     } else {
//       char.classList.toggle("face-down", false);
//     }

//     if (keysPressed["d"]) {
//       posX += speed;
//       moved = true;
//       char.classList.toggle("face-right", true);
//     } else {
//       char.classList.toggle("face-right", false);
//     }

//     // Keep the character within the window boundaries
//     posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
//     posY = Math.max(0, Math.min(window.innerHeight - 50, posY));

//     if (moved) {
//       character.style.left = posX + "px";
//       character.style.top = posY + "px";
//     }
//   }

//   function gameLoop() {
//     moveCharacter();
//     requestAnimationFrame(gameLoop);
//   }

//   document.addEventListener("keydown", function (event) {
//     keysPressed[event.key.toLowerCase()] = true;
//   });

//   document.addEventListener("keyup", function (event) {
//     keysPressed[event.key.toLowerCase()] = false;
//   });

//   gameLoop();
// });
