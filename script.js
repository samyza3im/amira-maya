/* =====================================================
   MAYA & AMIRA — EXPÉRIENCE ANNIVERSAIRE
   -----------------------------------------------------
   IMPORTANT :
   Change seulement PASSWORD ci-dessous.
   Format : JJMM
   Exemple : "2109" = 21 septembre.
===================================================== */

const PASSWORD = "2109";

const cakeScene = document.getElementById("cakeScene");
const passwordScene = document.getElementById("passwordScene");
const brokenScene = document.getElementById("brokenScene");

const cake = document.getElementById("cake");
const knife = document.getElementById("knife");
const hint = document.getElementById("hint");
const letter = document.getElementById("letter");

const dateInput = document.getElementById("dateInput");
const validate = document.getElementById("validate");
const error = document.getElementById("error");
const retry = document.getElementById("retry");
const music = document.getElementById("music");

let started = false;
let cutting = false;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function showScene(sceneToShow) {
  [cakeScene, passwordScene, brokenScene].forEach(scene => {
    const active = scene === sceneToShow;
    scene.style.opacity = active ? "1" : "0";
    scene.style.visibility = active ? "visible" : "hidden";
    scene.setAttribute("aria-hidden", active ? "false" : "true");
  });
}

async function takeKnife() {
  if (started || cutting) return;
  started = true;

  knife.style.pointerEvents = "none";
  hint.style.opacity = "0";

  /*
    Le couteau part de sa position initiale et
    se rapproche du gâteau. La destination est
    calculée à partir des positions réelles à l'écran.
  */
  const cakeRect = cake.getBoundingClientRect();
  const knifeRect = knife.getBoundingClientRect();

  const targetX =
    cakeRect.left + cakeRect.width * 0.62 -
    (knifeRect.left + knifeRect.width * 0.5);

  const targetY =
    cakeRect.top + cakeRect.height * 0.45 -
    (knifeRect.top + knifeRect.height * 0.5);

  knife.style.transition =
    "transform .85s cubic-bezier(.16,.82,.2,1), opacity .3s ease";

  knife.style.transform =
    `translate(${targetX}px, ${targetY}px) rotate(-9deg)`;

  await wait(850);

  /*
    Une fois arrivé au gâteau, on ouvre la demande
    de date. On ne lance PAS la coupe avant validation.
  */
  knife.style.opacity = "0";

  await wait(180);

  showScene(passwordScene);

  dateInput.value = "";
  error.style.display = "none";

  setTimeout(() => dateInput.focus(), 120);
}

function checkDate() {
  if (cutting) return;

  const value = dateInput.value.replace(/\D/g, "");

  if (value.length === 4 && value === PASSWORD) {
    cutCake();
  } else {
    showBroken();
  }
}

async function cutCake() {
  cutting = true;

  /*
    Retour à la scène du gâteau.
  */
  showScene(cakeScene);

  /*
    On remet le couteau au-dessus du gâteau.
  */
  knife.style.opacity = "1";
  knife.style.pointerEvents = "none";
  knife.style.transition = "none";

  /*
    Petit déplacement précis vers le centre.
  */
  const cakeRect = cake.getBoundingClientRect();
  const knifeRect = knife.getBoundingClientRect();

  const centerX =
    cakeRect.left + cakeRect.width * 0.50 -
    (knifeRect.left + knifeRect.width * 0.50);

  const aboveY =
    cakeRect.top + cakeRect.height * 0.15 -
    (knifeRect.top + knifeRect.height * 0.50);

  knife.style.transform =
    `translate(${centerX}px, ${aboveY}px) rotate(-8deg)`;

  await wait(450);

  /*
    Le couteau descend réellement dans le gâteau.
  */
  const cutY = aboveY + 105;

  knife.style.transition =
    "transform .55s cubic-bezier(.25,.8,.2,1)";

  knife.style.transform =
    `translate(${centerX}px, ${cutY}px) rotate(-8deg)`;

  await wait(480);

  /*
    Le gâteau se coupe en deux.
  */
  cake.classList.add("is-cutting");

  await wait(720);

  /*
    Le couteau sort de la scène.
  */
  knife.style.transition =
    "transform .45s ease, opacity .3s ease";

  knife.style.transform =
    `translate(${centerX}px, ${cutY + 115}px) rotate(-8deg)`;

  knife.style.opacity = "0";

  await wait(260);

  /*
    La feuille s'ouvre derrière le gâteau.
  */
  letter.classList.add("open");
  letter.setAttribute("aria-hidden", "false");

  /*
    La musique démarre après une interaction utilisateur.
  */
  music.volume = 0.8;
  try {
    await music.play();
  } catch (e) {
    /*
      Si le navigateur bloque la lecture automatique,
      l'utilisateur pourra relancer après interaction.
    */
  }
}

function showBroken() {
  passwordScene.style.opacity = "0";
  passwordScene.style.visibility = "hidden";

  setTimeout(() => {
    showScene(brokenScene);
  }, 250);
}

function resetExperience() {
  cutting = false;
  started = false;

  cake.classList.remove("is-cutting");
  letter.classList.remove("open");
  letter.setAttribute("aria-hidden", "true");

  knife.style.transition = "none";
  knife.style.opacity = "1";
  knife.style.pointerEvents = "auto";
  knife.style.transform = "translateY(-45%) rotate(-7deg)";

  hint.style.opacity = "1";

  dateInput.value = "";
  error.style.display = "none";

  showScene(cakeScene);
}

knife.addEventListener("click", takeKnife);
validate.addEventListener("click", checkDate);

dateInput.addEventListener("input", () => {
  dateInput.value = dateInput.value.replace(/\D/g, "").slice(0, 4);
  error.style.display = "none";
});

dateInput.addEventListener("keydown", event => {
  if (event.key === "Enter") checkDate();
});

retry.addEventListener("click", resetExperience);
