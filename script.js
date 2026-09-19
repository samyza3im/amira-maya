/* MAYA & AMIRA — EXPÉRIENCE ANNIVERSAIRE
   Change PASSWORD avec la vraie date, format JJMM.
*/
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

function showScene(sceneToShow){
  [cakeScene,passwordScene,brokenScene].forEach(scene=>{
    const active = scene === sceneToShow;
    scene.style.opacity = active ? "1" : "0";
    scene.style.visibility = active ? "visible" : "hidden";
    scene.setAttribute("aria-hidden", active ? "false" : "true");
  });
}

function baseKnifeTransform(){
  return "translateY(-45%) rotate(-7deg)";
}

async function takeKnife(){
  if(started || cutting) return;
  started = true;
  knife.style.pointerEvents = "none";
  hint.style.opacity = "0";

  const cakeRect = cake.getBoundingClientRect();
  const knifeRect = knife.getBoundingClientRect();

  const targetX =
    cakeRect.left + cakeRect.width * 0.62 -
    (knifeRect.left + knifeRect.width * 0.5);

  const targetY =
    cakeRect.top + cakeRect.height * 0.45 -
    (knifeRect.top + knifeRect.height * 0.5);

  knife.style.transition = "transform .82s cubic-bezier(.16,.82,.2,1)";
  knife.style.transform = `translate(${targetX}px,${targetY}px) rotate(-9deg)`;

  await wait(820);
  knife.style.opacity = "0";
  await wait(180);

  showScene(passwordScene);
  dateInput.value = "";
  error.style.display = "none";
  setTimeout(()=>dateInput.focus(),120);
}

function checkDate(){
  if(cutting) return;
  const value = dateInput.value.replace(/\D/g,"");
  if(value.length === 4 && value === PASSWORD){
    cutCake();
  }else{
    showBroken();
  }
}

async function cutCake(){
  cutting = true;
  showScene(cakeScene);

  knife.style.opacity = "1";
  knife.style.pointerEvents = "none";
  knife.style.transition = "none";

  const cakeRect = cake.getBoundingClientRect();
  const knifeRect = knife.getBoundingClientRect();

  /* Le couteau vise le bord supérieur-droit du gâteau,
     puis descend pour faire UNE coupe de part. */
  const targetX =
    cakeRect.left + cakeRect.width * 0.73 -
    (knifeRect.left + knifeRect.width * 0.5);

  const aboveY =
    cakeRect.top + cakeRect.height * 0.18 -
    (knifeRect.top + knifeRect.height * 0.5);

  knife.style.transform = `translate(${targetX}px,${aboveY}px) rotate(-42deg)`;
  await wait(420);

  knife.style.transition = "transform .58s cubic-bezier(.2,.82,.18,1)";
  knife.style.transform =
    `translate(${targetX - 12}px,${aboveY + 116}px) rotate(-42deg)`;

  await wait(520);

  cake.classList.add("is-cutting");
  await wait(980);

  knife.style.transition = "transform .42s ease,opacity .25s ease";
  knife.style.transform =
    `translate(${targetX + 110}px,${aboveY + 150}px) rotate(-42deg)`;
  knife.style.opacity = "0";

  await wait(300);

  letter.classList.add("open");
  letter.setAttribute("aria-hidden","false");

  music.volume = .8;
  try{ await music.play(); }catch(e){}
}

function showBroken(){
  passwordScene.style.opacity = "0";
  passwordScene.style.visibility = "hidden";
  setTimeout(()=>showScene(brokenScene),220);
}

function resetExperience(){
  cutting = false;
  started = false;
  cake.classList.remove("is-cutting");
  letter.classList.remove("open");
  letter.setAttribute("aria-hidden","true");

  knife.style.transition = "none";
  knife.style.opacity = "1";
  knife.style.pointerEvents = "auto";
  knife.style.transform = baseKnifeTransform();

  hint.style.opacity = "1";
  dateInput.value = "";
  error.style.display = "none";
  showScene(cakeScene);
}

knife.addEventListener("click",takeKnife);
validate.addEventListener("click",checkDate);

dateInput.addEventListener("input",()=>{
  dateInput.value = dateInput.value.replace(/\D/g,"").slice(0,4);
  error.style.display = "none";
});
dateInput.addEventListener("keydown",e=>{
  if(e.key === "Enter") checkDate();
});
retry.addEventListener("click",resetExperience);
