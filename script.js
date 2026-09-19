/* =========================================
   MAYA & AMIRA
   Birthday Experience
========================================= */


const mainScene =
    document.getElementById("mainScene");

const cake =
    document.getElementById("cake");

const cakeArea =
    document.getElementById("cakeArea");

const knifeButton =
    document.getElementById("knifeButton");

const bottomHint =
    document.getElementById("bottomHint");

const passwordScreen =
    document.getElementById("passwordScreen");

const passwordInput =
    document.getElementById("passwordInput");

const validateButton =
    document.getElementById("validateButton");

const passwordError =
    document.getElementById("passwordError");

const wrongScreen =
    document.getElementById("wrongScreen");

const retryButton =
    document.getElementById("retryButton");

const letter =
    document.getElementById("letter");

const music =
    document.getElementById("birthdayMusic");


/* =========================================
   MOT DE PASSE
========================================= */

/*
   POUR L'INSTANT :

   DATE

   Exemple :
   Si Amira est née le 21 septembre :

   const PASSWORD = "2109";

   Donne-moi sa vraie date et je te le
   remplace directement.
*/

const PASSWORD = "DATE";


/* =========================================
   ÉTAT
========================================= */

let knifeStarted = false;
let passwordOpened = false;
let cutting = false;


/* =========================================
   UTILITAIRE ANIMATION
========================================= */

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


/* =========================================
   CLIQUE SUR LE COUTEAU
========================================= */

knifeButton.addEventListener("click", async () => {

    if (knifeStarted) return;

    knifeStarted = true;

    knifeButton.classList.add("moving");

    bottomHint.style.opacity = "0";

    /*
        Le couteau quitte sa position
        et se dirige vers le gâteau.
    */

    const cakeRect =
        cake.getBoundingClientRect();

    const knifeRect =
        knifeButton.getBoundingClientRect();

    const targetX =
        cakeRect.left +
        cakeRect.width / 2 -
        (knifeRect.left +
        knifeRect.width / 2);

    const targetY =
        cakeRect.top +
        cakeRect.height * .45 -
        (knifeRect.top +
        knifeRect.height / 2);


    knifeButton.style.transform =
        `translate(${targetX}px, ${targetY}px) rotate(-7deg)`;


    await wait(850);


    /*
        Le couteau est maintenant
        arrivé devant le gâteau.
    */

    knifeButton.style.opacity = "0";

    await wait(180);


    /*
        On affiche le mot de passe.
    */

    mainScene.style.transition =
        "opacity .4s ease";

    mainScene.style.opacity = "0";

    await wait(400);

    mainScene.style.display = "none";

    passwordScreen.style.display = "flex";

    requestAnimationFrame(() => {

        passwordScreen.style.transition =
            "opacity .45s ease";

        passwordScreen.style.opacity = "1";

    });

    passwordOpened = true;

    passwordInput.focus();

});


/* =========================================
   VALIDATION
========================================= */

validateButton.addEventListener(
    "click",
    checkPassword
);


passwordInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            checkPassword();
        }

    }
);


function checkPassword() {

    if (!passwordOpened || cutting) {
        return;
    }

    const entered =
        passwordInput.value
            .trim()
            .replace(/\s/g, "");

    if (entered === PASSWORD) {

        correctPassword();

    } else {

        wrongPassword();

    }

}


/* =========================================
   BON MOT DE PASSE
========================================= */

async function correctPassword() {

    cutting = true;

    passwordScreen.style.opacity = "0";

    await wait(450);

    passwordScreen.style.display = "none";

    mainScene.style.display = "flex";
    mainScene.style.opacity = "1";

    /*
        Le gâteau revient.
    */

    cakeArea.classList.add("ready-to-cut");

    /*
        On fait apparaître le couteau
        directement au-dessus du gâteau.
    */

    knifeButton.style.opacity = "1";

    knifeButton.style.transition =
        "none";

    knifeButton.style.transform =
        "translate(-50px, -10px) rotate(-8deg)";

    /*
        Petite pause dramatique.
    */

    await wait(500);


    /*
        LE COUTEAU DESCEND
        ET COUPE LE GÂTEAU.
    */

    knifeButton.style.transition =
        "transform .65s cubic-bezier(.2,.8,.2,1)";

    knifeButton.style.transform =
        "translate(-50px, 85px) rotate(-8deg)";


    await wait(500);


    /*
        Coupe du gâteau.
    */

    cake.classList.add("cutting");


    await wait(750);


    /*
        Le couteau quitte la scène.
    */

    knifeButton.style.transition =
        "transform .45s ease, opacity .35s ease";

    knifeButton.style.transform =
        "translate(-50px, 170px) rotate(-8deg)";

    knifeButton.style.opacity = "0";


    await wait(250);


    /*
        La lettre apparaît.
    */

    letter.classList.add("open");


    await wait(1200);


    /*
        Musique.
    */

    music.volume = 0.8;

    music.play().catch(() => {
        /*
            Certains navigateurs peuvent bloquer
            l'autoplay. Le clic initial de l'utilisateur
            permet normalement la lecture.
        */
    });

}


/* =========================================
   MAUVAIS MOT DE PASSE
========================================= */

async function wrongPassword() {

    passwordError.style.display = "block";

    passwordInput.animate(
        [
            {
                transform: "translateX(0)"
            },
            {
                transform: "translateX(-9px)"
            },
            {
                transform: "translateX(9px)"
            },
            {
                transform: "translateX(-6px)"
            },
            {
                transform: "translateX(6px)"
            },
            {
                transform: "translateX(0)"
            }
        ],
        {
            duration: 320,
            easing: "ease-out"
        }
    );


    await wait(550);


    /*
        On cache le mot de passe.
    */

    passwordScreen.style.opacity = "0";

    await wait(350);

    passwordScreen.style.display = "none";

    /*
        Écran du couteau cassé.
    */

    wrongScreen.style.display = "flex";

    wrongScreen.animate(
        [
            {
                opacity: 0
            },
            {
                opacity: 1
            }
        ],
        {
            duration: 350,
            fill: "forwards"
        }
    );

}


/* =========================================
   RÉESSAYER
========================================= */

retryButton.addEventListener(
    "click",
    () => {

        wrongScreen.style.display = "none";

        passwordScreen.style.display = "flex";

        passwordScreen.style.opacity = "1";

        passwordInput.value = "";

        passwordError.style.display = "none";

        passwordInput.focus();

    }
);


/* =========================================
   EMPÊCHER LES ESPACES
========================================= */

passwordInput.addEventListener(
    "input",
    () => {

        passwordInput.value =
            passwordInput.value
                .replace(/\s/g, "");

    }
);