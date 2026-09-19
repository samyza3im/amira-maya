const birthdayScene = document.getElementById("birthdayScene");
const passwordScreen = document.getElementById("passwordScreen");
const successScreen = document.getElementById("successScreen");
const wrongScreen = document.getElementById("wrongScreen");

const knifeButton = document.getElementById("knifeButton");
const cutButton = document.getElementById("cutButton");
const retryButton = document.getElementById("retryButton");

const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");

const musicButton = document.getElementById("musicButton");
const birthdayMusic = document.getElementById("birthdayMusic");


// =====================================
// MOT DE PASSE
// =====================================

// TEMPORAIRE
// Remplace "DATE" par la vraie date.
// Exemple : "2109" pour le 21 septembre.

const PASSWORD = "DATE";


// =====================================
// LE COUTEAU
// =====================================

knifeButton.addEventListener("click", () => {

    knifeButton.style.pointerEvents = "none";

    const knife = knifeButton.querySelector(".knife");

    knife.style.transition = "1s cubic-bezier(.2,.8,.2,1)";
    knife.style.transform = "translate(-190px, -80px) rotate(-10deg)";

    setTimeout(() => {

        birthdayScene.style.opacity = "0";
        birthdayScene.style.transform = "scale(1.03)";

        setTimeout(() => {

            birthdayScene.style.display = "none";
            passwordScreen.style.display = "flex";

            passwordScreen.animate(
                [
                    {
                        opacity: 0,
                        transform: "scale(.96)"
                    },
                    {
                        opacity: 1,
                        transform: "scale(1)"
                    }
                ],
                {
                    duration: 450,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );

            passwordInput.focus();

        }, 350);

    }, 800);

});


// =====================================
// VERIFICATION
// =====================================

function checkPassword() {

    const value = passwordInput.value.trim();

    if (value === PASSWORD) {
        openCake();
    } else {
        breakCake();
    }

}


// =====================================
// BON MOT DE PASSE
// =====================================

function openCake() {

    passwordScreen.style.display = "none";

    successScreen.style.display = "flex";

    successScreen.animate(
        [
            {
                opacity: 0
            },
            {
                opacity: 1
            }
        ],
        {
            duration: 500,
            easing: "ease-out",
            fill: "forwards"
        }
    );

    createCelebration();

    // Lance la musique après l'interaction utilisateur
    birthdayMusic.play().catch(() => {});
}


// =====================================
// MAUVAIS MOT DE PASSE
// =====================================

function breakCake() {

    errorMessage.style.display = "block";

    passwordInput.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(-8px)" },
            { transform: "translateX(8px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(0)" }
        ],
        {
            duration: 280
        }
    );

    setTimeout(() => {

        passwordScreen.style.display = "none";
        wrongScreen.style.display = "flex";

        wrongScreen.animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 300,
                fill: "forwards"
            }
        );

    }, 500);

}


// =====================================
// REESSAYER
// =====================================

retryButton.addEventListener("click", () => {

    wrongScreen.style.display = "none";
    passwordScreen.style.display = "flex";

    passwordInput.value = "";
    errorMessage.style.display = "none";

    passwordInput.focus();

});


// =====================================
// ENTER = VALIDER
// =====================================

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        checkPassword();
    }

});

cutButton.addEventListener("click", checkPassword);


// =====================================
// MUSIQUE
// =====================================

musicButton.addEventListener("click", () => {

    if (birthdayMusic.paused) {

        birthdayMusic.play();
        musicButton.textContent = "Mettre la musique en pause";

    } else {

        birthdayMusic.pause();
        musicButton.textContent = "Écouter la musique";

    }

});


// =====================================
// PETITES PARTICULES
// =====================================

function createCelebration() {

    for (let i = 0; i < 35; i++) {

        const particle = document.createElement("div");

        particle.style.position = "fixed";
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.width = Math.random() * 5 + 2 + "px";
        particle.style.height = particle.style.width;
        particle.style.borderRadius = "50%";
        particle.style.background = "rgba(215,176,106,.8)";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "100";

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 350;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.animate(
            [
                {
                    transform: "translate(-50%, -50%) scale(1)",
                    opacity: 1
                },
                {
                    transform: `translate(${x}px, ${y}px) scale(0)`,
                    opacity: 0
                }
            ],
            {
                duration: 900 + Math.random() * 500,
                easing: "cubic-bezier(.2,.8,.2,1)"
            }
        );

        setTimeout(() => {
            particle.remove();
        }, 1500);
    }

}