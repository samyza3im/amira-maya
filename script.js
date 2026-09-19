const PASSWORD = "2009";

const intro = document.getElementById("intro");
const passwordScreen = document.getElementById("passwordScreen");
const wrongScreen = document.getElementById("wrongScreen");
const finalScreen = document.getElementById("finalScreen");

const cake = document.getElementById("cake");
const knife = document.getElementById("knife");
const input = document.getElementById("passwordInput");
const validate = document.getElementById("validate");
const passwordError = document.getElementById("passwordError");
const retry = document.getElementById("retry");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function show(screen) {
  [intro, passwordScreen, wrongScreen, finalScreen].forEach(s => {
    s.classList.toggle("active", s === screen);
  });
}

let busy = false;

/* 1. Le couteau va réellement vers le gâteau */
async function pickUpKnife() {
  if (busy) return;
  busy = true;
  knife.disabled = true;

  knife.style.transition = "transform .78s cubic-bezier(.16,.82,.2,1), opacity .2s ease";
  knife.style.transform = "translate(-145px,-125px) rotate(-47deg)";

  await sleep(800);

  knife.style.opacity = "0";
  await sleep(220);

  show(passwordScreen);
  input.value = "";
  passwordError.style.display = "none";
  setTimeout(() => input.focus(), 100);
}

/* 2. Bonne date = retour au gâteau + vraie descente du couteau */
async function cutCake() {
  show(intro);

  const cakeBox = cake.getBoundingClientRect();
  const knifeBox = knife.getBoundingClientRect();

  const targetX =
    cakeBox.left + cakeBox.width * 0.68 -
    (knifeBox.left + knifeBox.width * 0.5);

  const targetY =
    cakeBox.top + cakeBox.height * 0.43 -
    (knifeBox.top + knifeBox.height * 0.5);

  knife.style.opacity = "1";
  knife.style.transition = "none";
  knife.style.transform =
    `translate(${targetX}px,${targetY - 135}px) rotate(-43deg)`;

  await sleep(350);

  knife.style.transition = "transform .58s cubic-bezier(.15,.84,.2,1)";
  knife.style.transform =
    `translate(${targetX - 7}px,${targetY + 12}px) rotate(-43deg)`;

  await sleep(570);

  /* Une seule part sort du gâteau */
  cake.classList.add("cut");

  await sleep(1000);

  knife.style.transition = "transform .4s ease, opacity .25s ease";
  knife.style.transform =
    `translate(${targetX + 105}px,${targetY + 125}px) rotate(-43deg)`;
  knife.style.opacity = "0";

  await sleep(300);

  show(finalScreen);

  try {
    music.volume = 0.8;
    await music.play();
    musicButton.textContent = "PAUSE";
  } catch (e) {
    musicButton.textContent = "MUSIQUE";
  }

  busy = false;
}

function checkPassword() {
  const value = input.value.replace(/\D/g, "");

  if (value === PASSWORD) {
    cutCake();
  } else {
    show(wrongScreen);
  }
}

knife.addEventListener("click", pickUpKnife);

validate.addEventListener("click", checkPassword);

input.addEventListener("input", () => {
  input.value = input.value.replace(/\D/g, "").slice(0, 4);
  passwordError.style.display = "none";
});

input.addEventListener("keydown", event => {
  if (event.key === "Enter") checkPassword();
});

retry.addEventListener("click", () => {
  cake.classList.remove("cut");
  knife.disabled = false;
  knife.style.transition = "";
  knife.style.transform = "";
  knife.style.opacity = "1";
  input.value = "";
  busy = false;
  show(intro);
});

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = "PAUSE";
    } catch (e) {}
  } else {
    music.pause();
    musicButton.textContent = "MUSIQUE";
  }
});
