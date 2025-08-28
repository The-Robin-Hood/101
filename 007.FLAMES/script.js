const ANIMATION_DELAY_MS = 250;
const calcBtn = document.querySelector("#calcBtn");
const tooltip = document.getElementById("tooltip");
const reloadBtn = document.getElementById("reload");
const p1Node = document.querySelector("#p1");
const p2Node = document.querySelector("#p2");

const QUOTES = {
  F: [
    "Oof! They friendzoned you faster than Wi-Fi connects.",
    "You're giving off strong 'let's grab coffee... as friends' energy.",
    "They said you're like a bruhhh... awkward.",
    "Congrats! You're now the president of the Friendzone Association.",
    "Even Cupid said, 'Nah, y'all better off as besties.'",
  ],

  L: [
    "Look at you, catching feelings like it's a sport.",
    "Someone's heart just got stolen — and it's definitely not theirs.",
    "They're blushing. You're dangerous.",
    "Cupid called. He wants to put you on speed dial.",
    "If this was a K-drama, y'all just hit Episode 12: The Confession.",
  ],

  A: [
    "They don't love you… but they definitely wouldn't swipe left.",
    "You're not the one… but you're definitely the one before the one.",
    "You're in their 'late night thoughts' playlist.",
    "They flirt with you like it's their part-time job.",
    "You're like that mystery snack they crave but won't admit to.",
  ],

  M: [
    "Get the wedding playlist ready — it's happening!",
    "You've unlocked the 'Eternal Drama Partner' level.",
    "They're picturing you in matching pajamas already.",
    "It's giving 'Netflix, kids, and a shared mortgage' vibes.",
    "Hope you like joint bank accounts — you're headed for 'I Do'.",
  ],

  E: [
    "Oof — they're plotting your downfall like it's a hobby.",
    "They love to hate you. Emphasis on both.",
    "You two have that enemies-to-lovers arc… just missing the lovers part.",
    "They'd unplug your phone charger just out of spite.",
    "It's less 'spark' and more 'burn.'",
  ],

  S: [
    "You've unlocked the 'ew, that's like my sibling' zone.",
    "They said you're like family… which is code for 'nope'.",
    "Better start calling each other 'bro' — it's over.",
    "You're so deep in the sibling zone, even ancestry.com is confused.",
    "You're one DNA test away from this being weird.",
  ],
  SAME_NAME_QUOTES: [
    "Dating yourself? Love the confidence, narcissist.",
    "Well well well, someone clearly thinks they're their own soulmate.",
    "You're so single, even your name is matching.",
    "Mirror, mirror on the wall… you just fell for yourself after all.",
    "Self-love is great, but this might be a *little* too literal.",
  ],
  ZERO_MAGIC_QUOTES: [
    "Whoa. You broke the game. That's how rare your connection is.",
    "There's no number for this vibe — you two are beyond calculation.",
    "Some things can't be measured. Like how special you are.",
    "Magic number? Nah, you *are* the magic.",
    "When the universe glitches just for you — yeah, it's giving soulmate energy.",
  ],
};

function clearName() {
  p1Node.value = "";
  p2Node.value = "";
}

async function playFlames(magicNumber) {
  let FLAMES = ["F", "L", "A", "M", "E", "S"];
  let current = 0;

  let flamesContainer = Array.from(document.querySelectorAll(".flame-letter"));
  while (FLAMES.length > 1) {
    let count = 1;

    while (count < magicNumber) {
      flamesContainer[current].classList.add("highlight");
      await sleep(ANIMATION_DELAY_MS);
      flamesContainer[current].classList.remove("highlight");

      current = (current + 1) % FLAMES.length;
      count++;
    }

    flamesContainer[current].classList.add("highlight");
    await sleep(ANIMATION_DELAY_MS);
    flamesContainer[current].classList.remove("highlight");

    console.log(`Removing "${FLAMES[current]}" at position ${current}`);
    flamesContainer[current].classList.add("removed");

    FLAMES.splice(current, 1);
    flamesContainer.splice(current, 1);

    if (current >= FLAMES.length) {
      current = 0;
    }

    await sleep(ANIMATION_DELAY_MS);
  }

  flamesContainer[0].classList.add("highlight");
  return FLAMES[0];
}

async function calculateFlames() {
  const p1 = p1Node.value.toUpperCase().trim();
  const p2 = p2Node.value.toUpperCase().trim();

  if (p1 == "" || p2 == "") {
    return;
  }

  calcBtn.disabled = true;
  p1Node.disabled = true;
  p2Node.disabled = true;
  reloadBtn.classList.remove("hidden");

  if (p1 == p2) {
    tooltip.innerHTML = QUOTES["SAME_NAME_QUOTES"][Math.floor(Math.random() * 5)];
    return;
  }

  let p1HashMap = {};
  let p2HashMap = {};
  let finalMap = {};
  let magicNumber = 0;

  for (let ch of p1) p1HashMap[ch] = (p1HashMap[ch] || 0) + 1;
  for (let ch of p2) p2HashMap[ch] = (p2HashMap[ch] || 0) + 1;

  let allKeys = new Set([...Object.keys(p1HashMap), ...Object.keys(p2HashMap)]);

  for (let key of allKeys) {
    const count1 = p1HashMap[key] || 0;
    const count2 = p2HashMap[key] || 0;
    finalMap[key] = Math.abs(count1 - count2);
  }

  for (let k in finalMap) {
    magicNumber += finalMap[k];
  }

  if (magicNumber == 0) {
    tooltip.innerHTML = QUOTES["ZERO_MAGIC_QUOTES"][Math.floor(Math.random() * 5)];
    return;
  }

  const finalLetter = await playFlames(magicNumber);

  let quote = QUOTES[finalLetter][Math.floor(Math.random() * 5)];
  tooltip.innerHTML = quote;
}

calcBtn.onclick = calculateFlames;
