const gamepads = {};
const deadZone = 0.05;

let cheatcodes = [];
const cheatkeys = ["h", "l", "k", "1", "8"];
let cheatTimeout;
let isCheatActivated = false;

const tooltip = document.getElementById("tooltip");
const keyboard = document.getElementById("keyboard");

const w = document.querySelector("#w");
const s = document.querySelector("#s");
const a = document.querySelector("#a");
const d = document.querySelector("#d");

const controller = document.getElementById("controller");
const hitbox = document.getElementById("character-hitbox");
const character = document.getElementById("character");
const dialog = document.querySelector(".character-dialog");

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
  if (isCheatActivated) {
    return;
  }

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
function activateButton(btn, state,vibrate = false) {
  if (state) {
    btn.style.fill = "var(--lightGold)";
    if (vibrate) {
      gamepads[0].vibrationActuator.playEffect("dual-rumble", {
        duration: 10,
        strongMagnitude: 0.5,
        weakMagnitude: 0.5
      });
    }
  } else {
    btn.style.fill = "black";
  }
}
function analogButton(btn, path, x, y, isAnalogLeftStick) {
  if (Math.abs(x) < deadZone) x = 0;
  if (Math.abs(y) < deadZone) y = 0;

  btn.style.transform = `translate(${x * 10}px,${y * 10}px)`
  path.style.transform = `translate(${x * 10}px,${y * 10}px)`

  if (!isAnalogLeftStick) {
    return
  }

  let characterDirection = "";
  character.classList.toggle("face-up", false);
  character.classList.toggle("face-down", false);
  character.classList.toggle("face-left", false);
  character.classList.toggle("face-right", false);

  if (x === 0 && y === 0) {
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
    activateButton(btnX, X_key,true);
    activateButton(btnY, Y_key,true);
    activateButton(btnA, A_key,true);
    activateButton(btnB, B_key,true);
    activateButton(btnL1, L1_key);
    activateButton(btnR1, R1_key);
    activateButton(btnL2, L2_key);
    activateButton(btnR2, R2_key);
    activateButton(leftAnalog, LStick_key);
    activateButton(rightAnalog, RStick_key);

    pressuredButton(btnL2, btnL2Path, L2_key);
    pressuredButton(btnR2, btnR2Path, R2_key);

    analogButton(leftAnalog, leftAnalogPath, leftAnalogX, leftAnalogY, true);
    analogButton(rightAnalog, rightAnalogPath, rightAnalogX, rightAnalogY, false);
  }
  requestAnimationFrame(updateStatus);
}

window.addEventListener("gamepadconnected", (e) => addGamepad(e.gamepad));
window.addEventListener("gamepaddisconnected", (e) => removeGamepad(e.gamepad));
tooltip.innerHTML = "Connect a gamepad and press any button!";


// ================== Keyboard Movement ==================
function keyboardMovement() {
  let posX = hitbox.offsetLeft;
  let posY = hitbox.offsetTop;
  const speed = 2;
  const keysPressed = {};

  function moveCharacter() {
    let moved = false;

    if (keysPressed["w"]) {
      posY -= speed;
      moved = true;
      character.classList.toggle("face-up", true);
      w.classList.toggle("lit", true);
    } else {
      character.classList.toggle("face-up", false);
      w.classList.toggle("lit", false);
    }

    if (keysPressed["a"]) {
      posX -= speed;
      moved = true;
      character.classList.toggle("face-left", true);
      a.classList.toggle("lit", true);
    } else {
      character.classList.toggle("face-left", false);
      a.classList.toggle("lit", false);
    }

    if (keysPressed["s"]) {
      posY += speed;
      moved = true;
      character.classList.toggle("face-down", true);
      s.classList.toggle("lit", true);
    } else {
      character.classList.toggle("face-down", false);
      s.classList.toggle("lit", false);
    }

    if (keysPressed["d"]) {
      posX += speed;
      moved = true;
      character.classList.toggle("face-right", true);
      d.classList.toggle("lit", true);
    } else {
      character.classList.toggle("face-right", false);
      d.classList.toggle("lit", false);
    }

    // Keep the character within the window boundaries
    posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
    posY = Math.max(0, Math.min(window.innerHeight - 50, posY));

    if (moved) {
      hitbox.style.left = posX + "px";
      hitbox.style.top = posY + "px";
    }
  }

  function gameLoop() {
    moveCharacter();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", function (event) {
    keysPressed[event.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", function (event) {
    keysPressed[event.key.toLowerCase()] = false;
  });

  gameLoop();
};

// ================== Cheat Code Section ==================
function triggerCheat() {
  document.querySelector("h1").textContent = "Gamer Mode";
  controller.style.display = "none";
  keyboard.style.display = "block";
  character.style.visibility = "visible";
  hitbox.style.position = "absolute";
  hitbox.style.left = "48%";
  hitbox.style.bottom = "20%";
  dialog.style.display = "none";
  keyboardMovement();
}

document.addEventListener("keydown", event => {
  if (cheatkeys.includes(event.key.toLowerCase())) {
    cheatcodes.push(event.key.toLowerCase());
    clearTimeout(cheatTimeout);
    cheatTimeout = setTimeout(() => {
      cheatcodes = [];
    }, 3000);

    if (cheatcodes.length == 5) {
      let cheatcode = cheatcodes.join("");
      if (cheatcode === "hlk18") {
        isCheatActivated = true;
        triggerCheat()
        tooltip.textContent = `Cheat code activated!`;
      }
      cheatcodes = [];
    }
  } else {
    cheatcodes = [];
  }
});


